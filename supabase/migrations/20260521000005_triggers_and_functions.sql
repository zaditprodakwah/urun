-- ============================================================
-- MIGRATION 005: Triggers & RPC Functions
-- Sacred Rule #2: Ledger Immutability (ENFORCED IN DB)
-- Collective Efficiency: 70/30 auto-split trigger
-- Reputation Engine: Deterministic scoring
-- ============================================================

-- ============================================================
-- TRIGGER 1: Ledger Immutability Guard
-- Sacred Rule #2: Even a superuser cannot UPDATE/DELETE ledger.
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_ledger_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'SACRED_RULE_VIOLATION: Ledger entries are IMMUTABLE. '
      'To correct an error, INSERT a new entry with entry_type=''correction'' '
      'and ref_id pointing to the erroneous entry. '
      'Attempted UPDATE on ledger id: %', OLD.id;
  END IF;
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'SACRED_RULE_VIOLATION: Ledger entries cannot be DELETED. '
      'They are the community''s financial truth. '
      'Attempted DELETE on ledger id: %', OLD.id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER ledger_immutability_guard
  BEFORE UPDATE OR DELETE ON ledger
  FOR EACH ROW
  EXECUTE FUNCTION prevent_ledger_mutation();

-- ============================================================
-- TRIGGER 2: Auto-split Revenue (70% community / 30% URUN)
-- Pillar #2: Collective Efficiency — surplus stays in community.
-- Fires AFTER INSERT on ledger where entry_type = 'tender_settlement'
--
-- SPECIAL TAXONOMY EXCEPTION: URUN Peduli (Emergency Fund)
-- MUST bypass this split (100% goes to treasury, 0% platform fee).
-- URUN Peduli is identified by catalog_item metadata 'is_peduli' or
-- ledger details or tender metadata 'is_peduli'. Let's read
-- catalog_item and tender metadata to make sure!
-- ============================================================
CREATE OR REPLACE FUNCTION auto_split_platform_revenue()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_settings          JSONB;
  v_platform_fee_pct  DECIMAL := 30;
  v_community_pct     DECIMAL := 70;
  v_platform_amount   DECIMAL(15,2);
  v_community_amount  DECIMAL(15,2);
  v_is_peduli         BOOLEAN := FALSE;
BEGIN
  -- Only apply to tender_settlement entries
  IF NEW.entry_type != 'tender_settlement' THEN
    RETURN NEW;
  END IF;

  -- Verify if the tender or catalog_item is "URUN Peduli" (bypass 30% fee)
  IF NEW.tender_id IS NOT NULL THEN
    SELECT COALESCE((metadata->>'is_peduli')::boolean, FALSE)
    INTO v_is_peduli FROM tenders WHERE id = NEW.tender_id;
  ELSIF NEW.catalog_item_id IS NOT NULL THEN
    SELECT COALESCE((metadata->>'is_peduli')::boolean, FALSE)
    INTO v_is_peduli FROM catalog_items WHERE id = NEW.catalog_item_id;
  END IF;

  -- Fetch community settings
  SELECT settings INTO v_settings FROM communities WHERE id = NEW.community_id;
  
  IF v_is_peduli THEN
    -- URUN Peduli bypasses operational revenue, 100% stays in community
    v_platform_fee_pct := 0;
    v_community_pct    := 100;
  ELSE
    v_platform_fee_pct := COALESCE((v_settings->>'platform_fee_pct')::decimal, 30);
    v_community_pct    := COALESCE((v_settings->>'community_share_pct')::decimal, 70);
  END IF;

  -- Calculate split
  v_platform_amount  := ROUND(NEW.amount * v_platform_fee_pct / 100, 2);
  v_community_amount := NEW.amount - v_platform_amount;  -- Avoid rounding loss

  -- Insert platform revenue entry (if fee is > 0)
  IF v_platform_amount > 0 THEN
    INSERT INTO ledger (
      community_id, actor_id, tender_id, amount,
      direction, entry_type, ref_id, description, idempotency_key
    ) VALUES (
      NEW.community_id, NEW.actor_id, NEW.tender_id, v_platform_amount,
      'out', 'platform_revenue', NEW.id,
      'Platform operational fee (' || v_platform_fee_pct || '% split from tender_settlement)',
      gen_random_uuid()
    );
  END IF;

  -- Insert community share entry (70% or 100% for URUN Peduli)
  INSERT INTO ledger (
    community_id, actor_id, tender_id, amount,
    direction, entry_type, ref_id, description, idempotency_key
  ) VALUES (
    NEW.community_id, NEW.actor_id, NEW.tender_id, v_community_amount,
    'in', 'community_share', NEW.id,
    CASE 
      WHEN v_is_peduli THEN 'Dana Gotong Royong URUN Peduli disalurkan penuh (100%)'
      ELSE 'Community treasury share (' || v_community_pct || '% split from tender_settlement)'
    END,
    gen_random_uuid()
  );

  -- Log to audit trail
  INSERT INTO audit_log (community_id, actor_id, action, table_affected, new_value, reason)
  VALUES (
    NEW.community_id, NULL, 'auto_revenue_split', 'ledger',
    jsonb_build_object(
      'source_ledger_id', NEW.id,
      'platform_amount', v_platform_amount,
      'community_amount', v_community_amount,
      'is_peduli', v_is_peduli,
      'split_pct', jsonb_build_object('platform', v_platform_fee_pct, 'community', v_community_pct)
    ),
    CASE 
      WHEN v_is_peduli THEN 'Automatic 100% community delivery for URUN Peduli'
      ELSE 'Automatic 70/30 revenue split triggered by tender_settlement entry'
    END
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER ledger_auto_revenue_split
  AFTER INSERT ON ledger
  FOR EACH ROW
  EXECUTE FUNCTION auto_split_platform_revenue();

-- ============================================================
-- TRIGGER 3: Reputation Engine (Deterministic Scoring)
-- Sacred Rule #4: Same event = same points, ALWAYS.
-- Fires AFTER INSERT on interaction_log.
-- ============================================================
CREATE OR REPLACE FUNCTION update_reputation_deterministic()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_delta INT := 0;
  v_reason TEXT;
BEGIN
  -- Deterministic point table (from 22_algorithm_spec.md + 50_growth_engine.md)
  CASE NEW.action_type
    WHEN 'tender_contribution_paid'   THEN v_delta := 5;  v_reason := 'Transaksi URUN Dana selesai dibayar';
    WHEN 'tender_participation'       THEN v_delta := 3;  v_reason := 'Berpartisipasi dalam Tender Warga';
    WHEN 'successful_referral'        THEN v_delta := 2;  v_reason := 'Referral membawa anggota baru bertransaksi';
    WHEN 'violation_detected'         THEN v_delta := -10; v_reason := 'Pelanggaran terdeteksi oleh sistem';
    WHEN 'fraud_attempt'              THEN v_delta := -15; v_reason := 'Percobaan fraud terdeteksi';
    ELSE v_delta := 0;  -- Unknown events do NOT affect reputation
  END CASE;

  -- No-op if delta is 0
  IF v_delta = 0 THEN
    RETURN NEW;
  END IF;

  -- Update reputation with floor constraint (min 0)
  UPDATE community_members
  SET reputation_score = GREATEST(0, reputation_score + v_delta)
  WHERE id = NEW.actor_id;

  -- Log the reputation change for auditability
  INSERT INTO audit_log (community_id, actor_id, action, table_affected, new_value, reason)
  VALUES (
    NEW.community_id, NEW.actor_id,
    'reputation_change', 'community_members',
    jsonb_build_object('delta', v_delta, 'action_trigger', NEW.action_type),
    v_reason
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER reputation_engine_trigger
  AFTER INSERT ON interaction_log
  FOR EACH ROW
  EXECUTE FUNCTION update_reputation_deterministic();

-- ============================================================
-- RPC FUNCTION: process_ledger_entry (Safe Insert Gateway)
-- All ledger writes MUST go through this function.
-- ============================================================
CREATE OR REPLACE FUNCTION process_ledger_entry(
  p_community_id    UUID,
  p_actor_id        UUID,      -- community_members.id
  p_tender_id       UUID,
  p_amount          DECIMAL(15,2),
  p_direction       TEXT,
  p_entry_type      TEXT,
  p_description     TEXT,
  p_idempotency_key UUID
)
RETURNS UUID    -- Returns new ledger.id
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_existing_id   UUID;
  v_new_id        UUID;
  v_settings      JSONB;
  v_msig_threshold DECIMAL;
  v_high_threshold DECIMAL;
BEGIN
  -- 1. Idempotency check: return existing entry if key already used
  SELECT id INTO v_existing_id FROM ledger WHERE idempotency_key = p_idempotency_key;
  IF v_existing_id IS NOT NULL THEN
    RETURN v_existing_id;  -- Safe to return — same key = same entry
  END IF;

  -- 2. Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'VALIDATION_ERROR: Amount must be positive. Got: %', p_amount;
  END IF;

  -- 3. Multi-sig check
  SELECT settings INTO v_settings FROM communities WHERE id = p_community_id;
  v_msig_threshold := COALESCE((v_settings->>'multisig_threshold')::decimal, 5000000);
  v_high_threshold := COALESCE((v_settings->>'multisig_high_threshold')::decimal, 50000000);

  IF p_amount >= v_msig_threshold THEN
    -- Create multisig request instead of direct ledger entry
    INSERT INTO multisig_requests (
      community_id, tender_id, amount, requested_by,
      required_sigs, expires_at
    ) VALUES (
      p_community_id, p_tender_id, p_amount, p_actor_id,
      CASE WHEN p_amount >= v_high_threshold THEN 3 ELSE 2 END,
      NOW() + INTERVAL '72 hours'
    );
    RAISE EXCEPTION 'MULTISIG_REQUIRED: Transaction amount % IDR requires multi-sig approval. '
      'A request has been created and signers have been notified.', p_amount;
  END IF;

  -- 4. Insert ledger entry
  INSERT INTO ledger (
    community_id, actor_id, tender_id, amount,
    direction, entry_type, description, idempotency_key
  ) VALUES (
    p_community_id, p_actor_id, p_tender_id, p_amount,
    p_direction, p_entry_type, p_description, p_idempotency_key
  ) RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$;

-- ============================================================
-- RPC FUNCTION: insert_correction_entry
-- Sacred Rule #2: Corrections only via new entries, never UPDATE.
-- ============================================================
CREATE OR REPLACE FUNCTION insert_correction_entry(
  p_original_ledger_id UUID,
  p_reason             TEXT,
  p_actor_id           UUID
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_original RECORD;
  v_new_id   UUID;
BEGIN
  -- Fetch original entry
  SELECT * INTO v_original FROM ledger WHERE id = p_original_ledger_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CORRECTION_ERROR: Original ledger entry not found: %', p_original_ledger_id;
  END IF;

  -- Validate actor is in the same community
  IF NOT auth_is_member_of(v_original.community_id) THEN
    RAISE EXCEPTION 'AUTHORIZATION_ERROR: Cannot correct entry from another community.';
  END IF;

  -- Insert reversal entry (opposite direction, same amount)
  INSERT INTO ledger (
    community_id, actor_id, tender_id, amount,
    direction, entry_type, ref_id, description, idempotency_key
  ) VALUES (
    v_original.community_id, p_actor_id, v_original.tender_id, v_original.amount,
    CASE WHEN v_original.direction = 'in' THEN 'out' ELSE 'in' END,
    'correction',
    p_original_ledger_id,
    'KOREKSI (Correction Reversal): ' || p_reason,
    gen_random_uuid()
  ) RETURNING id INTO v_new_id;

  -- Log to audit
  INSERT INTO audit_log (community_id, actor_id, action, table_affected, new_value, reason)
  VALUES (
    v_original.community_id, p_actor_id, 'ledger_correction', 'ledger',
    jsonb_build_object('original_id', p_original_ledger_id, 'correction_id', v_new_id),
    p_reason
  );

  RETURN v_new_id;
END;
$$;

-- ============================================================
-- Tender deadline enforcement trigger
-- ============================================================
CREATE OR REPLACE FUNCTION auto_expire_past_deadline()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.deadline < NOW() AND OLD.current_state IN ('published', 'subscribing') THEN
    NEW.current_state := 'expired';
    NEW.updated_at := NOW();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tender_deadline_check
  BEFORE UPDATE ON tenders
  FOR EACH ROW
  EXECUTE FUNCTION auto_expire_past_deadline();
