import React from "react";
import Link from "next/link";
import { Play, Shield, Lock, ArrowRight, Activity, Users, FileText } from "lucide-react";

export const metadata = {
  title: "Demo Sandboxed - URUN",
  description: "Coba simulasi lingkungan URUN secara aman dan terisolasi",
};

export default function DemoPage() {
  return (
    <div className="flex-1 w-full relative overflow-x-hidden pt-12 pb-24 bg-surface text-on-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full w-fit mx-auto">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-wider font-mono">Simulator Lingkungan Terisolasi</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-sans">
            Eksplorasi Ekosistem URUN <br />
            <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Tanpa Risiko Data</span>
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Selamat datang di lingkungan sandboxed. Anda dapat mencoba seluruh fitur URUN menggunakan data simulasi buatan. Tidak ada data nyata yang disimpan atau diproses di sini.
          </p>
        </div>

        {/* Akun Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Card Warga */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-3">Akses Warga (User)</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Masuk sebagai warga untuk mencoba memantau kas, membayar iuran simulasi, dan melihat transparansi pengadaan.
              </p>
              
              <div className="bg-white p-4 rounded-xl border border-outline-variant mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant">Email Simulasi</span>
                  <span className="text-xs font-mono font-bold">warga@demo.urun.id</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant">Kata Sandi</span>
                  <span className="text-xs font-mono font-bold">demo1234</span>
                </div>
              </div>
            </div>
            
            <Link href="/login" className="h-12 bg-primary hover:bg-opacity-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 cursor-pointer">
              Gunakan Akun Warga <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card Pengurus */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:border-secondary/50 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-black mb-3">Akses Pengurus (Admin)</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Masuk sebagai RT/Bendahara untuk mencoba dashboard pengurus, memvalidasi pencairan kas, dan menyusun program rintisan.
              </p>
              
              <div className="bg-white p-4 rounded-xl border border-outline-variant mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant">Email Simulasi</span>
                  <span className="text-xs font-mono font-bold">rt@demo.urun.id</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant">Kata Sandi</span>
                  <span className="text-xs font-mono font-bold">demo1234</span>
                </div>
              </div>
            </div>
            
            <Link href="/login" className="h-12 bg-secondary hover:bg-opacity-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-secondary/20 cursor-pointer">
              Gunakan Akun Pengurus <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Info Box */}
        <div className="bg-[#FCFBF9] border border-outline-variant rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-white border border-outline-variant/60 flex items-center justify-center shrink-0 shadow-sm">
            <Lock className="w-6 h-6 text-on-surface-variant" />
          </div>
          <div>
            <h4 className="text-sm font-black mb-1">Keamanan Data Terjamin</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Lingkungan Demo menggunakan basis data yang terpisah secara fisik dari lingkungan produksi. Semua data sesi, aktivitas transaksi, dan riwayat simulasi akan otomatis dihapus setiap 24 jam untuk menjaga privasi dan integritas sistem.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
