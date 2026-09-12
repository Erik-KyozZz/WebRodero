"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Download, ShoppingBag, CheckCircle, Clock, ExternalLink, Sliders } from "lucide-react";
import { useSession } from "next-auth/react";

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Inicia sesión</h2>
        <p className="text-slate-400 mt-2 text-sm">Debes estar identificado para ver tus compras y descargas.</p>
        <Link
          href="/login?callbackUrl=/my-orders"
          className="inline-block mt-6 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg text-sm"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Mis Compras & Descargas</h1>
        <p className="text-slate-400 text-sm mt-1">Accede a tus presets y archivos descargables cuando quieras</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">Aún no has realizado ninguna compra</h3>
          <p className="text-slate-500 text-sm mt-1">Explora nuestros Presets Vocales y Servicios en la tienda.</p>
          <Link
            href="/#cat-products"
            className="inline-block mt-4 text-sky-400 font-semibold text-sm hover:underline"
          >
            Ver Presets & Servicios →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Pedido</span>
                  <div className="font-mono text-sky-300 font-bold text-base">#{order._id.slice(-8)}</div>
                  <div className="text-xs text-slate-400">
                    Comprado el {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Pago Confirmado
                  </span>
                  <span className="text-lg font-extrabold text-white">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items & Downloads list */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Archivos de tu pedido:
                </h4>
                {order.items.map((item: any, idx: number) => {
                  const productObj = item.product || {};
                  const downloadLink = productObj.filePath || productObj.downloadUrl;
                  const fileName = productObj.fileName || "Descargar Archivo";

                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50 gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-400/10 text-sky-400 rounded-xl flex items-center justify-center border border-sky-400/20 flex-shrink-0">
                          <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{item.name}</div>
                          <div className="text-xs text-slate-400">Cantidad: {item.quantity}</div>
                        </div>
                      </div>

                      <div>
                        {downloadLink ? (
                          <a
                            href={downloadLink}
                            download={productObj.fileName || true}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-sky-400/20 transition-all"
                          >
                            <Download className="w-4 h-4" /> {productObj.fileName ? `Descargar (${productObj.fileName})` : "Descargar Producto"}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Entrega personalizada por Chat / WhatsApp
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
