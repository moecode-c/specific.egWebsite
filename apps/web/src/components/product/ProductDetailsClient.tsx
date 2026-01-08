"use client";

import { useMemo, useState } from "react";
import type { Product } from "../../lib/types";
import { buildUploadUrl, api } from "../../lib/api";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useCart } from "../providers/CartProvider";
import { useAuth } from "../providers/AuthProvider";

export function ProductDetailsClient({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [];
  const [active, setActive] = useState(0);
  const activeImg = images[active];

  const { add } = useCart();
  const { token, user } = useAuth();
  const [wishLoading, setWishLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const compatibility = useMemo(
    () => (product.phoneModels?.length ? product.phoneModels.join(", ") : "—"),
    [product.phoneModels]
  );

  async function addWishlist() {
    setMessage(null);
    if (!token) {
      setMessage("Please login to use wishlist.");
      return;
    }

    setWishLoading(true);
    try {
      await api.wishlistAdd(token, product._id);
      setMessage("Added to wishlist.");
    } catch (e: any) {
      setMessage(e.message || "Failed");
    } finally {
      setWishLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-card">
          <div className="aspect-square">
            {activeImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={buildUploadUrl(activeImg)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/30">
                No image
              </div>
            )}
          </div>
        </div>

        {images.length > 1 ? (
          <div className="mt-4 flex gap-3 overflow-auto">
            {images.map((img, i) => (
              <button
                key={img}
                className={
                  "h-20 w-20 flex-none overflow-hidden rounded-2xl border bg-black/30 transition " +
                  (i === active
                    ? "border-neon/50"
                    : "border-white/10 hover:border-neon/30")
                }
                onClick={() => setActive(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buildUploadUrl(img)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{product.name}</h1>
            <div className="mt-2 text-sm text-white/60">{product.description}</div>
          </div>
          {product.isFeatured ? <Badge>Featured</Badge> : null}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">Price</div>
            <div className="text-2xl font-extrabold text-white">
              ${product.price.toFixed(2)}
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-white/60">Compatibility</div>
              <div className="text-white">{compatibility}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-white/60">Colors</div>
              <div className="text-white">
                {product.colors?.length ? product.colors.join(", ") : "—"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => add(product, 1)}>Add to cart</Button>
            <Button variant="ghost" disabled={wishLoading} onClick={addWishlist}>
              {user ? "Add to wishlist" : "Wishlist (login)"}
            </Button>
          </div>

          {message ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white/70">
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
