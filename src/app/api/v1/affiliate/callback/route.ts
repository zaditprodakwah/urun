import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createHmac, createHash } from 'crypto';
import { checkIdempotency, saveIdempotencyResult } from '@/lib/idempotency';

export const dynamic = 'force-dynamic';

const SESSION_SECRET = (() => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ CRITICAL: SESSION_SECRET is missing from environment variables in production.');
    }
    return '5ebec82e0f183757e84a7f9ee82544def8fc715abf530a735ad1f5bbddbe775f';
  }
  return secret;
})();

/**
 * Endpoint for processing external affiliate marketplace webhooks.
 * Implements 70/30 commission splits into the ledger bypassing Multi-Sig.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Read raw body text for accurate HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-urun-signature') || req.headers.get('X-Urun-Signature');
    const timestampHeader = req.headers.get('x-urun-timestamp') || req.headers.get('X-Urun-Timestamp');

    if (!signature) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Header "x-urun-signature" tidak ditemukan.' 
      }, { status: 401 });
    }

    if (!timestampHeader) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Header "x-urun-timestamp" tidak ditemukan.' 
      }, { status: 401 });
    }

    // 2. Validate Replay Attack Mitigation (Timestamp difference > 300s)
    const timestamp = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);
    
    if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {
      console.warn(`⚠️ Replay attack warning or clock desync: Timestamp difference is ${Math.abs(now - timestamp)}s`);
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Validasi timestamp kedaluwarsa atau tidak valid.' 
      }, { status: 401 });
    }

    // 3. Validate HMAC-SHA256 signature
    const expectedSignature = createHmac('sha256', SESSION_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('❌ HMAC signature verification failed for external affiliate webhook.');
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Tanda tangan HMAC tidak cocok.' 
      }, { status: 401 });
    }

    // 4. Parse verified JSON payload
    let payload: {
      product_id?: string;
      product_slug?: string;
      commission_amount?: number;
      source_tx_id?: string;
      platform?: string;
      idempotency_key?: string;
    };
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'BAD REQUEST: Format JSON tidak valid.' }, { status: 400 });
    }

    const {
      product_id,
      product_slug,
      commission_amount,
      source_tx_id,
      platform,
      idempotency_key
    } = payload;

    // Validate essential payload parameters
    if (!commission_amount || commission_amount <= 0) {
      return NextResponse.json({ error: 'BAD REQUEST: Parameter commission_amount harus positif.' }, { status: 400 });
    }

    if (!source_tx_id) {
      return NextResponse.json({ error: 'BAD REQUEST: Parameter source_tx_id wajib disertakan.' }, { status: 400 });
    }

    if (!platform) {
      return NextResponse.json({ error: 'BAD REQUEST: Parameter platform wajib disertakan.' }, { status: 400 });
    }

    if (!idempotency_key) {
      return NextResponse.json({ error: 'BAD REQUEST: Parameter idempotency_key wajib disertakan.' }, { status: 400 });
    }

    // Validate idempotency_key format (must be valid UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(idempotency_key)) {
      return NextResponse.json({ error: 'BAD REQUEST: Parameter idempotency_key harus berformat UUID yang valid.' }, { status: 400 });
    }

    // 5. Query catalog item to resolve community_id and created_by (actor_id)
    let catalogItem = null;
    if (product_id && uuidRegex.test(product_id)) {
      const { data } = await supabaseAdmin
        .from('catalog_items')
        .select('id, community_id, created_by, title')
        .eq('id', product_id)
        .single();
      catalogItem = data;
    }

    if (!catalogItem && product_slug) {
      const { data } = await supabaseAdmin
        .from('catalog_items')
        .select('id, community_id, created_by, title')
        .eq('slug', product_slug)
        .single();
      catalogItem = data;
    }

    if (!catalogItem) {
      console.warn(`⚠️ Catalog item not found for product_id: ${product_id}, slug: ${product_slug}`);
      return NextResponse.json({ error: 'NOT FOUND: Barang katalog tidak ditemukan.' }, { status: 404 });
    }

    const { id: catalogItemId, community_id: communityId, created_by: actorId, title: productTitle } = catalogItem;

    // 6. Perform strict integer arithmetic division to prevent fractional loss (Anti-Fractional Loss)
    const commissionInt = BigInt(Math.round(commission_amount));
    const platformFee = (commissionInt * BigInt(30)) / BigInt(100);
    const communityShare = commissionInt - platformFee;

    const platformFeeNum = Number(platformFee);
    const communityShareNum = Number(communityShare);

    const description = `Kemitraan Kas Warga: Komisi ${platform.toUpperCase()} dari produk "${productTitle}"`;
    const metadata = {
      source_tx_id,
      platform: platform.toLowerCase(),
      calculation_breakdown: {
        total_commission: Number(commissionInt),
        platform_fee_30pct: platformFeeNum,
        community_share_70pct: communityShareNum
      }
    };

    console.log(`📡 Processing commission split. Total: Rp ${commissionInt}, Community (70%): Rp ${communityShare}, Platform (30%): Rp ${platformFee}`);

    // 7. Invoke Stored Procedure for atomic transaction in PostgreSQL
    // If the database has our new migration, we use the stored procedure
    // If not (e.g. running in direct PostgREST mode without applied migration), we fallback to safe sequential operations
    try {
      const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('process_affiliate_commission', {
        p_idempotency_key: idempotency_key,
        p_community_id: communityId,
        p_actor_id: actorId,
        p_catalog_item_id: catalogItemId,
        p_platform_fee: platformFeeNum,
        p_community_share: communityShareNum,
        p_description: description,
        p_metadata: metadata
      });

      if (!rpcErr && rpcResult) {
        const result = rpcResult as {
          status: string;
          response_status?: number;
          response_body?: any;
          community_ledger_id?: string;
          platform_ledger_id?: string;
        };

        if (result.status === 'hit') {
          return NextResponse.json(result.response_body, { status: result.response_status || 200 });
        }

        if (result.status === 'success') {
          const successResponse = {
            status: 'success',
            message: 'Komisi kemitraan berhasil diproses secara otomatis.',
            community_ledger_id: result.community_ledger_id,
            platform_ledger_id: result.platform_ledger_id,
            calculations: metadata.calculation_breakdown
          };

          // Save success response to idempotency keys so subsequent retries get the identical output
          await saveIdempotencyResult(supabaseAdmin, idempotency_key, 201, successResponse);
          return NextResponse.json(successResponse, { status: 201 });
        }
      }

      // If it's a "function does not exist" type error, fallback to our TypeScript transaction handler
      if (rpcErr && (rpcErr.code === 'PGRST202' || rpcErr.message?.includes('does not exist'))) {
        console.info('ℹ️ process_affiliate_commission RPC not found in DB. Falling back to TypeScript handler...');
      } else if (rpcErr) {
        console.error('❌ Database RPC error:', rpcErr);
        return NextResponse.json({ error: `Database Transaction Error: ${rpcErr.message}` }, { status: 400 });
      }
    } catch (dbErr) {
      console.warn('⚠️ Stored procedure call failed, falling back to TypeScript...', dbErr);
    }

    // ==========================================
    // 8. Fallback TypeScript Transaction Handler
    // ==========================================
    // Check idempotency first (Atomic unique insert check)
    const idempotency = await checkIdempotency(supabaseAdmin, idempotency_key, communityId, '/api/v1/affiliate/callback');
    if (idempotency.status !== 'proceed') {
      return NextResponse.json(idempotency.response_body, { status: idempotency.response_status });
    }

    // Generate deterministic UUID for platform entry from original idempotency_key to keep constraints
    const platformIdHash = createHash('md5').update(`${idempotency_key}-platform`).digest('hex');
    const platformIdempotencyKey = [
      platformIdHash.slice(0, 8),
      platformIdHash.slice(8, 12),
      platformIdHash.slice(12, 16),
      platformIdHash.slice(16, 20),
      platformIdHash.slice(20, 32)
    ].join('-');

    // A. Insert community_share (70% Inbound)
    const { data: commEntry, error: commErr } = await supabaseAdmin
      .from('ledger')
      .insert({
        community_id: communityId,
        actor_id: actorId,
        catalog_item_id: catalogItemId,
        amount: communityShareNum,
        direction: 'in',
        entry_type: 'community_share',
        description,
        idempotency_key: idempotency_key,
        multisig_status: 'not_required',
        metadata
      })
      .select()
      .single();

    if (commErr) {
      console.error('❌ Fallback failed on community share insertion:', commErr);
      return NextResponse.json({ error: `Transaction Failed (Community): ${commErr.message}` }, { status: 500 });
    }

    // B. Insert platform_revenue (30% Outbound)
    const { data: platEntry, error: platErr } = await supabaseAdmin
      .from('ledger')
      .insert({
        community_id: communityId,
        actor_id: actorId,
        catalog_item_id: catalogItemId,
        amount: platformFeeNum,
        direction: 'out',
        entry_type: 'platform_revenue',
        ref_id: commEntry.id,
        description: 'Platform operational fee (30% split from affiliate link checkout)',
        idempotency_key: platformIdempotencyKey,
        multisig_status: 'not_required',
        metadata
      })
      .select()
      .single();

    if (platErr) {
      console.error('❌ Fallback failed on platform fee insertion. Attempting partial cleanup to keep ledger balance...');
      // Rollback: try deleting the first entry (since we are using admin key) to preserve double-entry balance
      await supabaseAdmin.from('ledger').delete().eq('id', commEntry.id);
      return NextResponse.json({ error: `Transaction Failed (Platform): ${platErr.message}` }, { status: 500 });
    }

    // C. Write to system audit log
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: communityId,
        actor_id: actorId,
        action: 'affiliate_revenue_split',
        table_affected: 'ledger',
        new_value: {
          community_ledger_id: commEntry.id,
          platform_ledger_id: platEntry.id,
          community_share: communityShareNum,
          platform_fee: platformFeeNum
        },
        reason: 'Processed external affiliate commission split (TypeScript fallback execution)'
      });

    const successResponse = {
      status: 'success',
      message: 'Komisi kemitraan berhasil diproses secara otomatis.',
      community_ledger_id: commEntry.id,
      platform_ledger_id: platEntry.id,
      calculations: metadata.calculation_breakdown
    };

    // Save final response in idempotency cache
    await saveIdempotencyResult(supabaseAdmin, idempotency_key, 201, successResponse);
    return NextResponse.json(successResponse, { status: 201 });

  } catch (err: any) {
    console.error('💥 Critical error in Affiliate Callback Webhook:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
