import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Silakan login terlebih dahulu.' }, { status: 401 });
    }

    const { profileId, communityId } = session;

    // 1. Fetch profile metadata
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    // 2. Fetch community membership
    const { data: membership } = await supabaseAdmin
      .from('community_members')
      .select('*, communities(*)')
      .eq('profile_id', profileId)
      .eq('community_id', communityId)
      .single();

    // 3. Fetch ledger entries contributed/acted by the user
    const { data: contributions } = await supabaseAdmin
      .from('ledger')
      .select('*')
      .eq('actor_id', profileId)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    // 4. Fetch sensitive audit logs involving the actor
    const { data: auditLogs } = await supabaseAdmin
      .from('audit_log')
      .select('*')
      .eq('actor_id', profileId)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    // Compile GDPR / UU PDP data portability packet
    const dataPacket = {
      export_timestamp: new Date().toISOString(),
      app: 'URUN Warga Platform',
      law_compliance: 'Indonesian UU PDP Nomor 27 Tahun 2022 (Right to Portability)',
      citizen_identity: {
        profile_id: profileId,
        full_name: profile?.full_name || '',
        phone_number: profile?.phone || '',
        avatar_url: profile?.avatar_url || null,
        registered_at: profile?.created_at || null,
        consent: {
          version: profile?.consent_version || null,
          timestamp: profile?.consent_timestamp || null,
        }
      },
      community_context: {
        community_id: communityId,
        slug: membership?.communities?.slug || '',
        community_name: membership?.communities?.name || '',
        role_in_community: membership?.role || 'warga',
        reputation_score: membership?.reputation_score || 10,
        joined_at: membership?.joined_at || null,
      },
      contributions_ledger: contributions || [],
      audit_trail: auditLogs || []
    };

    return new NextResponse(JSON.stringify(dataPacket, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="urun_export_${profileId}.json"`,
      },
    });

  } catch (err: any) {
    console.error('💥 Data export critical error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
