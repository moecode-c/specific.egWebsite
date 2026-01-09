"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Order, Product } from "../../lib/types";
import { buildUploadUrl } from "../../lib/api";
import { RequireAuth } from "../guards/RequireAuth";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { ProductCard } from "../ProductCard";
import { formatEGP } from "../../lib/money";

export function AccountClient() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([api.myOrders(token), api.wishlist(token)])
      .then(([o, w]) => {
        if (cancelled) return;
        setOrders(o.orders);
        setWishlist(w.wishlist);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <RequireAuth>
      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-extrabold text-white">Orders history</h2>
            <div className="mt-4 space-y-4">
              {orders.length ? (
                orders.map((o) => (
                  <div
                    key={o._id}
                    className="rounded-2xl border border-white/10 bg-ink-900 p-4 shadow-card"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white">
                        Order <span className="text-white/60">#{o._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div className="text-xs text-white/60">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="flex -space-x-2">
                        {(o.products ?? []).slice(0, 4).map((it, idx) => (
                          <div
                            key={`${o._id}_${idx}`}
                            className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-black/20"
                            title={it.product?.name}
                          >
                            {it.product?.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={buildUploadUrl(it.product.images[0])}
                                alt={it.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[9px] text-white/30">
                                —
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/account/orders/${o._id}`}
                        className="text-xs text-neon-300 hover:text-neon"
                      >
                        View details
                      </Link>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-white/70">
                        Status: <span className="font-semibold text-white">{o.status}</span>
                      </div>
                      <div className="text-sm font-extrabold text-white">{formatEGP(o.totalPrice)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 text-sm text-white/70 shadow-card">
                  No orders yet. <Link className="text-neon-300 hover:text-neon" href="/shop">Shop</Link>.
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-white">Wishlist</h2>
            <div className="mt-4">
              {wishlist.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {wishlist.map((p) => (
                    <div key={p._id} className="space-y-3">
                      <ProductCard product={p} />
                      <Button
                        variant="danger"
                        className="w-full"
                        type="button"
                        onClick={async () => {
                          if (!token) return;
                          await api.wishlistRemove(token, p._id);
                          setWishlist((prev) => prev.filter((x) => x._id !== p._id));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 text-sm text-white/70 shadow-card">
                  Wishlist is empty.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
