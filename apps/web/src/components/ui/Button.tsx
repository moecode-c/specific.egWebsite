import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-neon/40 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-brand via-brand-700 to-brand-500 text-white shadow-glow hover:from-brand-700 hover:via-brand-500 hover:to-neon"
      : variant === "danger"
        ? "bg-red-600/80 text-white hover:bg-red-600"
        : "border border-white/10 bg-ink/20 text-white/90 hover:bg-white/5";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
