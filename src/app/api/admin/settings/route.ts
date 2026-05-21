import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function verifyAdminAccess(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return { error: 'UNAUTHORIZED: Silakan login terlebih dahulu.', status: 401 };
  }
  if (session.role !== 'admin' && session.role !== 'pengurus') {
    return { error: 'FORBIDDEN: Hanya Admin atau Pengurus yang memiliki akses.', status: 403 };
  }
  return { session };
}

// GET: Fetch community settings
export async function GET(req: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { communityId } = authCheck.session!;

    const { data: community, error } = await supabaseAdmin
      .from('communities')
      .select('id, name, slug, settings, geo_context')
      .eq('id', communityId)
      .single();

    if (error || !community) {
      console.error('❌ Failed to fetch community:', error);
      return NextResponse.json({ error: 'Komunitas tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ status: true, community });
  } catch (err: any) {
    console.error('💥 Settings GET critical error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update community settings
export async function PATCH(req: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { communityId, profileId } = authCheck.session!;
    const body = await req.json().catch(() => ({}));
    const { multisig_threshold, platform_fee_pct, community_share_pct, revenue_destination_account } = body;

    // Fetch existing settings
    const { data: community, error: fetchErr } = await supabaseAdmin
      .from('communities')
      .select('settings, name')
      .eq('id', communityId)
      .single();

    if (fetchErr || !community) {
      return NextResponse.json({ error: 'Komunitas tidak ditemukan.' }, { status: 404 });
    }

    const existingSettings = community.settings || {};
    
    // Validate inputs
    const updatedSettings = {
      ...existingSettings,
      multisig_threshold: typeof multisig_threshold === 'number' ? multisig_threshold : existingSettings.multisig_threshold,
      platform_fee_pct: typeof platform_fee_pct === 'number' ? platform_fee_pct : existingSettings.platform_fee_pct,
      community_share_pct: typeof community_share_pct === 'number' ? community_share_pct : existingSettings.community_share_pct,
      revenue_destination_account: typeof revenue_destination_account === 'string' ? revenue_destination_account : existingSettings.revenue_destination_account,
    };

    // Ensure sum of platform_fee and community_share is exactly 100%
    if (updatedSettings.platform_fee_pct + updatedSettings.community_share_pct !== 100) {
      return NextResponse.json({ error: 'Platform Fee % dan Community Share % harus berjumlah tepat 100%.' }, { status: 400 });
    }

    // Update settings in database
    const { error: updateErr } = await supabaseAdmin
      .from('communities')
      .update({ settings: updatedSettings })
      .eq('id', communityId);

    if (updateErr) {
      console.error('❌ Failed to update community settings:', updateErr);
      return NextResponse.json({ error: 'Gagal memperbarui pengaturan komunitas.' }, { status: 500 });
    }

    // Log to audit_log
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: communityId,
        actor_id: profileId,
        action: 'settings_changed',
        table_affected: 'communities',
        reason: `Pengurus mengubah pengaturan global komunitas: Threshold Multi-Sig = ${updatedSettings.multisig_threshold}, Split Kas = ${updatedSettings.community_share_pct}/${updatedSettings.platform_fee_pct}.`,
        new_value: { old_settings: existingSettings, new_settings: updatedSettings }
      });

    return NextResponse.json({
      status: true,
      message: 'Pengaturan komunitas berhasil diperbarui.',
      settings: updatedSettings
    });

  } catch (err: any) {
    console.error('💥 Settings PATCH critical error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
