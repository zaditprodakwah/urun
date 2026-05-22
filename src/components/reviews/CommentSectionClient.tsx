"use client";

import React, { useState, useTransition, useOptimistic } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { CornerDownRight, MessageSquare, Send, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ReviewNode {
  id: string;
  community_id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  catalog_item_id: string | null;
  rating: number | null;
  comment: string;
  parent_id: string | null;
  metadata: any;
  created_at: string;
  depth: number;
  path: string[];
}

interface CommentSectionClientProps {
  communityId: string;
  catalogItemId?: string;
  currentUserId?: string;
  initialReviews: ReviewNode[];
}

export default function CommentSectionClient({
  communityId,
  catalogItemId,
  currentUserId,
  initialReviews,
}: CommentSectionClientProps) {
  const [reviews, setReviews] = useState<ReviewNode[]>(initialReviews);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number | null>(catalogItemId ? 5 : null);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [_isPending, startTransition] = useTransition();

  // Optimistic UI list state
  const [optimisticReviews, setOptimisticReviews] = useOptimistic(
    reviews,
    (state, newReview: ReviewNode) => {
      // Find where to insert in the tree based on path sorting or insert at end
      return [...state, newReview];
    }
  );

  // Group comments into a lookup dictionary of parent_id -> children
  const getChildren = (parentId: string | null) => {
    return optimisticReviews
      .filter((r) => r.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  const handlePostReview = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const text = parentId ? replyText : commentText;
    if (!text.trim() || !currentUserId) return;

    setSubmitting(true);

    // Create optimistic review node
    const tempId = crypto.randomUUID();
    const optimisticNode: ReviewNode = {
      id: tempId,
      community_id: communityId,
      user_id: currentUserId,
      full_name: 'Mengetik...',
      avatar_url: '',
      catalog_item_id: catalogItemId || null,
      rating: parentId ? null : rating, // Ratings only on top-level
      comment: text,
      parent_id: parentId,
      metadata: {},
      created_at: new Date().toISOString(),
      depth: parentId ? 2 : 1,
      path: [tempId],
    };

    // Apply optimistic update immediately
    startTransition(() => {
      setOptimisticReviews(optimisticNode);
    });

    try {
      // 1. Fetch profile name from supabase to display correctly
      const { data: profile } = await supabaseBrowser
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', currentUserId)
        .single();

      // 2. Write to DB
      const { data, error } = await supabaseBrowser
        .from('reviews')
        .insert({
          community_id: communityId,
          user_id: currentUserId,
          catalog_item_id: catalogItemId || null,
          rating: parentId ? null : rating,
          comment: text,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Resolve optimistic state with actual database record
      const actualNode: ReviewNode = {
        ...data,
        full_name: profile?.full_name || 'Warga URUN',
        avatar_url: profile?.avatar_url || '',
        depth: parentId ? 2 : 1,
      };

      setReviews((prev) => [...prev, actualNode]);

      if (parentId) {
        setReplyText('');
        setReplyToId(null);
      } else {
        setCommentText('');
        if (catalogItemId) setRating(5);
      }
    } catch (err) {
      console.error('❌ Failed to post comment:', err);
      alert('Gagal mengirimkan komentar. Silakan periksa koneksi Anda.');
      // Revert is handled automatically by useOptimistic on finished transition
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;

    try {
      const { error } = await supabaseBrowser.from('reviews').delete().eq('id', id);
      if (error) throw error;

      // Remove from active state
      setReviews((prev) => prev.filter((r) => r.id !== id && r.parent_id !== id));
    } catch (err) {
      console.error('❌ Failed to delete review:', err);
      alert('Gagal menghapus komentar.');
    }
  };

  // Nested render helper function
  const renderCommentNode = (node: ReviewNode, depth = 0) => {
    const replies = getChildren(node.id);
    const isOwner = currentUserId === node.user_id;

    return (
      <div 
        key={node.id} 
        style={{ marginLeft: `${Math.min(depth * 16, 48)}px` }}
        className="relative group transition-all duration-300"
      >
        {/* Left thread indicator line */}
        {depth > 0 && (
          <div className="absolute -left-4 top-0 bottom-4 w-px bg-zinc-800/60 group-hover:bg-emerald-500/20 transition-colors"></div>
        )}

        <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/40 hover:border-zinc-800 rounded-xl p-4 sm:p-5 relative transition-all duration-300 shadow-sm hover:shadow-md mb-3 flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-zinc-850 border border-zinc-800 text-zinc-400 font-bold text-xs uppercase flex items-center justify-center shrink-0">
            {node.full_name.slice(0, 2)}
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white">{node.full_name}</span>
                {node.rating && (
                  <div className="flex items-center text-amber-400 gap-0.5 ml-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < node.rating! ? 'fill-current' : 'text-zinc-800'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 font-medium">
                {new Date(node.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">{node.comment}</p>

            <div className="flex items-center gap-3 pt-2">
              {currentUserId && depth < 2 && (
                <button
                  onClick={() => {
                    setReplyToId(replyToId === node.id ? null : node.id);
                    setReplyText('');
                  }}
                  className="text-[10px] font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors uppercase tracking-wider"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  Balas
                </button>
              )}
              {isOwner && (
                <button
                  onClick={() => handleDeleteReview(node.id)}
                  className="text-[10px] font-bold text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors uppercase tracking-wider"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              )}
            </div>

            {/* In-place reply input form */}
            {replyToId === node.id && (
              <form 
                onSubmit={(e) => handlePostReview(e, node.id)}
                className="mt-4 flex gap-2 pt-3 border-t border-zinc-800/40 relative animate-fadeIn"
              >
                <input
                  type="text"
                  placeholder={`Balas komentar ${node.full_name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !replyText.trim()}
                  className="px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-zinc-950 font-bold transition-all flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Recursively render replies */}
        {replies.length > 0 && (
          <div className="space-y-1">
            {replies.map((reply) => renderCommentNode(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const topLevelReviewsList = getChildren(null);

  return (
    <div className="space-y-6">
      {/* Comments List */}
      <div className="space-y-4">
        {topLevelReviewsList.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800/40 rounded-xl bg-zinc-900/10">
            <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-zinc-400">Belum ada diskusi warga</h3>
            <p className="text-xs text-zinc-600 mt-1 leading-normal px-4">
              Jadilah yang pertama menulis ulasan atau memulai percakapan di simpul ini.
            </p>
          </div>
        ) : (
          topLevelReviewsList.map((review) => renderCommentNode(review, 0))
        )}
      </div>

      {/* Main post comment form */}
      <div className="pt-6 border-t border-zinc-800/60">
        {currentUserId ? (
          <form onSubmit={(e) => handlePostReview(e)} className="space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Kirim Masukan Anda
            </h3>

            {/* Top-level rating widget */}
            {catalogItemId && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Beri Rating Produk</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-zinc-700 hover:text-amber-400 transition-colors p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition-transform hover:scale-110 active:scale-95 ${rating && rating >= star ? 'text-amber-400 fill-current' : ''}`}
                      />
                    </button>
                  ))}
                  {rating && (
                    <span className="text-[10px] text-zinc-500 font-extrabold font-mono ml-2">
                      ({rating === 5 ? 'Sangat Baik' : rating === 4 ? 'Baik' : rating === 3 ? 'Cukup' : rating === 2 ? 'Buruk' : 'Sangat Buruk'})
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  placeholder={
                    catalogItemId 
                      ? "Bagaimana kualitas barang/jasa ini? Tulis ulasan jujur Anda..." 
                      : "Tulis aspirasi, laporan, atau pertanyaan forum simpul warga..."
                  }
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 shrink-0"
              >
                <span>Kirim</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-xl bg-zinc-950/50 border border-zinc-800 text-center space-y-3">
            <h4 className="text-xs sm:text-sm font-extrabold text-zinc-300">Ingin ikut berdiskusi atau memberi ulasan?</h4>
            <p className="text-[10px] sm:text-xs text-zinc-500 max-w-sm mx-auto">
              Silakan masuk ke simpul warga menggunakan nomor WhatsApp terdaftar Anda untuk berinteraksi secara sah di forum komunitas.
            </p>
            <div className="pt-1.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs transition-colors border border-zinc-700/60"
              >
                Masuk Simpul Warga
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
