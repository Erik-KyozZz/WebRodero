import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const { items, customerEmail, customerName } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    await connectDB();
    const session = await getServerSession(authOptions);

    const lineItems = [];
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const dbProduct = await Product.findById(item._id || item.id);
      if (!dbProduct || !dbProduct.active) {
        return NextResponse.json(
          { error: `El producto ${item.name} no está disponible` },
          { status: 400 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: dbProduct.name,
            description: dbProduct.description,
            images: dbProduct.images.length > 0 ? [dbProduct.images[0]] : [],
          },
          unit_amount: Math.round(dbProduct.price * 100),
        },
        quantity: item.quantity,
      });

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
        isDigital: dbProduct.isDigital !== undefined ? dbProduct.isDigital : true,
      });

      totalAmount += dbProduct.price * item.quantity;
    }

    const order = new Order({
      user: {
        name: customerName || session?.user?.name || "Cliente",
        email: customerEmail || session?.user?.email || "cliente@correo.com",
        userId: session?.user ? (session.user as any).id : undefined,
      },
      items: orderItems,
      totalAmount,
      paymentStatus: "pending",
    });

    await order.save();

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success?orderId=${order._id}`,
      cancel_url: `${origin}/cart?canceled=true`,
      customer_email: customerEmail || session?.user?.email,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = checkoutSession.id;
    await order.save();

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Error al crear sesión de checkout:", error);
    return NextResponse.json(
      { error: "Error al procesar el checkout", details: error.message },
      { status: 500 }
    );
  }
}
