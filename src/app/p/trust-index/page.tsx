import type { Metadata } from 'next';
import LivingSocialProof from '@/components/landing/LivingSocialProof';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Indeks Kepercayaan & Transparansi | URUN Warga',
  description: 'Tinjau bukti nyata tingkat transparansi kas rukun tetangga/warga dengan arsitektur keamanan tingkat perbankan.',
  openGraph: {
    title: 'Indeks Kepercayaan & Transparansi | URUN Warga',
    description: 'Tinjau bukti nyata tingkat transparansi kas rukun tetangga/warga dengan arsitektur keamanan tingkat perbankan.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'URUN Trust Index',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indeks Kepercayaan & Transparansi | URUN Warga',
    description: 'Tinjau bukti nyata tingkat transparansi kas rukun tetangga/warga.',
    images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function TrustIndexPage() {
  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-primary/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Beranda URUN</span>
        </Link>
      </div>

      {/* Render the full social proof component */}
      <LivingSocialProof />

      <div className="py-12 bg-white text-center border-t border-outline-variant/30">
        <p className="text-xs text-on-surface-variant font-mono">
          Semua ulasan di atas telah melalui proses anonimisasi sesuai UU PDP No. 27/2022 demi melindungi privasi warga di ruang publik.
        </p>
      </div>
    </div>
  );
}
