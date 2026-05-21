"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getOfflineQueue, syncOfflineMutations, initAutomaticSync } from '@/lib/sync/sync_engine';

export default function SyncStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  // Update connection and queue states
  const updateState = () => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    setQueueCount(getOfflineQueue().length);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    Promise.resolve().then(() => {
      updateState();
    });

    const handleConnectionChange = () => {
      updateState();
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Watch for state changes in localstorage queue count
    const interval = setInterval(updateState, 3000);

    // Register automatic synchronization when transitioning online
    initAutomaticSync((res) => {
      setMessage(`🔄 Sukses sinkronisasi ${res.syncedCount} entri.`);
      setTimeout(() => setMessage(''), 5000);
      updateState();
    });

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    if (syncing || queueCount === 0 || !isOnline) return;

    try {
      setSyncing(true);
      setMessage('Sinkronisasi data ke cloud...');
      const res = await syncOfflineMutations((msg) => setMessage(msg));
      
      if (res.success) {
        setMessage(`✅ Berhasil menyinkronkan ${res.syncedCount} transaksi!`);
      } else if (res.syncedCount > 0) {
        setMessage(`⚠️ Tersinkron sebagian: ${res.syncedCount} sukses, ${res.errors.length} gagal.`);
      } else {
        setMessage(`❌ Sinkronisasi gagal: ${res.errors[0] || 'Periksa server'}`);
      }
      
      setTimeout(() => setMessage(''), 6000);
      updateState();
    } catch (err) {
      console.error(err);
      setMessage('❌ Terjadi kesalahan jaringan.');
      setTimeout(() => setMessage(''), 6000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-emerald-400 px-2.5 py-1 rounded-lg font-medium shadow-md animate-pulse">
          {message}
        </span>
      )}

      <div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all duration-500 ${
          isOnline
            ? queueCount > 0
              ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
              : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
            : 'bg-zinc-900 border-zinc-800 text-zinc-500'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className={`w-3.5 h-3.5 ${queueCount > 0 ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`} />
            <span className="font-semibold select-none">
              {queueCount > 0 ? `Online (Tertunda: ${queueCount})` : 'Online'}
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-zinc-500 animate-bounce" />
            <span className="font-semibold select-none">
              Offline {queueCount > 0 && `(${queueCount} Mutasi Lokal)`}
            </span>
          </>
        )}

        {isOnline && queueCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={syncing}
            title="Klik untuk paksa sinkronisasi sekarang"
            className="ml-1 p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}
