"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'warga' | 'pengurus'>('warga');
  
  // Warga State
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devBypassCode, setDevBypassCode] = useState('');

  // Pengurus State
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.status) {
        throw new Error(data.error || 'Gagal mengirim OTP');
      }
      
      setOtpSent(true);
      if (data.devBypass) {
        setDevBypassCode(data.devBypass); // For local dev bypass
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.status) {
        throw new Error(data.error || 'OTP tidak valid');
      }
      
      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Typically you'd call Supabase auth directly here, 
      // but for this phase we can simulate or call an endpoint.
      // Assuming supabaseBrowser handles it in a real setup.
      // Since it's a fallback, let's just show the UI for now.
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative flex items-center justify-center p-4">
      {/* Radial Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20 mb-4 hover:scale-105 transition-transform">
            <span className="text-2xl font-bold text-zinc-950">U</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Masuk ke URUN</h1>
          <p className="text-sm text-zinc-400">Pilih metode otentikasi untuk mengakses simpul komunitas Anda.</p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Tabs */}
          <div className="flex p-1 bg-zinc-950 rounded-lg mb-8 border border-zinc-800">
            <button 
              onClick={() => { setTab('warga'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === 'warga' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Warga (WhatsApp)
            </button>
            <button 
              onClick={() => { setTab('pengurus'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === 'pengurus' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Pengurus (Email)
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {tab === 'warga' && (
            <div className="space-y-6">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nomor WhatsApp</label>
                    <input 
                      type="text" 
                      placeholder="0812xxxxxx" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || !phone}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-bold hover:from-emerald-400 hover:to-emerald-300 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? 'Memproses...' : 'Kirim Kode OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Kode Verifikasi (6-Digit)</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan 6 digit angka" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600 tracking-widest text-center text-xl font-mono"
                      required
                    />
                    {devBypassCode && (
                      <div className="mt-2 text-xs text-emerald-400 font-mono text-center">
                        DEV MODE BYPASS CODE: {devBypassCode}
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-bold hover:from-emerald-400 hover:to-emerald-300 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? 'Memverifikasi...' : 'Verifikasi Masuk'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setOtp(''); setDevBypassCode(''); }}
                    className="w-full py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Ubah Nomor WhatsApp
                  </button>
                </form>
              )}
            </div>
          )}

          {tab === 'pengurus' && (
            <div className="space-y-6">
              {!magicLinkSent ? (
                <form onSubmit={handleSendMagicLink} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Pengurus</label>
                    <input 
                      type="email" 
                      placeholder="pengurus@komunitas.id" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || !email}
                    className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? 'Memproses...' : 'Kirim Magic Link'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">Cek Inbox Anda</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Kami telah mengirimkan tautan masuk rahasia ke <br/><strong className="text-zinc-300">{email}</strong>
                  </p>
                  <button 
                    onClick={() => setMagicLinkSent(false)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 pt-4"
                  >
                    Kirim ulang email
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
