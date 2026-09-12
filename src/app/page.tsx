import Link from "next/link";
import { Sliders, ArrowRight, Sparkles, Wand2, Mic2 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow - Cyan/Blue */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-cyan-500/15 blur-[150px] rounded-full pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Tienda Oficial & Servicios Musicales
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-none">
          RODERO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">MUSIC</span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl font-light">
          Presets Vocales profesionales de estudio y servicio personalizado de Composición de Canciones exclusivas por Rodero.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-7 py-4 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 text-base"
          >
            <Sliders className="w-5 h-5" />
            Explorar Presets & Servicios
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-7 py-4 rounded-2xl border border-slate-800 transition-all text-base"
          >
            Acceso Clientes / Admin
          </Link>
        </div>

        {/* Categories / Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24 text-left w-full max-w-4xl">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
              <Sliders className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Presets Vocales Pro</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              Cadenas de mezcla vocal preparadas para Logic Pro, FL Studio, Ableton y Pro Tools. Obtén un sonido limpio, potente y listo para sonar en plataformas digitales.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
              <Wand2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Canciones a Medida</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              Servicio exclusivo de composición personalizada, creación de letras originales, producción de estudio y grabación vocal realizada a medida por Rodero.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
