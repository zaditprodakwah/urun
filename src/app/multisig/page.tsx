"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Tender {
  id: string;
  title: string;
  description: string;
}

interface Profile {
  full_name: string;
  phone: string;
}

interface CommunityMember {
  id: string;
  profiles: Profile;
}

interface Approval {
  member_id: string;
  approved_at: string;
  signature: string;
  full_name: string;
}

interface MultisigRequest {
  id: string;
  community_id: string;
  ledger_ref_id: string | null;
  tender_id: string;
  amount: number;
  requested_by: string;
  required_sigs: number;
  current_sigs: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvals: Approval[];
  expires_at: string;
  created_at: string;
  tenders: Tender | null;
  community_members: CommunityMember | null;
}

const SIGNERS = [
  { id: "2ad229ff-afc8-4cc0-9cf5-a5de39c8e0d6", name: "Zadit Prodakwah", role: "Treasurer / Chief Pengurus" },
  { id: "ecd953af-3569-4d4d-a57e-1bd1aee655e5", name: "Siti Aminah", role: "Witness 1 / Pengurus" },
  { id: "33123870-c7f6-47f9-b559-5927f6361e5c", name: "Budi Santoso", role: "Witness 2 / Pengurus" }
];

export default function MultisigDashboard() {
  const [requests, setRequests] = useState<MultisigRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSignerId, setActiveSignerId] = useState(SIGNERS[0].id);
  const [simulating, setSimulating] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  
  interface Anomaly {
    type: string;
    ledgerId: string;
    details: string;
  }

  // Alert/Notification State
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Reconciliation State
  const [reconResult, setReconResult] = useState<{
    ran: boolean;
    success: boolean;
    totalSettlements: number;
    anomaliesFound: number;
    anomalies: Anomaly[];
  } | null>(null);

  const showGlobalAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 6000);
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/multisig/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      } else {
        showGlobalAlert('error', 'Gagal memuat daftar permintaan Multi-Sig.');
      }
    } catch (err) {
      console.error(err);
      showGlobalAlert('error', 'Kesalahan koneksi saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      await Promise.resolve();
      if (mounted) {
        await fetchRequests();
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSimulateOutflow = async () => {
    try {
      setSimulating(true);
      const res = await fetch("/api/multisig/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 7500000 })
      });

      const data = await res.json();
      if (res.ok) {
        showGlobalAlert('success', `Simulasi Berhasil: Permintaan pengadaan sebesar Rp 7.500.000 dialihkan ke antrean Multi-Sig.`);
        fetchRequests();
      } else {
        showGlobalAlert('error', data.error || 'Gagal mensimulasikan transaksi.');
      }
    } catch (err) {
      console.error(err);
      showGlobalAlert('error', 'Kesalahan koneksi saat memicu simulasi.');
    } finally {
      setSimulating(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setActionLoadingId(requestId);
      const res = await fetch("/api/multisig/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          memberId: activeSignerId
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.status === 'approved') {
          showGlobalAlert('success', `Sukses! Kuorum tercapai (${data.currentSigs}/${data.requiredSigs}). Dana resmi dicairkan ke supplier.`);
        } else {
          showGlobalAlert('success', `Tanda tangan Anda berhasil dicatat! Progres konsensus: ${data.currentSigs}/${data.requiredSigs}.`);
        }
        fetchRequests();
      } else {
        showGlobalAlert('error', data.error || 'Gagal menyetujui transaksi.');
      }
    } catch (err) {
      console.error(err);
      showGlobalAlert('error', 'Kesalahan koneksi saat menandatangani.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRunReconciliation = async () => {
    try {
      setSimulating(true);
      const res = await fetch("/api/multisig/reconcile", {
        method: "POST"
      });

      const data = await res.json();
      if (res.ok) {
        setReconResult({
          ran: true,
          success: data.success,
          totalSettlements: data.totalSettlementsChecked,
          anomaliesFound: data.anomaliesFound,
          anomalies: data.anomalies || []
        });
        showGlobalAlert('success', data.success 
          ? 'Reconciliation audit selesai: Tidak ditemukan selisih finansial (100% Cocok!).'
          : `Reconciliation audit selesai: Ditemukan ${data.anomaliesFound} kejanggalan saldo kas!`
        );
      } else {
        showGlobalAlert('error', data.error || 'Gagal menjalankan audit rekonsiliasi.');
      }
    } catch (err) {
      console.error(err);
      showGlobalAlert('error', 'Kesalahan koneksi saat melakukan audit rekonsiliasi.');
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const activeSigner = SIGNERS.find(s => s.id === activeSignerId);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Glow Ambient */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
              <span className="text-xl font-bold text-zinc-950">U</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors">URUN</Link>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  FINANCIAL GUARDRAILS
                </span>
              </div>
              <p className="text-xs text-zinc-400">Sovereign Financial Autonomy & Multi-Sig Panel</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">← Simulator WA</Link>
            <Link href="/catalog" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Etalase Publik</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Global Notifications Alert Banner */}
        {alert && (
          <div className={`p-4 rounded-xl border animate-fade-in flex items-start gap-3 shadow-xl ${
            alert.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300' 
              : alert.type === 'error'
              ? 'bg-red-950/40 border-red-500/20 text-red-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}>
            <span className="text-lg">{alert.type === 'success' ? '✅' : alert.type === 'error' ? '❌' : 'ℹ️'}</span>
            <div className="text-sm font-medium">{alert.message}</div>
          </div>
        )}

        {/* Dashboard Introduction Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
              Sovereign Autonomy Enforced
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Multi-Sig Command Center
            </h2>
            <p className="text-zinc-400 leading-relaxed text-sm max-w-3xl">
              Untuk melindungi kas komunitas dari risiko kecurangan keuangan, pengeluaran pengadaan barang bernilai besar (nominal <span className="text-emerald-400 font-semibold">&gt;= Rp 5.000.000</span>) dialihkan secara paksa dari pengisian kas langsung menuju antrean konsensus digital. Buku Kas Kolektif (Ledger) hanya dapat mencatatkan mutasi final secara otomatis begitu kuorum pengurus terpenuhi secara berdaulat.
            </p>
          </div>

          <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl space-y-4 shadow-xl backdrop-blur-sm">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>🔧</span> CONTROL PANEL & SIMULATION
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">SIMULATE ACTIVE SIGNER AS:</label>
                <select 
                  value={activeSignerId}
                  onChange={(e) => setActiveSignerId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  {SIGNERS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleSimulateOutflow}
                  disabled={simulating}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-zinc-950 text-xs font-extrabold hover:from-emerald-500 hover:to-emerald-300 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center"
                >
                  {simulating ? "Simulating..." : "Simulate Outflow (Rp 7.5M)"}
                </button>
                
                <button
                  onClick={handleRunReconciliation}
                  disabled={simulating}
                  className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-bold hover:border-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center"
                >
                  {simulating ? "Auditing..." : "Run Ledger Audit 🔍"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ledger Reconciliation Audit Output Visual */}
        {reconResult?.ran && (
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>🛡️</span> HASIL AUDIT REKONSILIASI MANDIRI
              </h3>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                reconResult.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {reconResult.success ? '100% INTEGRITAS TERJAGA' : 'DISCREPANCY ALERTS FOUND'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850">
                <div className="text-zinc-500 text-xs font-semibold mb-0.5">Tender Settlement Diaudit</div>
                <div className="text-2xl font-bold text-white">{reconResult.totalSettlements} Transaksi</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850">
                <div className="text-zinc-500 text-xs font-semibold mb-0.5">Jumlah Kejanggalan/Anomali</div>
                <div className={`text-2xl font-bold ${reconResult.anomaliesFound > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {reconResult.anomaliesFound} Masalah
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850">
                <div className="text-zinc-500 text-xs font-semibold mb-0.5">Metode Perbaikan Diizinkan</div>
                <div className="text-xs font-bold text-zinc-400 mt-1">correction_entry (Append-only Reversal)</div>
              </div>
            </div>

            {reconResult.anomalies.length > 0 && (
              <div className="space-y-2 mt-4">
                <div className="text-xs font-bold text-red-400">Rincian Anomali Keuangan:</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {reconResult.anomalies.map((a, i) => (
                    <div key={i} className="p-3 bg-red-950/20 border border-red-900/20 rounded-lg text-xs text-red-300">
                      <strong>[{a.type.toUpperCase()}]</strong> Ledger ID: ...{a.ledgerId.slice(-8)} — {a.details}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Multi-Sig Pending Requests Queue */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📂</span> Antrean Persetujuan Warga ({requests.length})
            </h3>
            <button 
              onClick={fetchRequests} 
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800"
            >
              <span>🔄</span> Refresh Antrean
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-zinc-500 text-sm animate-pulse">
              Memuat data antrean Multi-Sig dari database berdaulat...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-24 bg-zinc-900/20 border border-zinc-900 rounded-2xl text-zinc-500 text-sm space-y-3">
              <div className="text-3xl">📭</div>
              <div>Tidak ada permintaan Multi-Sig pending dalam sistem saat ini.</div>
              <button 
                onClick={handleSimulateOutflow} 
                className="mt-2 text-xs font-bold text-emerald-400 hover:underline"
              >
                Picu simulasi nominal besar untuk membuat permintaan ➔
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((req) => {
                const isApproved = req.status === 'approved';
                const isExpired = req.status === 'expired';
                
                // 70% community share / 30% platform fee calculation
                const communityShare = req.amount * 0.7;
                const platformFee = req.amount * 0.3;

                // Signer approval check
                const signedByMe = req.approvals.some(app => app.member_id === activeSignerId);

                // Progress Percentage
                const progressPct = (req.current_sigs / req.required_sigs) * 100;

                return (
                  <div 
                    key={req.id} 
                    className={`flex flex-col bg-zinc-900/70 border rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                      isApproved 
                        ? 'border-emerald-500/30 bg-gradient-to-b from-zinc-900 to-emerald-950/10' 
                        : isExpired
                        ? 'border-red-500/10 opacity-70 bg-zinc-950'
                        : 'border-zinc-800 hover:border-emerald-500/20'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-zinc-850 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-mono tracking-wider">REQUEST ID: ...{req.id.slice(-12)}</div>
                        <h4 className="text-lg font-bold text-white leading-tight">
                          {req.tenders?.title || "Pengeluaran Kas Komunitas"}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {req.tenders?.description || "Simulasi pengadaan barang RT."}
                        </p>
                      </div>
                      
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase ${
                        isApproved 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-glow' 
                          : isExpired
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {/* Transaction Amount Detail */}
                    <div className="px-6 py-4 bg-zinc-950/40 border-b border-zinc-850/80 flex items-center justify-between">
                      <div className="text-xs text-zinc-500 font-semibold">Total Pencairan Warga:</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">
                        {formatCurrency(req.amount)}
                      </div>
                    </div>

                    {/* 70/30 Split Transparency Visualizer */}
                    <div className="p-6 border-b border-zinc-850 space-y-3 bg-zinc-950/20">
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        <span>🛡️ TRANSPARANSI ALIRAN DANA</span>
                        <span className="text-emerald-400 font-black">70/30 RULE</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                          <div className="text-[10px] text-zinc-500 font-bold mb-0.5"> Treasury Komunitas (70%)</div>
                          <div className="text-sm font-extrabold text-white font-mono">{formatCurrency(communityShare)}</div>
                          <div className="text-[9px] text-emerald-400 mt-1">Simpul Komunitas RT</div>
                        </div>

                        <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                          <div className="text-[10px] text-zinc-500 font-bold mb-0.5">Biaya Platform URUN (30%)</div>
                          <div className="text-sm font-extrabold text-white font-mono">{formatCurrency(platformFee)}</div>
                          <div className="text-[9px] text-zinc-400 mt-1">URUN Ops (0% Peduli Warga)</div>
                        </div>
                      </div>
                    </div>

                    {/* Consensus Progress Bar & Signatures list */}
                    <div className="p-6 flex-1 space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-white">
                          <span>Progres Konsensus Pengurus</span>
                          <span className="text-emerald-400">{req.current_sigs} / {req.required_sigs} Tanda Tangan</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-850 relative">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-glow"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Signers and Approvals detail */}
                      <div className="space-y-2 pt-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tanda Tangan Terkumpul:</div>
                        {req.approvals.length === 0 ? (
                          <div className="text-xs text-zinc-500 italic">Belum ada pengurus yang menandatangani.</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {req.approvals.map((app, idx) => (
                              <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-850 text-[10px] text-zinc-300 font-mono">
                                <span className="text-emerald-400">✍️</span>
                                <strong className="text-white">{app.full_name}</strong>
                                <span className="text-zinc-500 text-[9px]">({app.signature})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Bottom */}
                    <div className="p-6 border-t border-zinc-850/80 bg-zinc-950/30 flex items-center justify-between gap-4 rounded-b-2xl">
                      <div className="text-[10px] text-zinc-500 flex flex-col">
                        <span>Batas Konsensus:</span>
                        <strong className="text-zinc-400 font-mono">{new Date(req.expires_at).toLocaleString("id-ID")}</strong>
                      </div>

                      {isApproved ? (
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <span>🛡️</span> Ledg_Ref: ...{req.ledger_ref_id?.slice(-8)}
                        </div>
                      ) : isExpired ? (
                        <div className="text-xs font-bold text-red-500">EXPIRED</div>
                      ) : (
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={actionLoadingId === req.id || signedByMe}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                            signedByMe 
                              ? 'bg-zinc-900 border border-zinc-850 text-zinc-500' 
                              : 'bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-lg shadow-emerald-500/10'
                          }`}
                        >
                          {actionLoadingId === req.id 
                            ? "Signing..." 
                            : signedByMe 
                            ? "SIGNED (Sudah Disetujui)" 
                            : `SIGN AS ${activeSigner?.name?.split(' ')[0].toUpperCase()}`
                          }
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 URUN Warga. Sistem Keuangan Kolektif Terdesentralisasi.</p>
          <p className="mt-1 text-[10px] text-zinc-600 font-mono">Row-Level Security (RLS) & Stored Procedure Ledger Isolation Enforced.</p>
        </div>
      </footer>

    </div>
  );
}
