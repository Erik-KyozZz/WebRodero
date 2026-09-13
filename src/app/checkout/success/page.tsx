"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Download, ArrowRight, Sliders, FolderDown, FileCheck, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      if (typeof window !== "undefined") {
        try {
          const existing = JSON.parse(localStorage.getItem("rodero_orders") || "[]");
          if (!existing.includes(orderId)) {
            localStorage.setItem("rodero_orders", JSON.stringify([...existing, orderId]));
          }
        } catch (e) {}
      }

      fetch(`/api/checkout/verify?orderId=${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) {
            setOrder(data.order);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Header Badge */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">¡Pago Confirmado!</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Tu compra {orderId ? `#${orderId.slice(-8)}` : ""} ha sido procesada con éxito. Ya puedes descargar tus archivos inmediatamente.
        </p>
      </div>

      {/* Instant Downloads Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-left shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <FolderDown className="w-5 h-5" />
            <span>Entrega Inmediata de Productos</span>
          </div>
          {order?.orderCode && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
              {order.orderCode}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
            Verificando tu pago y preparando enlaces de descarga...
          </div>
        ) : order && order.items && order.items.length > 0 ? (
          <div className="space-y-3 pt-1">
            {order.items.map((item: any, idx: number) => {
              const productObj = item.product || {};
              const downloadLink = item.filePath || productObj.filePath || item.downloadUrl || productObj.downloadUrl;
              const fileName = item.fileName || productObj.fileName || "Archivo del Preset";

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-400/10 text-sky-400 rounded-xl flex items-center justify-center border border-sky-400/20 flex-shrink-0">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="text-xs text-slate-400">
                        {productObj.category || "Preset Digital"}
                      </div>
                    </div>
                  </div>

                  <div>
                    {downloadLink ? (
                      <a
                        href={downloadLink}
                        download={fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar Archivo</span>
                      </a>
                    ) : (
                      <Link
                        href="/my-orders"
                        className="inline-flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <MessageSquare className="w-4 h-4" /> Abrir Chat de Canción / Servicio
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed py-2">
            Hemos registrado tu pedido correctamente. Si compraste un preset o archivo digital, también lo tienes guardado en tu panel de descargas.
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href="/my-orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/20 text-sm"
        >
          <FileCheck className="w-4 h-4" /> Ver Mis Descargas
        </Link>
        <Link
          href="/#cat-products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm border border-slate-700"
        >
          Volver a la Tienda <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Cargando confirmación...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
