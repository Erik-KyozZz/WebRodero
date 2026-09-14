"use client";

import React, { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, RefreshCw, MessageSquare, Clock } from "lucide-react";
import OrderChatModal from "@/components/OrderChatModal";
import ProductImage from "@/components/ProductImage";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeChatOrder, setActiveChatOrder] = useState<any | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    let url = `/api/admin/orders?status=${statusFilter}`;
    if (searchCode) {
      url += `&orderCode=${encodeURIComponent(searchCode)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleToggleDelivered = async (orderId: string, currentStatus: boolean) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, isDelivered: !currentStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Error al actualizar entrega:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Control de Entregas & Pedidos</h1>
        <p className="text-slate-400 text-sm mt-1">
          Gestiona pedidos de presets y marca como entregados los servicios encargados por Chat / WhatsApp
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por Código de Referencia (Ej: ORD-1234)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 uppercase font-semibold">Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">Todos los Pedidos</option>
            <option value="paid">Solo Pagados</option>
            <option value="pending">Solo Pendientes</option>
          </select>

          <button
            onClick={fetchOrders}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            title="Refrescar listado"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders & Deliveries Table */}
      {loading ? (
        <div className="text-slate-400 text-sm">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No se encontraron pedidos coincidentes.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Pedido / Fecha</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Ítems Solicitados</th>
                <th className="py-3.5 px-4">Código Referencia</th>
                <th className="py-3.5 px-4">Estado Entrega</th>
                <th className="py-3.5 px-4 text-right">Acción de Chat/Entrega</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-cyan-300 font-bold">#{order._id.slice(-8)}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{order.user?.name || "Cliente"}</div>
                    <div className="text-xs text-slate-400">{order.user?.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5">
                      {order.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0 border border-slate-700">
                            <ProductImage
                              src={it.images || (it.product && it.product.images)}
                              alt={it.name}
                              category={it.isDigital !== false ? "Presets Vocales" : "Servicios / Mezc."}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-white">{it.quantity}x</span> {it.name}
                            <span
                              className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded border ${
                                it.isDigital !== false
                                  ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                                  : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                              }`}
                            >
                              {it.isDigital !== false ? "Digital" : "Servicio / Chat"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-cyan-400">
                    {order.orderCode || "Sin Código"}
                  </td>
                  <td className="py-3.5 px-4">
                    {order.isDelivered ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Entregado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Pendiente Chat
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setActiveChatOrder(order)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-all"
                      title="Abrir chat del pedido"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat ({order.messages?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => handleToggleDelivered(order._id, order.isDelivered)}
                      disabled={updatingId === order._id}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                        order.isDelivered
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                      }`}
                    >
                      {updatingId === order._id
                        ? "Actualizando..."
                        : order.isDelivered
                        ? "Marcar Pendiente"
                        : "Marcar Entregado"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeChatOrder && (
        <OrderChatModal
          orderId={activeChatOrder._id}
          orderCode={activeChatOrder.orderCode}
          customerName={activeChatOrder.user?.name}
          isAdmin={true}
          onClose={() => {
            setActiveChatOrder(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
