"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-slate-950 text-white">
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
        </div>
      </CartProvider>
    </SessionProvider>
  );
}
