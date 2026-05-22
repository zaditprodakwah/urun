-- ============================================================
-- MIGRATION 016: Secure Tender Subscriptions & Data Anonymization
-- Pillar Test: ✅ Data & Financial Stewardship
-- ============================================================

-- 1. Tambahkan kolom quota pada tabel tenders (jika belum ada)
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS quota INT DEFAULT 100 CHECK (quota >= 0);

-- 2. RPC subscribe_tender dengan Atomic Decrement & Perlindungan Race Condition
CREATE OR REPLACE FUNCTION subscribe_tender(
  p_tender_id   UUID,
  p_member_id   UUID,
  p_quantity    INT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_community_id  UUID;
  v_current_state TEXT;
  v_quota         INT;
  v_sub_id        UUID;
BEGIN
  -- A. Kunci baris tender untuk mencegah pemrosesan paralel yang bentrok
  SELECT community_id, current_state, quota 
  INTO v_community_id, v_current_state, v_quota
  FROM tenders
  WHERE id = p_tender_id
  FOR UPDATE;

  -- B. Validasi status tender
  IF v_current_state IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tender tidak ditemukan.');
  END IF;

  IF v_current_state NOT IN ('published', 'subscribing') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tender sedang tidak menerima partisipasi warga.');
  END IF;

  -- C. Validasi kuota (jika dikonfigurasi)
  IF v_quota IS NOT NULL THEN
    IF v_quota < p_quantity THEN
      RETURN jsonb_build_object('success', false, 'error', 'Kuota partisipasi tidak mencukupi. Sisa: ' || v_quota);
    END IF;

    -- D. Lakukan atomic decrement
    UPDATE tenders 
    SET quota = quota - p_quantity 
    WHERE id = p_tender_id AND quota >= p_quantity;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'Gagal memotong kuota. Terjadi perebutan akses (race condition).');
    END IF;
  END IF;

  -- E. Daftarkan partisipasi warga (upsert secara aman)
  INSERT INTO tender_subscriptions (
    tender_id,
    community_id,
    member_id,
    quantity,
    status
  ) VALUES (
    p_tender_id,
    v_community_id,
    p_member_id,
    p_quantity,
    'confirmed'
  )
  ON CONFLICT (tender_id, member_id) 
  DO UPDATE SET 
    quantity = tender_subscriptions.quantity + EXCLUDED.quantity
  RETURNING id INTO v_sub_id;

  RETURN jsonb_build_object(
    'success', true,
    'subscription_id', v_sub_id,
    'message', 'Berhasil bergabung dengan URUN Dana pengadaan kolektif.'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 3. Trigger Anonymization over Deletion pada profiles (Kepatuhan UU PDP No. 27/2022)
CREATE OR REPLACE FUNCTION trigger_anonymize_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Lakukan anonymization alih-alih penghapusan fisik
  UPDATE profiles
  SET 
    full_name = 'Warga Anonim (Akun Dihapus)',
    phone = NULL,
    avatar_url = NULL,
    consent_timestamp = NULL,
    consent_version = NULL,
    updated_at = NOW()
  WHERE id = OLD.id;

  -- Kembalikan NULL untuk membatalkan penghapusan baris fisik agar ledger/FK utuh
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger pada tabel profiles
DROP TRIGGER IF EXISTS trg_anonymize_profile_on_delete ON profiles;
CREATE TRIGGER trg_anonymize_profile_on_delete
BEFORE DELETE ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_anonymize_profile();
