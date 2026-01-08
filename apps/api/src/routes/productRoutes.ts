import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/productController";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const productRoutes = Router();

productRoutes.get("/", asyncHandler(listProducts));
productRoutes.get("/:id", asyncHandler(getProduct));

productRoutes.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.array("images", 8),
  asyncHandler(createProduct)
);

productRoutes.put(
  "/:id",
  requireAuth,
  requireAdmin,
  upload.array("images", 8),
  asyncHandler(updateProduct)
);

productRoutes.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(deleteProduct)
);
