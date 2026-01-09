import { Container } from "../../../components/Container";
import { RequireAdmin } from "../../../components/guards/RequireAdmin";
import { AdminReviewsClient } from "../../../components/admin/AdminReviewsClient";

export default function AdminReviewsPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Reviews & testimonials</h1>
        <p className="mt-1 text-sm text-white/60">Manage customer reviews shown on the site.</p>
        <div className="mt-8">
          <RequireAdmin>
            <AdminReviewsClient />
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
