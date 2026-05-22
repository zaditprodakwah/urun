import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

// Rute ini berfungsi sebagai Governance Early Warning System
// Harus dijalankan secara rutin melalui Cron (misal Vercel Cron)
// GET /api/admin/audit-routine

export async function GET(request: Request) {
  // 1. Verifikasi kunci keamanan (hanya mesin atau admin yang berhak menjalankan audit)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'URUN_DEV_CRON_SECRET_2026';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized Access to Governance Audit' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const anomaliesFound = [];

    // --- AUDIT 1: KEDAULATAN FINANSIAL ---
    // Mendeteksi pengeluaran Kas (Expense) bernilai besar (> Rp 1.000.000) yang tidak diikat oleh Multisig (Persetujuan Warga)
    // Skenario: Pengurus menarik uang diam-diam tanpa mekanisme demokrasi.
    const { data: ledgerAnomalies, error: ledgerError } = await supabaseAdmin
      .from('ledger')
      .select('id, amount, description, status, community_id, created_at')
      .eq('type', 'expense')
      .gt('amount', 1000000)
      .is('multisig_id', null);

    if (ledgerError) throw ledgerError;
    if (ledgerAnomalies && ledgerAnomalies.length > 0) {
      anomaliesFound.push({
        type: 'FINANCIAL_BYPASS',
        severity: 'CRITICAL',
        message: `Ditemukan ${ledgerAnomalies.length} transaksi keluar di atas Rp1.000.000 tanpa validasi Multisig Warga.`,
        data: ledgerAnomalies
      });
    }

    // --- AUDIT 2: INTEGRITAS KOMUNAL ---
    // Mendeteksi manipulasi Skor Reputasi (> 5.000 adalah batas mustahil bagi aktivitas warga normal)
    const { data: repAnomalies, error: repError } = await supabaseAdmin
      .from('community_members')
      .select('profile_id, community_id, reputation_score')
      .gt('reputation_score', 5000);

    if (repError) throw repError;
    if (repAnomalies && repAnomalies.length > 0) {
      anomaliesFound.push({
        type: 'REPUTATION_INFLATION',
        severity: 'HIGH',
        message: `Ditemukan ${repAnomalies.length} anggota dengan skor reputasi manipulatif (melebihi batas sistem 5.000 poin).`,
        data: repAnomalies
      });
    }

    // Rekapitulasi Laporan
    const auditReport = {
      auditTimestamp: new Date().toISOString(),
      status: anomaliesFound.length > 0 ? 'ANOMALIES_DETECTED' : 'CLEAN',
      totalAnomalies: anomaliesFound.length,
      details: anomaliesFound
    };

    // Jika terjadi anomali, pada praktiknya log ini akan di-pipe ke sistem notifikasi sentral (Email Founder / Telegram Bot)
    if (anomaliesFound.length > 0) {
      console.warn('URUN GOVERNANCE ALERT: Anomalies Detected during automated routine.', auditReport);
    }

    return NextResponse.json(auditReport);

  } catch (error: any) {
    console.error('Audit Routine Failed:', error);
    return NextResponse.json({ 
      error: 'Governance Engine Failure', 
      details: error.message 
    }, { status: 500 });
  }
}
