-- ============================================================
-- MIGRATION 014: Fix Idempotency and Dynamic Thresholds
-- ============================================================

-- 1. Create global_settings table for dynamic system-wide configuration
CREATE TABLE IF NOT EXISTS global_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE global_settings IS 'Global system settings, e.g. default thresholds.';

-- Insert default thresholds if not exist
INSERT INTO global_settings (key, value)
VALUES (
    'ledger_thresholds',
    '{"multisig_threshold": 5000000, "multisig_high_threshold": 50000000}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 2. Add idempotency_key to multisig_requests
ALTER TABLE multisig_requests
  ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE;

-- 3. Refactor process_ledger_entry
CREATE OR REPLACE FUNCTION process_ledger_entry(
  p_community_id    UUID,
  p_actor_id        UUID,
  p_tender_id       UUID,
  p_amount          DECIMAL(15,2),
  p_direction       TEXT,
  p_entry_type      TEXT,
  p_description     TEXT,
  p_idempotency_key UUID
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_existing_id   UUID;
  v_new_id        UUID;
  v_msig_id       UUID;
  v_settings      JSONB;
  v_global_thresh JSONB;
  v_msig_threshold DECIMAL;
  v_high_threshold DECIMAL;
BEGIN
  -- A. Idempotency check: kembalikan entri yang ada jika kunci idempotency sudah terpakai
  -- Periksa tabel ledger
  SELECT id INTO v_existing_id FROM ledger WHERE idempotency_key = p_idempotency_key;
  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'status', 'success',
      'ledger_id', v_existing_id,
      'message', 'Duplicate request detected via idempotency key. Returned original ledger entry.'
    );
  END IF;

  -- Periksa tabel multisig_requests
  SELECT id INTO v_existing_id FROM multisig_requests WHERE idempotency_key = p_idempotency_key;
  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'status', 'multisig_required',
      'multisig_id', v_existing_id,
      'message', 'Duplicate request detected via idempotency key. Returned original multisig entry.'
    );
  END IF;

  -- B. Validasi nilai transaksi
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', 'VALIDATION_ERROR: Amount must be positive.'
    );
  END IF;

  -- C. Verifikasi ambang batas Multi-Sig
  -- Ambil dari pengaturan komunitas
  SELECT settings INTO v_settings FROM communities WHERE id = p_community_id;
  
  -- Ambil nilai fallback dari global_settings
  SELECT value INTO v_global_thresh FROM global_settings WHERE key = 'ledger_thresholds';
  
  v_msig_threshold := COALESCE(
    (v_settings->>'multisig_threshold')::decimal, 
    (v_global_thresh->>'multisig_threshold')::decimal,
    5000000
  );
  v_high_threshold := COALESCE(
    (v_settings->>'multisig_high_threshold')::decimal, 
    (v_global_thresh->>'multisig_high_threshold')::decimal,
    50000000
  );

  IF p_amount >= v_msig_threshold THEN
    -- Masukkan ke antrean multisig_requests
    INSERT INTO multisig_requests (
      community_id, 
      tender_id, 
      amount, 
      requested_by,
      required_sigs, 
      expires_at,
      idempotency_key
    ) VALUES (
      p_community_id, 
      p_tender_id, 
      p_amount, 
      p_actor_id,
      CASE WHEN p_amount >= v_high_threshold THEN 3 ELSE 2 END,
      NOW() + INTERVAL '24 hours',
      p_idempotency_key
    ) RETURNING id INTO v_msig_id;

    RETURN jsonb_build_object(
      'status', 'multisig_required',
      'multisig_id', v_msig_id,
      'required_sigs', CASE WHEN p_amount >= v_high_threshold THEN 3 ELSE 2 END,
      'message', 'Transaction amount meets or exceeds threshold. Multi-sig request created successfully.'
    );
  END IF;

  -- D. Posting langsung ke Ledger (di bawah ambang batas)
  INSERT INTO ledger (
    community_id, 
    actor_id, 
    tender_id, 
    amount,
    direction, 
    entry_type, 
    description, 
    idempotency_key
  ) VALUES (
    p_community_id, 
    p_actor_id, 
    p_tender_id, 
    p_amount,
    p_direction, 
    p_entry_type, 
    p_description, 
    p_idempotency_key
  ) RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'status', 'success',
    'ledger_id', v_new_id,
    'message', 'Transaction successfully committed to ledger.'
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Fallback jika terjadi race condition tepat saat insert
    RETURN jsonb_build_object(
      'status', 'conflict',
      'message', 'Duplicate idempotency key inserted by concurrent transaction.'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', SQLERRM
    );
END;
$$;
