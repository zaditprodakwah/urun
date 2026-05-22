"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, Shield, LogOut, Home, ShoppingBag, Trophy, Info, User } from "lucide-react";
import type { UserSession } from "@/lib/auth";
import SyncStatusIndicator from "@/components/SyncStatusIndicator";

interface NavbarProps {
  session: UserSession | null;
  reputationScore?: number;
}

export default function Navbar({ session, reputationScore = 0 }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/catalog" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Tentang", href: "/tentang" },
  ];

  return (
    <>
      {/* ================= DESKTOP & MOBILE STATIC TOP HEADER ================= */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/90 border-b border-outline-variant/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link prefetch={true} href="/" className="flex items-center gap-3 shrink-0 group min-h-[48px] px-1 active:scale-95 active:opacity-70 transition-all">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-sm shadow-primary/10 group-hover:shadow-primary/20 transition-shadow">
              <span className="text-lg font-extrabold text-white">U</span>
            </div>
            <span className="text-lg font-black tracking-tight text-on-surface group-hover:text-primary transition-colors">URUN</span>
          </Link>

          {/* Desktop Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`text-xs font-black uppercase tracking-wider transition-all py-5 border-b-2 active:scale-95 active:opacity-70 ${
                    isActive 
                      ? "text-primary border-primary" 
                      : "text-on-surface-variant/80 hover:text-on-surface border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Top Bar Indicators & Auth (Desktop & Mobile Header Status) */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <SyncStatusIndicator />

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-4 min-w-[150px] justify-end">
              {!session ? (
                <Link
                  prefetch={true}
                  href="/login"
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-primary rounded-full hover:bg-primary-container hover:shadow-md transition-all active:scale-95 active:opacity-70 min-h-[40px] flex items-center"
                >
                  Masuk Komunitas
                </Link>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className="flex items-center gap-2 p-1 rounded-full border border-outline-variant bg-surface-container-low hover:bg-surface-container transition-colors min-h-[40px] px-2.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-black uppercase">
                      {session.name ? session.name.substring(0, 2) : "UR"}
                    </div>
                    <span className="text-xs font-black text-on-surface truncate max-w-[90px]">
                      {session.name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-outline-variant bg-white shadow-xl overflow-hidden py-1 z-50">
                      <div className="px-4 py-3 border-b border-outline-variant/60 bg-surface-container-low">
                        <p className="text-[10px] uppercase font-black text-zinc-400">Dedikasi Warga</p>
                        <p className="text-xs font-black text-primary mt-0.5">{reputationScore} CP ★</p>
                        <p className="text-[9px] font-black bg-emerald-500/10 text-emerald-800 px-2 py-0.5 rounded border border-emerald-500/20 inline-block uppercase tracking-wider mt-2 capitalize">{session.role}</p>
                      </div>
                      
                      <div className="p-2 space-y-1">
                        <Link prefetch={true} href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg transition-all active:scale-95 active:opacity-70">
                          <LayoutDashboard className="w-4 h-4 text-on-surface-variant" />
                          Dashboard Warga
                        </Link>
                        
                        {(session.role === 'pengurus' || session.role === 'admin') && (
                          <>
                            <Link prefetch={true} href="/admin" className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg transition-all active:scale-95 active:opacity-70">
                              <Shield className="w-4 h-4 text-primary" />
                              Pusat Kendali
                            </Link>
                            <Link prefetch={true} href="/system/monitoring" className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-on-surface hover:text-secondary hover:bg-surface-container-low rounded-lg transition-all active:scale-95 active:opacity-70">
                              <Info className="w-4 h-4 text-secondary" />
                              Observasi Sistem
                            </Link>
                          </>
                        )}
                      </div>
                      
                      <div className="p-2 border-t border-outline-variant/60">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-error hover:text-error/80 hover:bg-error-container/20 rounded-lg transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar Sesi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Mini Avatar Header indicator */}
            {session && (
              <Link 
                prefetch={true}
                href="/dashboard" 
                className="md:hidden w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-black uppercase min-w-[32px] active:scale-95 active:opacity-70 transition-all"
                aria-label="Dashboard Warga"
              >
                {session.name ? session.name.substring(0, 2) : "UR"}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM-DOCKED TAB BAR ================= */}
      {/* Visible only on screens < md, handles all key navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-outline-variant/60 flex justify-around items-center h-16 pb-safe z-40 shadow-lg px-2">
        {/* Tab 1: Beranda */}
        <Link 
          prefetch={true}
          href="/" 
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-all active:scale-95 active:opacity-70 ${
            pathname === "/" ? "text-primary font-black" : "text-on-surface-variant/80 hover:text-on-surface"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Beranda</span>
        </Link>

        {/* Tab 2: Katalog */}
        <Link 
          prefetch={true}
          href="/catalog" 
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-all active:scale-95 active:opacity-70 ${
            pathname.startsWith("/catalog") ? "text-primary font-black" : "text-on-surface-variant/80 hover:text-on-surface"
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Katalog</span>
        </Link>

        {/* Tab 3: Leaderboard */}
        <Link 
          prefetch={true}
          href="/leaderboard" 
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-all active:scale-95 active:opacity-70 ${
            pathname === "/leaderboard" ? "text-primary font-black" : "text-on-surface-variant/80 hover:text-on-surface"
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Papan</span>
        </Link>

        {/* Tab 4: Tentang */}
        <Link 
          prefetch={true}
          href="/tentang" 
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-all active:scale-95 active:opacity-70 ${
            pathname === "/tentang" ? "text-primary font-black" : "text-on-surface-variant/80 hover:text-on-surface"
          }`}
        >
          <Info className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Tentang</span>
        </Link>

        {/* Tab 5: Akun */}
        <Link 
          prefetch={true}
          href={session ? "/dashboard" : "/login"} 
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-all active:scale-95 active:opacity-70 ${
            pathname === "/dashboard" || pathname === "/login" ? "text-primary font-black" : "text-on-surface-variant/80 hover:text-on-surface"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-black uppercase tracking-wider">
            {session ? "Akun" : "Masuk"}
          </span>
        </Link>
      </nav>
    </>
  );
}
