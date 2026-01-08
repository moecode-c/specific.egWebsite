import { Container } from "../../components/Container";
import { CheckoutClient } from "../../components/checkout/CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Checkout</h1>
        <p className="mt-1 text-sm text-white/60">Place your order.</p>
        <div className="mt-8">
          <CheckoutClient />
        </div>
      </Container>
    </div>
  );
}
