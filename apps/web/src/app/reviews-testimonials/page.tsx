import { Container } from "../../components/Container";
import { api } from "../../lib/api";
import type { Review } from "../../lib/types";

// Dynamic rendering is required because we use no-store fetches for live reviews data.
export const dynamic = "force-dynamic";

export default async function ReviewsTestimonialsPage() {
  let reviews: Review[] = [];
  try {
    const res = await api.reviews({});
    reviews = res.reviews || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }

  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Reviews & testimonials</h1>
        <p className="mt-1 text-sm text-white/60">What customers are saying.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-white/10 bg-ink/35 p-6 shadow-card backdrop-blur"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-extrabold text-white">{r.title}</div>
                <div className="text-xs text-white/60">{r.rating}/5</div>
              </div>
              <div className="mt-2 text-sm text-white/70">{r.body}</div>
              <div className="mt-4 text-xs text-white/50">— {r.name}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
