import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTenderReminder } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Validate CRON_SECRET
    const authHeader = req.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET || 'RahasiaUrunWarga2026!';
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('⏰ Triggering Tender Reminder Cron...');

    // Fetch multisig_requests that are pending and expiring within 24 hours
    // Using PostgreSQL interval syntax via Supabase is tricky in REST, so we'll fetch pending and filter in code for safety,
    // or use a simple timestamp comparison.
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: pendingRequests, error: reqErr } = await supabaseAdmin
      .from('multisig_requests')
      .select('*, tenders(title)')
      .eq('status', 'pending')
      .gt('expires_at', now.toISOString())
      .lte('expires_at', tomorrow.toISOString());

    if (reqErr) {
      console.error('Failed to fetch pending requests:', reqErr);
      return NextResponse.json({ error: 'Failed to fetch pending requests' }, { status: 500 });
    }

    let remindersSent = 0;

    for (const request of pendingRequests || []) {
      const expiresAt = new Date(request.expires_at);
      const hoursRemaining = Math.max(1, Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

      // Fetch pengurus for this community to remind them
      const { data: pengurusList } = await supabaseAdmin
        .from('community_members')
        .select(`
          id,
          profiles (
            phone,
            full_name
          )
        `)
        .eq('community_id', request.community_id)
        .in('role', ['pengurus', 'admin']);

      const approvals = request.approvals || [];
      const approvedMemberIds = approvals.map((a: any) => a.member_id);

      if (pengurusList && pengurusList.length > 0) {
        for (const member of pengurusList) {
          // Only send reminder if this pengurus hasn't approved yet
          if (!approvedMemberIds.includes(member.id)) {
            const profile = member.profiles as any;
            if (profile && profile.phone) {
              const tenderTitle = request.tenders?.title || `Multi-Sig Request #${request.id.slice(-6)}`;
              await sendTenderReminder(
                profile.phone,
                profile.full_name,
                tenderTitle,
                hoursRemaining,
                request.required_sigs,
                request.current_sigs
              );
              remindersSent++;
            }
          }
        }
      }
    }

    return NextResponse.json({
      status: true,
      message: 'Tender reminders sent successfully',
      remindersSent
    });

  } catch (err: any) {
    console.error('💥 Tender Reminder Cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
