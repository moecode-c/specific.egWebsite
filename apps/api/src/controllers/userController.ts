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
