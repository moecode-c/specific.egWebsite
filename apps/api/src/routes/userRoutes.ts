import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin, requireAuth } from "../middleware/auth";
import {
  addToWishlist,
  adminCreateUser,
  adminDeleteUser,
  adminListUsers,
  getMe,
  getWishlist,
  removeFromWishlist,
} from "../controllers/userController";

export const userRoutes = Router();

// Admin user management
userRoutes.get("/", requireAuth, requireAdmin, asyncHandler(adminListUsers));
userRoutes.post("/", requireAuth, requireAdmin, asyncHandler(adminCreateUser));
userRoutes.delete("/:id", requireAuth, requireAdmin, asyncHandler(adminDeleteUser));

userRoutes.get("/me", requireAuth, asyncHandler(getMe));
userRoutes.get("/wishlist", requireAuth, asyncHandler(getWishlist));
userRoutes.post("/wishlist", requireAuth, asyncHandler(addToWishlist));
userRoutes.delete(
  "/wishlist/:productId",
  requireAuth,
  asyncHandler(removeFromWishlist)
);
