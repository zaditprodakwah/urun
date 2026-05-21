import React from "react";
import { Shield, Users, Server, Database, Activity, Lock, KeyRound } from "lucide-react";

export const metadata = {
  title: "Tentang Kami",
  description: "Membangun Kedaulatan di Tingkat Akar Rumput bersama URUN.",
};

export default function TentangPage() {
  return (
    <div className="flex-1 w-full relative overflow-x-hidden pt-12 pb-24">
      {/* SECTION 1: HERO MANIFESTO */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Membangun Kedaulatan di <span className="text-emerald-400">Tingkat Akar Rumput.</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
          URUN didirikan bukan untuk menjadi raksasa teknologi komersial baru, melainkan sebuah utilitas digital netral yang memulangkan kendali keuangan, privasi data, dan hak suara ke dalam genggaman komunitas lokal (RT/RW/Paguyuban). Kami mengganti sistem algoritma adiktif dengan protokol kegotongroyongan.
        </p>
      </section>

      {/* SECTION 2: 3 PILAR UTAMA */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10 tracking-tight">Tiga Konstitusi Kedaulatan URUN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Local Data Stewardship</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Kedaulatan data berada sepenuhnya di tangan komunitas lokal. Seluruh data nomor WhatsApp, profil identitas, dan mutasi saldo warga diisolasi mutlak menggunakan kebijakan Row-Level Security (RLS) di level database PostgreSQL untuk mencegah pencurian data komersial.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Collective Efficiency</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Memangkas kebocoran ekonomi di tingkat lingkungan dengan memotong margin perantara besar, menghubungkan simpul langsung ke penyedia terpercaya, serta mengembalikan 70% surplus bagi hasil pengelolaan langsung ke dalam kas internal komunitas.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Human-Centric Resilience</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sistem operasi yang ringkas, tanpa intervensi iklan, dan ramah terhadap perangkat seluler lama. Mendukung arsitektur lokal penyelarasan mandiri (local-first state) untuk memastikan pencatatan keuangan tetap tangguh berjalan di area internet marginal.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: 7 ATURAN KEAMANAN */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="border-t border-zinc-900 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">7 Aturan Sakral Keamanan Komunitas</h2>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto">Sistem yang mendikte protokol ketat untuk menjamin kedaulatan warga di atas intervensi administratif.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "01", icon: <Shield />, title: "Kedaulatan Data Terisolasi", desc: "Data tiap komunitas diisolasi kaku via RLS." },
              { id: "02", icon: <Lock />, title: "Akuntansi Kas Permanen", desc: "Buku kas immutable (Append-Only) menolak manipulasi sepihak." },
              { id: "03", icon: <KeyRound />, title: "Minimisasi Pengumpulan", desc: "Sistem menolak mengumpulkan data non-esensial atau melacak warga." },
              { id: "04", icon: <Users />, title: "Skor Dedikasi Linier", desc: "Reputasi dihitung dari aksi kolektif nyata tanpa bias administratif." },
              { id: "05", icon: <Shield />, title: "Kuorum Multi-Pengurus", desc: "Pencairan kas besar wajib via 2 tanda tangan digital saksi." },
              { id: "06", icon: <Activity />, title: "Rekonsiliasi Otomatis", desc: "Cron job harian berburu transaksi ganda atau ghost-entry." },
              { id: "07", icon: <Database />, title: "Hak Portabilitas Data", desc: "Ekspor mutlak dan penghapusan anonimisasi." }
            ].map((rule) => (
              <div key={rule.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-emerald-500 group-hover:opacity-20 transition-opacity">{rule.id}</div>
                <div className="text-emerald-400 mb-3">{rule.icon}</div>
                <h4 className="font-bold text-white text-sm mb-2 relative z-10">{rule.title}</h4>
                <p className="text-xs text-zinc-400 relative z-10">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
