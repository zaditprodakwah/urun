"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Contributor {
  id: string;
  role: string;
  reputation_score: number;
  joined_at: string;
  profiles: {
    full_name: string;
    phone: string;
  };
}

interface SocialLog {
  id: string;
  actorName: string;
  actionType: string;
  description: string;
  pointChange: string;
  timestamp: string;
}

export default function LeaderboardPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [logs, setLogs] = useState<SocialLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferrer, setSelectedReferrer] = useState<string>("");
  const [simulating, setSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Fetch leaderboard data from API
  const fetchData = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (res.ok) {
        setContributors(data.topContributors || []);
        setLogs(data.recentLogs || []);
        
        // Auto-select first contributor as referrer if none is selected
        if (data.topContributors && data.topContributors.length > 0 && !selectedReferrer) {
          setSelectedReferrer(data.topContributors[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Copy referral link to clipboard
  const handleCopyLink = () => {
    if (!selectedReferrer) return;
    const link = `${window.location.origin}/catalog/semen-tiga-roda?ref=urunwarga&referrer=${selectedReferrer}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    showToast("Link rujukan tender berhasil disalin ke papan klip!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Run referral loop simulation
  const handleSimulateContribution = async () => {
    if (!selectedReferrer) return;
    setSimulating(true);
    showToast("Menghubungkan ke Supabase Sovereign Core...", "success");

    try {
      const res = await fetch("/api/simulator/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrerId: selectedReferrer })
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message, "success");
        // Refetch database state immediately to show real-time changes
        await fetchData();
      } else {
        showToast(data.error || "Gagal menyimulasikan rujukan.", "error");
      }
    } catch (err) {
      console.error("Simulation error:", err);
      showToast("Terjadi kesalahan koneksi serverless.", "error");
    } finally {
      setSimulating(false);
    }
  };

  const getReferrerName = () => {
    const found = contributors.find(c => c.id === selectedReferrer);
    return found ? found.profiles?.full_name : "Warga";
  };

  const getReferralUrl = () => {
    if (!selectedReferrer) return "";
    return `${window.location.origin.replace('localhost', '127.0.0.1')}/catalog/semen-tiga-roda?ref=urunwarga&referrer=${selectedReferrer.substring(0, 8)}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-3 animate-bounce ${
          toast.type === "success" 
            ? "bg-zinc-950/90 border-emerald-500/30 text-emerald-400" 
            : "bg-zinc-950/90 border-rose-500/30 text-rose-400"
        }`}>
          <span className="text-lg">{toast.type === "success" ? "✅" : "⚠️"}</span>
          <p className="text-xs font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-zinc-950">U</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">URUN</span>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Leaderboard
                </span>
              </div>
              <p className="text-xs text-zinc-400">Micro-Community Operating System</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/catalog" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Etalase Katalog
            </Link>
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Pusat Komando
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <span className="text-emerald-400">❖</span> Papan Peringkat Dedikasi Warga
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Transparansi Kontribusi <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">Sovereign Warga</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Menampilkan warga ter-dedikatif berdasarkan skor reputasi deterministik tanpa didasarkan pada sekat status finansial atau kekayaan. Menjunjung kebersamaan dan andil nyata di komunitas RT/RW.
          </p>
        </div>
      </section>

      {/* Grid Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Top 5 Leaderboard & Social Proof Feed (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top 5 Contributors Card */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Top 5 Kontributor Dedikatif</h2>
                <p className="text-xs text-zinc-500">Masyarakat paling andil dalam program kesejahteraan sosial RT 01 Kalisari</p>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                RT 01 Kalisari
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-zinc-500 space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
                <p className="text-xs">Memuat reputasi dari blockchain data Supabase...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contributors.map((c, index) => {
                  const name = c.profiles?.full_name || "Warga Komunitas";
                  const score = c.reputation_score;
                  const role = c.role.toUpperCase();
                  const phone = c.profiles?.phone ? `+${c.profiles.phone.substring(0, 5)}***` : "No Phone";
                  
                  // Rank visualization styles
                  const rankColors = [
                    "from-amber-400 to-yellow-600 text-zinc-950 font-black",
                    "from-zinc-300 to-zinc-400 text-zinc-950 font-black",
                    "from-amber-700 to-amber-900 text-white font-black",
                    "bg-zinc-900 text-zinc-400",
                    "bg-zinc-900 text-zinc-500"
                  ];
                  const rankLabels = ["1ST", "2ND", "3RD", "4TH", "5TH"];

                  return (
                    <div 
                      key={c.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/30 hover:border-emerald-500/15 transition-all duration-300 group ${
                        c.id === selectedReferrer ? "border-emerald-500/30 bg-emerald-500/5" : ""
                      }`}
                    >
                      {/* Rank & User Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-xs tracking-wider font-bold shadow-md ${rankColors[index] || "bg-zinc-900"}`}>
                          {rankLabels[index]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {name}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              c.role === 'pengurus' 
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {role}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">Phone ID: {phone}</span>
                        </div>
                      </div>

                      {/* Reputasi Score & Slider */}
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Reputasi</div>
                          <div className="text-lg font-black text-white font-mono">{score} <span className="text-xs text-emerald-400 font-normal">pts</span></div>
                        </div>
                        
                        {/* Interactive selection helper */}
                        <button
                          onClick={() => setSelectedReferrer(c.id)}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                            selectedReferrer === c.id 
                              ? "bg-emerald-500 text-zinc-950" 
                              : "bg-zinc-900 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {selectedReferrer === c.id ? "Terpilih" : "Pilih Rujukan"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Social Proof (Live Feed logs) */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Dynamic Social Proof</h2>
              <p className="text-xs text-zinc-500">Log perubahan reputasi nyata yang diverifikasi oleh database RLS secara realtime</p>
            </div>

            {loading ? (
              <div className="py-6 text-center text-zinc-600 text-xs">Memuat audit log...</div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => {
                  const isPositive = log.pointChange.startsWith("+");
                  return (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/30 border border-zinc-900 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                          {isPositive ? "🟢" : "🔴"}
                        </span>
                        <div>
                          <p className="text-zinc-300">
                            <strong className="text-white">{log.actorName}</strong> {log.description}
                          </p>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} - UTC+7
                          </span>
                        </div>
                      </div>
                      <span className={`font-mono font-bold px-2 py-1 rounded ${
                        isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {log.pointChange} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Referral Loop Simulator (4 columns) */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm p-6 space-y-6 sticky top-28">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400">
                🧪 CORE SIMULATOR
              </div>
              <h2 className="text-lg font-bold text-white">Referral Loop Engine</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Uji fungsionalitas rujukan finansial warga. Di URUN, rujukan tender menghasilkan skor reputasi (+2 poin), bukan uang adiktif, mempromosikan aksi kolektif etis.
              </p>
            </div>

            {/* Referrer Selector state display */}
            {selectedReferrer ? (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 tracking-wider">Perujuk Terpilih (Warga A)</span>
                  <div className="font-bold text-white text-sm">{getReferrerName()}</div>
                </div>

                {/* Simulated Link copy panel */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 tracking-wider">WhatsApp Referral Link</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={getReferralUrl()}
                      className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-[10px] font-mono text-zinc-400 flex-1 outline-none select-all"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white border border-zinc-700 active:scale-95 transition-transform"
                    >
                      {copied ? "Selesai" : "Salin"}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 leading-relaxed">
                  Bagikan tautan ini ke Warga B. Ketika Warga B berkontribusi pada Urun Dana tender melalui tautan rujukan tersebut, Warga A otomatis mendapatkan reputasi.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900/80 text-center text-xs text-zinc-500">
                Silakan pilih salah satu warga di papan peringkat sebelah kiri untuk memulai simulasi.
              </div>
            )}

            {/* Action Simulator Button */}
            <button 
              disabled={!selectedReferrer || simulating}
              onClick={handleSimulateContribution}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-bold hover:from-emerald-400 hover:to-emerald-300 disabled:from-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 text-xs uppercase tracking-wider"
            >
              {simulating ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-950 border-t-transparent animate-spin"></div>
                  Memproses Log...
                </>
              ) : (
                <>
                  🚀 Simulasikan Kontribusi Warga B
                </>
              )}
            </button>

            {/* Technical Context audit info */}
            <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-900/80 text-[10px] space-y-2 font-mono text-zinc-500">
              <div className="text-white font-bold text-[10px] uppercase">Under The Hood (Sovereign Core):</div>
              <p>Memicu API POST `/api/simulator/referral` yang menulis log `successful_referral` di database Supabase.</p>
              <p>Trigger `reputation_engine_trigger` di Postgres menghitung:</p>
              <pre className="text-emerald-400 text-[9px] bg-zinc-900 p-2 rounded overflow-x-auto">
{`C_successful_referral = +2
UPDATE community_members
SET reputation_score = reputation_score + 2
WHERE id = actor_id;`}
              </pre>
            </div>
            
          </div>
        </div>

      </main>

      {/* Visual Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-center text-xs text-zinc-600 relative z-10">
        <p className="mb-2">© 2026 URUN Warga. Dibangun dengan Kedaulatan Data Lokal & Efisiensi Kolektif.</p>
        <p>Setiap penulisan log rujukan dilindungi hak portabilitas data lokal.</p>
      </footer>
    </div>
  );
}
