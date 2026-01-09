"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import type { User } from "../../lib/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

type ListedUser = User & { _id?: string; id?: string; createdAt?: string };

function userKey(u: ListedUser) {
  return (u._id ?? u.id ?? u.email) as string;
}

export function AdminUsersClient() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<ListedUser[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const meId = user?.id ?? (user as any)?._id;

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminUsers(token);
      setUsers(res.users as any);
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const sortedUsers = useMemo(() => {
    const copy = [...users];
    copy.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
    return copy;
  }, [users]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 shadow-card">
      <div className="border-b border-white/10 p-5">
        <div className="text-sm font-extrabold text-white">Create user</div>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          <Select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="user" className="bg-ink">user</option>
            <option value="admin" className="bg-ink">admin</option>
          </Select>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            disabled={!token || loading || !name || !email || password.length < 6}
            onClick={async () => {
              if (!token) return;
              setLoading(true);
              setError(null);
              try {
                await api.adminCreateUser(token, { name, email, password, role });
                setName("");
                setEmail("");
                setPassword("");
                setRole("user");
                await refresh();
              } catch (e: any) {
                setError(e?.message || "Create failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Working..." : "Add user"}
          </Button>
          <Button variant="ghost" disabled={!token || loading} onClick={refresh}>
            Refresh
          </Button>
          <div className="text-xs text-white/60">Password must be 6+ chars.</div>
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-white">Users</div>
          <div className="text-xs text-white/60">{users.length} total</div>
        </div>

        <div className="grid gap-2">
          {sortedUsers.map((u) => {
            const id = (u._id ?? u.id) as string | undefined;
            const isSelf = Boolean(id && meId && id === meId);
            return (
              <div
                key={userKey(u)}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink/35 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    {u.name} <span className="text-xs font-semibold text-white/50">({u.role})</span>
                  </div>
                  <div className="text-xs text-white/60">{u.email}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    disabled={!token || loading || !id || isSelf}
                    onClick={async () => {
                      if (!token || !id) return;
                      if (!confirm(`Delete user ${u.email}?`)) return;
                      setLoading(true);
                      setError(null);
                      try {
                        await api.adminDeleteUser(token, id);
                        await refresh();
                      } catch (e: any) {
                        setError(e?.message || "Delete failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Delete
                  </Button>
                  {isSelf ? <div className="text-xs text-white/50">You</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
