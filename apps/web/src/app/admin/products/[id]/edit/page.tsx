import { Container } from "../../../../../components/Container";
import { RequireAdmin } from "../../../../../components/guards/RequireAdmin";
import { AdminProductForm } from "../../../../../components/admin/AdminProductForm";

export default function AdminEditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Edit product</h1>
        <div className="mt-8">
          <RequireAdmin>
            <AdminProductForm mode="edit" productId={params.id} />
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
