"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Lock, 
  FileJson, 
  FileSpreadsheet, 
  History, 
  Trash2, 
  CheckCircle2, 
  X, 
  MessageSquare, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

interface LogEntry {
  date: string;
  activity: string;
  purpose: string;
  operator: string;
  status: "Selesai" | "Proses";
}

export default function PrivacyPolicyClient() {
  const [activeSection, setActiveSection] = useState("kebijakan-privasi");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStep, setOtpStep] = useState<"phone" | "code" | "success">("phone");
  const [phoneNumber, setPhoneNumber] = useState("+62 812-3456-7890");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [simulatedOtpSent, setSimulatedOtpSent] = useState("");

  const sectionRefs = {
    "kebijakan-privasi": useRef<HTMLElement>(null),
    "pengumpulan-data": useRef<HTMLElement>(null),
    "penggunaan-data": useRef<HTMLElement>(null),
    "jaminan-pihak-ketiga": useRef<HTMLElement>(null),
    "pusat-kendali-data": useRef<HTMLElement>(null),
    "hak-dilupakan": useRef<HTMLElement>(null),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Mock Citizen Data
  const mockCitizenData = {
    nik: "3174************",
    nama_warga: "Ahmad Subarjo",
    peran: "Warga RT 01",
    wilayah: "RT 01 / RW 05, Kalisari, Jakarta Timur",
    reputasi_score: "88 CP (Citizen Points)",
    kontak_whatsapp: "+62 812-3456-7890",
    riwayat_iuran: [
      { tanggal: "2026-05-10", program: "Iuran Bulanan Jalan & Keamanan", nominal: 50000, status: "Lunas" },
      { tanggal: "2026-04-05", program: "Iuran Pengadaan CCTV Mandiri", nominal: 150000, status: "Lunas" },
      { tanggal: "2026-03-01", program: "Sembako Gotong Royong Kalisari", nominal: 50000, status: "Lunas" }
    ],
    riwayat_partisipasi_suara: [
      { tanggal: "2026-05-12", tender: "Pengadaan Aspal Gang RT 01", pilihan: "Setuju - Mitra CV Karya Abadi" },
      { tanggal: "2026-04-18", tender: "Instalasi Kamera Keamanan IP-Cam", pilihan: "Setuju - Mitra Lokal Tech" }
    ]
  };

  // Download logic
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockCitizenData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "urun_warga_data_kedaulatan.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Kunci Data,Rincian/Nominal,Status\n";
    csvContent += `Nama Lengkap,${mockCitizenData.nama_warga},Aktif\n`;
    csvContent += `Wilayah Domisili,${mockCitizenData.wilayah},Valid\n`;
    csvContent += `Skor Dedikasi,${mockCitizenData.reputasi_score},Aktif\n`;
    csvContent += `Nomor WhatsApp,${mockCitizenData.kontak_whatsapp},Terverifikasi\n`;
    csvContent += `Total Nominal Iuran,250000,Lunas\n`;
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", "urun_warga_data_kedaulatan.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Simulated OTP triggers
  const triggerOtpRequest = () => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtpSent(generatedOtp);
    setOtpStep("code");
    setOtpError("");
    setOtpCode("");
  };

  const verifyOtp = () => {
    if (otpCode === simulatedOtpSent || otpCode === "8274" || otpCode === "7291") {
      setOtpStep("success");
      setOtpError("");
    } else {
      setOtpError("Kode OTP tidak cocok. Coba cek simulasi WhatsApp di atas.");
    }
  };

  const mockLogs: LogEntry[] = [
    { date: "22 Mei 2026, 14:30", activity: "Audit Pencocokan Kas", purpose: "Validasi Buku Kas Multi-Sig", operator: "Bendahara & Pengawas", status: "Selesai" },
    { date: "20 Mei 2026, 10:00", activity: "Verifikasi Hak Suara", purpose: "Voting Tender Paving Block RT 01", operator: "Sistem Otomatis", status: "Selesai" },
    { date: "15 Mei 2026, 09:12", activity: "Pemutakhiran Reputasi", purpose: "Perubahan +2 CP Rujukan Warga", operator: "Simulator Bot", status: "Selesai" },
  ];

  return (
    <div className="bg-[#FCFBF9] text-[#131b2e] min-h-screen py-8 md:py-16">
      
      {/* Header Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#006c49]/10 border border-[#006c49]/20 flex items-center justify-center text-[#006c49]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#bbcabf]/60 text-[10px] font-black uppercase tracking-wider text-[#006c49]">
            Versi 1.0.0 | Patuh UU PDP No. 27/2022
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#131b2e]">
            Kebijakan Privasi &amp; Perlindungan Data
          </h1>
          <p className="text-base md:text-lg text-[#006c49] font-black italic">
            &quot;Data Anda adalah Milik Warga, Bukan Komoditas Komersial.&quot;
          </p>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
            Halo Bapak/Ibu Warga sekalian, selamat datang di URUN. Kami membangun ruang ini layaknya balai rukun tetangga digital—tempat kita bergotong royong dengan aman dan nyaman. Kami berjanji untuk selalu menjaga kerahasiaan data pribadi Bapak/Ibu agar terbebas dari pelacakan iklan komersial.
          </p>
        </div>
      </section>

      {/* Main Container Dual-Pane */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sticky Sidebar (Desktop only) */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="sticky top-24 p-5 bg-white border border-[#bbcabf]/50 rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">Daftar Isi</h3>
            <nav className="flex flex-col gap-1.5">
              <button 
                onClick={() => scrollToSection("kebijakan-privasi")}
                className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === "kebijakan-privasi" 
                    ? "text-[#006c49] bg-[#10b981]/10 border-l-4 border-[#006c49]" 
                    : "text-zinc-600 hover:text-[#006c49] hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                Kedaulatan &amp; Privasi
              </button>
              
              <div className="pl-4 flex flex-col gap-1 border-l border-zinc-200 ml-3 mb-2">
                <button 
                  onClick={() => scrollToSection("pengumpulan-data")}
                  className={`text-left text-[11px] font-bold py-1 transition-all ${
                    activeSection === "pengumpulan-data" ? "text-[#006c49]" : "text-zinc-500 hover:text-[#006c49]"
                  }`}
                >
                  1. Pengumpulan Data
                </button>
                <button 
                  onClick={() => scrollToSection("penggunaan-data")}
                  className={`text-left text-[11px] font-bold py-1 transition-all ${
                    activeSection === "penggunaan-data" ? "text-[#006c49]" : "text-zinc-500 hover:text-[#006c49]"
                  }`}
                >
                  2. Penggunaan Data
                </button>
                <button 
                  onClick={() => scrollToSection("jaminan-pihak-ketiga")}
                  className={`text-left text-[11px] font-bold py-1 transition-all ${
                    activeSection === "jaminan-pihak-ketiga" ? "text-[#006c49]" : "text-zinc-500 hover:text-[#006c49]"
                  }`}
                >
                  3. Jaminan Pihak Ketiga
                </button>
              </div>

              <button 
                onClick={() => scrollToSection("pusat-kendali-data")}
                className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === "pusat-kendali-data" 
                    ? "text-[#006c49] bg-[#10b981]/10 border-l-4 border-[#006c49]" 
                    : "text-zinc-600 hover:text-[#006c49] hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                Pusat Kendali Data
              </button>
              
              <button 
                onClick={() => scrollToSection("hak-dilupakan")}
                className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === "hak-dilupakan" 
                    ? "text-red-700 bg-red-500/10 border-l-4 border-red-600" 
                    : "text-zinc-600 hover:text-red-600 hover:bg-zinc-50 border-l-4 border-transparent"
                }`}
              >
                Hak Dilupakan (Delete)
              </button>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-zinc-200 text-center">
              <Link 
                href="/syarat-ketentuan"
                className="text-[10px] font-black uppercase tracking-wider text-[#0058be] hover:underline"
              >
                Baca Syarat &amp; Ketentuan &rarr;
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <article className="md:col-span-9 space-y-8">
          
          {/* Section 1: Intro & Kebijakan */}
          <section 
            id="kebijakan-privasi" 
            ref={sectionRefs["kebijakan-privasi"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm"
          >
            <h2 className="text-xl md:text-2xl font-extrabold text-[#131b2e] mb-4">
              Kedaulatan Data &amp; Kebijakan Privasi
            </h2>
            <div className="prose max-w-none text-zinc-600 text-sm leading-relaxed space-y-4">
              <p>
                Kami di URUN mengerti betul bahwa kepercayaan adalah kunci bertetangga yang baik. Oleh karena itu, kebijakan privasi ini disusun dengan bahasa yang jelas agar Bapak/Ibu tenang dan paham bagaimana sistem ini menjaga data keluarga dan lingkungan kita.
              </p>
              <p>
                Sistem kami dirancang agar warga memegang kunci kendali atas datanya sendiri. Sesuai dengan amanat **UU PDP No. 27/2022**, Bapak/Ibu berhak melihat, mengunduh, memperbaiki, maupun meminta penghapusan total identitas digital kapan saja.
              </p>
            </div>
          </section>

          {/* Section 2: Pengumpulan Data */}
          <section 
            id="pengumpulan-data" 
            ref={sectionRefs["pengumpulan-data"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-lg font-extrabold text-[#131b2e] flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#006c49]/10 text-[#006c49] text-xs font-black flex items-center justify-center">1</span>
              Pengumpulan Data yang Esensial
            </h3>
            
            <p className="text-zinc-600 text-sm leading-relaxed">
              Kami membatasi pengumpulan data hanya pada informasi yang benar-benar krusial untuk validasi keanggotaan nyata komunitas dan transparansi pembukuan kas bertetangga:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-[#FCFBF9] border border-zinc-200 rounded-xl space-y-1">
                <span className="text-xs font-black text-[#006c49] uppercase tracking-wider">Identitas Dasar Warga</span>
                <p className="text-xs text-zinc-500">Nama lengkap dan nomor WhatsApp aktif warga. Digunakan untuk verifikasi keanggotaan oleh pengurus RT/RW serta notifikasi bot.</p>
              </div>
              <div className="p-4 bg-[#FCFBF9] border border-zinc-200 rounded-xl space-y-1">
                <span className="text-xs font-black text-[#006c49] uppercase tracking-wider">Transaksi Kas &amp; Usulan</span>
                <p className="text-xs text-zinc-500">Catatan keikutsertaan urunan iuran bulanan warga, kontribusi tender publik, serta riwayat voting transparansi.</p>
              </div>
              <div className="p-4 bg-[#FCFBF9] border border-zinc-200 rounded-xl space-y-1">
                <span className="text-xs font-black text-[#006c49] uppercase tracking-wider">Geografis Komunitas</span>
                <p className="text-xs text-zinc-500">Wilayah administratif tinggal warga (tingkat RT/RW) untuk segmentasi pembagian bahan logistik pangan kolektif.</p>
              </div>
              <div className="p-4 bg-[#FCFBF9] border border-zinc-200 rounded-xl space-y-1">
                <span className="text-xs font-black text-[#006c49] uppercase tracking-wider">Skor Dedikasi Komunal</span>
                <p className="text-xs text-zinc-500">Reputasi sosial (CP) yang mencerminkan partisipasi gotong royong dan ketepatan waktu dalam mendukung program warga.</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start mt-4">
              <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider">Bebas Pelacakan Invasif</span>
                <p className="text-xs text-amber-700/90 mt-1 leading-relaxed">
                  Kami berkomitmen **tidak mengumpulkan** riwayat penelusuran internet Anda, tap durasi, melacak cookie iklan, atau cookie pihak ketiga. **Kami 100% bebas dari Google Analytics dan Meta Pixel.**
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Penggunaan Data */}
          <section 
            id="penggunaan-data" 
            ref={sectionRefs["penggunaan-data"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-lg font-extrabold text-[#131b2e] flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#006c49]/10 text-[#006c49] text-xs font-black flex items-center justify-center">2</span>
              Cara Penggunaan Data
            </h3>
            
            <p className="text-[#131b2e] text-xs leading-relaxed">
              Data dikelola dengan aman secara lokal untuk kemandirian ekonomi simpul warga:
            </p>

            <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-2 leading-relaxed">
              <li>
                <strong className="text-[#131b2e]">Koordinasi Logistik Lapangan:</strong> Nama Anda ditampilkan secara aman pada daftar koordinator pembagian pangan kolektif di Titik Kumpul warga untuk pembagian fisik.
              </li>
              <li>
                <strong className="text-[#131b2e]">Audit Transparansi Buku Kas:</strong> Catatan kontribusi Anda diumumkan secara terbuka di Buku Kas komunal digital yang dapat diaudit secara peer-to-peer sesama warga berdomisili sama guna mematikan potensi korupsi kas.
              </li>
              <li>
                <strong className="text-[#131b2e]">Optimasi Kebutuhan Bersama:</strong> Menganalisis agregasi kuantitas belanja warga untuk mengajukan harga grosir langsung ke petani/distributor lokal terdekat.
              </li>
            </ul>
          </section>

          {/* Section 4: Jaminan Pihak Ketiga */}
          <section 
            id="jaminan-pihak-ketiga" 
            ref={sectionRefs["jaminan-pihak-ketiga"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/40 rounded-2xl shadow-sm"
          >
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[#006c49]/10 text-[#006c49] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-[#131b2e]">3. Jaminan Perlindungan Data Pihak Ketiga</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Kami menjamin secara mutlak bahwa data pribadi warga URUN **tidak akan pernah dijual, disewakan, diserahkan, atau dibagikan** kepada perusahaan korporasi periklanan, broker data, atau pihak luar mana pun untuk tujuan profil pasar komersial.
                </p>
              </div>
            </div>
          </section>

          {/* INTERACTIVE CONTROLLER: PUSAT KENDALI DATA WARGA */}
          <section 
            id="pusat-kendali-data" 
            ref={sectionRefs["pusat-kendali-data"]}
            className="p-6 md:p-8 bg-white border border-[#bbcabf]/50 rounded-2xl shadow-sm space-y-6"
          >
            <div className="border-b border-[#bbcabf]/40 pb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#006c49]">Hak Data Mandiri</span>
              <h2 className="text-xl font-extrabold text-[#131b2e] mt-1 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#006c49]" /> Pusat Kendali Data Warga
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Anda memiliki kedaulatan mutlak atas informasi Anda. Silakan kelola secara interaktif di bawah.</p>
            </div>

            {/* Sub-modul 1: Export Data */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700">1. Ekspor Data Pribadi (Simulasi Hak Memindahkan Data)</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Unduh salinan digital lengkap profil, catatan iuran lunas, dedikasi sosial, dan riwayat suara Anda dalam format berstandar untuk dipindahkan ke platform lain:
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 bg-[#131b2e] text-white hover:bg-zinc-800 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all min-h-[40px]"
                >
                  <FileJson className="w-4 h-4 text-emerald-400" /> Unduh Format JSON
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 bg-white border border-[#bbcabf] text-[#131b2e] hover:bg-zinc-50 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all min-h-[40px]"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Unduh Format CSV
                </button>
              </div>
            </div>

            {/* Sub-modul 2: Access Logs */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                <History className="w-4 h-4 text-[#006c49]" /> 2. Transparansi Radikal: Audit Log Akses Data
              </h4>
              <p className="text-xs text-zinc-500">
                Berikut adalah log audit kapan dan mengapa data kedaulatan Anda diakses oleh administrator/pengurus berwenang atau pemicu bot sistem:
              </p>
              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#FCFBF9] border-b border-zinc-200">
                    <tr>
                      <th className="p-3 text-[10px] font-black uppercase tracking-wider text-zinc-500">Waktu</th>
                      <th className="p-3 text-[10px] font-black uppercase tracking-wider text-zinc-500">Aktivitas</th>
                      <th className="p-3 text-[10px] font-black uppercase tracking-wider text-zinc-500">Tujuan Audit</th>
                      <th className="p-3 text-[10px] font-black uppercase tracking-wider text-zinc-500">Oleh</th>
                      <th className="p-3 text-[10px] font-black uppercase tracking-wider text-zinc-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-zinc-100">
                    {mockLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-zinc-50/50">
                        <td className="p-3 text-zinc-600 font-mono text-[11px] whitespace-nowrap">{log.date}</td>
                        <td className="p-3 font-bold text-[#131b2e]">{log.activity}</td>
                        <td className="p-3 text-zinc-500">{log.purpose}</td>
                        <td className="p-3 text-zinc-600 font-semibold">{log.operator}</td>
                        <td className="p-3">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5: Right to be forgotten (Hak Dilupakan) */}
          <section 
            id="hak-dilupakan" 
            ref={sectionRefs["hak-dilupakan"]}
            className="p-6 md:p-8 border border-red-200 bg-red-500/5 rounded-2xl space-y-4"
          >
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-extrabold text-red-900">Hak untuk Dilupakan (Right to Be Forgotten)</h3>
                <p className="text-xs text-red-800/80 leading-relaxed">
                  Jika Anda pindah domisili atau tidak ingin lagi menggunakan platform URUN, Anda berhak memicu penghapusan identitas Anda secara mutlak.
                </p>
                <p className="text-xs text-red-800/70">
                  Untuk alasan integritas akuntabilitas Buku Kas warga lainnya, catatan nominal uang iuran yang pernah Anda transaksikan tidak dapat dihapus, melainkan disamarkan namanya secara permanen oleh sistem menjadi <strong className="text-emerald-700">Warga_Anonim</strong>.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setShowOtpModal(true);
                      setOtpStep("phone");
                    }}
                    className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all min-h-[40px]"
                  >
                    Hapus Seluruh Data Saya
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Contact */}
          <div className="p-6 bg-[#006c49]/5 border border-[#006c49]/20 rounded-2xl text-center space-y-3">
            <p className="text-xs font-medium text-[#006c49]/90 max-w-lg mx-auto">
              Memiliki pertanyaan atau keluhan seputar tata kelola privasi kedaulatan data? Hubungi Data Protection Officer (DPO) sukarelawan kami.
            </p>
            <Link 
              href="/tentang"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#bbcabf] hover:bg-zinc-50 text-[#131b2e] rounded-lg text-xs font-black uppercase tracking-wider transition-all"
            >
              Hubungi Pengawas Data
            </Link>
          </div>

        </article>

      </div>

      {/* WHATSAPP OTP VERIFICATION SIMULATOR MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#bbcabf] shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FCFBF9] border-b border-[#bbcabf]/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#131b2e]">Verifikasi Hapus Data</span>
              </div>
              <button 
                onClick={() => setShowOtpModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* STEP 1: Phone Confirmation */}
              {otpStep === "phone" && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 leading-relaxed">
                    <strong>PERINGATAN:</strong> Kami akan mengirimkan kode OTP khusus ke WhatsApp terdaftar Anda untuk memproses penghapusan. Tindakan ini tidak dapat dibatalkan.
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Nomor WhatsApp Terdaftar</label>
                    <input 
                      type="text" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-[#bbcabf] bg-[#FCFBF9] rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#006c49]/30"
                    />
                  </div>

                  <button 
                    onClick={triggerOtpRequest}
                    className="w-full flex items-center justify-center gap-2 bg-[#006c49] text-white hover:bg-[#005236] px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all min-h-[48px]"
                  >
                    Kirim OTP Ke WhatsApp <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Input OTP & Simulated Message */}
              {otpStep === "code" && (
                <div className="space-y-4">
                  {/* Simulated WhatsApp Notification Banner */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-[#006c49]">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] font-black uppercase tracking-wider">Simulasi Notifikasi WhatsApp URUN:</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 font-mono text-[11px] text-[#131b2e] leading-normal shadow-sm">
                      <p className="font-bold text-[#006c49] mb-1">💬 URUN_SYSTEM [BOT]</p>
                      <p>Kode OTP Penghapusan Identitas Warga Anda adalah: <strong className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-xs font-black">{simulatedOtpSent}</strong>.</p>
                      <p className="text-[9.5px] text-zinc-400 mt-1">Jangan bagikan kode ini kepada siapa pun termasuk pengurus RT.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">Masukkan 4-Digit Kode OTP</label>
                    <input 
                      type="text" 
                      placeholder="XXXX"
                      value={otpCode}
                      maxLength={4}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-32 mx-auto px-4 py-3 text-center text-lg tracking-[0.5em] font-extrabold border border-[#bbcabf] bg-[#FCFBF9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006c49]/30"
                    />
                    {otpError && <p className="text-[11px] font-bold text-red-600 mt-1">{otpError}</p>}
                  </div>

                  <button 
                    onClick={verifyOtp}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all min-h-[48px]"
                  >
                    Verifikasi &amp; Hapus Data Permanen
                  </button>
                </div>
              )}

              {/* STEP 3: Success Screen */}
              {otpStep === "success" && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-[#131b2e]">Permintaan Berhasil Diproses!</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                      Seluruh identitas pribadi sensitif Anda (Nama, WhatsApp, NIK) telah **dihapus permanen** dari database utama URUN.
                    </p>
                    <div className="p-3.5 bg-[#FCFBF9] border border-emerald-500/20 rounded-2xl text-[11px] text-zinc-600 leading-relaxed text-left space-y-1">
                      <p className="font-black text-[#006c49] uppercase tracking-wider text-[9px] mb-1">Preservasi Transparansi Keuangan Warga:</p>
                      <p>
                        Catatan total pembayaran iuran Anda sebesar **Rp 250.000** tetap dipelihara di Buku Kas komunal RT 01 Kalisari. Namun, identitas nama Anda telah disamarkan secara mutlak menjadi:
                      </p>
                      <p className="text-center font-mono font-black text-[#006c49] bg-emerald-50 py-1 rounded border border-emerald-100 mt-1">
                        &quot;Warga_Anonim&quot;
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowOtpModal(false);
                      window.location.reload();
                    }}
                    className="w-full bg-[#131b2e] text-white hover:bg-zinc-800 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all min-h-[48px]"
                  >
                    Selesai &amp; Reload Halaman
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
