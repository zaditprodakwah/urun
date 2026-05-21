import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { applyJitAffiliateLink } from '@/lib/parser';
import { Product, WithContext } from 'schema-dts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch catalog item by slug, along with its parent community geo context
  const { data: item, error } = await supabaseAdmin
    .from('catalog_items')
    .select('*, communities(name, geo_context)')
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

  // Just-In-Time (JIT) Affiliate Link Injection
  // We grab the original merchant link from metadata, or fallback to an auto-generated search link
  const originalLink = metadata.original_link || `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(item.title)}`;
  const platform = metadata.platform || 'tokopedia';
  const jitAffiliateLink = applyJitAffiliateLink(originalLink, platform);

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
      url: originalLink,
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Structural Metadata (AEO / Search Crawlers) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Radial Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-zinc-950">U</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">URUN</span>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Detail
                </span>
              </div>
              <p className="text-xs text-zinc-400">Public Collective Marketplace</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/catalog" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Kembali ke Katalog
            </Link>
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Pusat Komando
            </Link>
          </div>
        </div>
      </header>

      {/* Product Detail Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Product Image Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md overflow-hidden aspect-[4/3] shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950/80 border border-zinc-800 text-emerald-400">
                {category}
              </div>
            </div>

            {/* Geographical Context & Local Verification Card */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-emerald-400">📍</span> Informasi Geografis Komunitas (GEO)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="text-zinc-500">Provinsi</div>
                  <div className="font-semibold text-zinc-300">{province}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-500">Kota/Kabupaten</div>
                  <div className="font-semibold text-zinc-300">{regency}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-500">Kecamatan</div>
                  <div className="font-semibold text-zinc-300">{district}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-500">Kelurahan/Desa</div>
                  <div className="font-semibold text-zinc-300">{village}</div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Koordinat Presisi</span>
                <span className="font-mono text-emerald-400">
                  {coords.lat?.toFixed(5)}, {coords.lng?.toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">{sku}</span>
                <span>Merek: <strong className="text-zinc-300">{brand}</strong></span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {item.title}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-sm text-zinc-500 font-medium">Harga Kesepakatan:</span>
                <span className="text-3xl font-black text-emerald-400">
                  Rp {price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Deskripsi Komoditas</h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {item.description || 'Produk kolektif lokal ini terdaftar secara resmi untuk menunjang logistik gotong royong dan efisiensi bersama warga komunitas.'}
              </p>
            </div>

            {/* Buying Action Box */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Beli Melalui Merchant Eksternal</h3>
                <p className="text-xs text-zinc-500">
                  Pembelian melalui link afiliasi etis ini akan memberikan bagi hasil otomatis berupa kas komunitas untuk RT/RW setempat demi kemaslahatan warga.
                </p>
              </div>

              {/* Just-In-Time Affiliate link button */}
              <a 
                href={jitAffiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-bold hover:from-emerald-400 hover:to-emerald-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-center"
              >
                <span>Beli Sekarang via {platform.toUpperCase()}</span>
                <span className="text-lg">↗</span>
              </a>

              <div className="text-center text-[10px] text-zinc-500 font-mono flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                JIT Link Injection Active (?ref=urunwarga)
              </div>
            </div>

            {/* Community Accountability block */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/80 space-y-3 text-xs">
              <div className="flex items-center justify-between text-white font-bold">
                <span>Penyelenggara Simpul</span>
                <span className="text-emerald-400">Terverifikasi</span>
              </div>
              <p className="text-zinc-500">
                Barang ini didaftarkan dan dipertanggungjawabkan oleh pengurus **{communityName}**. Dana transaksi diawasi oleh ledger yang terenskripsi di tingkat database.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Visual Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-center text-xs text-zinc-600 relative z-10">
        <p className="mb-2">© 2026 URUN Warga. Dibangun dengan Kedaulatan Data Lokal & Efisiensi Kolektif.</p>
        <p>AEO/GEO Engine memanfaatkan schema-dts & Supabase Postgres geospatial variables.</p>
      </footer>
    </div>
  );
}
