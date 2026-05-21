-- ============================================================
-- MIGRATION 001: Core Schema
-- URUN Phase 1 - Sovereign Core Foundation
-- Pillar Test: ✅ Data Stewardship (community_id isolation)
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE 1: profiles (Global User Identity)
-- Tidak memiliki community_id — ini tabel identitas global.
-- RLS: User hanya bisa lihat/edit profile miliknya sendiri.
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT UNIQUE,                 -- Untuk WhatsApp integration
  avatar_url  TEXT,
  consent_timestamp   TIMESTAMPTZ,         -- UU PDP: kapan user setujui PP
  consent_version     TEXT,                -- Versi Privacy Policy yang disetujui
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE profiles IS
  'Global user identity. One user can belong to multiple communities via community_members.';

-- ============================================================
-- TABLE 2: communities (Root Tenant)
-- Setiap komunitas = satu tenant yang terisolasi.
-- ============================================================
CREATE TABLE IF NOT EXISTS communities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  geo_context JSONB DEFAULT '{
    "province": null, "regency": null,
    "district": null, "village": null,
    "coordinates": {"lat": null, "lng": null}
  }'::jsonb,
  settings    JSONB DEFAULT '{
    "multisig_threshold": 5000000,
    "multisig_high_threshold": 50000000,
    "platform_fee_pct": 30,
    "community_share_pct": 70,
    "revenue_destination_account": null,
    "mode": "normal"
  }'::jsonb,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE communities IS
  'Root tenant table. Each community is an isolated data silo.
   settings.multisig_threshold: IDR amount requiring multi-sig (default 5jt).
   settings.platform_fee_pct: % going to URUN operations (default 30).
   settings.mode: "normal" | "manual" (for graceful degradation).';

-- ============================================================
-- TABLE 3: community_members (Join Table + RBAC)
-- Ini adalah "paspor" akses seorang user ke komunitas.
-- permissions JSONB menyimpan fine-grained RBAC.
-- reputation_score bersifat LOKAL per komunitas.
-- ============================================================
CREATE TABLE IF NOT EXISTS community_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'warga'
                  CONSTRAINT role_check CHECK (role IN ('warga', 'pengurus', 'admin')),
  permissions     JSONB NOT NULL DEFAULT '{
    "can_create_tender": false,
    "can_approve_multisig": false,
    "is_treasurer": false,
    "is_witness": false,
    "can_manage_catalog": false,
    "can_export_data": false
  }'::jsonb,
  reputation_score INT NOT NULL DEFAULT 10
                   CONSTRAINT reputation_floor CHECK (reputation_score >= 0),
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (community_id, profile_id)           -- Satu user, satu entry per komunitas
);
COMMENT ON TABLE community_members IS
  'Join table mapping users to communities with local RBAC and reputation.
   permissions: {"can_create_tender": bool, "is_treasurer": bool, ...}
   reputation_score: Local to this community. Floor=0, Start=10.';

-- ============================================================
-- TABLE 4: catalog_items (Polymorphic — SEO/AEO Ready)
-- ============================================================
CREATE TABLE IF NOT EXISTS catalog_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id  UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  created_by    UUID NOT NULL REFERENCES community_members(id),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  item_type     TEXT NOT NULL
                CONSTRAINT item_type_check CHECK (item_type IN ('product', 'service', 'asset')),
  status        TEXT NOT NULL DEFAULT 'active'
                CONSTRAINT status_check CHECK (status IN ('public', 'private', 'active', 'archived')),
  metadata      JSONB NOT NULL DEFAULT '{}',  -- Schema.org data, pricing, stock
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE catalog_items IS
  'Universal polymorphic catalog. status=public enables SEO crawler access.
   metadata stores Schema.org fields for JSON-LD generation.';

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_community_members_community ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_profile   ON community_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_community     ON catalog_items(community_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_status        ON catalog_items(status);
