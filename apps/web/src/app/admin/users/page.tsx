import { Container } from "../../../components/Container";
import { RequireAdmin } from "../../../components/guards/RequireAdmin";
import { AdminUsersClient } from "../../../components/admin/AdminUsersClient";

export default function AdminUsersPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Manage users</h1>
        <p className="mt-1 text-sm text-white/60">Add and remove users.</p>
        <div className="mt-8">
          <RequireAdmin>
            <AdminUsersClient />
          </RequireAdmin>
        </div>
      </Container>
    </div>
  );
}
