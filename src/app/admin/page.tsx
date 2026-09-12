"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Sliders, TrendingUp, CheckCircle, Clock, Download, MessageSquare } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-slate-400 text-sm">Cargando métricas...</div>;
  }

  const { metrics, recentOrders } = stats || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Principal</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen general de presets, servicios y pedidos</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ventas Totales
            </span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            ${metrics?.totalSales?.toFixed(2) || "0.00"}
          </div>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pedidos Totales
            </span>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalOrders || 0}</div>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pendientes de Entrega (Chat)
            </span>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.pendingDeliveries || 0}</div>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Presets / Productos
            </span>
            <Sliders className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalProducts || 0}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Pedidos Recientes</h2>
        {!recentOrders || recentOrders.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay pedidos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID Pedido</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado Pago</th>
                  <th className="py-3 px-4">Código Referencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-mono text-xs text-cyan-300">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="py-3.5 px-4">
                      {order.user?.name || "Cliente Anon"}
                      <span className="block text-xs text-slate-500">{order.user?.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {order.paymentStatus === "paid" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Pagado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-cyan-400">
                      {order.orderCode || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
