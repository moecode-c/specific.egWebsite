import Link from "next/link";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { IconArrowRight, IconSparkle } from "../components/Icons";

export default async function Home() {
  const { products } = await api.products({ featured: true, sort: "newest" });

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
                Dark, minimal, and engineered for everyday protection. Neon accents,
                soft shadows, and a premium purple core.
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
              <div className="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-black/25 p-6">
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-white/50">
                      3D PREVIEW
                    </div>
                    <div className="mt-2 text-lg font-extrabold text-white">
                      Model Placeholder
                    </div>
                    <div className="mt-2 text-sm text-white/60">
                      You&apos;ll add it later using <span className="text-white/80">model-viewer</span>.
                    </div>
                    <div className="mt-4 text-xs text-white/45">
                      Keep this container; swap the content with a <span className="text-white/70">&lt;model-viewer&gt;</span>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
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
          <h2 className="text-xl font-extrabold text-white">Categories</h2>
          <p className="mt-1 text-sm text-white/60">
            Browse by phone compatibility.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["13", "14 Pro", "15", "17"].map((m) => (
              <Link
                key={m}
                href={`/shop?phoneModel=${encodeURIComponent(m)}`}
                className="rounded-2xl border border-white/10 bg-ink/35 p-5 text-center shadow-card backdrop-blur transition hover:border-neon/30"
              >
                <div className="text-xs text-white/50">Phone</div>
                <div className="mt-2 text-base font-bold text-white">{m}</div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
