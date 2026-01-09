"use client";

import Link from "next/link";
import type { Product } from "../lib/types";
import { buildUploadUrl } from "../lib/api";
import { formatEGP } from "../lib/money";
import { Badge } from "./ui/Badge";
import { IconArrowRight } from "./Icons";

export function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];

  return (
    <Link
      href={`/product/${product._id}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-card transition hover:border-neon/30"
    >
      <div className="aspect-square w-full bg-ink-900">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={buildUploadUrl(img)}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">{product.name}</div>
            <div className="mt-1 text-xs text-white/60 line-clamp-2">
              {product.description}
            </div>
          </div>
          {product.isFeatured ? <Badge>Featured</Badge> : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-base font-extrabold text-white">
            {formatEGP(product.price)}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50 group-hover:text-neon">
            View <IconArrowRight className="text-current" size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
