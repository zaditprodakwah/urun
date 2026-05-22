'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Smartphone, Box, Calculator, ShieldCheck } from 'lucide-react';

type CompetitorId = 'whatsapp' | 'superapp' | 'appkonvensional' | 'excel';

interface Competitor {
  id: CompetitorId;
  label: React.ReactNode;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  weaknesses: {
    title: string;
    desc: string;
  }[];
}

const COMPETITORS: Competitor[] = [
  {
    id: 'whatsapp',
    label: (
      <span>
        <em>WhatsApp Group</em>
      </span>
    ),
    icon: MessageCircle,
    color: 'bg-[#25D366] text-white',
    description: 'Bagus untuk sekadar bertukar pesan, namun sangat kacau untuk mengurus transparansi kas.',
    weaknesses: [
      {
        title: 'Komunikasi Mentah Tanpa Akuntabilitas',
        desc: 'Riwayat setoran iuran mudah tenggelam tertumpuk ratusan percakapan gosip warga setiap harinya.'
      },
      {
        title: 'Eksposur Data Privasi Mutlak',
        desc: 'Nomor HP, foto bukti transfer (berisi nama/norek), dan KTP sering tersebar liar ke grup besar tanpa filter enkripsi spesifik.'
      },
      {
        title: 'Rawan Manipulasi Struk',
        desc: 'Sangat mudah memanipulasi resi transfer, dan bendahara kesulitan mencocokkan setiap notifikasi dengan mutasi rekening.'
      }
    ]
  },
  {
    id: 'superapp',
    label: (
      <span>
        <em>Superapps</em> (Komersial Ekstraktif)
      </span>
    ),
    icon: Smartphone,
    color: 'bg-indigo-600 text-white',
    description: 'Menawarkan kemudahan konsumerisme, namun menyedot perputaran ekonomi keluar dari wilayah Anda.',
    weaknesses: [
      {
        title: 'Pajak Platform Ekstraktif (Biaya Admin Besar)',
        desc: 'Setiap transaksi memungut margin besar (hingga 15-20%) yang seluruhnya disedot ke kas korporasi raksasa di pusat.'
      },
      {
        title: 'Ekonomi Linier (Satu Arah)',
        desc: 'Keuntungan transaksi lingkungan tidak pernah dikembalikan ke lingkungan Anda. Komunitas Anda hanya dijadikan sapi perah logistik.'
      },
      {
        title: 'Monopoli Keputusan Pemasok',
        desc: 'Pilihan mitra pedagang dan kurir diatur oleh algoritma mereka, mematikan peluang warung kelontong milik tetangga sendiri.'
      }
    ]
  },
  {
    id: 'appkonvensional',
    label: (
      <span>
        Aplikasi Manajemen RT/RW Biasa
      </span>
    ),
    icon: Box,
    color: 'bg-zinc-800 text-white',
    description: 'Aplikasi manajemen kas berbayar yang biasanya rumit dan sulit digunakan oleh kalangan lansia.',
    weaknesses: [
      {
        title: 'Friksi Unduhan Berukuran Besar (App Fatigue)',
        desc: 'Mewajibkan tiap warga mengunduh APK/Aplikasi berat via <em>Play Store</em>. Lansia dan warga dengan HP memori penuh enggan menggunakannya.'
      },
      {
        title: 'Model Berlangganan Membebani Kas',
        desc: 'Pengurus seringkali ditagih biaya berlangganan bulanan mahal hanya untuk fitur pencatatan buku kas sederhana.'
      },
      {
        title: 'Sekadar Buku Catatan Digital',
        desc: 'Tidak memiliki integrasi PPOB, tidak menangkap margin diskon komoditas, dan tidak bisa menghasilkan uang kas secara otonom.'
      }
    ]
  },
  {
    id: 'excel',
    label: (
      <span>
        Buku Kas <em>Excel</em> Fisik
      </span>
    ),
    icon: Calculator,
    color: 'bg-[#107C41] text-white',
    description: 'Metode pembukuan jadul yang sangat menguras tenaga dan waktu para pengurus secara gratisan.',
    weaknesses: [
      {
        title: 'Rentan Rusak dan Hilang Sepihak',
        desc: 'Satu <em>hard disk</em> rusak atau satu buku hilang, maka riwayat keuangan kas puluhan juta rupiah hangus tak berbekas.'
      },
      {
        title: 'Krisis Kepercayaan & Beban Fitnah',
        desc: 'Karena tidak diaudit seketika, bendahara sangat sering menjadi korban kecurigaan dan fitnah warga terkait nominal selisih (walau Rp10.000).'
      },
      {
        title: 'Kelelahan Rekonsiliasi Manual',
        desc: 'Rekapitulasi <em>Excel</em> mengharuskan bendahara membuang waktu akhir pekan untuk mengetik ulang ratusan resi pembayaran.'
      }
    ]
  }
];

export default function EcosystemBenchmarking() {
  const [activeTab, setActiveTab] = useState<CompetitorId>('whatsapp');

  const activeData = COMPETITORS.find(c => c.id === activeTab)!;

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "URUN Community OS",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Application (PWA), Android, iOS",
    "description": "Sistem operasi kedaulatan komunitas untuk manajemen kas lingkungan, iuran RT/RW yang mengotomasi transparansi berbasis desentralisasi dan menghasilkan pasif income kas sirkular tanpa aplikasi berbayar.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR",
      "description": "Gratis 100% tanpa biaya berlangganan. Kas ditarik dari bagi hasil (Capture Loop) komoditas pihak ketiga."
    },
    "featureList": [
      "Zero-Loss Integer Accounting",
      "Row-Level Security (RLS) Isolation",
      "Multi-Sig Consensus Security",
      "No App Download Required (WhatsApp Gateway)",
      "Circular Economy 70/30 Profit Sharing"
    ]
  };

  return (
    <section className="py-24 bg-surface border-t border-outline-variant/30">
      {/* AEO / SEO Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs font-black text-primary uppercase tracking-widest font-mono">Peta Ekosistem Digital</span>
          <h2 className="text-3xl md:text-4xl font-black text-on-surface font-sans">
            Mengapa Sistem Konvensional Selalu Merugikan Komunitas Anda?
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Menjalankan siklus ekonomi dan kepercayaan puluhan warga tidak cukup hanya bermodalkan pesan teks atau aplikasi pencatat utang. URUN lahir sebagai antitesis dari titik buta <em>platform</em> komersial saat ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4 items-start">
          
          {/* Tabs Selector Navigation */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h3 className="text-sm font-black text-on-surface uppercase tracking-wider mb-2">Pilih Paradigma Alternatif:</h3>
            <div className="flex flex-col gap-2.5">
              {COMPETITORS.map((comp) => {
                const Icon = comp.icon;
                const isActive = activeTab === comp.id;
                
                return (
                  <button
                    key={comp.id}
                    onClick={() => setActiveTab(comp.id)}
                    className={`text-left p-4 rounded-2xl transition-all duration-300 border flex items-center gap-4 cursor-pointer ${
                      isActive 
                        ? 'bg-white border-primary shadow-sm ring-1 ring-primary/20' 
                        : 'bg-surface-container-low border-outline-variant/40 hover:bg-white hover:border-outline-variant/80'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                      isActive ? comp.color : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-black font-sans leading-tight ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        vs {comp.label}
                      </span>
                      <span className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                        {comp.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-7 relative">
            <div className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/50 shadow-sm relative overflow-hidden h-full flex flex-col gap-8 min-h-[420px]">
              {/* Top Banner indicating VS URUN */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
                <div>
                  <h4 className="text-xl font-black text-on-surface flex items-center gap-1.5">
                    Kelemahan {activeData.label}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1.5">{activeData.description}</p>
                </div>
                
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-primary/20 shrink-0 text-center">
                  <span className="block text-[9px] uppercase tracking-wider text-primary font-black font-mono">Ditebas Oleh</span>
                  <span className="block text-lg font-black text-primary leading-none mt-1">URUN <em>OS</em></span>
                </div>
              </div>

              {/* Point-by-point comparison */}
              <div className="flex flex-col gap-6">
                {activeData.weaknesses.map((weakness, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-error flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                      <X className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h5 className="font-bold text-on-surface text-sm">{weakness.title}</h5>
                      <p 
                        className="text-xs text-on-surface-variant leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: weakness.desc }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* URUN Counter-argument */}
              <div className="mt-auto pt-6 border-t border-outline-variant/30">
                <div className="bg-[#131b2e] rounded-2xl p-5 flex gap-4 items-start shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary-container flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white uppercase tracking-wider font-mono mb-1">Paradigma URUN</h5>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Sistem URUN mempermudah pencatatan gotong royong secara otomatis. Laporan iuran dan kas terkirim langsung ke obrolan <em>WhatsApp</em> warga secara transparan, sementara saldonya tersimpan aman dan akurat di sistem komputasi berstandar tinggi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
