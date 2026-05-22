import { sendWhatsappMessage, formatIDR } from './whatsapp';

/**
 * Abstraksi pengiriman notifikasi WhatsApp berbasis reputasi warga
 */
export async function sendReputationNotif(
  phone: string,
  name: string,
  delta: number,
  reason: string,
  newScore: number
): Promise<boolean> {
  const directionStr = delta > 0 ? 'Mendapat ➕' : 'Kehilangan ➖';
  const deltaVal = Math.abs(delta);
  const text = `🎖️ *REPUTASI URUN BERUBAH*\n\n` +
    `Halo *${name}*,\n` +
    `Reputasi Anda baru saja diperbarui oleh sistem.\n\n` +
    `*Aksi:* ${reason}\n` +
    `*Perubahan:* ${directionStr}${deltaVal} Poin\n` +
    `*Total Skor Saat Ini:* *${newScore}* Poin\n\n` +
    `Terima kasih telah terus berkontribusi aktif menjaga kedaulatan komunitas kita! 💪🇮🇩`;

  return sendWhatsappMessage(phone, text);
}

/**
 * Pengiriman pengingat waktu tenggat tender yang akan berakhir
 */
export async function sendTenderReminder(
  phone: string,
  name: string,
  tenderTitle: string,
  hoursRemaining: number,
  requiredSigs: number,
  currentSigs: number
): Promise<boolean> {
  const text = `⚠️ *PENGINGAT DEADLINE TENDER*\n\n` +
    `Halo *${name}*,\n` +
    `Tender komunitas membutuhkan perhatian mendesak dari Anda selaku Pengurus/Witness.\n\n` +
    `*Tender:* "${tenderTitle}"\n` +
    `*Sisa Waktu:* *${hoursRemaining} Jam*\n` +
    `*Status Konsensus:* *${currentSigs}/${requiredSigs}* Tanda Tangan Disetujui\n\n` +
    `Mohon segera kunjungi Multi-Sig Command Center untuk melakukan review dan pembubuhan tanda tangan agar tender tidak deadlock.\n\n` +
    `🔗 ${process.env.NEXT_PUBLIC_SITE_URL || 'https://urunwarga.vercel.app'}/multisig`;

  return sendWhatsappMessage(phone, text);
}

/**
 * Pengiriman ringkasan mingguan (Digest) ke pengurus/warga
 */
export async function sendWeeklyDigest(
  phone: string,
  name: string,
  communityName: string,
  stats: {
    totalWarga: number;
    activeTenders: number;
    treasuryBalance: number;
    platformRevenue: number;
  }
): Promise<boolean> {
  const text = `📊 *RINGKASAN MINGGUAN URUN (${communityName})*\n\n` +
    `Halo *${name}*,\n` +
    `Berikut adalah laporan performa keuangan dan keaktifan komunitas Anda dalam seminggu terakhir:\n\n` +
    `👥 *Total Warga Terdaftar:* ${stats.totalWarga} Jiwa\n` +
    `📂 *Tender Berjalan:* ${stats.activeTenders} Kegiatan\n` +
    `💰 *Saldo Treasury Komunitas:* *${formatIDR(stats.treasuryBalance)}*\n` +
    `⚡ *Kontribusi Platform URUN:* ${formatIDR(stats.platformRevenue)}\n\n` +
    `Sistem dalam keadaan 100% aman dan seluruh kas kolektif ter-audit secara imutabel.\n\n` +
    `Selamat mengabdi untuk kebaikan bersama! 🚀`;

  return sendWhatsappMessage(phone, text);
}
