-- ============================================================
-- MIGRATION 012: Additional Financial Constraints for Tenders
-- Pillar Test: ✅ Data & Financial Stewardship
-- ============================================================

-- Tambahkan CHECK constraint pada unit_price_target di tabel tenders jika belum ada
-- Memastikan unit_price_target tidak negatif dan bernilai positif (> 0) jika diisi
ALTER TABLE tenders
  ADD CONSTRAINT unit_price_target_positive CHECK (unit_price_target IS NULL OR unit_price_target > 0);
