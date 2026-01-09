"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers/AuthProvider";
import { useCart } from "./providers/CartProvider";
import { api } from "../lib/api";
import {
  IconBag,
  IconCart,
  IconEye,
  IconEyeOff,
  IconFilter,
  IconHome,
  IconPlus,
  IconShield,
  IconSparkle,
  IconUser,
} from "./Icons";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function Navbar() {
  const { user, logout, setAuth } = useAuth();
  const { count } = useCart();
  const router = useRouter();

  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLoginOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [loginOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-brand via-purple-900 to-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt="SPECIFIC"
            className="h-9 w-9 rounded-2xl shadow-glow transition-transform duration-200 group-hover:scale-[1.04]"
          />
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-wide text-white">SPECIFIC</div>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden flex-wrap items-center justify-end gap-3 text-sm sm:flex">
          <Link className="flex items-center gap-2 text-white/80 transition hover:text-neon hover:scale-[1.07] hover:drop-shadow-lg" href="/">
            <IconHome className="text-white/70" />
            <span>Home</span>
          </Link>
          <Link className="flex items-center gap-2 text-white/80 transition hover:text-neon hover:scale-[1.07] hover:drop-shadow-lg" href="/shop">
            <IconBag className="text-white/70" />
            <span>Shop</span>
          </Link>
          <Link
            className="flex items-center gap-2 text-white/80 transition hover:text-neon hover:scale-[1.07] hover:drop-shadow-lg"
            href="/reviews-testimonials"
          >
            <IconSparkle className="text-white/70" />
            <span>Reviews</span>
          </Link>
          <Link className="flex items-center gap-2 text-white/80 transition hover:text-neon hover:scale-[1.07] hover:drop-shadow-lg" href="/cart">
            <IconCart className="text-white/70" />
            <span>Cart</span>
            {count > 0 ? (
              <span className="ml-2 rounded-full bg-neon/15 px-2 py-0.5 text-xs font-bold text-neon-300">
                {count}
              </span>
            ) : null}
          </Link>

          {user ? (
            <>
              <Link className="flex items-center gap-2 text-white/80 transition hover:text-neon hover:scale-[1.07] hover:drop-shadow-lg" href="/account">
                <IconUser className="text-white/70" />
                <span>Account</span>
              </Link>
              {user.role === "admin" ? (
                <Link className="flex items-center gap-2 text-white/80 transition hover:text-neon hover:scale-[1.07] hover:drop-shadow-lg" href="/admin">
                  <IconShield className="text-white/70" />
                  <span>Admin</span>
                </Link>
              ) : null}
              <button className="text-white/70 transition hover:text-white hover:scale-[1.07] hover:drop-shadow-lg" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="flex items-center gap-2 text-white/80 transition hover:text-neon"
              onClick={() => {
                setError(null);
                setAuthMode("login");
                setLoginOpen(true);
              }}
            >
              <IconUser className="text-white/70" />
              <span>Login</span>
            </button>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-ink text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
            aria-label="Cart"
          >
            <IconCart className="text-white/70" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-neon/30 px-1.5 py-0.5 text-[10px] font-extrabold text-neon-300">
                {count}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-ink px-3 text-sm font-semibold text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <IconPlus className="rotate-45" /> : <IconFilter />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-white/10 bg-ink p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-white">Menu</div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl border border-white/10 bg-ink px-3 py-2 text-xs text-white/70 transition hover:border-neon/20 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
                onClick={() => setMobileOpen(false)}
              >
                <IconHome className="text-white/70" />
                Home
              </Link>
              <Link
                href="/shop"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
                onClick={() => setMobileOpen(false)}
              >
                <IconBag className="text-white/70" />
                Shop
              </Link>
              <Link
                href="/reviews-testimonials"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
                onClick={() => setMobileOpen(false)}
              >
                <IconSparkle className="text-white/70" />
                Reviews
              </Link>
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
                    onClick={() => setMobileOpen(false)}
                  >
                    <IconUser className="text-white/70" />
                    Account
                  </Link>
                  {user.role === "admin" ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
                      onClick={() => setMobileOpen(false)}
                    >
                      <IconShield className="text-white/70" />
                      Admin
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-left text-white/80 shadow-card transition hover:border-neon/20 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setError(null);
                    setAuthMode("login");
                    setLoginOpen(true);
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-left text-white/80 shadow-card transition hover:border-neon/20 hover:text-neon"
                >
                  <IconUser className="text-white/70" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {loginOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black"
            onClick={() => setLoginOpen(false)}
          />
          <div className="relative flex min-h-dvh w-full items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink p-6 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-extrabold text-white">
                    {authMode === "login" ? "Login" : "Register"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginOpen(false)}
                  className="rounded-2xl border border-white/10 bg-ink px-3 py-2 text-xs text-white/70 transition hover:border-neon/20 hover:text-white"
                >
                  Close
                </button>
              </div>

              <form
                className="mt-5 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setLoading(true);
                  try {
                    const res =
                      authMode === "login"
                        ? await api.login({ email, password })
                        : await api.register({ name, email, password });
                    setAuth(res.token, res.user);
                    setLoginOpen(false);
                    router.push("/");
                  } catch (err: any) {
                    setError(err?.message || "Login failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {authMode === "register" ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    autoComplete="name"
                    required
                  />
                ) : null}
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pr-11"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-ink p-2 text-white/70 transition hover:border-neon/20 hover:text-white"
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                    {error}
                  </div>
                ) : null}

                <Button className="w-full" disabled={loading} type="submit">
                  {loading
                    ? authMode === "login"
                      ? "Signing in..."
                      : "Creating..."
                    : authMode === "login"
                      ? "Login"
                      : "Register"}
                </Button>

                <div className="flex items-center justify-between gap-3 text-xs text-white/60">
                  <button
                    type="button"
                    className="text-neon-300 transition hover:text-neon"
                    onClick={() => {
                      setError(null);
                      setAuthMode((m) => (m === "login" ? "register" : "login"));
                    }}
                  >
                    {authMode === "login" ? "Create account" : "Have an account? Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
