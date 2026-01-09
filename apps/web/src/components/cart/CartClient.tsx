"use client";

import Link from "next/link";
import { useCart } from "../providers/CartProvider";
import { buildUploadUrl } from "../../lib/api";
import { formatEGP } from "../../lib/money";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IconArrowRight, IconTrash } from "../Icons";

export function CartClient() {
  const { items, subtotal, remove, setQty } = useCart();

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 text-sm text-white/70 shadow-card">
        Your cart is empty. <Link className="text-neon-300 hover:text-neon" href="/shop">Go shopping</Link>.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={i.id}
            className="rounded-2xl border border-white/10 bg-ink-900 p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  {i.product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={buildUploadUrl(i.product.images[0])}
                      alt={i.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-white/30">
                      No image
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-bold text-white">{i.product.name}</div>
                  <div className="mt-1 text-xs text-white/60">{formatEGP(i.product.price)}</div>
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
              </div>
              <button
                className="text-xs text-white/50 hover:text-white"
                onClick={() => remove(i.id)}
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
                  onChange={(e) => setQty(i.id, Number(e.target.value))}
                />
              </div>
              <div className="text-sm font-extrabold text-white">
                {formatEGP(i.quantity * i.product.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
        <div className="text-sm font-bold text-white">Summary</div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-white/60">Subtotal</div>
          <div className="font-extrabold text-white">{formatEGP(subtotal)}</div>
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
