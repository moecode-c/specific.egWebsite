"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { IconEye, IconEyeOff } from "../Icons";

export function LoginForm() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <form
        className="p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const res = await api.login({ email, password });
            setAuth(res.token, res.user);
            router.push("/account");
          } catch (e: any) {
            setError(e.message || "Login failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="space-y-3">
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
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-5">
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>

        <div className="mt-4 text-sm text-white/60">
          No account?{" "}
          <Link className="text-neon-300 hover:text-neon" href="/register">
            Register
          </Link>
        </div>
      </form>
    </Card>
  );
}
