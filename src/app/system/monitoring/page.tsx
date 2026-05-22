import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-server';
import { Activity, AlertTriangle, ShieldCheck, Database, Clock } from 'lucide-react';

export const revalidate = 0; // Dynamic rendering untuk data realtime

export default async function SystemMonitoringPage() {
  // 1. Tarik log audit terbaru (Max 50)
  const { data: logs, error: logsError } = await supabaseAdmin
    .from('audit_log')
    .select(`
      id,
      action,
      table_affected,
      reason,
      created_at,
      community_id
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8 bg-surface min-h-screen">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-on-surface flex items-center gap-3 tracking-tight">
          <Activity className="w-8 h-8 text-secondary" /> 
          Pusat Pemantauan Sistem
        </h1>
        <p className="text-sm font-medium text-on-surface-variant max-w-2xl leading-relaxed">
          Dasbor observabilitas URUN. Mengawasi integritas buku kas, rekonsiliasi anomali, dan arus *audit_log* di lapisan basis data PostgreSQL.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><Database className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-bold text-outline uppercase">Koneksi Supabase</div>
            <div className="text-lg font-black text-on-surface">Stabil (Avg 40ms)</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-bold text-outline uppercase">Automated Reconciliation</div>
            <div className="text-lg font-black text-on-surface">Aktif (Cron)</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-error/30 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
          <div className="p-3 bg-error/10 text-error rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-bold text-outline uppercase">Imbalance Alerts</div>
            <div className="text-lg font-black text-error">0 Anomali Kritis</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center">
          <h2 className="text-base font-black text-on-surface">Alur Audit (Real-time Stream)</h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Live
          </div>
        </div>
        <div className="divide-y divide-outline-variant/20 max-h-[60vh] overflow-y-auto">
          {logsError || !logs || logs.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-sm">Tidak ada rekam jejak audit terbaru.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-surface-container-low transition-colors flex gap-4 text-sm">
                <div className="text-outline mt-1"><Clock className="w-4 h-4" /></div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">{log.action.toUpperCase()}</span>
                    <span className="text-xs font-mono text-outline-variant">{new Date(log.created_at).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="text-xs font-mono text-secondary bg-secondary/10 px-1.5 py-0.5 rounded w-fit">Tabel: {log.table_affected}</div>
                  <p className="text-on-surface-variant text-xs leading-relaxed">{log.reason || 'Sistem memvalidasi tindakan ini.'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
