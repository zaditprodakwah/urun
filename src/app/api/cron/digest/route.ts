import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendWeeklyDigest } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Validate CRON_SECRET
    const authHeader = req.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      console.error('❌ CRON_SECRET environment variable is missing!');
      return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
    }
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('⏰ Triggering Weekly Digest Cron...');

    // Fetch active communities
    const { data: communities, error: commErr } = await supabaseAdmin
      .from('communities')
      .select('id, name')
      .eq('is_active', true);

    if (commErr || !communities) {
      console.error('Failed to fetch communities:', commErr);
      return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
    }

    let totalDigestsSent = 0;

    for (const community of communities) {
      // 1. Calculate stats for the community
      
      // Total Warga
      const { count: totalWarga } = await supabaseAdmin
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', community.id);

      // Active Tenders
      const { count: activeTenders } = await supabaseAdmin
        .from('tenders')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', community.id)
        .in('current_state', ['published', 'subscribing', 'fulfilled']);

      // Treasury Balance (sum of 'in' minus 'out')
      const { data: ledgerIn } = await supabaseAdmin
        .from('ledger')
        .select('amount')
        .eq('community_id', community.id)
        .eq('direction', 'in');

      const { data: ledgerOut } = await supabaseAdmin
        .from('ledger')
        .select('amount')
        .eq('community_id', community.id)
        .eq('direction', 'out');

      const sumIn = (ledgerIn || []).reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0);
      const sumOut = (ledgerOut || []).reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0);
      const treasuryBalance = sumIn - sumOut;

      // Platform Revenue
      const { data: platformRevData } = await supabaseAdmin
        .from('ledger')
        .select('amount')
        .eq('community_id', community.id)
        .eq('entry_type', 'platform_revenue');

      const platformRevenue = (platformRevData || []).reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0);

      const stats = {
        totalWarga: totalWarga || 0,
        activeTenders: activeTenders || 0,
        treasuryBalance,
        platformRevenue
      };

      // 2. Fetch Pengurus and Admin for this community
      const { data: pengurusList } = await supabaseAdmin
        .from('community_members')
        .select(`
          profiles (
            phone,
            full_name
          )
        `)
        .eq('community_id', community.id)
        .in('role', ['pengurus', 'admin']);

      if (pengurusList && pengurusList.length > 0) {
        for (const member of pengurusList) {
          const profile = member.profiles as any;
          if (profile && profile.phone) {
            await sendWeeklyDigest(profile.phone, profile.full_name, community.name, stats);
            totalDigestsSent++;
          }
        }
      }
    }

    return NextResponse.json({
      status: true,
      message: `Weekly digest sent successfully.`,
      totalDigestsSent
    });

  } catch (err: any) {
    console.error('💥 Weekly Digest Cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
