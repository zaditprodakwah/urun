import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendWhatsappMessage, formatIDR } from '@/lib/whatsapp';
import { getSession } from '@/lib/auth';

import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Silakan login terlebih dahulu.' }, { status: 401 });
    }
    
    const communityId = session.communityId;
    const actorId = session.profileId;

    const body = await req.json().catch(() => ({}));
    const amount = body.amount || 7500000; // Default Rp 7.500.000 (exceeds Rp 5.000.000 threshold)
    
    let tenderId = body.tenderId;
    if (!tenderId) {
      // Fetch an active tender for this community
      const { data: activeTender } = await supabaseAdmin
        .from('tenders')
        .select('id')
        .eq('community_id', communityId)
        .limit(1);
      
      if (!activeTender || activeTender.length === 0) {
        return NextResponse.json({ error: 'Tidak ada program tender aktif di komunitas Anda untuk disimulasikan. Hubungi pengurus untuk membuat tender.' }, { status: 400 });
      }
      tenderId = activeTender[0].id;
    }

    const idempotencyKey = crypto.randomUUID();

    // Call the process_ledger_entry RPC which now returns a JSONB status object
    const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('process_ledger_entry', {
      p_community_id: communityId,
      p_actor_id: actorId,
      p_tender_id: tenderId,
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
        .eq('community_id', communityId)
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
