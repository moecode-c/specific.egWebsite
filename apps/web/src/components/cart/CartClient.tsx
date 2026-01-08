"use client";

import Link from "next/link";
import { useCart } from "../providers/CartProvider";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IconArrowRight, IconTrash } from "../Icons";

export function CartClient() {
  const { items, subtotal, remove, setQty } = useCart();

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 shadow-card">
        Your cart is empty. <Link className="text-neon-300 hover:text-neon" href="/shop">Go shopping</Link>.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={i.product._id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white">{i.product.name}</div>
                <div className="mt-1 text-xs text-white/60">
                  ${i.product.price.toFixed(2)}
                </div>
              </div>
              <button
                className="text-xs text-white/50 hover:text-white"
                onClick={() => remove(i.product._id)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconTrash size={16} className="text-white/60" />
                  Remove
                </span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="w-24">
                <Input
                  type="number"
                  min={1}
                  value={i.quantity}
                  onChange={(e) => setQty(i.product._id, Number(e.target.value))}
                />
              </div>
              <div className="text-sm font-extrabold text-white">
                ${(i.quantity * i.product.price).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-card">
        <div className="text-sm font-bold text-white">Summary</div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-white/60">Subtotal</div>
          <div className="font-extrabold text-white">${subtotal.toFixed(2)}</div>
        </div>
        <div className="mt-5">
          <Link href="/checkout" className="block">
            <Button className="w-full">
              Go to checkout
              <IconArrowRight className="text-white/70" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
