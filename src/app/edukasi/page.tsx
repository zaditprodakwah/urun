import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, CreditCard, ChevronRight, Store } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EdukasiWarga() {
  return (
    <div className="min-h-screen flex flex-col bg-surface selection:bg-primary/20 selection:text-primary">
      <Navbar session={null} reputationScore={0} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-16 bg-primary text-white text-center px-6 border-b border-primary-container/20">
          <BookOpen className="w-12 h-12 mx-auto mb-5 text-primary-container" />
          <h1 className="text-3xl md:text-4xl font-black mb-3 font-sans">Pusat Belajar Warga URUN</h1>
          <p className="text-primary-container text-sm max-w-md mx-auto leading-relaxed">
            Selamat datang! Pelajari cara mudah mengurus kas lingkungan, berbelanja, dan bersuara secara aman dalam 3 langkah sederhana.
          </p>
        </section>

        {/* Konten Edukasi Interaktif */}
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          
          {/* Modul 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:border-primary/30 transition-colors">
            <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
              <CreditCard className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-on-surface mb-2">Cara Membayar Iuran Kas</h2>
              <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                Iuran kas lingkungan kini bisa ditransfer langsung dari HP Anda. Uang yang masuk otomatis dicatat dalam "Buku Kas Terkunci" yang kebenarannya bisa dipantau seluruh warga setiap detik. Tidak ada lagi catatan buku tulis yang hilang!
              </p>
              <button className="text-primary font-bold text-xs flex items-center gap-1 mx-auto md:mx-0 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                Lihat Panduan Bergambar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modul 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:border-secondary/30 transition-colors md:flex-row-reverse">
            <div className="w-20 h-20 bg-secondary/5 rounded-2xl flex items-center justify-center shrink-0">
              <Store className="w-10 h-10 text-secondary" />
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-xl font-bold text-on-surface mb-2">Beli Dagangan Tetangga Lokal</h2>
              <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                Dukung perputaran ekonomi RT/RW dengan membeli Sembako atau memesan jasa lewat Katalog Warga. Pilih barangnya, lalu ngobrol dan nego langsung dengan tetangga Anda lewat WhatsApp.
              </p>
              <Link href="/catalog" className="text-secondary font-bold text-xs flex items-center justify-end gap-1 mx-auto md:mx-0 hover:bg-secondary/5 px-3 py-1.5 rounded-lg transition-colors w-fit md:ml-auto">
                Lihat Pasar Warga <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Modul 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:border-tertiary/30 transition-colors">
            <div className="w-20 h-20 bg-tertiary/5 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-10 h-10 text-tertiary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-on-surface mb-2">Menentukan Arah Komunitas (Voting)</h2>
              <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                Pengurus tidak boleh mengeluarkan kas besar tanpa izin Anda. Gunakan hak suara Anda dari rumah untuk menyetujui (atau menolak) proposal perbaikan jalan, pembelian alat, hingga aturan lingkungan.
              </p>
              <button className="text-tertiary font-bold text-xs flex items-center gap-1 mx-auto md:mx-0 hover:bg-tertiary/5 px-3 py-1.5 rounded-lg transition-colors">
                Pelajari Cara Voting <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
