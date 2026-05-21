"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard, Shield, LogOut } from "lucide-react";
import type { UserSession } from "@/lib/auth";
import SyncStatusIndicator from "@/components/SyncStatusIndicator";

interface NavbarProps {
  session: UserSession | null;
  reputationScore?: number;
}

export default function Navbar({ session, reputationScore = 0 }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { label: "Kontak", href: "/kontak" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/75 border-b border-zinc-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <span className="text-xl font-bold text-zinc-950">U</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">URUN</span>
        </Link>

        {/* Desktop Navigation (Silo) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-emerald-400 border-b-2 border-emerald-500 py-5" 
                    : "text-zinc-400 hover:text-white py-5 border-b-2 border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Section (Desktop) */}
        <div className="hidden md:flex items-center justify-end gap-4 min-w-[200px]">
          <SyncStatusIndicator />
          {!session ? (
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-zinc-950 bg-emerald-500 rounded-full hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
            >
              Masuk Komunitas
            </Link>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold uppercase">
                  {session.name ? session.name.substring(0, 2) : "UR"}
                </div>
                <span className="text-sm font-medium text-zinc-200 truncate max-w-[100px]">
                  {session.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu (Glassmorphic Grid) */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-2xl overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-950/30">
                    <p className="text-xs text-zinc-400">Dedikasi: <span className="text-emerald-400 font-bold">{reputationScore} ★</span></p>
                    <p className="text-xs text-zinc-400 mt-0.5">Peran: <span className="text-zinc-200 font-medium capitalize">{session.role}</span></p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                      Dashboard Saya
                    </Link>
                    
                    {(session.role === 'pengurus' || session.role === 'admin') && (
                      <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        Pusat Kendali Pengurus
                      </Link>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-zinc-800/50">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
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

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <SyncStatusIndicator />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[64px] left-0 w-full border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-xl shadow-2xl">
          <div className="px-4 py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  pathname === link.href ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-zinc-900 my-2"></div>
            
            {!session ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mt-2 px-5 py-3 text-center text-sm font-semibold text-zinc-950 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Masuk Komunitas
              </Link>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="px-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{session.name}</p>
                    <p className="text-xs text-zinc-500 capitalize">{session.role} • {reputationScore} ★</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-lg">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard Saya
                  </Link>
                  {(session.role === 'pengurus' || session.role === 'admin') && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-emerald-400 hover:bg-zinc-900 rounded-lg">
                      <Shield className="w-4 h-4" /> Pusat Kendali Pengurus
                    </Link>
                  )}
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-zinc-900 rounded-lg text-left">
                    <LogOut className="w-4 h-4" /> Keluar Sesi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
