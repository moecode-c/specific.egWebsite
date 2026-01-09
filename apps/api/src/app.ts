import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";

import { authRoutes } from "./routes/authRoutes";
import { productRoutes } from "./routes/productRoutes";
import { orderRoutes } from "./routes/orderRoutes";
import { userRoutes } from "./routes/userRoutes";
import { reviewRoutes } from "./routes/reviewRoutes";
import { env } from "./utils/env";
import { errorHandler, notFound } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  const uploadsDir = path.resolve(__dirname, "..", "uploads");

  app.disable("x-powered-by");

  // Basic rate limiting (tune values as needed)
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(morgan("dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiLimiter);

  app.use("/uploads", express.static(uploadsDir));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/reviews", reviewRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
