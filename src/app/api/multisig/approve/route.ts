import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWhatsappMessage, formatIDR } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { requestId, memberId } = body;

    if (!requestId || !memberId) {
      return NextResponse.json({ error: 'requestId and memberId are required.' }, { status: 400 });
    }

    // 1. Fetch the multisig request details
    const { data: msig, error: msigErr } = await supabaseAdmin
      .from('multisig_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (msigErr || !msig) {
      return NextResponse.json({ error: 'Request Multi-Sig tidak ditemukan.' }, { status: 404 });
    }

    // 2. Check if request is still pending
    if (msig.status !== 'pending') {
      return NextResponse.json({ error: `Permintaan ini sudah selesai dengan status: ${msig.status}` }, { status: 400 });
    }

    // 3. Check expiration (24 Hours deadline)
    if (new Date(msig.expires_at) < new Date()) {
      // Update status to expired
      await supabaseAdmin
        .from('multisig_requests')
        .update({ status: 'expired' })
        .eq('id', requestId);

      // Notify all signers/pengurus via WhatsApp
      const { data: signers } = await supabaseAdmin
        .from('community_members')
        .select(`
          id,
          profiles (
            phone,
            full_name
          )
        `)
        .eq('community_id', msig.community_id)
        .eq('role', 'pengurus');

      if (signers) {
        for (const signer of signers) {
          const profile = signer.profiles as any;
          if (profile && profile.phone) {
            const cancelMsg = `❌ *TRANSAKSI MULTI-SIG KEDALUWARSA*\n\nPermintaan pencairan dana sebesar *${formatIDR(msig.amount)}* telah kedaluwarsa karena tidak mencapai kuorum dalam 24 jam.\nSistem secara otomatis membatalkan transaksi untuk keamanan kas komunitas.`;
            await sendWhatsappMessage(profile.phone, cancelMsg);
          }
        }
      }

      return NextResponse.json({ error: 'Permintaan Multi-Sig ini telah kedaluwarsa (melebihi 24 jam) dan dibatalkan.' }, { status: 400 });
    }

    // 4. Fetch member and validate permissions
    const { data: member, error: memberErr } = await supabaseAdmin
      .from('community_members')
      .select(`
        *,
        profiles (
          full_name,
          phone
        )
      `)
      .eq('id', memberId)
      .eq('community_id', msig.community_id)
      .single();

    if (memberErr || !member) {
      return NextResponse.json({ error: 'Pengurus tidak ditemukan dalam simpul komunitas ini.' }, { status: 404 });
    }

    const permissions = member.permissions as any;
    if (!permissions || !permissions.can_approve_multisig) {
      return NextResponse.json({ error: 'AKSES DITOLAK: Anda tidak berwenang memberikan tanda tangan Multi-Sig.' }, { status: 403 });
    }

    // 5. Check if member already signed
    const approvalsList = Array.isArray(msig.approvals) ? msig.approvals : [];
    const alreadySigned = approvalsList.some((app: any) => app.member_id === memberId);
    if (alreadySigned) {
      return NextResponse.json({ error: 'Anda sudah menandatangani permintaan Multi-Sig ini sebelumnya.' }, { status: 400 });
    }

    // 6. Record signature
    const newApproval = {
      member_id: memberId,
      approved_at: new Date().toISOString(),
      signature: `SIG_${crypto.randomUUID().slice(0, 8)}`,
      full_name: member.profiles?.full_name || 'Pengurus'
    };
    const updatedApprovals = [...approvalsList, newApproval];
    const newSigsCount = msig.current_sigs + 1;

    // Check if quorum reached
    if (newSigsCount >= msig.required_sigs) {
      // QUORUM REACHED!
      // Fetch requested_by member to determine dynamic entry type and direction
      const { data: reqMember } = await supabaseAdmin
        .from('community_members')
        .select('role, permissions')
        .eq('id', msig.requested_by)
        .single();

      const isOutflow = reqMember?.role === 'pengurus' || (reqMember?.permissions as any)?.is_treasurer;
      const direction = isOutflow ? 'out' : 'in';
      const entryType = isOutflow ? 'tender_settlement' : 'tender_contribution';
      const typeLabel = isOutflow ? 'Tender Settlement (Outflow)' : 'Tender Contribution (Inflow)';

      // a. Insert atomically to ledger (using admin to bypass the RPC nominal limit checks)
      const idempotencyKey = crypto.randomUUID();
      const { data: ledgerEntry, error: ledgerErr } = await supabaseAdmin
        .from('ledger')
        .insert({
          community_id: msig.community_id,
          actor_id: msig.requested_by, // Original requester (actor context preserved)
          tender_id: msig.tender_id,
          amount: msig.amount,
          direction: direction,
          entry_type: entryType,
          description: `MULTISIG APPROVED: ${typeLabel} (Req ID: ${msig.id})`,
          idempotency_key: idempotencyKey,
          multisig_status: 'approved'
        })
        .select()
        .single();

      if (ledgerErr) {
        console.error('Failed to write approved transaction to ledger:', ledgerErr);
        return NextResponse.json({ error: 'Failed to write approved transaction to ledger.' }, { status: 500 });
      }

      // b. Update multisig_requests to approved and save ledger reference
      const { error: updateErr } = await supabaseAdmin
        .from('multisig_requests')
        .update({
          current_sigs: newSigsCount,
          approvals: updatedApprovals,
          status: 'approved',
          ledger_ref_id: ledgerEntry.id
        })
        .eq('id', msig.id);

      if (updateErr) {
        console.error('Error updating multisig request status:', updateErr);
      }

      // c. Log to audit_log with actor_id
      await supabaseAdmin
        .from('audit_log')
        .insert({
          community_id: msig.community_id,
          actor_id: memberId,
          action: 'multisig_approved',
          table_affected: 'ledger',
          new_value: { ledger_id: ledgerEntry.id, request_id: msig.id, direction, entryType },
          reason: `Multi-sig quorum met (${newSigsCount}/${msig.required_sigs}). Atomic ledger insertion completed.`
        });

      // d. Notify all signers/pengurus via WhatsApp
      const { data: signers } = await supabaseAdmin
        .from('community_members')
        .select(`
          id,
          profiles (
            phone,
            full_name
          )
        `)
        .eq('community_id', msig.community_id)
        .eq('role', 'pengurus');

      if (signers) {
        for (const signer of signers) {
          const profile = signer.profiles as any;
          if (profile && profile.phone) {
            const successMsg = `✅ *TRANSAKSI MULTI-SIG DISETUJUI PERMANEN*\n\nTandatangan divalidasi. Kuorum tercapai (*${newSigsCount}/${msig.required_sigs}*).\n\nDana sebesar *${formatIDR(msig.amount)}* resmi ${isOutflow ? 'dicairkan ke supplier' : 'disetorkan ke kas'} Buku Kas Kolektif (Ledger Immutable).\nSistem otomatis memproses pembagian 70/30 secara transparan.`;
            await sendWhatsappMessage(profile.phone, successMsg);
          }
        }
      }

      return NextResponse.json({
        status: 'approved',
        message: 'Quorum reached! Ledger entry written successfully.',
        currentSigs: newSigsCount,
        requiredSigs: msig.required_sigs,
        ledgerId: ledgerEntry.id
      }, { status: 200 });

    } else {
      // QUORUM NOT YET REACHED (Still pending)
      const { error: updateErr } = await supabaseAdmin
        .from('multisig_requests')
        .update({
          current_sigs: newSigsCount,
          approvals: updatedApprovals
        })
        .eq('id', msig.id);

      if (updateErr) {
        console.error('Error updating approvals list:', updateErr);
        return NextResponse.json({ error: 'Failed to record signature.' }, { status: 500 });
      }

      // Log to audit_log
      await supabaseAdmin
        .from('audit_log')
        .insert({
          community_id: msig.community_id,
          actor_id: memberId,
          action: 'multisig_signed',
          table_affected: 'multisig_requests',
          new_value: { request_id: msig.id, current_sigs: newSigsCount },
          reason: `Signed multi-sig request. Progress: ${newSigsCount}/${msig.required_sigs}`
        });

      // Notify the signer
      if (member.profiles?.phone) {
        const signMsg = `✍️ *TANDATANGAN MULTI-SIG DICATAT*\n\nTandatangan Anda berhasil divalidasi. Saat ini terkumpul (*${newSigsCount}/${msig.required_sigs}*) persetujuan.\n\nMenunggu tanda tangan pengurus lain sebelum dana dapat dicairkan secara otomatis.`;
        await sendWhatsappMessage(member.profiles.phone, signMsg);
      }

      return NextResponse.json({
        status: 'signed',
        message: 'Signature recorded successfully.',
        currentSigs: newSigsCount,
        requiredSigs: msig.required_sigs
      }, { status: 200 });
    }

  } catch (err: any) {
    console.error('[Approve Multi-Sig API Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
