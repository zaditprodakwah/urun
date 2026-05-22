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
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('phone', formattedPhone)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Nomor WhatsApp Anda belum terdaftar. Silakan hubungi Pengurus Lingkungan.' }, { status: 404 });
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
    const msg = `*URUN DANA - KODE KEAMANAN*\n\nHalo ${profile.full_name}, kode masuk Anda adalah:\n\n*${otp}*\n\nJANGAN berikan kode ini kepada siapapun, termasuk pengurus. Kode hanya berlaku selama 3 menit.`;
    sendWhatsappMessageAsync(formattedPhone, msg);

    return NextResponse.json({ success: true, message: 'OTP berhasil dikirim ke WhatsApp Anda.' });

  } catch (err: any) {
    console.error('Send OTP Critical Error:', err);
    return NextResponse.json({ error: 'Terjadi kegagalan komunikasi internal.' }, { status: 500 });
  }
}
