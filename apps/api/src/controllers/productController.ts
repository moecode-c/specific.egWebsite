import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler";
import { Product } from "../models/Product";
import { uploadImagesToSupabase } from "../utils/storage";

export async function listProducts(req: Request, res: Response) {
  const {
    q,
    minPrice,
    maxPrice,
    phoneModel,
    color,
    featured,
    sort,
    page,
    limit,
  } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = {};

  if (q) {
    filter.$text = { $search: q };
  }

  if (featured === "true") filter.isFeatured = true;
  if (featured === "false") filter.isFeatured = false;
  if (phoneModel) filter.phoneModels = phoneModel;
  if (color) filter.colors = color;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) (filter.price as any).$gte = Number(minPrice);
    if (maxPrice) (filter.price as any).$lte = Number(maxPrice);
  }

  const sortObj: Record<string, 1 | -1> = {};
  if (sort === "price_asc") sortObj.price = 1;
  else if (sort === "price_desc") sortObj.price = -1;
  else sortObj.createdAt = -1;

  const pageNum = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 24, 1), 100);
  const skip = (pageNum - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .select("name description price images phoneModels colors isFeatured createdAt")
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    total,
    page: pageNum,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

export async function getProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findById(id).lean();
  if (!product) throw new HttpError(404, "Product not found");
  res.json({ product });
}

export async function createProduct(req: Request, res: Response) {
  const { name, description, price, phoneModels, colors, isFeatured } = req.body as any;

  if (!name || !description || price === undefined) {
    throw new HttpError(400, "Missing fields");
  }

  const images = await uploadImagesToSupabase(
    req.files as Express.Multer.File[] | undefined,
    "products"
  );

  const doc = await Product.create({
    name,
    description,
    price: Number(price),
    images: images ?? [],
    phoneModels: normalizeStringArray(phoneModels),
    colors: normalizeStringArray(colors),
    isFeatured: isFeatured === "true" || isFeatured === true,
  });

  res.status(201).json({ product: doc });
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const existing = await Product.findById(id);
  if (!existing) throw new HttpError(404, "Product not found");

  const { name, description, price, phoneModels, colors, isFeatured } = req.body as any;

  if (name !== undefined) existing.name = name;
  if (description !== undefined) existing.description = description;
  if (price !== undefined) existing.price = Number(price);
  if (phoneModels !== undefined) existing.phoneModels = normalizeStringArray(phoneModels);
  if (colors !== undefined) existing.colors = normalizeStringArray(colors);
  if (isFeatured !== undefined)
    existing.isFeatured = isFeatured === "true" || isFeatured === true;

  const newImages = await uploadImagesToSupabase(
    req.files as Express.Multer.File[] | undefined,
    "products"
  );
  if (newImages?.length) existing.images = [...existing.images, ...newImages];

  await existing.save();
  res.json({ product: existing });
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;
  const existing = await Product.findById(id);
  if (!existing) throw new HttpError(404, "Product not found");
  await existing.deleteOne();
  res.json({ ok: true });
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}
