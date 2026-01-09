"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Order } from "../../lib/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

export function AdminOrderDetailsClient({ orderId }: { orderId: string }) {
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .adminOrder(token, orderId)
      .then((res) => setOrder(res.order))
      .catch((e) => setError(e.message || "Failed"))
      .finally(() => setLoading(false));
  }, [token, orderId]);

  if (loading) return <div className="text-sm text-white/60">Loading...</div>;
  if (error)
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        {error}
      </div>
    );
  if (!order) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Customer</div>
          <div className="mt-1 text-sm text-white/70">
            {order.user?.name} <span className="text-white/50">{order.user?.email}</span>
          </div>
          <div className="mt-2 text-xs text-white/50">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/50">Total</div>
          <div className="text-xl font-extrabold text-white">${order.totalPrice.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-bold text-white">Status</div>
        <div className="mt-2 max-w-xs">
          <Select
            value={order.status}
            onChange={async (e) => {
              if (!token) return;
              const next = e.target.value as any;
              await api.adminUpdateOrderStatus(token, order._id, next);
              setOrder((prev) => (prev ? { ...prev, status: next } : prev));
            }}
          >
            <option value="pending" className="bg-ink">pending</option>
            <option value="accepted" className="bg-ink">accepted</option>
            <option value="declined" className="bg-ink">declined</option>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-bold text-white">Contact</div>
        <div className="mt-2 grid gap-2 text-sm text-white/70">
          <div>
            <span className="text-white/50">Phone:</span> {order.phone ?? "—"}
          </div>
          <div>
            <span className="text-white/50">Address:</span> {order.address ?? "—"}
          </div>
          {order.notes ? (
            <div>
              <span className="text-white/50">Notes:</span> {order.notes}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-bold text-white">Products</div>
        <div className="mt-3 space-y-2">
          {order.products.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="text-white">
                {p.product?.name ?? "Product"}
                <span className="ml-2 text-xs text-white/50">x{p.quantity}</span>
              </div>
              <div className="text-white/60">${(p.product?.price ?? 0).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <Link href="/admin/orders">
          <Button variant="ghost">Back</Button>
        </Link>
      </div>
    </div>
  );
}
