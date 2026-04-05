import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Product } from "@/types";
import ProductDetailClient from "../../products/[id]/ProductDetailClient";

const API_URL =
  process.env.BACKEND_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : null) ||
  "http://localhost:3001/api/v1";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.VERCEL_URL ||
  "https://phucuongthinh.net";

// Helper
function normalizeTags(product: any): Product {
  return {
    ...product,
    style_tags: (product.style_tags ?? []).map((t: any) =>
      t.style ? { id: t.style.id, name: t.style.name } : t,
    ),
    space_tags: (product.space_tags ?? []).map((t: any) =>
      t.space ? { id: t.space.id, name: t.space.name } : t,
    ),
  };
}

async function getProductBySku(sku: string): Promise<Product | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `${API_URL}/products/sku/${encodeURIComponent(sku)}`,
      {
        next: { revalidate: 60 },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const raw = await response.json();
    const productData = raw.data || raw;
    if (!productData?.id) return null;

    return normalizeTags(productData);
  } catch {
    return null;
  }
}

function getFirstProductImage(product: Product): string | null {
  if (!product.media?.length) return null;

  const images = product.media.filter(
    (m) =>
      (m.media_type === "lifestyle" ||
        m.media_type === "cutout" ||
        (!m.media_type &&
          (m.file_type?.startsWith("image") ||
            m.file_url?.match(/\.(jpg|jpeg|png|webp|svg)$/i)))) &&
      m.file_url?.startsWith("http")
  );

  return images[0]?.file_url || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }> | { sku: string };
}): Promise<Metadata> {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm | Phú Cường Thịnh",
      description: "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  const productImage = getFirstProductImage(product);
  const productName = product.name || "Sản phẩm";
  const productSku = product.sku || "";
  const title = `${productName} | Phú Cường Thịnh`;
  const description =
    product.description ||
    `Sản phẩm ${productName} (SKU: ${productSku}) - Đơn vị tiên phong trong ngành VLXD hoàn thiện.`;

  const ogImage = productImage || `${SITE_URL}/dacuon.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `/p/${sku}`,
    },
    openGraph: {
      title,
      description,
      url: `/p/${sku}`,
      images: [
        {
          url: ogImage,
          alt: productName,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ShortProductPage({
  params,
}: {
  params: Promise<{ sku: string }> | { sku: string };
}) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    notFound();
  }

  // Thay vì redirect sang /products/[id], ta render trực tiếp Component ở đây
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: getFirstProductImage(product) || `${SITE_URL}/dacuon.png`,
            description: product.description || `Sản phẩm ${product.name} (SKU: ${product.sku}) - Đơn vị tiên phong trong ngành VLXD hoàn thiện.`,
            sku: product.sku,
            brand: {
              "@type": "Brand",
              name: "Phú Cường Thịnh",
            },
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/p/${product.sku}`,
              priceCurrency: "VND",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
      <ProductDetailClient productId={product.id} initialProduct={product} />
    </>
  );
}
