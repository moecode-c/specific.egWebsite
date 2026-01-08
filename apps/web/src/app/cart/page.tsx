import { Container } from "../../components/Container";
import { CartClient } from "../../components/cart/CartClient";

export default function CartPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Cart</h1>
        <p className="mt-1 text-sm text-white/60">Review your items.</p>
        <div className="mt-8">
          <CartClient />
        </div>
      </Container>
    </div>
  );
}
