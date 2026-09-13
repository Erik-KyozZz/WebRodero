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
    { href: "/admin/orders", label: "Entregas & Chat", icon: MessageSquare },
    { href: "/admin/users", label: "Usuarios & Roles", icon: Users },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {/* Sidebar Nav (Desktop & Mobile Scroll) */}
        <aside className="md:col-span-1">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-1 md:sticky md:top-20 shadow-xl">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:block">
              Panel Admin - Rodero
            </div>
            <div className="flex md:flex-col overflow-x-auto gap-1 pb-1 md:pb-0 scrollbar-none">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
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
            </div>

            <div className="pt-2 md:pt-4 border-t border-slate-800 hidden md:block">
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
