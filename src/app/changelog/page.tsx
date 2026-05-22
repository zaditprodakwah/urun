import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: "Changelog - Transparansi Pembaruan URUN",
  description: "Riwayat perbaikan, keamanan, dan fitur baru pada sistem URUN.",
};

export default function ChangelogPage() {
  return (
    <div className="flex-1 w-full relative overflow-x-hidden pt-12 pb-24 bg-surface text-on-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-sans mb-4">
            Catatan Pembaruan <br/>
            <span className="text-on-surface-variant">Sistem (Changelog)</span>
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Kami berkomitmen penuh pada transparansi teknologi. Seluruh pembaruan algoritma, peningkatan keamanan data, dan perilisan fitur didokumentasikan secara terbuka di halaman ini.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-12">
          
          {/* Release Entry */}
          <div className="relative pl-8 sm:pl-0">
            {/* Desktop Timeline Line */}
            <div className="hidden sm:block absolute left-[120px] top-2 bottom-0 w-px bg-outline-variant/60"></div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
              <div className="sm:w-[100px] shrink-0 pt-1">
                <div className="text-xs font-black text-primary uppercase tracking-wider mb-1">
                  MEI 2026
                </div>
                <div className="flex items-center text-[10px] font-bold text-on-surface-variant gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 22 Mei
                </div>
              </div>

              <div className="relative flex-1 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="hidden sm:flex absolute -left-[17px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-surface"></div>
                
                <h3 className="text-xl font-black mb-4">Peningkatan Stabilitas Multi-Sig & Proteksi Kedaulatan Data</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                  Pembaruan kali ini difokuskan pada penguatan lapisan *backend* (keamanan inti) yang menopang lalu lintas kas lingkungan Anda, sekaligus mencegah kelebihan beban server saat rekonsiliasi harian.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-on-surface mb-1">Proteksi Ganda Transaksi Multi-Sig</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Kami telah memasang penangkal *double-spending* terpadu (Idempotensi) pada modul antrean Multi-Sig. Jika gawai Anda kehilangan sinyal saat memproses persetujuan di atas 5 juta Rupiah, sistem dijamin tidak akan pernah membuat antrean duplikat.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-on-surface mb-1">Akurasi Audit Pecahan Rupiah</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Mengubah metode komputasi mesin robot pelacak kas agar kebal terhadap bug perhitungan desimal *floating-point*. Laporan ketidaksesuaian kas kini 100% presisi sempurna.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-on-surface mb-1">Persetujuan Terbuka Saat Masuk (Login)</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Memastikan setiap pengguna baik Warga maupun Pengurus memahami hak-hak Privasi dan Syarat Ketentuan sebelum mengaktifkan simpul URUN, sesuai dengan undang-undang PDP.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
