import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  filePath?: string;
  fileName?: string;
  downloadUrl?: string;
}

export interface IOrderMessage {
  _id?: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  createdAt: Date;
}

export interface IOrder extends Document {
  user?: {
    name?: string;
    email?: string;
    userId?: mongoose.Types.ObjectId | string;
  };
  items: IOrderItem[];
  totalAmount: number;
  stripeSessionId?: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderCode?: string; // Código de pedido/licencia único
  isDelivered: boolean; // Control de entrega por chat / digital
  notes?: string;
  messages: IOrderMessage[];
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      name: String,
      email: String,
      userId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        isDigital: { type: Boolean, default: true },
        filePath: { type: String },
        fileName: { type: String },
        downloadUrl: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    stripeSessionId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderCode: { type: String },
    isDelivered: { type: Boolean, default: false },
    notes: { type: String },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        senderName: { type: String, default: "" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
