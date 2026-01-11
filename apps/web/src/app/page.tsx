import Link from "next/link";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { IconArrowRight, IconSparkle, IconInstagram } from "../components/Icons";
import ScrollVelocity from "../components/ScrollVelocity";
import type { Product, Review } from "../lib/types";

// Allow dynamic rendering because we use no-store fetches for live product/review data.
export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = [];
  let reviews: Review[] = [];
  
  try {
    const productsRes = await api.products({ featured: true, sort: "newest" });
    products = productsRes.products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
  
  try {
    const reviewsRes = await api.reviews({ featured: true, limit: 3 });
    reviews = reviewsRes.reviews || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }

  return (
    <div>

            
      <section className="py-14">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <Badge>Luxury tech protection</Badge>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                Premium mobile cases.
                <span className="block text-neon-300">Built to feel expensive.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
                Elevating your tech style
              </p>
              <div className="mt-7 flex gap-3">
                <Link href="/shop">
                  <Button>
                    <IconSparkle className="text-neon-300" />
                    Shop Now
                    <IconArrowRight className="text-white/70" />
                  </Button>
                </Link>
                <Link href="/shop?featured=true">
                  <Button variant="ghost">
                    Featured
                    <IconArrowRight className="text-white/60" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-ink/40 p-6 shadow-card backdrop-blur">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-white/10 bg-ink/30">
                {/* model-viewer is loaded via next/script in RootLayout */}
                <model-viewer
                  id="main-3d-model"
                  src="/3dspecific.glb"
                  alt="3D preview of a SPECIFIC case"
                  className="absolute inset-0 block h-full w-full"
                  camera-controls
                  camera-orbit="90deg 90deg 2.4m" // Ensures model faces user
                  camera-target="0m 0m 0m"
                  auto-rotate
                  rotation-per-second="20deg"
                  shadow-intensity="0.8"
                  exposure="1"
                  interaction-prompt="none"
                  style={{ background: "transparent", width: "100%", height: "100%" }}
                />
                <script dangerouslySetInnerHTML={{
                  __html: `
                    window.addEventListener('DOMContentLoaded', function() {
                      var mv = document.getElementById('main-3d-model');
                      if (mv) {
                        mv.cameraOrbit = '90deg 90deg 2.4m';
                        mv.cameraTarget = '0m 0m 0m';
                      }
                    });
                  `
                }} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-6">
        <ScrollVelocity
          texts={["SPECIFIC  •  PREMIUM CASES  •  VIBRANT PROTECTION", "NEON PURPLE  •  PINK GLOW  •  LUXURY TECH"]}
          velocity={110}
          className="text-white"
          parallaxClassName="py-2"
        />
      </section>

      <section className="py-10">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Featured</h2>
              <p className="mt-1 text-sm text-white/60">
                Only products marked as featured.
              </p>
            </div>
            <Link
              className="text-sm text-neon-300 hover:text-neon"
              href="/shop?featured=true"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Reviews</h2>
              <p className="mt-1 text-sm text-white/60">What customers are saying.</p>
            </div>
            <Link className="text-sm text-neon-300 hover:text-neon" href="/reviews-testimonials">
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="rounded-2xl border border-white/10 bg-ink/35 p-6 shadow-card backdrop-blur transition hover:border-neon/30"
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
      </section>

      {/* Contact Information Section (moved to end) */}
            <section className="py-14">
              <Container>
                <div className="rounded-2xl border border-white/10 bg-ink/40 p-8 shadow-card backdrop-blur max-w-xl mx-auto">
                  <h2 className="text-2xl font-extrabold text-white mb-4 text-center">Contact Information</h2>
                  <div className="flex flex-col gap-4 items-center text-white/80">
                    <span className="flex items-center gap-2">
                      <IconInstagram size={20} className="text-pink-400" />
                      <a href="https://www.instagram.com/specific.eg/" target="_blank" rel="noopener" className="underline">Instagram</a>
                    </span>
                    <span className="flex items-center gap-2">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" className="inline-block text-blue-400"><path d="M4 4h16v16H4z"/><path d="M4 4l8 8 8-8"/></svg>
                      <a href="mailto:specific.eg@gmail.com" className="underline">specific.eg@gmail.com</a>
                    </span>
                    <span className="flex items-center gap-2">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" className="inline-block text-green-400"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C5.92 22 2 18.08 2 13.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"/></svg>
                      <a href="tel:01055708429" className="underline">01055708429</a>
                    </span>
                  </div>
                </div>
              </Container>
            </section>
    </div>
  );
}
