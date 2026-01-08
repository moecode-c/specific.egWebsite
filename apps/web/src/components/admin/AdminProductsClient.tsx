"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Product } from "../../lib/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { IconEdit, IconPlus, IconRefresh, IconTrash } from "../Icons";

export function AdminProductsClient() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const { products } = await api.products({ sort: "newest" });
      setProducts(products);
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/products/new">
          <Button>
            <IconPlus className="text-white/90" />
            Add product
          </Button>
        </Link>
        <Button variant="ghost" onClick={refresh}>
          <IconRefresh className="text-white/70" />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 shadow-card">
        <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/60">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-3">Featured</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-white/60">Loading...</div>
        ) : (
          <div className="divide-y divide-white/10">
            {products.map((p) => (
              <div key={p._id} className="grid grid-cols-12 gap-3 px-4 py-3">
                <div className="col-span-5 text-sm font-semibold text-white">{p.name}</div>
                <div className="col-span-2 text-sm text-white/70">${p.price.toFixed(2)}</div>
                <div className="col-span-3 text-sm text-white/70">
                  {p.isFeatured ? "Yes" : "No"}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Link href={`/admin/products/${p._id}/edit`}>
                    <Button variant="ghost">
                      <IconEdit className="text-white/70" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      if (!token) return;
                      const fd = new FormData();
                      fd.set("isFeatured", String(!p.isFeatured));
                      await api.adminUpdateProduct(token, p._id, fd);
                      setProducts((prev) =>
                        prev.map((x) =>
                          x._id === p._id ? { ...x, isFeatured: !x.isFeatured } : x
                        )
                      );
                    }}
                  >
                    Toggle
                  </Button>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      if (!token) return;
                      if (!confirm("Delete this product?")) return;
                      await api.adminDeleteProduct(token, p._id);
                      setProducts((prev) => prev.filter((x) => x._id !== p._id));
                    }}
                  >
                    <IconTrash className="text-white/90" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
