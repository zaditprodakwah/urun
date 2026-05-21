-- ============================================================
-- MIGRATION 004: Row-Level Security Policies
-- Sacred Rule #1: RLS at database level, NOT application code.
-- Even if the app has a bug, the database BLOCKS unauthorized access.
--
-- PHILOSOPHY: Default DENY everything. Explicitly ALLOW only
-- what is needed. Principle of Least Privilege.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities           ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger                ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_processes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_log       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log             ENABLE ROW LEVEL SECURITY;
ALTER TABLE multisig_requests     ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS: Access controls
-- ============================================================
CREATE OR REPLACE FUNCTION auth_member_community_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT community_id FROM community_members
  WHERE profile_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION auth_is_member_of(p_community_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM community_members
    WHERE profile_id = auth.uid()
    AND community_id = p_community_id
  );
$$;

CREATE OR REPLACE FUNCTION auth_has_permission(p_community_id UUID, p_permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(
    (SELECT (permissions->>p_permission)::boolean
     FROM community_members
     WHERE profile_id = auth.uid()
     AND community_id = p_community_id),
    FALSE
  );
$$;

-- ============================================================
-- RLS: profiles
-- User can only see/edit their OWN profile.
-- ============================================================
CREATE POLICY "profiles: user_can_read_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles: user_can_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles: user_can_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- NO DELETE policy on profiles — use data anonymization instead (Sacred Rule #7)

-- ============================================================
-- RLS: communities
-- Members can READ their own community.
-- Only admin can UPDATE community settings.
-- No one can DELETE a community via API.
-- ============================================================
CREATE POLICY "communities: members_can_read_own"
  ON communities FOR SELECT
  TO authenticated
  USING (id IN (SELECT auth_member_community_ids()));

CREATE POLICY "communities: admin_can_update"
  ON communities FOR UPDATE
  TO authenticated
  USING (auth_has_permission(id, 'can_manage_catalog'))   -- Reuse admin permission
  WITH CHECK (auth_has_permission(id, 'can_manage_catalog'));

-- ============================================================
-- RLS: community_members
-- Members can see other members IN THEIR community.
-- Only admin can manage memberships.
-- ============================================================
CREATE POLICY "community_members: can_read_own_community"
  ON community_members FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

CREATE POLICY "community_members: admin_can_insert"
  ON community_members FOR INSERT
  TO authenticated
  WITH CHECK (auth_has_permission(community_id, 'can_manage_catalog'));

CREATE POLICY "community_members: admin_can_update_role"
  ON community_members FOR UPDATE
  TO authenticated
  USING (auth_has_permission(community_id, 'can_manage_catalog'))
  WITH CHECK (auth_has_permission(community_id, 'can_manage_catalog'));

-- ============================================================
-- RLS: catalog_items
-- PUBLIC items are readable by EVERYONE (SEO crawlers).
-- PRIVATE/ACTIVE items only readable by community members.
-- Only members with can_manage_catalog can INSERT/UPDATE.
-- ============================================================
CREATE POLICY "catalog: public_items_readable_by_all"
  ON catalog_items FOR SELECT
  TO anon, authenticated
  USING (status = 'public');

CREATE POLICY "catalog: members_can_read_community_items"
  ON catalog_items FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

CREATE POLICY "catalog: authorized_members_can_insert"
  ON catalog_items FOR INSERT
  TO authenticated
  WITH CHECK (
    auth_is_member_of(community_id) AND
    auth_has_permission(community_id, 'can_manage_catalog')
  );

CREATE POLICY "catalog: authorized_members_can_update"
  ON catalog_items FOR UPDATE
  TO authenticated
  USING (auth_has_permission(community_id, 'can_manage_catalog'))
  WITH CHECK (auth_has_permission(community_id, 'can_manage_catalog'));

-- ============================================================
-- RLS: tenders
-- Members can read tenders in their community.
-- Only treasurer (is_treasurer=true) can create/publish.
-- ============================================================
CREATE POLICY "tenders: members_can_read"
  ON tenders FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

CREATE POLICY "tenders: only_treasurer_can_insert"
  ON tenders FOR INSERT
  TO authenticated
  WITH CHECK (
    auth_is_member_of(community_id) AND
    auth_has_permission(community_id, 'is_treasurer')
  );

CREATE POLICY "tenders: only_treasurer_can_update"
  ON tenders FOR UPDATE
  TO authenticated
  USING (auth_has_permission(community_id, 'is_treasurer'))
  WITH CHECK (auth_has_permission(community_id, 'is_treasurer'));

-- ============================================================
-- RLS: ledger — THE MOST CRITICAL POLICY
-- READ: Only community members can see their community ledger.
-- INSERT: Only members of that community (via RPC function).
-- UPDATE/DELETE: FORBIDDEN for everyone, always.
-- ============================================================
CREATE POLICY "ledger: members_can_read_own_community"
  ON ledger FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

CREATE POLICY "ledger: members_can_insert_via_function"
  ON ledger FOR INSERT
  TO authenticated
  WITH CHECK (auth_is_member_of(community_id));

-- CRITICAL: No UPDATE/DELETE policies on ledger means they are blocked by default.
-- Trigger in migration 005 adds safety even for bypass.

-- ============================================================
-- RLS: tender_subscriptions
-- ============================================================
CREATE POLICY "tender_subs: members_can_read"
  ON tender_subscriptions FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

CREATE POLICY "tender_subs: members_can_subscribe"
  ON tender_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth_is_member_of(community_id));

-- ============================================================
-- RLS: interaction_log & audit_log
-- Only admins can read logs.
-- ============================================================
CREATE POLICY "interaction_log: admin_can_read"
  ON interaction_log FOR SELECT
  TO authenticated
  USING (
    community_id IN (SELECT auth_member_community_ids()) AND
    auth_has_permission(community_id, 'can_manage_catalog')
  );

CREATE POLICY "audit_log: admin_can_read"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    community_id IN (SELECT auth_member_community_ids()) AND
    auth_has_permission(community_id, 'can_manage_catalog')
  );

-- ============================================================
-- RLS: multisig_requests
-- ============================================================
CREATE POLICY "multisig: members_can_read"
  ON multisig_requests FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

CREATE POLICY "multisig: approvers_can_update"
  ON multisig_requests FOR UPDATE
  TO authenticated
  USING (auth_has_permission(community_id, 'can_approve_multisig'))
  WITH CHECK (auth_has_permission(community_id, 'can_approve_multisig'));
