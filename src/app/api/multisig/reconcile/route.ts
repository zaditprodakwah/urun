import { NextRequest, NextResponse } from 'next/server';
import { runLedgerReconciliation } from '@/lib/automation/reconcile_ledger';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

async function handleReconcile(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error('❌ CRON_SECRET is missing in environment!');
      return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
    }

    const isCronTrigger = authHeader === `Bearer ${cronSecret}`;

    if (isCronTrigger) {
      console.log('⏰ Reconcile API triggered via secure Vercel Cron Job token.');
      
      // Fetch all active communities and reconcile them sequentially
      const { data: communities, error } = await supabaseAdmin
        .from('communities')
        .select('id, name')
        .eq('is_active', true);

      if (error || !communities) {
        console.error('❌ Failed to fetch active communities for global cron audit:', error);
        return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
      }

      const results = [];
      for (const community of communities) {
        console.log(`Reconciling ledger for community: ${community.name} (${community.id})`);
        const result = await runLedgerReconciliation(community.id);
        results.push({ community: community.name, ...result });
      }

      return NextResponse.json({ status: true, trigger: 'cron', results }, { status: 200 });
    }

    // 2. Check user session authentication (for manual trigger from UI)
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Silakan login terlebih dahulu.' }, { status: 401 });
    }

    if (session.role !== 'pengurus' && session.role !== 'admin') {
      return NextResponse.json({ error: 'FORBIDDEN: Hanya Admin/Pengurus yang dapat melakukan audit kas.' }, { status: 403 });
    }

    console.log(`👤 Manual reconcile triggered by ${session.name} (${session.role}) for community ${session.communityId}`);
    
    // Run reconciliation only for the user's community
    const result = await runLedgerReconciliation(session.communityId);
    return NextResponse.json({ status: true, trigger: 'manual', ...result }, { status: 200 });

  } catch (err: any) {
    console.error('[Reconcile API Route Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleReconcile(req);
}

export async function POST(req: NextRequest) {
  return handleReconcile(req);
}
