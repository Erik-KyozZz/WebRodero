import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");

    let query: any = {};

    if (orderCode) {
      query.orderCode = orderCode.trim().toUpperCase();
    }

    if (status && status !== "all") {
      query.paymentStatus = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener órdenes", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { orderId, isDelivered } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "ID de orden requerido" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    order.isDelivered = isDelivered !== undefined ? isDelivered : true;
    await order.save();

    return NextResponse.json({ message: "Estado de entrega actualizado", order });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar estado de entrega", details: error.message },
      { status: 500 }
    );
  }
}
