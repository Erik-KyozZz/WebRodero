import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  isDigital: boolean;
  downloadUrl?: string; // Enlace o URL de archivo subido
  filePath?: string; // Ruta/URL del archivo adjunto para entrega directa
  fileName?: string; // Nombre del archivo descargable (ej. preset-rodero.zip)
  category: string;
  orderIndex: number;
  active: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 9999 },
    isDigital: { type: Boolean, default: true },
    downloadUrl: { type: String },
    filePath: { type: String },
    fileName: { type: String },
    category: { type: String, required: true },
    orderIndex: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
