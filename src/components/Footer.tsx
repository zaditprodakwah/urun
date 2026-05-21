import React from "react";
import Link from "next/link";
import { ShieldCheck, Server } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* KOLOM 1: IDENTITAS & KEPATUHAN */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-lg font-bold text-zinc-950">U</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">URUN</span>
            </div>
            
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sistem Operasi Mikro-Komunitas digital berdaulat. Menegakkan transparansi keuangan kolektif, perlindungan privasi siber, dan penguatan demokrasi lokal di tingkat akar rumput tanpa pelacakan komersial.
            </p>
            
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                Patuh UU PDP No. 27/2022
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 text-[11px] font-medium w-fit">
                <Server className="w-3.5 h-3.5" />
                Infrastruktur Otonom 🇮🇩
              </div>
            </div>
          </div>

          {/* KOLOM 2: KANAL UTAMA */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Kanal Utama</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Beranda Utama</Link>
              </li>
              <li>
                <Link href="/catalog" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Katalog Program</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Papan Dedikasi Warga</Link>
              </li>
              <li>
                <Link href="/tentang" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Tentang Gerakan Kami</Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: LEGALITAS DATA */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Legalitas & Data</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/kebijakan-privasi" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Kebijakan Privasi (PDP)</Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Syarat & Ketentuan (ToS)</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Pusat Data Mandiri</Link>
              </li>
              <li>
                <Link href="/kontak" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Daftar Pengurus Baru</Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: ONBOARDING */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Gabung Jaringan</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Ingin mendirikan simpul pengurus mandiri di RT/RW Anda?
            </p>
            <Link 
              href="/kontak" 
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
          
        </div>
        
        {/* FOOTER BOTTOM */}
        <div className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} URUN. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="text-xs text-zinc-500">
            Dibangun dengan dedikasi untuk Indonesia 🇮🇩
          </p>
        </div>
      </div>
    </footer>
  );
}
