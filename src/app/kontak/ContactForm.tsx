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
    message: ""
  });
  
  const [contactInfo, setContactInfo] = useState({
    email: "memuat...",
    phoneDisplay: "memuat...",
    phoneLink: "#"
  });

  useEffect(() => {
    // Pre-fill message based on topic
    if (topic === "pitching") {
      setFormData(prev => ({ ...prev, message: "Halo Tim URUN, saya tertarik untuk menjadwalkan Technical Pitching mengenai..." }));
    } else if (topic === "whitepaper") {
      setFormData(prev => ({ ...prev, message: "Halo Tim URUN, saya ingin meminta akses ke Buku Putih & Blueprint arsitektur URUN..." }));
    }

    // Anti-scraping: build contact info on client side
    const user = "muhzadit";
    const domain = "gmail.com";
    const wa = "6282316363177";
    const waDisplay = "0823-1636-3177";
    
    setContactInfo({
      email: `${user}@${domain}`,
      phoneDisplay: waDisplay,
      phoneLink: `https://wa.me/${wa}?text=Halo%20URUN,%20saya%20ingin%20berdiskusi%20mengenai...`
    });
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
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Kirim Pesan Resmi</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                placeholder="Cth: Budi Santoso" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Nomor WhatsApp Aktif</label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                placeholder="Cth: 081234567890" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Pesan / Laporan</label>
              <textarea 
                rows={4} 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none" 
                placeholder="Tuliskan kendala atau pertanyaan Anda di sini..."
              />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-4 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/10 mt-2 cursor-pointer border-0">
              <Send className="w-4 h-4" /> Kirim Pesan
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Sekretariat URUN Nusantara</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Jl. Pangeran Cakrabuana Blok,<br/>
                Jl. Gudang Air No.179, Sendang,<br/>
                Kec. Sumber, Kabupaten Cirebon,<br/>
                Jawa Barat 45611
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Surel Elektronik (Email)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <a href={`mailto:${contactInfo.email}`} className="hover:text-emerald-400 transition-colors">{contactInfo.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: DPO & FAQ */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* DPO Widget */}
        <div className="p-6 bg-gradient-to-br from-emerald-900/40 to-zinc-900 border border-emerald-900/50 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Lapor ke Data Protection Officer (DPO)</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Menemukan pelanggaran privasi atau ingin menggunakan hak penghapusan data (UU PDP No.27/2022)? Hubungi Petugas Pengawas Data kami langsung via WhatsApp untuk respons cepat 1x24 jam.
            </p>
            <a 
              href={contactInfo.phoneLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp: {contactInfo.phoneDisplay}
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Pertanyaan Umum (FAQ)</h3>
          <div className="space-y-3">
            {[
              { q: "Apakah saya perlu mendownload aplikasi URUN dari PlayStore?", a: "Tidak perlu. URUN adalah platform berbasis Web (Sistem Operasi Mikro) yang terintegrasi penuh dengan WhatsApp Anda. Anda dapat mendaftar, membayar, dan memantau transparansi kas hanya dengan mengirim pesan ke nomor bot resmi URUN." },
              { q: "Bagaimana cara mendirikan simpul pengurus di RT saya?", a: "Silakan isi formulir kontak di sebelah kiri atau hubungi WhatsApp kami. Kami akan melakukan verifikasi identitas Ketua RT/RW Anda untuk mendirikan isolasi database (RLS) baru khusus untuk lingkungan Anda." },
              { q: "Apakah data warga RT saya bisa dilihat oleh RT lain?", a: "Sama sekali tidak. Kami menggunakan arsitektur Row-Level Security (RLS) tingkat lanjut. Database secara kaku mengunci akses data; sehingga Pengurus A tidak akan pernah bisa membaca Buku Kas atau Profil Warga dari Pengurus B." },
              { q: "Mengapa menggunakan metode Multi-Sig untuk pencairan dana?", a: "Ini adalah protokol keamanan tertinggi kami (Rule 5). Pencairan uang warga dalam jumlah besar (> Rp 5 Juta) tidak boleh diputuskan sepihak oleh bendahara saja. Sistem akan membekukan dana sampai 2 dari 3 perwakilan pengurus setuju via tandatangan digital WhatsApp." }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                  <h4 className="text-sm font-bold text-zinc-200 pr-4">{faq.q}</h4>
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-5 pt-1 text-zinc-400 text-xs leading-relaxed">
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
