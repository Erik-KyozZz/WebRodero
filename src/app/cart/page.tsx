"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, ArrowRight, Download } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customerEmail: session?.user?.email || customerEmail,
          customerName: session?.user?.name || customerName,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Error al procesar el checkout: ${data.error || data.details || "Verifica las variables de entorno de Stripe en Vercel"}`);
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error de red al conectar con Checkout: ${err.message}`);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
        <p className="text-slate-400 mt-2 text-sm">Explora los Presets Vocales y Servicios de composición en el catálogo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Carrito de Pedido Digital</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl gap-4 shadow-lg"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 rounded-xl flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Download className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-sm sm:text-base flex flex-wrap items-center gap-2">
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full flex-shrink-0">
                      Digital / Servicio
                    </span>
                  </h3>
                  <span className="text-xs sm:text-sm text-slate-400 font-semibold">
                    {item.price.toFixed(2)}€ c/u
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 font-semibold text-sm text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-white text-base sm:text-lg block">
                    {(item.price * item.quantity).toFixed(2)}€
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={clearCart}
              className="text-xs sm:text-sm text-slate-400 hover:text-rose-400 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 h-fit shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" /> Resumen de Pago
          </h2>

          {!session && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Gómez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Tu Correo (Para recibir descarga)
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-3 text-sm text-slate-300 pb-4 border-b border-slate-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{totalPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-cyan-400 text-xs sm:text-sm font-semibold">
              <span>Entrega Digital / Chat</span>
              <span>INMEDIATA</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 font-bold text-base sm:text-lg text-white">
            <span>Total</span>
            <span className="text-cyan-400">{totalPrice.toFixed(2)}€</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 mt-2 text-sm sm:text-base"
          >
            {loading ? (
              "Procesando..."
            ) : (
              <>
                Pagar con Stripe <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
