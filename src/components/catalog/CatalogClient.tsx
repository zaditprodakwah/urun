"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  Users, 
  ChevronRight, 
  Search, 
  ShoppingBag
} from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  metadata: {
    price?: number;
    category?: string;
    sku?: string;
    image?: string;
    rating?: number;
    review_count?: number;
  } | null;
  communities: {
    name: string;
    geo_context: {
      village?: string;
      district?: string;
    } | null;
  } | null;
}

interface CatalogClientProps {
  initialItems: CatalogItem[];
}

export default function CatalogClient({ initialItems }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  // Extract categories dynamically
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialItems.forEach(item => {
      const cat = item.metadata?.category;
      if (cat) {
        cats.add(cat);
      }
    });
    return Array.from(cats);
  }, [initialItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      // Category filter
      const matchesCategory = 
        selectedCategory === 'Semua Kategori' || 
        item.metadata?.category === selectedCategory;

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchLower) || 
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        (item.metadata?.category && item.metadata.category.toLowerCase().includes(searchLower)) ||
        (item.communities?.name && item.communities.name.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });
  }, [initialItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Categories Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-b border-outline-variant/60 pb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => setSelectedCategory('Semua Kategori')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 ${
              selectedCategory === 'Semua Kategori'
                ? 'bg-primary text-white shadow-md shadow-primary/10'
                : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            Semua Kategori ({initialItems.length})
          </button>
          
          {categories.map((cat, idx) => {
            const count = initialItems.filter(item => item.metadata?.category === cat).length;
            return (
              <button 
                key={idx} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                    : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Dynamic Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk, kategori, atau RT..." 
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-10 pr-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all font-semibold"
          />
        </div>
      </div>

      {/* Results grid */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center rounded-3xl border border-dashed border-outline-variant bg-surface-container-lowest max-w-xl mx-auto shadow-sm p-8 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface-variant/40">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-on-surface">Tidak ada produk ditemukan</h3>
            <p className="text-on-surface-variant/80 text-xs max-w-xs mx-auto leading-relaxed">
              Kami tidak dapat menemukan produk yang sesuai dengan kriteria filter atau kata kunci Anda saat ini.
            </p>
          </div>
          <div className="pt-2">
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua Kategori');
              }}
              className="px-5 py-2.5 rounded-xl bg-surface-container border border-outline text-on-surface font-black text-xs hover:bg-surface-container-high transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const price = item.metadata?.price || 0;
            const category = item.metadata?.category || 'Sembako';
            const sku = item.metadata?.sku || `SKU-${item.slug.toUpperCase()}`;
            const image = item.metadata?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
            const communityName = item.communities?.name || 'Komunitas URUN';
            const communityGeo = item.communities?.geo_context;
            const locationStr = communityGeo 
              ? `${communityGeo.village || ''}, ${communityGeo.district || ''}` 
              : 'Lingkungan RT/RW';
            
            const rating = item.metadata?.rating || 0;
            const reviewCount = item.metadata?.review_count || 0;

            return (
              <div 
                key={item.id}
                className="group relative rounded-3xl border border-outline-variant bg-surface-container-lowest hover:shadow-xl hover:shadow-on-surface/5 hover:border-outline/50 transition-all duration-300 overflow-hidden flex flex-col shadow-sm"
              >
                {/* Product Image (Clickable) */}
                <Link href={`/catalog/${item.slug}`} className="relative aspect-[16/10] overflow-hidden bg-surface-container border-b border-outline-variant block">
                  <OptimizedImage
                    src={image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    fill
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-black bg-surface/95 backdrop-blur-sm border border-outline-variant text-primary tracking-wider uppercase">
                    {category}
                  </div>

                  {/* Rating Badge */}
                  {rating > 0 && (
                    <div className="absolute bottom-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-black bg-surface/95 backdrop-blur-sm border border-outline-variant text-tertiary flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-tertiary text-tertiary" />
                      <span>{rating.toFixed(1)} ({reviewCount})</span>
                    </div>
                  )}
                </Link>

                {/* Product Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                      <span className="font-mono text-[9px] bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant text-on-surface font-semibold">{sku}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-outline" />
                        {locationStr}
                      </span>
                    </div>
                    
                    <Link href={`/catalog/${item.slug}`}>
                      <h3 className="text-lg font-black text-on-surface hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                      {item.description || 'Barang dagangan warga dengan jaminan kualitas terbaik dan harga gotong-royong.'}
                    </p>
                  </div>

                  <div className="pt-4.5 border-t border-outline-variant/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Harga Warga</div>
                      <div className="text-lg font-black text-on-surface font-mono">
                        Rp {price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/catalog/${item.slug}`}
                      className="px-4.5 py-2.5 text-xs font-black rounded-xl bg-primary text-white hover:bg-primary-container hover:shadow-md hover:shadow-primary/10 transition-all flex items-center gap-1 group/btn"
                    >
                      Beli & Detail
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Community tag footer */}
                <div className="px-6 py-4 bg-surface-container-low/60 border-t border-outline-variant flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-outline" />
                    <span>Pemilik: <strong className="text-on-surface font-black">{communityName}</strong></span>
                  </span>
                  <span className="font-black text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/20">Lokal</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
