import { Container } from "../../components/Container";
import { ShopClient } from "../../components/shop/ShopClient";
import { Suspense } from "react";

export default function ShopPage() {
  return (
    <div className="py-10">
      <Container>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Shop</h1>
          <p className="mt-1 text-sm text-white/60">
            Search, filter and sort premium cases.
          </p>
        </div>
        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-white/60">Loading...</div>}>
            <ShopClient />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
