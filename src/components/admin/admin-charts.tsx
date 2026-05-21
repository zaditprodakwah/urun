'use client';

import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

type LedgerEntry = {
  amount: number | string;
  direction: 'in' | 'out';
  created_at: string;
};

interface AdminChartsProps {
  ledgerEntries: LedgerEntry[];
}

export function AdminCharts({ ledgerEntries }: AdminChartsProps) {
  const chartData = useMemo(() => {
    // Group by date (YYYY-MM-DD)
    const grouped = ledgerEntries.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, KasMasuk: 0, KasKeluar: 0 };
      }
      
      const val = typeof entry.amount === 'string' ? parseFloat(entry.amount) : entry.amount;
      
      if (entry.direction === 'in') {
        acc[date].KasMasuk += val;
      } else {
        acc[date].KasKeluar += val;
      }
      return acc;
    }, {} as Record<string, { date: string, KasMasuk: number, KasKeluar: number }>);
    
    // Sort by date ascending
    const sorted = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    
    // Formatting helper
    return sorted.map(item => ({
      ...item,
      labelDate: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    }));
  }, [ledgerEntries]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500 bg-zinc-900/40 rounded-xl border border-zinc-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-2 opacity-50"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        <p className="text-sm">Belum ada data kas yang tercatat.</p>
      </div>
    );
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(val);
  };

  return (
    <div className="w-full h-80 bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Tren Kas Masuk vs Keluar</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis 
            dataKey="labelDate" 
            stroke="#a1a1aa" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#a1a1aa" 
            fontSize={12} 
            tickFormatter={(value) => `Rp ${value / 1000}K`} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            cursor={{ fill: '#27272a' }}
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#f4f4f5', borderRadius: '0.5rem' }}
            formatter={(value: any) => formatRupiah(Number(value))}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="KasMasuk" name="Kas Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="KasKeluar" name="Kas Keluar" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
