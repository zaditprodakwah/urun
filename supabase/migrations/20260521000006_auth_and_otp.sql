-- Migration: Auth and OTP Setup
-- Tabel OTP sementara (TTL 5 menit)
CREATE TABLE IF NOT EXISTS otp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp_hash TEXT NOT NULL,        -- bcrypt hash OTP
  community_id UUID REFERENCES communities(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk lookup cepat
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_sessions (phone, used, expires_at);

-- Tambah kolom auth_user_id di profiles jika belum ada
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone ON profiles (phone) WHERE phone IS NOT NULL;

-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "profiles_self_read" ON profiles;
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "profiles_admin_read" ON profiles;
CREATE POLICY "profiles_admin_read" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM community_members cm WHERE cm.profile_id = auth.uid() AND cm.role IN ('admin', 'pengurus'))
  );
