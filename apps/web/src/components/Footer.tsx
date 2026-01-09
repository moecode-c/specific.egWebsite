import { Container } from "./Container";
import { IconSparkle } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col gap-3 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="SPECIFIC"
              className="h-9 w-9 rounded-2xl shadow-glow"
            />
            <div>
              <div className="font-semibold text-white">SPECIFIC</div>
              <div>Premium mobile cases. Ready for logo integration.</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-white/50">
            <IconSparkle size={16} className="text-neon-300" />
            Dark purple premium theme
          </div>
        </div>
      </Container>
    </footer>
  );
}
