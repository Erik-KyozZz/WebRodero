"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User as UserIcon, LogOut, ShieldAlert, Sliders, Download, Menu, X } from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-lg sm:text-xl tracking-wider text-white">
          <div className="w-8 h-8 bg-sky-400 rounded-xl flex items-center justify-center text-slate-950 shadow-md shadow-sky-400/30 flex-shrink-0">
            <Sliders className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="truncate">RODERO <span className="text-sky-400">MUSIC</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="hover:text-sky-400 transition-colors text-sm font-medium">
            Presets & Servicios
          </Link>

          {session && (
            <Link href="/my-orders" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors text-sm font-medium text-slate-300">
              <Download className="w-4 h-4 text-sky-400" />
              Mis Descargas
            </Link>
          )}
          
          {(session?.user as any)?.role === "admin" && (
            <Link href="/admin" className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors text-sm font-semibold bg-sky-400/10 px-3 py-1.5 rounded-lg border border-sky-500/20">
              <ShieldAlert className="w-4 h-4" />
              Panel Admin
            </Link>
          )}

          <Link href="/cart" className="relative p-2 hover:bg-slate-800 rounded-full transition-colors" title="Carrito">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-400 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden lg:inline max-w-[150px] truncate">{session.user?.email}</span>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-sky-400/20"
            >
              <UserIcon className="w-4 h-4" />
              Acceso
            </Link>
          )}
        </nav>

        {/* Mobile controls & toggle button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative p-2 hover:bg-slate-800 rounded-full transition-colors" title="Carrito">
            <ShoppingBag className="w-5 h-5 text-slate-200" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-400 text-slate-950 text-xs font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors"
          >
            Presets & Servicios
          </Link>

          {session && (
            <Link
              href="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors"
            >
              <Download className="w-5 h-5 text-sky-400" />
              Mis Descargas
            </Link>
          )}

          {(session?.user as any)?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-base font-semibold text-sky-400 bg-sky-400/10 border border-sky-500/20"
            >
              <ShieldAlert className="w-5 h-5" />
              Panel Admin
            </Link>
          )}

          <div className="pt-2 border-t border-slate-800/80">
            {session ? (
              <div className="space-y-3">
                <div className="px-3 text-xs text-slate-400 truncate">{session.user?.email}</div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl text-base font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-sky-400/20 text-sm"
              >
                <UserIcon className="w-4 h-4" />
                Acceder a mi cuenta
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

