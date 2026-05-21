-- Migration: Reputation Engine Trigger Setup

-- Fungsi trigger: update reputation_score setiap ada ledger entry baru
CREATE OR REPLACE FUNCTION fn_update_reputation_on_ledger()
RETURNS TRIGGER AS $$
DECLARE
  v_score_delta INT := 0;
  v_reason TEXT;
  v_new_score INT;
BEGIN
  -- Sesuai spec 22_algorithm_spec.md dan formula deterministik 14_approved_open_source_stack.md
  CASE NEW.entry_type
    WHEN 'tender_contribution'  THEN v_score_delta := 5;  v_reason := 'Kontribusi tender berhasil';
    WHEN 'tender_settlement'    THEN v_score_delta := 3;  v_reason := 'Tender diselesaikan tepat waktu';
    WHEN 'community_share'      THEN v_score_delta := 1;  v_reason := 'Kontribusi komunitas';
    WHEN 'correction'           THEN v_score_delta := -2; v_reason := 'Koreksi transaksi';
    ELSE v_score_delta := 0;
  END CASE;

  IF v_score_delta != 0 THEN
    -- Update reputation_score (tidak boleh turun di bawah 10 - skor minimum komunitas)
    UPDATE community_members
    SET reputation_score = GREATEST(10, reputation_score + v_score_delta)
    WHERE profile_id = NEW.actor_id AND community_id = NEW.community_id
    RETURNING reputation_score INTO v_new_score;

    -- Log ke audit_log untuk transparansi
    INSERT INTO audit_log (community_id, actor_id, action, table_affected, reason, new_value)
    VALUES (
      NEW.community_id,
      NEW.actor_id,
      'reputation_update',
      'community_members',
      v_reason || ' (Delta: ' || v_score_delta || ', Baru: ' || COALESCE(v_new_score, 10) || ')',
      jsonb_build_object('delta', v_score_delta, 'ledger_id', NEW.id, 'entry_type', NEW.entry_type, 'new_score', v_new_score)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger ke tabel ledger
DROP TRIGGER IF EXISTS trg_reputation_on_ledger ON ledger;
CREATE TRIGGER trg_reputation_on_ledger
  AFTER INSERT ON ledger
  FOR EACH ROW EXECUTE FUNCTION fn_update_reputation_on_ledger();
