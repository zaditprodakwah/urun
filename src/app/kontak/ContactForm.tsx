"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, MapPin, Mail, MessageCircle, ChevronDown } from "lucide-react";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: topic === "pitching" 
      ? "Halo Tim URUN, saya tertarik untuk menjadwalkan Technical Pitching mengenai..." 
      : topic === "whitepaper"
        ? "Halo Tim URUN, saya ingin meminta akses ke Buku Putih & Blueprint arsitektur URUN..."
        : ""
  });
  
  const [contactInfo, setContactInfo] = useState({
    email: "memuat...",
    phoneDisplay: "memuat...",
    phoneLink: "#"
  });

  useEffect(() => {
    // Anti-scraping: build contact info on client side
    const timer = setTimeout(() => {
      const user = "muhzadit";
      const domain = "gmail.com";
      const wa = "6282316363177";
      const waDisplay = "0823-1636-3177";
      
      setContactInfo({
        email: `${user}@${domain}`,
        phoneDisplay: waDisplay,
        phoneLink: `https://wa.me/${wa}?text=Halo%20URUN,%20saya%20ingin%20berdiskusi%20mengenai...`
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [topic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Terima kasih ${formData.name}. Pesan Anda telah kami rekam dan akan segera kami proses.`);
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Kolom Kiri: Form & Info */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white border border-[#bbcabf]/50 rounded-[2rem] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Kirim Pesan Resmi</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#FCFBF9] border border-[#bbcabf]/50 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#006c49] transition-colors" 
                placeholder="Cth: Budi Santoso" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Nomor WhatsApp Aktif</label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[#FCFBF9] border border-[#bbcabf]/50 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#006c49] transition-colors" 
                placeholder="Cth: 081234567890" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Pesan / Laporan</label>
              <textarea 
                rows={4} 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-[#FCFBF9] border border-[#bbcabf]/50 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#006c49] transition-colors resize-none" 
                placeholder="Tuliskan kendala atau pertanyaan Anda di sini..."
              />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#006c49] hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-700/10 mt-2 cursor-pointer border-0">
              <Send className="w-4 h-4" /> Kirim Pesan
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#bbcabf]/40 hover:border-[#006c49]/40 transition-colors shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#006c49] shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-[#006c49] transition-colors">Sekretariat URUN Nusantara</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Jl. Pangeran Cakrabuana Blok,<br/>
                Jl. Gudang Air No.179, Sendang,<br/>
                Kec. Sumber, Kabupaten Cirebon,<br/>
                Jawa Barat 45611
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#bbcabf]/40 hover:border-[#006c49]/40 transition-colors shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#006c49] shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-[#006c49] transition-colors">Surel Elektronik (Email)</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#006c49] transition-colors">{contactInfo.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: DPO & FAQ */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* DPO Widget */}
        <div className="p-6 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/50 rounded-[2rem] flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#006c49]/10 border border-[#006c49]/20 flex items-center justify-center text-[#006c49] shrink-0 shadow-lg shadow-emerald-700/5">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Lapor ke Data Protection Officer (DPO)</h3>
            <p className="text-xs text-zinc-600 mb-4 leading-relaxed font-medium">
              Menemukan pelanggaran privasi atau ingin menggunakan hak penghapusan data (UU PDP No.27/2022)? Hubungi Petugas Pengawas Data kami langsung via WhatsApp untuk respons cepat 1x24 jam.
            </p>
            <a 
              href={contactInfo.phoneLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#006c49] hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-emerald-700/20 w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp: {contactInfo.phoneDisplay}
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div>
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Pertanyaan Umum (FAQ)</h3>
          <div className="space-y-3">
            {[
              { q: "Apakah saya perlu mendownload aplikasi URUN dari PlayStore?", a: "Tidak perlu. URUN adalah platform berbasis Web (Sistem Operasi Mikro) yang terintegrasi penuh dengan WhatsApp Anda. Anda dapat mendaftar, membayar, dan memantau transparansi kas hanya dengan mengirim pesan ke nomor bot resmi URUN." },
              { q: "Bagaimana cara mendirikan simpul pengurus di RT saya?", a: "Silakan isi formulir kontak di sebelah kiri atau hubungi WhatsApp kami. Kami akan melakukan verifikasi identitas Ketua RT/RW Anda untuk mendirikan isolasi database (RLS) baru khusus untuk lingkungan Anda." },
              { q: "Apakah data warga RT saya bisa dilihat oleh RT lain?", a: "Sama sekali tidak. Kami menggunakan arsitektur Row-Level Security (RLS) tingkat lanjut. Database secara kaku mengunci akses data; sehingga Pengurus A tidak akan pernah bisa membaca Buku Kas atau Profil Warga dari Pengurus B." },
              { q: "Mengapa menggunakan metode Multi-Sig untuk pencairan dana?", a: "Ini adalah protokol keamanan tertinggi kami (Rule 5). Pencairan uang warga dalam jumlah besar (> Rp 5 Juta) tidak boleh diputuskan sepihak oleh bendahara saja. Sistem akan membekukan dana sampai 2 dari 3 perwakilan pengurus setuju via tandatangan digital WhatsApp." }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-white border border-[#bbcabf]/40 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <h4 className="text-sm font-bold text-zinc-800 pr-4">{faq.q}</h4>
                  <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-5 pt-1 text-zinc-500 font-medium text-xs leading-relaxed border-t border-zinc-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
