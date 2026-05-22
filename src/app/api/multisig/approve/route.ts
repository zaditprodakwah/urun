import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendWhatsappMessage, formatIDR } from '@/lib/whatsapp';
import { sendReputationNotif } from '@/lib/notifications';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Silakan login terlebih dahulu.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { requestId, memberId } = body;

    if (!requestId) {
      return NextResponse.json({ error: 'requestId is required.' }, { status: 400 });
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

    // Fail-Safe: Resolve and verify authenticated member ID from real-time database
    const { data: currentMember, error: currMemErr } = await supabaseAdmin
      .from('community_members')
      .select('id, role')
      .eq('profile_id', session.userId)
      .eq('community_id', msig.community_id)
      .single();

    if (currMemErr || !currentMember) {
      return NextResponse.json({ error: 'FORBIDDEN: Keanggotaan Anda tidak ditemukan di simpul komunitas ini.' }, { status: 403 });
    }

    // In production, force using the authenticated member ID to prevent client-side spoofing.
    // In development/simulation, fallback to provided memberId only if it represents a valid pengurus.
    let resolvedMemberId = currentMember.id;
    if (process.env.NODE_ENV !== 'production' && memberId) {
      resolvedMemberId = memberId;
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
      .eq('id', resolvedMemberId)
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
    const alreadySigned = approvalsList.some((app: any) => app.member_id === resolvedMemberId);
    if (alreadySigned) {
      return NextResponse.json({ error: 'Anda sudah menandatangani permintaan Multi-Sig ini sebelumnya.' }, { status: 400 });
    }

    // 6. Record signature
    const newApproval = {
      member_id: resolvedMemberId,
      approved_at: new Date().toISOString(),
      signature: `SIG_${crypto.randomUUID().slice(0, 8)}`,
      full_name: member.profiles?.full_name || 'Pengurus'
    };
    const updatedApprovals = [...approvalsList, newApproval];
    const newSigsCount = msig.current_sigs + 1;
    const isQuorumReached = newSigsCount >= msig.required_sigs;
    const newStatus = isQuorumReached ? 'approved' : 'pending';

    // 7. Optimistic Concurrency Control (OCC) Lock
    // We update the multisig request FIRST. If current_sigs changed in the database
    // while we were processing, this update will fail to find the row.
    const { data: updatedMsig, error: updateErr } = await supabaseAdmin
      .from('multisig_requests')
      .update({
        current_sigs: newSigsCount,
        approvals: updatedApprovals,
        status: newStatus
      })
      .eq('id', msig.id)
      .eq('current_sigs', msig.current_sigs) // EXACT MATCH LOCK
      .select()
      .single();

    if (updateErr || !updatedMsig) {
      console.warn(`[OCC CONFLICT] Multisig ${msig.id} was modified concurrently.`);
      return NextResponse.json({ error: 'Konflik Data (Race Condition): Tanda tangan sedang diproses oleh pengurus lain. Silakan muat ulang halaman untuk melihat status terbaru.' }, { status: 409 });
    }

    // Check if quorum reached
    if (isQuorumReached) {
      // QUORUM REACHED & OCC SECURED!
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
        // ROLLBACK MULTISIG STATUS if ledger fails
        await supabaseAdmin
          .from('multisig_requests')
          .update({
            current_sigs: msig.current_sigs,
            approvals: msig.approvals,
            status: 'pending'
          })
          .eq('id', msig.id);
        
        return NextResponse.json({ error: 'Gagal mencatat transaksi ke Ledger. Status Multi-Sig dikembalikan ke Pending.' }, { status: 500 });
      }

      // b. Update multisig_requests to save ledger reference
      await supabaseAdmin
        .from('multisig_requests')
        .update({ ledger_ref_id: ledgerEntry.id })
        .eq('id', msig.id);

      // c. Log to audit_log with actor_id
      await supabaseAdmin
        .from('audit_log')
        .insert({
          community_id: msig.community_id,
          actor_id: resolvedMemberId,
          action: 'multisig_approved',
          table_affected: 'ledger',
          new_value: { ledger_id: ledgerEntry.id, request_id: msig.id, direction, entryType },
          reason: `Multi-sig quorum met (${newSigsCount}/${msig.required_sigs}). Atomic ledger insertion completed.`
        });

      // Calculate reputation score delta & trigger WA notification for requester
      try {
        const { data: updatedMember } = await supabaseAdmin
          .from('community_members')
          .select(`
            reputation_score,
            profiles (
              full_name,
              phone
            )
          `)
          .eq('profile_id', msig.requested_by)
          .eq('community_id', msig.community_id)
          .single();

        if (updatedMember && updatedMember.profiles) {
          const profile = updatedMember.profiles as any;
          if (profile.phone) {
            const delta = entryType === 'tender_settlement' ? 3 : 5;
            const reason = entryType === 'tender_settlement'
              ? 'Penyelesaian tender (outflow) disetujui kuorum'
              : 'Penyetoran kontribusi tender (inflow) disetujui kuorum';

            await sendReputationNotif(
              profile.phone,
              profile.full_name,
              delta,
              reason,
              updatedMember.reputation_score
            );
          }
        }
      } catch (repErr) {
        console.error('❌ Failed to process reputation WA notification:', repErr);
      }

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
      // OCC Update was already successful above!
      
      // Log to audit_log
      await supabaseAdmin
        .from('audit_log')
        .insert({
          community_id: msig.community_id,
          actor_id: resolvedMemberId,
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
