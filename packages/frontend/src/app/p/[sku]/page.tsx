import { redirect, notFound } from "next/navigation";

const API_URL =
  process.env.BACKEND_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : null) ||
  "http://localhost:3001/api/v1";

export default async function ShortProductPage({
  params,
}: {
  params: Promise<{ sku: string }> | { sku: string };
}) {
  const { sku } = await params;

  try {
    const res = await fetch(
      `${API_URL}/products/sku/${encodeURIComponent(sku)}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return notFound();
    const product = await res.json();
    if (!product?.id) return notFound();
    redirect(`/products/${product.id}`);
  } catch {
    return notFound();
  }
}
