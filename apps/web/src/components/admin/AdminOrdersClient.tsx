"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Order } from "../../lib/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { IconRefresh } from "../Icons";
import { formatEGP } from "../../lib/money";

export function AdminOrdersClient() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { orders } = await api.adminOrders(token);
      setOrders(orders);
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <div className="flex justify-end">
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

      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 shadow-card">
        <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/60">
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-white/60">Loading...</div>
        ) : (
          <div className="divide-y divide-white/10">
            {orders.map((o) => (
              <div key={o._id} className="grid grid-cols-12 gap-3 px-4 py-3">
                <div className="col-span-4 text-sm text-white">
                  {(o.user?.name ?? "User") + " "}
                  <span className="text-xs text-white/50">{o.user?.email ?? ""}</span>
                </div>
                <div className="col-span-2 text-sm text-white/70">{formatEGP(o.totalPrice)}</div>
                <div className="col-span-3">
                  <Select
                    value={o.status}
                    onChange={async (e) => {
                      if (!token) return;
                      const next = e.target.value as any;
                      await api.adminUpdateOrderStatus(token, o._id, next);
                      setOrders((prev) =>
                        prev.map((x) => (x._id === o._id ? { ...x, status: next } : x))
                      );
                    }}
                  >
                    <option value="pending" className="bg-ink">pending</option>
                    <option value="accepted" className="bg-ink">accepted</option>
                    <option value="declined" className="bg-ink">declined</option>
                  </Select>
                </div>
                <div className="col-span-3 flex justify-end">
                  <Link href={`/admin/orders/${o._id}`}>
                    <Button variant="ghost">Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
