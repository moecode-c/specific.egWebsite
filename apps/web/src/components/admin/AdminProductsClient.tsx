"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Product } from "../../lib/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { IconEdit, IconPlus, IconRefresh, IconTrash } from "../Icons";
import { formatEGP } from "../../lib/money";

export function AdminProductsClient() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageMeta, setPageMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const pageSize = 50;

  async function refresh(nextPage = pageMeta.page) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.products({ sort: "newest", page: nextPage, limit: pageSize });
      setProducts(res.products);
      setPageMeta({ page: res.page, totalPages: res.totalPages, total: res.total });
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh(1);
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
        <Button variant="ghost" onClick={() => refresh(pageMeta.page)}>
          <IconRefresh className="text-white/70" />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 shadow-card">
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
                <div className="col-span-2 text-sm text-white/70">{formatEGP(p.price)}</div>
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

      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-white/70">
        <div>
          Page {pageMeta.page} of {pageMeta.totalPages} ({pageMeta.total} items)
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={pageMeta.page <= 1 || loading}
            onClick={() => refresh(Math.max(1, pageMeta.page - 1))}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={pageMeta.page >= pageMeta.totalPages || loading}
            onClick={() => refresh(pageMeta.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
