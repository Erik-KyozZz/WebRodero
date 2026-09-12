import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ orderIndex: 1, createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener productos", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, slug, description, price, images, stock, isDigital, downloadUrl, filePath, fileName, category, orderIndex, active } = body;

    if (!name || !slug || price === undefined || !category) {
      return NextResponse.json(
        { error: "Todos los campos requeridos deben completarse" },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      slug,
      description: description || "",
      price,
      images: images || [],
      stock: stock !== undefined ? stock : 9999,
      isDigital: isDigital !== undefined ? isDigital : true,
      downloadUrl: downloadUrl || "",
      filePath: filePath || "",
      fileName: fileName || "",
      category,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : 0,
      active: active !== undefined ? active : true,
    });

    await product.save();
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear producto", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { productOrders } = await req.json();

    if (!Array.isArray(productOrders)) {
      return NextResponse.json({ error: "Formato inválido de ordenamiento" }, { status: 400 });
    }

    for (const item of productOrders) {
      await Product.findByIdAndUpdate(item.id, { orderIndex: item.orderIndex });
    }

    return NextResponse.json({ message: "Orden de productos actualizado con éxito" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al reordenar productos", details: error.message },
      { status: 500 }
    );
  }
}
