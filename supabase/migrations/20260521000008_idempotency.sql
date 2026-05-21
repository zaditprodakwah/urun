-- ============================================================
-- MIGRATION 008: Idempotency Keys
-- URUN Phase 8 - Admin Dashboard & M&E Ecosystem
-- ============================================================

CREATE TABLE IF NOT EXISTS idempotency_keys (
  idempotency_key UUID PRIMARY KEY,
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  request_path    TEXT NOT NULL,
  response_body   JSONB,
  response_status INT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX IF NOT EXISTS idx_idempotency_community ON idempotency_keys(community_id);
CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON idempotency_keys(expires_at);

-- Add cleanup function to remove expired keys
CREATE OR REPLACE FUNCTION cleanup_expired_idempotency_keys()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM idempotency_keys WHERE expires_at < NOW();
END;
$$;
