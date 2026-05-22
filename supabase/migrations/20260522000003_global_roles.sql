-- ============================================================
-- MIGRATION: Global Roles
-- Description: Adds global_role to profiles for 5-Layer Access
-- ============================================================

-- Add global_role column to profiles, default to 'user'
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS global_role VARCHAR NOT NULL DEFAULT 'user';

-- Add a check constraint to ensure only valid global roles are inserted
ALTER TABLE profiles
ADD CONSTRAINT profiles_global_role_check 
CHECK (global_role IN ('user', 'investor', 'auditor', 'founder', 'system'));

-- Comment on profiles to explain the 5-Layer architecture
COMMENT ON COLUMN profiles.global_role IS 'Global System Role (Layer 1-5). user=Warga/Pengurus Lokal, investor=Strategy Tier, auditor=Oversight Tier, founder=System Tier.';

-- Make sure to document in communities.settings that multisig_threshold is configurable.
COMMENT ON COLUMN communities.settings IS 'Configuration for community. Note: multisig_threshold (default 5.000.000) is dynamically configurable per community.';
