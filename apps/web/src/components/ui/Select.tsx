import type { SelectHTMLAttributes } from "react";

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={
        "w-full appearance-none rounded-2xl border border-white/10 bg-ink/35 px-4 py-2 text-sm text-white outline-none focus:border-neon/40 focus:ring-2 focus:ring-neon/20 " +
        className
      }
      {...props}
    />
  );
}
