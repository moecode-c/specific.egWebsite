"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-sm text-white/60">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 shadow-card">
        Please <Link className="text-neon-300 hover:text-neon" href="/login">login</Link> to continue.
      </div>
    );
  }

  return <>{children}</>;
}
