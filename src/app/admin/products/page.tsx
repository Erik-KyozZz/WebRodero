"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, Edit2, Trash2, CheckCircle2, XCircle, Sliders, ArrowUp, ArrowDown, X, 
  Upload, FileCheck, FolderOpen, Download, CloudUpload, FileText, Check, ExternalLink 
} from "lucide-react";

interface ServerFile {
  fileName: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [serverFiles, setServerFiles] = useState<ServerFile[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

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

  const loadServerFiles = () => {
    setLoadingLibrary(true);
    fetch("/api/admin/upload")
      .then((res) => res.json())
      .then((data) => {
        if (data.files) setServerFiles(data.files);
        setLoadingLibrary(false);
      })
      .catch(() => setLoadingLibrary(false));
  };

  useEffect(() => {
    loadProducts();
    loadServerFiles();
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const processFileUpload = async (file: File) => {
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
        loadServerFiles();
      } else {
        const errorMsg = result.details ? `${result.error}: ${result.details}` : (result.error || "Error al subir el archivo");
        alert(errorMsg);
      }
    } catch (err: any) {
      console.error(err);
      alert("Error en la red o subida del archivo: " + (err.message || String(err)));
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFileUpload(file);
      e.dataTransfer.clearData();
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

  const selectServerFile = (file: ServerFile) => {
    setFormData((prev) => ({
      ...prev,
      filePath: file.url,
      fileName: file.fileName,
    }));
    setShowLibraryModal(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Organizar & CRUD de Presets</h1>
          <p className="text-slate-400 text-sm mt-1">Sube directamente los archivos comprimidos ZIP / presets de tu producto</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadServerFiles();
              setShowLibraryModal(true);
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <FolderOpen className="w-4 h-4" /> Librería ({serverFiles.length})
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Crear Nuevo Producto
          </button>
        </div>
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
                      <span className="text-xs font-bold text-sky-400 w-5 text-center">
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
                      <Sliders className="w-4 h-4 text-sky-400" />
                      {product.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{product.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 text-xs">
                    {product.filePath ? (
                      <a
                        href={product.filePath}
                        download
                        className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors"
                        title="Descargar archivo"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[160px] font-medium">{product.fileName || "Archivo adjunto"}</span>
                        <Download className="w-3 h-3 opacity-60 ml-0.5" />
                      </a>
                    ) : product.downloadUrl ? (
                      <a
                        href={product.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Enlace externo
                      </a>
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
                      className="p-2 text-sky-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Eliminar"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-16 bg-slate-950/80 backdrop-blur-sm">
          <div 
            className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative max-h-[88vh] flex flex-col"
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 flex-shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                {editingId ? "Editar Producto / Preset" : "Nuevo Preset / Servicio"}
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
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 focus:outline-none"
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
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 focus:outline-none"
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
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 focus:outline-none"
                />
              </div>

              {/* Enhanced Interactive Drag & Drop Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-sky-400 uppercase tracking-wide">
                    Archivo de Descarga Inmediata (ZIP, RAR, Presets, etc.)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      loadServerFiles();
                      setShowLibraryModal(true);
                    }}
                    className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Elegir de la librería
                  </button>
                </div>

                {formData.filePath ? (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-emerald-300 truncate">
                          {formData.fileName || "Archivo Adjuntado"}
                        </p>
                        <p className="text-xs text-emerald-500 font-mono truncate">
                          {formData.filePath}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={formData.filePath}
                        download
                        className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-colors"
                        title="Probar Descarga"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, filePath: "", fileName: "" })}
                        className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl transition-colors"
                        title="Quitar Archivo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${
                      isDragging
                        ? "border-sky-400 bg-sky-500/10 scale-[1.01]"
                        : "border-slate-700 bg-slate-800/40 hover:border-sky-400/60 hover:bg-slate-800/80"
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileInputChange}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {uploading ? (
                      <div className="flex flex-col items-center justify-center py-2 space-y-2">
                        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-sky-400 font-semibold animate-pulse">
                          Subiendo y procesando archivo...
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
                          <CloudUpload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Arrastra y suelta tu archivo aquí
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            o haz clic para examinar desde tu equipo (ZIP, RAR, presets, etc.)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase mb-1">Posición (#)</label>
                  <input
                    type="number"
                    required
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs focus:border-sky-400 focus:outline-none"
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
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 focus:outline-none"
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
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-white text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded accent-sky-400"
                  />
                  <span>Producto Activo en Tienda</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl transition-all"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Librería de Archivos Subidos */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-16 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-sky-400" /> Librería de Archivos Subidos al Servidor
                </h2>
                <p className="text-xs text-slate-400">
                  Total de archivos en servidor: {serverFiles.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLibraryModal(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingLibrary ? (
                <div className="text-center py-8 text-slate-400 text-sm">Cargando librería de archivos...</div>
              ) : serverFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Aún no has subido ningún archivo al servidor.
                </div>
              ) : (
                serverFiles.map((file) => (
                  <div
                    key={file.url}
                    className="p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-2xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-white truncate">
                          {file.fileName}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span>Tamaño: {formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{new Date(file.createdAt).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={file.url}
                        download
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-sky-300 rounded-xl transition-colors"
                        title="Descargar para probar"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      {showModal && (
                        <button
                          type="button"
                          onClick={() => selectServerFile(file)}
                          className="flex items-center gap-1 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Asignar a producto
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
