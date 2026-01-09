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
  IconHome,
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
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLoginOpen(false);
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [loginOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt="SPECIFIC"
            className="h-9 w-9 rounded-2xl shadow-glow"
          />
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-wide text-white">
              SPECIFIC
            </div>
            <div className="text-xs text-white/60">Mobile Cases</div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-3 text-sm">
          <Link className="flex items-center gap-2 text-white/80 hover:text-neon" href="/">
            <IconHome className="text-white/70" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link className="flex items-center gap-2 text-white/80 hover:text-neon" href="/shop">
            <IconBag className="text-white/70" />
            <span className="hidden sm:inline">Shop</span>
          </Link>
          <Link
            className="flex items-center gap-2 text-white/80 hover:text-neon"
            href="/reviews-testimonials"
          >
            <IconSparkle className="text-white/70" />
            <span className="hidden sm:inline">Reviews</span>
          </Link>
          <Link className="flex items-center gap-2 text-white/80 hover:text-neon" href="/cart">
            <IconCart className="text-white/70" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 ? (
              <span className="ml-2 rounded-full bg-neon/15 px-2 py-0.5 text-xs font-bold text-neon-300">
                {count}
              </span>
            ) : null}
          </Link>

          {user ? (
            <>
              <Link className="flex items-center gap-2 text-white/80 hover:text-neon" href="/account">
                <IconUser className="text-white/70" />
                <span className="hidden sm:inline">Account</span>
              </Link>
              {user.role === "admin" ? (
                <Link className="flex items-center gap-2 text-white/80 hover:text-neon" href="/admin">
                  <IconShield className="text-white/70" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              ) : null}
              <button
                className="text-white/60 hover:text-white"
                onClick={logout}
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 text-white/80 hover:text-neon"
                onClick={() => {
                  setError(null);
                  setAuthMode("login");
                  setLoginOpen((v) => !v);
                }}
              >
                <IconUser className="text-white/70" />
                <span className="hidden sm:inline">Login</span>
              </button>

              {loginOpen ? (
                <div className="fixed inset-0 z-50">
                  <button
                    type="button"
                    aria-label="Close"
                    className="absolute inset-0 bg-black/65"
                    onClick={() => setLoginOpen(false)}
                  />
                  <div className="relative flex min-h-dvh w-full items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink/85 p-6 shadow-card backdrop-blur">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-base font-extrabold text-white">
                            {authMode === "login" ? "Login" : "Register"}
                          </div>
                          <div className="mt-1 text-xs text-white/60">
                            {authMode === "login"
                              ? "Access your account."
                              : "Create a new account."}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLoginOpen(false)}
                          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70 hover:text-white"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/20 p-2 text-white/70 hover:text-white"
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
                            className="text-neon-300 hover:text-neon"
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
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
