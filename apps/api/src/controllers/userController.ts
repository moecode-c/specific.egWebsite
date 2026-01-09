import type { Response } from "express";
import mongoose from "mongoose";
import { AuthedRequest } from "../middleware/auth";
import { User } from "../models/User";
import { HttpError } from "../middleware/errorHandler";

export async function getMe(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.user!.userId).select("name email role wishlist").lean();
  if (!user) throw new HttpError(404, "User not found");
  res.json({ user });
}

export async function getWishlist(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.user!.userId)
    .populate("wishlist")
    .select("wishlist")
    .lean();
  res.json({ wishlist: user?.wishlist ?? [] });
}

export async function addToWishlist(req: AuthedRequest, res: Response) {
  const { productId } = req.body as { productId?: string };
  if (!productId) throw new HttpError(400, "Missing productId");

  await User.updateOne(
    { _id: req.user!.userId },
    { $addToSet: { wishlist: new mongoose.Types.ObjectId(productId) } }
  );

  res.json({ ok: true });
}

export async function removeFromWishlist(req: AuthedRequest, res: Response) {
  const { productId } = req.params;
  await User.updateOne(
    { _id: req.user!.userId },
    { $pull: { wishlist: new mongoose.Types.ObjectId(productId) } }
  );
  res.json({ ok: true });
}

export async function adminListUsers(_req: AuthedRequest, res: Response) {
  const users = await User.find()
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();
  res.json({ users });
}

export async function adminCreateUser(req: AuthedRequest, res: Response) {
  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: "user" | "admin";
  };

  if (!name || !email || !password) throw new HttpError(400, "Missing fields");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new HttpError(409, "Email already in use");

  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "admin" : "user",
  });

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}

export async function adminDeleteUser(req: AuthedRequest, res: Response) {
  const { id } = req.params as { id: string };
  if (!id) throw new HttpError(400, "Missing id");
  if (id === req.user!.userId) throw new HttpError(400, "Cannot delete yourself");

  const user = await User.findById(id);
  if (!user) throw new HttpError(404, "User not found");

  await User.deleteOne({ _id: user._id });
  res.json({ ok: true });
}
