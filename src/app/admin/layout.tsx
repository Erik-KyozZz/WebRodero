"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sliders, MessageSquare, Users, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Presets & Servicios", icon: Sliders },
    { href: "/admin/orders", label: "Entregas & Pedidos Chat", icon: MessageSquare },
    { href: "/admin/users", label: "Usuarios & Roles", icon: Users },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <aside className="md:col-span-1 space-y-2">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1 sticky top-20">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Panel Admin - Rodero
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 font-bold shadow-lg shadow-sky-400/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-3 min-w-0">{children}</main>
      </div>
    </div>
  );
}
