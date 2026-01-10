import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import { authRoutes } from "./routes/authRoutes";
import { productRoutes } from "./routes/productRoutes";
import { orderRoutes } from "./routes/orderRoutes";
import { userRoutes } from "./routes/userRoutes";
import { reviewRoutes } from "./routes/reviewRoutes";
import { assertEnv, env } from "./utils/env";
import { connectDb } from "./utils/db";
import { ensureUploadsDir, getUploadsDir } from "./utils/uploads";
import { errorHandler, notFound } from "./middleware/errorHandler";

let dbInitPromise: Promise<void> | null = null;

function normalizeOrigin(value: string) {
  return value.replace(/\/$/, "");
}

async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) return;

  if (!dbInitPromise) {
    assertEnv();
    dbInitPromise = connectDb().catch((err) => {
      dbInitPromise = null;
      throw err;
    });
  }

  await dbInitPromise;
}

export function createApp() {
  const app = express();

  const uploadsDir = getUploadsDir();
  try {
    ensureUploadsDir(uploadsDir);
  } catch {
    // If uploads can't be created, uploads will fail and surface via route error.
  }

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

  const allowedOrigins = [normalizeOrigin(env.CLIENT_URL), "http://localhost:3000"];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = normalizeOrigin(origin);
        if (allowedOrigins.includes(normalized)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
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

  // Ensure DB connection for API requests (CORS preflights are handled by cors() above).
  app.use(async (_req, _res, next) => {
    try {
      await ensureDbConnected();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.use("/api", apiLimiter);

  // Uploaded assets have unique filenames (see multer storage), so we can safely
  // cache them aggressively.
  app.use(
    "/uploads",
    express.static(uploadsDir, {
      immutable: true,
      maxAge: "365d",
    })
  );

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
