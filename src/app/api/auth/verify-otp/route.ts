import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { formatPhoneNumber } from '@/lib/whatsapp';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, redirectUrl } = body;
    
    if (!phone || !otp) {
      return NextResponse.json({ error: 'Nomor WhatsApp dan OTP wajib diisi' }, { status: 400 });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // 1. Verifikasi Hash OTP
    const { data: challenges, error: challengeErr } = await supabaseAdmin
      .from('otp_challenges')
      .select('id, expires_at')
      .eq('phone', formattedPhone)
      .eq('otp_hash', otpHash)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (challengeErr || !challenges || challenges.length === 0) {
      return NextResponse.json({ error: 'Kode OTP tidak valid atau sudah kedaluwarsa. Silakan minta kode baru.' }, { status: 401 });
    }

    const challengeId = challenges[0].id;

    // Hapus OTP agar tidak bisa digunakan ulang (Single-Use)
    await supabaseAdmin.from('otp_challenges').delete().eq('id', challengeId);

    // 2. Eksekusi Shadow Email Logic untuk Pembuatan Sesi
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('phone', formattedPhone)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil tidak ditemukan di Sovereign Core.' }, { status: 404 });
    }

    const shadowEmail = `${formattedPhone}@warga.urun.local`;
    let targetEmail = shadowEmail;

    // Periksa eksistensi pengguna di sistem auth.users
    const { data: authUser, error: authUserErr } = await supabaseAdmin.auth.admin.getUserById(profile.id);

    if (authUserErr || !authUser.user) {
      // Warga belum memiliki akun di auth.users (Shadow Account Creation)
      const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: shadowEmail,
        phone: formattedPhone,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: { full_name: profile.full_name }
      });

      if (createErr) {
        // Coba periksa apakah email/phone sudah terikat pada UID lain
        console.error('Shadow Account Creation fallback needed:', createErr);
      }
    } else {
      // Warga sudah ada. Gunakan email aslinya jika punya, atau update dengan shadow email jika kosong
      targetEmail = authUser.user.email || shadowEmail;
      
      if (!authUser.user.email) {
        await supabaseAdmin.auth.admin.updateUserById(profile.id, { 
          email: shadowEmail, 
          email_confirm: true 
        });
      }
    }

    // 3. Terbitkan Sesi via Magic Link Hack
    const finalRedirect = redirectUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`;
    
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: targetEmail,
      options: {
        redirectTo: finalRedirect
      }
    });

    if (linkErr || !linkData.properties?.action_link) {
      console.error('Magic Link Hack Failed:', linkErr);
      return NextResponse.json({ error: 'Gagal membangun terowongan sesi aman (Session Tunnel Error).' }, { status: 500 });
    }

    // Berikan tautan aksi ke client. Client akan langsung menggunakan URL ini untuk menginjeksi cookies.
    return NextResponse.json({ 
      success: true, 
      sessionUrl: linkData.properties.action_link 
    });

  } catch (err: any) {
    console.error('Verify OTP Critical Error:', err);
    return NextResponse.json({ error: 'Terjadi kegagalan komunikasi internal.' }, { status: 500 });
  }
}
