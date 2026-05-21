-- ============================================================
-- MIGRATION 003: Audit & Interaction Logs
-- Sacred Rule #9 (from 20_rules_for_ai.md): Audit-First
-- No action goes unrecorded.
-- ============================================================

-- ============================================================
-- TABLE 9: interaction_log (User Activity Audit)
-- Tracks all significant user interactions for:
-- (a) reputation calculation, (b) fraud detection, (c) audit
-- ============================================================
CREATE TABLE IF NOT EXISTS interaction_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id  UUID NOT NULL REFERENCES communities(id) ON DELETE RESTRICT,
  actor_id      UUID NOT NULL REFERENCES community_members(id) ON DELETE RESTRICT,
  action_type   TEXT NOT NULL,  -- 'reputation_change', 'tender_join', 'login', dll
  action_detail JSONB DEFAULT '{}',
  source_system TEXT NOT NULL DEFAULT 'web_ui'
                CONSTRAINT source_check CHECK (source_system IN (
                  'web_ui', 'bot_wa', 'partner_app', 'system_auto', 'admin_manual'
                )),
  ip_hash       TEXT,           -- Hash dari IP (bukan raw IP), untuk fraud detection
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE interaction_log IS
  'Append-only user activity log. Used by reputation engine and fraud detection.
   ip_hash stores HASHED IP only (SHA256), never raw IP per Data Minimization rule.
   SACRED: actor_id=SYSTEM_AUTO for automated scripts (not impersonating humans).';

-- ============================================================
-- TABLE 10: audit_log (System & Algorithm Change Log)
-- Tracks all system-level changes: RLS updates, algorithm
-- constant changes, admin actions.
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id  UUID REFERENCES communities(id) ON DELETE RESTRICT,
  actor_id      UUID,                       -- NULL = system action
  action        TEXT NOT NULL,              -- 'rls_policy_updated', 'algo_constant_changed'
  table_affected TEXT,
  old_value     JSONB,
  new_value     JSONB,
  reason        TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE audit_log IS
  'System-level audit trail. Required by 31_compliance_log.md.
   Every algorithm constant change MUST have an entry here.
   Immutable by policy (no RLS UPDATE/DELETE).';

-- ============================================================
-- TABLE 11: multisig_requests (Multi-Sig Approval Queue)
-- Sacred Rule #5: Multi-sig enforced for large transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS multisig_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  ledger_ref_id   UUID REFERENCES ledger(id) ON DELETE RESTRICT,
  tender_id       UUID REFERENCES tenders(id) ON DELETE RESTRICT,
  amount          DECIMAL(15,2) NOT NULL,
  requested_by    UUID NOT NULL REFERENCES community_members(id),
  required_sigs   INT NOT NULL DEFAULT 2,
  current_sigs    INT NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CONSTRAINT msig_status_check CHECK (status IN (
                    'pending', 'approved', 'rejected', 'expired', 'cancelled'
                  )),
  approvals       JSONB DEFAULT '[]',        -- Array of {member_id, approved_at, signature}
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE multisig_requests IS
  'Sacred Rule #5: Transactions >= multisig_threshold require 2-of-3 approval.
   expires_at: auto-cancel if not approved within deadline.
   approvals JSONB tracks who signed and when.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_interaction_log_community ON interaction_log(community_id);
CREATE INDEX IF NOT EXISTS idx_interaction_log_actor     ON interaction_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_interaction_log_action    ON interaction_log(action_type);
CREATE INDEX IF NOT EXISTS idx_multisig_status           ON multisig_requests(status);
CREATE INDEX IF NOT EXISTS idx_multisig_community        ON multisig_requests(community_id);
