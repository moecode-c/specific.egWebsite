import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink shadow-card transition hover:border-neon/20">
      {children}
    </div>
  );
}
