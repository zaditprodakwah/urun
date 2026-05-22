import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getSession } from '@/lib/auth';
import ProductInteractiveSection from '@/components/catalog/ProductInteractiveSection';
import { Product, WithContext } from 'schema-dts';
import { 
  ChevronLeft, 
  MapPin, 
  ShieldCheck, 
  Star,
  Award,
  Info
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch catalog item by slug along with its parent community and creator's member/profile info
  const { data: item, error } = await supabaseAdmin
    .from('catalog_items')
    .select(`
      *, 
      communities(name, geo_context), 
      community_members(
        role,
        profiles(full_name, phone)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'public')
    .single();

  if (error || !item) {
    console.error('Error or catalog item not found:', error);
    return notFound();
  }

  const metadata = item.metadata || {};
  const price = metadata.price || 0;
  const category = metadata.category || 'Sembako';
  const sku = metadata.sku || `SKU-${item.slug.toUpperCase()}`;
  const image = metadata.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
  const brand = metadata.brand || 'Lokal Warga';
  
  const communityName = item.communities?.name || 'Komunitas URUN';
  const communityGeo = item.communities?.geo_context || {};
  
  // Format geo context safely
  const province = communityGeo.province || 'DKI Jakarta';
  const regency = communityGeo.regency || 'Jakarta Timur';
  const district = communityGeo.district || 'Pasar Rebo';
  const village = communityGeo.village || 'Kalisari';
  const coords = communityGeo.coordinates || { lat: -6.32, lng: 106.86 };

  // Seller WhatsApp Details
  const sellerProfile = (item.community_members as any)?.profiles;
  const sellerName = sellerProfile?.full_name || 'Pengurus Komunitas';
  const sellerPhone = sellerProfile?.phone || '';

  // 2. Fetch authenticated user session to populate interactive states
  const session = await getSession();
  let isLoggedIn = false;
  let userFullName = '';

  if (session) {
    isLoggedIn = true;
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', session.profileId)
      .single();
    
    if (profile) {
      userFullName = profile.full_name;
    }
  }

  // 3. Fetch reviews from catalog_reviews
  const { data: reviewsData } = await supabaseAdmin
    .from('catalog_reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      profiles (
        full_name
      )
    `)
    .eq('product_id', item.id)
    .order('created_at', { ascending: false });

  const initialReviews = (reviewsData || []).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    profiles: r.profiles ? { full_name: r.profiles.full_name } : null
  }));

  // Average Rating
  const averageRating = item.metadata?.rating || 0;
  const reviewCount = item.metadata?.review_count || 0;

  // Generate Structured metadata JSON-LD (AEO/GEO READY)
  const jsonLd: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    image: image,
    description: item.description || '',
    sku: sku,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://urunwarga.vercel.app'}/catalog/${slug}`,
      areaServed: {
        '@type': 'AdministrativeArea',
        name: `${village}, ${district}, ${regency}, ${province}`,
      },
      seller: {
        '@type': 'Organization',
        name: communityName,
        location: {
          '@type': 'Place',
          name: communityName,
          address: {
            '@type': 'PostalAddress',
            addressLocality: district,
            addressRegion: province,
            addressCountry: 'ID',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: coords.lat || -6.32,
            longitude: coords.lng || 106.86,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-zinc-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-800 relative overflow-hidden">
      {/* Structural Metadata (AEO / Search Crawlers) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background elegant architectural line details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e2db_1px,transparent_1px),linear-gradient(to_bottom,#e5e2db_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10"></div>
      
      {/* Soft bright warm ambient glows */}
      <div className="absolute top-[-20%] right-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[10000ms]"></div>
      
      {/* Product Detail Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Elegant Back Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-650 hover:text-emerald-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Warga</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Product Image & Geo Context */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative rounded-3xl border border-zinc-200 bg-white overflow-hidden aspect-[4/3] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-bold bg-[#FCFBF9]/95 backdrop-blur-sm border border-zinc-200 text-emerald-700 tracking-wider uppercase">
                {category}
              </div>
            </div>

            {/* Geographical Context & Local Verification Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-5">
              <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                Asal Komunitas & Lingkungan (GEO)
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Komoditas ini disediakan secara swadaya dan dipertanggungjawabkan oleh pengurus lingkungan setempat demi kesejahteraan bersama warga wilayah.
              </p>
              
              <div className="grid grid-cols-2 gap-6 text-xs border-t border-zinc-100 pt-5">
                <div className="space-y-1">
                  <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Provinsi</div>
                  <div className="font-extrabold text-zinc-800">{province}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Kota/Kabupaten</div>
                  <div className="font-extrabold text-zinc-800">{regency}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Kecamatan</div>
                  <div className="font-extrabold text-zinc-800">{district}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Kelurahan/Desa</div>
                  <div className="font-extrabold text-zinc-800">{village}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Koordinat Pemetaan RT/RW</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {coords.lat?.toFixed(5)}, {coords.lng?.toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Dynamic Interactive Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
                <span className="font-mono text-[10px] bg-[#F5F3EF] border border-zinc-200 px-2 py-0.5 rounded text-zinc-600">{sku}</span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-emerald-700" />
                  Produk: <strong className="text-zinc-700">{brand}</strong>
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight">
                {item.title}
              </h1>

              <div className="flex items-center gap-4 py-2">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Harga Warga</div>
                  <div className="text-3xl font-black text-zinc-900">
                    Rp {price.toLocaleString('id-ID')}
                  </div>
                </div>
                
                {averageRating > 0 && (
                  <div className="border-l border-zinc-200 pl-4 space-y-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Rating Warga</div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <span className="text-xl font-black text-zinc-900">{averageRating.toFixed(1)}</span>
                      <span className="text-xs text-zinc-500 font-medium">({reviewCount} ulasan)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                Deskripsi Komoditas
              </h3>
              <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-line bg-[#F5F3EF]/40 p-4 rounded-2xl border border-zinc-100">
                {item.description || 'Barang dagangan warga dengan jaminan kualitas terbaik dan harga gotong-royong.'}
              </p>
            </div>

            {/* Dynamic Client Actions Box and Reviews Sub-system */}
            <ProductInteractiveSection 
              slug={slug}
              checkoutType={item.checkout_type as any || 'link_toko'}
              externalUrl={item.external_url}
              whatsappFormFields={item.whatsapp_form_fields || []}
              sellerPhone={sellerPhone}
              sellerName={sellerName}
              title={item.title}
              sku={sku}
              price={price}
              initialReviews={initialReviews}
              isLoggedIn={isLoggedIn}
              userFullName={userFullName}
            />

            {/* Community Accountability block */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-[#F5F3EF] space-y-3 text-xs shadow-inner">
              <div className="flex items-center justify-between text-zinc-900 font-black uppercase tracking-wider">
                <span>Penyelenggara Simpul</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Terverifikasi
                </span>
              </div>
              <p className="text-zinc-600 leading-relaxed font-semibold">
                Barang dagangan warga ini secara resmi dipertanggungjawabkan oleh pengurus **{communityName}**. Seluruh logistik berada di bawah kepengurusan lokal dan diawasi lewat ledger database URUN.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Visual Footer */}
      <footer className="border-t border-zinc-200 bg-[#F5F3EF] py-16 text-center text-xs text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2 text-zinc-700 font-bold">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
            <span>Sovereign Community Ledger Active</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed">
            © 2026 URUN Warga. Platform logistik & perdagangan mandiri warga berdaulat. Seluruh data transaksi diaudit secara terbuka dan diamankan menggunakan PostgreSQL Row-Level Security.
          </p>
          <div className="text-[10px] text-zinc-400 font-mono">
            Compliant with UU PDP No. 27/2022 • Powered by Supabase Admin Client
          </div>
        </div>
      </footer>
    </div>
  );
}
