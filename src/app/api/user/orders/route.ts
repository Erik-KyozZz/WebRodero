import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ver tu historial de pedidos" },
        { status: 401 }
      );
    }

    await connectDB();

    const userEmail = session.user.email;
    const userId = (session.user as any).id;

    // Buscar pedidos por ID de usuario o por email de cliente
    const orders = await Order.find({
      $or: [
        { "user.userId": userId },
        { "user.email": userEmail },
      ],
      paymentStatus: "paid",
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener tus pedidos", details: error.message },
      { status: 500 }
    );
  }
}
