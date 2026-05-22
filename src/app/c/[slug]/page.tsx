import React from 'react';
import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase-server';
import PublicCommunityGateway from '@/components/gateway/PublicCommunityGateway';

// [ISR] Incremental Static Regeneration - Caching Agresif per 60 Detik
export const revalidate = 60; 

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { data } = await supabaseAdmin
    .from('communities')
    .select('name, description')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!data) return { title: 'Tidak Ditemukan | URUN Gateway' };
  
  return {
    title: `${data.name} - Transparansi Publik | URUN`,
    description: data.description || `Portal transparansi kas dan tata kelola komunitas ${data.name}.`,
    openGraph: {
      title: `${data.name} - Portal Tata Kelola Transparan`,
      description: data.description || 'Didukung oleh Sistem Operasi URUN - Kedaulatan Data Lokal.',
    }
  };
}

export default async function PublicGatewayPage({ params }: Props) {
  const resolvedParams = await params;
  
  // 1. Panggil RPC Agregasi Finansial (Sangat Aman & Ringan)
  const { data, error } = await supabaseAdmin.rpc('get_public_community_health', { 
    p_slug: resolvedParams.slug 
  });
  
  const gatewayData = error || !data ? { status: 'not_found' as const } : data;

  // 2. Konstruksi Injeksi Semantic SEO / AEO (Schema.org) Multipel
  const jsonLdEntities: any[] = [];
  
  if (gatewayData.status === 'success') {
    // A. Skema Organisasi (Komunitas)
    jsonLdEntities.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': gatewayData.community?.name,
      'description': gatewayData.community?.description,
      'url': `https://urun.app/c/${gatewayData.community?.slug}`,
      'foundingDate': new Date().toISOString().split('T')[0]
    });

    // B. Skema Produk/Tender Pengadaan (Agar di-crawl Perplexity/Gemini sebagai program pendanaan)
    const tenders = gatewayData.metrics?.tenders || [];
    tenders.forEach((t: any) => {
      jsonLdEntities.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': t.title,
        'description': `Program Pengadaan Kolektif Warga. Target pengumpulan: Rp${t.target_amount.toLocaleString('id-ID')}`,
        'offers': {
          '@type': 'AggregateOffer',
          'priceCurrency': 'IDR',
          'lowPrice': t.collected_amount,
          'highPrice': t.target_amount,
          'offerCount': 1,
          'availability': 'https://schema.org/InStock'
        }
      });
    });
  }

  return (
    <div className="min-h-screen bg-surface selection:bg-primary selection:text-white">
      {jsonLdEntities.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEntities) }}
        />
      )}
      
      {/* 3. Render Komponen Utama (Pure Server Component) */}
      <PublicCommunityGateway data={gatewayData} />
    </div>
  );
}
