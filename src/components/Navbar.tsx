"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User as UserIcon, LogOut, ShieldAlert, Sliders } from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-wider text-white">
          <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/30">
            <Sliders className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span>RODERO <span className="text-cyan-400">MUSIC</span></span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="hover:text-cyan-400 transition-colors text-sm font-medium">
            Presets & Servicios
          </Link>
          
          {(session?.user as any)?.role === "admin" && (
            <Link href="/admin" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold bg-cyan-400/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
              <ShieldAlert className="w-4 h-4" />
              Panel Admin
            </Link>
          )}

          <Link href="/cart" className="relative p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
            >
              <UserIcon className="w-4 h-4" />
              Acceso
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
