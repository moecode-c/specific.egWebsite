"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, buildUploadUrl } from "../../lib/api";
import type { Order } from "../../lib/types";
import { RequireAuth } from "../guards/RequireAuth";
import { useAuth } from "../providers/AuthProvider";
import { formatEGP } from "../../lib/money";

export function OrderDetailsClient({ orderId }: { orderId: string }) {
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    api
      .order(token, orderId)
      .then((res) => {
        if (cancelled) return;
        setOrder(res.order);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message || "Failed to load order");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, orderId]);

  return (
    <RequireAuth>
      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : error ? (
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 text-sm text-white/70 shadow-card">
          {error}
        </div>
      ) : !order ? (
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 text-sm text-white/70 shadow-card">
          Order not found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">
                Order <span className="text-white/60">#{order._id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="mt-1 text-xs text-white/60">
                {new Date(order.createdAt).toLocaleString()} • Status: {order.status}
              </div>
            </div>
            <Link className="text-sm text-neon-300 hover:text-neon" href="/account">
              Back
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
              <div className="text-sm font-bold text-white">Delivery</div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div>
                  <span className="text-white/60">Phone:</span> {order.phone || "—"}
                </div>
                <div>
                  <span className="text-white/60">Address:</span> {order.address || "—"}
                </div>
                {order.notes ? (
                  <div>
                    <span className="text-white/60">Notes:</span> {order.notes}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
              <div className="text-sm font-bold text-white">Total</div>
              <div className="mt-3 text-2xl font-extrabold text-white">{formatEGP(order.totalPrice)}</div>
              <div className="mt-1 text-xs text-white/60">Payment on delivery (as configured).</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
            <div className="text-sm font-bold text-white">Items</div>
            <div className="mt-4 space-y-4">
              {order.products.map((it, idx) => {
                const img = it.product?.images?.[0];
                return (
                  <div key={`${order._id}_${idx}`} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={buildUploadUrl(img)}
                            alt={it.product?.name ?? "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-white/30">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{it.product?.name ?? "Product"}</div>
                        <div className="mt-1 text-xs text-white/60">Qty: {it.quantity}</div>
                        {it.phoneModel || it.color ? (
                          <div className="mt-1 text-xs text-white/60">
                            {it.phoneModel ? (
                              <span>
                                <span className="text-white/50">Model:</span> {it.phoneModel}
                              </span>
                            ) : null}
                            {it.phoneModel && it.color ? (
                              <span className="mx-2 text-white/40">•</span>
                            ) : null}
                            {it.color ? (
                              <span>
                                <span className="text-white/50">Color:</span> {it.color}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-sm font-extrabold text-white">
                      {formatEGP((it.product?.price ?? 0) * it.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
