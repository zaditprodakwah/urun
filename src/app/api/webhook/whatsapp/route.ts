import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendWhatsappMessage, formatIDR } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  console.log('📬 Received incoming WhatsApp Webhook request');

  try {
    // 1. Parse payload (Fonnte sends form-urlencoded data)
    let sender = '';
    let message = '';
    let name = '';
    let token = '';

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      sender = body.sender || '';
      message = body.message || '';
      name = body.name || '';
      token = body.token || '';
    } else {
      const formData = await req.formData();
      sender = (formData.get('sender') as string) || '';
      message = (formData.get('message') as string) || '';
      name = (formData.get('name') as string) || '';
      token = (formData.get('token') as string) || '';
    }

    sender = sender.trim();
    message = message.trim();
    name = name.trim();
    token = token.trim();

    // Security: Optional Webhook Secret Verification
    const webhookSecret = process.env.FONNTE_WEBHOOK_SECRET;
    if (webhookSecret) {
      const isHeaderMatch = req.headers.get('Authorization') === webhookSecret || req.headers.get('x-fonnte-token') === webhookSecret;
      const isBodyMatch = token === webhookSecret;
      if (!isHeaderMatch && !isBodyMatch) {
        console.warn('❌ Unauthorized webhook request: Fonnte Webhook Secret mismatch.');
        return NextResponse.json({ status: false, error: 'Unauthorized: Webhook Secret mismatch' }, { status: 401 });
      }
      console.log('🔒 Webhook request authenticated successfully via Fonnte Webhook Secret.');
    }

    if (!sender || !message) {
      return NextResponse.json({ status: false, error: 'Sender or message missing' }, { status: 400 });
    }

    console.log(`💬 Message from ${name} (${sender}): "${message}"`);

    // 2. Identify community member by phone
    // Generate phone variations to ensure maximum lookup compatibility
    const phones = [sender];
    if (sender.startsWith('62')) {
      phones.push('+' + sender);
      phones.push('0' + sender.slice(2));
    } else if (sender.startsWith('0')) {
      phones.push('62' + sender.slice(1));
      phones.push('+62' + sender.slice(1));
    }

    // Query profile and community membership details
    const { data: memberData, error: memberErr } = await supabaseAdmin
      .from('community_members')
      .select(`
        id,
        community_id,
        role,
        permissions,
        reputation_score,
        profiles!inner (
          id,
          full_name,
          phone
        )
      `)
      .in('profiles.phone', phones)
      .limit(1);

    if (memberErr || !memberData || memberData.length === 0) {
      console.warn(`⚠️ Sender ${sender} not registered in profiles.`);
      await sendWhatsappMessage(
        sender,
        `⚠️ Halo *${name || 'Warga'}*, nomor WhatsApp Anda belum terdaftar di sistem URUN.\n\n` +
        `Silakan hubungi Pengurus RT/RW Anda untuk didaftarkan ke Simpul Komunitas berdaulat.`
      );
      return NextResponse.json({ status: true, message: 'Unregistered sender' });
    }

    const member = memberData[0];
    const memberId = member.id;
    const communityId = member.community_id;
    // Safe typing for inner profiles
    const profile = member.profiles as unknown as { id: string; full_name: string; phone: string };
    const permissions = (member.permissions as Record<string, boolean>) || {};

    // 3. Log incoming message to interaction_log
    const { error: logErr } = await supabaseAdmin
      .from('interaction_log')
      .insert({
        community_id: communityId,
        actor_id: memberId,
        action_type: 'incoming_whatsapp_message',
        action_detail: { message: message, sender_name: name },
        source_system: 'bot_wa'
      });

    if (logErr) {
      console.error('❌ Failed to insert interaction_log:', logErr);
    }

    // 4. Command Router based on URUN Glosarium Taxonomy
    // Command 1: #urun (Show active Tenders)
    if (message.toLowerCase() === '#urun') {
      const { data: activeTenders, error: tendersErr } = await supabaseAdmin
        .from('tenders')
        .select('id, title, target_quantity, min_quantity, deadline, current_state')
        .eq('community_id', communityId)
        .in('current_state', ['published', 'subscribing'])
        .order('deadline', { ascending: true });

      if (tendersErr || !activeTenders || activeTenders.length === 0) {
        await sendWhatsappMessage(
          sender,
          `📦 *TENDER WARGA AKTIF*\n` +
          `-------------------------------\n` +
          `Saat ini tidak ada program URUN Dana atau Tender Warga yang aktif di Simpul Komunitas Anda.\n\n` +
          `Pantau terus info dari Pengurus!`
        );
        return NextResponse.json({ status: true });
      }

      let reply = `📦 *TENDER WARGA AKTIF*\n`;
      reply += `Simpul Komunitas: URUN Dana Kolektif\n`;
      reply += `-------------------------------\n\n`;

      activeTenders.forEach((t, i) => {
        const dateStr = new Date(t.deadline).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        reply += `${i + 1}. *${t.title}*\n`;
        reply += `   👉 Join: \`#urun join ${slug} 1\`\n`;
        reply += `   🎯 Target: ${t.target_quantity} unit (Min: ${t.min_quantity})\n`;
        reply += `   📅 Batas: ${dateStr}\n\n`;
      });

      reply += `Ketik \`#kas\` untuk melihat transparansi keuangan Simpul Komunitas.`;
      await sendWhatsappMessage(sender, reply);
      return NextResponse.json({ status: true });
    }

    // Command 2: #urun join [tender_slug] [qty] (Participate in collective procurement)
    const joinRegex = /^#urun\s+join\s+([a-zA-Z0-9-_]+)\s+(\d+)$/i;
    if (joinRegex.test(message)) {
      const match = message.match(joinRegex);
      if (!match) return NextResponse.json({ status: false });

      const tenderSlug = match[1].toLowerCase();
      const qty = parseInt(match[2], 10);

      if (qty <= 0) {
        await sendWhatsappMessage(sender, `❌ Kuantitas partisipasi URUN Dana harus minimal 1 unit.`);
        return NextResponse.json({ status: true });
      }

      // Query the active tender
      const { data: tenders, error: tenderErr } = await supabaseAdmin
        .from('tenders')
        .select('id, title, unit_price_target, current_state')
        .eq('community_id', communityId)
        .in('current_state', ['published', 'subscribing']);

      if (tenderErr || !tenders || tenders.length === 0) {
        await sendWhatsappMessage(sender, `❌ Tidak ada program URUN Dana atau Tender Warga yang aktif.`);
        return NextResponse.json({ status: true });
      }

      // Find the tender that matches the slug
      const tender = tenders.find(t => {
        const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return slug === tenderSlug;
      });

      if (!tender) {
        await sendWhatsappMessage(sender, `❌ Program URUN Dana dengan slug "${tenderSlug}" tidak ditemukan.`);
        return NextResponse.json({ status: true });
      }

      const unitPrice = parseFloat(tender.unit_price_target as unknown as string) || 0;
      const totalAmount = unitPrice * qty;
      const idempotencyKey = crypto.randomUUID();

      // Write transaction using our secure RPC gateway
      const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('process_ledger_entry', {
        p_community_id: communityId,
        p_actor_id: memberId,
        p_tender_id: tender.id,
        p_amount: totalAmount,
        p_direction: 'in',
        p_entry_type: 'tender_contribution',
        p_description: `WhatsApp: URUN Dana ${tender.title} x${qty} unit`,
        p_idempotency_key: idempotencyKey
      });

      if (rpcErr) {
        console.error('❌ RPC Error:', rpcErr);
        await sendWhatsappMessage(sender, `❌ Terjadi kesalahan sistem saat mencatat transaksi Anda.`);
        return NextResponse.json({ status: true });
      }

      const result = rpcResult as any;

      if (result && result.status === 'multisig_required') {
        await sendWhatsappMessage(
          sender,
          `⚠️ *PERSETUJUAN MULTI-SIG DIBUTUHKAN*\n\n` +
          `Partisipasi Anda dalam *${tender.title}* sebanyak ${qty} unit dengan total *${formatIDR(totalAmount)}* telah dicatat.\n\n` +
          `Karena nilai transaksi melebihi ambang batas Multi-Sig komunitas, transaksi dikunci dalam status *PENDING* (Req ID: ${result.multisig_id}) hingga disetujui oleh minimal 2 Pengurus.`
        );
        return NextResponse.json({ status: true });
      }

      if (result && result.status === 'error') {
        await sendWhatsappMessage(sender, `❌ Gagal mencatat transaksi: ${result.message}`);
        return NextResponse.json({ status: true });
      }

      // Record subscription mapping
      const { error: subErr } = await supabaseAdmin
        .from('tender_subscriptions')
        .upsert({
          tender_id: tender.id,
          community_id: communityId,
          member_id: memberId,
          quantity: qty,
          status: 'confirmed'
        }, { onConflict: 'tender_id,member_id' });

      if (subErr) {
        console.error('❌ Subscription mapping err:', subErr);
      }

      // Record interaction log for reputation update
      await supabaseAdmin
        .from('interaction_log')
        .insert({
          community_id: communityId,
          actor_id: memberId,
          action_type: 'tender_participation',
          action_detail: { tender_id: tender.id, qty: qty, amount: totalAmount },
          source_system: 'bot_wa'
        });

      await sendWhatsappMessage(
        sender,
        `✅ *BERHASIL BERGABUNG URUN DANA*\n\n` +
        `Terima kasih *${profile.full_name}*! Anda resmi bergabung dalam program *${tender.title}*.\n\n` +
        `*Rincian Partisipasi:*\n` +
        `• Jumlah: ${qty} unit\n` +
        `• Harga Satuan: ${formatIDR(unitPrice)}\n` +
        `• Total Tagihan: *${formatIDR(totalAmount)}*\n\n` +
        `Transaksi telah sukses dicatat di *Buku Kas Kolektif* (Ledger Immutable).\n` +
        `Silakan lakukan pembayaran tunai/transfer ke Bendahara.`
      );
      return NextResponse.json({ status: true });
    }

    // Command 3: #kas (Show Buku Kas Kolektif summary)
    if (message.toLowerCase() === '#kas') {
      const { data: ledgerEntries, error: ledgerErr } = await supabaseAdmin
        .from('ledger')
        .select('amount, direction, entry_type, description, created_at')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (ledgerErr || !ledgerEntries) {
        await sendWhatsappMessage(sender, `❌ Gagal mengambil mutasi Buku Kas Kolektif.`);
        return NextResponse.json({ status: true });
      }

      let balance = 0;
      ledgerEntries.forEach(entry => {
        const mult = entry.direction === 'in' ? 1 : -1;
        balance += (parseFloat(entry.amount as unknown as string) || 0) * mult;
      });

      let reply = `📊 *BUKU KAS KOLEKTIF*\n`;
      reply += `Simpul Komunitas Transparan & Append-Only\n`;
      reply += `-------------------------------\n`;
      reply += `*Saldo Kas Saat Ini:* *${formatIDR(balance)}*\n\n`;
      reply += `*5 Mutasi Kas Terakhir:*\n`;

      const lastFive = ledgerEntries.slice(0, 5);
      if (lastFive.length === 0) {
        reply += `_(Belum ada mutasi keuangan recorded)_`;
      } else {
        lastFive.forEach((entry, i) => {
          const sign = entry.direction === 'in' ? '🟢 (+)' : '🔴 (-)';
          const dateStr = new Date(entry.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
          });
          reply += `${i + 1}. [${dateStr}] ${sign} *${formatIDR(parseFloat(entry.amount as unknown as string))}*\n`;
          reply += `   _${entry.description || entry.entry_type}_\n`;
        });
      }

      await sendWhatsappMessage(sender, reply);
      return NextResponse.json({ status: true });
    }

    // Command 4: #reputasi (Show member reputation score & logs)
    if (message.toLowerCase() === '#reputasi') {
      const score = member.reputation_score;
      let level = 'Warga Baru 🌟';
      if (score >= 100) level = 'Warga Inspiratif 🏆';
      else if (score >= 30) level = 'Warga Teladan 🎖️';
      else if (score >= 10) level = 'Warga Aktif ⭐';

      const { data: auditLogs, error: logErr } = await supabaseAdmin
        .from('audit_log')
        .select('action, reason, created_at')
        .eq('community_id', communityId)
        .eq('actor_id', memberId)
        .order('created_at', { ascending: false })
        .limit(3);

      let reply = `🎗️ *PORTOFOLIO REPUTASI WARGA*\n`;
      reply += `Akrab, Transparan, & Tanpa Nepotisme\n`;
      reply += `-------------------------------\n`;
      reply += `• Nama: *${profile.full_name}*\n`;
      reply += `• Skor Reputasi: *${score} poin*\n`;
      reply += `• Kategori: *${level}*\n\n`;
      reply += `*3 Riwayat Aktivitas Reputasi:*\n`;

      if (logErr || !auditLogs || auditLogs.length === 0) {
        reply += `_(Skor default komunitas: +10)_`;
      } else {
        auditLogs.forEach((log, i) => {
          const dateStr = new Date(log.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
          });
          reply += `${i + 1}. [${dateStr}] *${log.reason}*\n`;
        });
      }

      await sendWhatsappMessage(sender, reply);
      return NextResponse.json({ status: true });
    }

    // Command 5: #approve [request_id] (Approve Multi-Sig transaction)
    const approveRegex = /^#approve\s+([a-zA-Z0-9-]+)$/i;
    if (approveRegex.test(message)) {
      const match = message.match(approveRegex);
      if (!match) return NextResponse.json({ status: false });

      const requestId = match[1];

      // Verify authorization
      if (!permissions.can_approve_multisig) {
        await sendWhatsappMessage(sender, `❌ *AKSES DITOLAK*\n\nAnda tidak memiliki wewenang Multi-Sig untuk menyetujui pengeluaran keuangan.`);
        return NextResponse.json({ status: true });
      }

      // Query pending multisig request
      const { data: msigReqs, error: msigErr } = await supabaseAdmin
        .from('multisig_requests')
        .select('*')
        .eq('community_id', communityId)
        .eq('status', 'pending')
        .or(`id.eq.${requestId},ledger_ref_id.eq.${requestId}`)
        .limit(1);

      if (msigErr || !msigReqs || msigReqs.length === 0) {
        await sendWhatsappMessage(sender, `❌ Permintaan Multi-Sig pending dengan ID/Referensi "${requestId}" tidak ditemukan.`);
        return NextResponse.json({ status: true });
      }

      const msig = msigReqs[0];
      const approvalsList = Array.isArray(msig.approvals) ? msig.approvals : [];

      // Check if already approved by this member
      const alreadyApproved = approvalsList.some((app: Record<string, string>) => app.member_id === memberId);
      if (alreadyApproved) {
        await sendWhatsappMessage(sender, `⚠️ Anda sudah menyetujui transaksi ini sebelumnya. Menunggu tandatangan pengurus lain.`);
        return NextResponse.json({ status: true });
      }

      // Append new approval
      const updatedApprovals = [...approvalsList, { member_id: memberId, approved_at: new Date().toISOString() }];
      const newSigsCount = msig.current_sigs + 1;
      
      if (newSigsCount >= msig.required_sigs) {
        // Complete the multisig transaction!
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

        // 1. Insert transaction to immutable ledger using admin client (bypassing multisig block)
        const idempotencyKey = crypto.randomUUID();
        const { data: ledgerEntry, error: ledgerErr } = await supabaseAdmin
          .from('ledger')
          .insert({
            community_id: communityId,
            actor_id: msig.requested_by,
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
          console.error('❌ Failed to write ledger on multisig success:', ledgerErr);
          await sendWhatsappMessage(sender, `❌ Gagal memfinalisasi transaksi kas komunitas.`);
          return NextResponse.json({ status: true });
        }

        // 2. Update status and save ledger reference in multisig_requests
        await supabaseAdmin
          .from('multisig_requests')
          .update({
            current_sigs: newSigsCount,
            approvals: updatedApprovals,
            status: 'approved',
            ledger_ref_id: ledgerEntry.id
          })
          .eq('id', msig.id);

        // 3. Log to audit_log
        await supabaseAdmin
          .from('audit_log')
          .insert({
            community_id: communityId,
            actor_id: memberId,
            action: 'multisig_approved',
            table_affected: 'ledger',
            new_value: { ledger_id: ledgerEntry.id, request_id: msig.id, direction, entryType },
            reason: `Multi-sig quorum met (${newSigsCount}/${msig.required_sigs}) via WhatsApp Bot. Atomic ledger insertion completed.`
          });

        await sendWhatsappMessage(
          sender,
          `✅ *TRANSAKSI MULTI-SIG DISETUJUI PERMANEN*\n\n` +
          `Tandatangan Anda telah divalidasi. Kuorum tercapai (*${newSigsCount}/${msig.required_sigs}*).\n\n` +
          `Dana sebesar *${formatIDR(msig.amount)}* resmi ${isOutflow ? 'dicairkan ke supplier' : 'disetorkan ke kas'} Buku Kas Kolektif (Ledger Immutable).\n` +
          `Sistem otomatis memproses pembagian 70/30 secara transparan.`
        );
      } else {
        // Update approval count, still pending
        await supabaseAdmin
          .from('multisig_requests')
          .update({
            current_sigs: newSigsCount,
            approvals: updatedApprovals
          })
          .eq('id', msig.id);

        await sendWhatsappMessage(
          sender,
          `✍️ *TANDATANGAN MULTI-SIG DICATAT*\n\n` +
          `Tandatangan Anda berhasil divalidasi. Saat ini terkumpul (*${newSigsCount}/${msig.required_sigs}*) persetujuan.\n\n` +
          `Menunggu minimal 1 pengurus/saksi lain untuk menyetujui sebelum dana dapat dieksekusi.`
        );
      }
      return NextResponse.json({ status: true });
    }

    // Default: Return help manual if command not recognized
    await sendWhatsappMessage(
      sender,
      `🤖 *ASISTEN BOT URUN*\n\n` +
      `Format perintah tidak dikenal. Gunakan perintah resmi berikut:\n\n` +
      `• *#urun* : Lihat daftar program URUN Dana aktif\n` +
      `• *#urun join [nama-slug] [qty]* : Ikut serta tender kolektif\n` +
      `• *#kas* : Transparansi mutasi Buku Kas Kolektif secara real-time\n` +
      `• *#reputasi* : Cek Skor Reputasi & portofolio warga\n` +
      `• *#approve [request_id]* : Tandatangan Multi-Sig (Khusus Pengurus)`
    );

    return NextResponse.json({ status: true });

  } catch (err) {
    console.error('💥 Webhook Critical Error:', err);
    return NextResponse.json({ status: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
