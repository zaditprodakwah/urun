'use client';

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare,
  Database,
  Wifi,
  RefreshCw
} from 'lucide-react';

export default function MonitoringClient() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setError(null);
      const { data, error: rpcError } = await supabaseBrowser.rpc('get_platform_health_metrics');
      
      if (rpcError) {
        throw new Error(rpcError.message);
      }
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat metrik sistem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const totalSuccess = metrics?.total_audit_success_7d || 0;
  const totalImbalance = metrics?.total_imbalance_alert_7d || 0;
  const totalAudits = totalSuccess + totalImbalance;
  
  const successRatio = totalAudits > 0 
    ? Math.round((totalSuccess / totalAudits) * 100) 
    : 100;

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-emerald-500">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-sm font-semibold tracking-wider uppercase">Menghubungkan ke Node Keamanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Akses Ditolak atau Terjadi Kesalahan</h2>
        <p className="text-zinc-400 mb-6">{error}</p>
        <button 
          onClick={fetchMetrics}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Coba Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            Platform Observability
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Super Admin Dashboard • Live Telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Sistem Sehat</span>
          </div>
          <button 
            onClick={fetchMetrics}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* GATEWAY HEALTH CARD */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Fonnte WA Gateway</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-white capitalize">{metrics?.whatsapp_status || 'Connected'}</p>
                <Wifi className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex justify-between items-center relative z-10">
            <span className="text-sm text-zinc-500 font-medium">Ping Latency</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{metrics?.whatsapp_latency_ms || 0} ms</span>
          </div>
        </div>

        {/* LEDGER SUCCESS RATIO */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Integritas Ledger 7 Hari Terakhir</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-white">{successRatio}%</p>
                  <p className="text-sm font-medium text-emerald-500">Tingkat Keberhasilan</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">Total Transaksi</p>
              <p className="text-2xl font-bold text-white font-mono">{totalAudits}</p>
            </div>
          </div>

          {/* VISUAL PURE CSS RATIO BAR */}
          <div className="relative z-10 space-y-3">
            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out relative"
                style={{ width: `${successRatio}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
              {totalImbalance > 0 && (
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000 ease-out"
                  style={{ width: `${100 - successRatio}%` }}
                ></div>
              )}
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {totalSuccess} Sukses (Audit Passed)
              </span>
              <span className={`${totalImbalance > 0 ? 'text-red-400' : 'text-zinc-500'} flex items-center gap-1`}>
                <span className={`w-2 h-2 rounded-full ${totalImbalance > 0 ? 'bg-red-500' : 'bg-zinc-600'}`}></span>
                {totalImbalance} Anomali
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY AUDIT TIMELINE */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-bold text-white">Visualisasi Anomali Harian</h2>
        </div>
        
        <div className="flex items-end h-48 gap-2 sm:gap-4 w-full">
          {metrics?.daily_metrics?.map((day: any) => {
            const total = day.success_count + day.imbalance_count;
            // Prevent division by zero and cap height visually
            const heightPercent = total > 0 ? Math.max((total / Math.max(10, total)) * 100, 10) : 5;
            const errRatio = total > 0 ? (day.imbalance_count / total) * 100 : 0;
            const formattedDate = new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
            
            return (
              <div key={day.date} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                
                {/* TOOLTIP ON HOVER */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs py-1 px-3 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl border border-zinc-700">
                  <p className="font-bold text-emerald-400">{day.success_count} Sukses</p>
                  {day.imbalance_count > 0 && <p className="font-bold text-red-400">{day.imbalance_count} Gagal</p>}
                </div>

                <div 
                  className="w-full max-w-[40px] bg-zinc-800 rounded-t-lg overflow-hidden flex flex-col justify-end relative group-hover:bg-zinc-700 transition-colors cursor-crosshair"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div 
                    className="w-full bg-emerald-500/80 transition-all duration-700" 
                    style={{ height: `${100 - errRatio}%` }}
                  ></div>
                  <div 
                    className="w-full bg-red-500/80 transition-all duration-700" 
                    style={{ height: `${errRatio}%` }}
                  ></div>
                </div>
                <div className="mt-3 text-[10px] sm:text-xs font-medium text-zinc-500 text-center uppercase">
                  {formattedDate}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
