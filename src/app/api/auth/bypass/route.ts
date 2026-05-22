import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { formatPhoneNumber } from '@/lib/whatsapp';
import { encryptSession, UserSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, email, role: requestedRole } = body;

    let targetPhone = phone ? formatPhoneNumber(phone) : null;
    let targetEmail = email ? email.trim().toLowerCase() : null;

    let profileId = '';
    let fullName = '';
    let actualRole: 'warga' | 'pengurus' | 'admin' = 'warga';
    let communityId = 'demo-community-id';

    // 1. Resolve User/Profile by phone or email
    if (targetPhone) {
      // Find or create profile by phone
      let { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('phone', targetPhone)
        .single();

      if (!profile) {
        // Auto create profile
        fullName = targetPhone === '6282316363177' ? 'Muh Zadit (WA Bypass)' : 'Warga Demo Instan';
        const shadowEmail = `${targetPhone}@warga.urun.local`;

        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        let authUser = listData?.users?.find(u => u.phone === targetPhone || u.email === shadowEmail);

        if (!authUser) {
          const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email: shadowEmail,
            phone: targetPhone,
            email_confirm: true,
            phone_confirm: true,
            user_metadata: { full_name: fullName }
          });
          if (createErr) throw createErr;
          authUser = createData.user;
        }

        if (authUser) {
          profileId = authUser.id;
          await supabaseAdmin.from('profiles').insert({
            id: authUser.id,
            full_name: fullName,
            phone: targetPhone,
            global_role: requestedRole || 'user'
          });

          await supabaseAdmin.from('community_members').insert({
            profile_id: authUser.id,
            community_id: communityId,
            role: requestedRole === 'admin' || requestedRole === 'pengurus' ? requestedRole : 'warga',
            reputation_score: 10
          });
        }
      } else {
        profileId = profile.id;
        fullName = profile.full_name;
      }
    } else if (targetEmail) {
      // Find or create by email
      fullName = targetEmail === 'muhzadit@gmail.com' ? 'Muh Zadit (Email Bypass)' : 'User Demo Instan';
      
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      let authUser = listData?.users?.find(u => u.email === targetEmail);

      if (!authUser) {
        const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: targetEmail,
          email_confirm: true,
          user_metadata: { full_name: fullName }
        });
        if (createErr) throw createErr;
        authUser = createData.user;
      }

      if (authUser) {
        profileId = authUser.id;
        
        let { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!profile) {
          await supabaseAdmin.from('profiles').insert({
            id: authUser.id,
            full_name: fullName,
            global_role: requestedRole || 'user'
          });

          await supabaseAdmin.from('community_members').insert({
            profile_id: authUser.id,
            community_id: communityId,
            role: requestedRole === 'admin' || requestedRole === 'pengurus' ? requestedRole : 'warga',
            reputation_score: 10
          });
        } else {
          fullName = profile.full_name;
        }
      }
    } else {
      return NextResponse.json({ error: 'WhatsApp atau Email wajib diisi' }, { status: 400 });
    }

    // 2. Query community member details to get their actual role
    const { data: member } = await supabaseAdmin
      .from('community_members')
      .select('role, community_id')
      .eq('profile_id', profileId)
      .limit(1)
      .single();

    if (member) {
      actualRole = member.role as any;
      communityId = member.community_id;
    } else {
      // Ensure community_member exists
      await supabaseAdmin.from('community_members').insert({
        profile_id: profileId,
        community_id: communityId,
        role: requestedRole === 'admin' || requestedRole === 'pengurus' ? requestedRole : 'warga',
        reputation_score: 10
      });
      actualRole = requestedRole === 'admin' || requestedRole === 'pengurus' ? requestedRole : 'warga';
    }

    // 3. Encrypt session
    const sessionPayload: UserSession = {
      userId: profileId,
      profileId: profileId,
      phone: targetPhone || '',
      role: actualRole,
      communityId: communityId,
      name: fullName
    };

    const sessionToken = await encryptSession(sessionPayload);

    // 4. Set cookie and redirect
    const finalRedirect = '/dashboard';
    const response = NextResponse.json({ 
      success: true, 
      redirectUrl: finalRedirect
    });

    response.cookies.set('urun_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;

  } catch (err: any) {
    console.error('Bypass Auth Critical Error:', err);
    return NextResponse.json({ error: err.message || 'Terjadi kegagalan komunikasi internal.' }, { status: 500 });
  }
}
