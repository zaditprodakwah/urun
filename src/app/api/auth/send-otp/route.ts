import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendWhatsappMessageAsync, formatPhoneNumber } from '@/lib/whatsapp';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;
    
    if (!phone) {
      return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi' }, { status: 400 });
    }

    const formattedPhone = formatPhoneNumber(phone);

    // 1. Kedaulatan Profil: Pastikan nomor terdaftar di Sovereign Core
    let { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('phone', formattedPhone)
      .single();

    if (error || !profile) {
      console.log(`Auto-registering phone number: ${formattedPhone}`);
      const shadowEmail = `${formattedPhone}@warga.urun.local`;
      const fullName = formattedPhone === '6282316363177' ? 'Muh Zadit' : 'Warga Baru (Auto)';

      try {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        let authUser = listData?.users?.find(u => u.phone === formattedPhone || u.email === shadowEmail);

        if (!authUser) {
          const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email: shadowEmail,
            phone: formattedPhone,
            email_confirm: true,
            phone_confirm: true,
            user_metadata: { full_name: fullName }
          });
          if (createErr) {
            console.error('Shadow Account Creation failed:', createErr);
            return NextResponse.json({ error: 'Nomor WhatsApp Anda belum terdaftar. Silakan hubungi Pengurus Lingkungan.' }, { status: 404 });
          }
          authUser = createData.user;
        }

        if (authUser) {
          // Insert into profiles
          await supabaseAdmin.from('profiles').insert({
            id: authUser.id,
            full_name: fullName,
            phone: formattedPhone,
            global_role: 'user'
          });

          // Insert into community_members
          await supabaseAdmin.from('community_members').insert({
            profile_id: authUser.id,
            community_id: 'demo-community-id',
            role: 'warga',
            reputation_score: 10
          });

          // Re-fetch profile
          const { data: newProfile } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name')
            .eq('id', authUser.id)
            .single();
          profile = newProfile;
        }
      } catch (regErr: any) {
        console.error('Auto-registration failed:', regErr);
        return NextResponse.json({ error: 'Nomor WhatsApp Anda belum terdaftar. Silakan hubungi Pengurus Lingkungan.' }, { status: 404 });
      }
    }

    // 2. Buat Tantangan OTP (6 Digit Angka Numerik)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const idempotencyKey = crypto.randomUUID();
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 3);

    const { error: insertErr } = await supabaseAdmin
      .from('otp_challenges')
      .insert({
        phone: formattedPhone,
        otp_hash: otpHash,
        idempotency_key: idempotencyKey,
        expires_at: expiresAt.toISOString()
      });

    if (insertErr) {
      console.error('Insert OTP Error:', insertErr);
      return NextResponse.json({ error: 'Terjadi kegagalan sistem saat mencatat sesi keamanan.' }, { status: 500 });
    }

    // 3. Kirim via Fonnte Gateway secara Asinkron
    const msg = `*URUN DANA - KODE KEAMANAN*\n\nHalo ${profile?.full_name || 'Tetangga'}, kode masuk Anda adalah:\n\n*${otp}*\n\nJANGAN berikan kode ini kepada siapapun, termasuk pengurus. Kode hanya berlaku selama 3 menit.`;
    sendWhatsappMessageAsync(formattedPhone, msg);

    return NextResponse.json({ success: true, message: 'OTP berhasil dikirim ke WhatsApp Anda.' });

  } catch (err: any) {
    console.error('Send OTP Critical Error:', err);
    return NextResponse.json({ error: 'Terjadi kegagalan komunikasi internal.' }, { status: 500 });
  }
}
