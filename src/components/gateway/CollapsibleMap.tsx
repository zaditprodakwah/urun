"use client";

import React, { useState } from 'react';
import { Map, MapPinOff } from 'lucide-react';

interface CollapsibleMapProps {
  lat: number;
  lng: number;
  locationName: string;
}

export default function CollapsibleMap({ lat, lng, locationName }: CollapsibleMapProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-4 border-t border-zinc-100 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Peta Lokasi Geografis RT/RW</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {isOpen ? <MapPinOff className="w-3.5 h-3.5" /> : <Map className="w-3.5 h-3.5" />}
          {isOpen ? 'Tutup Peta' : 'Buka Peta'}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {isOpen && (
          <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 relative mt-2">
            <iframe 
              title={`Peta Lokasi ${locationName}`}
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              className="absolute inset-0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
            ></iframe>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-none">
                <span className="bg-white/90 backdrop-blur-sm text-zinc-700 font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-sm border border-zinc-200 pointer-events-auto flex items-center gap-1.5 uppercase tracking-wider">
                    Lokasi: {locationName}
                </span>
                <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`} target="_blank" rel="noreferrer" className="bg-emerald-600/90 hover:bg-emerald-700 backdrop-blur-sm text-white font-bold uppercase tracking-wider text-[9px] px-3 py-1 rounded shadow-sm pointer-events-auto transition-colors flex items-center">
                    Buka Peta Maps
                </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
