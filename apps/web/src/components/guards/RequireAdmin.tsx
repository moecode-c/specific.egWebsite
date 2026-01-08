"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { RequireAuth } from "./RequireAuth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <RequireAuth>
      {user?.role === "admin" ? (
        <>{children}</>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 shadow-card">
          Admin access required. Go to <Link className="text-neon-300 hover:text-neon" href="/">home</Link>.
        </div>
      )}
    </RequireAuth>
  );
}
