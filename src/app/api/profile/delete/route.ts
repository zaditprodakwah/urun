import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Silakan login terlebih dahulu.' }, { status: 401 });
    }

    const { profileId, communityId } = session;

    // 1. Audit log the deletion request before removing PII data
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: communityId,
        actor_id: profileId,
        action: 'account_deletion_requested',
        table_affected: 'profiles',
        reason: 'Citizen invoked their Right to be Forgotten (UU PDP Compliance). Anonymizing profile data.',
        new_value: { anonymized_at: new Date().toISOString() }
      });

    // 2. Anonymize the profiles table record
    const { error: anonErr } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: 'Warga Anonim URUN',
        phone: null,
        avatar_url: null,
        consent_timestamp: null,
        consent_version: null
      })
      .eq('id', profileId);

    if (anonErr) {
      console.error('❌ Failed to anonymize profile:', anonErr);
      return NextResponse.json({ error: 'Gagal menganonimkan data profil Anda' }, { status: 500 });
    }

    // 3. Optional: Delete synthetic auth user to prevent subsequent logins
    try {
      await supabaseAdmin.auth.admin.deleteUser(profileId);
      console.log(`✅ Deleted synthetic auth user: ${profileId}`);
    } catch (authDelErr) {
      console.warn(`⚠️ Warning: could not delete auth user:`, authDelErr);
    }

    // 4. Create response and clear session cookie immediately
    const response = NextResponse.json({
      status: true,
      message: 'Akun Anda berhasil dihapus dan dianonymize sesuai UU PDP Nomor 27 Tahun 2022.'
    });

    response.cookies.set('urun_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (err: any) {
    console.error('💥 Data deletion critical error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
