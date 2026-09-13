"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, Send, MessageSquare, ShieldCheck, User, RefreshCw } from "lucide-react";

interface Message {
  _id?: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  createdAt: string;
}

interface OrderChatModalProps {
  orderId: string;
  orderCode?: string;
  customerName?: string;
  isAdmin?: boolean;
  onClose: () => void;
}

export default function OrderChatModal({
  orderId,
  orderCode,
  customerName,
  isAdmin = false,
  onClose,
}: OrderChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error("Error al cargar chat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const textToSend = inputText;
    setInputText("");

    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          senderName: isAdmin ? "Rodero (Admin)" : customerName || "Cliente",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setInputText(textToSend);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
              <MessageSquare className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base">
                  Chat de Pedido {orderCode ? `#${orderCode}` : `#${orderId.slice(-8)}`}
                </h3>
                {isAdmin ? (
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-cyan-500/40">
                    Modo Admin
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-500/40">
                    Soporte Rodero
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                {isAdmin
                  ? `Hablando con: ${customerName || "Cliente"}`
                  : "Escribe tus indicaciones, detalles para tu canción o dudas directamente con Rodero"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMessages}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors"
              title="Refrescar mensajes"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/40">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm animate-pulse">
              Cargando conversación...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto border border-sky-500/20">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-white font-semibold text-sm">El chat está listo</h4>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                {isAdmin
                  ? "Envía un mensaje al cliente para comenzar la atención."
                  : "Envía tus comentarios o detalles aquí para que Rodero pueda ayudarte."}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isSelf = isAdmin ? msg.sender === "admin" : msg.sender === "user";
              const isMsgAdmin = msg.sender === "admin";

              return (
                <div
                  key={msg._id || index}
                  className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                    {isMsgAdmin ? (
                      <span className="flex items-center gap-1 font-bold text-sky-400">
                        <ShieldCheck className="w-3 h-3" /> {msg.senderName || "Rodero (Admin)"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-medium text-slate-300">
                        <User className="w-3 h-3 text-slate-400" /> {msg.senderName || "Cliente"}
                      </span>
                    )}
                    <span>•</span>
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isSelf
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/15 rounded-tr-none"
                        : isMsgAdmin
                        ? "bg-slate-800 border border-sky-500/30 text-sky-100 rounded-tl-none"
                        : "bg-slate-800/90 border border-slate-700 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder={
              isAdmin
                ? "Escribe una respuesta para el cliente..."
                : "Escribe tus instrucciones, letras o consultas..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all text-sm flex-shrink-0"
          >
            <span>Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
