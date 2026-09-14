"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Download, ShoppingBag, CheckCircle, Sliders, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import OrderChatModal from "@/components/OrderChatModal";
import ProductImage from "@/components/ProductImage";

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatOrder, setActiveChatOrder] = useState<any | null>(null);

  useEffect(() => {
    let localIds: string[] = [];
    if (typeof window !== "undefined") {
      try {
        localIds = JSON.parse(localStorage.getItem("rodero_orders") || "[]");
      } catch (e) {}
    }

    const idsQuery = localIds.length > 0 ? `?ids=${localIds.join(",")}` : "";

    fetch(`/api/user/orders${idsQuery}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [status]);

  if (status === "unauthenticated" && orders.length === 0 && !loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Inicia sesión</h2>
        <p className="text-slate-400 mt-2 text-sm">Debes estar identificado para ver tu historial de compras y descargas.</p>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Mis Compras & Descargas</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">Accede a tus presets y archivos descargables cuando quieras</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 px-4">
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
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-3">
                <div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Pedido</span>
                  <div className="font-mono text-sky-300 font-bold text-sm sm:text-base">#{order._id.slice(-8)}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">
                    Comprado el {new Date(order.createdAt).toLocaleDateString("es-ES")}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Pago Confirmado
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-white">
                    {order.totalAmount.toFixed(2)}€
                  </span>
                  <button
                    onClick={() => setActiveChatOrder(order)}
                    className="w-full sm:w-auto mt-1 sm:mt-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-sky-400/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat con Rodero {order.messages?.length ? `(${order.messages.length})` : ""}</span>
                  </button>
                </div>
              </div>

              {/* Items & Downloads list */}
              <div className="space-y-3 pt-1">
                <h4 className="text-[11px] sm:text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Archivos & Servicios de tu pedido:
                </h4>
                {order.items.map((item: any, idx: number) => {
                  const productObj = item.product || {};
                  const downloadLink = item.filePath || productObj.filePath || item.downloadUrl || productObj.downloadUrl;
                  const fileName = item.fileName || productObj.fileName || "Archivo Adjunto";

                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-700/50 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/80 shadow-md">
                          <ProductImage
                            src={item.images || productObj.images}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm">{item.name}</div>
                          <div className="text-[11px] sm:text-xs text-slate-400">
                            Cantidad: {item.quantity} •{" "}
                            {item.isDigital !== false ? (
                              <span className="text-sky-400">Descarga Digital</span>
                            ) : (
                              <span className="text-amber-400">Servicio Personalizado / Chat</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto pt-1 sm:pt-0">
                        {downloadLink ? (
                          <a
                            href={downloadLink}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-sky-400/20 transition-all"
                          >
                            <Download className="w-4 h-4" /> {fileName ? `Descargar (${fileName})` : "Descargar Producto"}
                          </a>
                        ) : (
                          <button
                            onClick={() => setActiveChatOrder(order)}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            <MessageSquare className="w-4 h-4" /> Abrir Chat de Canción / Servicio
                          </button>
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

      {activeChatOrder && (
        <OrderChatModal
          orderId={activeChatOrder._id}
          orderCode={activeChatOrder.orderCode}
          customerName={session?.user?.name || activeChatOrder.user?.name || "Cliente"}
          isAdmin={false}
          onClose={() => setActiveChatOrder(null)}
        />
      )}
    </div>
  );
}
