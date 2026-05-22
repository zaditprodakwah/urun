import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-server';
import { Star } from 'lucide-react';
import { Product, WithContext } from 'schema-dts';

interface RatingWidgetProps {
  communityId: string;
  catalogItemId?: string;
  itemTitle?: string;
  itemDescription?: string;
  itemImageUrl?: string;
}

export default async function RatingWidget({
  communityId,
  catalogItemId,
  itemTitle = 'Komunitas URUN',
  itemDescription = 'Platform Operating System Simpul Warga Multi-Tenant Berdaulat',
  itemImageUrl,
}: RatingWidgetProps) {
  // Fetch reviews using the secure database RPC function
  const { data: reviewsTree, error } = await supabaseAdmin.rpc('get_reviews_tree', {
    p_community_id: communityId,
    p_catalog_item_id: catalogItemId || null,
  });

  if (error) {
    console.error('❌ Error fetching rating stats:', error);
  }

  const reviewsList = (reviewsTree as any[]) || [];
  
  // Filter top-level rated reviews
  const ratedReviews = reviewsList.filter((r) => r.parent_id === null && r.rating !== null);
  
  const totalCount = ratedReviews.length;
  
  // Calculate average rating
  const avgRating = totalCount > 0
    ? Number((ratedReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
    : 5.0;

  // Compute breakdown distribution (5-star down to 1-star)
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = ratedReviews.filter((r) => r.rating === stars).length;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { stars, count, percentage };
  });

  // Inject structured JSON-LD data for search crawlers & answer engines (Gemini/Perplexity)
  const schemaJson: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': itemTitle,
    'description': itemDescription,
    ...(itemImageUrl && { 'image': itemImageUrl }),
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': avgRating,
      'reviewCount': Math.max(totalCount, 1),
    },
  };

  return (
    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row gap-8 items-center md:items-stretch">
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Average Score Column */}
      <div className="flex flex-col items-center justify-center text-center p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl md:w-1/3 shrink-0">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Nilai Rata-rata</h3>
        <span className="text-5xl font-black text-amber-400 font-mono tracking-tight">{avgRating}</span>
        
        {/* Render stars */}
        <div className="flex items-center text-amber-400 gap-0.5 mt-3 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-current' : 'text-zinc-850'}`}
            />
          ))}
        </div>
        
        <span className="text-xs text-zinc-500 font-extrabold uppercase tracking-wide">
          {totalCount} Ulasan Warga
        </span>
      </div>

      {/* Star Breakdown Progress Bar Column */}
      <div className="flex-1 flex flex-col justify-between py-1 w-full space-y-3">
        {distribution.map(({ stars, count, percentage }) => (
          <div key={stars} className="flex items-center gap-3 text-xs">
            {/* Stars label */}
            <span className="w-3 text-right font-extrabold font-mono text-zinc-400">{stars}</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />
            
            {/* Progress track */}
            <div className="flex-1 h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            {/* Percentage & count */}
            <span className="w-10 text-right font-bold text-zinc-500 font-mono">{percentage}%</span>
            <span className="w-8 text-right text-[10px] font-extrabold text-zinc-600 font-mono uppercase">
              ({count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
