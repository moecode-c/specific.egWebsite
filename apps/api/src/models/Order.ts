import mongoose, { Schema, Types } from "mongoose";

export type OrderStatus = "pending" | "accepted" | "declined";

export type OrderItem = {
  product: Types.ObjectId;
  quantity: number;
  phoneModel?: string;
  color?: string;
};

export type OrderDoc = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  products: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  phone: string;
  address: string;
  notes?: string;
  createdAt: Date;
};

const orderSchema = new Schema<OrderDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    notes: { type: String, required: false, trim: true, default: "" },
    products: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, required: true, min: 1 },
          phoneModel: { type: String, required: false, trim: true, default: "" },
          color: { type: String, required: false, trim: true, default: "" },
        },
      ],
      default: [],
      required: true,
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order =
  mongoose.models.Order || mongoose.model<OrderDoc>("Order", orderSchema);
