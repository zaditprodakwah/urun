import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-server';
import { ExternalLink, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CatalogEmbedWidget({ params }: PageProps) {
  const { slug } = await params;

  const { data: item } = await supabaseAdmin
    .from('catalog_items')
    .select('*, communities(name)')
    .eq('slug', slug)
    .eq('status', 'public')
    .single();

  if (!item) {
    return notFound();
  }

  const metadata = item.metadata || {};
  const price = metadata.price || 0;
  const image = metadata.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
  const averageRating = metadata.rating || 0;
  
  const targetUrl = `/catalog/${slug}`;

  return (
    <div className="min-h-screen bg-transparent font-sans flex items-center justify-center p-2">
      <Link 
        href={targetUrl}
        target="_parent"
        className="block w-full max-w-sm bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
      >
        <div className="aspect-[4/3] w-full bg-zinc-100 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
            <ExternalLink className="w-4 h-4 text-zinc-600" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-black text-zinc-900 text-base leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
              {item.title}
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
              {item.communities?.name || 'Komunitas URUN'}
            </p>
          </div>

          <div className="flex items-end justify-between pt-2">
            <div>
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Harga</span>
              <span className="font-black text-emerald-700 text-lg">
                Rp {price.toLocaleString('id-ID')}
              </span>
            </div>
            
            {averageRating > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-black text-amber-900">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
