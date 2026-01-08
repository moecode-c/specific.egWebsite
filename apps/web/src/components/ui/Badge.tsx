import type { PropsWithChildren } from "react";

export function Badge({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-semibold text-neon-300">
      {children}
    </span>
  );
}
