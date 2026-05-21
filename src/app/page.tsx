"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "🤖 *ASISTEN BOT URUN*\n\nSelamat datang di Simpul Komunitas URUN. Saya adalah asisten berdaulat Anda.\n\nGunakan perintah resmi berikut untuk berinteraksi:\n• *#urun* : Lihat daftar program URUN Dana aktif\n• *#urun join [slug] [qty]* : Ikut serta tender kolektif\n• *#kas* : Transparansi mutasi Buku Kas Kolektif secara real-time\n• *#reputasi* : Cek Skor Reputasi & portofolio warga\n• *#approve [request_id]* : Tandatangan Multi-Sig (Khusus Pengurus)",
      timestamp: "14:54",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeExplain, setActiveExplain] = useState<Message["underTheHood"] | null>(null);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

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

  const commands = [
    { label: "#urun", desc: "Lihat Tender Aktif", cmd: "#urun" },
    { label: "#kas", desc: "Buku Kas Kolektif", cmd: "#kas" },
    { label: "#reputasi", desc: "Portofolio Warga", cmd: "#reputasi" },
    { label: "#urun join", desc: "Ikut Tender Kolektif", cmd: "#urun join semen-jalan-rt-01 2" },
    { label: "#approve", desc: "Tandatangan Multi-Sig", cmd: "#approve req-908" },
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
        title: "Pencarian Tenant / RLS Context Isolation",
        description: "Setiap data diisolasi secara database level menggunakan community_id. Sistem mengonversi nomor WhatsApp pengirim menjadi identitas profil warga melalui RLS.",
        rules: ["RULE 1: Row-Level Security (RLS) di PostgreSQL", "RULE 3: Data Minimization"],
        technical: "SELECT * FROM community_members WHERE profiles.phone = sender_phone AND community_id = X;",
      };

      const normalized = text.trim().toLowerCase();

      if (normalized === "#urun") {
        replyText = "📦 *TENDER WARGA AKTIF*\nSimpul Komunitas: URUN Dana Kolektif\n-------------------------------\n\n1. *URUN Semen Jalan RT 01*\n   👉 Join: `#urun join semen-jalan-rt-01 1`\n   🎯 Target: 100 unit (Min: 50)\n   📅 Batas: 30 Juni 2026\n\n2. *URUN Lampu Penerangan Gang*\n   👉 Join: `#urun join lampu-penerangan-gang 1`\n   🎯 Target: 20 unit (Min: 10)\n   📅 Batas: 15 Juni 2026\n\nKetik `#kas` untuk melihat transparansi keuangan Simpul Komunitas.";
        explanation = {
          title: "Query Tenders & Catalog Items",
          description: "Mengambil daftar pengadaan aktif milik komunitas. Akses dibatasi secara otomatis oleh PostgreSQL RLS sehingga pengurus komunitas lain tidak dapat membaca data ini.",
          rules: ["RULE 1: RLS enforced at DB level", "RULE 3: Data Minimization"],
          technical: "SELECT * FROM tenders WHERE community_id = $1 AND current_state = 'subscribing';",
        };
      } else if (normalized.startsWith("#urun join")) {
        const parts = text.split(/\s+/);
        const slug = parts[2] || "semen-jalan-rt-01";
        const qty = parseInt(parts[3] || "1", 10);
        const total = qty * 75000;

        if (total >= 5000000) {
          replyText = `⚠️ *PERSETUJUAN MULTI-SIG DIBUTUHKAN*\n\nPartisipasi Anda dalam *${slug.toUpperCase().replace(/-/g, " ")}* sebanyak ${qty} unit dengan total *Rp ${total.toLocaleString("id-ID")}* telah dicatat.\n\nKarena nilai transaksi melebihi ambang batas Multi-Sig komunitas (> Rp 5M), transaksi dikunci dalam status *PENDING* hingga disetujui oleh minimal 2 Pengurus.`;
          explanation = {
            title: "Multi-Sig Lock & Pending Ledger Entry",
            description: "Transaksi dengan nominal besar otomatis dialihkan ke status PENDING di tabel `multisig_requests`. Database memblokir penulisan langsung ke ledger kas utama hingga kuorum tercapai.",
            rules: ["RULE 5: Multi-Sig Enforced (>Rp 5M)", "RULE 2: Immutable Ledger (Append-Only)"],
            technical: "INSERT INTO multisig_requests (requested_by, amount, required_sigs, status) VALUES (...);",
          };
        } else {
          replyText = `✅ *BERHASIL BERGABUNG URUN DANA*\n\nTerima kasih *Zadit Prodakwah*! Anda resmi bergabung dalam program *${slug.toUpperCase().replace(/-/g, " ")}*.\n\n*Rincian Partisipasi:*\n• Jumlah: ${qty} unit\n• Harga Satuan: Rp 75.000\n• Total Tagihan: *Rp ${total.toLocaleString("id-ID")}*\n\nTransaksi telah sukses dicatat di *Buku Kas Kolektif* (Ledger Immutable).\nSilakan lakukan pembayaran tunai/transfer ke Bendahara.`;
          explanation = {
            title: "Safe RPC Ledger & Deterministic Reputation Update",
            description: "Menulis kontribusi warga ke Buku Kas Kolektif menggunakan Stored Procedure `process_ledger_entry`. Penulisan dilindungi dari modifikasi langsung. Trigger otomatis menaikkan skor reputasi warga (+3 untuk kontribusi tender).",
            rules: ["RULE 2: Ledger is Immutable (Append-Only)", "RULE 4: Reputation is Deterministic (+3 points)"],
            technical: "SELECT process_ledger_entry(p_community_id => $1, p_amount => $2, p_entry_type => 'tender_contribution');",
          };
        }
      } else if (normalized === "#kas") {
        replyText = "📊 *BUKU KAS KOLEKTIF*\nSimpul Komunitas Transparan & Append-Only\n-------------------------------\n*Saldo Kas Saat Ini:* *Rp 150.000*\n\n*5 Mutasi Kas Terakhir:*\n1. [21 Mei] 🟢 (+) *Rp 150.000*\n   _WhatsApp: URUN Dana URUN Semen Jalan RT 01 x2 unit_\n2. [21 Mei] 🟢 (+) *Rp 0*\n   _System: Inisialisasi Simpul Komunitas RT 01 Kalisari_";
        explanation = {
          title: "Dynamic Ledger Calculation",
          description: "Menghitung saldo kas secara real-time dengan menjumlahkan seluruh mutasi (direction='in' bernilai positif, 'out' bernilai negatif). Rantai audit terjamin transparan dan bebas ghost transactions.",
          rules: ["RULE 2: Ledger is Immutable (No updates allowed)", "RULE 6: Daily Fraud Reconciliation Base"],
          technical: "SELECT SUM(CASE WHEN direction = 'in' THEN amount ELSE -amount END) FROM ledger WHERE community_id = $1;",
        };
      } else if (normalized === "#reputasi") {
        replyText = "🎗️ *PORTOFOLIO REPUTASI WARGA*\nAkrab, Transparan, & Tanpa Nepotisme\n-------------------------------\n• Nama: *Zadit Prodakwah*\n• Skor Reputasi: *18 poin*\n• Kategori: *Warga Aktif ⭐*\n\n*3 Riwayat Aktivitas Reputasi:*\n1. [21 Mei] *Tender participation: URUN Semen Jalan RT 01 (+3)*\n2. [21 Mei] *Simpul Komunitas Created (+10 default/floor)*\n3. [20 Mei] *Registrasi Profil Berhasil (+5)*";
        explanation = {
          title: "Deterministic Reputation System",
          description: "Skor reputasi dihitung secara deterministik dan dicatat dalam riwayat audit. Algoritma database menjamin tidak ada bias atau manipulasi manual pada sistem reputasi simpul.",
          rules: ["RULE 4: Reputation is Deterministic", "RULE 7: Data Deletion & Portability Link"],
          technical: "SELECT reputation_score FROM community_members WHERE id = $1;",
        };
      } else if (normalized.startsWith("#approve")) {
        const parts = text.split(/\s+/);
        const reqId = parts[1] || "req-908";
        replyText = `✍️ *TANDATANGAN MULTI-SIG DICATAT*\n\nTandatangan Anda berhasil divalidasi. Saat ini terkumpul (*2/2*) persetujuan.\n\n✅ *TRANSAKSI MULTI-SIG DISETUJUI PERMANEN*\n\nKuorum tercapai. Dana sebesar *Rp 7.500.000* untuk pengadaan semen resmi dicairkan dan dicatat ke *Buku Kas Kolektif* Simpul Komunitas.`;
        explanation = {
          title: "Multi-Sig Consensus Resolution",
          description: "Menambahkan tanda tangan digital pengurus. Saat kuorum tercapai (2 dari 3 tanda tangan), status berubah menjadi approved dan sistem secara otomatis memicu transfer ledger kas secara aman.",
          rules: ["RULE 5: Multi-Sig Threshold Verification", "RULE 2: Immutable Ledger Entry Generation"],
          technical: `UPDATE multisig_requests SET status = 'approved' WHERE id = '${reqId}' AND current_sigs >= required_sigs;`,
        };
      } else {
        replyText = "🤖 *ASISTEN BOT URUN*\n\nFormat perintah tidak dikenal. Gunakan perintah resmi berikut:\n\n• *#urun* : Lihat daftar program URUN Dana aktif\n• *#urun join [nama-slug] [qty]* : Ikut serta tender kolektif\n• *#kas* : Transparansi mutasi Buku Kas Kolektif secara real-time\n• *#reputasi* : Cek Skor Reputasi & portofolio warga\n• *#approve [request_id]* : Tandatangan Multi-Sig (Khusus Pengurus)";
        explanation = {
          title: "Default Help Menu Routing",
          description: "Ketika input tidak cocok dengan regex perintah mana pun, bot secara otomatis mengirimkan menu bantuan interaktif ini kembali ke warga.",
          rules: ["RULE 3: Minimasi Data & Interaksi"],
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

  return (
    <div className="flex flex-col flex-1 w-full relative overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* SECTION 1: HERO */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-8">
          Sistem Operasi Mikro-Komunitas Berdaulat Tingkat RT/RW
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl">
          Komunitas Berdaulat, Transparansi Kas Mutlak, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">Kolaborasi Mandiri.</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Kelola iuran wajib, pendanaan infrastruktur gang, dan kekuatan belanja secara kolektif tanpa perantara. Pembukuan permanen bebas dari kapitalisme pengawasan.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/catalog" className="px-6 py-3 rounded-lg bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
            Lihat Program Aktif
          </Link>
          <Link href="/tentang" className="px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 transition-colors">
            Pelajari Gerakan
          </Link>
        </div>
      </section>

      {/* SECTION 2: PANEL INDIKATOR DATA */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center">
            <div className="text-3xl font-bold text-white mb-2">Rp 12.450.000</div>
            <div className="text-sm text-zinc-400">Dana Terhemat Kolektif Warga</div>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3"><span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span></div>
            <div className="text-3xl font-bold text-white mb-2">100% Immutability</div>
            <div className="text-sm text-zinc-400">Rekonsiliasi Kas Live-Audited</div>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center">
            <div className="text-3xl font-bold text-white mb-2">148 Warga</div>
            <div className="text-sm text-zinc-400">Anggota Berdedikasi Aktif</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BOT SIMULATOR */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900/50">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white">WhatsApp Webhook Gateway Simulator</h2>
          <p className="text-zinc-400 text-sm">
            Eksplorasi interaktif bagaimana URUN Sovereign Core memproses instruksi warga secara instan via WhatsApp Webhook.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Simulation Controls (Left side) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-zinc-500 uppercase">Panel Kontrol Simulator</h3>
            <p className="text-xs text-zinc-400 pb-2">Klik perintah di bawah untuk uji coba:</p>
            <div className="space-y-3">
              {commands.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => handleCommandClick(cmd.cmd)}
                  disabled={isTyping}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-emerald-500/30 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div>
                    <div className="font-mono text-sm text-emerald-400 font-bold mb-0.5 group-hover:text-emerald-300">{cmd.label}</div>
                    <div className="text-xs text-zinc-400">{cmd.desc}</div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                    <span className="text-xs">▶</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-400/80 leading-relaxed">
              <strong>Simulasi Node:</strong> Semua transaksi dikirim secara asinkron (delay ~1.2s) meniru latensi real-world WhatsApp Gateway Fonnte ke Edge Network Vercel.
            </div>
          </div>

          {/* Chat Interface (Middle) */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col h-[500px] shadow-2xl relative overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-lg shadow-sm">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Bot Komunitas URUN</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online (Webhook)
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl p-3 shadow-md whitespace-pre-wrap text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700/50"
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className="text-[9px] text-zinc-400 text-right mt-1.5">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-zinc-400 rounded-xl rounded-tl-none p-3 border border-zinc-700/50 text-xs italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    Asisten URUN sedang berpikir...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-zinc-850 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis perintah atau pilih aksi..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-4 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/10"
              >
                Kirim
              </button>
            </form>
          </div>

          {/* Under The Hood Analysis (Right side) */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex-1 space-y-4">
              <div className="text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                <span>🛡️</span> SOVEREIGN UNDER THE HOOD
              </div>

              {activeExplain ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-zinc-800 pb-3">
                    <h4 className="font-bold text-white text-sm">{activeExplain.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{activeExplain.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 font-bold">SACRED RULES TERPASANG:</div>
                    <ul className="space-y-1">
                      {activeExplain.rules.map((rule, idx) => (
                        <li key={idx} className="text-xs text-emerald-300 flex items-start gap-1">
                          <span className="text-emerald-500">✓</span> {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                    <div className="text-[10px] text-zinc-500 font-bold">SQL / DB LOGIC:</div>
                    <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-850 font-mono text-[10px] text-zinc-400 overflow-x-auto whitespace-pre">
                      {activeExplain.technical}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <span className="text-3xl">🔍</span>
                  <div className="text-xs font-bold text-zinc-400">Menunggu Mutasi Transaksi</div>
                  <p className="text-[11px] text-zinc-600 max-w-[180px] leading-relaxed">
                    Kirim perintah di simulator untuk mengaudit alur kerja dan skema database secara transparan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TIGA LAPIS KEDAULATAN (GRID) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900/50">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white">Infrastruktur Kepercayaan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-900 transition-colors">
            <h3 className="text-lg font-bold text-white mb-3">Kedaulatan Finansial</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Buku kas kolektif permanen (ledger) aman dari manipulasi sepihak. Segala pencairan besar wajib melalui Pengaman Multi-Sig pengurus.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-900 transition-colors">
            <h3 className="text-lg font-bold text-white mb-3">Kedaulatan Data & Privasi</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Bebas iklan komersial & analitik. Data terisolasi kaku via Row-Level Security tingkat database PostgreSQL.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-900 transition-colors">
            <h3 className="text-lg font-bold text-white mb-3">Kedaulatan Demokrasi</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Rembug warga digital otomatis via WhatsApp. Pemungutan suara dan kekuatan kuorum berbobot pada tingkat dedikasi nyata warga.
            </p>
          </div>
        </div>
      </section>

      {/* SPANDUK PRIVASI PERSETUJUAN UU PDP */}
      {showPrivacyBanner && (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-5xl mx-auto bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-bold text-white mb-1">Jaminan Perlindungan Data</h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Situs ini menggunakan arsitektur Kedaulatan Data tanpa pelacak komersial atau kuki iklan pihak ketiga. Seluruh informasi pribadi Anda dilindungi ketat di level basis data sesuai regulasi UU PDP No. 27/2022. Dengan melanjutkan penelusuran, Anda menyatakan sepakat dengan Syarat & Ketentuan serta Kebijakan Privasi kami.
                </p>
              </div>
            </div>
            <button 
              onClick={handlePrivacyConsent}
              className="w-full sm:w-auto px-6 py-3 whitespace-nowrap text-sm font-bold text-zinc-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition-colors shrink-0"
            >
              Paham & Sepakat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
