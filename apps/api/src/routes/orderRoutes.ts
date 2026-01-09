import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin, requireAuth } from "../middleware/auth";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";

export const orderRoutes = Router();

orderRoutes.post("/", requireAuth, asyncHandler(createOrder));
orderRoutes.get("/mine", requireAuth, asyncHandler(getMyOrders));
orderRoutes.get("/all", requireAuth, requireAdmin, asyncHandler(getAllOrders));
orderRoutes.get("/:id", requireAuth, asyncHandler(getOrderById));
orderRoutes.patch(
  "/:id/status",
  requireAuth,
  requireAdmin,
  asyncHandler(updateOrderStatus)
);
orderRoutes.delete("/:id", requireAuth, requireAdmin, asyncHandler(deleteOrder));
