"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  MessageSquareWarning, 
  ShoppingCart,
  Users,
  Wallet,
  ShieldCheck,
  Flame
} from "lucide-react";
import Link from "next/link";

export default function TermsOfServiceClient() {
  const [activeSection, setActiveSection] = useState("syarat-ketentuan");

  const sectionRefs = {
    "syarat-ketentuan": useRef<HTMLElement>(null),
    "keanggotaan-verifikasi": useRef<HTMLElement>(null),
    "buku-kas-kolektif": useRef<HTMLElement>(null),
    "validasi-transaksi": useRef<HTMLElement>(null),
    "skor-dedikasi": useRef<HTMLElement>(null),
    "moderasi-konten": useRef<HTMLElement>(null),
    "tender-kolektif": useRef<HTMLElement>(null),
    "kebijakan-korporat": useRef<HTMLElement>(null),
  };

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const [sectionId, ref] of Object.entries(sectionRefs)) {
        const element = ref.current;
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = sectionRefs[id as keyof typeof sectionRefs]?.current;
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-[#FCFBF9] text-[#131b2e] min-h-screen py-8 md:py-16">
      
      {/* Header Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <FileText className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#bbcabf]/60 text-[10px] font-black uppercase tracking-wider text-zinc-600">
            Versi 1.0.0 | Berlaku Mulai 21 Mei 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#131b2e]">
            Syarat &amp; Ketentuan Layanan
          </h1>
          <p className="text-base md:text-lg text-[#006c49] font-black italic">
            &quot;Saling Percaya, Transparan, dan Bertanggung Jawab Secara Komunal.&quot;
          </p>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
            Syarat dan ketentuan ini mengatur hak, kewajiban, dan tata laksana interaksi sosial digital warga di dalam ekosistem URUN. Dengan berpartisipasi, Anda sepakat untuk menjaga amanah demi kesejahteraan lingkungan bertetangga.
          </p>
        </div>
      </section>

      {/* Main Container Dual-Pane */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sticky Sidebar (Desktop only) */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="sticky top-24 p-5 bg-white border border-[#bbcabf]/50 rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">Daftar Isi ToS</h3>
            <nav className="flex flex-col gap-1.5">
              <button 
                onClick={() => scrollToSection("syarat-ketentuan")}
                className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === "syarat-ketentuan" 
                    ? "text-[#006c49] bg-[#10b981]/10 border-l-4 border-[#006c49]" 
                    : "text-zinc-600 hover:text-[#006c49] hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                Ketentuan Dasar
              </button>
              
              <div className="pl-4 flex flex-col gap-1 border-l border-zinc-200 ml-3 mb-2">
                <button 
                  onClick={() => scrollToSection("keanggotaan-verifikasi")}
                  className={`text-left text-[11px] font-bold py-1 transition-all ${
                    activeSection === "keanggotaan-verifikasi" ? "text-[#006c49]" : "text-zinc-500 hover:text-[#006c49]"
                  }`}
                >
                  1. Verifikasi Warga
                </button>
                <button 
                  onClick={() => scrollToSection("buku-kas-kolektif")}
                  className={`text-left text-[11px] font-bold py-1 transition-all ${
                    activeSection === "buku-kas-kolektif" ? "text-[#006c49]" : "text-zinc-500 hover:text-[#006c49]"
                  }`}
                >
                  2. Buku Kas Permanen
                </button>
                <button 
                  onClick={() => scrollToSection("validasi-transaksi")}
                  className={`text-left text-[11px] font-bold py-1 transition-all ${
                    activeSection === "validasi-transaksi" ? "text-[#006c49]" : "text-zinc-500 hover:text-[#006c49]"
                  }`}
                >
                  3. Multi-Sig Approval
                </button>
                <button 
                  onClick={() => scrollToSection("skor-dedikasi")}
                  className={`text-left text-[11px] font-bold py-1 transition-all ${
                    activeSection === "skor-dedikasi" ? "text-[#006c49]" : "text-zinc-500 hover:text-[#006c49]"
                  }`}
                >
                  4. Skor Dedikasi
                </button>
              </div>

              <button 
                onClick={() => scrollToSection("moderasi-konten")}
                className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === "moderasi-konten" 
                    ? "text-[#006c49] bg-[#10b981]/10 border-l-4 border-[#006c49]" 
                    : "text-zinc-600 hover:text-[#006c49] hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                Moderasi Konten
              </button>
              
              <button 
                onClick={() => scrollToSection("tender-kolektif")}
                className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === "tender-kolektif" 
                    ? "text-[#006c49] bg-[#10b981]/10 border-l-4 border-[#006c49]" 
                    : "text-zinc-600 hover:text-[#006c49] hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                Tender Kolektif
              </button>

              <button 
                onClick={() => scrollToSection("kebijakan-korporat")}
                className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all mt-4 border-t border-zinc-200 pt-4 ${
                  activeSection === "kebijakan-korporat" 
                    ? "text-[#131b2e] bg-zinc-100 border-l-4 border-[#131b2e]" 
                    : "text-zinc-500 hover:text-[#131b2e] hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                Kebijakan Korporat
              </button>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-zinc-200 text-center">
              <Link 
                href="/kebijakan-privasi"
                className="text-[10px] font-black uppercase tracking-wider text-[#006c49] hover:underline"
              >
                Kedaulatan Privasi Data &rarr;
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <article className="md:col-span-9 space-y-8">
          
          {/* Section 1: Intro */}
          <section 
            id="syarat-ketentuan" 
            ref={sectionRefs["syarat-ketentuan"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <h2 className="text-xl md:text-2xl font-extrabold text-[#131b2e] mb-2">
              Ketentuan Dasar Layanan Warga
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Dengan mendaftarkan diri atau mengakses sistem URUN, Anda menyetujui prinsip-prinsip keterbukaan radikal, akuntabilitas sejajar, dan kepatuhan sosial yang menjadi landasan ekosistem ini. Segala interaksi ditujukan murni untuk meningkatkan kemakmuran dan kerukunan warga.
            </p>
          </section>

          {/* Section 2: Keanggotaan & Verifikasi */}
          <section 
            id="keanggotaan-verifikasi" 
            ref={sectionRefs["keanggotaan-verifikasi"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-lg font-extrabold text-[#131b2e] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#006c49]" />
              1. Keanggotaan &amp; Verifikasi Warga Nyata
            </h3>
            <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                Untuk memutus rantai buzzer palsu dan manipulasi finansial digital, registrasi warga ke dalam sistem dikendalikan dengan skema otentikasi ketat:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#131b2e]">Pendaftaran Terkendali Administratif:</strong> Akun warga didaftarkan secara resmi oleh Pengurus RT/RW setempat berdasarkan basis nomor WhatsApp aktif warga bersangkutan.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Keamanan Akses Mandiri:</strong> Nomor WhatsApp warga bertindak sebagai gerbang otentikasi kode OTP. Anda bertanggung jawab penuh untuk mengamankan nomor WhatsApp Anda.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Kebijakan Anti-Duplikasi:</strong> Dilarang menggunakan nama alias palsu, nomor orang lain, atau memanipulasi lokasi wilayah geografis bertetangga untuk tujuan memengaruhi perolehan kuota tender komunal.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Buku Kas Kolektif */}
          <section 
            id="buku-kas-kolektif" 
            ref={sectionRefs["buku-kas-kolektif"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-lg font-extrabold text-[#131b2e] flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#006c49]" />
              2. Buku Kas Kolektif (Sistem Catatan Kas Permanen)
            </h3>
            <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                Sistem URUN menjunjung tinggi transparansi radikal untuk mematikan peluang manipulasi atau penggelapan dana publik di tingkat RT/RW:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#131b2e]">Prinsip Catatan Kas Permanen (Imutabilitas):</strong> Setiap nominal rupiah iuran bulanan warga, kontribusi tender pangan, atau donasi sosial yang statusnya telah divalidasi lunas tidak dapat dihapus, diganti, atau dihilangkan dari basis data historis.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Aturan Transaksi Koreksi:</strong> Apabila terdapat kesalahan ketik nominal oleh Bendahara, pembetulan saldo kas tidak boleh dilakukan dengan mengedit baris lama. Bendahara wajib menulis baris transaksi koreksi baru (nilai plus/minus saldo) dengan melampirkan keterangan alasan koreksi secara terbuka agar warga dapat mengaudit log perubahan.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Validasi Multi-Sig */}
          <section 
            id="validasi-transaksi" 
            ref={sectionRefs["validasi-transaksi"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-lg font-extrabold text-[#131b2e] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#006c49]" />
              3. Validasi Transaksi Besar (Sistem Persetujuan Multi-Pengurus)
            </h3>
            <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                Untuk melindungi uang iuran warga dari pengeluaran sepihak yang mencurigakan, kami mengimplementasikan sistem konsensus Multi-Sig (Multi-Signature):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#131b2e]">Limit Keamanan Pengeluaran:</strong> Setiap pengeluaran kas bernilai besar (di atas batas nominal Rp 5.000.000) wajib mendapatkan tanda tangan persetujuan digital dari minimal 2 (dua) orang pengurus komunitas (misal Ketua RT dan Bendahara) sebelum dana dapat dideklarasikan sah ditarik.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Audit Antrean Publik:</strong> Sebelum disetujui penuh, status pengajuan pengeluaran tersebut akan dipublikasikan secara real-time pada modul `/multisig` sehingga warga dapat melihat permohonan yang tertunda.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Skor Dedikasi */}
          <section 
            id="skor-dedikasi" 
            ref={sectionRefs["skor-dedikasi"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-lg font-extrabold text-[#131b2e] flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#006c49]" />
              4. Skor Dedikasi &amp; Penangguhan Partisipasi Warga
            </h3>
            <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                Sistem URUN memproses penambahan dan pengurangan nilai dedikasi sosial warga (Citizen Points - CP) secara otomatis untuk menumbuhkan kultur gotong royong aktif:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#131b2e]">Apresiasi Positif (+CP):</strong> Kehadiran dalam voting tender, pembayaran iuran tepat waktu, dan kontribusi rujukan warga akan mendongkrak reputasi dedikasi sosial Anda di papan peringkat.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Penurunan Skor (-CP):</strong> Membatalkan pendaftaran komitmen urunan tender yang sudah disetujui bersama, memalsukan bukti transfer, atau penyalahgunaan forum warga akan memotong skor dedikasi Anda secara signifikan.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Penangguhan Hak:</strong> Warga dengan skor dedikasi di bawah nol (minus) akan dibatasi hak suara partisipasinya secara otomatis sampai permasalahan diselesaikan melalui musyawarah kekeluargaan dengan pengurus lokal.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Moderasi Konten */}
          <section 
            id="moderasi-konten" 
            ref={sectionRefs["moderasi-konten"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <div className="border-b border-[#bbcabf]/40 pb-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-red-600">Dokumen C</span>
              <h3 className="text-lg font-extrabold text-[#131b2e] mt-0.5 flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-red-600" />
                Kebijakan Moderasi Konten (Takedown Policy)
              </h3>
            </div>
            
            <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p className="font-bold text-[#131b2e]">Batasan Konten yang Dilarang Keras:</p>
              <p>
                Warga, koordinator, maupun penyedia grosir lokal dilarang keras mengunggah deskripsi program, gambar, bukti logistik, atau pesan obrolan yang mengandung:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Unsur perjudian, penipuan finansial, investasi tidak terdaftar, atau skema ponzi.</li>
                <li>Informasi bohong (hoaks), fitnah antartetangga, ujaran kebencian SARA, atau pornografi.</li>
                <li>Produk ilegal atau melanggar undang-undang (senjata tanpa izin, obat terlarang).</li>
              </ul>

              <p className="font-bold text-[#131b2e] mt-4">Prosedur Penurunan Konten Cepat (Max 1x24 Jam):</p>
              <p>
                Warga dapat melaporkan konten mencurigakan melalui tombol laporan. Sistem atau pengurus yang ditunjuk akan langsung memverifikasi laporan. Jika terbukti melanggar, konten akan dicabut secara permanen dalam waktu <strong className="text-red-700">maksimal 1x24 jam</strong> sejak laporan divalidasi.
              </p>
            </div>
          </section>

          {/* Section 7: Tender Kolektif */}
          <section 
            id="tender-kolektif" 
            ref={sectionRefs["tender-kolektif"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <div className="border-b border-[#bbcabf]/40 pb-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#006c49]">Dokumen D</span>
              <h3 className="text-lg font-extrabold text-[#131b2e] mt-0.5 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#006c49]" />
                Panduan Tender Kolektif (Terms of Reference)
              </h3>
            </div>

            <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p className="font-bold text-[#131b2e]">Siklus Pengadaan Kolektif &amp; Kunci Komitmen:</p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>
                  <strong className="text-[#131b2e]">Pengajuan Kebutuhan:</strong> Pengurus mempublikasikan rencana pengadaan komoditas pangan/sarana RT dengan syarat batas minimum kuota pemesan agar harga grosir dari petani terpicu.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Penguncian Komitmen:</strong> Warga menyatakan jumlah pesanan kebutuhan mereka. Ketika batas pendaftaran ditutup, pesanan terkunci dan <strong className="text-red-700">tidak dapat dibatalkan sepihak</strong> demi mencegah kegagalan kuota minimum warga lainnya.
                </li>
                <li>
                  <strong className="text-[#131b2e]">Pembayaran Bersama:</strong> Seluruh warga yang mendaftar wajib melunasi iuran belanja kolektif tersebut ke kas penampung sementara.
                </li>
              </ol>

              <p className="font-bold text-[#131b2e] mt-4">Pemilihan Penyedia Lokal &amp; Batasan Tanggung Jawab:</p>
              <p>
                UMKM lokal atau petani grosir terdekat dipilih secara terbuka. Penyedia wajib mengirimkan komoditas sesuai jadwal langsung ke Titik Kumpul fisik. 
              </p>
              <p>
                <strong className="text-zinc-700">Pernyataan Batasan:</strong> URUN bertindak murni sebagai alat bantu koordinasi digital komunal. Segala perselisihan terkait kualitas fisik barang atau keterlambatan kurir diselesaikan secara mufakat musyawarah warga dengan penyedia di lokasi Titik Kumpul.
              </p>
            </div>
          </section>

          {/* Pact / Statement Card */}
          <div className="p-6 bg-[#006c49] text-white rounded-3xl space-y-3 text-center mb-12">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">Pernyataan Bersama Warga URUN</h4>
            <p className="text-xs text-emerald-50 italic max-w-2xl mx-auto leading-relaxed">
              &quot;Dengan berpartisipasi di dalam sistem ini, kami menyatakan sepakat untuk bertransaksi secara jujur, menjaga akuntabilitas Buku Kas lingkungan, menghormati hak data tetangga, dan bergotong royong secara merdeka demi kemandirian ekonomi komunitas kami.&quot;
            </p>
          </div>

          <hr className="border-zinc-200 my-8" />

          {/* Section 8: Kebijakan Korporat */}
          <section 
            id="kebijakan-korporat" 
            ref={sectionRefs["kebijakan-korporat"]}
            className="p-6 md:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm space-y-4 text-zinc-300"
          >
            <div className="border-b border-zinc-800 pb-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Corporate Enterprise Access</span>
              <h3 className="text-lg font-extrabold text-white mt-0.5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
                Kebijakan Korporat &amp; Audit Level Makro (Layer 2-3)
              </h3>
            </div>

            <div className="text-xs text-zinc-400 space-y-3 leading-relaxed">
              <p className="font-bold text-zinc-200">Batas Akses Terhadap Data Privasi Warga:</p>
              <p>
                Bagian ini ditujukan khusus bagi entitas korporat, pimpinan wilayah tingkat provinsi/nasional (Investor Tier), dan lembaga audit pemerintah (Oversight Tier). URUN memberlakukan pemisahan hak akses ketat (Multi-Tier Segregation):
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-zinc-200">Layer 2 (Eksekutif/Investor):</strong> Hanya diberikan hak akses visual pada dasbor agregat volume kas, demografi pendaftaran komunitas skala besar, dan Return of Investment. Hak edit, mutasi, serta identitas rinci warga di-*block* sepenuhnya oleh sistem.
                </li>
                <li>
                  <strong className="text-zinc-200">Layer 3 (Auditor/Compliance):</strong> Diberikan kewenangan membaca log transaksi mentah (`ledger`) guna menelusuri dugaan korupsi. Akan tetapi, nama dan identitas Personal Identifiable Information (PII) wajib disamarkan oleh sistem menjadi entitas anonim ("Warga_Anonim").
                </li>
              </ul>
            </div>
          </section>

        </article>

      </div>

    </div>
  );
}
