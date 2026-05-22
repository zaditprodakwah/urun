"use client";

import React, { useState, useMemo } from 'react';
import { 
  Users, Building2, Terminal, Search, Shield, EyeOff, Lock, Code, 
  Smartphone, Award, Store, ShieldCheck, Webhook, Link as LinkIcon, 
  HelpCircle, BookOpen, ChevronDown, ChevronUp, MessageSquare, 
  RefreshCw, Sparkles, Send, CheckCircle2
} from 'lucide-react';

interface DocItem {
  id: string;
  category: 'warga' | 'tata-kelola' | 'developer';
  title: string;
  shortDesc: string;
  content: string;
  iconName: 'users' | 'building' | 'terminal' | 'smartphone' | 'award' | 'store' | 'shield' | 'lock' | 'webhook' | 'code' | 'link' | 'arrow' | 'eyeoff';
  tags: string[];
  semanticKeywords: string[];
}

export default function DokumentasiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'semua' | 'warga' | 'tata-kelola' | 'developer'>('semua');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Form contact state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Full Knowledge Base Database
  const docDatabase: DocItem[] = useMemo(() => [
    {
      id: 'wa-bot',
      category: 'warga',
      title: 'WhatsApp Bot URUN: Interaksi Gotong Royong Tanpa Aplikasi',
      shortDesc: 'Kemudahan memantau saldo kas RT dan membayar iuran langsung lewat chat WhatsApp sehari-hari.',
      content: 'Bagi warga (seperti Mas Rio), Anda tidak perlu pusing mengunduh aplikasi berat jika memori HP terbatas. Cukup kirim pesan teks sederhana seperti "KAS" ke nomor resmi WhatsApp Bot RT Anda, dan sistem akan langsung membalas dengan saldo kas RT saat ini secara real-time. Untuk membayar iuran bulanan atau donasi fasilitas, cukup ketik "BAYAR". Bot akan mengirimkan tautan pembayaran digital instan (QRIS/E-Wallet). Transparansi kas RT kini berada langsung dalam genggaman obrolan Anda.',
      iconName: 'smartphone',
      tags: ['WhatsApp Bot', 'Kemudahan Warga', 'QRIS', 'Real-Time'],
      semanticKeywords: ['wa', 'whatsapp', 'bot', 'chat', 'perintah', 'kas', 'bayar', 'iuran', 'qris', 'ewallet', 'hp', 'seluler', 'rio', 'pesan', 'ringan']
    },
    {
      id: 'civic-points',
      category: 'warga',
      title: 'Poin Gotong Royong & Papan Dedikasi Warga',
      shortDesc: 'Apresiasi sosial digital berupa Civic Points untuk warga yang aktif berkontribusi di lingkungannya.',
      content: 'Setiap kontribusi nyata Anda untuk lingkungan berhak mendapatkan apresiasi tertinggi! URUN menghadirkan sistem Civic Points (Poin Gotong Royong). Membayar iuran RT tepat waktu akan memberikan Anda +10 Poin. Mengajukan rujukan usaha lokal atau berpartisipasi dalam voting tender pembangunan memberikan +2 Poin. Akumulasi poin ini ditampilkan secara transparan di Papan Dedikasi Warga (Leaderboard) sebagai wujud apresiasi sosial bertetangga yang sehat.',
      iconName: 'award',
      tags: ['Civic Points', 'Leaderboard', 'Apresiasi Warga', 'Reputasi'],
      semanticKeywords: ['poin', 'leaderboard', 'warga', 'ranking', 'peringkat', 'civic points', 'kontribusi', 'tetangga', 'sosial', 'pahlawan', 'dedikasi', 'apresiasi', 'hadiah', 'reputasi']
    },
    {
      id: 'local-tender',
      category: 'warga',
      title: 'Tender Pengadaan Lokal: Uang Kas Kembali ke Tetangga',
      shortDesc: 'Pemberdayaan warung dan pelaku UMKM RT sendiri dalam proyek pengadaan material & fasilitas bersama.',
      content: 'Kas dari warga, kembali menghidupi ekonomi warga! Jika lingkungan RT membutuhkan semen, pasir, cat, atau perbaikan lampu jalan, pengurus RT tidak akan membelanjakannya ke supermarket korporasi besar. Pengurus akan membuka "Tender Lokal" di aplikasi. Toko kelontong dan pelaku UMKM di lingkungan setempat (seperti Pak Budi) dapat mengajukan penawaran harga secara adil. Transaksi yang disetujui akan menyalurkan dana kas RT langsung ke warung tetangga kita sendiri.',
      iconName: 'store',
      tags: ['Tender Lokal', 'Pemberdayaan UMKM', 'Ekonomi Warga', 'Gotong Royong'],
      semanticKeywords: ['tender', 'pengadaan', 'warung', 'toko', 'lokal', 'belanja', 'proyek', 'semen', 'pasir', 'ekonomi', 'usaha', 'umkm', 'mitra', 'pembangunan', 'budi', 'bahan', 'material']
    },
    {
      id: 'manual-onboarding',
      category: 'warga',
      title: 'Pendaftaran Pengurus & Onboarding Anggota Wilayah',
      shortDesc: 'Mekanisme pencegahan akun fiktif dan verifikasi wilayah demi kedaulatan data administratif.',
      content: 'URUN menjaga keabsahan wilayah secara ketat demi keamanan. Rukun Tetangga (RT) baru tidak dapat mendaftar otomatis untuk mencegah duplikasi wilayah. Calon Pengurus harus mengajukan verifikasi manual kepada tim pendiri melalui halaman /kontak. Setelah terverifikasi, akun admin RT akan dibuatkan. Warga juga tidak bisa mendaftar mandiri dari luar; Pengurus RT yang sah lah yang wajib mendaftarkan nomor HP dan nama warga ke dalam Dasbor Pengurus, barulah warga tersebut dapat login menggunakan OTP WhatsApp.',
      iconName: 'users',
      tags: ['Onboarding', 'Verifikasi Wilayah', 'Keanggotaan RT', 'OTP'],
      semanticKeywords: ['daftar', 'onboarding', 'registrasi', 'masuk', 'login', 'verifikasi', 'akun', 'warga baru', 'pengurus baru', 'rt', 'rw', 'kontak', 'admin', 'fiktif', 'manual', 'otp']
    },
    {
      id: 'pdp-compliance',
      category: 'tata-kelola',
      title: 'Kepatuhan UU PDP No. 27/2022 & Data Masking Warga',
      shortDesc: 'Enkripsi data pribadi tingkat tinggi dan penyamaran identitas bagi pihak luar (auditor/investor).',
      content: 'Kedaulatan privasi warga adalah prioritas mutlak URUN. Untuk mematuhi UU Pelindungan Data Pribadi (PDP) No. 27 Tahun 2022, URUN menerapkan teknik "Compliance by Design". Data sensitif seperti NIK dan nomor HP di-enkripsi menggunakan hash kriptografi searah di database. Bagi pihak luar seperti investor makro atau auditor regional, identitas warga disamarkan sepenuhnya menjadi nama samaran teracak (misalnya: "Warga_Anonim_#29A") untuk menjamin tidak ada kebocoran data.',
      iconName: 'eyeoff',
      tags: ['UU PDP', 'Data Masking', 'Enkripsi', 'Privasi Mutlak'],
      semanticKeywords: ['privasi', 'pdp', 'keamanan', 'data', 'masking', 'nik', 'hp', 'telepon', 'enkripsi', 'anonim', 'rahasia', 'hukum', 'uu pdp', 'undang-undang', 'pelindungan', 'aman', 'bocor']
    },
    {
      id: 'multisig-finance',
      category: 'tata-kelola',
      title: 'Persetujuan Multi-Sig (Otorisasi Digital Ganda)',
      shortDesc: 'Proteksi pengeluaran kas bernilai tinggi di atas Rp5.000.000 wajib persetujuan 2 pengurus wilayah.',
      content: 'Untuk mencegah tindakan korupsi, kolusi, atau prasangka buruk antar-tetangga, URUN membatasi penarikan dana kas bernilai tinggi. Setiap pengeluaran di atas Rp5.000.000 (batas default yang dapat diatur di tabel communities.settings) memerlukan persetujuan digital ganda (Multi-Signature). Bendahara yang mengajukan anggaran wajib mendapatkan persetujuan digital dari minimal satu dewan pengurus lain (seperti Ketua RT) melalui dasbor khusus sebelum dana benar-benar ditransfer.',
      iconName: 'lock',
      tags: ['Multi-Sig', 'Segregasi Tugas', 'Anti-Fraud', 'Akuntabilitas'],
      semanticKeywords: ['multisig', 'multi-sig', 'persetujuan', 'keuangan', 'otorisasi', 'anti-fraud', 'kecurangan', 'fraud', 'kas', 'pengeluaran', 'dana', 'pengurus', 'ketua', 'rt', 'rw', 'tanda tangan', 'batas', 'nominal', 'rp5.000.000']
    },
    {
      id: 'hash-chaining-ledger',
      category: 'tata-kelola',
      title: 'Buku Kas Ledger antipenipuan dengan SHA-256 Hash Chaining',
      shortDesc: 'Audit transparansi radikal berteknologi blockchain untuk mendeteksi manipulasi data masa lalu.',
      content: 'Buku kas digital URUN dirancang layaknya teknologi blockchain untuk memastikan keandalan mutlak. Setiap transaksi kas yang tercatat akan dikunci dengan tanda tangan hash kriptografi SHA-256 yang saling berantai (Hash Chaining). Rumus kalkulasi hash mengikat data transaksi saat ini dengan hash transaksi sebelumnya. Jika ada pihak yang secara ilegal mengubah nilai transaksi masa lalu dari database, status audit di dasbor pengawas akan langsung berubah menjadi merah karena rantai hash tidak cocok.',
      iconName: 'shield',
      tags: ['Ledger Kriptografi', 'SHA-256', 'Hash Chaining', 'Audit Transparansi'],
      semanticKeywords: ['ledger', 'buku kas', 'kriptografi', 'hash', 'sha-256', 'audit', 'fraud', 'transparansi', 'keuangan', 'blockchain', 'aman', 'manipulasi', 'rantai', 'database', 'merah']
    },
    {
      id: 'b2b-affiliate',
      category: 'developer',
      title: 'Integrasi B2B API Kemitraan Afiliasi Marketplace',
      shortDesc: 'Automasi transfer komisi belanja warga ke kas RT dengan pembagian hasil transparan (70/30).',
      content: 'URUN menyediakan interoperabilitas terbuka bagi mitra e-commerce atau merchant eksternal. Melalui endpoint POST /api/v1/affiliate, mitra dapat mengirimkan callback data komisi belanja warga. Sistem URUN akan secara otomatis memecah aliran dana komisi: 70% diinjeksikan secara instan ke kas komunitas RT asal warga yang berbelanja, dan 30% didistribusikan sebagai biaya operasional platform URUN secara terprogram.',
      iconName: 'link',
      tags: ['B2B API', 'Afiliasi', 'Monetisasi', 'Interoperabilitas'],
      semanticKeywords: ['api', 'afiliasi', 'b2b', 'developer', 'komisi', 'belanja', 'mitra', 'marketplace', 'integrasi', 'interoperabilitas', 'pendapatan', 'e-commerce', 'callback', 'split', 'bagi hasil']
    },
    {
      id: 'webhooks-event-stream',
      category: 'developer',
      title: 'Real-Time Event Stream Webhooks untuk Pengembang',
      shortDesc: 'Koneksikan aktivitas kas RT dan notifikasi internal langsung ke bot chat kustom atau sistem ERP luar.',
      content: 'Webhooks URUN memungkinkan para pengembang komunitas menghubungkan sistem URUN ke aplikasi eksternal mereka sendiri. Daftarkan URL webhook Anda, dan setiap event di sistem (seperti "KAS_INCOMING", "TENDER_CREATED", atau "MULTISIG_COMPLETED") akan mengirimkan payload JSON real-time. Anda bisa memanfaatkan data ini untuk membuat bot notifikasi Discord kustom, notifikasi telegram RT, atau merekonsiliasikan data kas ke software ERP eksternal.',
      iconName: 'webhook',
      tags: ['Webhooks', 'Real-Time Stream', 'JSON Payload', 'Integrasi'],
      semanticKeywords: ['webhook', 'webhooks', 'real-time', 'developer', 'notifikasi', 'discord', 'whatsapp', 'erp', 'callback', 'event', 'stream', 'json', 'payload', 'kustom', 'telegram']
    },
    {
      id: 'jwt-idempotency',
      category: 'developer',
      title: 'Transaksi Terprogram dengan Keamanan JWT & Idempotensi',
      shortDesc: 'Endpoint transaksi keuangan aman berkeandalan tinggi dengan jaminan bebas double-charge.',
      content: 'Bagi integrasi keuangan tingkat tinggi seperti sistem PPOB (pembayaran token listrik/pulsa kas RT), URUN mengimplementasikan pengamanan ketat. Akses ke POST /v1/ledger dilindungi dengan token JWT berbasis Scope-Based Access. Untuk menjamin keandalan transaksi di tengah ketidakstabilan jaringan, developer wajib menyertakan parameter "idempotency_key". Ini menjamin dana kas hanya dipotong atau dideposit tepat satu kali saja walaupun API di-request berkali-kali.',
      iconName: 'code',
      tags: ['Idempotency Key', 'JWT Authentication', 'PPOB', 'Reliabilitas Keuangan'],
      semanticKeywords: ['jwt', 'idempotensi', 'idempotency', 'transaksi', 'keuangan', 'developer', 'api', 'ledger', 'ppob', 'ganda', 'jaringan', 'token', 'secure', 'draf', 'keandalan', 'double-charge']
    }
  ], []);

  // FAQs Database
  const faqs = [
    {
      question: "Apakah warga umum harus mengunduh aplikasi khusus untuk menggunakan URUN?",
      answer: "Tidak wajib. Warga dapat memanfaatkan nomor resmi WhatsApp Bot RT Anda secara gratis tanpa instalasi apa pun untuk memantau saldo kas (ketik 'KAS') dan mendapatkan link bayar iuran (ketik 'BAYAR'). Namun untuk pengalaman yang lebih interaktif seperti melihat papan peringkat dan berpartisipasi dalam tender lokal, warga dapat memasang aplikasi URUN PWA (Progressive Web App) yang sangat ringan dan hemat kuota langsung dari browser HP mereka."
    },
    {
      question: "Bagaimana sistem URUN memastikan uang kas RT tidak disalahgunakan oleh pengurus?",
      answer: "URUN menerapkan otorisasi digital ganda (Multi-Sig) untuk setiap nominal pengeluaran kas yang besar (secara default di atas Rp5.000.000). Dana kas tidak dapat ditarik atau dipindahkan sebelum minimal 2 pengurus sah (misalnya Ketua RT dan Bendahara) mengklik persetujuan digital di HP masing-masing. Seluruh riwayat kas dikunci menggunakan teknologi rantai hash SHA-256 mirip blockchain, sehingga transaksi lampau tidak bisa diedit secara diam-diam tanpa merusak rantai audit kas."
    },
    {
      question: "Bagaimana cara mendaftarkan kepengurusan RT/RW lingkungan kami secara resmi?",
      answer: "Demi menjaga keamanan administratif wilayah dan menghindari data warga fiktif, pendaftaran komunitas baru dilakukan lewat jalur manual terverifikasi. Calon pengurus dapat mengajukan permohonan melalui formulir di bagian bawah halaman ini atau menghubungi tim kami di halaman /kontak. Tim kami akan memverifikasi keabsahan dokumen pengurus RT/RW Anda sebelum membuatkan akun instansi resmi pertama."
    },
    {
      question: "Apakah API Developer URUN aman digunakan oleh pihak pengembang luar?",
      answer: "Sangat aman. Seluruh koneksi integrasi B2B API URUN dilindungi oleh sistem token JWT (JSON Web Tokens) dengan pembatasan hak akses (scope-based access control) yang ketat. Setiap endpoint mutasi kas juga dilengkapi fitur Idempotency Key untuk memastikan transaksi keuangan terprogram (seperti PPOB) tidak akan terproses ganda meskipun terjadi kendala jaringan."
    }
  ];

  // Smart Search (Syntactic & Semantic) filtering logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      // If search is empty, filter only by active tab category
      if (activeTab === 'semua') return docDatabase;
      return docDatabase.filter(item => item.category === activeTab);
    }

    const queryTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    // Calculate score for each document item
    const scoredItems = docDatabase.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const shortDescLower = item.shortDesc.toLowerCase();
      const contentLower = item.content.toLowerCase();

      queryTerms.forEach(term => {
        // 1. Exact title match (high weight)
        if (titleLower.includes(term)) score += 15;
        
        // 2. Tags match
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(term)) score += 8;
        });

        // 3. Semantic keywords match (crucial for semantic search)
        item.semanticKeywords.forEach(keyword => {
          if (keyword.toLowerCase() === term) score += 10;
          else if (keyword.toLowerCase().includes(term)) score += 4;
        });

        // 4. Content / Short description match
        if (shortDescLower.includes(term)) score += 5;
        if (contentLower.includes(term)) score += 3;
      });

      return { item, score };
    });

    // Filter items with positive match score
    const filtered = scoredItems
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item);

    // Further filter search results by tab if a specific tab is active
    if (activeTab === 'semua') return filtered;
    return filtered.filter(item => item.category === activeTab);
  }, [searchQuery, activeTab, docDatabase]);

  // Suggested quick-search phrases
  const popularKeywords = [
    { label: "💬 WhatsApp Bot", query: "whatsapp" },
    { label: "🔑 Multi-Sig", query: "multisig" },
    { label: "🛡️ Pelindungan PDP", query: "pdp" },
    { label: "🔗 API Afiliasi", query: "afiliasi" },
    { label: "🏅 Poin Warga", query: "poin" },
    { label: "🏢 Daftar RT Baru", query: "onboarding" }
  ];

  // Helper to dynamically render corresponding lucide icon
  const renderDocIcon = (iconName: string, category: string) => {
    const iconClass = `w-6 h-6 ${
      category === 'warga' 
        ? 'text-[#006c49]' 
        : category === 'tata-kelola' 
          ? 'text-amber-600' 
          : 'text-blue-600'
    }`;

    switch (iconName) {
      case 'smartphone': return <Smartphone className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'store': return <Store className={iconClass} />;
      case 'users': return <Users className={iconClass} />;
      case 'eyeoff': return <EyeOff className={iconClass} />;
      case 'lock': return <Lock className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'link': return <LinkIcon className={iconClass} />;
      case 'webhook': return <Webhook className={iconClass} />;
      case 'code': return <Code className={iconClass} />;
      default: return <BookOpen className={iconClass} />;
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#131b2e] font-sans selection:bg-[#006c49]/20 pb-24">
      
      {/* 🚀 HERO & SMART SEARCH SECTION */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 rounded-full bg-[#006c49]/5 blur-3xl opacity-60 pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#006c49]/10 border border-[#006c49]/20 text-xs font-black uppercase tracking-wider text-[#006c49] mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Helpdesk & Knowledge Base</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#131b2e] leading-tight">
            Pusat Bantuan & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006c49] to-emerald-500">
              Dokumentasi URUN
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
            Cari panduan warga, kepatuhan tata kelola, dan spesifikasi API developer secara instan dengan pencarian semantik & sintaksis cerdas.
          </p>

          {/* 🔍 THE SMART SEARCH BAR */}
          <div className="max-w-2xl mx-auto mt-8 relative">
            <div className="relative flex items-center bg-white border-2 border-[#bbcabf]/50 focus-within:border-[#006c49] rounded-2xl shadow-md transition-all duration-300 px-5 group">
              <Search className="w-6 h-6 text-zinc-400 group-focus-within:text-[#006c49] transition-colors shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci... (misal: 'wa bot', 'privasi', 'aman', 'komisi afiliasi')"
                className="w-full py-4 text-zinc-800 bg-transparent placeholder-zinc-400 outline-none text-base font-semibold"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1.5 rounded-lg shrink-0 transition-colors"
                >
                  Bersihkan
                </button>
              )}
            </div>
            
            {/* Quick searches */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="text-xs font-black text-zinc-400 self-center uppercase tracking-wide mr-1">Rekomendasi:</span>
              {popularKeywords.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(kw.query)}
                  className="text-xs bg-white text-zinc-600 hover:text-[#006c49] hover:bg-[#006c49]/5 border border-[#bbcabf]/40 hover:border-[#006c49]/40 px-3 py-1.5 rounded-full font-bold transition-all shadow-sm shrink-0"
                >
                  {kw.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📂 CATEGORY / TAB FILTERS */}
      <div className="sticky top-0 z-40 bg-[#FCFBF9]/80 backdrop-blur-xl border-b border-[#bbcabf]/40 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 sm:gap-4 pb-4 justify-start lg:justify-center">
            
            <button
              onClick={() => setActiveTab('semua')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-wide whitespace-nowrap transition-all duration-300 ${
                activeTab === 'semua' 
                  ? 'bg-zinc-800 text-white shadow-md shadow-zinc-800/20 ring-1 ring-zinc-800' 
                  : 'bg-white text-zinc-500 border border-[#bbcabf]/50 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Semua Panduan ({docDatabase.length})
            </button>

            <button
              onClick={() => setActiveTab('warga')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-wide whitespace-nowrap transition-all duration-300 ${
                activeTab === 'warga' 
                  ? 'bg-[#006c49] text-white shadow-md shadow-[#006c49]/20 ring-1 ring-[#006c49]' 
                  : 'bg-white text-zinc-500 border border-[#bbcabf]/50 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Warga & Komunitas
            </button>

            <button
              onClick={() => setActiveTab('tata-kelola')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-wide whitespace-nowrap transition-all duration-300 ${
                activeTab === 'tata-kelola' 
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 ring-1 ring-amber-600' 
                  : 'bg-white text-zinc-500 border border-[#bbcabf]/50 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Tata Kelola & Kepatuhan
            </button>

            <button
              onClick={() => setActiveTab('developer')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-wide whitespace-nowrap transition-all duration-300 ${
                activeTab === 'developer' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-600' 
                  : 'bg-white text-zinc-500 border border-[#bbcabf]/50 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Sistem & API Developer
            </button>

          </div>
        </div>
      </div>

      {/* 📚 MAIN KNOWLEDGE BASE LIST */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Search feedback indicator */}
        {searchQuery.trim() && (
          <div className="mb-8 flex items-center justify-between bg-zinc-100/80 border border-zinc-200 p-4 rounded-2xl">
            <p className="text-sm text-zinc-600 font-bold">
              Menampilkan <span className="text-[#006c49]">{searchResults.length}</span> hasil pencarian untuk &ldquo;<span className="italic">{searchQuery}</span>&rdquo;
            </p>
            {searchResults.length === 0 && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-black text-red-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Pencarian
              </button>
            )}
          </div>
        )}

        {/* The Grid / List of documents */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {searchResults.map((doc) => {
              const bgBadge = doc.category === 'warga' 
                ? 'bg-emerald-50 text-[#006c49] border-[#006c49]/20' 
                : doc.category === 'tata-kelola' 
                  ? 'bg-amber-50 text-amber-700 border-amber-600/20' 
                  : 'bg-blue-50 text-blue-700 border-blue-600/20';

              const hoverBorder = doc.category === 'warga' 
                ? 'hover:border-[#006c49]/40' 
                : doc.category === 'tata-kelola' 
                  ? 'hover:border-amber-500/40' 
                  : 'hover:border-blue-500/40';

              return (
                <div 
                  key={doc.id} 
                  id={doc.id}
                  className={`bg-white border border-[#bbcabf]/40 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${hoverBorder} group`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        doc.category === 'warga' ? 'bg-emerald-50' : doc.category === 'tata-kelola' ? 'bg-amber-50' : 'bg-blue-50'
                      } group-hover:scale-105 transition-transform`}>
                        {renderDocIcon(doc.iconName, doc.category)}
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-sans border shrink-0 ${bgBadge}`}>
                        {doc.category === 'warga' ? 'Warga' : doc.category === 'tata-kelola' ? 'Tata Kelola' : 'Developer'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-extrabold mb-3 text-zinc-900 group-hover:text-primary transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4 font-semibold italic">
                      {doc.shortDesc}
                    </p>

                    {/* Content */}
                    <p className="text-zinc-600 text-sm leading-relaxed font-medium">
                      {doc.content}
                    </p>
                  </div>

                  {/* Footer Tags */}
                  <div className="mt-8 pt-4 border-t border-[#bbcabf]/20 flex flex-wrap gap-1.5">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="bg-zinc-100 text-zinc-500 font-bold px-2 py-0.5 rounded text-[10px] border border-zinc-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-[#bbcabf]/30 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Panduan Tidak Ditemukan</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-6">
              Maaf, kami tidak dapat menemukan kecocokan kata kunci semantik maupun sintaksis untuk &ldquo;{searchQuery}&rdquo;. Silakan coba frasa lain atau ajukan pertanyaan ke helpdesk.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 bg-zinc-800 text-white font-bold text-xs rounded-xl hover:bg-zinc-900 transition-colors"
            >
              Lihat Semua Panduan
            </button>
          </div>
        )}

        {/* ❔ GENERAL ACCORDION FAQS SECTION */}
        <section className="mt-24 max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-600/20 text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ Terpopuler</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#131b2e]">Pertanyaan Sering Diajukan</h2>
            <p className="text-zinc-500 font-medium text-base">
              Jawaban cepat atas pertanyaan mendasar mengenai ekosistem dan penggunaan platform URUN.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-[#bbcabf]/40 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-extrabold text-sm sm:text-base text-zinc-900 pr-4">
                      {faq.question}
                    </span>
                    <span className="shrink-0 text-zinc-400 bg-zinc-50 border border-zinc-200/60 p-1.5 rounded-lg">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#006c49]" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 border-t border-zinc-100 animate-in fade-in duration-300">
                      <p className="text-zinc-600 text-sm leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 📬 HELPDESK & ONBOARDING CONTACT FORM */}
        <section id="onboarding" className="mt-28 bg-zinc-900 text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden max-w-6xl mx-auto">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col Info */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hubungi Layanan Bantuan</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Ada Pertanyaan Lebih Lanjut <br />atau Ingin Gabung Jaringan?
              </h2>
              <p className="text-zinc-400 font-medium text-sm sm:text-base leading-relaxed">
                Kami siap membantu Anda mengonfigurasikan sistem URUN di RT/RW Anda, mengoordinasikan pendaftaran pengurus baru, atau memberikan panduan integrasi sistem pengembang luar.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-zinc-400">Verifikasi Resmi Wilayah</h4>
                    <p className="text-xs text-white font-bold">Mencegah warga fiktif & tumpang tindih teritori.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700">
                    <Terminal className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-zinc-400">Sandbox Developer Ready</h4>
                    <p className="text-xs text-white font-bold">Dapatkan kredensial client token B2B API aman.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col Form */}
            <div className="bg-zinc-800/80 border border-zinc-700/60 p-8 rounded-3xl shadow-lg backdrop-blur-sm">
              {submitSuccess ? (
                <div className="text-center py-8 space-y-4 animate-in fade-in duration-500">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Pesan Terkirim dengan Sukses!</h3>
                  <p className="text-xs text-zinc-400 font-semibold max-w-sm mx-auto leading-relaxed">
                    Terima kasih telah menghubungi URUN Helpdesk. Tim kami akan segera menanggapi pertanyaan Anda melalui email dalam kurun waktu 1x24 jam kerja.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 px-4 py-2 bg-zinc-700 hover:bg-zinc-650 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Kirim Pesan Baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white mb-2">Formulir Tiket Bantuan</h3>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-700 focus:border-emerald-500 rounded-xl outline-none text-sm text-white font-semibold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Alamat Email Aktif</label>
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-700 focus:border-emerald-500 rounded-xl outline-none text-sm text-white font-semibold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Pesan / Pertanyaan Anda</label>
                    <textarea 
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Deskripsikan bantuan yang Anda butuhkan secara mendalam..."
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-700 focus:border-emerald-500 rounded-xl outline-none text-sm text-white font-semibold transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#006c49] hover:bg-emerald-700 disabled:bg-zinc-650 text-white font-black tracking-wider text-xs uppercase rounded-xl transition-all shadow-md shadow-emerald-900/30 flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Mengirim Tiket Bantuan...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Tiket Bantuan
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
