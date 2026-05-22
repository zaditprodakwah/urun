-- ============================================================
-- MIGRATION 015: Community Forum & Ratings Module
-- Pillar Test: ✅ Data & Community Stewardship
-- ============================================================

-- 1. Tambahkan kolom agregasi rating ke tabel target agar query SELECT instan (LCP-friendly)
ALTER TABLE catalog_items 
  ADD COLUMN IF NOT EXISTS aggregate_rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0;

ALTER TABLE communities 
  ADD COLUMN IF NOT EXISTS aggregate_rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0;

-- 2. Buat tabel reviews terpadu
CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE CASCADE, -- Null jika forum/ulasan komunitas umum
  rating          INT CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5), -- Null untuk komentar/balasan biasa
  comment         TEXT NOT NULL,
  parent_id       UUID REFERENCES reviews(id) ON DELETE CASCADE, -- Nested replies
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE reviews IS 'Unified community forum, nested discussions, and product ratings. Supported by recursive query.';

-- Indeks Kinerja
CREATE INDEX IF NOT EXISTS idx_reviews_community   ON reviews(community_id);
CREATE INDEX IF NOT EXISTS idx_reviews_catalog     ON reviews(catalog_item_id) WHERE catalog_item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_parent      ON reviews(parent_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at  ON reviews(created_at DESC);

-- 3. Row-Level Security (RLS) Policies yang Ketat
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Warga hanya bisa melihat ulasan di komunitas mereka sendiri
CREATE POLICY "reviews: members_can_select"
  ON reviews FOR SELECT
  TO authenticated
  USING (community_id IN (SELECT auth_member_community_ids()));

-- CRAWLER & PUBLIC VIEW: Membolehkan pembacaan ulasan jika terkait produk bertipe 'public'
CREATE POLICY "reviews: public_crawler_can_select"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (
    catalog_item_id IN (
      SELECT id FROM catalog_items WHERE status = 'public'
    )
  );

-- Warga hanya bisa menulis ulasan di komunitas mereka
CREATE POLICY "reviews: members_can_insert"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    community_id IN (SELECT auth_member_community_ids())
  );

-- Hanya pembuat ulasan yang bisa mengubah/menghapus
CREATE POLICY "reviews: author_can_update"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews: author_can_delete"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 4. Database Trigger untuk Agregasi Otomatis (Atomic Updates)
CREATE OR REPLACE FUNCTION update_reviews_aggregates()
RETURNS TRIGGER AS $$
DECLARE
  v_catalog_item_id UUID;
  v_community_id    UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_catalog_item_id := OLD.catalog_item_id;
    v_community_id    := OLD.community_id;
  ELSE
    v_catalog_item_id := NEW.catalog_item_id;
    v_community_id    := NEW.community_id;
  END IF;

  -- Update Agregat Produk jika terhubung ke katalog produk
  IF v_catalog_item_id IS NOT NULL THEN
    UPDATE catalog_items
    SET 
      aggregate_rating = COALESCE((
        SELECT ROUND(AVG(rating)::decimal, 2)
        FROM reviews
        WHERE catalog_item_id = v_catalog_item_id AND rating IS NOT NULL
      ), 0),
      comment_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE catalog_item_id = v_catalog_item_id
      )
    WHERE id = v_catalog_item_id;
  END IF;

  -- Update Agregat Komunitas
  UPDATE communities
  SET 
    aggregate_rating = COALESCE((
      SELECT ROUND(AVG(rating)::decimal, 2)
      FROM reviews
      WHERE community_id = v_community_id AND rating IS NOT NULL AND parent_id IS NULL
    ), 0),
    comment_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE community_id = v_community_id
    )
  WHERE id = v_community_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Buat trigger jika belum ada
DROP TRIGGER IF EXISTS trg_reviews_aggregates ON reviews;
CREATE TRIGGER trg_reviews_aggregates
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_aggregates();

-- 5. RPC untuk recursive CTE tree retrieval
CREATE OR REPLACE FUNCTION get_reviews_tree(
  p_community_id    UUID,
  p_catalog_item_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id              UUID,
  community_id    UUID,
  user_id         UUID,
  full_name       TEXT,
  avatar_url      TEXT,
  catalog_item_id UUID,
  rating          INT,
  comment         TEXT,
  parent_id       UUID,
  metadata        JSONB,
  created_at      TIMESTAMPTZ,
  depth           INT,
  path            UUID[]
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE comment_tree AS (
    -- Anchor member
    SELECT 
      r.id, 
      r.community_id, 
      r.user_id, 
      p.full_name,
      p.avatar_url,
      r.catalog_item_id, 
      r.rating, 
      r.comment, 
      r.parent_id, 
      r.metadata, 
      r.created_at,
      1 AS depth,
      ARRAY[r.id] AS path
    FROM reviews r
    JOIN profiles p ON r.user_id = p.id
    WHERE r.parent_id IS NULL 
      AND r.community_id = p_community_id
      AND (p_catalog_item_id IS NULL OR r.catalog_item_id = p_catalog_item_id)
    
    UNION ALL
    
    -- Recursive member
    SELECT 
      r.id, 
      r.community_id, 
      r.user_id, 
      p.full_name,
      p.avatar_url,
      r.catalog_item_id, 
      r.rating, 
      r.comment, 
      r.parent_id, 
      r.metadata, 
      r.created_at,
      t.depth + 1,
      t.path || r.id
    FROM reviews r
    JOIN profiles p ON r.user_id = p.id
    JOIN comment_tree t ON r.parent_id = t.id
  )
  SELECT * FROM comment_tree ORDER BY path;
END;
$$;

