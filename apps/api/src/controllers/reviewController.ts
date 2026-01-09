import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler";
import { Review } from "../models/Review";

export async function listReviews(req: Request, res: Response) {
  const { featured, limit } = req.query as { featured?: string; limit?: string };
  const filter: Record<string, unknown> = {};
  if (featured === "true") filter.isFeatured = true;
  if (featured === "false") filter.isFeatured = false;

  const lim = Math.min(Math.max(Number(limit ?? 0) || 0, 0), 50);

  const q = Review.find(filter).sort({ createdAt: -1 });
  if (lim) q.limit(lim);

  const reviews = await q.lean();
  res.json({ reviews });
}

export async function createReview(req: Request, res: Response) {
  const { name, rating, title, body, isFeatured } = req.body as any;

  if (!name || !title || !body || rating === undefined) {
    throw new HttpError(400, "Missing fields");
  }

  const doc = await Review.create({
    name,
    title,
    body,
    rating: Number(rating),
    isFeatured: isFeatured === "true" || isFeatured === true,
  });

  res.status(201).json({ review: doc });
}

export async function updateReview(req: Request, res: Response) {
  const { id } = req.params;
  const existing = await Review.findById(id);
  if (!existing) throw new HttpError(404, "Review not found");

  const { name, rating, title, body, isFeatured } = req.body as any;

  if (name !== undefined) existing.name = String(name);
  if (title !== undefined) existing.title = String(title);
  if (body !== undefined) existing.body = String(body);
  if (rating !== undefined) existing.rating = Number(rating);
  if (isFeatured !== undefined)
    existing.isFeatured = isFeatured === "true" || isFeatured === true;

  await existing.save();
  res.json({ review: existing });
}

export async function deleteReview(req: Request, res: Response) {
  const { id } = req.params;
  const existing = await Review.findById(id);
  if (!existing) throw new HttpError(404, "Review not found");
  await existing.deleteOne();
  res.json({ ok: true });
}
