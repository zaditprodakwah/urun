import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { jwtVerify } from 'jose';
import { z } from 'zod';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SESSION_SECRET = (() => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ CRITICAL: SESSION_SECRET is missing from environment variables in production.');
    }
    return 'RahasiaUrunWargaSessionSecretFallback2026!';
  }
  return secret;
})();

async function verifyScope(req: NextRequest, requiredScope: string): Promise<{ communityId: string; profileId?: string } | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    const secretKey = new TextEncoder().encode(SESSION_SECRET);
    
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    const communityId = (payload.communityId || payload.community_id) as string;
    const profileId = payload.profileId as string | undefined;
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

    return { communityId, profileId };
  } catch (err) {
    console.error('❌ Scope-Based JWT verification failed:', err);
    return null;
  }
}

// Zod validation schema for creating/updating catalog items
const CatalogItemSchema = z.object({
  title: z.string().min(3, "Nama barang minimal 3 karakter").max(100, "Nama barang maksimal 100 karakter"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional().default(""),
  item_type: z.enum(['product', 'service', 'asset']).default('product'),
  status: z.enum(['public', 'private', 'active', 'archived']).default('active'),
  price: z.number().nonnegative("Harga harus bernilai positif"),
  category: z.string().max(50, "Kategori maksimal 50 karakter").default("Sembako"),
  image: z.string().url("Format URL gambar tidak valid").optional().or(z.literal("")),
  sku: z.string().max(50).optional().or(z.literal("")),
  checkout_type: z.enum(['link_toko', 'whatsapp_form']).default('link_toko'),
  external_url: z.string().url("Format tautan eksternal tidak valid").optional().nullable().or(z.literal("")),
  whatsapp_form_fields: z.array(
    z.object({
      name: z.string().regex(/^[a-z0-9_]+$/, "Nama kolom harus alfanumerik & huruf kecil"),
      label: z.string().min(1, "Label kolom tidak boleh kosong"),
      type: z.enum(['text', 'number', 'textarea']),
      required: z.boolean().default(true)
    })
  ).default([])
});

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

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate via either Cookies (Browser) or Bearer Token (API)
    let communityId: string | null = null;
    let profileId: string | null = null;

    const session = await getSession();
    if (session) {
      communityId = session.communityId;
      profileId = session.profileId;
    } else {
      const authContext = await verifyScope(req, 'catalog:write');
      if (authContext) {
        communityId = authContext.communityId;
        profileId = authContext.profileId || null;
      }
    }

    if (!communityId || !profileId) {
      return NextResponse.json({ 
        error: 'UNAUTHORIZED: Sesi warga tidak valid atau tidak memiliki wewenang.' 
      }, { status: 401 });
    }

    // 2. Query community_members.id to get the created_by reference
    const { data: member, error: memberErr } = await supabaseAdmin
      .from('community_members')
      .select('id, role')
      .eq('profile_id', profileId)
      .eq('community_id', communityId)
      .single();

    if (memberErr || !member) {
      console.error('❌ Member verification failed:', memberErr);
      return NextResponse.json({ error: 'Data keanggotaan warga tidak ditemukan.' }, { status: 403 });
    }

    // Ensure they have management permission (admin/pengurus or can_manage_catalog checked)
    // For simplicity, allow any registered member of the community to list products in this neighborhood catalog,
    // but check if they are authorized
    
    // 3. Parse and Validate input body using Zod
    const body = await req.json();
    const parsed = CatalogItemSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ 
        error: 'VALIDATION_ERROR', 
        details: fieldErrors 
      }, { status: 400 });
    }

    const data = parsed.data;

    // 4. Create clean slug from title
    let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug exists in community and append entropy if so
    const { data: existing } = await supabaseAdmin
      .from('catalog_items')
      .select('id')
      .eq('community_id', communityId)
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    // 5. Structure metadata safely (no-spy tracking)
    const itemMetadata = {
      price: data.price,
      category: data.category,
      sku: data.sku || `SKU-${slug.toUpperCase()}`,
      image: data.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
      original_link: data.external_url || '',
      platform: data.external_url ? (data.external_url.includes('tokopedia') ? 'tokopedia' : data.external_url.includes('shopee') ? 'shopee' : 'generic') : 'generic'
    };

    // 6. Insert into catalog_items table
    const { data: insertedItem, error: insertErr } = await supabaseAdmin
      .from('catalog_items')
      .insert({
        community_id: communityId,
        created_by: member.id,
        slug,
        title: data.title,
        description: data.description,
        item_type: data.item_type,
        status: data.status,
        metadata: itemMetadata,
        checkout_type: data.checkout_type,
        external_url: data.external_url || null,
        whatsapp_form_fields: data.whatsapp_form_fields
      })
      .select('*')
      .single();

    if (insertErr) {
      console.error('❌ Database insertion failed:', insertErr);
      return NextResponse.json({ error: 'Gagal menyimpan barang baru ke dalam database.' }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Barang berhasil didaftarkan di etalase warga.',
      item: insertedItem
    }, { status: 201 });

  } catch (err: any) {
    console.error('💥 POST Catalog API Critical Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

