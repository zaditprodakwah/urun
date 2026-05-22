import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-server';
import { Product, WithContext } from 'schema-dts';
import CommentSectionClient from './CommentSectionClient';

interface CommentSectionProps {
  communityId: string;
  catalogItemId?: string;
  currentUserId?: string;
  itemTitle?: string;
  itemDescription?: string;
  itemImageUrl?: string;
}

export default async function CommentSection({
  communityId,
  catalogItemId,
  currentUserId,
  itemTitle = 'Komunitas URUN',
  itemDescription = 'Platform Operating System Simpul Warga Multi-Tenant Berdaulat',
  itemImageUrl,
}: CommentSectionProps) {
  // 1. Fetch recursive comments/reviews tree from database via RPC
  const { data: reviewsTree, error } = await supabaseAdmin.rpc('get_reviews_tree', {
    p_community_id: communityId,
    p_catalog_item_id: catalogItemId || null,
  });

  if (error) {
    console.error('❌ Error fetching reviews tree:', error);
  }

  const reviewsList = (reviewsTree as any[]) || [];

  // Filter out replies to calculate aggregate ratings for top-level reviews
  const topLevelReviews = reviewsList.filter((r) => r.parent_id === null);
  const ratedReviews = topLevelReviews.filter((r) => r.rating !== null);

  const totalReviewsCount = ratedReviews.length;
  const avgRating = totalReviewsCount > 0
    ? Number((ratedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(2))
    : 5.0;

  // 2. Generate JSON-LD Schema structured data for AI Search Engines (Gemini, ChatGPT, Perplexity)
  const schemaJson: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': itemTitle,
    'description': itemDescription,
    ...(itemImageUrl && { 'image': itemImageUrl }),
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': avgRating,
      'reviewCount': Math.max(totalReviewsCount, 1),
    },
    'review': ratedReviews.map((r) => ({
      '@type': 'Review',
      'author': {
        '@type': 'Person',
        'name': r.full_name || 'Warga URUN',
      },
      'datePublished': r.created_at,
      'reviewBody': r.comment,
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': r.rating || 5,
      },
    })),
  };

  return (
    <section className="w-full space-y-8 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
      {/* 3. Structured Data injection for crawler parsing (AEO / SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/60 pb-5 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Diskusi & Ulasan Warga</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
            Suara komunitas yang akrab, transparan, dan terdesentralisasi secara inklusif.
          </p>
        </div>
        
        {/* Simple ratings dashboard badge */}
        {catalogItemId && (
          <div className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-300">
            <span className="text-2xl font-black text-amber-400 font-mono">{avgRating}</span>
            <div className="flex flex-col">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? 'fill-current' : 'text-zinc-700'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{totalReviewsCount} Ulasan</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Client Side interactive thread list with Optimistic UI updates */}
      <CommentSectionClient
        communityId={communityId}
        catalogItemId={catalogItemId}
        currentUserId={currentUserId}
        initialReviews={reviewsList}
      />
    </section>
  );
}
