import React from "react";
import { FileText, ChevronDown, MessageSquareWarning, ShoppingCart } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan (ToS)",
  description: "Syarat, Ketentuan, dan Kebijakan Layanan Komunitas URUN",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="flex-1 w-full relative overflow-x-hidden pt-12 pb-24">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[128px] pointer-events-none -z-10"></div>
      
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-300 border border-zinc-800">
            <FileText className="w-8 h-8" />
          </div>
        </div>
        
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            Versi 1.0.0 | Berlaku Mulai 21 Mei 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Syarat & Ketentuan Layanan Komunitas
          </h1>
          <p className="text-lg text-emerald-400 font-medium max-w-2xl mx-auto italic">
            "Saling Percaya, Transparan, dan Bertanggung Jawab."
          </p>
          <p className="text-zinc-400 max-w-3xl mx-auto leading-relaxed text-sm">
            Syarat dan ketentuan ini mengatur hak, kewajiban, dan tata laksana interaksi sosial warga di dalam ekosistem digital URUN. Dengan mendaftarkan diri, Anda setuju untuk menjaga kerukunan dan integritas lingkungan bertetangga.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 mt-8">Ketentuan Dasar Layanan (ToS)</h2>
          
          {/* Item 1 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">1. Keanggotaan dan Verifikasi Warga</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Pendaftaran Berbasis Verifikasi:</strong> Akun Anda didaftarkan secara resmi oleh Pengurus RT/RW setempat menggunakan nomor WhatsApp aktif Anda untuk menjamin validitas keanggotaan.</li>
                <li><strong className="text-white">Keamanan Nomor Kontak:</strong> Anda bertanggung jawab penuh untuk menjaga keamanan akses nomor WhatsApp Anda. Setiap pesan atau perintah yang dikirim dari nomor Anda ke sistem URUN dianggap sebagai tindakan sadar yang sah atas nama Anda.</li>
                <li><strong className="text-white">Larangan Akun Palsu:</strong> Warga dilarang keras menggunakan identitas orang lain atau mendaftarkan nomor palsu untuk memanipulasi persetujuan kas atau mengelabui pencatatan iuran bersama.</li>
              </ul>
            </div>
          </details>

          {/* Item 2 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">2. Aturan Buku Kas Kolektif (Sistem Catatan Kas Permanen)</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Kebenaran Transaksi:</strong> Seluruh catatan transaksi keuangan iuran kas, urunan dana, atau kontribusi tender yang telah dinyatakan selesai akan tersimpan secara permanen.</li>
                <li><strong className="text-white">Prinsip Imutabilitas (Catatan Kas Permanen):</strong> Untuk menjaga integritas keuangan bersama, data transaksi kas yang sudah masuk tidak dapat dihapus atau diubah secara sepihak. Jika terdapat kekeliruan nominal oleh bendahara, pembetulan wajib dilakukan melalui entri transaksi koreksi (nilai plus/minus baru) secara transparan agar warga tetap dapat melacak alasan perubahan tersebut.</li>
              </ul>
            </div>
          </details>

          {/* Item 3 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">3. Validasi Transaksi Besar (Sistem Persetujuan Multi-Pengurus)</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Pengaman Kas Bersama:</strong> Demi menghindari kesalahan pencairan atau penyelewengan, setiap transaksi pengeluaran kas bernilai besar (di atas batas Rp 5.000.000) wajib mendapatkan persetujuan digital dari minimal 2 (dua) orang pengurus komunitas yang berwenang sebelum dana dicairkan.</li>
                <li><strong className="text-white">Hak Pantau Warga:</strong> Setiap pengajuan transaksi yang sedang menunggu persetujuan dapat dipantau langsung oleh warga melalui papan informasi transparansi kas.</li>
              </ul>
            </div>
          </details>

          {/* Item 4 */}
          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">4. Skor Dedikasi dan Sanksi Komunitas</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <p>Sistem URUN memproses penambahan dan pengurangan nilai dedikasi sosial warga secara otomatis berdasarkan keaktifan nyata:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Berpartisipasi aktif dan menyelesaikan pembayaran urunan tepat waktu akan meningkatkan nilai dedikasi sosial Anda.</li>
                <li>Kelalaian yang disengaja (seperti membatalkan komitmen tender yang sudah disetujui bersama atau memalsukan bukti transfer) akan mengurangi nilai dedikasi sosial Anda secara signifikan.</li>
                <li>Apabila nilai dedikasi warga berada di tingkat minus, sistem akan menangguhkan hak partisipasi warga tersebut untuk sementara waktu guna penyelesaian mufakat secara kekeluargaan oleh pengurus RT/RW.</li>
              </ul>
            </div>
          </details>

          {/* Dokumen C */}
          <div className="mt-12 mb-6 pt-8 border-t border-zinc-900">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquareWarning className="w-6 h-6 text-zinc-400" /> Kebijakan Moderasi Konten
            </h2>
            <p className="text-zinc-400 text-sm mt-2 italic">Menjaga Ruang Sosial yang Bersih, Sopan, dan Bebas dari Fitnah.</p>
          </div>

          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">Batasan Konten & Prosedur Pelaporan (Takedown Policy)</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <h4 className="font-bold text-white mt-2">Batasan Konten yang Dilarang</h4>
              <p>Setiap warga, pengurus, maupun mitra penyedia barang dilarang keras mengunggah penawaran produk, deskripsi jasa, atau pesan komunikasi yang mengandung:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Unsur perjudian, penipuan uang, investasi bodong, atau skema ponzi.</li>
                <li>Informasi palsu (hoaks), fitnah antartetangga, ujaran kebencian berlatar SARA, atau pornografi.</li>
                <li>Penawaran produk ilegal yang melanggar hukum (seperti barang tiruan palsu, obat terlarang, atau senjata tajam tanpa izin).</li>
              </ul>

              <h4 className="font-bold text-white mt-4">Prosedur Pelaporan & Penurunan Konten Cepat</h4>
              <p>Jika Anda menemukan konten yang melanggar, gunakan tombol "Laporkan Konten" yang tersedia. Sistem akan langsung meneruskan laporan tersebut ke antrean peninjauan prioritas.</p>
              <p>Jika terbukti melanggar aturan, konten tersebut akan diturunkan secara permanen dalam waktu <strong className="text-emerald-400">maksimal 1x24 jam</strong> sejak laporan divalidasi. Warga atau mitra yang melanggar akan menerima pemberitahuan otomatis.</p>
            </div>
          </details>

          {/* Dokumen D */}
          <div className="mt-12 mb-6 pt-8 border-t border-zinc-900">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-zinc-400" /> Panduan Tender Kolektif
            </h2>
            <p className="text-zinc-400 text-sm mt-2 italic">Belanja Hemat dengan Kekuatan Kolektif, Berpihak pada UMKM Lokal.</p>
          </div>

          <details className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-bold text-white pr-4">Ketentuan Pengadaan Barang & Partisipasi (Terms of Reference)</h3>
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
            </summary>
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 text-zinc-400 text-sm leading-relaxed space-y-3">
              <h4 className="font-bold text-white mt-2">Siklus Partisipasi dan Penguncian Komitmen</h4>
              <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li><strong className="text-white">Pengajuan Pengadaan:</strong> Pengurus RT/RW membuka program pengadaan komoditas dengan target kuantitas minimum agar harga grosir dapat dicapai.</li>
                <li><strong className="text-white">Penguncian Pesanan Warga:</strong> Warga mendaftarkan jumlah kebutuhan mereka. Pendaftaran ini merupakan komitmen belanja yang mengunci kuota.</li>
                <li><strong className="text-white">Pembayaran Kolektif:</strong> Setelah pendaftaran ditutup, pesanan <strong className="text-emerald-400">tidak dapat dibatalkan secara sepihak</strong>. Warga wajib melakukan iuran bersama.</li>
              </ol>

              <h4 className="font-bold text-white mt-4">Pemilihan Penyedia & Batasan Tanggung Jawab Platform</h4>
              <p>Mitra grosir atau UMKM lokal dipilih secara transparan berdasarkan rekam jejak. Mitra wajib mengantarkan komoditas ke Titik Kumpul fisik di wilayah komunitas.</p>
              <p><strong className="text-white">Penting:</strong> URUN bertindak murni sebagai alat bantu digital. Masalah kualitas fisik barang atau keterlambatan pengiriman diselesaikan secara mufakat oleh warga, pengurus, dan penyedia di tingkat lokal.</p>
            </div>
          </details>

        </div>
        
        <div className="mt-16 p-8 border border-zinc-800 bg-zinc-950 rounded-2xl text-center space-y-4">
          <h3 className="font-bold text-white text-lg">Pernyataan Bersama Warga URUN</h3>
          <p className="text-emerald-400 font-medium italic text-sm max-w-2xl mx-auto leading-relaxed">
            "Dengan menyetujui dokumen ini saat pertama kali menggunakan sistem, kami menyatakan sepakat untuk bertransaksi secara jujur, menjaga transparansi kas lingkungan, menghormati hak data tetangga, dan bergotong royong secara merdeka demi kemandirian ekonomi komunitas kami."
          </p>
        </div>

      </section>
    </div>
  );
}
