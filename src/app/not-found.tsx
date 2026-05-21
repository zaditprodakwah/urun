import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-emerald-500 font-mono text-8xl font-bold">404</div>
        <h1 className="text-2xl font-bold text-white">Halaman Tidak Ditemukan</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Sistem gagal memverifikasi lokasi halaman ini di dalam node komunitas kami. Mungkin telah dipindahkan atau Anda tidak memiliki akses.
        </p>
        <div className="pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
