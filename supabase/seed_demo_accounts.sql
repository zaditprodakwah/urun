-- Seed Script: Akun Demo 5 Layer Arsitektur URUN
-- Digunakan untuk simulasi dan demonstrasi (Bypass Authentication)

-- 1. Pastikan tabel communities memiliki data dummy
INSERT INTO public.communities (id, name, type, "region_province", "region_city")
VALUES ('demo-community-id', 'RT 01 Kalisari', 'rt', 'DKI Jakarta', 'Jakarta Timur')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Profiles untuk 5 Layer Demo
-- Asumsi ID UUID valid atau teks string (sesuaikan dengan tipe data ID profiles)
INSERT INTO public.profiles (id, phone, full_name, global_role)
VALUES 
  -- Layer 5: Warga Biasa (Akses via WhatsApp OTP)
  ('uuid-demo-warga', '081111111111', 'Budi Warga (Demo)', 'user'),
  
  -- Layer 4: Pengurus RT/Bendahara (Akses via Email rt@urun.demo)
  ('uuid-demo-rt', '082222222222', 'Ibu Aminah RT (Demo)', 'user'),
  
  -- Layer 3: Auditor / Pemerintah (Akses via Email auditor@urun.demo)
  ('uuid-demo-auditor', '083333333333', 'Bu Dewi Auditor (Demo)', 'auditor'),
  
  -- Layer 2: Investor / Eksekutif (Akses via Email investor@urun.demo)
  ('uuid-demo-investor', '084444444444', 'Pak Harjo Investor (Demo)', 'investor'),
  
  -- Layer 1: Founder / Developer (Akses via Email founder@urun.demo)
  ('uuid-demo-founder', '085555555555', 'Developer Admin (Demo)', 'founder')
ON CONFLICT (id) DO UPDATE SET 
  global_role = EXCLUDED.global_role,
  full_name = EXCLUDED.full_name;

-- 3. Insert Community Members untuk Hak Akses Lokal (RT/RW)
INSERT INTO public.community_members (id, community_id, role, reputation_score)
VALUES 
  -- Warga Biasa (Layer 5) - Tidak punya akses ke dashboard pengurus
  ('uuid-demo-warga', 'demo-community-id', 'warga', 10),
  
  -- Pengurus RT (Layer 4) - Punya akses ke dashboard pengurus lokal
  ('uuid-demo-rt', 'demo-community-id', 'pengurus', 150)
ON CONFLICT (id) DO UPDATE SET 
  role = EXCLUDED.role,
  reputation_score = EXCLUDED.reputation_score;
