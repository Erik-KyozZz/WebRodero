"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sliders, Wand2, Plus, Check, Download, MessageSquare, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";

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

export default function Home() {
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
        console.error("Error al cargar productos en inicio:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows - Brighter Electric Cyan & Blue */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-sky-400/25 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-3/4 right-10 w-[500px] h-[500px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-8 sm:pb-12 flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-tight sm:leading-none drop-shadow-lg">
          RODERO <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-400 to-blue-400">MUSIC</span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl font-light leading-relaxed px-2">
          Presets Vocales profesionales de estudio y servicio personalizado de Composición de Canciones exclusivas por Rodero.
        </p>
      </section>

      {/* Products Section on Homepage */}
      <section id="cat-products" className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 border-t border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Sliders className="w-6 h-6 sm:w-7 sm:h-7 text-sky-400 flex-shrink-0" /> PRESETS VOCALES & SERVICIOS
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">Añade directamente al carrito o explora las cadenas de estudio</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-800/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/80 rounded-2xl border border-slate-700/60 shadow-xl px-4">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-200">No hay productos o presets disponibles en este momento</h3>
            <p className="text-slate-400 text-sm mt-1">Accede como Administrador para agregar nuevos presets o servicios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-slate-900/80 border border-slate-700/70 rounded-2xl overflow-hidden hover:border-sky-400/60 transition-all shadow-xl hover:shadow-sky-500/10 flex flex-col"
              >
                <div className="relative h-44 sm:h-48 bg-slate-800/90 overflow-hidden flex items-center justify-center">
                  <ProductImage
                    src={product.images}
                    alt={product.name}
                    category={product.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <span className={`absolute top-3 right-3 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1 ${
                    product.isDigital
                      ? "bg-sky-400 text-slate-950"
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
                    <span className="text-[11px] text-sky-300 font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1 group-hover:text-sky-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Precio</span>
                      <span className="text-lg sm:text-xl font-extrabold text-white">
                        {product.price.toFixed(2)}€
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${addedId === product._id
                        ? "bg-emerald-600 text-white"
                        : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-sky-400/25"
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
      </section>


    </div>
  );
}
