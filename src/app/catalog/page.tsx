import { supabaseAdmin } from '@/lib/supabase-server';
import { 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import CatalogClient from '@/components/catalog/CatalogClient';

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


  return (
    <div className="min-h-screen bg-[#FCFBF9] text-zinc-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-800 relative overflow-hidden">
      {/* Background elegant architectural line details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e2db_1px,transparent_1px),linear-gradient(to_bottom,#e5e2db_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10"></div>
      
      {/* Soft bright warm ambient glows */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>



      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-bold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kedaulatan Logistik Tingkat RT/RW</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
            Etalase Produk Unggulan <span className="text-emerald-700">Warga Setempat</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-medium">
            Temukan beras premium, perkakas gotong royong, masakan dapur tetangga, dan layanan jasa mandiri yang disediakan langsung oleh sesama anggota komunitas. Murah karena tanpa perantara, berkah karena memajukan ekonomi warga.
          </p>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        
        <CatalogClient initialItems={catalogItems} />
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
