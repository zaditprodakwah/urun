import { supabaseAdmin } from '@/lib/supabase-server';
import { sendWhatsappMessage, formatIDR } from '@/lib/whatsapp';

export interface AuditAnomaly {
  type: 'missing_splits' | 'split_sum_mismatch' | 'negative_amount' | 'percentage_mismatch';
  ledgerId: string;
  amount: number;
  expectedSum?: number;
  actualSum?: number;
  details: string;
}

export async function runLedgerReconciliation(targetCommunityId: string): Promise<{
  success: boolean;
  totalSettlementsChecked: number;
  anomaliesFound: number;
  anomalies: AuditAnomaly[];
}> {
  const commId = targetCommunityId;
  console.log(`⏰ [${new Date().toISOString()}] Initiating automated ledger reconciliation audit for community: ${commId}...`);

  try {
    const anomalies: AuditAnomaly[] = [];

    // 1. Fetch all ledger entries of type 'tender_settlement' for our community
    const { data: settlements, error: setErr } = await supabaseAdmin
      .from('ledger')
      .select('*')
      .eq('community_id', commId)
      .eq('entry_type', 'tender_settlement');

    if (setErr) {
      console.error('Error fetching settlements for audit:', setErr);
      throw new Error(`Failed to fetch settlements: ${setErr.message}`);
    }

    // 2. Fetch all child split entries ('platform_revenue', 'community_share')
    const { data: splits, error: splitErr } = await supabaseAdmin
      .from('ledger')
      .select('*')
      .eq('community_id', commId)
      .in('entry_type', ['platform_revenue', 'community_share'])
      .not('ref_id', 'is', null);

    if (splitErr) {
      console.error('Error fetching splits for audit:', splitErr);
      throw new Error(`Failed to fetch splits: ${splitErr.message}`);
    }

    const settlementsList = settlements || [];
    const splitsList = splits || [];

    // 3. Perform integrity checks per settlement
    for (const settlement of settlementsList) {
      const settlementId = settlement.id;
      // Convert to cents to avoid floating point errors
      const settlementAmountCents = Math.round(Number(settlement.amount) * 100);
      const settlementAmount = settlementAmountCents / 100;

      // Check negative amount anomaly
      if (settlementAmountCents <= 0) {
        anomalies.push({
          type: 'negative_amount',
          ledgerId: settlementId,
          amount: settlementAmount,
          details: `Settlement ledger entry has a non-positive amount: ${settlementAmount}`
        });
        continue;
      }

      // Filter splits associated with this settlement
      const linkedSplits = splitsList.filter(s => s.ref_id === settlementId);

      if (linkedSplits.length === 0) {
        anomalies.push({
          type: 'missing_splits',
          ledgerId: settlementId,
          amount: settlementAmount,
          details: `Settlement transaction of ${formatIDR(settlementAmount)} is missing its auto-split revenue children.`
        });
        continue;
      }

      // Sum the splits using cents
      let platformRevenueCents = 0;
      let communityShareCents = 0;

      for (const s of linkedSplits) {
        const amtCents = Math.round(Number(s.amount) * 100);
        if (s.entry_type === 'platform_revenue') {
          platformRevenueCents += amtCents;
        } else if (s.entry_type === 'community_share') {
          communityShareCents += amtCents;
        }
      }

      const totalSplitSumCents = platformRevenueCents + communityShareCents;
      const totalSplitSum = totalSplitSumCents / 100;

      // Check for split sum mismatch
      // Using exact integer cents comparison prevents floating point discrepancies
      if (Math.abs(totalSplitSumCents - settlementAmountCents) > 0) {
        anomalies.push({
          type: 'split_sum_mismatch',
          ledgerId: settlementId,
          amount: settlementAmount,
          expectedSum: settlementAmount,
          actualSum: totalSplitSum,
          details: `Sum of split entries (${formatIDR(totalSplitSum)}) does not match the parent settlement amount (${formatIDR(settlementAmount)}). Platform fee: ${formatIDR(platformRevenueCents / 100)}, Community share: ${formatIDR(communityShareCents / 100)}`
        });
      }
    }

    // 4. Handle audit outcomes
    if (anomalies.length > 0) {
      console.warn(`🚨 AUDIT ALERT: Reconciliation detected ${anomalies.length} financial anomalies!`);

      // Log anomalies to database audit_log under 'imbalance_alert' action
      // Immutable Rule #2: We NEVER update or delete the ledger itself. We only report and alert.
      const { error: logErr } = await supabaseAdmin
        .from('audit_log')
        .insert({
          community_id: commId,
          actor_id: null, // SYSTEM Action
          action: 'imbalance_alert',
          table_affected: 'ledger',
          new_value: { anomalies },
          reason: 'AUTOMATED AUDIT: Multi-Sig ledger reconciliation detected financial split or balance inconsistencies.'
        });

      if (logErr) {
        console.error('Failed to write imbalance_alert to audit_log:', logErr);
      }

      // 5. Send P1 Alert via Webhook WhatsApp to all pengurus
      const { data: signers } = await supabaseAdmin
        .from('community_members')
        .select(`
          id,
          profiles (
            phone,
            full_name
          )
        `)
        .eq('community_id', commId)
        .eq('role', 'pengurus');

      if (signers && signers.length > 0) {
        const anomalySummary = anomalies.map((a, i) => {
          return `${i + 1}. *[${a.type.toUpperCase()}]* ID: ...${a.ledgerId.slice(-8)}\n   Parent: ${formatIDR(a.amount)}\n   Detail: ${a.details}`;
        }).join('\n\n');

        const alertMessage = `🚨 *P1 SYSTEM ALERT: LEDGER DISCREPANCY DETECTED* 🚨\n\nSistem audit mandiri URUN mendeteksi kejanggalan integritas Buku Kas Kolektif:\n\n• *Jumlah Masalah*: ${anomalies.length} anomali keuangan\n\n*Rincian Anomali*:\n${anomalySummary}\n\n⚠️ *PANDUAN INTEGRITAS KEAMANAN*:\n• *JANGAN* melakukan UPDATE/DELETE langsung pada tabel ledger (Immutability Rule #2).\n• Periksa entri dan lakukan perbaikan menggunakan metode *correction_entry* (reversal) jika terdapat kesalahan input manual.\n• Hubungi developer sistem jika trigger auto-split mengalami gangguan.`;

        const messagePromises = signers.map(signer => {
          const profile = signer.profiles as { phone?: string } | null | undefined;
          if (profile && profile.phone) {
            return sendWhatsappMessage(profile.phone, alertMessage).catch(err => {
              console.error(`Failed to send WhatsApp alert to ${profile.phone}:`, err);
            });
          }
          return Promise.resolve();
        });
        
        await Promise.allSettled(messagePromises);
      }

      return {
        success: false,
        totalSettlementsChecked: settlementsList.length,
        anomaliesFound: anomalies.length,
        anomalies
      };
    }

    console.log('✅ Audit successful. No ledger balance or split integrity anomalies detected.');

    // Log successful audit run in audit_log
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: commId,
        actor_id: null,
        action: 'ledger_audit_success',
        table_affected: 'ledger',
        new_value: { totalSettlementsChecked: settlementsList.length },
        reason: 'AUTOMATED AUDIT: Harian ledger reconciliation audit completed with 100% success. No discrepancies found.'
      });

    return {
      success: true,
      totalSettlementsChecked: settlementsList.length,
      anomaliesFound: 0,
      anomalies: []
    };

  } catch (err: any) {
    console.error('💥 Critical error during automated ledger reconciliation:', err);
    return {
      success: false,
      totalSettlementsChecked: 0,
      anomaliesFound: 0,
      anomalies: [{
        type: 'negative_amount',
        ledgerId: 'SYSTEM',
        amount: 0,
        details: `Critical audit failure: ${err.message}`
      }]
    };
  }
}
