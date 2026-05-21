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
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/80 border-b border-outline-variant/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-sm shadow-primary/10 group-hover:shadow-primary/20 transition-shadow">
            <span className="text-xl font-bold text-white">U</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">URUN</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors py-5 border-b-2 ${
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

        {/* Auth Section (Desktop) */}
        <div className="hidden md:flex items-center justify-end gap-4 min-w-[200px]">
          <SyncStatusIndicator />
          {!session ? (
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-container hover:shadow-md transition-all active:scale-95"
            >
              Masuk Komunitas
            </Link>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-outline-variant bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                  {session.name ? session.name.substring(0, 2) : "UR"}
                </div>
                <span className="text-sm font-medium text-on-surface truncate max-w-[100px]">
                  {session.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-outline-variant bg-surface shadow-lg overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-outline-variant/60 bg-surface-container-low">
                    <p className="text-xs text-on-surface-variant">Dedikasi: <span className="text-primary font-bold">{reputationScore} ★</span></p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Peran: <span className="text-on-surface font-medium capitalize">{session.role}</span></p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-on-surface-variant" />
                      Dashboard Warga
                    </Link>
                    
                    {(session.role === 'pengurus' || session.role === 'admin') && (
                      <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors">
                        <Shield className="w-4 h-4 text-primary" />
                        Pusat Kendali Pengurus
                      </Link>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-outline-variant/60">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:text-error/80 hover:bg-error-container/20 rounded-lg transition-colors text-left"
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
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[64px] left-0 w-full border-b border-outline-variant/60 bg-surface/95 backdrop-blur-xl shadow-lg">
          <div className="px-4 py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  pathname === link.href ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-outline-variant/60 my-2"></div>
            
            {!session ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mt-2 px-5 py-3 text-center text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-container transition-colors"
              >
                Masuk Komunitas
              </Link>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="px-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{session.name}</p>
                    <p className="text-xs text-on-surface-variant capitalize">{session.role} • {reputationScore} ★</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard Warga
                  </Link>
                  {(session.role === 'pengurus' || session.role === 'admin') && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-primary hover:bg-surface-container-low rounded-lg">
                      <Shield className="w-4 h-4" /> Pusat Kendali Pengurus
                    </Link>
                  )}
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-surface-container-low rounded-lg text-left">
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
