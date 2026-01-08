import type { Response } from "express";
import mongoose from "mongoose";
import { AuthedRequest } from "../middleware/auth";
import { HttpError } from "../middleware/errorHandler";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

export async function createOrder(req: AuthedRequest, res: Response) {
  const userId = req.user!.userId;
  const { products } = req.body as {
    products?: Array<{ productId: string; quantity: number }>;
  };

  if (!products?.length) throw new HttpError(400, "No products");

  const productIds = products.map((p) => p.productId);
  const docs = await Product.find({ _id: { $in: productIds } }).lean();
  const docMap = new Map(docs.map((d) => [d._id.toString(), d]));

  let total = 0;
  const orderItems = products.map((p) => {
    const found = docMap.get(p.productId);
    if (!found) throw new HttpError(400, "Invalid product");
    const qty = Math.max(1, Number(p.quantity || 1));
    total += found.price * qty;
    return { product: new mongoose.Types.ObjectId(p.productId), quantity: qty };
  });

  const order = await Order.create({
    user: new mongoose.Types.ObjectId(userId),
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
