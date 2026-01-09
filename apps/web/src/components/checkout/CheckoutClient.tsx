"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { useCart } from "../providers/CartProvider";
import { RequireAuth } from "../guards/RequireAuth";
import { Button } from "../ui/Button";
import { IconSparkle } from "../Icons";
import { Input } from "../ui/Input";
import { formatEGP } from "../../lib/money";

export function CheckoutClient() {
  const { token } = useAuth();
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <RequireAuth>
      {!items.length ? (
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 text-sm text-white/70 shadow-card">
          Your cart is empty. <Link className="text-neon-300 hover:text-neon" href="/shop">Shop</Link>.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
            <div className="text-sm font-bold text-white">Order details</div>
            <div className="mt-4 grid gap-3">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                autoComplete="tel"
                required
              />
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address / location"
                autoComplete="street-address"
                required
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="min-h-24 w-full resize-y rounded-2xl border border-white/10 bg-ink/35 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-neon/40 focus:ring-2 focus:ring-neon/20"
              />
            </div>

            <div className="mt-7 text-sm font-bold text-white">Order items</div>
            <div className="mt-4 space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex items-center justify-between">
                  <div className="text-sm text-white">
                    {i.product.name}
                    <span className="ml-2 text-xs text-white/50">x{i.quantity}</span>
                    {i.phoneModel || i.color ? (
                      <div className="mt-1 text-xs text-white/60">
                        {i.phoneModel ? (
                          <span>
                            <span className="text-white/50">Model:</span> {i.phoneModel}
                          </span>
                        ) : null}
                        {i.phoneModel && i.color ? <span className="mx-2 text-white/40">•</span> : null}
                        {i.color ? (
                          <span>
                            <span className="text-white/50">Color:</span> {i.color}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-sm text-white/70">
                    {formatEGP(i.quantity * i.product.price)}
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

          <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
            <div className="text-sm font-bold text-white">Total</div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-white/60">Total price</div>
              <div className="font-extrabold text-white">{formatEGP(subtotal)}</div>
            </div>

            <div className="mt-5">
              <Button
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  setMessage(null);
                  if (!token) return;
                  if (!phone.trim() || !address.trim()) {
                    setMessage("Please enter phone number and address.");
                    return;
                  }
                  setLoading(true);
                  try {
                    const products = items.map((i) => ({
                      productId: i.product._id,
                      quantity: i.quantity,
                      phoneModel: i.phoneModel,
                      color: i.color,
                    }));
                    const res = await api.createOrder(token, {
                      products,
                      phone,
                      address,
                      notes,
                    });
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
