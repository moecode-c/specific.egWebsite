"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { useCart } from "../providers/CartProvider";
import { RequireAuth } from "../guards/RequireAuth";
import { Button } from "../ui/Button";
import { IconSparkle } from "../Icons";

export function CheckoutClient() {
  const { token } = useAuth();
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <RequireAuth>
      {!items.length ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 shadow-card">
          Your cart is empty. <Link className="text-neon-300 hover:text-neon" href="/shop">Shop</Link>.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-card">
            <div className="text-sm font-bold text-white">Order items</div>
            <div className="mt-4 space-y-3">
              {items.map((i) => (
                <div key={i.product._id} className="flex items-center justify-between">
                  <div className="text-sm text-white">
                    {i.product.name}
                    <span className="ml-2 text-xs text-white/50">x{i.quantity}</span>
                  </div>
                  <div className="text-sm text-white/70">
                    ${(i.quantity * i.product.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              Your order will be confirmed shortly. You will be contacted soon.
            </div>

            {message ? (
              <div className="mt-4 rounded-2xl border border-neon/30 bg-neon/10 p-4 text-sm text-neon-300">
                {message}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-card">
            <div className="text-sm font-bold text-white">Total</div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-white/60">Total price</div>
              <div className="font-extrabold text-white">${subtotal.toFixed(2)}</div>
            </div>

            <div className="mt-5">
              <Button
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  setMessage(null);
                  if (!token) return;
                  setLoading(true);
                  try {
                    const payload = items.map((i) => ({
                      productId: i.product._id,
                      quantity: i.quantity,
                    }));
                    const res = await api.createOrder(token, payload);
                    clear();
                    setMessage(res.message);
                  } catch (e: any) {
                    setMessage(e.message || "Failed to place order");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <IconSparkle className="text-neon-300" />
                {loading ? "Placing..." : "Place order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
