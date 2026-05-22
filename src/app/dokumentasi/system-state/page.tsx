import React from 'react';
import { Settings, CheckCircle2, ShieldAlert } from 'lucide-react';

// Cache agresif: Konfigurasi sistem global (hardcoded/env) amat jarang berubah.
export const revalidate = 3600; 

export default function SystemStateDocsPage() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto font-sans space-y-8 bg-surface min-h-screen">
      <div className="space-y-2 border-b border-outline-variant/20 pb-8">
        <h1 className="text-3xl font-black text-on-surface flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> 
          Parameter Konfigurasi Arsitektur
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl">
          Halaman dokumentasi ini menyajikan parameter keamanan absolut yang terukir secara permanen di dalam kode pemrograman (Immutable State). Tidak ada entitas atau administrator yang dapat memanipulasi aturan ini secara sepihak.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Aturan 1: Multi-Sig */}
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] z-0"></div>
          <div className="relative z-10">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-secondary" /> 
              Protokol Multi-Sig (Persetujuan Bersama)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                <div className="text-xs font-bold text-outline uppercase">Syarat Pencairan Kas</div>
                <div className="text-xl font-black text-on-surface mt-1">Minimal 3 Tanda Tangan</div>
                <div className="text-[10px] text-on-surface-variant mt-2">(Ketua, Bendahara, & Sekretaris/Pengawas)</div>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                <div className="text-xs font-bold text-outline uppercase">Batas Kedaluwarsa Persetujuan</div>
                <div className="text-xl font-black text-on-surface mt-1">48 Jam Tepat</div>
                <div className="text-[10px] text-on-surface-variant mt-2">Sistem otomatis membatalkan jika menggantung.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Aturan 2: Anti Ghost Investor */}
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
           <h2 className="text-lg font-black text-on-surface flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-error" /> 
              Protokol Anti-Ghost Investor
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              URUN menerapkan mekanisme penghapusan aman. Jika seorang warga (yang telah menyumbang/berinvestasi di tender yang sedang berjalan) secara sepihak menghapus akunnya, sistem tidak akan menghapus data finansial (Immutability Ledger).
            </p>
            <ul className="text-xs text-on-surface-variant space-y-2 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
              <li className="flex items-start gap-2">
                <span className="text-secondary font-black">1.</span>
                Identitas pribadi (Nama, Nomor HP) dihapus / dianonimisasi permanen demi menaati UU PDP (Right to be Forgotten).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary font-black">2.</span>
                Dana yang telah terekam di buku kas diubah nama pemiliknya menjadi entitas &quot;Anonim Warga RT&quot;.
              </li>
            </ul>
        </div>

      </div>
    </div>
  );
}
