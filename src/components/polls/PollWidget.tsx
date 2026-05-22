import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getSession } from '@/lib/auth';
import { WithContext, Question, Answer } from 'schema-dts';
import PollInteractiveClient from './PollInteractiveClient';

interface PollWidgetProps {
  communityId?: string;
  catalogItemId?: string;
  isPublicOnly?: boolean;
}

export default async function PollWidget({
  communityId,
  catalogItemId,
  isPublicOnly = false,
}: PollWidgetProps) {
  // 1. Dapatkan session saat ini (jika login)
  const session = await getSession();
  const activeCommunityId = communityId || session?.communityId;
  const currentUserId = session?.profileId;

  if (!activeCommunityId && !isPublicOnly) {
    return (
      <div className="bg-zinc-950/20 border border-zinc-800/40 rounded-2xl p-6 text-center">
        <p className="text-zinc-400 text-sm">Masuk ke komunitas Anda untuk melihat polling warga.</p>
      </div>
    );
  }

  // 2. Ambil data member_id dari user login untuk otorisasi voting
  let currentMemberId: string | null = null;
  if (currentUserId && activeCommunityId) {
    const { data: member } = await supabaseAdmin
      .from('community_members')
      .select('id')
      .eq('community_id', activeCommunityId)
      .eq('profile_id', currentUserId)
      .single();
    if (member) {
      currentMemberId = member.id;
    }
  }

  // 3. Query Polling yang Aktif
  let query = supabaseAdmin
    .from('polls')
    .select(`
      *,
      poll_options(*),
      poll_votes(*)
    `)
    .eq('status', 'active');

  if (catalogItemId) {
    query = query.eq('catalog_item_id', catalogItemId);
  } else if (isPublicOnly) {
    query = query.eq('is_public', true).ilike('title', '%Dokumentasi%');
  } else {
    query = query.eq('community_id', activeCommunityId).is('catalog_item_id', null);
  }

  const { data: polls, error } = await query;

  if (error) {
    console.error('Error fetching polls:', error);
  }

  let activePoll = polls && polls.length > 0 ? polls[0] : null;

  // 4. Auto-Seeding: Jika tidak ada polling aktif, buat secara dinamis (untuk kemudahan demo instan)
  if (!activePoll && activeCommunityId) {
    try {
      // Dapatkan salah satu member_id sebagai creator (misalnya pembuat komunitas atau admin)
      const { data: members } = await supabaseAdmin
        .from('community_members')
        .select('id')
        .eq('community_id', activeCommunityId)
        .limit(1);
      
      const creatorId = members && members.length > 0 ? members[0].id : null;

      if (creatorId) {
        let title = '';
        let description = '';
        let options: string[] = [];
        let isPublic = false;

        if (catalogItemId) {
          // Ambil detail produk untuk konteks
          const { data: item } = await supabaseAdmin
            .from('catalog_items')
            .select('title')
            .eq('id', catalogItemId)
            .single();

          title = `Varian Pengadaan ${item?.title || 'Kolektif'} mana yang paling Anda setujui?`;
          description = 'Warga melakukan voting varian produk terbaik sebelum pengurus merilis tender resmi (Aktivasi interaksi pra-tender).';
          options = ['Varian Premium Merek A (Kualitas Unggul)', 'Varian Standar Merek B (Lebih Ekonomis)', 'Varian Lokal (Dukungan Petani Sekitar)'];
          isPublic = true;
        } else if (isPublicOnly) {
          title = 'Seberapa penting fitur Kedaulatan Suara (Polling) di lingkungan RT/RW Anda?';
          description = 'Jajak pendapat hidup (interactive doc evaluation poll) sebagai pembuktian fitur transparansi URUN ke publik.';
          options = ['Sangat Penting (Meningkatkan Transparansi & Kepercayaan)', 'Cukup Penting (Sebagai Pelengkap Musyawarah)', 'Kurang Penting (Lebih Memilih Musyawarah Fisik)'];
          isPublic = true;
        } else {
          title = 'Keputusan Bersama Agenda Kerja Bakti Lingkungan RT/RW';
          description = 'Jajak pendapat kolektif untuk menetapkan fokus kegiatan gotong royong bulan depan.';
          options = ['Hari Minggu, 7 Juni (Fokus Normalisasi Saluran Air)', 'Hari Sabtu, 6 Juni (Fokus Pengelolaan Sampah Plastik)', 'Hari Minggu, 14 Juni (Fokus Penghijauan RTH Warga)'];
          isPublic = false;
        }

        // Insert Poll
        const { data: newPoll } = await supabaseAdmin
          .from('polls')
          .insert({
            community_id: activeCommunityId,
            creator_id: creatorId,
            catalog_item_id: catalogItemId || null,
            title,
            description,
            is_public: isPublic,
            status: 'active',
            // eslint-disable-next-line react-hooks/purity
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 Hari
          })
          .select()
          .single();

        if (newPoll) {
          // Insert Options
          const optionsPayload = options.map((opt) => ({
            poll_id: newPoll.id,
            option_text: opt,
          }));

          const { data: newOptions } = await supabaseAdmin
            .from('poll_options')
            .insert(optionsPayload)
            .select();

          activePoll = {
            ...newPoll,
            poll_options: newOptions || [],
            poll_votes: [],
          };
        }
      }
    } catch (seedingError) {
      console.error('Error seeding initial poll:', seedingError);
    }
  }

  // 5. Render jika tidak ada polling sama sekali
  if (!activePoll) {
    return (
      <div className="bg-zinc-950/20 border border-zinc-800/40 rounded-2xl p-6 text-center">
        <p className="text-zinc-500 text-sm">Tidak ada polling aktif di komunitas saat ini.</p>
      </div>
    );
  }

  // 6. Hitung statistik suara
  const totalVotes = activePoll.poll_votes?.length || 0;
  const optionsWithVotes = activePoll.poll_options.map((opt: any) => {
    const votesForOption = activePoll.poll_votes?.filter((v: any) => v.option_id === opt.id) || [];
    return {
      ...opt,
      votesCount: votesForOption.length,
      percentage: totalVotes > 0 ? Math.round((votesForOption.length / totalVotes) * 100) : 0,
    };
  });

  const hasVoted = activePoll.poll_votes?.some((v: any) => v.member_id === currentMemberId) || false;
  const userVoteOptionId = activePoll.poll_votes?.find((v: any) => v.member_id === currentMemberId)?.option_id || null;

  // 7. Bentuk JSON-LD schema.org/Question jika polling berstatus publik
  let schemaJson: WithContext<Question> | null = null;
  if (activePoll.is_public) {
    schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'Question',
      'name': activePoll.title,
      'text': activePoll.description || activePoll.title,
      'answerCount': activePoll.poll_options.length,
      'suggestedAnswer': optionsWithVotes.map((opt: any) => ({
        '@type': 'Answer',
        'text': opt.option_text,
        'upvoteCount': opt.votesCount,
      } as Answer)),
    };
  }

  return (
    <div className="w-full space-y-6 bg-zinc-950/30 border border-zinc-800/60 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden group">
      {/* Glow Effect Decorative background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-all duration-500" />
      
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}

      <div className="relative z-10 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-primary-container text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded border border-primary/30">
              {catalogItemId ? 'Voting Pra-Tender' : 'Kedaulatan Suara'}
            </span>
            {activePoll.is_public && (
              <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700">
                Publik (SEO/AEO)
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mt-2 leading-snug">
            {activePoll.title}
          </h3>
          {activePoll.description && (
            <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
              {activePoll.description}
            </p>
          )}
        </div>

        <PollInteractiveClient
          pollId={activePoll.id}
          initialOptions={optionsWithVotes}
          initialTotalVotes={totalVotes}
          hasVoted={hasVoted}
          initialUserVoteOptionId={userVoteOptionId}
          memberId={currentMemberId}
          isLoggedIn={!!session}
        />

        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium pt-3 border-t border-zinc-800/50">
          <span>Total Partisipasi: <strong className="text-zinc-300 font-semibold font-mono">{totalVotes} warga</strong></span>
          {activePoll.expires_at && (
            <span>Berakhir pada: <strong className="text-zinc-400 font-semibold">{new Date(activePoll.expires_at).toLocaleDateString('id-ID')}</strong></span>
          )}
        </div>
      </div>
    </div>
  );
}
