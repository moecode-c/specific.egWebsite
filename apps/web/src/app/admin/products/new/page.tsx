import { Container } from "../../../../components/Container";
import { RequireAdmin } from "../../../../components/guards/RequireAdmin";
import { AdminProductForm } from "../../../../components/admin/AdminProductForm";

export default function AdminNewProductPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Add product</h1>
        <div className="mt-8">
          <RequireAdmin>
            <AdminProductForm mode="create" />
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
