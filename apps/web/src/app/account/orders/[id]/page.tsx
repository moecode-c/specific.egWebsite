import { Container } from "../../../../components/Container";
import { OrderDetailsClient } from "../../../../components/account/OrderDetailsClient";

export default function AccountOrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Order details</h1>
        <p className="mt-1 text-sm text-white/60">Review items and delivery info.</p>
        <div className="mt-8">
          <OrderDetailsClient orderId={params.id} />
        </div>
      </Container>
    </div>
  );
}
