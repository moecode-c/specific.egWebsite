import Link from "next/link";
import { Container } from "../../components/Container";
import { RequireAdmin } from "../../components/guards/RequireAdmin";

export default function AdminDashboardPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Admin dashboard</h1>
        <p className="mt-1 text-sm text-white/60">Manage products and orders.</p>

        <div className="mt-8">
          <RequireAdmin>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/admin/products"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-card transition hover:border-neon/30"
              >
                <div className="text-xs text-white/50">Manage</div>
                <div className="mt-2 text-lg font-extrabold text-white">Products</div>
                <div className="mt-1 text-sm text-white/60">Add, edit, delete, featured</div>
              </Link>
              <Link
                href="/admin/orders"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-card transition hover:border-neon/30"
              >
                <div className="text-xs text-white/50">Manage</div>
                <div className="mt-2 text-lg font-extrabold text-white">Orders</div>
                <div className="mt-1 text-sm text-white/60">Pending / accepted / declined</div>
              </Link>

              <Link
                href="/admin/reviews"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-card transition hover:border-neon/30"
              >
                <div className="text-xs text-white/50">Manage</div>
                <div className="mt-2 text-lg font-extrabold text-white">Reviews</div>
                <div className="mt-1 text-sm text-white/60">Home testimonials + list page</div>
              </Link>

              <Link
                href="/admin/users"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-card transition hover:border-neon/30"
              >
                <div className="text-xs text-white/50">Manage</div>
                <div className="mt-2 text-lg font-extrabold text-white">Users</div>
                <div className="mt-1 text-sm text-white/60">Add / delete users</div>
              </Link>
            </div>
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
