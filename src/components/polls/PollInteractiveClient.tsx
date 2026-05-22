"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Check, Lock, LogIn } from 'lucide-react';
import Link from 'next/link';

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  created_at: string;
  votesCount: number;
  percentage: number;
}

interface PollInteractiveClientProps {
  pollId: string;
  initialOptions: PollOption[];
  initialTotalVotes: number;
  hasVoted: boolean;
  initialUserVoteOptionId: string | null;
  memberId: string | null;
  isLoggedIn: boolean;
}

export default function PollInteractiveClient({
  pollId,
  initialOptions,
  initialTotalVotes,
  hasVoted: initialHasVoted,
  initialUserVoteOptionId,
  memberId,
  isLoggedIn,
}: PollInteractiveClientProps) {
  const [options, setOptions] = useState<PollOption[]>(initialOptions);
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [userVoteOptionId, setUserVoteOptionId] = useState<string | null>(initialUserVoteOptionId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 1. Supabase Real-Time Subscriptions: Sinkronisasi real-time antarklien secara live
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`realtime-votes-${pollId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'poll_votes',
          filter: `poll_id=eq.${pollId}`,
        },
        async () => {
          // Ketika ada perubahan voting, tarik agregat terbaru agar grafik sinkron sempurna
          const { data: freshVotes, error } = await supabaseBrowser
            .from('poll_votes')
            .select('option_id');

          if (!error && freshVotes) {
            const votesListForPoll = freshVotes.filter((v: any) => 
              options.some(opt => opt.id === v.option_id)
            );
            const newTotal = votesListForPoll.length;
            setTotalVotes(newTotal);

            setOptions((prevOptions) =>
              prevOptions.map((opt) => {
                const count = votesListForPoll.filter((v: any) => v.option_id === opt.id).length;
                return {
                  ...opt,
                  votesCount: count,
                  percentage: newTotal > 0 ? Math.round((count / newTotal) * 100) : 0,
                };
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [pollId, options]);

  // 2. Fungsi Submit Vote
  const handleVote = async (optionId: string) => {
    if (!isLoggedIn) {
      setErrorMessage('Anda harus masuk untuk menyalurkan hak suara warga.');
      return;
    }

    if (!memberId) {
      setErrorMessage('Profil Anda belum terhubung dengan keanggotaan komunitas ini.');
      return;
    }

    if (hasVoted) return;

    setErrorMessage(null);

    startTransition(async () => {
      try {
        // Optimistic UI updates
        const updatedTotal = totalVotes + 1;
        setTotalVotes(updatedTotal);
        setOptions((prev) =>
          prev.map((opt) => {
            const isTarget = opt.id === optionId;
            const newCount = opt.votesCount + (isTarget ? 1 : 0);
            return {
              ...opt,
              votesCount: newCount,
              percentage: updatedTotal > 0 ? Math.round((newCount / updatedTotal) * 100) : 0,
            };
          })
        );
        setHasVoted(true);
        setUserVoteOptionId(optionId);

        // Kirim suara ke database
        const { error } = await supabaseBrowser
          .from('poll_votes')
          .insert({
            poll_id: pollId,
            option_id: optionId,
            member_id: memberId,
          });

        if (error) {
          throw error;
        }
      } catch (err: any) {
        console.error('Gagal mengirim suara:', err);
        // Rollback jika terjadi error
        setHasVoted(false);
        setUserVoteOptionId(null);
        setTotalVotes(initialTotalVotes);
        setOptions(initialOptions);
        setErrorMessage(err.message || 'Gagal mengirim pilihan suara. Silakan coba lagi.');
      }
    });
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <span>⚠️ {errorMessage}</span>
        </div>
      )}

      <div className="space-y-3">
        {options.map((opt) => {
          const isUserVote = userVoteOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={hasVoted || isPending || !isLoggedIn}
              className={`w-full text-left relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                hasVoted
                  ? isUserVote
                    ? 'bg-primary-container/10 border-primary-container text-white'
                    : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 cursor-default'
                  : 'bg-zinc-900/40 hover:bg-zinc-800/40 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white cursor-pointer active:scale-[0.99]'
              }`}
            >
              {/* Dynamic Animated Progress Bar background */}
              {hasVoted && (
                <div
                  className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out z-0 ${
                    isUserVote ? 'bg-primary-container/15' : 'bg-zinc-800/20'
                  }`}
                  style={{ width: `${opt.percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Radio / Status Icon */}
                  {hasVoted ? (
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                        isUserVote
                          ? 'bg-primary-container border-primary-container text-zinc-950 font-black'
                          : 'border-zinc-700 text-transparent'
                      }`}
                    >
                      {isUserVote ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-700 group-hover:border-zinc-500 transition-colors" />
                  )}

                  <span className="text-sm font-semibold tracking-tight leading-snug">
                    {opt.option_text}
                  </span>
                </div>

                {/* Percentage / Count Badge */}
                {hasVoted && (
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-sm font-extrabold font-mono text-white">
                      {opt.percentage}%
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold font-mono">
                      ({opt.votesCount} suara)
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Non-Logged In Call-To-Action */}
      {!isLoggedIn && (
        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-300">Gunakan Hak Suara Warga</p>
              <p className="text-[11px] text-zinc-500">Anda perlu masuk akun terlebih dahulu untuk memberikan suara.</p>
            </div>
          </div>
          <Link
            href="/login?redirect=dashboard"
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 font-black text-xs transition-colors shrink-0 shadow-sm active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            Masuk Akun
          </Link>
        </div>
      )}
    </div>
  );
}
