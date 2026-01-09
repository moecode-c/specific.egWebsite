"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Product } from "../../lib/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { buildUploadUrl } from "../../lib/api";

export function AdminProductForm({
  mode,
  productId,
}: {
  mode: "create" | "edit";
  productId?: string;
}) {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("19.99");
  const [phoneModels, setPhoneModels] = useState("13, 14 Pro, 15");
  const [colors, setColors] = useState("Black, Neon Purple");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (mode !== "edit" || !productId) return;
    setLoading(true);
    api
      .product(productId)
      .then(({ product }) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(String(product.price));
        setPhoneModels(product.phoneModels.join(", "));
        setColors(product.colors?.join(", ") ?? "");
        setIsFeatured(Boolean(product.isFeatured));
        setExistingImages(product.images ?? []);
      })
      .catch((e) => setError(e.message || "Failed"))
      .finally(() => setLoading(false));
  }, [mode, productId]);

  return (
    <Card>
      <form
        className="p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          if (!token) return;
          setLoading(true);
          try {
            const fd = new FormData();
            fd.set("name", name);
            fd.set("description", description);
            fd.set("price", price);
            fd.set("phoneModels", phoneModels);
            fd.set("colors", colors);
            fd.set("isFeatured", String(isFeatured));
            if (images) {
              Array.from(images).forEach((f) => fd.append("images", f));
            }

            let saved: Product;
            if (mode === "create") {
              saved = (await api.adminCreateProduct(token, fd)).product;
            } else {
              if (!productId) throw new Error("Missing productId");
              saved = (await api.adminUpdateProduct(token, productId, fd)).product;
            }

            router.push(`/admin/products/${saved._id}/edit`);
          } catch (e: any) {
            setError(e.message || "Failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="grid gap-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            inputMode="decimal"
            required
          />
          <Input
            value={phoneModels}
            onChange={(e) => setPhoneModels(e.target.value)}
            placeholder="Compatible phone models (comma separated)"
          />
          <Input
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Available colors (comma separated)"
          />

          <label className="flex items-center gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/10"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured product
          </label>

          <div>
            <div className="text-sm font-semibold text-white">Images</div>
            {existingImages.length ? (
              <div className="mt-3 flex gap-3 overflow-auto">
                {existingImages.map((img) => (
                  <div
                    key={img}
                    className="h-20 w-20 flex-none overflow-hidden rounded-2xl border border-white/10 bg-black/30"
                    title={img}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={buildUploadUrl(img)}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-xs text-white/50">No images yet.</div>
            )}

            <div className="mt-5 text-sm font-semibold text-white">Upload new images</div>
            <input
              className="mt-2 block w-full text-sm text-white/70 file:mr-4 file:rounded-2xl file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Button disabled={loading} type="submit">
            {loading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          <Link href="/admin/products">
            <Button variant="ghost" type="button">Back</Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}
