import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof Error ? err.message : "Server error";

  // Surface detailed errors in logs to help diagnose 500s (e.g., storage upload failures).
  // eslint-disable-next-line no-console
  console.error("API error", { status, message, err });

  res.status(status).json({ message });
}
