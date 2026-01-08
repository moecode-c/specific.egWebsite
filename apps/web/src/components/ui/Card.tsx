import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink/35 shadow-card backdrop-blur">
      {children}
    </div>
  );
}
