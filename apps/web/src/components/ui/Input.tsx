import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={
        "w-full rounded-2xl border border-white/10 bg-ink/35 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-neon/40 focus:ring-2 focus:ring-neon/20 hover:border-neon/20 focus:bg-ink/40 " +
        className
      }
      {...props}
    />
  );
}
