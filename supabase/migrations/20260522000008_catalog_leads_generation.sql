-- Migration: Mesin Lead Generation & Interception (20260522000008)

CREATE TABLE IF NOT EXISTS public.catalog_leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    catalog_slug text NOT NULL,
    intent_type text NOT NULL CHECK (intent_type IN ('inquiry', 'external_click', 'checkout')),
    buyer_name text NOT NULL,
    contact_info text, -- WA atau Email
    lead_magnet_claimed text,
    captured_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Mengaktifkan Pengamanan Akses Baris (RLS) sesuai standar arsitektur URUN
ALTER TABLE public.catalog_leads ENABLE ROW LEVEL SECURITY;

-- Policy 1: Publik / Warga anonim bebas menginjeksikan data formulir mereka (Lead Ingestion)
CREATE POLICY "Public can insert catalog leads" ON public.catalog_leads
    FOR INSERT WITH CHECK (true);

-- Policy 2: Hanya pengurus sistem/API (via service_role) yang berhak membaca himpunan leads ini.
-- Untuk admin dashboard kelak, bisa dihubungkan dengan filter community_id, 
-- namun API server-side kita (supabaseAdmin) akan memakai BYPASS RLS.
CREATE POLICY "Public cannot view leads" ON public.catalog_leads
    FOR SELECT USING (false);
