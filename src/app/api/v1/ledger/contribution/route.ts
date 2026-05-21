import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createHmac } from 'crypto';

export const dynamic = 'force-dynamic';

const SHARED_SECRET = process.env.SESSION_SECRET || 'RahasiaUrunWargaSessionSecretFallback2026!';

export async function POST(req: NextRequest) {
  try {
    // 1. Read raw body text for accurate HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-urun-signature') || req.headers.get('X-Urun-Signature');

    if (!signature) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Header "x-urun-signature" tidak ditemukan.' 
      }, { status: 401 });
    }

    // 2. Validate HMAC-SHA256 signature
    const expectedSignature = createHmac('sha256', SHARED_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('❌ HMAC verification failed for external contribution request.');
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Tanda tangan HMAC tidak cocok.' 
      }, { status: 401 });
    }

    // 3. Parse verified JSON payload
    let payload: {
      community_id?: string;
      actor_phone?: string;
      amount?: number;
      tender_id?: string;
      description?: string;
      idempotency_key?: string;
    };
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'BAD REQUEST: Format JSON tidak valid.' }, { status: 400 });
    }

    const { 
      community_id, 
      actor_phone, 
      amount, 
      tender_id, 
      description, 
      idempotency_key 
    } = payload;

    // Validate essential parameters
    if (!community_id || !actor_phone || !amount || !tender_id || !idempotency_key) {
      return NextResponse.json({ 
        error: 'BAD REQUEST: Parameter wajib tidak lengkap (community_id, actor_phone, amount, tender_id, idempotency_key).' 
      }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'BAD REQUEST: Jumlah kontribusi harus positif.' }, { status: 400 });
    }

    // 4. Resolve registered community member profile by phone
    // Ensure standard formatting compatibility
    const phoneNormal = actor_phone.trim();
    const phones = [phoneNormal];
    if (phoneNormal.startsWith('08')) {
      phones.push('628' + phoneNormal.slice(2));
      phones.push('+628' + phoneNormal.slice(2));
    } else if (phoneNormal.startsWith('628')) {
      phones.push('08' + phoneNormal.slice(3));
      phones.push('+628' + phoneNormal.slice(3));
    }

    const { data: memberData, error: memberErr } = await supabaseAdmin
      .from('community_members')
      .select(`
        id,
        community_id,
        profiles!inner (
          id,
          full_name,
          phone
        )
      `)
      .eq('community_id', community_id)
      .in('profiles.phone', phones)
      .limit(1);

    if (memberErr || !memberData || memberData.length === 0) {
      console.warn(`⚠️ Phone ${phoneNormal} is not registered in community ${community_id}.`);
      return NextResponse.json({ 
        error: `NOT FOUND: Nomor HP "${phoneNormal}" tidak terdaftar di simpul komunitas ini.` 
      }, { status: 404 });
    }

    const member = memberData[0];
    const memberId = member.id;
    const profile = member.profiles as unknown as { full_name: string };

    // 5. Invoke the secure database process_ledger_entry RPC
    const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('process_ledger_entry', {
      p_community_id: community_id,
      p_actor_id: memberId,
      p_tender_id: tender_id,
      p_amount: amount,
      p_direction: 'in',
      p_entry_type: 'tender_contribution',
      p_description: description || `Pihak Ketiga: Kontribusi Kas Digital (${profile.full_name})`,
      p_idempotency_key: idempotency_key
    });

    if (rpcErr) {
      console.error('❌ Supabase RPC process_ledger_entry failed:', rpcErr);
      return NextResponse.json({ error: rpcErr.message }, { status: 400 });
    }

    const result = rpcResult as { status: string; message: string; multisig_id?: string; ledger_id?: string } | null;

    if (!result) {
      return NextResponse.json({ error: 'Gagal memproses kontribusi kas.' }, { status: 500 });
    }

    if (result.status === 'multisig_required') {
      console.log(`📡 Third-party contribution redirected to Multi-Sig request ID: ${result.multisig_id}`);
      return NextResponse.json({
        status: 'multisig_required',
        message: 'Kontribusi berhasil diterima tetapi memerlukan persetujuan Multi-Sig pengurus karena melebihi batas batas ambang.',
        multisig_id: result.multisig_id
      }, { status: 202 });
    }

    if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    console.log(`✅ Third-party contribution successfully committed to ledger. ID: ${result.ledger_id}`);
    
    // Automatically trigger an interaction log for reputation triggers
    await supabaseAdmin
      .from('interaction_log')
      .insert({
        community_id: community_id,
        actor_id: memberId,
        action_type: 'tender_participation',
        action_detail: { amount, tender_id, source: 'third_party_gateway' },
        source_system: 'api_gateway'
      });

    return NextResponse.json({
      status: 'success',
      message: 'Kontribusi kas sukses diposting ke Buku Kas Kolektif (Ledger).',
      ledger_id: result.ledger_id,
      member: {
        name: profile.full_name,
        phone: phoneNormal
      }
    }, { status: 201 });

  } catch (err) {
    console.error('💥 Ledger Contribution API Critical Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
