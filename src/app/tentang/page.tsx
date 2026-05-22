import React from "react";
import Link from "next/link";
import { Shield, Users, Server, Database, Activity, Lock, KeyRound, BookOpen, ShieldCheck, CreditCard, Store, ArrowRight, PlayCircle, ChevronRight, FileText } from "lucide-react";

export const metadata = {
  title: "Tentang Kami & Pusat Edukasi - Gerakan Gotong Royong URUN",
  description: "Membangun Kedaulatan di Tingkat Akar Rumput bersama URUN.",
};

export default function TentangPage() {
  return (
    <div className="flex-1 w-full bg-[#FCFBF9] text-zinc-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-800 relative overflow-hidden pt-12 pb-24">
      {/* Background elegant architectural line details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e2db_1px,transparent_1px),linear-gradient(to_bottom,#e5e2db_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10"></div>
      
      {/* Soft bright warm ambient glows */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Navigasi Pil (Menu Dokumentasi Hukum & Teknis) */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-3 pt-6 mb-4">
        <Link href="/kebijakan-privasi" className="px-4 py-2 bg-white border border-outline-variant rounded-full text-xs font-bold text-zinc-600 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-sm flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Kebijakan Privasi
        </Link>
        <Link href="/syarat-ketentuan" className="px-4 py-2 bg-white border border-outline-variant rounded-full text-xs font-bold text-zinc-600 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-sm flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Syarat & Ketentuan
        </Link>
        <Link href="/dokumentasi" className="px-4 py-2 bg-white border border-outline-variant rounded-full text-xs font-bold text-zinc-600 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-sm flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Dokumentasi
        </Link>
      </div>

      {/* SECTION 1: HERO MANIFESTO */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-10">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
          Menghidupkan Kembali Gotong Royong di <span className="text-emerald-700">Tingkat RT/RW Kita.</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl mx-auto font-medium">
          URUN didirikan bukan untuk mencari keuntungan komersial, melainkan sebagai wadah digital netral untuk mengembalikan kendali keuangan, privasi data, dan hak suara ke dalam genggaman warga secara langsung. Kami mengganti sistem yang kaku dengan semangat kekeluargaan dan gotong royong yang nyata.
        </p>
      </section>

      {/* SECTION 2: 3 PILAR UTAMA */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-2xl font-black text-zinc-900 text-center mb-10 tracking-tight">Tiga Nilai Utama Gerakan URUN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-outline-variant rounded-3xl p-8 hover:border-primary/50 hover:shadow-lg hover:shadow-on-surface/5 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-3">Keamanan Data Warga</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-semibold">
              Seluruh data penting seperti nomor <em>WhatsApp</em>, profil keluarga, dan catatan iuran Anda disimpan dengan aman dan rahasia. Data ini diisolasi secara ketat dan tidak akan pernah dibagikan atau dijual ke pihak luar untuk keperluan iklan.
            </p>
          </div>
          
          <div className="bg-white border border-outline-variant rounded-3xl p-8 hover:border-primary/50 hover:shadow-lg hover:shadow-on-surface/5 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-3">Efisiensi Gotong Royong</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-semibold">
              Membantu warga mendapatkan kebutuhan pokok atau iuran pembangunan sarana lingkungan dengan harga terbaik tanpa perantara. Sebagian sisa hasil iuran/<em>procurement</em> dikembalikan langsung sebagai dana kas sosial warga.
            </p>
          </div>

          <div className="bg-white border border-outline-variant rounded-3xl p-8 hover:border-primary/50 hover:shadow-lg hover:shadow-on-surface/5 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary mb-6">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-3">Mudah Diakses & Ringan</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-semibold">
              Didesain sesederhana mungkin agar mudah digunakan oleh warga paruh baya sekalipun. Sistem ini berjalan sangat ringan tanpa iklan berat, bahkan tetap lancar diakses menggunakan HP jadul dengan koneksi internet yang terbatas.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: EDUKASI WARGA (Integrated) */}
      <section id="edukasi" className="w-full max-w-5xl mx-auto px-6 py-24 mt-20 border-t border-outline-variant">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 mb-6 text-emerald-600 shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900 tracking-tight">Pusat Belajar Warga</h2>
          <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-semibold">
            Panduan interaktif warga URUN. Pelajari cara mengamankan dana lingkungan, mendukung usaha tetangga, dan berkontribusi melalui Persetujuan Bersama secara aman.
          </p>
        </div>

        <div className="space-y-20">
          {/* Modul 1: Buku Kas Terkunci */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="aspect-[4/3] rounded-3xl bg-zinc-100 border border-zinc-200 shadow-inner relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:bg-zinc-200 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200/50 to-transparent" />
                <PlayCircle className="w-16 h-16 text-zinc-300 group-hover:text-emerald-500 transition-colors relative z-10" />
                <p className="mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10">Animasi: Cara Iuran via <em>WhatsApp</em></p>
              </div>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                <CreditCard className="w-3.5 h-3.5" /> Transparansi Kas
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 leading-tight">Buku Kas Terkunci</h3>
              <p className="text-zinc-600 leading-relaxed text-base font-semibold">
                Iuran lingkungan kini tercatat dalam <strong>Buku Kas Terkunci</strong> secara otomatis. Setiap uang masuk dan keluar akan langsung terdistribusi kepada seluruh warga secara <em>real-time</em> via <em>WhatsApp</em>. Pengurus tidak bisa menghapus histori pengeluaran tanpa jejak.
              </p>
              <button className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-500 transition-colors pt-2 group">
                Lihat Panduan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-200" />

          {/* Modul 2: Pasar Tetangga */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                <Store className="w-3.5 h-3.5" /> Pasar Komunitas
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 leading-tight">Mendukung Dagangan Tetangga</h3>
              <p className="text-zinc-600 leading-relaxed text-base font-semibold">
                Jelajahi etalase warga setempat. Beli sembako atau pesan jasa perbaikan langsung dari tetangga tanpa potongan biaya <em>platform</em>. Pesanan dan negosiasi berlangsung privat, namun integritas penjual dijamin lewat ulasan warga.
              </p>
              <Link href="/catalog" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-500 transition-colors pt-2 group">
                Buka Katalog Warga <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-3xl bg-zinc-100 border border-zinc-200 shadow-inner relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:bg-zinc-200 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200/50 to-transparent" />
                <PlayCircle className="w-16 h-16 text-zinc-300 group-hover:text-blue-500 transition-colors relative z-10" />
                <p className="mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10">Animasi: <em>Checkout</em> Otomatis</p>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-200" />

          {/* Modul 3: Persetujuan Bersama */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="aspect-[4/3] rounded-3xl bg-zinc-100 border border-zinc-200 shadow-inner relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:bg-zinc-200 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200/50 to-transparent" />
                <PlayCircle className="w-16 h-16 text-zinc-300 group-hover:text-indigo-500 transition-colors relative z-10" />
                <p className="mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10">Animasi: Tanda Tangan Warga</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Keamanan Data
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 leading-tight">Persetujuan Bersama</h3>
              <p className="text-zinc-600 leading-relaxed text-base font-semibold">
                Protokol keamanan URUN menjamin pengeluaran kas yang besar tidak bisa dilakukan sepihak. Harus ada <strong>Persetujuan Bersama</strong> dari mayoritas warga atau pengurus (lewat <em>voting bot WhatsApp</em>) sebelum dana dicairkan. Uang Anda, keputusan Anda.
              </p>
              <button className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-500 transition-colors pt-2 group">
                Simulasikan Persetujuan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: 7 ATURAN KEAMANAN */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="border-t border-outline-variant pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">7 Aturan Aman & Terbuka Komunitas URUN</h2>
            <p className="text-zinc-500 text-sm max-w-2xl mx-auto font-semibold">Prinsip dasar yang kami pegang teguh untuk melindungi hak-hak seluruh warga di lingkungan tempat tinggal kita.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "01", icon: <Shield />, title: "Data Warga Rahasia", desc: "Data tiap lingkungan RT/RW diisolasi ketat agar tidak saling bocor." },
              { id: "02", icon: <Lock />, title: "Buku Kas Jujur", desc: "Setiap mutasi kas dicatat permanen dan tidak bisa diubah sepihak oleh siapapun." },
              { id: "03", icon: <KeyRound />, title: "Tanpa Pelacakan Iklan", desc: "Kami tidak melacak perilaku warga atau memasang kuki pelacak komersial." },
              { id: "04", icon: <Users />, title: "Skor Keaktifan Adil", desc: "Apresiasi skor dihitung transparan berdasarkan partisipasi nyata gotong royong." },
              { id: "05", icon: <Shield />, title: "Persetujuan Kas Ganda", desc: "Pencairan kas besar wajib mendapat persetujuan minimal dari 2 pengurus RT/RW." },
              { id: "06", icon: <Activity />, title: "Penyelarasan Kas Harian", desc: "Pemeriksaan otomatis setiap hari untuk mendeteksi adanya mutasi dana yang mencurigakan." },
              { id: "07", icon: <Database />, title: "Hak Kendali Penuh", desc: "Warga berhak meminta salinan data atau menghapus akun mereka secara mandiri." }
            ].map((rule) => (
              <div key={rule.id} className="p-6 bg-white border border-outline-variant rounded-2xl relative overflow-hidden group hover:border-primary/50 hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-[0.04] font-black text-6xl text-primary group-hover:opacity-10 transition-opacity select-none">{rule.id}</div>
                <div className="text-primary mb-4.5">{rule.icon}</div>
                <h4 className="font-extrabold text-zinc-900 text-sm mb-2 relative z-10">{rule.title}</h4>
                <p className="text-xs text-zinc-500 font-semibold relative z-10 leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
