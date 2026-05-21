import React from "react";
import { ShieldCheck, ChevronDown, Lock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi (PDP)",
  description: "Dokumen Kepatuhan Publik & Perlindungan Data Pribadi Warga URUN",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="flex-1 w-full relative overflow-x-hidden pt-12 pb-24">
      {/* Background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[128px] pointer-events-none -z-10"></div>
      
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
        
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            Versi 1.0.0 | Patuh UU PDP No. 27/2022
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Kebijakan Privasi & Perlindungan Data Pribadi
          </h1>
          <p className="text-lg text-emerald-400 font-medium max-w-2xl mx-auto italic">
            "Data Anda adalah Milik Komunitas Anda, Bukan Komoditas Komersial."
          </p>
          <p className="text-zinc-400 max-w-3xl mx-auto leading-relaxed text-sm">
            Selamat datang di URUN. Kami membangun sistem ini sebagai infrastruktur sosial digital yang bertujuan untuk mempererat kegotongroyongan warga. Kami menjamin privasi dan kedaulatan data Anda dikelola dengan transparansi penuh serta terbebas dari pemanfaatan komersial pihak ketiga.
          </p>
        </div>

        <div className="space-y-4">
          {/* Item 1 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">1. Data yang Dikumpulkan</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <p>Kami hanya mengumpulkan data yang benar-benar dibutuhkan untuk kenyamanan operasional dan transparansi kas di lingkungan komunitas Anda:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Identitas Dasar:</strong> Nama lengkap dan nomor WhatsApp aktif (digunakan untuk verifikasi keanggotaan, pengiriman pesan bot otomatis, dan koordinasi pembagian barang).</li>
                <li><strong className="text-white">Transaksi Kas & Tender:</strong> Catatan keikutsertaan dalam urunan dana, partisipasi pengadaan barang bersama, serta riwayat pembayaran iuran warga.</li>
                <li><strong className="text-white">Geografis Komunitas:</strong> Wilayah administratif tingkat RT/RW tempat Anda tinggal, guna membantu sistem mencari ketersediaan produsen pangan grosir terdekat dari lingkungan Anda.</li>
                <li><strong className="text-white">Reputasi Dedikasi Warga:</strong> Nilai kontribusi sosial yang mencerminkan keaktifan dan ketepatan waktu Anda dalam mendukung program komunitas.</li>
              </ul>
            </div>
          </details>

          {/* Item 2 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">2. Batasan Pengumpulan Data (Anti-Pelacakan Invasif)</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <p>Kami berkomitmen penuh untuk menjaga kenyamanan digital Anda. Sistem kami <strong className="text-white">tidak akan pernah</strong> mengumpulkan:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Riwayat penelusuran internet Anda (browsing behavior), data ketukan layar, atau durasi Anda membaca halaman.</li>
                <li>Riwayat ulasan belanja, komentar pribadi, atau profil toko luar yang Anda akses melalui sistem pembanding harga.</li>
                <li>Informasi pribadi sensitif lainnya yang tidak berkaitan langsung dengan kebutuhan urunan kas komunitas.</li>
                <li><strong className="text-emerald-400">Kami tidak menggunakan Google Analytics, Meta Pixel, atau alat pelacak iklan pihak ketiga lainnya.</strong></li>
              </ul>
            </div>
          </details>

          {/* Item 3 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">3. Cara Penggunaan Data Anda</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <p>Informasi Anda diolah secara aman dan hanya digunakan untuk kemandirian ekonomi simpul warga:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Koordinasi Logistik:</strong> Membantu mengonfirmasikan daftar nama warga dan nomor kontak kepada pengurus atau warga yang ditunjuk sebagai koordinator lapangan pada saat pembagian barang di lokasi yang disepakati.</li>
                <li><strong className="text-white">Transparansi Keuangan Komunitas:</strong> Menampilkan nama Anda secara terbuka pada papan Buku Kas Kolektif yang dapat diaudit oleh sesama warga di satu lingkungan komunitas Anda guna menghindari penyalahgunaan dana kas.</li>
                <li><strong className="text-white">Analisis Kebutuhan Wilayah:</strong> Mengolah tren perkembangan harga kebutuhan pokok secara anonim dan kolektif tanpa pernah menampilkan atau membagikan identitas pribadi Anda ke server luar.</li>
              </ul>
            </div>
          </details>

          {/* Item 4 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">4. Jaminan Perlindungan Data dari Pihak Ketiga</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <p>Kami menjamin secara mutlak bahwa data pribadi Anda <strong className="text-emerald-400">tidak akan pernah dijual, disewakan, atau dibagikan</strong> kepada pihak luar untuk kepentingan periklanan, pemasaran, atau profiling komersial oleh perusahaan mana pun.</p>
            </div>
          </details>

          {/* Panduan Hak Data Mandiri (Dokumen E) */}
          <div className="mt-12 mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-emerald-400" /> Hak Data Mandiri Warga
            </h2>
            <p className="text-emerald-400 text-sm mt-2 italic">Anda Memiliki Kendali Penuh Atas Data Anda Sendiri.</p>
          </div>

          {/* Item E1 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">Hak Memindahkan Data (Ekspor Data Mandiri)</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <p>Setiap warga berhak mengunduh seluruh data aktivitas pribadinya di dalam sistem untuk dipindahkan ke platform lain jika diinginkan:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Cara Melakukan:</strong> Buka halaman profil Anda, pilih menu "Hak Data Saya" &gt; "Ekspor Riwayat Data".</li>
                <li><strong className="text-white">Format File:</strong> Sistem akan membuat file data terstandar yang aman dan rapi, berisi data profil Anda, riwayat iuran, kontribusi proyek, serta riwayat perubahan poin dedikasi sosial Anda.</li>
              </ul>
            </div>
          </details>

          {/* Item E2 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">Hak untuk Dilupakan (Penghapusan Data Pribadi)</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <p>Jika Anda pindah domisili atau tidak ingin lagi menggunakan sistem URUN, Anda berhak meminta penghapusan seluruh data identitas pribadi Anda:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Cara Mengajukan:</strong> Masuk ke profil Anda, pilih menu "Hapus Identitas Saya" dan konfirmasikan permintaan Anda melalui kode keamanan otomatis yang dikirim ke nomor WhatsApp Anda.</li>
                <li><strong className="text-white">Masa Tenggang 7 Hari:</strong> Untuk menghindari ketidaksengajaan, sistem akan menunda eksekusi permanen selama 7 hari. Anda dapat membatalkan permintaan ini kapan saja dalam kurun waktu tersebut.</li>
                <li><strong className="text-white">Penghapusan & Anonimisasi Permanen:</strong> Setelah masa tenggang selesai, seluruh data identitas sensitif (Nama lengkap, nomor WhatsApp, email, dan alamat rumah) akan dihapus secara total dari database utama.</li>
                <li><strong className="text-white">Integritas Transparansi Keuangan:</strong> Demi menjaga keaslian laporan kas warga lainnya, catatan nominal transaksi keuangan historis yang pernah Anda lakukan akan tetap dipertahankan, namun identitas nama Anda di dalam transaksi tersebut akan disamarkan secara permanen oleh sistem menjadi <strong className="text-emerald-400">Warga_Anonim</strong> sehingga tidak dapat dilacak kembali kepada Anda.</li>
              </ul>
            </div>
          </details>
        </div>

        <div className="mt-12 p-6 bg-emerald-950/20 border border-emerald-900/50 rounded-2xl text-center">
          <p className="text-emerald-400/80 text-sm font-medium mb-4">
            Punya pertanyaan terkait pengelolaan data Anda? Hubungi Data Protection Officer (DPO) kami.
          </p>
          <Link href="/kontak" className="inline-flex px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg hover:border-emerald-500/50 transition-colors text-sm font-bold">
            Hubungi Pengawas Data
          </Link>
        </div>

      </section>
    </div>
  );
}
