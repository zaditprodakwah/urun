"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Wrench, 
  RotateCw, 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Search,
  ChevronRight
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#FCFBF9] text-zinc-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-800 relative overflow-hidden pb-20">
      {/* Background elegant architectural line details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e2db_1px,transparent_1px),linear-gradient(to_bottom,#e5e2db_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10"></div>
      
      {/* Soft bright warm ambient glows */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Global Notifications Alert Banner */}
        {alert && (
          <div className={`p-4.5 rounded-2xl border animate-fade-in flex items-start gap-3.5 shadow-md ${
            alert.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : alert.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-surface border-outline-variant text-on-surface'
          }`}>
            <span className="text-lg leading-none shrink-0 mt-0.5">
              {alert.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : alert.type === 'error' ? <XCircle className="w-5 h-5 text-red-600" /> : <Info className="w-5 h-5 text-zinc-600" />}
            </span>
            <div className="text-xs font-bold leading-normal">{alert.message}</div>
          </div>
        )}

        {/* Dashboard Introduction Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-bold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sovereign Autonomy Enforced</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
              Multi-Sig Command Center
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm max-w-3xl font-medium">
              Untuk melindungi kas komunitas dari risiko kecurangan keuangan, pengeluaran pengadaan barang bernilai besar (nominal <span className="text-emerald-700 font-bold">&gt;= Rp 5.000.000</span>) dialihkan secara paksa dari pengisian kas langsung menuju antrean konsensus digital. Buku Kas Kolektif (Ledger) hanya dapat mencatatkan mutasi final secara otomatis begitu kuorum pengurus terpenuhi secara berdaulat.
            </p>
          </div>

          <div className="lg:col-span-4 bg-white border border-outline-variant p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-black text-zinc-900 text-xs tracking-wider uppercase flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Control Panel & Simulation</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-1.5">SIMULATE ACTIVE SIGNER AS:</label>
                <select 
                  value={activeSignerId}
                  onChange={(e) => setActiveSignerId(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-3 text-xs text-zinc-900 font-bold focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {SIGNERS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSimulateOutflow}
                  disabled={simulating}
                  className="px-4 py-3 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-container transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center flex items-center justify-center"
                >
                  {simulating ? "Simulating..." : "Simulate Outflow"}
                </button>
                
                <button
                  onClick={handleRunReconciliation}
                  disabled={simulating}
                  className="px-4 py-3 rounded-xl bg-white border border-outline text-zinc-800 text-xs font-black hover:bg-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center flex items-center justify-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  {simulating ? "Auditing..." : "Ledger Audit"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ledger Reconciliation Audit Output Visual */}
        {reconResult?.ran && (
          <section className="bg-white border border-outline-variant p-6 rounded-3xl shadow-sm animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
              <h3 className="font-black text-zinc-900 text-xs tracking-wider uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hasil Audit Rekonsiliasi Mandiri</span>
              </h3>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border tracking-wide uppercase ${
                reconResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {reconResult.success ? '100% INTEGRITAS TERJAGA' : 'DISCREPANCY ALERTS FOUND'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F5F3EF]/60 border border-zinc-200/80">
                <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Tender Settlement Diaudit</div>
                <div className="text-2xl font-black text-zinc-900">{reconResult.totalSettlements} Transaksi</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F3EF]/60 border border-zinc-200/80">
                <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Jumlah Kejanggalan/Anomali</div>
                <div className={`text-2xl font-black ${reconResult.anomaliesFound > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {reconResult.anomaliesFound} Masalah
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F3EF]/60 border border-zinc-200/80">
                <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Metode Perbaikan Diizinkan</div>
                <div className="text-xs font-black text-zinc-600 mt-1 font-mono">correction_entry (Append Reversal)</div>
              </div>
            </div>

            {reconResult.anomalies.length > 0 && (
              <div className="space-y-2 mt-4">
                <div className="text-[10px] font-black tracking-wider uppercase text-red-700 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Rincian Anomali Keuangan:</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {reconResult.anomalies.map((a, i) => (
                    <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800">
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
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-5">
            <h3 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <Inbox className="w-6 h-6 text-primary" />
              <span>Antrean Persetujuan Warga ({requests.length})</span>
            </h3>
            <button 
              onClick={fetchRequests} 
              className="text-xs font-black text-primary hover:text-primary-container transition-all flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant shadow-sm"
            >
              <RotateCw className="w-3.5 h-3.5 animate-spin-hover" />
              <span>Refresh Antrean</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-24 text-zinc-400 text-sm font-semibold animate-pulse flex items-center justify-center gap-2">
              <RotateCw className="w-4 h-4 animate-spin text-primary" />
              <span>Memuat data antrean Multi-Sig dari database berdaulat...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-24 bg-white border border-outline-variant rounded-3xl text-zinc-500 text-sm space-y-4 max-w-xl mx-auto p-8 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-zinc-400">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-zinc-900">Tidak ada pengeluaran tertunda</h4>
                <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
                  Semua transaksi pengadaan warga sudah disetujui atau belum didelegasikan dalam nominal besar.
                </p>
              </div>
              <button 
                onClick={handleSimulateOutflow} 
                className="mt-2 text-xs font-black text-primary hover:text-primary-container inline-flex items-center gap-1"
              >
                Picu simulasi nominal besar
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    className={`flex flex-col bg-white border rounded-3xl shadow-sm hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-300 ${
                      isApproved 
                        ? 'border-primary bg-gradient-to-b from-white to-primary/5' 
                        : isExpired
                        ? 'border-outline-variant/60 opacity-60 bg-surface-container-low'
                        : 'border-outline-variant hover:border-primary/50'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-outline-variant/60 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[9px] text-zinc-400 font-mono tracking-wider">REQUEST ID: ...{req.id.slice(-12)}</div>
                        <h4 className="text-lg font-black text-zinc-900 leading-tight">
                          {req.tenders?.title || "Pengeluaran Kas Komunitas"}
                        </h4>
                        <p className="text-xs text-zinc-500 line-clamp-1 font-semibold">
                          {req.tenders?.description || "Simulasi pengadaan barang RT."}
                        </p>
                      </div>
                      
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border tracking-wide uppercase ${
                        isApproved 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : isExpired
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : 'bg-amber-50 border-amber-200 text-amber-800 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {/* Transaction Amount Detail */}
                    <div className="px-6 py-4.5 bg-[#F5F3EF]/40 border-b border-outline-variant/60 flex items-center justify-between">
                      <div className="text-xs text-zinc-500 font-bold">Total Pencairan Warga:</div>
                      <div className="text-xl font-black text-primary font-mono">
                        {formatCurrency(req.amount)}
                      </div>
                    </div>

                    {/* 70/30 Split Transparency Visualizer */}
                    <div className="p-6 border-b border-outline-variant/60 space-y-3 bg-[#F5F3EF]/10">
                      <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        <span>🛡️ Transparansi Aliran Dana</span>
                        <span className="text-primary font-black">70/30 RULE</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 bg-white border border-outline-variant rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                          <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Treasury Komunitas (70%)</div>
                          <div className="text-sm font-black text-zinc-900 font-mono">{formatCurrency(communityShare)}</div>
                          <div className="text-[9px] text-emerald-700 font-bold mt-1">Simpul Komunitas RT</div>
                        </div>

                        <div className="p-3.5 bg-white border border-outline-variant rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
                          <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Biaya Platform URUN (30%)</div>
                          <div className="text-sm font-black text-zinc-900 font-mono">{formatCurrency(platformFee)}</div>
                          <div className="text-[9px] text-zinc-500 font-semibold mt-1">URUN Ops (0% Peduli Warga)</div>
                        </div>
                      </div>
                    </div>

                    {/* Consensus Progress Bar & Signatures list */}
                    <div className="p-6 flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black text-zinc-800">
                          <span>Progres Konsensus Pengurus</span>
                          <span className="text-primary">{req.current_sigs} / {req.required_sigs} Tanda Tangan</span>
                        </div>
                        <div className="w-full bg-[#F5F3EF] h-2.5 rounded-full overflow-hidden border border-outline-variant/60 relative">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Signers and Approvals detail */}
                      <div className="space-y-2.5 pt-1">
                        <div className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Tanda Tangan Terkumpul:</div>
                        {req.approvals.length === 0 ? (
                          <div className="text-xs text-zinc-400 italic font-medium">Belum ada pengurus yang menandatangani.</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {req.approvals.map((app, idx) => (
                              <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface border border-outline-variant text-[10px] text-zinc-700 font-mono font-bold shadow-sm">
                                <span className="text-primary">✍️</span>
                                <strong className="text-zinc-900">{app.full_name}</strong>
                                <span className="text-zinc-400 text-[9px]">({app.signature})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Bottom */}
                    <div className="p-6 border-t border-outline-variant/60 bg-surface rounded-b-3xl flex items-center justify-between gap-4">
                      <div className="text-[10px] text-zinc-400 flex flex-col font-medium">
                        <span>Batas Konsensus:</span>
                        <strong className="text-zinc-700 font-mono font-black">{new Date(req.expires_at).toLocaleString("id-ID")}</strong>
                      </div>

                      {isApproved ? (
                        <div className="text-xs font-black text-emerald-700 flex items-center gap-1 font-mono">
                          <ShieldCheck className="w-4.5 h-4.5" />
                          <span>Ledger: ...{req.ledger_ref_id?.slice(-8)}</span>
                        </div>
                      ) : isExpired ? (
                        <div className="text-xs font-black text-red-600 uppercase tracking-wider">EXPIRED</div>
                      ) : (
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={actionLoadingId === req.id || signedByMe}
                          className={`px-5 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                            signedByMe 
                              ? 'bg-surface-container border border-outline-variant text-zinc-400' 
                              : 'bg-primary text-white hover:bg-primary-container shadow-md shadow-primary/10'
                          }`}
                        >
                          {actionLoadingId === req.id 
                            ? "Signing..." 
                            : signedByMe 
                            ? "SIGNED" 
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
    </div>
  );
}
