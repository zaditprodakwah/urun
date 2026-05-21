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

    const hasScope = scopes.includes(requiredScope) || payload.userId !== undefined;
    if (!hasScope) return null;

    return { communityId };
  } catch (err) {
    console.error('❌ Scope-Based JWT verification failed:', err);
    return null;
  }
}

interface RouteParams {
  slug: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const authContext = await verifyScope(req, 'catalog:read');
    if (!authContext) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Bearer token tidak valid atau tidak memiliki scope "catalog:read".' 
      }, { status: 401 });
    }

    const { communityId } = authContext;
    const { slug } = await params;

    // Fetch all tenders for this community to evaluate slugs
    const { data: tenders, error } = await supabaseAdmin
      .from('tenders')
      .select('*')
      .eq('community_id', communityId);

    if (error || !tenders) {
      console.error('❌ Database error querying tender slug:', error);
      return NextResponse.json({ error: 'Gagal mengambil data tender dari database.' }, { status: 500 });
    }

    // Match by either exact UUID or calculated title slug
    const tender = tenders.find(t => {
      const generatedSlug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return generatedSlug === slug || t.id === slug;
    });

    if (!tender) {
      return NextResponse.json({ 
        error: `Tender dengan referensi/slug "${slug}" tidak ditemukan di simpul komunitas Anda.` 
      }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      community_id: communityId,
      tender: {
        ...tender,
        slug: tender.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=600, s-maxage=300',
        'Content-Type': 'application/json'
      }
    });

  } catch (err: any) {
    console.error('💥 Single Catalog API Gateway Critical Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
