import { Container } from "../../../components/Container";
import { RequireAdmin } from "../../../components/guards/RequireAdmin";
import { AdminOrdersClient } from "../../../components/admin/AdminOrdersClient";

export default function AdminOrdersPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Orders</h1>
        <p className="mt-1 text-sm text-white/60">View and update order status.</p>
        <div className="mt-8">
          <RequireAdmin>
            <AdminOrdersClient />
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
