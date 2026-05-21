"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Simulated bot responses based on real database seeds and webhook implementation
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

  // Pre-configured simulation scenarios
  const commands = [
    {
      label: "#urun",
      desc: "Lihat Tender Aktif",
      cmd: "#urun",
    },
    {
      label: "#kas",
      desc: "Buku Kas Kolektif",
      cmd: "#kas",
    },
    {
      label: "#reputasi",
      desc: "Portofolio Warga",
      cmd: "#reputasi",
    },
    {
      label: "#urun join",
      desc: "Ikut Tender Kolektif",
      cmd: "#urun join semen-jalan-rt-01 2",
    },
    {
      label: "#approve",
      desc: "Tandatangan Multi-Sig",
      cmd: "#approve req-908",
    },
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

    // Simulate network delay and processing
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
        const total = qty * 75000; // Rp 75,000 per unit seed

        if (total >= 5000000) {
          // Trigger Multi-Sig simulation
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
          technical: "UPDATE multisig_requests SET status = 'approved' WHERE id = $1 AND current_sigs >= required_sigs;",
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
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* Header Section */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-xl font-bold text-zinc-950">U</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">URUN</h1>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  SOVEREIGN CORE V1.0
                </span>
              </div>
              <p className="text-xs text-zinc-400">Micro-Community Operating System</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm text-zinc-400 hover:text-white transition-colors">Visi & Pilar</a>
            <a href="#compliance" className="text-sm text-zinc-400 hover:text-white transition-colors">7 Aturan Sakral</a>
            <a href="#simulator" className="text-sm text-zinc-400 hover:text-white transition-colors">Simulator WhatsApp</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute"></span>
              <span className="text-xs font-medium text-emerald-400 ml-1">RLS Enforced</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Overview Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <span className="text-emerald-400">❖</span> Kebebasan & Kemerdekaan Data Komunitas
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Kembalikan Kedaulatan Warga dengan <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">Sovereign Interoperability</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            URUN adalah platform operasi komunitas mikro yang dirancang untuk merobohkan monopoli ekonomi ekstraktif. Melalui integrasi WhatsApp Webhook yang mulus dan arsitektur database yang kebal, URUN mempertemukan kebersamaan warga secara nyata dan terdesentralisasi.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300">
              <div className="text-emerald-400 font-semibold mb-1">Pilar I</div>
              <div className="text-sm font-bold text-white mb-0.5">Local Data Stewardship</div>
              <div className="text-xs text-zinc-500">Warga memiliki kendali mutlak atas datanya, terisolasi RLS.</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300">
              <div className="text-emerald-400 font-semibold mb-1">Pilar II</div>
              <div className="text-sm font-bold text-white mb-0.5">Collective Efficiency</div>
              <div className="text-xs text-zinc-500">Mereduksi biaya pengadaan. Auto-split surplus treasury (70/30).</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300">
              <div className="text-emerald-400 font-semibold mb-1">Pilar III</div>
              <div className="text-sm font-bold text-white mb-0.5">Human Resilience</div>
              <div className="text-xs text-zinc-500">Beroperasi tangguh secara offline dengan antarmuka inklusif.</div>
            </div>
          </div>
        </div>

        {/* Live System Stats */}
        <div className="lg:col-span-5 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">⚡</span> INFRASTRUCTURE STATUS
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 font-mono">active_node</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Simpul Komunitas Aktif</span>
              <span className="text-white font-semibold">RT 01 Kalisari, JKT</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Database Row-Level Security</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 100% Enforced
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Buku Kas (Ledger Status)</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Immutable / Append-Only
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Whatsapp Webhook Endpoint</span>
              <span className="text-zinc-300 font-mono text-xs">/api/webhook/whatsapp</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Verifikasi Fonnte Signature</span>
              <span className="text-white font-semibold bg-zinc-800 px-2 py-0.5 rounded text-xs">Enabled (Secure)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80">
            <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                🛡️
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white">Kebijakan Imutabilitas Ledger</div>
                <div className="text-[10px] text-zinc-500 truncate">UPDATE/DELETE diblokir database trigger secara absolut.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator WhatsApp Section */}
      <section id="simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white">WhatsApp Webhook Gateway Simulator</h2>
          <p className="text-zinc-400 text-sm">
            Eksplorasi secara interaktif bagaimana URUN Sovereign Core memproses instruksi warga secara instan via WhatsApp Webhook. Klik salah satu tombol aksi cepat di bawah untuk mensimulasikan command.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Simulation Controls (Left side) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-zinc-500 uppercase">Command Quick-Launch</h3>
            <div className="space-y-3">
              {commands.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => handleCommandClick(cmd.cmd)}
                  disabled={isTyping}
                  className="w-full text-left p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div>
                    <div className="font-mono text-sm text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">
                      {cmd.label}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">{cmd.desc}</div>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-850 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                    Send ➔
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20 text-xs text-emerald-300 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <span>💡</span> TIPS WARGA
              </div>
              <p className="leading-relaxed">
                Tindakan URUN Dana berskala besar (&gt; Rp 5M) secara otomatis dilindungi oleh sistem konsensus Multi-Sig. Pengurus wajib memvalidasi dengan mengirimkan `#approve [req_id]`.
              </p>
            </div>
          </div>

          {/* Simulated WhatsApp Interface (Middle) */}
          <div className="lg:col-span-5 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-h-[500px]">
            {/* WA Header */}
            <div className="bg-zinc-850 p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-inner">
                  U
                </div>
                <div>
                  <div className="text-sm font-bold text-white">URUN RT 01 Kalisari</div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online (Sovereign Bot)
                  </div>
                </div>
              </div>
              <div className="text-xs text-zinc-500 font-mono">ID: RT01-KLS</div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[360px] bg-[url('/chat-bg.png')] bg-repeat bg-opacity-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
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

            {/* WA Input */}
            <form onSubmit={handleSend} className="p-3 bg-zinc-850 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis perintah atau pilih aksi cepat..."
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

      {/* 7 Sacred Rules Compliance Grid */}
      <section id="compliance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white">Kepatuhan 7 Aturan Sakral URUN</h2>
          <p className="text-zinc-400 text-sm">
            URUN menolak kompromi dalam kemerdekaan data warga. Berikut adalah audit real-time status kepatuhan Sovereign Core terhadap Konstitusi Sistem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Rule 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">RULE 1</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                MANDATORY RLS
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Database-Level Row Isolation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Row-Level Security (RLS) diaktifkan secara ketat pada seluruh tabel Supabase. Tidak ada celah logika aplikasi yang dapat membocorkan data antar Simpul Komunitas.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">RULE 2</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                IMMUTABLE LEDGER
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Buku Kas Tanpa Manipulasi</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Perubahan saldo kas hanya dapat dilakukan melalui penulisan record baru (Append-Only). PostgreSQL trigger memblokir instruksi UPDATE dan DELETE secara mutlak.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">RULE 3</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                DATA MINIMIZATION
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Minimasi Data Sensitif</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              URUN hanya merekam nomor telepon WhatsApp dan Nama Warga untuk keperluan operasional. Tidak ada pelacakan analitik eksternal atau profiling perilaku.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">RULE 4</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                DETERMINISTIC REPUTATION
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Reputasi Adil & Logis</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Skor reputasi dihitung secara transparan dan deterministik dari aktivitas warga (+3 kontribusi tender, +5 registrasi, +10 inisiasi). Tanpa bias manual.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">RULE 5</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                MULTI-SIG ENFORCED
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Konsensus Finansial Warga</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Setiap pencairan kas komunitas berskala besar wajib mendapatkan persetujuan kuorum minimal 2 dari 3 perwakilan saksi sebelum dieksekusi ledger.
            </p>
          </div>

          {/* Rule 6 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">RULE 6</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                DAILY RECONCILIATION
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Rekonsiliasi & Deteksi Fraud</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sistem audit otomatis berjalan setiap hari untuk mendeteksi double-spending, ghost transactions, dan penyelewengan kas simpul secara real-time.
            </p>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-semibold text-zinc-400">
            &quot;URUN — Operasi Sistem Komunitas, untuk Kemerdekaan Data, untuk Efisiensi Bersama, untuk Ketahanan Manusia.&quot;
          </p>
          <p>
            © 2026 URUN Warga. Dirilis di bawah prinsip kedaulatan data & open source berdaulat.
          </p>
        </div>
      </footer>

    </div>
  );
}
