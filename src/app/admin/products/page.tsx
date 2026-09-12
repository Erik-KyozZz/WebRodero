"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Sliders, ArrowUp, ArrowDown, X, Upload, FileCheck } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    images: "",
    stock: 9999,
    isDigital: true,
    downloadUrl: "",
    filePath: "",
    fileName: "",
    category: "Presets Vocales",
    orderIndex: 0,
    active: true,
  });

  const loadProducts = () => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          filePath: result.url,
          fileName: result.fileName,
        }));
      } else {
        alert(result.error || "Error al subir el archivo");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la subida del archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === products.length - 1)
    ) {
      return;
    }

    const updated = [...products];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payload = updated.map((prod, i) => ({
      id: prod._id,
      orderIndex: i,
    }));

    setProducts(updated);

    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productOrders: payload }),
    });

    loadProducts();
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      images: "",
      stock: 9999,
      isDigital: true,
      downloadUrl: "",
      filePath: "",
      fileName: "",
      category: "Presets Vocales",
      orderIndex: products.length,
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images ? product.images.join(", ") : "",
      stock: product.stock,
      isDigital: product.isDigital !== undefined ? product.isDigital : true,
      downloadUrl: product.downloadUrl || "",
      filePath: product.filePath || "",
      fileName: product.fileName || "",
      category: product.category,
      orderIndex: product.orderIndex || 0,
      active: product.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto permanentemente?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      images: formData.images.split(",").map((img) => img.trim()).filter(Boolean),
    };

    if (editingId) {
      await fetch(`/api/admin/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setShowModal(false);
    loadProducts();
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Organizar & CRUD de Presets</h1>
          <p className="text-slate-400 text-sm mt-1">Sube directamente los archivos comprimidos ZIP / presets de tu producto</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Crear Nuevo Producto / Preset
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Cargando productos...</div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 min-w-[650px]">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-center">Posición</th>
                <th className="py-3.5 px-4">Producto / Preset</th>
                <th className="py-3.5 px-4">Archivo Adjunto</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
                      <span className="text-xs font-bold text-cyan-400 w-5 text-center">
                        #{index + 1}
                      </span>
                      <button
                        onClick={() => handleMoveOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Subir posición"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, "down")}
                        disabled={index === products.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Bajar posición"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      {product.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{product.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 text-xs">
                    {product.fileName ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <FileCheck className="w-3.5 h-3.5" /> {product.fileName}
                      </span>
                    ) : product.downloadUrl ? (
                      <span className="text-cyan-400 truncate max-w-[150px] inline-block">
                        Enlace externo
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Sin archivo</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {product.active ? (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                      </span>
                    ) : (
                      <span className="text-rose-400 text-xs font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 text-cyan-400 hover:bg-slate-800 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-rose-400 hover:bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
          <div 
            className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] relative max-h-[85vh] flex flex-col"
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 flex-shrink-0">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Editar Producto" : "Nuevo Preset / Servicio"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs uppercase mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Preset Vocal Rodero Trap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="preset-vocal-rodero"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase mb-1">Descripción</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detalles sobre plugins incluidos, formato de cadena vocal..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Subida Directa de Archivo de Preset (ZIP / RARE / PDF) */}
              <div className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-sky-400 uppercase">
                  Subir Archivo de Descarga (ZIP, Preset, etc.)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer transition-all shadow-md">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Subiendo..." : "Seleccionar Archivo"}
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {formData.fileName && (
                    <span className="text-xs text-emerald-400 font-medium truncate flex items-center gap-1">
                      <FileCheck className="w-4 h-4" /> {formData.fileName}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs uppercase mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase mb-1">Posición (#)</label>
                  <input
                    type="number"
                    required
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Presets Vocales">Presets Vocales</option>
                    <option value="Servicio Chat">Servicio Chat</option>
                    <option value="Canción a Medida">Canción a Medida</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase mb-1">O enlace de Descarga Alternativo (Drive / Dropbox)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase mb-1">
                  URLs de Imágenes de Portada
                </label>
                <input
                  type="text"
                  placeholder="https://.../preset-cover.jpg"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-white text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                  <span>Producto Activo en Tienda</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
