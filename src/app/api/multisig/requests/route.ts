import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const COMMUNITY_ID = 'b4db4d82-bfe0-4640-8d06-e4724038d1c7';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const communityId = url.searchParams.get('community_id') || COMMUNITY_ID;

    // Fetch multisig requests joined with tender info and requester profile info
    const { data: requests, error } = await supabaseAdmin
      .from('multisig_requests')
      .select(`
        *,
        tenders (
          id,
          title,
          description
        ),
        community_members (
          id,
          profiles (
            full_name,
            phone
          )
        )
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching multisig requests:', error);
      return NextResponse.json({ error: 'Failed to fetch multisig requests.' }, { status: 500 });
    }

    return NextResponse.json({ requests: requests || [] }, { status: 200 });
  } catch (err: any) {
    console.error('[Multisig Requests API Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
