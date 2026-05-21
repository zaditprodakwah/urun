-- ============================================================
-- MIGRATION 010: Affiliate Ledger & Stored Procedure
-- Pillar Test: ✅ Data Stewardship (community_id isolation)
-- ============================================================

-- 1. Add metadata column to ledger table if not exists
ALTER TABLE ledger ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Create the RPC function process_affiliate_commission
CREATE OR REPLACE FUNCTION process_affiliate_commission(
  p_idempotency_key       UUID,
  p_community_id          UUID,
  p_actor_id              UUID,
  p_catalog_item_id       UUID,
  p_platform_fee          DECIMAL(15,2),
  p_community_share       DECIMAL(15,2),
  p_description           TEXT,
  p_metadata              JSONB
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_existing_status       INT;
  v_existing_body         JSONB;
  v_community_ledger_id   UUID;
  v_platform_ledger_id    UUID;
  v_platform_idem_key     UUID;
BEGIN
  -- A. Idempotency Check & Lock
  -- Attempt to insert the idempotency key to register this request
  INSERT INTO idempotency_keys (idempotency_key, community_id, request_path)
  VALUES (p_idempotency_key, p_community_id, '/api/v1/affiliate/callback')
  ON CONFLICT (idempotency_key) DO NOTHING;

  -- Select the key with FOR UPDATE to block concurrent requests and ensure atomicity
  SELECT response_status, response_body
  INTO v_existing_status, v_existing_body
  FROM idempotency_keys
  WHERE idempotency_key = p_idempotency_key
  FOR UPDATE;

  -- If response_status is NOT NULL, this is a hit (duplicate request already processed)
  IF v_existing_status IS NOT NULL THEN
    RETURN jsonb_build_object(
      'status', 'hit',
      'response_status', v_existing_status,
      'response_body', v_existing_body
    );
  END IF;

  -- B. Derived Idempotency Key for Platform Fee Entry
  -- Convert MD5 hash of (idempotency_key + '-platform') into a deterministic UUID
  v_platform_idem_key := CAST(md5(p_idempotency_key::text || '-platform') AS uuid);

  -- C. Insert community_share (Inbound) into Ledger
  INSERT INTO ledger (
    community_id,
    actor_id,
    catalog_item_id,
    amount,
    direction,
    entry_type,
    description,
    idempotency_key,
    multisig_status,
    metadata
  ) VALUES (
    p_community_id,
    p_actor_id,
    p_catalog_item_id,
    p_community_share,
    'in',
    'community_share',
    p_description,
    p_idempotency_key,
    'not_required',
    p_metadata
  ) RETURNING id INTO v_community_ledger_id;

  -- D. Insert platform_revenue (Outbound/Fee) into Ledger
  INSERT INTO ledger (
    community_id,
    actor_id,
    catalog_item_id,
    amount,
    direction,
    entry_type,
    ref_id,
    description,
    idempotency_key,
    multisig_status,
    metadata
  ) VALUES (
    p_community_id,
    p_actor_id,
    p_catalog_item_id,
    p_platform_fee,
    'out',
    'platform_revenue',
    v_community_ledger_id, -- Ref ID points to the community_share entry
    'Platform operational fee (30% split from affiliate link checkout)',
    v_platform_idem_key,
    'not_required',
    p_metadata
  ) RETURNING id INTO v_platform_ledger_id;

  -- E. Log to Audit Trail
  INSERT INTO audit_log (
    community_id,
    actor_id,
    action,
    table_affected,
    new_value,
    reason
  ) VALUES (
    p_community_id,
    p_actor_id,
    'affiliate_revenue_split',
    'ledger',
    jsonb_build_object(
      'community_ledger_id', v_community_ledger_id,
      'platform_ledger_id', v_platform_ledger_id,
      'community_share', p_community_share,
      'platform_fee', p_platform_fee,
      'source_tx_id', p_metadata->>'source_tx_id',
      'platform', p_metadata->>'platform'
    ),
    'Processed external affiliate commission with 70/30 split directly to ledger (bypassing multi-sig)'
  );

  -- Return successfully
  RETURN jsonb_build_object(
    'status', 'success',
    'community_ledger_id', v_community_ledger_id,
    'platform_ledger_id', v_platform_ledger_id
  );
EXCEPTION
  WHEN OTHERS THEN
    -- In PostgreSQL, any raised exception in PL/pgSQL automatically rolls back the current transaction
    RAISE EXCEPTION 'TRANSACTION_FAILED: %', SQLERRM;
END;
$$;
