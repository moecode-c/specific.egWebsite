import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin, requireAuth } from "../middleware/auth";
import {
  createReview,
  deleteReview,
  listReviews,
  updateReview,
} from "../controllers/reviewController";

export const reviewRoutes = Router();

// Public
reviewRoutes.get("/", asyncHandler(listReviews));

// Admin
reviewRoutes.post("/", requireAuth, requireAdmin, asyncHandler(createReview));
reviewRoutes.put("/:id", requireAuth, requireAdmin, asyncHandler(updateReview));
reviewRoutes.delete("/:id", requireAuth, requireAdmin, asyncHandler(deleteReview));
