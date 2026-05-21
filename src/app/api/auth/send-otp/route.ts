import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

// Fonnte messenger helper
async function sendWhatsappOTP(phone: string, otp: string) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.error('❌ FONNTE_TOKEN is missing in environment!');
    return false;
  }

  const message = `🔐 *KODE OTP URUN*\n\n` +
    `Kode verifikasi Anda adalah: *${otp}*\n\n` +
    `Berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun demi keamanan akun warga Anda.`;

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: new URLSearchParams({
        target: phone,
        message: message,
      }),
    });

    const data = await res.json();
    return !!data.status;
  } catch (err) {
    console.error('❌ Failed to send WhatsApp OTP:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ status: false, error: 'Nomor WhatsApp wajib diisi' }, { status: 400 });
    }

    // Format phone to standard starting with 62 or 08
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '628' + formattedPhone.slice(2);
    } else if (formattedPhone.startsWith('+628')) {
      formattedPhone = '628' + formattedPhone.slice(4);
    }

    // Find profile in profiles table by phone or contact_info
    // Sesuai rules: member harus terdaftar di profiles terlebih dahulu
    // Profiles table has a 'phone' column (added in 003 migration) or contact_info
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
      console.warn(`⚠️ Phone ${formattedPhone} is not registered in profiles`);
      return NextResponse.json({ 
        status: false, 
        error: 'Nomor WhatsApp Anda belum terdaftar di Simpul Komunitas URUN. Hubungi Pengurus RT/RW Anda.' 
      }, { status: 404 });
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

    // Generate 6-digit cryptographically secure OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Hash OTP using a simple SHA-256 hash (or bcrypt-alternative)
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes TTL

    // Store in otp_sessions table
    const { error: otpErr } = await supabaseAdmin
      .from('otp_sessions')
      .insert({
        phone: formattedPhone,
        otp_hash: otpHash,
        community_id: citizen.community_id,
        expires_at: expiresAt,
        used: false
      });

    if (otpErr) {
      console.error('❌ Failed to store OTP session:', otpErr);
      return NextResponse.json({ status: false, error: 'Gagal membuat sesi OTP' }, { status: 500 });
    }

    // Send OTP via WhatsApp
    console.log(`📤 Sending OTP to ${formattedPhone} (Citizen: ${citizen.name})...`);
    const sent = await sendWhatsappOTP(formattedPhone, otp);

    // For local development and fallback/testing, print to terminal
    console.log(`🔑 [OTP DEV BYPASS] Phone: ${formattedPhone} | Code: ${otp}`);

    return NextResponse.json({ 
      status: true, 
      message: 'Kode OTP telah dikirim melalui WhatsApp',
      // Return OTP only in dev mode bypass for debugging if needed, but not returned for prod
      devBypass: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (err: any) {
    console.error('💥 OTP generation critical error:', err);
    return NextResponse.json({ status: false, error: err.message }, { status: 500 });
  }
}
