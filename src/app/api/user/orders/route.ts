import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    const queryConditions: any[] = [];

    // 1. Añadir condiciones por sesión de usuario si está logueado
    if (session?.user) {
      const userEmail = session.user.email;
      const userId = (session.user as any).id;

      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        queryConditions.push({ "user.userId": userId });
      }

      if (userEmail) {
        // Búsqueda insensible a mayúsculas/minúsculas para el correo
        const escapedEmail = userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        queryConditions.push({ "user.email": { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
      }
    }

    // 2. Añadir IDs guardados localmente si existen
    if (idsParam) {
      const parsedIds = idsParam
        .split(",")
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id));

      if (parsedIds.length > 0) {
        queryConditions.push({ _id: { $in: parsedIds } });
      }
    }

    if (queryConditions.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Buscar pedidos que coincidan con cualquier condición
    let allOrders = await Order.find({ $or: queryConditions })
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Verificar en Stripe cualquier pedido pendiente
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
              if (session?.user) {
                if (!order.user) order.user = {};
                const userId = (session.user as any).id;
                if (userId && !order.user.userId) order.user.userId = userId;
                if (session.user.email && !order.user.email) order.user.email = session.user.email;
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
          } catch (e) {
            console.error("Error verificando Stripe:", e);
          }
        }
      }
    }

    // Retornar todos los pedidos pagados que coincidan
    const paidOrders = await Order.find({
      $or: queryConditions,
      paymentStatus: "paid",
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders: paidOrders });
  } catch (error: any) {
    console.error("Error al obtener pedidos:", error);
    return NextResponse.json(
      { error: "Error al obtener tus pedidos", details: error.message },
      { status: 500 }
    );
  }
}
