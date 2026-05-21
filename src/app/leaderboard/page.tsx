"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Users, 
  Terminal, 
  Info,
  Check,
  TrendingUp,
  Award
} from 'lucide-react';

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
    let mounted = true;
    const load = async () => {
      await Promise.resolve();
      if (mounted) {
        await fetchData();
      }
    };
    load();
    return () => {
      mounted = false;
    };
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

  // Separate top 3 for the beautiful visual podium
  const topThree = contributors.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-zinc-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-800 relative overflow-hidden pb-20">
      {/* Background elegant architectural line details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e2db_1px,transparent_1px),linear-gradient(to_bottom,#e5e2db_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10"></div>
      
      {/* Soft bright warm ambient glows */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-4.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-3 transition-all animate-bounce ${
          toast.type === "success" 
            ? "bg-white/95 border-emerald-200 text-emerald-800" 
            : "bg-white/95 border-rose-200 text-rose-800"
        }`}>
          <span className="text-lg leading-none">
            {toast.type === "success" ? <Check className="w-5 h-5 text-emerald-600" /> : <Info className="w-5 h-5 text-rose-600" />}
          </span>
          <p className="text-xs font-black">{toast.message}</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-bold text-emerald-800">
            <Award className="w-3.5 h-3.5" />
            <span>Papan Peringkat Dedikasi Warga</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
            Transparansi Kontribusi <span className="text-emerald-700">Warga Berdaulat</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-medium">
            Menampilkan warga ter-dedikatif berdasarkan skor reputasi deterministik tanpa didasarkan pada sekat status finansial atau kekayaan. Menjunjung tinggi kebersamaan dan andil nyata di lingkungan komunitas RT/RW.
          </p>
        </div>
      </section>

      {/* Grid Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Top Podium & Contributors Table & Social Feed (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top 3 Podium Card Blocks */}
          {contributors.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 items-end pt-6 pb-2">
              {/* 2nd Place (Left) */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 rounded-full bg-zinc-100 border-2 border-zinc-300 flex items-center justify-center text-zinc-600 shadow-md font-bold text-sm uppercase">
                  {topThree[1].profiles?.full_name ? topThree[1].profiles.full_name.substring(0, 2) : "W2"}
                  <div className="absolute -bottom-2 bg-zinc-300 border border-zinc-400 text-[9px] font-black text-zinc-800 px-2 py-0.5 rounded-full shadow-sm">
                    2ND
                  </div>
                </div>
                <div className="w-full mt-4 bg-white border border-outline-variant rounded-t-2xl p-4 text-center shadow-sm h-32 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-zinc-800 truncate">{topThree[1].profiles?.full_name}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{topThree[1].role}</p>
                  </div>
                  <div className="text-sm font-black text-zinc-700 bg-zinc-100/60 py-1.5 rounded-xl border border-zinc-200/80 font-mono">
                    {topThree[1].reputation_score} pts
                  </div>
                </div>
              </div>

              {/* 1st Place (Middle - Taller) */}
              <div className="flex flex-col items-center z-10 scale-105">
                <div className="relative w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-lg font-bold text-base uppercase">
                  {topThree[0].profiles?.full_name ? topThree[0].profiles.full_name.substring(0, 2) : "W1"}
                  <div className="absolute -top-3 text-amber-500 animate-bounce duration-[3000ms]">
                    <Trophy className="w-6 h-6 fill-amber-300 text-amber-500" />
                  </div>
                  <div className="absolute -bottom-2.5 bg-amber-400 border border-amber-500 text-[10px] font-black text-zinc-950 px-2.5 py-0.5 rounded-full shadow-sm">
                    1ST
                  </div>
                </div>
                <div className="w-full mt-4 bg-white border-2 border-amber-300 rounded-t-2xl p-4.5 text-center shadow-md h-40 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-zinc-900 truncate">{topThree[0].profiles?.full_name}</p>
                    <p className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50 inline-block uppercase tracking-wider">{topThree[0].role}</p>
                  </div>
                  <div className="text-base font-black text-amber-800 bg-amber-500/10 py-2 rounded-xl border border-amber-300 font-mono">
                    {topThree[0].reputation_score} pts
                  </div>
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 rounded-full bg-amber-50/40 border-2 border-amber-600/30 flex items-center justify-center text-amber-800 shadow-md font-bold text-sm uppercase">
                  {topThree[2].profiles?.full_name ? topThree[2].profiles.full_name.substring(0, 2) : "W3"}
                  <div className="absolute -bottom-2 bg-amber-600/20 border border-amber-600/30 text-[9px] font-black text-amber-900 px-2 py-0.5 rounded-full shadow-sm">
                    3RD
                  </div>
                </div>
                <div className="w-full mt-4 bg-white border border-outline-variant rounded-t-2xl p-4 text-center shadow-sm h-28 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-zinc-800 truncate">{topThree[2].profiles?.full_name}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{topThree[2].role}</p>
                  </div>
                  <div className="text-sm font-black text-amber-800 bg-amber-500/5 py-1 rounded-xl border border-amber-200/40 font-mono">
                    {topThree[2].reputation_score} pts
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List Contributors Table */}
          <div className="rounded-3xl border border-outline-variant bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-zinc-900">Penggerak Dedikatif Komunitas</h2>
                <p className="text-xs text-zinc-500 font-semibold mt-0.5">Warga paling andil dalam gotong-royong di lingkungan RT 01 Kalisari</p>
              </div>
              <span className="self-start sm:self-center text-[10px] font-black bg-primary/5 text-primary px-3.5 py-1.5 rounded-full border border-primary/20 tracking-wider">
                RT 01 KALISARI
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-zinc-400 space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                <p className="text-xs font-semibold">Memuat reputasi dari database berdaulat...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contributors.map((c, index) => {
                  const name = c.profiles?.full_name || "Warga Komunitas";
                  const score = c.reputation_score;
                  const role = c.role.toUpperCase();
                  const phone = c.profiles?.phone ? `+${c.profiles.phone.substring(0, 5)}***` : "No Phone";
                  
                  // Rank labels and colors
                  const rankLabels = ["1ST", "2ND", "3RD", "4TH", "5TH"];
                  const rankBadgeClass = index === 0 
                    ? "bg-amber-400 text-zinc-950 font-black"
                    : index === 1
                    ? "bg-zinc-300 text-zinc-800 font-black"
                    : index === 2
                    ? "bg-amber-600/20 text-amber-800 border border-amber-600/30 font-black"
                    : "bg-surface-container text-zinc-500 border border-outline-variant";

                  return (
                    <div 
                      key={c.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-outline-variant bg-white hover:shadow-md hover:border-outline/40 transition-all duration-300 gap-4 group ${
                        c.id === selectedReferrer ? "border-primary bg-primary/5 shadow-sm" : ""
                      }`}
                    >
                      {/* Rank & User Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] tracking-wider font-bold shadow-sm shrink-0 ${rankBadgeClass}`}>
                          {rankLabels[index] || `${index + 1}TH`}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-zinc-900 group-hover:text-primary transition-colors text-sm">
                              {name}
                            </span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                              c.role === 'pengurus' 
                                ? 'bg-purple-50 text-purple-700 border border-purple-200/50' 
                                : 'bg-primary/5 text-primary border border-primary/20'
                            }`}>
                              {role}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-semibold font-mono">ID Warga: {phone}</span>
                        </div>
                      </div>

                      {/* Reputasi Score & Selector Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                        <div>
                          <div className="text-[9px] uppercase text-zinc-400 font-bold tracking-wider mb-0.5">Skor Reputasi</div>
                          <div className="text-lg font-black text-zinc-900 font-mono">{score} <span className="text-xs text-primary font-normal">pts</span></div>
                        </div>
                        
                        {/* Interactive selection helper */}
                        <button
                          onClick={() => setSelectedReferrer(c.id)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm ${
                            selectedReferrer === c.id 
                              ? "bg-primary text-white" 
                              : "bg-surface border border-outline-variant text-zinc-600 hover:bg-surface-container hover:text-zinc-900"
                          }`}
                        >
                          {selectedReferrer === c.id ? "Terpilih" : "Pilih Perujuk"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Social Proof (Live Feed logs) */}
          <div className="rounded-3xl border border-outline-variant bg-white p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-zinc-900">Dynamic Social Proof</h2>
              <p className="text-xs text-zinc-500 font-semibold">Log perubahan reputasi nyata yang diverifikasi secara realtime melalui otorisasi RLS</p>
            </div>

            {loading ? (
              <div className="py-6 text-center text-zinc-400 text-xs font-semibold">Memuat log aktivitas...</div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const isPositive = log.pointChange.startsWith("+");
                  return (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-outline-variant text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-base leading-none ${isPositive ? "text-primary" : "text-rose-600"}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4 text-primary" /> : <Info className="w-4 h-4 text-rose-600" />}
                        </span>
                        <div>
                          <p className="text-zinc-700 font-medium text-xs">
                            <strong className="text-zinc-900 font-black">{log.actorName}</strong> {log.description}
                          </p>
                          <span className="text-[9px] text-zinc-400 font-bold font-mono">
                            {new Date(log.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} • UTC+7
                          </span>
                        </div>
                      </div>
                      <span className={`font-mono font-black px-2.5 py-1 rounded text-xs border ${
                        isPositive ? "bg-primary/5 text-primary border-primary/20" : "bg-rose-50 text-rose-700 border-rose-200"
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
          <div className="rounded-3xl border border-outline-variant bg-white p-6 space-y-6 shadow-sm sticky top-24">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/20 text-[10px] font-black text-primary tracking-wider uppercase">
                🧪 Core Simulator
              </div>
              <h2 className="text-lg font-black text-zinc-900">Referral Loop Engine</h2>
              <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                Uji fungsionalitas rujukan finansial warga. Di URUN, rujukan tender menghasilkan skor reputasi (+2 poin), bukan uang adiktif, mempromosikan aksi gotong-royong.
              </p>
            </div>

            {/* Referrer Selector state display */}
            {selectedReferrer ? (
              <div className="p-4.5 rounded-2xl bg-[#F5F3EF]/40 border border-zinc-200/80 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Perujuk Terpilih (Warga A)</span>
                  <div className="font-extrabold text-zinc-900 text-sm flex items-center gap-1">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span>{getReferrerName()}</span>
                  </div>
                </div>

                {/* Simulated Link copy panel */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">WhatsApp Referral Link</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={getReferralUrl()}
                      className="bg-white border border-zinc-200 px-3 py-2 rounded-xl text-[10px] font-mono text-zinc-500 flex-1 outline-none select-all font-semibold"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-black text-white active:scale-95 transition-transform"
                    >
                      {copied ? "Done" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                  Bagikan tautan rujukan di atas ke Warga B. Begitu Warga B berkontribusi pada tender melalui tautan rujukan tersebut, Warga A otomatis mendapatkan reputasi.
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#F5F3EF]/40 border border-zinc-200/80 text-center text-xs text-zinc-500 font-semibold">
                Silakan pilih salah satu warga di papan peringkat sebelah kiri untuk memulai simulasi rujukan.
              </div>
            )}

            {/* Action Simulator Button */}
            <button 
              disabled={!selectedReferrer || simulating}
              onClick={handleSimulateContribution}
              className="w-full py-3.5 px-4 rounded-2xl bg-primary text-white font-black hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-primary/10 text-xs uppercase tracking-wider"
            >
              {simulating ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border border-white border-t-transparent animate-spin"></div>
                  Memproses Log...
                </>
              ) : (
                <>
                  🚀 Simulasikan Kontribusi Warga B
                </>
              )}
            </button>

            {/* Technical Context audit info */}
            <div className="p-4.5 rounded-2xl bg-surface border border-outline-variant text-[10px] space-y-2.5 font-mono text-zinc-500">
              <div className="text-zinc-850 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Under The Hood (Sovereign Core):</span>
              </div>
              <p className="leading-relaxed">Memicu API POST `/api/simulator/referral` yang menulis log `successful_referral` di database Supabase.</p>
              <p className="leading-relaxed">Trigger `reputation_engine_trigger` di Postgres menghitung:</p>
              <pre className="text-emerald-700 text-[9px] bg-[#F5F3EF]/80 p-2.5 rounded-xl overflow-x-auto border border-zinc-200">
{`C_successful_referral = +2
UPDATE community_members
SET reputation_score = reputation_score + 2
WHERE id = actor_id;`}
              </pre>
            </div>
            
          </div>
        </div>

      </main>
    </div>
  );
}
