"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Check, 
  Lock, 
  Database, 
  ShoppingBag, 
  TrendingUp, 
  Coins, 
  Activity, 
  Settings, 
  ShieldCheck, 
  Building, 
  MessageSquare, 
  HelpCircle, 
  Sparkles,
  RefreshCw,
  Clock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Play,
  Shield,
  Bot
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  underTheHood?: {
    title: string;
    description: string;
    rules: string[];
    technical: string;
  };
}

interface MockTransaction {
  id: string;
  warga: string;
  belanja: string;
  nominal: number;
  komisi: number;
  alokasiKas: number;
  alokasiPlatform: number;
  time: string;
}

export default function LandingPage() {
  // --- STATE SYSTEM ---
  // 1. Phone Emulator Tab Selection
  const [emulatorTab, setEmulatorTab] = useState<"ledger" | "whatsapp">("ledger");

  // 2. WhatsApp Simulator State Logic
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "👋 *ASISTEN GOTONG ROYONG RT/RW*\n\nHalo tetangga! Selamat datang di Simpul URUN kita. Saya asisten digital yang siap membantu Anda mengelola iuran, kas, dan kebutuhan gotong royong warga secara transparan dan aman.\n\nSilakan ketik perintah di bawah ini atau gunakan tombol cepat di samping kiri:\n• *#urun* : Lihat daftar iuran & pengadaan bersama yang sedang aktif\n• *#urun join [nama-barang] [jumlah]* : Ikut serta dalam iuran bersama\n• *#kas* : Lihat pembukuan & mutasi Kas RT/RW secara terbuka (real-time)\n• *#reputasi* : Cek keaktifan & riwayat gotong royong Anda sebagai warga\n• *#approve [id-laporan]* : Persetujuan pencairan kas (Khusus Pengurus RT/RW)",
      timestamp: "17:22",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeExplain, setActiveExplain] = useState<Message["underTheHood"] | null>(null);

  // 3. Automated Circular Ledger Feed States
  const [mockLedger, setMockLedger] = useState<MockTransaction[]>([
    {
      id: "tx-1",
      warga: "Budi Santoso (RT 02)",
      belanja: "Bahan Pokok Beras 10kg",
      nominal: 150000,
      komisi: 7500,
      alokasiKas: 5250,
      alokasiPlatform: 2250,
      time: "1 Menit yang lalu"
    },
    {
      id: "tx-2",
      warga: "Ibu Ratna (RT 04)",
      belanja: "Semen Padang 5 Sak (Renovasi)",
      nominal: 320000,
      komisi: 16000,
      alokasiKas: 11200,
      alokasiPlatform: 4800,
      time: "15 Menit yang lalu"
    }
  ]);
  const [totalSimulatedKas, setTotalSimulatedKas] = useState<number>(1428500);

  // 4. Audience Segment Selector
  const [activeSegment, setActiveSegment] = useState<"warga" | "pengurus" | "mitra">("warga");

  // 5. Mayar-style Economic Calculator Input States
  const [jumlahKK, setJumlahKK] = useState<number>(80);
  const [belanjaBulanan, setBelanjaBulanan] = useState<number>(750000);

  // 6. Security Matrix Detailed Drawers
  const [expandedTechId, setExpandedTechId] = useState<"integer" | "atomic" | "hmac" | null>(null);

  // 7. Onboarding Pitch Form Modal States
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);
  const [onboardingSuccess, setOnboardingSuccess] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>("");
  const [pitchData, setPitchData] = useState({
    name: "",
    email: "",
    role: "Pengurus RT/RW",
    region: "",
    notes: ""
  });

  // 8. Privacy Banner State (UU PDP)
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    let mounted = true;
    const checkConsent = async () => {
      await Promise.resolve();
      if (!mounted) return;
      const consent = localStorage.getItem("urun_pdp_consent");
      if (!consent) {
        setShowPrivacyBanner(true);
      }
    };
    checkConsent();
    return () => {
      mounted = false;
    };
  }, []);

  const handlePrivacyConsent = () => {
    localStorage.setItem("urun_pdp_consent", "true");
    setShowPrivacyBanner(false);
  };

  // --- ARITHMETIC LOGIC & FORMATTING ---
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const averageCommissionRate = 0.05; // 5% flat affiliate capture rate
  const totalBelanjaBulanan = jumlahKK * belanjaBulanan;
  const totalBelanjaTahunan = totalBelanjaBulanan * 12;
  const totalKomisiTahunan = totalBelanjaTahunan * averageCommissionRate;

  // 70 / 30 Blueprint circular allocation
  const alokasiKasTahunan = totalKomisiTahunan * 0.70;
  const alokasiPlatformTahunan = totalKomisiTahunan * 0.30;

  // Impact equivalents calculations
  const equivalentCCTV = Math.floor(alokasiKasTahunan / 1500000);
  const equivalentPaving = Math.floor(alokasiKasTahunan / 250000);
  const equivalentSembako = Math.floor(alokasiKasTahunan / 150000);

  // --- SIMULATION HANDLERS ---
  const simulateNewTransaction = () => {
    const names = ["Bpk. Joko Santoso", "Ibu Aminah", "Rina Wulandari", "Ahmad Rizal", "Aris Hermawan"];
    const items = ["Sewa Tangga & Mixer", "Belanja Cat Dinding", "Sewa Pompa Air", "Kabel Tembaga 50m", "Bor Listrik Makita"];
    const values = [200000, 120000, 90000, 450000, 850000];

    const randomIndex = Math.floor(Math.random() * names.length);
    const mockNominal = values[randomIndex];
    const mockKomisi = Math.round(mockNominal * averageCommissionRate);
    const mockAlokasiKas = Math.round(mockKomisi * 0.70);
    const mockAlokasiPlatform = Math.round(mockKomisi * 0.30);

    const newTx: MockTransaction = {
      id: `tx-${Date.now()}`,
      warga: `${names[randomIndex]} (RT 04)`,
      belanja: items[randomIndex],
      nominal: mockNominal,
      komisi: mockKomisi,
      alokasiKas: mockAlokasiKas,
      alokasiPlatform: mockAlokasiPlatform,
      time: "Baru saja"
    };

    setMockLedger(prev => [newTx, ...prev.slice(0, 2)]);
    setTotalSimulatedKas(prev => prev + mockAlokasiKas);
  };

  // WhatsApp Simulator Action triggers
  const commands = [
    { label: "#urun", desc: "Program Gotong Royong", cmd: "#urun" },
    { label: "#kas", desc: "Buku Kas RT/RW Terbuka", cmd: "#kas" },
    { label: "#reputasi", desc: "Skor Keaktifan Warga", cmd: "#reputasi" },
    { label: "#urun join", desc: "Ikut Iuran Bersama", cmd: "#urun join semen-jalan-rt-01 2" },
    { label: "#approve", desc: "Persetujuan Kas Pengurus", cmd: "#approve req-908" },
  ];

  const handleCommandClick = (cmd: string) => {
    sendSimulatedMessage(cmd);
  };

  const sendSimulatedMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      let explanation: Message["underTheHood"] = {
        title: "Pencarian Warga & Row-Level Security",
        description: "Sistem secara aman memverifikasi nomor telepon warga dengan database. Dengan RLS PostgreSQL, data finansial dan identitas terisolasi kaku hanya untuk komunitas RT/RW Anda sendiri.",
        rules: ["ATURAN 1: Row-Level Security (RLS) di Tingkat Database", "ATURAN 3: Kedaulatan Data & Penghapusan Privasi Mutlak"],
        technical: "SELECT * FROM community_members WHERE profiles.phone = sender_phone AND community_id = X;",
      };

      const normalized = text.trim().toLowerCase();

      if (normalized === "#urun") {
        replyText = "📦 *PENGADAAN & IURAN WARGA AKTIF*\nSimpul Komunitas: URUN RT 01 Kalisari\n-------------------------------\n\n1. *URUN Semen Jalan RT 01*\n   👉 Ikut: `#urun join semen-jalan-rt-01 1`\n   🎯 Target: 100 unit (Terkumpul: 50)\n   📅 Batas Waktu: 30 Juni 2026\n\n2. *URUN Lampu Penerangan Gang*\n   👉 Ikut: `#urun join lampu-penerangan-gang 1`\n   🎯 Target: 20 unit (Terkumpul: 10)\n   📅 Batas Waktu: 15 Juni 2026\n\nKetik `#kas` untuk melihat rincian pembukuan Kas RT/RW secara terbuka.";
        explanation = {
          title: "Query Pengadaan Aktif Komunitas",
          description: "Mengambil data program gotong royong yang sedang aktif dari tabel `tenders` di database. Keamanan RLS memastikan data iuran tidak dapat dibocorkan ke wilayah lain.",
          rules: ["ATURAN 1: Isolasi Data Wilayah Warga", "ATURAN 3: Kedaulatan & Kerahasiaan Data Belanja"],
          technical: "SELECT * FROM tenders WHERE community_id = $1 AND current_state = 'subscribing';",
        };
      } else if (normalized.startsWith("#urun join")) {
        const parts = text.split(/\s+/);
        const slug = parts[2] || "semen-jalan-rt-01";
        const qty = parseInt(parts[3] || "1", 10);
        const total = qty * 75000;

        if (total >= 5000000) {
          replyText = `⚠️ *BUTUH KONSENSUS MULTI-SIG PENGURUS*\n\nKontribusi Anda dalam program *${slug.toUpperCase().replace(/-/g, " ")}* sebanyak ${qty} unit dengan total *Rp ${total.toLocaleString("id-ID")}* telah dicatat.\n\nKarena nominal iuran/pengadaan ini bernilai besar (> Rp 5 juta), dana disimpan sementara dengan status *TERKUNCI* hingga disetujui secara mufakat oleh minimal 2 Pengurus RT/RW demi akuntabilitas kas warga.`;
          explanation = {
            title: "Pengunci Kas Nominal Besar (Multi-Sig)",
            description: "Transaksi iuran berjumlah besar (> Rp 5 Juta) secara otomatis dialihkan ke status PENDING di tabel `multisig_requests`. Sistem memblokir penulisan ke kas utama sebelum disetujui bersama oleh para pengurus RT/RW.",
            rules: ["ATURAN 5: Validasi Ganda Pengurus (>Rp 5 Juta)", "ATURAN 2: Buku Kas Aman & Permanen (Hanya Tambah Data)"],
            technical: "INSERT INTO multisig_requests (requested_by, amount, required_sigs, status) VALUES (...);",
          };
        } else {
          replyText = `✅ *PENCATATAN IURAN SELESAI*\n\nTerima kasih tetangga! Anda resmi bergabung dalam program *${slug.toUpperCase().replace(/-/g, " ")}*.\n\n*Rincian Partisipasi Warga:*\n• Jumlah: ${qty} unit\n• Iuran Per Unit: Rp 75.000\n• Total Iuran: *Rp ${total.toLocaleString("id-ID")}*\n\nCatatan iuran Anda sudah tersimpan dengan aman di *Buku Kas RT*.\nSilakan serahkan iuran iuran tunai atau transfer langsung ke Bendahara RT/RW kita. Terima kasih atas gotong royongnya!`;
          explanation = {
            title: "Pencatatan Kas & Pembaruan Skor Keaktifan Warga",
            description: "Menulis kontribusi warga ke Buku Kas Kolektif secara aman. Sistem secara otomatis memicu pembaruan Skor Keaktifan Warga (+3 poin keaktifan) sebagai bentuk apresiasi gotong royong.",
            rules: ["ATURAN 2: Buku Kas Permanen & Tidak Bisa Diubah Sepihak", "ATURAN 4: Skor Keaktifan Dihitung Adil & Otomatis (+3 Poin)"],
            technical: "SELECT process_ledger_entry(p_community_id => $1, p_amount => $2, p_entry_type => 'tender_contribution');",
          };
        }
      } else if (normalized === "#kas") {
        replyText = "📊 *BUKU KAS RT/RW KITA*\nBuku Pembukuan Transparan, Jujur, & Terbuka\n-------------------------------\n*Saldo Kas Kita Saat Ini:* *Rp 150.000*\n\n*5 Catatan Keluar-Masuk Kas Terakhir:*\n1. [22 Mei] 🟢 (+) *Rp 150.000*\n   _WhatsApp: Iuran URUN Semen Jalan RT 01 x2 unit_\n2. [22 Mei] 🟢 (+) *Rp 0*\n   _Sistem: Penyelarasan Awal Kas RT 01 Kalisari_";
        explanation = {
          title: "Perhitungan Saldo Kas Real-Time",
          description: "Menghitung total saldo kas warga secara transparan dengan menjumlahkan seluruh dana masuk (direction='in') dan mengurangkan dana keluar (direction='out'). Rantai kas terjamin aman dari manipulasi.",
          rules: ["ATURAN 2: Kas Bersifat Mutlak (Tidak Bisa Diedit/Dihapus)", "ATURAN 6: Rekonsiliasi Kas Harian Otomatis"],
          technical: "SELECT SUM(CASE WHEN direction = 'in' THEN amount ELSE -amount END) FROM ledger WHERE community_id = $1;",
        };
      } else if (normalized === "#reputasi") {
        replyText = "🎗️ *SKOR KEAKTIFAN WARGA*\nApresiasi Gotong Royong Tetangga URUN\n-------------------------------\n• Nama Warga: *Zadit Prodakwah*\n• Skor Keaktifan: *18 poin*\n• Kategori: *Warga Aktif ⭐*\n\n*3 Riwayat Keaktifan Terakhir:*\n1. [22 Mei] *Ikut gotong royong: URUN Semen Jalan RT 01 (+3 poin)*\n2. [22 Mei] *Penyusunan awal kepengurusan warga (+10 poin)*\n3. [21 Mei] *Profil warga berhasil diverifikasi (+5 poin)*";
        explanation = {
          title: "Sistem Keaktifan Warga yang Adil",
          description: "Skor keaktifan dihitung secara transparan berdasarkan aksi nyata gotong royong Anda. Algoritma database memastikan skor dihitung adil tanpa bias atau pengaruh eksternal.",
          rules: ["ATURAN 4: Skor Keaktifan Adil & Deterministik", "ATURAN 7: Jaminan Hak Penghapusan & Portabilitas Data Warga"],
          technical: "SELECT reputation_score FROM community_members WHERE id = $1;",
        };
      } else if (normalized.startsWith("#approve")) {
        const parts = text.split(/\s+/);
        const reqId = parts[1] || "req-908";
        replyText = `✍️ *PERSETUJUAN PENGURUS RT/RW KAS DICATAT*\n\nPersetujuan Anda berhasil diverifikasi. Saat ini terkumpul (*2/2*) tanda tangan pengurus.\n\n✅ *PENCAIRAN KAS DISETUJUI SEPENUHNYA*\n\nKuorum tercapai. Dana gotong royong sebesar *Rp 7.500.000* untuk pembelian semen resmi dicairkan dan dicatat ke *Buku Kas RT* kita.`;
        explanation = {
          title: "Konsensus Pencairan Kas (Multi-Sig)",
          description: "Mencatat persetujuan ganda dari pengurus RT/RW. Ketika batas kuorum minimal (2 dari 3 pengurus) terpenuhi, status pencairan menjadi disetujui dan saldo kas resmi dilepas secara aman.",
          rules: ["ATURAN 5: Validasi Kuorum Pengurus Wilayah", "ATURAN 2: Penulisan Permanen Buku Kas RT/RW"],
          technical: `UPDATE multisig_requests SET status = 'approved' WHERE id = '${reqId}' AND current_sigs >= required_sigs;`,
        };
      } else {
        replyText = "🤖 *ASISTEN DIGITAL URUN*\n\nPerintah chat tidak dikenali. Silakan gunakan perintah resmi berikut:\n\n• *#urun* : Lihat daftar iuran & pengadaan bersama yang sedang aktif\n• *#urun join [nama-barang] [jumlah]* : Ikut serta dalam iuran bersama\n• *#kas* : Lihat pembukuan & mutasi Kas RT/RW secara terbuka (real-time)\n• *#reputasi* : Cek keaktifan & riwayat gotong royong Anda sebagai warga\n• *#approve [id-laporan]* : Persetujuan pencairan kas (Khusus Pengurus RT/RW)";
        explanation = {
          title: "Pemberian Panduan & Menu Bantuan",
          description: "Ketika pesan tidak sesuai dengan format perintah, asisten secara otomatis mengirimkan pesan bantuan ini untuk memandu warga.",
          rules: ["ATURAN 3: Minimasi Pesan & Navigasi Mudah"],
          technical: "RegExp matching fails -> Send WhatsApp help string template.",
        };
      }

      const newBotMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        underTheHood: explanation,
      };

      setMessages((prev) => [...prev, newBotMsg]);
      setActiveExplain(explanation);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendSimulatedMessage(inputValue);
  };

  // Onboarding submit simulator
  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketNumber("URN-" + Math.floor(100000 + Math.random() * 900000));
    setOnboardingSuccess(true);
  };

  return (
    <div className="flex flex-col flex-1 w-full relative overflow-x-hidden bg-surface text-on-surface">
      
      {/* Background Radial Glow accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* ========================================================
          1. HERO SECTION: THE HOOK
          ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Persuasive Copywriting and Call to Actions */}
        <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full w-fit">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-wider font-mono">Sovereign Community OS</span>
          </div>
          
          <h1 id="hero-headline" className="text-4xl md:text-5xl lg:text-5xl font-black text-on-surface font-sans leading-[1.08] tracking-tight">
            Mengembalikan <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Kedaulatan Ekonomi Lokal</span> ke Tangan Komunitas Anda.
          </h1>
          
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            URUN adalah Sovereign Community Operating System gratis yang mengotomatisasi transparansi kas RT/RW, mengunci privasi data warga, dan mendanai pembangunan fisik lingkungan secara mandiri melalui sirkulasi ekonomi mikro.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <button 
              onClick={() => setShowPitchModal(true)}
              className="h-12 bg-primary hover:bg-opacity-90 text-white font-bold text-sm px-6 rounded-xl shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
            >
              <Building className="w-4.5 h-4.5" />
              <span>Onboard Lingkungan Anda (Gratis)</span>
            </button>
            <a 
              href="#siklus-ekonomi" 
              className="h-12 bg-white hover:bg-neutral-50 border border-outline-variant/60 rounded-xl text-on-surface font-bold text-sm px-6 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Pelajari Siklus Ekonomi 70/30</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </a>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-outline-variant/50">
            <div>
              <span className="block text-xl font-extrabold text-on-surface font-mono">100%</span>
              <span className="text-[10px] text-on-surface-variant font-bold block mt-0.5">Automated Receipts</span>
            </div>
            <div>
              <span className="block text-xl font-extrabold text-on-surface font-mono">Zero-Loss</span>
              <span className="text-[10px] text-on-surface-variant font-bold block mt-0.5">Integer Precision</span>
            </div>
            <div>
              <span className="block text-xl font-extrabold text-primary font-mono">70/30 Blueprint</span>
              <span className="text-[10px] text-on-surface-variant font-bold block mt-0.5">Circular Alokasi</span>
            </div>
          </div>
        </div>

        {/* Right: High Fidelity PWA Simulator Showcase & Interactive Device */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div className="relative w-full max-w-[390px] bg-[#0c1220] rounded-[3rem] p-3 border-4 border-[#131b2e] shadow-2xl relative">
            
            {/* Notch element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-40 bg-[#131b2e] rounded-b-2xl z-30 flex items-center justify-center gap-1">
              <div className="w-12 h-1 bg-neutral-800 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-neutral-850 rounded-full"></div>
            </div>

            <div className="bg-surface-container-low min-h-[640px] rounded-[2.5rem] overflow-hidden flex flex-col justify-between p-4 pt-8 border border-outline-variant/40">
              
              {/* Phone Status bar */}
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-on-surface-variant px-2 pb-3 mb-2 border-b border-outline-variant/30">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>17.22</span>
                </span>
                <span className="text-secondary font-extrabold uppercase">● URUN LIVE SIMULATOR</span>
                <span className="flex items-center gap-1">
                  <span>5G</span>
                  <Smartphone className="w-3 h-3" />
                </span>
              </div>

              {/* View Selector Tabs inside Phone Screen */}
              <div className="flex bg-[#F5F3EF] p-1 rounded-xl mb-3 border border-outline-variant/50 w-full">
                <button
                  onClick={() => setEmulatorTab("ledger")}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-0 ${
                    emulatorTab === "ledger"
                      ? "bg-white text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface bg-transparent"
                  }`}
                >
                  Siklus Belanja
                </button>
                <button
                  onClick={() => setEmulatorTab("whatsapp")}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-0 ${
                    emulatorTab === "whatsapp"
                      ? "bg-white text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface bg-transparent"
                  }`}
                >
                  WhatsApp Bot
                </button>
              </div>

              {/* EMULATOR TAB 1: CIRCULAR TRANSACTION FEED */}
              {emulatorTab === "ledger" && (
                <div className="flex-1 flex flex-col justify-between">
                  {/* Local wallet display inside Phone */}
                  <div className="bg-gradient-to-br from-primary to-[#00422b] text-white p-4 rounded-2xl shrink-0 flex flex-col gap-1 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-200 font-bold">KAS SWADAYA RT 04 RAWA</span>
                      <button 
                        onClick={simulateNewTransaction}
                        className="bg-primary-container hover:bg-opacity-90 text-white p-1 rounded-lg transition-all flex items-center gap-1 border-0 cursor-pointer"
                        title="Simulasi Belanja Warga"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                      </button>
                    </div>
                    <div className="text-xl font-black font-mono tracking-tight mt-1">
                      {formatRupiah(totalSimulatedKas)}
                    </div>
                    <div className="flex justify-between text-[9px] font-mono mt-2 pt-2 border-t border-white/10 text-emerald-100">
                      <span>BLOK: 2026-05-22</span>
                      <span className="text-emerald-300 font-bold">Ledger Terverifikasi</span>
                    </div>
                  </div>

                  {/* Transaction logs */}
                  <div className="my-3 space-y-2 flex-grow overflow-hidden flex flex-col justify-start">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant px-1 mb-1 flex justify-between">
                      <span>Feed Buku Kas (Terbuka)</span>
                      <span className="text-primary flex items-center gap-0.5 font-mono animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Live Sync
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {mockLedger.map((tx) => (
                        <div key={tx.id} className="bg-white p-3 rounded-xl border border-outline-variant/65 shadow-sm flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[10px] text-on-surface-variant leading-none">
                            <span className="font-bold text-on-surface">{tx.warga}</span>
                            <span>{tx.time}</span>
                          </div>
                          
                          <div className="text-[11px] font-bold text-on-surface">
                            🛒 Belanja: {tx.belanja}
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-dashed border-outline-variant/60 text-[9px] font-mono mt-0.5">
                            <div>
                              <span className="text-on-surface-variant block text-[8px] uppercase">KAS RT 70%</span>
                              <strong className="text-primary">+{formatRupiah(tx.alokasiKas)}</strong>
                            </div>
                            <div className="text-right">
                              <span className="text-on-surface-variant block text-[8px] uppercase">PLATFORM 30%</span>
                              <strong className="text-secondary">+{formatRupiah(tx.alokasiPlatform)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#f0f9f6] p-3 rounded-xl border border-primary/10 text-[10px] text-on-surface-variant mt-2">
                      <span className="font-bold text-primary flex items-center gap-1 mb-0.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Siklus Kerja Finansial:
                      </span>
                      <span>Setiap komisi yang ditangkap dari katalog langsung dipotong: 70% kas lingkungan dan 30% perawatan server. Klik <strong>Belanja Simulasi</strong> di bawah!</span>
                    </div>
                  </div>

                  {/* Simulator action buttons */}
                  <div className="flex gap-2 shrink-0 pt-2 border-t border-outline-variant/30">
                    <button 
                      onClick={simulateNewTransaction}
                      className="flex-1 h-9 bg-primary text-white rounded-xl text-xs font-bold hover:bg-opacity-95 cursor-pointer flex items-center justify-center gap-1.5 border-0"
                    >
                      <Play className="w-3 h-3 text-white fill-white" />
                      <span>Belanja Simulasi</span>
                    </button>
                    <Link href="/catalog" className="flex-1 h-9 bg-white border border-outline-variant/60 text-on-surface rounded-xl text-xs font-bold hover:bg-neutral-50 cursor-pointer flex items-center justify-center">
                      Buka Etalase
                    </Link>
                  </div>
                </div>
              )}

              {/* EMULATOR TAB 2: ACTIVE WHATSAPP COMMAND CHATBOT */}
              {emulatorTab === "whatsapp" && (
                <div className="flex-1 flex flex-col justify-between h-full">
                  
                  {/* Chat header within emulator */}
                  <div className="px-3 py-2 bg-white rounded-xl border border-outline-variant/40 flex items-center gap-2.5 shrink-0 shadow-sm mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-on-surface">Bot Gotong Royong URUN</h4>
                      <p className="text-[9px] text-primary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Online (Webhook)
                      </p>
                    </div>
                  </div>

                  {/* Chat Messages Log */}
                  <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 space-y-2 mb-2 scroll-smooth text-[11px]">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[90%] rounded-xl p-2.5 shadow-sm whitespace-pre-wrap ${
                            msg.sender === "user"
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-[#F5F3EF] text-on-surface rounded-tl-none border border-outline-variant/40"
                          }`}
                        >
                          <div>{msg.text}</div>
                          <div className="text-[8px] text-on-surface-variant text-right mt-1">{msg.timestamp}</div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-[#F5F3EF] text-on-surface-variant rounded-xl rounded-tl-none p-2 border border-outline-variant/40 italic flex items-center gap-1 animate-pulse">
                          <span>Asisten URUN mengetik...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Command quick buttons inside phone */}
                  <div className="flex gap-1 overflow-x-auto pb-1 mb-2 scrollbar-none">
                    {commands.map((cmd) => (
                      <button
                        key={cmd.label}
                        onClick={() => handleCommandClick(cmd.cmd)}
                        disabled={isTyping}
                        className="py-1 px-2.5 bg-white border border-outline-variant/70 text-on-surface rounded-full text-[9px] font-mono whitespace-nowrap hover:border-primary disabled:opacity-50 cursor-pointer"
                      >
                        {cmd.label}
                      </button>
                    ))}
                  </div>

                  {/* Send Form */}
                  <form onSubmit={handleSend} className="bg-white border border-outline-variant/50 rounded-xl p-1 flex gap-1 shadow-sm shrink-0">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ketik iuran, kas, reputasi..."
                      className="flex-1 bg-transparent border-0 px-2.5 py-1.5 text-[10px] text-on-surface focus:outline-none focus:ring-0 placeholder:text-outline"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-opacity-95 text-white p-1.5 rounded-lg border-0 cursor-pointer flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </form>

                </div>
              )}

            </div>
          </div>
        </div>

      </section>

      {/* SQL AND SYSTEM GUARANTEES PANEL (Displayed when active tab is WhatsApp to show what happens under the hood) */}
      {emulatorTab === "whatsapp" && activeExplain && (
        <section className="w-full max-w-7xl mx-auto px-6 py-4 animate-in fade-in duration-300">
          <div className="bg-[#131b2e] text-white rounded-2xl p-6 font-mono text-xs border border-[#1e293b] shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-bold text-primary-container uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Shield className="w-4 h-4 text-primary-container" />
                <span>DI BALIK LAYAR (SOVEREIGN CORE CORE)</span>
              </div>
              <h4 className="font-extrabold text-sm text-white">{activeExplain.title}</h4>
              <p className="text-[11px] text-neutral-350 mt-1.5 leading-relaxed">{activeExplain.description}</p>
              
              <div className="mt-4 space-y-1.5">
                <div className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider">Aturan Kepercayaan Terikat:</div>
                <ul className="space-y-1">
                  {activeExplain.rules.map((rule, idx) => (
                    <li key={idx} className="text-[11px] text-emerald-300 flex items-start gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-primary-container shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col justify-between">
              <div className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider mb-2">OPERASI BASIS DATA (POSTGRESQL PL/PGSQL):</div>
              <div className="p-3.5 bg-[#0b0f19] rounded-xl border border-slate-800 text-[10px] text-primary-container overflow-x-auto whitespace-pre">
                {activeExplain.technical}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          2. HUB SEGMENTASI AUDIENS (NAVIGASI SUGESTIF MODULAR)
          ======================================================== */}
      <section className="py-24 bg-white border-t border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-xs font-black text-primary uppercase tracking-widest font-mono">Navigasi Sugestif Modular</span>
            <h2 className="text-3xl md:text-4xl font-black text-on-surface font-sans">Satu Platform. Solusi Tiga Arah.</h2>
            <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
              URUN dirancang dengan kriteria antarmuka dan hak istimewa khusus yang didedikasikan untuk menguraikan pain point warga, pengurus, serta mitra sponsor.
            </p>
            
            {/* Segment Toggle bar */}
            <div className="flex bg-surface-container-low p-1.5 rounded-2xl mt-4 border border-outline-variant/50 w-full max-w-md">
              {(["warga", "pengurus", "mitra"] as const).map((seg) => (
                <button
                  key={seg}
                  onClick={() => setActiveSegment(seg)}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border-0 ${
                    activeSegment === seg
                      ? "bg-white text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface bg-transparent"
                  }`}
                >
                  {seg === "mitra" ? "Mitra & Investor" : seg}
                </button>
              ))}
            </div>
          </div>

          {/* Active segmented content container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface-container-lowest rounded-[2.5rem] p-8 lg:p-12 border border-outline-variant/40 shadow-sm">
            
            {/* Info Column */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {activeSegment === "warga" && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Kedaulatan Warga Mutlak</span>
                  <h3 className="text-2xl md:text-3xl font-black text-on-surface font-sans leading-tight">Pantau Kas & Program Tanpa Beban Kognitif</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                    Warga sering dicurigai sebagai objek penyerahan iuran yang buta. URUN memotong kesenjangan informasi ini dengan notifikasi otomatis langsung ke nomor WhatsApp harian Anda.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs text-on-surface-variant"><strong>Bukti WhatsApp Nyata:</strong> Dapatkan notifikasi pengeluaran lengkap dengan pranala file foto struk belanja yang sah.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs text-on-surface-variant"><strong>Sertifikasi Reputasi:</strong> Aktifkan skor reputasi gotong royong Anda dan raih apresiasi atas dedikasi sosial rukun warga.</span>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
                    <Link href="/dashboard" className="h-10 bg-primary hover:bg-opacity-95 text-white font-bold text-xs px-5 rounded-xl transition-all flex items-center justify-center border-0 shadow-sm">
                      Lihat Demo Transparansi Warga
                    </Link>
                  </div>
                </>
              )}

              {activeSegment === "pengurus" && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary font-mono">Amanah & Bersih</span>
                  <h3 className="text-2xl md:text-3xl font-black text-on-surface font-sans leading-tight">Bebaskan Pengurus dari Tuduhan & Pembukuan Manual</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                    Bendahara lingkungan didera beban kerja manual dan rentan dicurigai seleweng kas. Dengan dasbor pengurus URUN, seluruh pencatatan divalidasi langsung oleh sistem terintegrasi.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-secondary" />
                      </div>
                      <span className="text-xs text-on-surface-variant"><strong>Sistem Multi-Sig:</strong> Pencairan dana besar wajib ditandatangani oleh RT, RW, dan Bendahara via token kunci digital untuk mencapai konsensus kuorum.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-secondary" />
                      </div>
                      <span className="text-xs text-on-surface-variant"><strong>Otomatisasi Laporan Pajak/Kas:</strong> Hasilkan neraca saldo, cetak PDF pertanggungjawaban kas dalam sekali klik dengan aman.</span>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
                    <Link href="/login" className="h-10 bg-secondary hover:bg-opacity-95 text-white font-bold text-xs px-5 rounded-xl transition-all flex items-center justify-center border-0 shadow-sm">
                      Aktifkan Panel RT/RW Sekarang
                    </Link>
                  </div>
                </>
              )}

              {activeSegment === "mitra" && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Zero-CAC Flywheel Engine</span>
                  <h3 className="text-2xl md:text-3xl font-black text-on-surface font-sans leading-tight">Penguasaan Rantai Distribusi Komunitas</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                    Bagi penyedia retail, grosir sembako, atau produsen material bangunan, URUN memotong Customer Acquisition Cost (CAC) hingga nol dengan mendelegasikan kanal pembelian eksklusif di level pengurus wilayah.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs text-on-surface-variant"><strong>Sponsori Program Fisik:</strong> Pasang papan promosi digital merek Anda langsung pada daftar program aktif, menjamin branding lokal berdampak organik tinggi.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs text-on-surface-variant"><strong>Buku Putih & Blueprint:</strong> Pelajari detail skema bagi hasil sirkular URUN dan sirkulasi logistik kedaulatan warga komplek.</span>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
                    <button 
                      onClick={() => setShowPitchModal(true)}
                      className="h-10 bg-primary hover:bg-opacity-95 text-white font-bold text-xs px-5 rounded-xl transition-all flex items-center justify-center border-0 cursor-pointer shadow-sm"
                    >
                      Minta Buku Putih & Blueprint
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Graphical Showcase Column */}
            <div className="lg:col-span-6 bg-surface p-6 rounded-3xl border border-outline-variant/60 shadow-sm flex flex-col gap-4">
              
              {activeSegment === "warga" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-outline-variant/50 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-on-surface">Contoh Notifikasi Warga</h4>
                      <p className="text-[9px] text-on-surface-variant font-mono">WhatsApp Channel Verified</p>
                    </div>
                  </div>
                  <div className="space-y-2 font-mono text-[11px] bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 text-on-surface leading-relaxed">
                    <p className="text-primary font-bold">📲 URUN INFO [RT 04 / RW 04 RAWA WEST]</p>
                    <p>Halo Bpk. Budi Santoso,</p>
                    <p>Kondisi Buku Kas RT 04 diperbarui secara otomatis:</p>
                    <ul className="list-disc list-inside pl-1 text-[10px] py-1 text-on-surface-variant space-y-1">
                      <li>Komisi Belanja Bersaudara: <strong className="text-on-surface">Rp22.500</strong></li>
                      <li>Sisa Kas Proyek Drainase: <strong className="text-on-surface">Rp1.850.000</strong></li>
                      <li>Dana Terkumpul Pembangunan: <strong className="text-primary">80% Terpenuhi</strong></li>
                    </ul>
                    <p className="text-[9px] text-secondary underline cursor-pointer">Klik disini untuk kelengkapan file e-faktur & kwitansi fisik semen.</p>
                  </div>
                </div>
              )}

              {activeSegment === "pengurus" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center shadow-sm">
                        <Settings className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-on-surface">Konsensus Tanda Tangan Ganda</h4>
                        <p className="text-[9px] text-on-surface-variant font-mono">Pencairan Dana Multi-Sig</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200/50 px-2.5 py-0.5 rounded-full font-bold uppercase font-mono">Menunggu 1 Sig</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/30">
                      <span className="text-xs text-on-surface-variant">Aparat RT 04 (Sutrisno)</span>
                      <span className="text-[10px] bg-emerald-50 text-primary border border-emerald-200/50 py-1 px-2.5 rounded-xl font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Signed
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/30">
                      <span className="text-xs text-on-surface-variant">Bendahara RW (Ibu Rika)</span>
                      <span className="text-[10px] bg-emerald-50 text-primary border border-emerald-200/50 py-1 px-2.5 rounded-xl font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Signed
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/30">
                      <span className="text-xs text-on-surface-variant">Ketua RW 04 (H. Syarifuddin)</span>
                      <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200/50 py-1 px-2.5 rounded-xl font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700 animate-pulse" /> Pending
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeSegment === "mitra" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-outline-variant/50 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-on-surface">Katalog Lokal & Zero CAC</h4>
                      <p className="text-[9px] text-on-surface-variant font-mono">Bagi Hasil Rantai Distribusi</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f0f9f6] rounded-2xl border border-primary/10 text-[11px] text-on-surface flex flex-col gap-2.5 font-mono">
                    <div className="flex justify-between font-bold border-b border-primary/10 pb-1.5">
                      <span className="text-[#131b2e]">PRODUK HULU MITRA</span>
                      <span className="text-primary">CAPTURE KOMISI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Semen Gresik Super (per sak)</span>
                      <span>5.0% (Rp2.800)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cat Eksterior Dulux 20L</span>
                      <span>8.0% (Rp48.000)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pipa PVC Rucika 4 Inci</span>
                      <span>4.5% (Rp3.150)</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. KOMPONEN EDUKASI: PARADIGMA SISTEM GENERATIVE
          ======================================================== */}
      <section id="siklus-ekonomi" className="py-24 bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-14">
          
          <div className="text-center flex flex-col items-center gap-3 max-w-xl mx-auto">
            <span className="text-xs font-black text-primary uppercase tracking-widest font-mono">Model Ekonomi Sirkular</span>
            <h2 className="text-3xl md:text-4xl font-black text-on-surface font-sans">Siklus Aliran Finansial Terbuka URUN 70/30</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Kami menggantikan model teknologi eksploitatif korporasi. Di URUN, setiap transaksi secara otomatis melipatgandakan dana kas pembangunan wilayah Anda secara lestari.
            </p>
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/40 shadow-sm relative flex flex-col gap-4">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-white font-mono font-black text-xs flex items-center justify-center shadow-md">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center mt-2 shadow-inner">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-sans font-extrabold text-base text-[#0f172a] leading-tight">Pengikatan Trust Anchor</h4>
              <p className="text-[11px] leading-relaxed text-on-surface-variant">
                URUN diaktifkan secara gratis oleh pengurus lingkungan. Sistem menyinkronkan data warga secara aman di bawah perlindungan Row-Level Security (RLS) PostgreSQL, menggantikan tumpukan catatan fisik dan grup obrolan yang kacau.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/40 shadow-sm relative flex flex-col gap-4">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-white font-mono font-black text-xs flex items-center justify-center shadow-md">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center mt-2 shadow-inner">
                <ShoppingBag className="w-5 h-5 text-secondary" />
              </div>
              <h4 className="font-sans font-extrabold text-base text-[#0f172a] leading-tight">Transaksi Capture Loop</h4>
              <p className="text-[11px] leading-relaxed text-on-surface-variant">
                Warga melakukan aktivitas belanja kebutuhan rutin harian atau pembayaran kolektif melalui Price Discovery Hub di katalog URUN. Sistem menangkap komisi afiliasi dari penyedia komoditas luar yang biasanya menguap sia-sia.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/40 shadow-sm relative flex flex-col gap-4">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-white font-mono font-black text-xs flex items-center justify-center shadow-md">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center mt-2 shadow-inner">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-sans font-extrabold text-base text-[#0f172a] leading-tight">Alokasi Pasif Otomatis (70/30)</h4>
              <p className="text-[11px] leading-relaxed text-on-surface-variant">
                Melalui kalkulasi mesin ledger integer, komisi dibagi secara presisi: 70% disuntikkan langsung ke rekening kas RT/RW setempat secara immutable untuk pendanaan infrastruktur fisik (jalan, pos ronda, sosial), sementara 30% dialokasikan sebagai pendapatan platform URUN untuk perawatan infrastruktur server terdistribusi.
              </p>
            </div>

          </div>

          {/* Split Coin Visualizer Box */}
          <div className="p-6 md:p-8 bg-white border border-outline-variant/40 shadow-sm rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 mt-4.5">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="w-4.5 h-4.5" />
                <span className="text-[10px] font-black uppercase font-mono tracking-wider">Kesepakatan Alur Ledger Terkunci</span>
              </div>
              <h4 className="text-xl font-black text-on-surface leading-tight">Bagaimana sirkulasi komisi terbagi otomatis?</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Sistem menjamin pendistribusian langsung tanpa perantara internal, memisahkan fungsionalitas perawatan pelayan awan dengan kemandirian keuangan komunitas di rukun tetangga.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 flex-1 w-full justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary text-white font-bold flex flex-col items-center justify-center shadow-md relative">
                  <span className="text-[11px] uppercase font-mono tracking-tight font-black leading-none">70%</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface">Kas RT/RW</span>
                <span className="text-[8px] font-mono text-primary font-bold">Dana Sosial Wilayah</span>
              </div>

              <div className="h-0.5 w-16 bg-outline-variant relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-outline-variant rounded text-[8px] font-mono font-bold uppercase text-on-surface-variant">
                  Split
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-[#131b2e] text-white font-bold flex flex-col items-center justify-center shadow-md relative">
                  <span className="text-[11px] uppercase font-mono tracking-tight font-black leading-none">30%</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface">Platform URUN</span>
                <span className="text-[8px] font-mono text-on-surface-variant font-bold">Cloud & Hosting Fee</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. WIDGET SIMULATOR INTERAKTIF: PROYEKSI EKONOMI MELINGKAR
          ======================================================== */}
      <section id="simulator-integratif" className="py-24 bg-white border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Box: Controls (Mayar Style Slider Inputs) */}
          <div className="lg:col-span-5 bg-surface-container-low p-6 md:p-8 rounded-[2.5rem] border border-outline-variant/50 flex flex-col gap-6 shadow-sm">
            <div className="border-b border-outline-variant/50 pb-3">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest font-mono block">Mayar Interactive Emulator</span>
              <h4 className="text-xl font-black text-[#0f172a] font-sans mt-0.5">Kalkulasi Proyeksi Ekonomi</h4>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Uji dampak sirkular pendapatan pasif wilayah Anda berdasarkan parameter riil jumlah warga.</p>
            </div>

            {/* Slider 1: Jumlah KK */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center leading-none">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-mono">Jumlah Kepala Keluarga (KK)</label>
                <span className="font-mono text-xs font-black text-primary">{jumlahKK} KK</span>
              </div>
              <input 
                type="range"
                min="10"
                max="200"
                step="5"
                value={jumlahKK}
                onChange={(e) => setJumlahKK(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[9px] text-on-surface-variant font-mono mt-0.5">
                <span>10 KK (Rukun Tetangga)</span>
                <span>100 KK</span>
                <span>200 KK (Kompleks Kompleks)</span>
              </div>
            </div>

            {/* Slider 2: Belanja Bulanan per KK */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center leading-none">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-mono">Belanja Pokok Bulanan / KK</label>
                <span className="font-mono text-xs font-black text-primary">{formatRupiah(belanjaBulanan)}</span>
              </div>
              <input 
                type="range"
                min="200000"
                max="2000000"
                step="50000"
                value={belanjaBulanan}
                onChange={(e) => setBelanjaBulanan(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[9px] text-on-surface-variant font-mono mt-0.5">
                <span>Rp200 Ribu</span>
                <span>Rp1,1 Juta</span>
                <span>Rp2 Juta (Sembako & Alat)</span>
              </div>
            </div>

            {/* Rationale description bubble */}
            <div className="p-4 bg-emerald-50 border border-primary/10 rounded-2xl text-[11px] text-on-surface-variant flex gap-2">
              <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>
                Taksiran rasio komisi komersial hulu direratakan sebesar <strong>5%</strong> dari total volume belanja melalui mitra terpilih, menjamin harga belanja warga tetap kompetitif tanpa tambahan biaya sepeser pun.
              </p>
            </div>
          </div>

          {/* Right Box: Dynamic projections output */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-primary uppercase tracking-widest font-mono">Output Real-time Terhitung</span>
              <h3 className="text-3xl font-black text-on-surface font-sans">Bagaimana Kas Terdistribusikan Setahun?</h3>
              <p className="text-xs text-on-surface-variant">Hasil proyeksi dana tebas lingkungan mandiri menggunakan mesin ledger integer sirkular.</p>
            </div>

            {/* Output Numbers Display grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f0f9f6] p-6 rounded-3xl border border-primary/10 flex flex-col gap-1 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary font-mono">Dana Kas Terkumpul RT/RW (70%)</span>
                <strong className="text-3xl font-black font-mono text-primary tracking-tight mt-1">
                  {formatRupiah(alokasiKasTahunan)}
                </strong>
                <span className="text-[10px] text-on-surface-variant mt-1">Suntikan dana pasif berkelanjutan untuk lingkungan / tahun.</span>
              </div>

              <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/40 flex flex-col gap-1 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant font-mono">Pendapatan Platform URUN (30%)</span>
                <strong className="text-3xl font-black font-mono text-on-surface tracking-tight mt-1">
                  {formatRupiah(alokasiPlatformTahunan)}
                </strong>
                <span className="text-[10px] text-on-surface-variant mt-1">Dana operasional server & asuransi kegagalan ledger / tahun.</span>
              </div>
            </div>

            {/* Admin efficiency metrics */}
            <div className="bg-[#eff6ff] p-5 rounded-2xl border border-secondary/15 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-secondary flex items-center justify-center shadow-sm shrink-0">
                  <Activity className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-on-surface">Efisiensi Administrasi Bendahara Lingkungan</h5>
                  <p className="text-[10px] text-on-surface-variant">Pengurangan beban pembukuan manual dan pelaporan kas bulanan.</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black font-mono text-secondary block leading-none">85%</span>
                <span className="text-[8px] text-on-surface-variant uppercase font-mono tracking-widest font-black block mt-1">Saves Time</span>
              </div>
            </div>

            {/* Tactile project equivalents visualizer */}
            <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/40 flex flex-col gap-4 shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono leading-none">Potensi Ekivalen Program Sosial Wilayah</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                
                <div className="bg-white p-4 rounded-2xl border border-outline-variant/60 flex flex-col gap-1 shadow-sm">
                  <span className="text-lg">📹</span>
                  <strong className="text-xs text-on-surface tracking-tight block">Kamera Pengawas CCTV</strong>
                  <span className="text-[10px] font-mono text-on-surface-variant font-bold mt-1 block">
                    ± {equivalentCCTV} CCTV Unit / Tahun
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-outline-variant/60 flex flex-col gap-1 shadow-sm">
                  <span className="text-lg">🧱</span>
                  <strong className="text-xs text-on-surface tracking-tight block">Paving Block Jalan</strong>
                  <span className="text-[10px] font-mono text-on-surface-variant font-bold mt-1 block">
                    ± {equivalentPaving} Meter Jalan / Tahun
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-outline-variant/60 flex flex-col gap-1 shadow-sm">
                  <span className="text-lg">🍙</span>
                  <strong className="text-xs text-on-surface tracking-tight block">Sembako Warga Sekitar</strong>
                  <span className="text-[10px] font-mono text-on-surface-variant font-bold mt-1 block">
                    ± {equivalentSembako} Paket Sembako / Tahun
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          5. MATRIKS JAMINAN KEAMANAN TEKNIS (FINANCIAL-GRADE)
          ======================================================== */}
      <section className="py-24 bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          
          <div className="text-center flex flex-col items-center gap-3 max-w-xl mx-auto">
            <span className="text-xs font-black text-primary uppercase tracking-widest font-mono">Financial-Grade Security Layer</span>
            <h2 className="text-3xl md:text-4xl font-black text-on-surface font-sans">Integritas Teknis & Keamanan Mutlak</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Kami merakit backend dengan jaminan asersi ketat kelas perbankan untuk meminimalkan anomali data, serangan replay, dan pembulatan desimal.
            </p>
          </div>

          {/* Technical grid showing strict computational guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Guarantee 1 */}
            <div 
              className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between gap-6 cursor-pointer transition-all duration-350 ${
                expandedTechId === "integer" ? "border-primary ring-2 ring-primary/10" : "border-outline-variant/40 hover:border-primary"
              }`}
              onClick={() => setExpandedTechId(expandedTechId === "integer" ? null : "integer")}
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center shadow-inner">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="font-sans font-extrabold text-base text-on-surface leading-tight">1. Strict Integer Arithmetic</h4>
                <p className="text-[11px] leading-relaxed text-on-surface-variant">
                  Menghilangkan kesalahan pembulatan desimal komputer (floating-point loss) dengan mengunci perhitungan bagi hasil komisi pada satuan Rupiah utuh terkecil. Keuangan kas warga dijamin mutlak akurat tanpa selisih.
                </p>
              </div>
              
              <span className="text-[10px] font-mono font-black text-primary hover:underline flex items-center gap-1">
                {expandedTechId === "integer" ? "Sembunyikan Model Asersi" : "Tinjau Kode Logika Asersi →"}
              </span>
            </div>

            {/* Guarantee 2 */}
            <div 
              className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between gap-6 cursor-pointer transition-all duration-350 ${
                expandedTechId === "atomic" ? "border-primary ring-2 ring-primary/10" : "border-outline-variant/40 hover:border-primary"
              }`}
              onClick={() => setExpandedTechId(expandedTechId === "atomic" ? null : "atomic")}
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="font-sans font-extrabold text-base text-on-surface leading-tight">2. Atomic Transaction Guards</h4>
                <p className="text-[11px] leading-relaxed text-on-surface-variant">
                  Skrip pemrosesan database berjalan dalam satu kesatuan batch. Jika entri platform fee 30% gagal, sistem akan membatalkan (rollback) entri kas warga 70% demi menjaga kesucian audit log keuangan.
                </p>
              </div>

              <span className="text-[10px] font-mono font-black text-primary hover:underline flex items-center gap-1">
                {expandedTechId === "atomic" ? "Sembunyikan Model Asersi" : "Tinjau Kode Logika Asersi →"}
              </span>
            </div>

            {/* Guarantee 3 */}
            <div 
              className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between gap-6 cursor-pointer transition-all duration-350 ${
                expandedTechId === "hmac" ? "border-primary ring-2 ring-primary/10" : "border-outline-variant/40 hover:border-primary"
              }`}
              onClick={() => setExpandedTechId(expandedTechId === "hmac" ? null : "hmac")}
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center shadow-inner">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-sans font-extrabold text-base text-on-surface leading-tight">3. Anti-Tamper Payload Validation</h4>
                <p className="text-[11px] leading-relaxed text-on-surface-variant">
                  Validasi tanda tangan digital berbasis enkripsi HMAC-SHA256 menggunakan kunci rahasia server pada setiap endpoint callback afiliasi eksternal, dilengkapi pembatasan toleransi timestamp maksimal 5 menit.
                </p>
              </div>

              <span className="text-[10px] font-mono font-black text-primary hover:underline flex items-center gap-1">
                {expandedTechId === "hmac" ? "Sembunyikan Model Asersi" : "Tinjau Kode Logika Asersi →"}
              </span>
            </div>

          </div>

          {/* Collapsible Tech Visuals (Pure React transition-based drawer) */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedTechId ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
            {expandedTechId && (
              <div className="bg-[#131b2e] text-white rounded-3xl p-6 md:p-8 font-mono text-[11px] border border-[#1e293b] leading-relaxed shadow-lg mt-4 relative">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                  <span className="text-primary-container font-bold">LOGIKA KODE BASIS: {expandedTechId.toUpperCase()}</span>
                  <button onClick={() => setExpandedTechId(null)} className="text-neutral-400 hover:text-white border-0 bg-transparent cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {expandedTechId === "integer" && (
                  <pre className="overflow-x-auto text-emerald-400">
{`// Menentukan hitungan Rupiah integer tanpa float error
function hitungKomisiBagiHasil(totalBelanjaRupiah: number): { kas: number; platform: number } {
  const KAS_PERCENTAGE_NUMERATOR = 70;
  const COMMISSION_NUMERATOR = 5; // 5% komisi
  
  // Ambil total nilai komisi dalam integer terendah (satuan Rupiah utuh)
  const totalKomisiRupiah = Math.floor((totalBelanjaRupiah * COMMISSION_NUMERATOR) / 100);
  
  // Alokasi Kas (70%) & Platform (30%) tanpa floating point loss
  const alokasiKas = Math.floor((totalKomisiRupiah * KAS_PERCENTAGE_NUMERATOR) / 100);
  const alokasiPlatform = totalKomisiRupiah - alokasiKas; // sisa saldo dialokasikan penuh
  
  return { kas: alokasiKas, platform: alokasiPlatform };
}`}
                  </pre>
                )}

                {expandedTechId === "atomic" && (
                  <pre className="overflow-x-auto text-blue-400">
{`// Penjaminan Transaksi Atom dalam SQL / Supabase Ledger
const prosesSiklusEkonomiLokal = async (belanjaId: string, totalRupiah: number, targetRT: string) => {
  const { kas, platform } = hitungKomisiBagiHasil(totalRupiah);

  // Jalankan dalam satu rilis mutlak SQL transaction RPC
  const { data, error } = await supabase.rpc('execute_sirkular_audit_ledger_block', {
    p_belanja_id: belanjaId,
    p_nominal_kas: kas,
    p_nominal_platform: platform,
    p_target_rt: targetRT
  });

  if (error) {
    console.error("Ledger rollback triggered! Menjaga kesucian audit log.", error.message);
    throw new Error("Gagal memproses transaksi. Batalkan seluruh alokasi.");
  }
  return data; // berhasil diproses secara aman
}`}
                  </pre>
                )}

                {expandedTechId === "hmac" && (
                  <pre className="overflow-x-auto text-indigo-300">
{`// Verifikasi HMAC Payload untuk mencegah pemalsuan pengiriman dana
import { createHmac } from 'crypto';

function verifikasiLogistikCallback(reqHeaders: any, rawPayload: string): boolean {
  const incomingSignature = reqHeaders['x-urun-signature'];
  const incomingTimestamp = Number(reqHeaders['x-urun-timestamp']);
  
  // 1. Batasi toleransi replay attack maksimal 5 menit (300 detik)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - incomingTimestamp) > 300) {
    return false; // payload kedaluwarsa
  }
  
  // 2. Bandingkan tanda tangan kriptografi SHA256 menggunakan secret key server
  const hmac = createHmac('sha256', process.env.CALLBACK_SECRET_KEY!);
  hmac.update(\`\${incomingTimestamp}.\${rawPayload}\`);
  const calculatedSignature = hmac.digest('hex');
  
  return calculatedSignature === incomingSignature;
}`}
                  </pre>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================
          6. CLOSING AND CALL TO ACTION (CTA) MATRIX
          ======================================================== */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          
          {/* Action Box 1: For Administrators */}
          <div className="bg-surface-container-low rounded-[2.5rem] p-8 md:p-12 border border-outline-variant/60 flex flex-col justify-between items-start gap-8 shadow-sm">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black tracking-widest text-primary font-mono uppercase">BAGI PENGURUS LINGKUNGAN YANG RAGU</span>
              <h3 className="text-3xl font-black text-[#0f172a] font-sans leading-tight">Uji Coba Simulator Sistem RT/RW Selama 10 Menit</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Bebas Risiko, Tanpa Kontrak, Gratis Selamanya. Daftarkan rukun komunitas anda hari ini dan lihat bagaimana kas otomatisasi sirkular bekerja menyehatkan infrastruktur wilayah.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => setShowPitchModal(true)}
                className="bg-primary hover:bg-opacity-95 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary/15 cursor-pointer text-center border-0"
              >
                Aktifkan Panel RT/RW Sekarang
              </button>
              <Link href="/login" className="bg-white border border-outline-variant hover:bg-neutral-50 text-on-surface-variant font-bold text-xs py-3.5 px-6 rounded-xl transition-all text-center">
                Coba Demo Sandboxed
              </Link>
            </div>
          </div>

          {/* Action Box 2: For Partners / Investors */}
          <div className="bg-surface-container-low rounded-[2.5rem] p-8 md:p-12 border border-outline-variant/60 flex flex-col justify-between items-start gap-8 shadow-sm">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black tracking-widest text-secondary font-mono uppercase">BAGI INVESTOR / MITRA SPONSOR</span>
              <h3 className="text-3xl font-black text-[#0f172a] font-sans leading-tight">Membangun Jaringan Pipa Ekonomi Mikro Terbesar</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Jadilah bagian dari pembangunan jaringan pipa ekonomi mikro terbesar di Indonesia. Alirkan merek dagang, produk, serta program CSR langsung ke titik pemakai tanpa CAC tinggi.
              </p>
            </div>

            <button 
              onClick={() => setShowPitchModal(true)}
              className="bg-secondary hover:bg-opacity-95 text-white font-bold text-xs py-4 px-6 rounded-xl transition-all shadow-md shadow-secondary/15 cursor-pointer w-full text-center border-0"
            >
              Jadwalkan Technical Pitching dengan Tim Kami
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          7. REUSABLE MODAL: PITCH & ONBOARDING SYSTEM
          ======================================================== */}
      {showPitchModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden border border-outline-variant/60 shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => {
                setShowPitchModal(false);
                setOnboardingSuccess(false);
              }} 
              className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface cursor-pointer border-0 bg-transparent p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!onboardingSuccess ? (
              <form onSubmit={handlePitchSubmit} className="p-8 flex flex-col gap-5 overflow-y-auto">
                
                <div className="flex flex-col gap-1 pr-8">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Form Pendaftaran URUN</span>
                  <h3 className="text-2xl font-black text-on-surface font-sans">Onboard Komunitas & Kemitraan</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Isi data anda untuk mendapatkan hak akses rintisan serta whitepaper teknis terperinci URUN.</p>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider font-mono">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Bpk / Ibu..."
                    value={pitchData.name}
                    onChange={(e) => setPitchData({ ...pitchData, name: e.target.value })}
                    className="h-10 px-4 rounded-xl border border-outline bg-surface text-on-surface text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider font-mono">Surel Elektronik (Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="contoh@domain.com"
                    value={pitchData.email}
                    onChange={(e) => setPitchData({ ...pitchData, email: e.target.value })}
                    className="h-10 px-4 rounded-xl border border-outline bg-surface text-on-surface text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider font-mono">Peran Perwakilan Anda</label>
                  <select
                    value={pitchData.role}
                    onChange={(e) => setPitchData({ ...pitchData, role: e.target.value })}
                    className="h-10 px-3 rounded-xl border border-outline bg-surface text-on-surface text-xs focus:border-primary focus:outline-none font-bold"
                  >
                    <option value="Pengurus RT/RW">Pengurus RT / RW Lingkungan</option>
                    <option value="Investor / Sponsor">Investor / Corporate Sponsor</option>
                    <option value="Penyedia Material / Retail">Penyedia Grosir Sembako & Alat</option>
                    <option value="Warga Komunitas">Warga Berdomisili Penasaran</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider font-mono">Lokasi Wilayah Keasangan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: RT 04 / RW 04 Kebayoran, Jaksel"
                    value={pitchData.region}
                    onChange={(e) => setPitchData({ ...pitchData, region: e.target.value })}
                    className="h-10 px-4 rounded-xl border border-outline bg-surface text-on-surface text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider font-mono">Catatan atau Pertanyaan (Opsional)</label>
                  <textarea
                    placeholder="Beri tahu kami tantangan unik di wilayah komunitas Anda..."
                    value={pitchData.notes}
                    onChange={(e) => setPitchData({ ...pitchData, notes: e.target.value })}
                    className="h-20 p-3 rounded-xl border border-outline bg-surface text-on-surface text-xs focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="h-11 bg-primary hover:bg-opacity-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md shadow-primary/10 border-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Daftarkan & Kirim Unduhan Blueprint</span>
                </button>

              </form>
            ) : (
              <div className="p-8 flex flex-col items-center text-center gap-6">
                
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-primary flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <h4 className="font-sans font-black text-xl text-on-surface">Permohonan Onboarding Berhasil Divalidasi!</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm">
                    Terima kasih <strong className="text-on-surface">{pitchData.name}</strong>. Tim Arsitektur Sistem URUN telah menyetujui alokasi kuorum rintisan kedaulatan untuk wilayah <strong className="text-on-surface">{pitchData.region}</strong>.
                  </p>
                </div>

                {/* Certified Ledger Ticket */}
                <div className="w-full bg-[#FCFBF9] p-5 rounded-2xl border border-outline-variant/60 text-left font-mono text-[10px] flex flex-col gap-2.5 relative">
                  <div className="absolute top-0 right-0 h-full w-4 flex flex-col justify-around text-outline-variant select-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="text-[8px] leading-none">•</span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-primary font-bold border-b border-outline-variant pb-1.5">
                    <span>URUN SECURE LEDGER TICKET</span>
                    <span className="text-primary">STATUS: APPROVED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-on-surface-variant">
                    <div>
                      <span className="block text-[8px] text-outline">NOMOR TIKET</span>
                      <strong className="text-on-surface">#{ticketNumber}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] text-outline">PERAN PERWAKILAN</span>
                      <strong className="text-on-surface">{pitchData.role.toUpperCase()}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] text-outline">VERIFIKASI BLOK</span>
                      <strong className="text-on-surface">2026-05-22 UTC</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] text-outline">HAK AKUN</span>
                      <strong className="text-primary font-bold">LIFETIME FREE (RT)</strong>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/50 pt-2 text-[9px] text-on-surface-variant leading-relaxed">
                    Tautan tautan unduh Whitepaper & sirkular ekonomi 70/30 Blueprint telah dikirimkan ke email anda <strong>{pitchData.email}</strong>.
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowPitchModal(false);
                    setOnboardingSuccess(false);
                  }}
                  className="h-10 bg-[#131b2e] hover:bg-opacity-95 text-white rounded-xl text-xs font-bold w-full cursor-pointer border-0"
                >
                  Selesai & Tutup Jendela
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================
          8. PRIVACY BANNER: LAW PDP COMPLIANT
          ======================================================== */}
      {showPrivacyBanner && (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-bold text-on-surface mb-1">Jaminan Perlindungan Data Pribadi</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Situs ini menggunakan arsitektur Kedaulatan Data tanpa pelacak komersial atau kuki iklan pihak ketiga. Seluruh informasi pribadi Anda dilindungi ketat di level basis data sesuai regulasi UU PDP No. 27/2022. Dengan melanjutkan penelusuran, Anda menyatakan sepakat dengan Syarat & Ketentuan serta Kebijakan Privasi kami.
                </p>
              </div>
            </div>
            <button 
              onClick={handlePrivacyConsent}
              className="w-full sm:w-auto px-6 py-3 whitespace-nowrap text-sm font-bold text-white bg-primary rounded-xl hover:bg-opacity-90 transition-colors shrink-0 border-0 cursor-pointer shadow-sm shadow-primary/10"
            >
              Paham & Sepakat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
