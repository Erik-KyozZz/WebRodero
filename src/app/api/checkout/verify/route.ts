import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId es requerido" }, { status: 400 });
    }

    await connectDB();
    const session = await getServerSession(authOptions);

    let order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && order.stripeSessionId && order.paymentStatus !== "paid") {
      try {
        const stripe = new Stripe(stripeKey);
        const checkoutSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

        if (checkoutSession.payment_status === "paid") {
          order.paymentStatus = "paid";
          if (!order.orderCode) {
            order.orderCode = "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
          }

          // Vincular usuario actual si está autenticado
          if (session?.user) {
            if (!order.user) order.user = {};
            order.user.userId = (session.user as any).id || order.user.userId;
            order.user.email = session.user.email || order.user.email;
          }

          await order.save();

          // Actualizar stock
          for (const item of order.items) {
            if (item.product) {
              const productId = (item.product as any)._id || item.product;
              await Product.findByIdAndUpdate(productId, {
                $inc: { stock: -item.quantity },
              });
            }
          }
        }
      } catch (stripeErr) {
        console.error("Error al verificar sesión en Stripe:", stripeErr);
      }
    }

    // Re-populate para devolver la información actualizada del producto
    order = await Order.findById(orderId).populate("items.product");

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Error en verificación de pedido:", error);
    return NextResponse.json({ error: error.message || "Error al verificar pedido" }, { status: 500 });
  }
}
