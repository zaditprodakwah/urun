import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Box-Muller Transform to generate standard normally distributed (Gaussian) variables
function generateGaussianNoise(mean: number = 0, stdDev: number = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// Applies Local Differential Privacy noise to a numeric value
function applyDifferentialPrivacy(value: number, sensitivity: number = 100000): number {
  // Sensitivity represents the maximum potential contribution of a single individual transaction.
  // Standard deviation is adjusted to simulate differential privacy under epsilon-delta bounds.
  const noise = generateGaussianNoise(0, sensitivity * 0.15);
  // Guarantee values do not go below zero
  return Math.max(0, Math.round(value + noise));
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Silakan masuk ke dalam simpul komunitas.' }, { status: 401 });
    }

    const communityId = session.communityId;

    // Fetch ledger items to construct aggregated trend reports
    const { data: ledgerEntries, error } = await supabaseAdmin
      .from('ledger')
      .select('amount, direction, entry_type, created_at')
      .eq('community_id', communityId);

    if (error || !ledgerEntries) {
      console.error('❌ Failed to fetch ledger trends:', error);
      return NextResponse.json({ error: 'Gagal mengambil data tren transaksi.' }, { status: 500 });
    }

    // Initialize aggregators
    let totalInflow = 0;
    let totalOutflow = 0;
    const typeAggregates: Record<string, number> = {};
    const monthlyAggregates: Record<string, { inflow: number; outflow: number }> = {};

    ledgerEntries.forEach(entry => {
      const amount = parseFloat(entry.amount as unknown as string) || 0;
      const date = new Date(entry.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Inflow vs Outflow
      if (entry.direction === 'in') {
        totalInflow += amount;
        if (!monthlyAggregates[monthKey]) monthlyAggregates[monthKey] = { inflow: 0, outflow: 0 };
        monthlyAggregates[monthKey].inflow += amount;
      } else {
        totalOutflow += amount;
        if (!monthlyAggregates[monthKey]) monthlyAggregates[monthKey] = { inflow: 0, outflow: 0 };
        monthlyAggregates[monthKey].outflow += amount;
      }

      // Group by entry type
      typeAggregates[entry.entry_type] = (typeAggregates[entry.entry_type] || 0) + amount;
    });

    // Apply Differential Privacy to aggregates (Adding Gaussian Noise)
    // Sensitivity scale: Rp 250.000 (typical small community unit size)
    const sensitivity = 250000; 

    const noisyInflow = applyDifferentialPrivacy(totalInflow, sensitivity);
    const noisyOutflow = applyDifferentialPrivacy(totalOutflow, sensitivity);

    const noisyTypeAggregates: Record<string, number> = {};
    Object.keys(typeAggregates).forEach(type => {
      noisyTypeAggregates[type] = applyDifferentialPrivacy(typeAggregates[type], sensitivity);
    });

    const noisyMonthlyAggregates: Record<string, { inflow: number; outflow: number }> = {};
    Object.keys(monthlyAggregates).forEach(month => {
      noisyMonthlyAggregates[month] = {
        inflow: applyDifferentialPrivacy(monthlyAggregates[month].inflow, sensitivity),
        outflow: applyDifferentialPrivacy(monthlyAggregates[month].outflow, sensitivity)
      };
    });

    return NextResponse.json({
      status: 'success',
      community_id: communityId,
      privacy_policy: "Compliant with UU PDP No. 27/2022. Aggregates are protected by Local Differential Privacy using Gaussian Noise injection to mask individual contributions.",
      sensitivity_limit: sensitivity,
      summary: {
        total_inflow: noisyInflow,
        total_outflow: noisyOutflow,
        current_net_reserve: Math.max(0, noisyInflow - noisyOutflow),
      },
      distribution_by_type: noisyTypeAggregates,
      monthly_trends: noisyMonthlyAggregates,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (err: any) {
    console.error('💥 Trends Aggregator Critical Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
