"use client";

import { useEffect, useState } from "react";
import type { Review } from "../../lib/types";
import { api } from "../../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

export function AdminReviewsClient() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("Customer");
  const [rating, setRating] = useState("5");
  const [title, setTitle] = useState("Amazing quality");
  const [body, setBody] = useState("Premium feel, perfect fit, fast delivery.");
  const [isFeatured, setIsFeatured] = useState(true);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const { reviews } = await api.reviews({});
      setReviews(reviews);
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-5">
          <div className="text-sm font-extrabold text-white">Add review</div>
          <div className="mt-4 grid gap-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" />
            <Input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (1-5)" inputMode="numeric" />
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Review text"
              className="min-h-24 w-full resize-y rounded-2xl border border-white/10 bg-ink/35 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-neon/40 focus:ring-2 focus:ring-neon/20"
            />

            <label className="flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/10"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Show on Home page
            </label>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-5 flex gap-3">
            <Button
              disabled={!token}
              onClick={async () => {
                if (!token) return;
                setError(null);
                try {
                  const n = Math.max(1, Math.min(5, Number(rating || 5)));
                  const res = await api.adminCreateReview(token, {
                    name,
                    rating: n,
                    title,
                    body,
                    isFeatured,
                  });
                  setReviews((prev) => [res.review, ...prev]);
                } catch (e: any) {
                  setError(e.message || "Failed");
                }
              }}
            >
              Add
            </Button>
            <Button variant="ghost" onClick={refresh}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-card">
        <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/60">
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Rating</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-white/60">Loading...</div>
        ) : (
          <div className="divide-y divide-white/10">
            {reviews.map((r) => (
              <div key={r._id} className="grid grid-cols-12 gap-3 px-4 py-3">
                <div className="col-span-4 text-sm text-white">{r.name}</div>
                <div className="col-span-2 text-sm text-white/70">{r.rating}/5</div>
                <div className="col-span-4 text-sm text-white/70">{r.title}</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    disabled={!token}
                    onClick={async () => {
                      if (!token) return;
                      const next = !r.isFeatured;
                      await api.adminUpdateReview(token, r._id, { isFeatured: next });
                      setReviews((prev) => prev.map((x) => (x._id === r._id ? { ...x, isFeatured: next } : x)));
                    }}
                  >
                    {r.isFeatured ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={!token}
                    onClick={async () => {
                      if (!token) return;
                      if (!confirm("Delete this review?")) return;
                      await api.adminDeleteReview(token, r._id);
                      setReviews((prev) => prev.filter((x) => x._id !== r._id));
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
