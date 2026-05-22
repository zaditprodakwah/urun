import React from 'react';
import { Star, ShieldCheck, Activity, MessageSquareQuote } from 'lucide-react';

export default function SocialProofEmbedWidget() {
  const TESTIMONIALS = [
    {
      id: 1,
      role: "Bendahara",
      location: "Taman Sari (RT 04)",
      content: "Bebas fitnah, perhitungan ledger integer mutlak. Tidur jadi lebih nyenyak.",
      rating: 5,
    },
    {
      id: 2,
      role: "Warga IT",
      location: "Perumahan BSD",
      content: "Sebagai orang IT, saya salut dengan Row-Level Security URUN. Privasi aman.",
      rating: 5,
    }
  ];

  return (
    <div className="min-h-screen bg-transparent p-2 font-sans flex flex-col gap-4">
      {/* Trust Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border border-zinc-200 shadow-sm flex flex-col items-center text-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-black font-mono text-zinc-900 leading-none">14.2M</h3>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Total Tersirkulasi</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-zinc-200 shadow-sm flex flex-col items-center text-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-black font-mono text-zinc-900 leading-none">98.5%</h3>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Kuorum Kas</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100">
          <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Ulasan Teranonimisasi</span>
        </div>
        
        <div className="space-y-3">
          {TESTIMONIALS.map((testi) => (
            <div key={testi.id} className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <div className="flex gap-0.5 mb-1">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">&quot;{testi.content}&quot;</p>
              <div className="mt-2 text-[9px] font-bold text-zinc-400 uppercase">
                {testi.role} • {testi.location}
              </div>
            </div>
          ))}
        </div>

        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full py-2 text-center text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          Lihat Teknologi URUN →
        </a>
      </div>
    </div>
  );
}
