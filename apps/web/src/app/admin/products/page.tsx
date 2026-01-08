import { Container } from "../../../components/Container";
import { RequireAdmin } from "../../../components/guards/RequireAdmin";
import { AdminProductsClient } from "../../../components/admin/AdminProductsClient";

export default function AdminProductsPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Manage products</h1>
        <p className="mt-1 text-sm text-white/60">Add / edit / delete products.</p>
        <div className="mt-8">
          <RequireAdmin>
            <AdminProductsClient />
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
