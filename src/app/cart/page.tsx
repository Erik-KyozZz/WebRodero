"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, ArrowRight, Download, MessageSquare } from "lucide-react";
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
        alert(data.error || "Error al procesar la sesión de pago");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con Stripe Checkout");
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Carrito de Pedido Digital</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Download className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {item.name}
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      Digital / Servicio
                    </span>
                  </h3>
                  <span className="text-sm text-slate-400 font-semibold">
                    ${item.price.toFixed(2)} c/u
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-semibold text-sm text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-white text-lg block">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={clearCart}
              className="text-sm text-slate-400 hover:text-rose-400 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
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
                  Tu Correo (Para recibir descarga o recibo)
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
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-cyan-400">
              <span>Entrega Digital / Chat</span>
              <span>INMEDIATA</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 font-bold text-lg text-white">
            <span>Total</span>
            <span className="text-cyan-400">${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 mt-2"
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
