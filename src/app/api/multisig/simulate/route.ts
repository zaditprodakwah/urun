import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWhatsappMessage, formatIDR } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

const COMMUNITY_ID = 'b4db4d82-bfe0-4640-8d06-e4724038d1c7';
const TENDER_ID = 'e1b869ef-4280-4782-ab18-1897b5148127';
const ACTOR_ID = '2ad229ff-afc8-4cc0-9cf5-a5de39c8e0d6'; // Zadit Prodakwah (Pengurus)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = body.amount || 7500000; // Default Rp 7.500.000 (exceeds Rp 5.000.000 threshold)

    const idempotencyKey = crypto.randomUUID();

    // Call the process_ledger_entry RPC which now returns a JSONB status object
    const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('process_ledger_entry', {
      p_community_id: COMMUNITY_ID,
      p_actor_id: ACTOR_ID,
      p_tender_id: TENDER_ID,
      p_amount: amount,
      p_direction: 'out',
      p_entry_type: 'tender_settlement',
      p_description: `Pengadaan Semen Jalan RT 01 x100 Sak (Simulasi: ${formatIDR(amount)})`,
      p_idempotency_key: idempotencyKey
    });

    if (rpcErr) {
      console.error('RPC Execution Error:', rpcErr);
      return NextResponse.json({ error: rpcErr.message }, { status: 400 });
    }

    const result = rpcResult as any;

    if (result && result.status === 'multisig_required') {
      console.log('✅ RPC successfully blocked insert directly to ledger and initiated Multi-Sig request:', result.multisig_id);

      // Query the newly created multisig request precisely by ID
      const { data: latestMsig, error: fetchErr } = await supabaseAdmin
        .from('multisig_requests')
        .select(`
          *,
          tenders (
            id,
            title,
            description
          )
        `)
        .eq('id', result.multisig_id)
        .single();

      if (fetchErr || !latestMsig) {
        console.error('Error fetching newly created multisig request:', fetchErr);
        return NextResponse.json({ error: 'Multi-sig request was created but failed to fetch details.' }, { status: 500 });
      }

      // Query list of signers to send notifications
      const { data: signers, error: signersErr } = await supabaseAdmin
        .from('community_members')
        .select(`
          id,
          profiles (
            phone,
            full_name
          )
        `)
        .eq('community_id', COMMUNITY_ID)
        .eq('role', 'pengurus');

      if (signersErr) {
        console.error('Error fetching signers to notify:', signersErr);
      }

      const notifiedSigners: string[] = [];

      // Notify each signer via Fonnte WhatsApp Webhook
      if (signers && signers.length > 0) {
        for (const signer of signers) {
          const profile = signer.profiles as any;
          if (profile && profile.phone) {
            const msg = `⚠️ *PERSETUJUAN MULTI-SIG DIBUTUHKAN*\n\nTerdapat pengeluaran tender baru yang memerlukan persetujuan Anda:\n\n• *Proyek/Tender*: ${latestMsig.tenders?.title || 'Tender Komunitas'}\n• *Nominal*: *${formatIDR(amount)}*\n• *Dibutuhkan*: *${latestMsig.required_sigs} Tanda Tangan*\n• *Batas Waktu*: 24 Jam (Disiplin Kinerja)\n\nKetik \`#approve ${latestMsig.id}\` via WhatsApp atau buka Dashboard URUN untuk menandatangani secara digital.`;
            const success = await sendWhatsappMessage(profile.phone, msg);
            if (success) {
              notifiedSigners.push(profile.full_name);
            }
          }
        }
      }

      // Return standard 200 response with pending multisig details
      return NextResponse.json({
        status: 'multisig_required',
        message: `Ambang batas terlampaui. Persetujuan Multi-Sig (${latestMsig.required_sigs} Tanda Tangan) dibutuhkan.`,
        multisigRequest: latestMsig,
        notifiedSigners
      }, { status: 200 });
    }

    if (result && result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Transaction inserted directly to ledger (below threshold).',
      ledgerId: result?.ledger_id
    }, { status: 200 });

  } catch (err: any) {
    console.error('[Simulator API Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
