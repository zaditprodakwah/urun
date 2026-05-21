import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';
import { encryptSession } from '@/lib/auth';
import { formatPhoneNumber } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ status: false, error: 'Nomor WhatsApp dan OTP wajib diisi' }, { status: 400 });
    }

    const formattedPhone = formatPhoneNumber(phone);

    // 1. Brute-Force Protection (Max 5 failed attempts in the last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count: failedCount, error: countErr } = await supabaseAdmin
      .from('audit_log')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'otp_verify_failed')
      .eq('reason', `otp_verify_failed:${formattedPhone}`)
      .gt('created_at', fiveMinutesAgo);

    if (!countErr && failedCount !== null && failedCount >= 5) {
      return NextResponse.json({
        status: false,
        error: 'Nomor Anda diblokir sementara karena terlalu banyak memasukkan OTP salah. Silakan coba lagi dalam 5 menit.'
      }, { status: 429 });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');

    // Query valid OTP session
    const { data: otpData, error: otpErr } = await supabaseAdmin
      .from('otp_sessions')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('otp_hash', hashedOtp)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpErr || !otpData || otpData.length === 0) {
      // Record failed attempt in audit_log
      await supabaseAdmin
        .from('audit_log')
        .insert({
          action: 'otp_verify_failed',
          table_affected: 'otp_sessions',
          reason: `otp_verify_failed:${formattedPhone}`,
          new_value: { phone: formattedPhone, attemptedAt: new Date().toISOString() }
        });

      return NextResponse.json({ status: false, error: 'Kode OTP tidak valid atau telah kedaluwarsa' }, { status: 400 });
    }

    const otpSession = otpData[0];

    // Mark OTP as used
    await supabaseAdmin
      .from('otp_sessions')
      .update({ used: true })
      .eq('id', otpSession.id);

    // Fetch corresponding profile and join community_members
    const { data: profiles, error: profErr } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        full_name,
        phone,
        community_members (
          community_id,
          role
        )
      `)
      .or(`phone.eq.${formattedPhone},phone.eq.0${formattedPhone.slice(2)}`)
      .limit(1);

    if (profErr || !profiles || profiles.length === 0) {
      return NextResponse.json({ status: false, error: 'Profil tidak ditemukan' }, { status: 404 });
    }

    const profileObj = profiles[0];
    const memberObj = profileObj.community_members?.[0];

    if (!memberObj) {
      return NextResponse.json({
        status: false,
        error: 'Akun Anda belum terdaftar sebagai anggota komunitas manapun.'
      }, { status: 403 });
    }

    const citizen = {
      id: profileObj.id,
      name: profileObj.full_name,
      phone: profileObj.phone,
      community_id: memberObj.community_id,
      role: memberObj.role
    };

    // Log login action to audit_log
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: citizen.community_id,
        actor_id: citizen.id,
        action: 'user_login',
        table_affected: 'profiles',
        reason: 'User authenticated successfully via custom WhatsApp OTP validation.',
        new_value: { phone: formattedPhone, role: citizen.role }
      });

    // Create session payload
    const sessionPayload = {
      userId: citizen.id,
      profileId: citizen.id,
      phone: formattedPhone,
      role: citizen.role,
      communityId: citizen.community_id,
      name: citizen.name
    };

    // Encrypt the session payload to a secure JWT using jose
    const encryptedToken = await encryptSession(sessionPayload);

    const response = NextResponse.json({
      status: true,
      message: 'Login berhasil',
      session: sessionPayload
    });

    // Save signed JWT in HTTP-only cookie
    response.cookies.set('urun_session', encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (err: any) {
    console.error('💥 OTP verification critical error:', err);
    return NextResponse.json({ status: false, error: err.message }, { status: 500 });
  }
}
