import React from 'react';
import { ShieldCheck, Lock, Activity, Users, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface GatewayData {
  status: 'success' | 'private' | 'not_found';
  name?: string;
  message?: string;
  community?: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  metrics?: {
    balance: number;
    tenders: Array<{
      id: string;
      title: string;
      target_amount: number;
      collected_amount: number;
      progress_percentage: number;
    }>;
    polls: Array<{
      id: string;
      question: string;
      total_votes: number;
    }>;
  };
  generated_at?: number;
}

export default function PublicCommunityGateway({ data }: { data: GatewayData }) {
  // --- HANDLER: NOT FOUND ---
  if (data.status === 'not_found') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-on-surface-variant">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-on-surface mb-2 font-sans">Simpul Tidak Ditemukan</h1>
        <p className="text-on-surface-variant text-sm max-w-sm">Tautan komunitas tidak valid atau pengurus telah menonaktifkan simpul ini dari ekosistem URUN.</p>
        <Link href="/" className="mt-6 text-primary font-bold text-sm hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  // --- HANDLER: PRIVATE / TERTUTUP ---
  if (data.status === 'private') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-20 h-20 bg-surface-container-highest rounded-[2rem] border border-outline-variant flex items-center justify-center mb-6 text-primary shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-on-surface mb-3">{data.name}</h1>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/50 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sovereign Privacy Active</span>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mx-auto">
          {data.message || 'Pengurus menetapkan kebijakan transparansi tertutup. Hanya warga internal terverifikasi yang dapat mengakses buku besar, tender, dan pemilu komunal.'}
        </p>
      </div>
    );
  }

  // --- HANDLER: SUCCESS (PUBLIC GATEWAY) ---
  const { community, metrics, generated_at } = data;
  const balance = metrics?.balance || 0;
  const tenders = metrics?.tenders || [];
  const polls = metrics?.polls || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-20 font-sans space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-5">
        <div className="w-24 h-24 mx-auto bg-surface-container rounded-full border border-outline-variant/30 flex items-center justify-center shadow-inner relative">
          <span className="text-4xl font-black text-primary select-none">{community?.name?.charAt(0) || 'U'}</span>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-surface shadow-sm" title="Tervalidasi Publik">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">{community?.name}</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-2 max-w-md mx-auto leading-relaxed">
            {community?.description || 'Berdaulat atas data. Berkembang lewat gotong royong kolektif.'}
          </p>
        </div>
      </div>

      {/* MODUL 1: LIVE BALANCE */}
      <div className="bg-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-xs font-black uppercase tracking-widest text-outline">Kesehatan Kas Kolektif</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-on-surface">Rp</span>
            <span className="text-5xl font-black font-mono text-primary tracking-tighter">
              {balance.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded w-fit uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            Real-time Aggregation
          </div>
        </div>
      </div>

      {/* MODUL 2: ACTIVE TENDERS */}
      {tenders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-on-surface uppercase tracking-widest flex items-center gap-2 px-2">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            Pengadaan Publik Berjalan
          </h2>
          <div className="grid gap-3">
            {tenders.map((t) => (
              <div key={t.id} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 hover:border-outline-variant transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-on-surface text-sm leading-tight max-w-[70%]">{t.title}</h3>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                    {t.progress_percentage}%
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${t.progress_percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono font-medium text-outline">
                  <span>Terkumpul: Rp {t.collected_amount.toLocaleString('id-ID')}</span>
                  <span>Target: Rp {t.target_amount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODUL 3: ACTIVE POLLS */}
      {polls.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-on-surface uppercase tracking-widest flex items-center gap-2 px-2">
            <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
            Jajak Pendapat Aktif
          </h2>
          <div className="grid gap-3">
            {polls.map((p) => (
              <div key={p.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex items-center justify-between group cursor-pointer hover:border-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline group-hover:text-secondary group-hover:bg-secondary/10 transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface line-clamp-1">{p.question}</h3>
                    <p className="text-[10px] text-outline font-medium">{p.total_votes} warga telah bersuara</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-secondary" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER & COMPLIANCE BADGE */}
      <div className="pt-12 text-center border-t border-outline-variant/30">
        <p className="text-[10px] font-mono text-outline-variant max-w-sm mx-auto leading-relaxed">
          Tampilan agregasi ini dihasilkan secara otomatis oleh <strong>URUN Protocol</strong>. 
          Data pribadi penyumbang/warga dilindungi penuh sesuai mandat UU PDP No.27/2022.
        </p>
        {generated_at && (
          <p className="text-[9px] text-outline mt-2 font-mono">
            Snapshot Timestamp: {new Date(generated_at * 1000).toISOString()}
          </p>
        )}
      </div>

    </div>
  );
}
