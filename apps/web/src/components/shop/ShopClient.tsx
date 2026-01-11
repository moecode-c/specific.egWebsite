"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../lib/api";
import type { Product } from "../../lib/types";
import { ProductCard } from "../ProductCard";
import { IconFilter, IconRefresh, IconSearch, IconSort } from "../Icons";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function ShopClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageMeta, setPageMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const q = sp.get("q") ?? "";
  const phoneModel = sp.get("phoneModel") ?? "";
  const color = sp.get("color") ?? "";
  const featured = sp.get("featured") ?? "";
  const sort = (sp.get("sort") ?? "newest") as "newest" | "price_asc" | "price_desc";
  const minPrice = sp.get("minPrice") ?? "";
  const maxPrice = sp.get("maxPrice") ?? "";
  const page = Math.max(Number(sp.get("page") || "1"), 1);

  const queryKey = useMemo(() => sp.toString(), [sp]);

  const phoneModelOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        products
          .flatMap((p) => (Array.isArray(p.phoneModels) ? p.phoneModels : []))
          .map((v) => (v ?? "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
    if (phoneModel && !values.includes(phoneModel)) values.unshift(phoneModel);
    return ["", ...values];
  }, [products, phoneModel]);

  const colorOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        products
          .flatMap((p) => (Array.isArray(p.colors) ? p.colors : []))
          .map((v) => (v ?? "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
    if (color && !values.includes(color)) values.unshift(color);
    return ["", ...values];
  }, [products, color]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .products({
        q: q || undefined,
        phoneModel: phoneModel || undefined,
        color: color || undefined,
        featured: featured ? featured === "true" : undefined,
        sort: sort === "newest" ? "newest" : sort,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page,
        limit: 24,
      })
      .then(({ products, page: currentPage, total, totalPages }) => {
        if (cancelled) return;
        setProducts(products);
        setPageMeta({ page: currentPage, totalPages, total });
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message || "Failed to load");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, page]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.set("page", "1");
    router.push(`/shop?${next.toString()}`);
  }

  function clearFilters() {
    router.push("/shop");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="rounded-2xl border border-white/10 bg-ink p-4 shadow-card">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <IconSearch className="text-white/70" />
          Search
        </div>
        <div className="mt-3">
          <Input
            value={q}
            placeholder="Search by name..."
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <div className="text-sm font-bold text-white">Price range</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Input
                value={minPrice}
                inputMode="decimal"
                placeholder="Min"
                onChange={(e) => setParam("minPrice", e.target.value)}
              />
              <Input
                value={maxPrice}
                inputMode="decimal"
                placeholder="Max"
                onChange={(e) => setParam("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <IconFilter className="text-white/70" />
              Phone model
            </div>
            <div className="mt-3">
              <Select value={phoneModel} onChange={(e) => setParam("phoneModel", e.target.value)}>
                {phoneModelOptions.map((m) => (
                  <option key={m} value={m} className="bg-ink">
                    {m ? m : "All"}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white">Colors</div>
            <div className="mt-3">
              <Select value={color} onChange={(e) => setParam("color", e.target.value)}>
                {colorOptions.map((c) => (
                  <option key={c} value={c} className="bg-ink">
                    {c ? c : "All"}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white">Featured</div>
            <div className="mt-3">
              <Select value={featured} onChange={(e) => setParam("featured", e.target.value)}>
                <option value="" className="bg-ink">
                  All
                </option>
                <option value="true" className="bg-ink">
                  Featured only
                </option>
                <option value="false" className="bg-ink">
                  Not featured
                </option>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <IconSort className="text-white/70" />
              Sorting
            </div>
            <div className="mt-3">
              <Select value={sort} onChange={(e) => setParam("sort", e.target.value)}>
                <option value="newest" className="bg-ink">
                  Newest
                </option>
                <option value="price_asc" className="bg-ink">
                  Price: Low to High
                </option>
                <option value="price_desc" className="bg-ink">
                  Price: High to Low
                </option>
              </Select>
            </div>
          </div>

          <Button variant="ghost" onClick={clearFilters}>
            <IconRefresh className="text-white/70" />
            Clear filters
          </Button>
        </div>
      </div>

      <div>
        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-white/60">
            {loading ? "Loading..." : `${products.length} products`}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 text-sm text-white/70">
          <div>
            Page {pageMeta.page} of {pageMeta.totalPages} ({pageMeta.total} items)
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={pageMeta.page <= 1 || loading}
              onClick={() => setParam("page", String(Math.max(1, page - 1)))}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={pageMeta.page >= pageMeta.totalPages || loading}
              onClick={() => setParam("page", String(page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
