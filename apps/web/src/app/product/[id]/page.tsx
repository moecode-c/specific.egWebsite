import { api } from "../../../lib/api";
import { Container } from "../../../components/Container";
import { ProductDetailsClient } from "../../../components/product/ProductDetailsClient";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { product } = await api.product(params.id);

  return (
    <div className="py-10">
      <Container>
        <ProductDetailsClient product={product} />
      </Container>
    </div>
  );
}
