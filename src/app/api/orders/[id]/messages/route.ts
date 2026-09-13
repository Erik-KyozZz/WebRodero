import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id).select("messages user orderCode items totalAmount paymentStatus isDelivered createdAt");
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      orderId: order._id,
      orderCode: order.orderCode,
      user: order.user,
      isDelivered: order.isDelivered,
      messages: order.messages || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener mensajes del pedido", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { text, senderName } = body;
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // Determine sender role
    const isAdmin = (session?.user as any)?.role === "admin";
    const sender = isAdmin ? "admin" : "user";
    const displayName =
      senderName ||
      session?.user?.name ||
      (isAdmin ? "Rodero (Admin)" : order.user?.name || "Cliente");

    const newMessage = {
      sender,
      senderName: displayName,
      text: text.trim(),
      createdAt: new Date(),
    };

    order.messages.push(newMessage as any);
    await order.save();

    return NextResponse.json({
      message: "Mensaje enviado",
      newMessage,
      messages: order.messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al enviar el mensaje", details: error.message },
      { status: 500 }
    );
  }
}
