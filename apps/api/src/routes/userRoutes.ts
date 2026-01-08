import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import {
  addToWishlist,
  getMe,
  getWishlist,
  removeFromWishlist,
} from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get("/me", requireAuth, asyncHandler(getMe));
userRoutes.get("/wishlist", requireAuth, asyncHandler(getWishlist));
userRoutes.post("/wishlist", requireAuth, asyncHandler(addToWishlist));
userRoutes.delete(
  "/wishlist/:productId",
  requireAuth,
  asyncHandler(removeFromWishlist)
);
