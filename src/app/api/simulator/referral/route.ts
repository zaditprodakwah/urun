import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { referrerId } = body;

    if (!referrerId || typeof referrerId !== 'string') {
      return NextResponse.json(
        { error: 'referrerId is required and must be a string.' },
        { status: 400 }
      );
    }

    // 1. Verify that the referrer member exists in the database
    const { data: member, error: memberErr } = await supabaseAdmin
      .from('community_members')
      .select('*, profiles(full_name)')
      .eq('id', referrerId)
      .single();

    if (memberErr || !member) {
      return NextResponse.json(
        { error: 'Referrer community member not found in Supabase database.' },
        { status: 404 }
      );
    }

    // 2. Insert successful referral into interaction_log
    // This will trigger update_reputation_deterministic trigger in DB (+2 reputation)
    const { data: logEntry, error: logErr } = await supabaseAdmin
      .from('interaction_log')
      .insert({
        community_id: member.community_id,
        actor_id: referrerId,
        action_type: 'successful_referral',
        source_system: 'web_ui',
        action_detail: {
          simulated: true,
          description: 'Referral loop simulation: Warga B contributed via Warga A referral link.',
          referee_email: 'warga.b.simulated@urun.id'
        },
        ip_hash: 'simulated_referral_hash'
      })
      .select();

    if (logErr) {
      console.error('Error inserting interaction log:', logErr);
      return NextResponse.json(
        { error: 'Failed to insert simulation log.' },
        { status: 500 }
      );
    }

    // 3. Fetch the updated reputation score to return to the client
    const { data: updatedMember, error: fetchErr } = await supabaseAdmin
      .from('community_members')
      .select('reputation_score')
      .eq('id', referrerId)
      .single();

    return NextResponse.json({
      success: true,
      message: `Successfully simulated referral contribution! +2 points credited deterministically to ${member.profiles?.full_name || 'warga'}.`,
      newReputation: updatedMember?.reputation_score || member.reputation_score + 2
    }, { status: 200 });

  } catch (err: any) {
    console.error('[Referral Simulator API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during referral simulation.' },
      { status: 500 }
    );
  }
}
