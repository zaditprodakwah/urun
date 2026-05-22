import React, { Suspense } from "react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Hubungi Kami",
  description: "Kontak URUN dan Pengawas Data Pribadi (DPO)",
};

export default function KontakPage() {
  return (
    <div className="flex-1 w-full relative overflow-x-hidden pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Hubungi Tim <span className="text-emerald-400">URUN</span></h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Punya pertanyaan mengenai pembuatan simpul baru, audit transparansi, atau perlindungan data privasi? Hubungi kami atau Pengawas Data Pribadi (DPO) melalui jalur resmi di bawah.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-zinc-500 text-sm">Memuat formulir kontak...</div>}>
          <ContactForm />
        </Suspense>

      </div>
    </div>
  );
}
