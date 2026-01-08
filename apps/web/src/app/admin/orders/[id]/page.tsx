import { Container } from "../../../../components/Container";
import { RequireAdmin } from "../../../../components/guards/RequireAdmin";
import { AdminOrderDetailsClient } from "../../../../components/admin/AdminOrderDetailsClient";

export default function AdminOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Order details</h1>
        <div className="mt-8">
          <RequireAdmin>
            <AdminOrderDetailsClient orderId={params.id} />
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
