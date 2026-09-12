"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Download, ArrowRight, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
        <CheckCircle2 className="w-10 h-10 animate-bounce" />
      </div>

      <h1 className="text-3xl font-extrabold text-white">¡Pago Confirmado!</h1>
      <p className="text-slate-400 mt-2 text-sm">
        Tu pedido {orderId ? `#${orderId.slice(-8)}` : ""} ha sido procesado exitosamente.
      </p>

      <div className="mt-8 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-left space-y-4">
        <div className="flex items-center gap-3 text-cyan-400 font-semibold text-sm">
          <Download className="w-5 h-5" />
          <span>Acceso Digital / Confirmación Enviada</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Hemos enviado un correo electrónico con el recibo oficial y el <strong>Código de Pedido / Licencia</strong>. Si has contratado una canción a medida o servicio personalizado, facilita tu código por chat/redes para iniciar tu proyecto al instante.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-sm"
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
