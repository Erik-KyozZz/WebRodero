import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

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

    // Buscar todos los pedidos asociados a este correo o ID de usuario
    const queryConditions: any[] = [];
    if (userId) queryConditions.push({ "user.userId": userId });
    if (userEmail) queryConditions.push({ "user.email": userEmail });

    let allOrders = await Order.find({ $or: queryConditions })
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Verificar si algún pedido en estado "pending" ya ha sido pagado en Stripe
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      const stripe = new Stripe(stripeKey);
      for (const order of allOrders) {
        if (order.paymentStatus === "pending" && order.stripeSessionId) {
          try {
            const checkoutSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
            if (checkoutSession.payment_status === "paid") {
              order.paymentStatus = "paid";
              if (!order.orderCode) {
                order.orderCode = "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
              }
              if (!order.user) order.user = {};
              if (userId && !order.user.userId) order.user.userId = userId;
              await order.save();
            }
          } catch (e) {
            console.error("Error verificando Stripe en listado:", e);
          }
        }
      }
    }

    // Filtrar solo los pedidos pagados para la entrega de descargas
    const paidOrders = await Order.find({
      $or: queryConditions,
      paymentStatus: "paid",
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders: paidOrders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener tus pedidos", details: error.message },
      { status: 500 }
    );
  }
}
