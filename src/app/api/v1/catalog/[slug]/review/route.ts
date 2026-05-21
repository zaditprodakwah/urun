import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z.string().max(1000, "Komentar maksimal 1000 karakter").optional().default("")
});

interface RouteParams {
  slug: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { slug } = await params;

    // 1. Authenticate Warga
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Anda harus masuk komunitas terlebih dahulu untuk memberi ulasan.' 
      }, { status: 401 });
    }

    const { profileId, communityId } = session;

    // 2. Fetch Catalog Item by Slug to confirm it belongs to the same community
    const { data: item, error: itemErr } = await supabaseAdmin
      .from('catalog_items')
      .select('id, metadata, community_id')
      .eq('slug', slug)
      .single();

    if (itemErr || !item) {
      console.error('❌ Error finding catalog item for review:', itemErr);
      return NextResponse.json({ error: 'Barang tidak ditemukan di etalase.' }, { status: 404 });
    }

    // Verify community matches (RLS guard at API layer)
    if (item.community_id !== communityId) {
      return NextResponse.json({ error: 'Barang tidak termasuk dalam simpul komunitas Anda.' }, { status: 403 });
    }

    // 3. Validate input body
    const body = await req.json();
    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'VALIDATION_ERROR', 
        details: parsed.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { rating, comment } = parsed.data;

    // 4. Check if user already reviewed this product to avoid duplicates (upsert behaviour or block)
    // Sesuai standarisasi, update jika sudah ada ulasan sebelumnya dari user yang sama pada produk yang sama
    const { data: existingReview } = await supabaseAdmin
      .from('catalog_reviews')
      .select('id')
      .eq('product_id', item.id)
      .eq('user_id', profileId)
      .maybeSingle();

    let reviewResult;
    if (existingReview) {
      // Update existing review
      const { data, error: updateErr } = await supabaseAdmin
        .from('catalog_reviews')
        .update({
          rating,
          comment,
          created_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
        .select('*')
        .single();
      
      if (updateErr) throw updateErr;
      reviewResult = data;
    } else {
      // Insert new review
      const { data, error: insertErr } = await supabaseAdmin
        .from('catalog_reviews')
        .insert({
          product_id: item.id,
          user_id: profileId,
          community_id: communityId,
          rating,
          comment
        })
        .select('*')
        .single();

      if (insertErr) throw insertErr;
      reviewResult = data;
    }

    // 5. Post-Save Aggregation: Compute average rating & total reviews
    const { data: allReviews, error: reviewsErr } = await supabaseAdmin
      .from('catalog_reviews')
      .select('rating')
      .eq('product_id', item.id);

    if (!reviewsErr && allReviews) {
      const reviewCount = allReviews.length;
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = parseFloat((totalRating / reviewCount).toFixed(2));

      // Update catalog_items metadata
      const currentMetadata = item.metadata as Record<string, any> || {};
      const updatedMetadata = {
        ...currentMetadata,
        rating: averageRating,
        review_count: reviewCount
      };

      await supabaseAdmin
        .from('catalog_items')
        .update({ metadata: updatedMetadata })
        .eq('id', item.id);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Ulasan Anda berhasil disimpan.',
      review: reviewResult
    }, { status: 200 });

  } catch (err: any) {
    console.error('💥 Review API Route Critical Error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan ulasan warga.' }, { status: 500 });
  }
}
