import { NextRequest, NextResponse } from 'next/server';
import { runLedgerReconciliation } from '@/lib/automation/reconcile_ledger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const result = await runLedgerReconciliation();
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('[Reconcile API Route Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
