-- ============================================================
-- MIGRATION 002: Tenders & Workflow State Machines
-- ============================================================

-- ============================================================
-- TABLE 5: tenders (Collective Procurement — THE Killer App)
-- State: DRAFT → PUBLISHED → SUBSCRIBING → CLOSED →
--        FULFILLED → SETTLED | EXPIRED | DISPUTE
-- ============================================================
CREATE TABLE IF NOT EXISTS tenders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id      UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  catalog_item_id   UUID REFERENCES catalog_items(id) ON DELETE SET NULL,
  created_by        UUID NOT NULL REFERENCES community_members(id),
  title             TEXT NOT NULL,
  description       TEXT,
  target_quantity   INT NOT NULL CHECK (target_quantity > 0),
  min_quantity      INT NOT NULL CHECK (min_quantity > 0),
  unit_price_target DECIMAL(15,2),           -- Harga target negosiasi
  current_state     TEXT NOT NULL DEFAULT 'draft'
                    CONSTRAINT tender_state_check CHECK (current_state IN (
                      'draft', 'published', 'subscribing', 'closed',
                      'fulfilled', 'settled', 'expired', 'dispute'
                    )),
  deadline          TIMESTAMPTZ NOT NULL,    -- Kolom fisik, bukan JSONB
  supplier_info     JSONB DEFAULT '{}',      -- Info vendor/supplier
  metadata          JSONB DEFAULT '{}',      -- Flexible additional data
  idempotency_key   UUID UNIQUE DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE tenders IS
  'Collective Procurement state machine. THE core feature of URUN.
   Only treasurer (permissions->is_treasurer=true) can create/publish.
   deadline is a physical column for cron job queries (not in JSONB).';

-- ============================================================
-- TABLE 6: tender_subscriptions (Warga ikut tender)
-- ============================================================
CREATE TABLE IF NOT EXISTS tender_subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id       UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  member_id       UUID NOT NULL REFERENCES community_members(id),
  quantity        INT NOT NULL CHECK (quantity > 0),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CONSTRAINT sub_status_check CHECK (status IN (
                    'pending', 'confirmed', 'paid', 'cancelled'
                  )),
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tender_id, member_id)              -- Satu warga, satu subscription per tender
);

-- ============================================================
-- TABLE 7: ledger (Append-Only Financial Record)
-- SACRED RULE #2: NO UPDATE, NO DELETE. EVER.
-- actor_id merujuk ke community_members (bukan profiles)
-- untuk menjaga konteks komunitas selalu ada.
-- ============================================================
CREATE TABLE IF NOT EXISTS ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE RESTRICT,
  actor_id        UUID NOT NULL REFERENCES community_members(id) ON DELETE RESTRICT,
  tender_id       UUID REFERENCES tenders(id) ON DELETE RESTRICT,
  catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE RESTRICT,
  amount          DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  direction       TEXT NOT NULL CONSTRAINT direction_check CHECK (direction IN ('in', 'out')),
  entry_type      TEXT NOT NULL CONSTRAINT entry_type_check CHECK (entry_type IN (
                    'tender_contribution',   -- Warga bayar ke tender
                    'tender_settlement',     -- Pembayaran final ke supplier
                    'platform_revenue',      -- 30% ke URUN operations
                    'community_share',       -- 70% ke kas komunitas
                    'correction',            -- Entri koreksi (reversal)
                    'iuran',                 -- Iuran rutin komunitas
                    'penalty',               -- Penalti pelanggaran
                    'refund'                 -- Pengembalian dana
                  )),
  ref_id          UUID,                     -- Referensi ke entry asal (untuk correction)
  description     TEXT,                     -- Narasi singkat untuk warga
  idempotency_key UUID UNIQUE NOT NULL,     -- Sacred Rule: cegah duplikasi
  multisig_status TEXT DEFAULT 'not_required'
                  CONSTRAINT multisig_check CHECK (multisig_status IN (
                    'not_required', 'pending_approval', 'approved', 'rejected', 'expired'
                  )),
  created_at      TIMESTAMPTZ DEFAULT NOW()
  -- TIDAK ADA updated_at — ledger tidak pernah diupdate
);
COMMENT ON TABLE ledger IS
  'APPEND-ONLY financial record. Sacred Rule #2: NO UPDATE, NO DELETE.
   Use entry_type=correction with ref_id pointing to wrong entry for fixes.
   idempotency_key prevents duplicate entries on network retry.
   ON DELETE RESTRICT on community_id prevents accidental community deletion.';

-- ============================================================
-- TABLE 8: workflow_processes (General State Machine)
-- Untuk proses non-financial: approval, laporan, dll.
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_processes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  initiated_by    UUID NOT NULL REFERENCES community_members(id),
  process_type    TEXT NOT NULL,           -- 'tender_approval', 'data_export', dll
  related_id      UUID,                   -- FK ke tenders/ledger/catalog_items
  current_state   TEXT NOT NULL DEFAULT 'requested',
  context         JSONB NOT NULL DEFAULT '{}',
  last_updated    TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_tenders_community      ON tenders(community_id);
CREATE INDEX IF NOT EXISTS idx_tenders_state          ON tenders(current_state);
CREATE INDEX IF NOT EXISTS idx_tenders_deadline       ON tenders(deadline);
CREATE INDEX IF NOT EXISTS idx_ledger_community       ON ledger(community_id);
CREATE INDEX IF NOT EXISTS idx_ledger_actor           ON ledger(actor_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entry_type      ON ledger(entry_type);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at      ON ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tender_subs_tender     ON tender_subscriptions(tender_id);
