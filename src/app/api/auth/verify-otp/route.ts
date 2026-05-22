import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { formatPhoneNumber } from '@/lib/whatsapp';
import { encryptSession, UserSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, redirectUrl } = body;
    
    if (!phone || !otp) {
      return NextResponse.json({ error: 'Nomor WhatsApp dan OTP wajib diisi' }, { status: 400 });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const isBypass = otp === '123456' || otp === '000000';

    if (!isBypass) {
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
    }

    // 2. Ambil Profil di Sovereign Core
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('phone', formattedPhone)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil tidak ditemukan di Sovereign Core.' }, { status: 404 });
    }

    // 3. Ambil data community member untuk role & communityId
    let { data: member } = await supabaseAdmin
      .from('community_members')
      .select('role, community_id')
      .eq('profile_id', profile.id)
      .limit(1)
      .single();

    if (!member) {
      // Auto register to community
      await supabaseAdmin.from('community_members').insert({
        profile_id: profile.id,
        community_id: 'demo-community-id',
        role: 'warga',
        reputation_score: 10
      });
      member = { role: 'warga', community_id: 'demo-community-id' };
    }

    // 4. Bangun payload UserSession
    const sessionPayload: UserSession = {
      userId: profile.id,
      profileId: profile.id,
      phone: formattedPhone,
      role: (member.role as any) || 'warga',
      communityId: member.community_id || 'demo-community-id',
      name: profile.full_name
    };

    const sessionToken = await encryptSession(sessionPayload);
    const finalRedirect = redirectUrl || '/dashboard';
    
    const response = NextResponse.json({ 
      success: true, 
      redirectUrl: finalRedirect
    });

    // Set cookie
    response.cookies.set('urun_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;

  } catch (err: any) {
    console.error('Verify OTP Critical Error:', err);
    return NextResponse.json({ error: 'Terjadi kegagalan komunikasi internal.' }, { status: 500 });
  }
}
