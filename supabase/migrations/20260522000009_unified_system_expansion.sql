-- Migration: Public Community Gateway & Aggregation RPC (20260522000009)

-- Fungsi ini bersifat SECURITY DEFINER (mengabaikan RLS sementara di level engine)
-- Hal ini disengaja agar publik dapat melihat AGREGASI/TOTAL, 
-- namun TIDAK BISA melakukan query row-by-row ke tabel ledger.
CREATE OR REPLACE FUNCTION public.get_public_community_health(p_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
    v_community RECORD;
    v_balance NUMERIC := 0;
    v_active_tenders JSONB;
    v_active_polls JSONB;
    v_result JSONB;
BEGIN
    -- 1. Validasi Komunitas & Status Privasi
    SELECT id, name, slug, description, is_public
    INTO v_community
    FROM communities
    WHERE slug = p_slug AND status = 'active';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('status', 'not_found', 'message', 'Simpul komunitas tidak ditemukan atau tidak aktif.');
    END IF;

    -- 2. Handler Status Private/Tertutup
    IF COALESCE(v_community.is_public, false) = FALSE THEN
        RETURN jsonb_build_object(
            'status', 'private', 
            'name', v_community.name, 
            'message', 'Pengurus komunitas ini menetapkan kebijakan Transparansi Tertutup (Hanya untuk Warga Internal).'
        );
    END IF;

    -- 3. Agregasi Ledger / Live Balance Kas
    -- Asumsi: nilai 'amount' positif untuk pemasukan, negatif untuk pengeluaran
    SELECT COALESCE(SUM(amount), 0)
    INTO v_balance
    FROM ledger
    WHERE community_id = v_community.id;

    -- 4. Agregasi Progres Tender (Tanpa data profil penyumbang)
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', id,
                'title', title,
                'target_amount', target_amount,
                'collected_amount', collected_amount,
                'progress_percentage', LEAST(100, ROUND((collected_amount / NULLIF(target_amount, 0)) * 100, 1))
            )
        ), '[]'::jsonb
    )
    INTO v_active_tenders
    FROM tenders
    WHERE community_id = v_community.id AND status = 'active';

    -- 5. Agregasi Polling/Voting Aktif (Menggunakan penghitungan count dari poll_votes)
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', p.id,
                'question', p.question,
                'total_votes', (SELECT COUNT(*) FROM poll_votes WHERE poll_id = p.id)
            )
        ), '[]'::jsonb
    )
    INTO v_active_polls
    FROM polls p
    WHERE p.community_id = v_community.id AND p.status = 'active';

    -- 6. Penyusunan JSON Konstruksi Akhir
    v_result := jsonb_build_object(
        'status', 'success',
        'community', jsonb_build_object(
            'id', v_community.id,
            'name', v_community.name,
            'slug', v_community.slug,
            'description', v_community.description
        ),
        'metrics', jsonb_build_object(
            'balance', v_balance,
            'tenders', v_active_tenders,
            'polls', v_active_polls
        ),
        'generated_at', EXTRACT(EPOCH FROM NOW())
    );

    RETURN v_result;
END;
$$;
