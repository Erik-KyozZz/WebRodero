import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { sendOrderConfirmationEmail } from "@/lib/mailer";
import crypto from "crypto";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY || "";
  const stripe = new Stripe(stripeKey);

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`❌ Webhook error de firma: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await connectDB();
      const order = await Order.findById(orderId);

      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.orderCode = "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
        await order.save();

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }

        try {
          const recipientEmail = session.customer_details?.email || order.user?.email;
          const recipientName = session.customer_details?.name || order.user?.name || "Cliente";

          if (recipientEmail) {
            await sendOrderConfirmationEmail({
              to: recipientEmail,
              customerName: recipientName,
              orderId: order._id.toString(),
              items: order.items,
              totalAmount: order.totalAmount,
              orderCode: order.orderCode,
            });
          }
        } catch (emailErr) {
          console.error("❌ Error al enviar email de confirmación:", emailErr);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
