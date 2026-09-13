"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Sliders, ShoppingBag, Plus, Check, Download, MessageSquare } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  isDigital: boolean;
  downloadUrl?: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Catálogo de Presets & Servicios</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Cadenas de mezcla vocal digitales y producción de canciones a medida</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 px-4">
          <Sliders className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No hay productos o presets cargados</h3>
          <p className="text-slate-500 text-sm mt-1">Accede como Administrador para agregar nuevos presets o servicios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all flex flex-col shadow-lg"
            >
              <div className="relative h-44 sm:h-48 bg-slate-800/80 overflow-hidden flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Sliders className="w-12 h-12 text-cyan-400 mb-1" />
                    <span className="text-xs">Sin vista previa</span>
                  </div>
                )}

                <span className={`absolute top-3 right-3 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 ${
                  product.isDigital
                    ? "bg-cyan-500/90 text-slate-950"
                    : "bg-amber-400 text-slate-950"
                }`}>
                  {product.isDigital ? (
                    <>
                      <Download className="w-3.5 h-3.5" /> Descarga Digital
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-3.5 h-3.5" /> Servicio / Chat
                    </>
                  )}
                </span>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Precio</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white">
                      {product.price.toFixed(2)}€
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                      addedId === product._id
                        ? "bg-emerald-600 text-white"
                        : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20"
                    }`}
                  >
                    {addedId === product._id ? (
                      <>
                        <Check className="w-4 h-4" /> Añadido
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Añadir
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
