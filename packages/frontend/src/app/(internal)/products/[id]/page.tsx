import ProductDetailClient from "@/app/products/[id]/ProductDetailClient";

export default async function InternalProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}
