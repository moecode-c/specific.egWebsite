import type { Response } from "express";
import mongoose from "mongoose";
import { AuthedRequest } from "../middleware/auth";
import { HttpError } from "../middleware/errorHandler";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

export async function createOrder(req: AuthedRequest, res: Response) {
  const userId = req.user!.userId;
  const { products, phone, address, notes } = req.body as {
    products?: Array<{
      productId: string;
      quantity: number;
      phoneModel?: string;
      color?: string;
    }>;
    phone?: string;
    address?: string;
    notes?: string;
  };

  if (!products?.length) throw new HttpError(400, "No products");
  if (!phone?.trim()) throw new HttpError(400, "Phone is required");
  if (!address?.trim()) throw new HttpError(400, "Address is required");

  const productIds = products.map((p) => p.productId);
  const docs = await Product.find({ _id: { $in: productIds } }).lean();
  const docMap = new Map(docs.map((d) => [d._id.toString(), d]));

  let total = 0;
  const orderItems = products.map((p) => {
    const found = docMap.get(p.productId);
    if (!found) throw new HttpError(400, "Invalid product");

    const phoneModel = (p.phoneModel ?? "").trim();
    const color = (p.color ?? "").trim();

    if (Array.isArray((found as any).phoneModels) && (found as any).phoneModels.length) {
      if (!phoneModel) throw new HttpError(400, "Phone model is required");
      if (!(found as any).phoneModels.includes(phoneModel)) {
        throw new HttpError(400, "Invalid phone model");
      }
    }

    if (Array.isArray((found as any).colors) && (found as any).colors.length) {
      if (!color) throw new HttpError(400, "Color is required");
      if (!(found as any).colors.includes(color)) {
        throw new HttpError(400, "Invalid color");
      }
    }

    const qty = Math.max(1, Number(p.quantity || 1));
    total += found.price * qty;
    return {
      product: new mongoose.Types.ObjectId(p.productId),
      quantity: qty,
      phoneModel,
      color,
    };
  });

  const order = await Order.create({
    user: new mongoose.Types.ObjectId(userId),
    phone: phone.trim(),
    address: address.trim(),
    notes: (notes ?? "").trim(),
    products: orderItems,
    totalPrice: total,
    status: "pending",
  });

  res.status(201).json({
    message: "Your order has been placed successfully. You will be contacted soon.",
    order,
  });
}

export async function getMyOrders(req: AuthedRequest, res: Response) {
  const userId = req.user!.userId;
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("products.product")
    .lean();
  res.json({ orders });
}

export async function getAllOrders(_req: AuthedRequest, res: Response) {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("products.product")
    .lean();
  res.json({ orders });
}

export async function getOrderById(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate("products.product")
    .lean();

  if (!order) throw new HttpError(404, "Order not found");

  const isOwner = order.user && (order.user as any)._id?.toString?.() === req.user!.userId;
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) throw new HttpError(403, "Forbidden");

  res.json({ order });
}

export async function updateOrderStatus(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status?: "pending" | "accepted" | "declined" };
  if (!status || !["pending", "accepted", "declined"].includes(status)) {
    throw new HttpError(400, "Invalid status");
  }

  const order = await Order.findById(id);
  if (!order) throw new HttpError(404, "Order not found");
  order.status = status;
  await order.save();
  res.json({ order });
}
