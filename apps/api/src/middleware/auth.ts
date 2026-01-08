import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./errorHandler";
import { verifyToken } from "../utils/jwt";

export type AuthedRequest = Request & {
  user?: {
    userId: string;
    role: "user" | "admin";
  };
};

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, "Invalid token"));
  }
}

export function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") return next(new HttpError(403, "Admin only"));
  next();
}
