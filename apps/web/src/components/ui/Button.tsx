import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon/40 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5 hover:brightness-[1.03] hover:scale-[1.07] hover:drop-shadow-lg active:translate-y-0";
  const styles =
    variant === "primary"
      ? "bg-linear-to-r from-brand via-brand-700 to-brand-500 text-white shadow-glow hover:from-brand-700 hover:via-brand-500 hover:to-neon"
      : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-500"
        : "border border-white/10 bg-ink text-white/90 shadow-card hover:border-neon/20 hover:bg-ink/90";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
