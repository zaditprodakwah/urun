-- ============================================================
-- MIGRATION 009: Catalog Refactoring & Review Module
-- URUN Phase 9 - Standarisasi Ekosistem & Katalog
-- Pillar Test: ✅ Data Stewardship (community_id isolation)
-- ============================================================

-- 1. Modifikasi tabel catalog_items yang sudah ada
ALTER TABLE catalog_items 
  ADD COLUMN IF NOT EXISTS checkout_type TEXT DEFAULT 'link_toko'
  CONSTRAINT checkout_type_check CHECK (checkout_type IN ('link_toko', 'whatsapp_form')),
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_form_fields JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN catalog_items.checkout_type IS 'Tipe checkout item: link_toko (redirect external) atau whatsapp_form (popup form)';
COMMENT ON COLUMN catalog_items.external_url IS 'Tautan eksternal (e.g. Tokopedia/Shopee) jika checkout_type = link_toko';
COMMENT ON COLUMN catalog_items.whatsapp_form_fields IS 'Definisi kolom dinamis JSONB untuk WhatsApp form (e.g., [{"name": "nama", "label": "Nama Lengkap", "required": true}])';

-- 2. Buat tabel ulasan catalog_reviews
CREATE TABLE IF NOT EXISTS catalog_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id  UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  rating        INT NOT NULL CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE catalog_reviews IS 'Ulasan & rating katalog produk warga lokal. Terisolasi ketat via RLS dan community_id.';

-- 3. Indeks Kinerja
CREATE INDEX IF NOT EXISTS idx_catalog_reviews_product ON catalog_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_catalog_reviews_user    ON catalog_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_reviews_community ON catalog_reviews(community_id);

-- 4. Pasang RLS pada tabel catalog_reviews
ALTER TABLE catalog_reviews ENABLE ROW LEVEL SECURITY;

-- Kebijakan Membaca Ulasan: Hanya warga dari komunitas yang sama yang bisa melihat ulasan
CREATE POLICY "reviews: members_can_read_community_reviews"
  ON catalog_reviews FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

-- Kebijakan Publik Membaca Ulasan: Ulasan untuk produk bertipe 'public' dapat diakses publik (SEO)
CREATE POLICY "reviews: anyone_can_read_public_product_reviews"
  ON catalog_reviews FOR SELECT
  TO anon, authenticated
  USING (
    product_id IN (
      SELECT id FROM catalog_items WHERE status = 'public'
    )
  );

-- Kebijakan Menulis Ulasan: Warga dapat menulis ulasan jika mereka anggota komunitas tersebut dan menulis atas profile_id miliknya sendiri
CREATE POLICY "reviews: authorized_user_can_insert"
  ON catalog_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    community_id IN (SELECT auth_member_community_ids())
  );

-- Kebijakan Mengubah Ulasan: Hanya pembuat ulasan yang dapat mengubah ulasan miliknya
CREATE POLICY "reviews: user_can_update_own"
  ON catalog_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Kebijakan Menghapus Ulasan: Hanya pembuat ulasan yang dapat menghapus ulasan miliknya
CREATE POLICY "reviews: user_can_delete_own"
  ON catalog_reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
