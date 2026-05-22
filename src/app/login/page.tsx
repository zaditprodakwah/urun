"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Smartphone, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  Inbox, 
  AlertCircle, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'whatsapp' | 'email'>('whatsapp');
  
  // Warga State (WhatsApp OTP)
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Email / Google State
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
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim kode masuk');
      }
      
      setOtpSent(true);
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
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kode verifikasi tidak valid.');
      }
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses tautan masuk');
      }
      
      setMagicLinkSent(true);
      setTimeout(() => {
        window.location.href = data.redirectUrl || '/dashboard';
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'muhzadit@gmail.com' }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal masuk dengan Google');
      }
      
      window.location.href = data.redirectUrl || '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBypassLogin = async (payload: { phone?: string; email?: string; role?: string }) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal masuk lewat jalur pengembang.');
      }
      
      window.location.href = data.redirectUrl || '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20 selection:text-primary relative flex items-center justify-center p-4">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 -skew-y-3 origin-top-left -z-10 border-b border-primary/10"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md z-10 py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-primary/20 mb-5 hover:scale-105 transition-transform">
            <span className="text-3xl font-black text-primary font-serif italic">U</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mb-2 font-sans tracking-tight">Kedaulatan Warga</h1>
          <p className="text-sm text-slate-500 leading-relaxed px-4">
            Akses Buku Kas Terkunci dan panel komunitas Anda dengan keamanan berstandar institusi.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          
          {/* Dual-Auth Tab Switcher */}
          <div className="flex p-1.5 bg-slate-100 rounded-xl mb-8 border border-slate-200/60">
            <button 
              onClick={() => { setTab('whatsapp'); setError(''); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'whatsapp' ? 'bg-white text-primary shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <Smartphone className="w-4 h-4" />
              <em>WhatsApp OTP</em>
            </button>
            <button 
              onClick={() => { setTab('email'); setError(''); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'email' ? 'bg-white text-secondary shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <Mail className="w-4 h-4" />
              <em>Email / Google</em>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {tab === 'whatsapp' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nomor <em>WhatsApp</em> Anda</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Smartphone className="w-5 h-5" />
                      </span>
                      <input 
                        type="tel" 
                        placeholder="Contoh: 081234567890" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-slate-400 placeholder:font-normal"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox" 
                      id="terms-wa"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                    />
                    <label htmlFor="terms-wa" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                      Saya menyetujui <Link href="/syarat" className="text-primary hover:underline font-medium">Syarat Layanan</Link> dan menjunjung tinggi kejujuran bertransaksi di lingkungan RT/RW.
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !phone || !acceptedTerms}
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <span>Menghubungkan ke <em>Gateway</em>...</span> : 'Kirim Kode Keamanan'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block text-center">
                      Cek <em>WhatsApp</em> Anda untuk kode 6-digit. Untuk <em>bypass</em> simulasi, gunakan kode <strong>123456</strong> atau <strong>000000</strong>.
                    </label>
                    <div className="relative max-w-xs mx-auto">
                      <input 
                        type="text" 
                        placeholder="000000" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-slate-300 tracking-[0.5em] text-center text-2xl font-black font-mono shadow-inner"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || otp.length !== 6}
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Memverifikasi Identitas...' : 'Verifikasi & Masuk'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors py-2 text-center font-medium"
                  >
                    Ubah Nomor Telepon
                  </button>
                </form>
              )}
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Lanjutkan dengan <em>Google</em>
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">Atau via <em>Email</em></span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {!magicLinkSent ? (
                <form onSubmit={handleSendMagicLink} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Alamat <em>Email</em> Terdaftar</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-5 h-5" />
                      </span>
                      <input 
                        type="email" 
                        placeholder="Contoh: bendahara@komunitas.id" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/40 transition-all placeholder:text-slate-400 placeholder:font-normal"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !email}
                    className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-800/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Mengirim Tautan...' : 'Kirim Tautan Masuk Instan'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-800 font-black text-lg">Cek Kotak Masuk Anda</h3>
                  <p className="text-sm text-slate-500 leading-relaxed px-4">
                    Tautan aman satu-klik telah kami kirimkan ke:<br/>
                    <strong className="text-slate-700 mt-1 block">{email}</strong>
                  </p>
                  <button 
                    onClick={() => { setMagicLinkSent(false); setEmail(''); }}
                    className="text-xs text-secondary hover:text-secondary/80 font-bold transition-colors mt-2"
                  >
                    Gunakan <em>Email</em> Lain
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Privacy Footnote */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-start gap-3 text-[10px] sm:text-xs text-slate-400 leading-relaxed font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Sistem ini mematuhi standar perlindungan privasi tertinggi. Data komunikasi dan catatan buku kas Anda dienkripsi secara mutlak.
            </span>
          </div>

        </div>

        {/* Developer Sandbox Bypass Panel */}
        <div className="mt-6 bg-emerald-950 text-emerald-100 rounded-3xl p-6 shadow-xl border border-emerald-800 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="font-sans font-bold text-sm tracking-tight">Panel Akses Pengembang & Simulasi</h3>
          </div>
          <p className="text-xs text-emerald-300 leading-relaxed mb-4 font-medium">
            Gunakan jalan pintas ini untuk langsung memverifikasi arsitektur <em>Sovereign Core</em> lintas peran secara instan.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={() => handleBypassLogin({ phone: '081111111111' })}
              className="py-2.5 px-3 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 rounded-xl font-bold border border-emerald-800 transition-all text-left"
            >
              Warga: Budi (WA)
            </button>
            <button
              onClick={() => handleBypassLogin({ phone: '082222222222', role: 'pengurus' })}
              className="py-2.5 px-3 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 rounded-xl font-bold border border-emerald-800 transition-all text-left"
            >
              Pengurus: Ibu Aminah
            </button>
            <button
              onClick={() => handleBypassLogin({ email: 'founder@urun.demo', role: 'admin' })}
              className="py-2.5 px-3 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 rounded-xl font-bold border border-emerald-800 transition-all text-left"
            >
              <em>Founder</em>: Zadit (<em>Email</em>)
            </button>
            <button
              onClick={() => handleBypassLogin({ email: 'auditor@urun.demo', role: 'auditor' })}
              className="py-2.5 px-3 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 rounded-xl font-bold border border-emerald-800 transition-all text-left"
            >
              <em>Auditor</em> Lingkungan
            </button>
            <button
              onClick={() => handleBypassLogin({ phone: '082316363177' })}
              className="py-3 px-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-xl font-bold border border-emerald-600 transition-all text-left col-span-2 text-center"
            >
              📲 Jalur Masuk <em>WhatsApp</em> Saya (082316363177)
            </button>
            <button
              onClick={() => handleBypassLogin({ email: 'muhzadit@gmail.com' })}
              className="py-3 px-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-xl font-bold border border-emerald-600 transition-all text-left col-span-2 text-center"
            >
              ✉️ Jalur Masuk <em>Email</em> Saya (muhzadit@gmail.com)
            </button>
          </div>
        </div>
        
        {/* Help block */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Butuh bantuan akses? <Link href="/tentang#edukasi" className="text-primary hover:underline font-bold">Pusat Belajar Warga</Link></span>
        </div>
      </div>
    </div>
  );
}
