import { api } from "../../../lib/api";
import { Container } from "../../../components/Container";
import { ProductDetailsClient } from "../../../components/product/ProductDetailsClient";
import type { Product } from "../../../lib/types";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Product | null = null;
  try {
    const res = await api.product(params.id);
    product = res.product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }
  
  if (!product) {
    return (
      <div className="py-10">
        <Container>
          <p className="text-white">Product not found</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Container>
        <ProductDetailsClient product={product} />
      </Container>
    </div>
  );
}
