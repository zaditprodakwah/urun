import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-server';
import { z } from 'zod';
import { checkIdempotency, saveIdempotencyResult } from '@/lib/idempotency';

export const dynamic = 'force-dynamic';

async function verifyAdminAccess(_req: NextRequest) {
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
export async function GET(_req: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess(_req);
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

// Zod schema for rigorous validation
const SettingsSchema = z.object({
  multisig_threshold: z.number().min(0).optional(),
  platform_fee_pct: z.number().min(0).max(100).optional(),
  community_share_pct: z.number().min(0).max(100).optional(),
  revenue_destination_account: z.string().nullable().optional(),
  mode: z.enum(['normal', 'manual']).optional(),
  reputation_alpha: z.number().min(0).max(10).optional(),
  reputation_beta: z.number().min(0).max(10).optional(),
  reputation_gamma: z.number().min(0).max(10).optional(),
});

// PATCH: Update community settings
export async function PATCH(req: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const idempotencyKey = req.headers.get('idempotency-key') || req.headers.get('Idempotency-Key');
    if (!idempotencyKey) {
      return NextResponse.json({ error: 'BAD REQUEST: Header Idempotency-Key wajib disertakan.' }, { status: 400 });
    }

    const { communityId, profileId } = authCheck.session!;
    
    // Idempotency Check
    const idempotencyCheck = await checkIdempotency(supabaseAdmin, idempotencyKey, communityId, '/api/admin/settings');
    if (idempotencyCheck.status !== 'proceed') {
      return NextResponse.json(idempotencyCheck.response_body, { status: idempotencyCheck.response_status });
    }

    const body = await req.json().catch(() => ({}));
    const parsedBody = SettingsSchema.safeParse(body);

    if (!parsedBody.success) {
      const errorMsg = 'Validasi parameter gagal: ' + parsedBody.error.issues.map(e => e.path.join('.') + ' ' + e.message).join(', ');
      await saveIdempotencyResult(supabaseAdmin, idempotencyKey, 400, { error: errorMsg });
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const payload = parsedBody.data;

    // Fetch existing settings
    const { data: community, error: fetchErr } = await supabaseAdmin
      .from('communities')
      .select('settings, name')
      .eq('id', communityId)
      .single();

    if (fetchErr || !community) {
      await saveIdempotencyResult(supabaseAdmin, idempotencyKey, 404, { error: 'Komunitas tidak ditemukan.' });
      return NextResponse.json({ error: 'Komunitas tidak ditemukan.' }, { status: 404 });
    }

    const existingSettings = community.settings || {};
    
    // Merge Settings
    const updatedSettings = {
      ...existingSettings,
      ...payload,
    };

    // Ensure sum of platform_fee and community_share is exactly 100% (if provided)
    if (updatedSettings.platform_fee_pct !== undefined && updatedSettings.community_share_pct !== undefined) {
      if (updatedSettings.platform_fee_pct + updatedSettings.community_share_pct !== 100) {
        const errObj = { error: 'Platform Fee % dan Community Share % harus berjumlah tepat 100%.' };
        await saveIdempotencyResult(supabaseAdmin, idempotencyKey, 400, errObj);
        return NextResponse.json(errObj, { status: 400 });
      }
    }

    // Update settings in database
    const { error: updateErr } = await supabaseAdmin
      .from('communities')
      .update({ settings: updatedSettings })
      .eq('id', communityId);

    if (updateErr) {
      console.error('❌ Failed to update community settings:', updateErr);
      const errObj = { error: 'Gagal memperbarui pengaturan komunitas.' };
      await saveIdempotencyResult(supabaseAdmin, idempotencyKey, 500, errObj);
      return NextResponse.json(errObj, { status: 500 });
    }

    // Log to audit_log
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: communityId,
        actor_id: profileId,
        action: 'settings_changed',
        table_affected: 'communities',
        reason: 'Pengurus mengubah pengaturan global komunitas melalui Dasbor (Zod Validated).',
        new_value: { old_settings: existingSettings, new_settings: updatedSettings }
      });

    const successResponse = {
      status: true,
      message: 'Pengaturan komunitas berhasil diperbarui.',
      settings: updatedSettings
    };

    await saveIdempotencyResult(supabaseAdmin, idempotencyKey, 200, successResponse);

    return NextResponse.json(successResponse, { status: 200 });

  } catch (err: any) {
    console.error('💥 Settings PATCH critical error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
