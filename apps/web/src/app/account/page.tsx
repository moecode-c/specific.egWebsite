import { Container } from "../../components/Container";
import { AccountClient } from "../../components/account/AccountClient";

export default function AccountPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/60">Orders and wishlist.</p>
        <div className="mt-8">
          <AccountClient />
        </div>
      </Container>
    </div>
  );
}
