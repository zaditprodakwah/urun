import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 60; // Incremental Static Regeneration every 60 seconds

export default async function CatalogPage() {
  // Query only public catalog items, joining with community metadata
  const { data: items, error } = await supabaseAdmin
    .from('catalog_items')
    .select('*, communities(name, geo_context)')
    .eq('status', 'public')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching catalog items:', error);
  }

  const catalogItems = items || [];

  // Group items by category for interactive display or tags
  const categories = Array.from(
    new Set(catalogItems.map((item) => item.metadata?.category || 'Sembako'))
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-zinc-950">U</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">URUN</span>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Catalog
                </span>
              </div>
              <p className="text-xs text-zinc-400">Public Collective Marketplace</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Papan Peringkat
            </Link>
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Kembali Ke Pusat Komando
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AEO & SEO Engine Active
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <span className="text-emerald-400">❖</span> Katalog Komoditas Berdaulat
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Etalase Produk Unggulan <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">Simpul Warga</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Menampilkan komoditas primer, perkakas, dan bahan baku lokal yang dikelola bersama oleh warga RT/RW secara efisien. Transparan, beretika, dan diprioritaskan untuk pemenuhan gotong royong lokal.
          </p>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-900 pb-6">
          <span className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
            Semua Kategori ({catalogItems.length})
          </span>
          {categories.map((cat, idx) => (
            <span key={idx} className="px-4 py-2 rounded-full text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800/80">
              {cat}
            </span>
          ))}
        </div>

        {catalogItems.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-sm max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-white mb-2">Katalog Masih Kosong</h3>
            <p className="text-zinc-500 text-sm">Belum ada item publik yang didaftarkan oleh admin atau pengurus komunitas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogItems.map((item) => {
              const price = item.metadata?.price || 0;
              const category = item.metadata?.category || 'Sembako';
              const sku = item.metadata?.sku || `SKU-${item.slug.toUpperCase()}`;
              const image = item.metadata?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
              const communityName = item.communities?.name || 'Komunitas URUN';
              const communityGeo = item.communities?.geo_context;
              const locationStr = communityGeo 
                ? `${communityGeo.village || ''}, ${communityGeo.district || ''}` 
                : 'Lokasi Komunitas';

              return (
                <div 
                  key={item.id}
                  className="group relative rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-emerald-500/20 transition-all duration-300 overflow-hidden flex flex-col backdrop-blur-sm"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950 border-b border-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 text-emerald-400 tracking-wider uppercase">
                      {category}
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="font-mono text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{sku}</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {locationStr}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {item.description || 'Deskripsi produk warga masih dalam proses pengunggahan.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-900/80 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500">Harga Kesepakatan</div>
                        <div className="text-lg font-extrabold text-white">
                          Rp {price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      
                      <Link 
                        href={`/catalog/${item.slug}`}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
                      >
                        Lihat Detail
                        <span className="text-sm">→</span>
                      </Link>
                    </div>
                  </div>

                  {/* Community tag footer */}
                  <div className="px-6 py-3 bg-zinc-950/60 border-t border-zinc-900/60 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Simpul: <strong className="text-zinc-400">{communityName}</strong></span>
                    <span className="font-semibold text-emerald-500/80">Kolektif</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Visual Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-center text-xs text-zinc-600 relative z-10">
        <p className="mb-2">© 2026 URUN Warga. Dibangun dengan Kedaulatan Data Lokal & Efisiensi Kolektif.</p>
        <p>Terhubung ke PostgreSQL melalui Supabase dengan enkripsi RLS penuh.</p>
      </footer>
    </div>
  );
}
