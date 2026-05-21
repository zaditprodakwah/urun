import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const SESSION_SECRET = process.env.SESSION_SECRET;

async function verifyScope(req: NextRequest, requiredScope: string): Promise<{ communityId: string } | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    const secretKey = new TextEncoder().encode(SESSION_SECRET || 'RahasiaUrunWargaSessionSecretFallback2026!');
    
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    const communityId = (payload.communityId || payload.community_id) as string;
    const scopeVal = payload.scope || payload.scopes || 'catalog:read';
    const scopes = Array.isArray(scopeVal) 
      ? scopeVal 
      : typeof scopeVal === 'string' 
        ? scopeVal.split(' ') 
        : [];

    if (!communityId) return null;

    // Check if token has the required scope or is a standard authenticated user session (default bypass)
    const hasScope = scopes.includes(requiredScope) || payload.userId !== undefined;
    if (!hasScope) return null;

    return { communityId };
  } catch (err) {
    console.error('❌ Scope-Based JWT verification failed:', err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify bearer JWT has 'catalog:read' scope
    const authContext = await verifyScope(req, 'catalog:read');
    if (!authContext) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Bearer token tidak valid atau tidak memiliki scope "catalog:read".' 
      }, { status: 401 });
    }

    const { communityId } = authContext;

    // Query active tenders from Supabase sovereign database
    const { data: tenders, error } = await supabaseAdmin
      .from('tenders')
      .select('id, title, description, target_quantity, min_quantity, current_quantity, unit_price_target, deadline, current_state, created_at')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error querying tenders catalog:', error);
      return NextResponse.json({ error: 'Gagal memproses data katalog dari simpul database.' }, { status: 500 });
    }

    // Process and inject URL slug metadata helper dynamically
    const processedTenders = tenders?.map(t => {
      const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        ...t,
        slug,
        catalog_url: `${req.nextUrl.origin}/catalog/${slug}`
      };
    }) || [];

    return NextResponse.json({
      status: 'success',
      community_id: communityId,
      total_items: processedTenders.length,
      catalog: processedTenders
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=600, s-maxage=300',
        'Content-Type': 'application/json'
      }
    });

  } catch (err: any) {
    console.error('💥 Catalog API Gateway Critical Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
