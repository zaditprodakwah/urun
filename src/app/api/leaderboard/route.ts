import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching this API statically

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let communityId = url.searchParams.get('community_id');

    if (!communityId) {
      const session = await getSession();
      if (session) {
        communityId = session.communityId;
      }
    }

    if (!communityId) {
      return NextResponse.json({ error: 'Missing community_id parameter or active session.' }, { status: 400 });
    }

    // 1. Fetch Top 5 members based on deterministic reputation score
    const { data: topContributors, error: topErr } = await supabaseAdmin
      .from('community_members')
      .select(`
        id,
        role,
        reputation_score,
        joined_at,
        profiles (
          full_name,
          phone
        )
      `)
      .eq('community_id', communityId)
      .order('reputation_score', { ascending: false })
      .limit(5);

    if (topErr) {
      console.error('Error fetching top contributors:', topErr);
      return NextResponse.json({ error: 'Failed to fetch leaderboard data.' }, { status: 500 });
    }

    // 2. Fetch recent interaction logs for Dynamic Social Proof
    const { data: recentLogs, error: logErr } = await supabaseAdmin
      .from('interaction_log')
      .select(`
        id,
        action_type,
        created_at,
        action_detail,
        actor_id,
        community_members (
          profiles (
            full_name
          )
        )
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
      .limit(6);

    if (logErr) {
      console.error('Error fetching interaction logs:', logErr);
      return NextResponse.json({ error: 'Failed to fetch interaction logs.' }, { status: 500 });
    }

    // Map logs to return clean fields for rendering
    const formattedLogs = (recentLogs || []).map((log: any) => {
      const actorName = log.community_members?.profiles?.full_name || 'Sistem URUN';
      let description = '';
      let pointChange = '';

      switch (log.action_type) {
        case 'tender_contribution_paid':
          description = `melakukan pembayaran urun dana`;
          pointChange = '+5';
          break;
        case 'tender_participation':
          description = `berpartisipasi dalam program tender`;
          pointChange = '+3';
          break;
        case 'successful_referral':
          description = `berhasil mereferensikan kontributor baru`;
          pointChange = '+2';
          break;
        case 'violation_detected':
          description = `terdeteksi melakukan pelanggaran`;
          pointChange = '-10';
          break;
        case 'fraud_attempt':
          description = `terdeteksi mencoba melakukan fraud`;
          pointChange = '-15';
          break;
        default:
          description = `melakukan aktivitas komunitas`;
          pointChange = '0';
      }

      return {
        id: log.id,
        actorName,
        actionType: log.action_type,
        description,
        pointChange,
        timestamp: log.created_at,
        details: log.action_detail
      };
    });

    return NextResponse.json({
      topContributors: topContributors || [],
      recentLogs: formattedLogs
    }, { status: 200 });

  } catch (err: any) {
    console.error('[Leaderboard API Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
