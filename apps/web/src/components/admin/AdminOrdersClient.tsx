"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Order } from "../../lib/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { IconRefresh } from "../Icons";
import { formatEGP } from "../../lib/money";

export function AdminOrdersClient() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "accepted" | "declined">(
    "all"
  );
  const [sort, setSort] = useState<"newest" | "oldest" | "total_asc" | "total_desc">(
    "newest"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { orders } = await api.adminOrders(token, {
        q: q.trim() || undefined,
        status: status === "all" ? undefined : status,
        sort,
      });
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

  useEffect(() => {
    if (!token) return;
    const t = setTimeout(() => refresh(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, sort, token]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid w-full grid-cols-1 gap-3 md:max-w-3xl md:grid-cols-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by customer, phone, address, order id..."
          />
          <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="all" className="bg-ink">all statuses</option>
            <option value="pending" className="bg-ink">pending</option>
            <option value="accepted" className="bg-ink">accepted</option>
            <option value="declined" className="bg-ink">declined</option>
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="newest" className="bg-ink">newest</option>
            <option value="oldest" className="bg-ink">oldest</option>
            <option value="total_desc" className="bg-ink">total: high → low</option>
            <option value="total_asc" className="bg-ink">total: low → high</option>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={refresh}>
            <IconRefresh className="text-white/70" />
            Refresh
          </Button>
        </div>
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
                  <div className="flex gap-2">
                    <Link href={`/admin/orders/${o._id}`}>
                      <Button variant="ghost">Details</Button>
                    </Link>
                    <Button
                      variant="danger"
                      disabled={!token || deletingId === o._id}
                      onClick={async () => {
                        if (!token) return;
                        const ok = window.confirm(
                          "Delete this order? This cannot be undone."
                        );
                        if (!ok) return;

                        setDeletingId(o._id);
                        setError(null);
                        try {
                          await api.adminDeleteOrder(token, o._id);
                          setOrders((prev) => prev.filter((x) => x._id !== o._id));
                        } catch (e: any) {
                          setError(e.message || "Failed");
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {!orders.length ? (
              <div className="p-4 text-sm text-white/60">No orders found.</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
