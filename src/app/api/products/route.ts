import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    // Ordenar primero por orderIndex (ascendente: 0, 1, 2...) y luego por fecha de creación desc
    const products = await Product.find({ active: true }).sort({ orderIndex: 1, createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener los productos", details: error.message },
      { status: 500 }
    );
  }
}
