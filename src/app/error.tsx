"use client";

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#131b2e]">Kegagalan Sistem Internal</h1>
        <p className="text-zinc-650 text-sm leading-relaxed">
          Sovereign Core mendeteksi kesalahan fatal saat memproses permintaan Anda. Hal ini bisa terjadi karena anomali jaringan atau kegagalan otorisasi RLS.
        </p>
        <div className="pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors border border-zinc-700"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Kembali Eksekusi
          </button>
        </div>
      </div>
    </div>
  );
}
