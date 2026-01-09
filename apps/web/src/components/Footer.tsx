import { Container } from "./Container";
import { IconSparkle } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 py-10 bg-gradient-to-br from-purple-900 via-brand to-ink">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="SPECIFIC"
              className="h-12 w-12 rounded-2xl shadow-glow border border-white/10 bg-black/30"
            />
            <div>
              <div className="text-lg font-extrabold tracking-wide text-white drop-shadow">SPECIFIC</div>
              <div className="text-sm text-white/80">Premium mobile cases. Luxury tech protection.</div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} SPECIFIC. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
