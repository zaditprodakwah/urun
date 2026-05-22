"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Users, 
  Terminal, 
  Info,
  Check,
  TrendingUp,
  Award,
  Copy,
  Activity
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
    <div className="min-h-screen bg-[#FCFBF9] text-[#131b2e] font-sans selection:bg-[#10b981]/20 relative overflow-hidden pb-24">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-3 transition-all animate-bounce ${
          toast.type === "success" 
            ? "bg-white/95 border-[#bbcabf] text-[#006c49]" 
            : "bg-white/95 border-red-200 text-red-800"
        }`}>
          <span className="text-lg leading-none">
            {toast.type === "success" ? <Check className="w-5 h-5 text-emerald-600" /> : <Info className="w-5 h-5 text-red-600" />}
          </span>
          <p className="text-xs font-black">{toast.message}</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 border border-[#006c49]/20 text-[10px] font-black uppercase tracking-wider text-[#006c49]">
            <Award className="w-3.5 h-3.5" />
            <span>Papan Reputasi &amp; Kontribusi Warga</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#131b2e] leading-tight">
            Pahlawan Lokal <span className="text-[#006c49]">Gotong Royong</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-2xl">
            Apresiasi nyata bagi seluruh warga yang paling aktif dalam gotong-royong bertetangga. Skor Poin Gotong Royong (Civic Points) dihitung secara transparan dan adil untuk menghargai setiap kepedulian Anda.
          </p>
        </div>
      </section>

      {/* Grid Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Top Podium & Contributors List & Social Feed (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top 3 Podium Card Blocks */}
          {contributors.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-6 pb-2">
              
              {/* 2nd Place (Left) */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-zinc-100 border-2 border-zinc-300 flex items-center justify-center text-zinc-600 shadow-md font-extrabold text-xs sm:text-sm uppercase">
                  {topThree[1].profiles?.full_name ? topThree[1].profiles.full_name.substring(0, 2) : "W2"}
                  <div className="absolute -bottom-2 bg-zinc-300 border border-zinc-400 text-[8px] sm:text-[9px] font-black text-zinc-800 px-2 py-0.5 rounded-full shadow-sm">
                    #2
                  </div>
                </div>
                <div className="w-full mt-4 bg-white border border-[#bbcabf]/50 rounded-t-2xl p-3 sm:p-5 text-center shadow-sm h-32 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] sm:text-xs font-black text-zinc-800 truncate">{topThree[1].profiles?.full_name}</p>
                    <p className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-wider truncate">{topThree[1].role}</p>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-zinc-700 bg-zinc-100/60 py-1.5 rounded-xl border border-zinc-200/80 font-mono">
                    {topThree[1].reputation_score} CP
                  </div>
                </div>
              </div>

              {/* 1st Place (Middle - Taller) */}
              <div className="flex flex-col items-center z-10 scale-105">
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-lg font-extrabold text-sm sm:text-base uppercase">
                  {topThree[0].profiles?.full_name ? topThree[0].profiles.full_name.substring(0, 2) : "W1"}
                  <div className="absolute -top-3 text-amber-500 animate-bounce duration-[3000ms]">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300 text-amber-500" />
                  </div>
                  <div className="absolute -bottom-2.5 bg-amber-400 border border-amber-500 text-[9px] sm:text-[10px] font-black text-zinc-950 px-2.5 py-0.5 rounded-full shadow-sm">
                    #1
                  </div>
                </div>
                <div className="w-full mt-4 bg-white border-2 border-amber-300 rounded-t-2xl p-3 sm:p-6 text-center shadow-md h-36 sm:h-44 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-black text-zinc-900 truncate">{topThree[0].profiles?.full_name}</p>
                    <p className="text-[8px] sm:text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50 inline-block uppercase tracking-wider">{topThree[0].role}</p>
                  </div>
                  <div className="text-sm sm:text-base font-black text-amber-800 bg-amber-500/10 py-1.5 sm:py-2 rounded-xl border border-amber-300 font-mono">
                    {topThree[0].reputation_score} CP
                  </div>
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-50/40 border-2 border-amber-600/30 flex items-center justify-center text-amber-800 shadow-md font-extrabold text-xs sm:text-sm uppercase">
                  {topThree[2].profiles?.full_name ? topThree[2].profiles.full_name.substring(0, 2) : "W3"}
                  <div className="absolute -bottom-2 bg-amber-600/20 border border-amber-600/30 text-[8px] sm:text-[9px] font-black text-amber-900 px-2 py-0.5 rounded-full shadow-sm">
                    #3
                  </div>
                </div>
                <div className="w-full mt-4 bg-white border border-[#bbcabf]/50 rounded-t-2xl p-3 sm:p-5 text-center shadow-sm h-28 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text--[10px] sm:text-xs font-black text-zinc-800 truncate">{topThree[2].profiles?.full_name}</p>
                    <p className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-wider truncate">{topThree[2].role}</p>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-amber-800 bg-amber-500/5 py-1 rounded-xl border border-amber-200/40 font-mono">
                    {topThree[2].reputation_score} CP
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List Contributors Table */}
          <div className="rounded-3xl border border-[#bbcabf]/40 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-[#131b2e]">Penggerak Dedikatif Warga</h2>
                <p className="text-xs text-zinc-500 font-semibold mt-0.5">Daftar kontributor ter-aktif di lingkungan komunitas</p>
              </div>
              <span className="self-start sm:self-center text-[10px] font-black bg-[#006c49]/5 text-[#006c49] px-3 py-1 rounded-full border border-[#006c49]/20 tracking-wider">
                RT 01 KALISARI
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-zinc-400 space-y-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#006c49] border-t-transparent animate-spin mx-auto"></div>
                <p className="text-xs font-semibold">Menghubungkan ke database berdaulat...</p>
              </div>
            ) : (
              <div className="space-y-2.5">
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
                    ? "bg-amber-600/20 text-amber-900 border border-amber-600/30 font-black"
                    : "bg-zinc-50 text-zinc-500 border border-[#bbcabf]/30";

                  return (
                    <div 
                      key={c.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 gap-4 group ${
                        c.id === selectedReferrer 
                          ? "border-[#006c49] bg-[#006c49]/5 shadow-sm" 
                          : "border-[#bbcabf]/30 bg-white hover:border-[#bbcabf]/80"
                      }`}
                    >
                      {/* Rank & User Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[9px] tracking-wider font-black shadow-sm shrink-0 ${rankBadgeClass}`}>
                          {rankLabels[index] || `${index + 1}TH`}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#131b2e] group-hover:text-[#006c49] transition-colors text-sm">
                              {name}
                            </span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider ${
                              c.role === 'pengurus' 
                                ? 'bg-purple-50 text-purple-700 border border-purple-200/50' 
                                : 'bg-[#006c49]/5 text-[#006c49] border border-[#006c49]/20'
                            }`}>
                              {role}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">Verifikasi: {phone} • Kalisari</span>
                        </div>
                      </div>

                      {/* Reputasi Score & Selector Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                        <div>
                          <div className="text-[9px] uppercase text-zinc-400 font-bold tracking-wider mb-0.5">Civic Points</div>
                          <div className="text-base font-black text-[#131b2e] font-mono">{score} <span className="text-xs text-[#006c49] font-normal">CP</span></div>
                        </div>
                        
                        <button
                          onClick={() => setSelectedReferrer(c.id)}
                          className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all min-h-[38px] ${
                            selectedReferrer === c.id 
                              ? "bg-[#006c49] text-white hover:bg-[#005236]" 
                              : "bg-[#FCFBF9] border border-[#bbcabf] text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          {selectedReferrer === c.id ? "Perujuk" : "Pilih"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Social Proof (Live Feed logs) */}
          <div className="rounded-3xl border border-[#bbcabf]/40 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-[#131b2e] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#006c49]" /> Riwayat Keaktifan Warga (Langsung)
              </h2>
              <p className="text-xs text-zinc-500 font-semibold">Catatan terbuka penambahan skor gotong royong warga</p>
            </div>

            {loading ? (
              <div className="py-6 text-center text-zinc-400 text-xs font-semibold">Memuat log aktivitas...</div>
            ) : (
              <div className="space-y-2.5">
                {logs.slice(0, 5).map((log) => {
                  const isPositive = log.pointChange.startsWith("+");
                  return (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#FCFBF9] border border-[#bbcabf]/30 text-xs hover:border-[#bbcabf]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-base leading-none ${isPositive ? "text-[#006c49]" : "text-red-600"}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4 text-[#006c49]" /> : <Info className="w-4 h-4 text-red-600" />}
                        </span>
                        <div>
                          <p className="text-zinc-700 font-medium text-xs leading-normal">
                            <strong className="text-[#131b2e] font-black">{log.actorName}</strong> {log.description}
                          </p>
                          <span className="text-[9px] text-zinc-400 font-bold font-mono">
                            {new Date(log.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} • UTC+7
                          </span>
                        </div>
                      </div>
                      <span className={`font-mono font-black px-2.5 py-1 rounded text-xs border ${
                        isPositive ? "bg-emerald-50 text-[#006c49] border-emerald-200/50" : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {log.pointChange} CP
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
          <div className="rounded-3xl border border-[#bbcabf]/50 bg-white p-6 space-y-6 shadow-sm sticky top-24">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#006c49]/5 border border-[#006c49]/20 text-[10px] font-black text-[#006c49] tracking-wider uppercase">
                🧪 Simulasi Ajak Warga
              </div>
              <h2 className="text-base font-extrabold text-[#131b2e]">Ajak Tetangga Ikut Urunan</h2>
              <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                Uji coba simulasi ketika tetangga yang Anda ajak berhasil ikut iuran gotong-royong. Di URUN, mengajak tetangga akan meningkatkan Poin Gotong Royong Anda sebesar +2 poin, memicu semangat partisipasi sosial yang sehat.
              </p>
            </div>

            {/* Referrer Selector state display */}
            {selectedReferrer ? (
              <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#bbcabf]/40 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Perujuk Warga (A)</span>
                  <div className="font-extrabold text-[#131b2e] text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#006c49]" />
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
                      className="bg-white border border-[#bbcabf]/50 px-3 py-2 rounded-xl text-[10px] font-mono text-zinc-500 flex-1 outline-none select-all font-semibold"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-black text-white active:scale-95 transition-transform"
                    >
                      {copied ? "Selesai" : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                  Klik tombol di bawah untuk menyimulasikan Warga B melakukan pembelanjaan tender semen menggunakan rujukan ini.
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#FCFBF9] border border-dashed border-[#bbcabf] text-center text-xs text-zinc-400 font-semibold">
                Silakan pilih salah satu warga di papan peringkat untuk mengaktifkan simulator rujukan.
              </div>
            )}

            {/* Action Simulator Button */}
            <button 
              disabled={!selectedReferrer || simulating}
              onClick={handleSimulateContribution}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#006c49] hover:bg-[#005236] text-white font-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#006c49]/10 text-xs uppercase tracking-wider min-h-[46px]"
            >
              {simulating ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Memproses Core...
                </>
              ) : (
                <>
                  🚀 Simulasikan Rujukan Sukses
                </>
              )}
            </button>

            {/* Technical Context audit info */}
            <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#bbcabf]/40 text-[9px] space-y-2 text-zinc-500 leading-relaxed">
              <div className="text-zinc-800 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-200 pb-1.5 mb-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-[#006c49]" />
                <span>Sistem Transparansi URUN:</span>
              </div>
              <p className="font-semibold text-xs">Sistem otomatis menambahkan <span className="font-bold text-[#006c49]">+2 Poin Gotong Royong</span> untuk Anda setiap kali ada warga (yang Anda ajak) berhasil menyelesaikan pembayaran iuran atau ikut patungan.</p>
              <p className="font-semibold">Buku kas dan poin ini dijamin oleh keamanan sistem sehingga tidak bisa dimanipulasi atau diubah secara sepihak oleh pengurus mana pun.</p>
            </div>
            
          </div>
        </div>

      </main>

    </div>
  );
}
