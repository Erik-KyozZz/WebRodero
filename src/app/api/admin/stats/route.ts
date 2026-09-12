import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: "paid" });

    const totalSales = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    const pendingDeliveries = paidOrders.filter((order) => !order.isDelivered).length;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      metrics: {
        totalProducts,
        totalOrders,
        totalSales,
        pendingDeliveries,
      },
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener estadísticas del Dashboard", details: error.message },
      { status: 500 }
    );
  }
}
