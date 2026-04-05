"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import {
  productService,
  UpdateProductRequest,
  Product,
} from "@/lib/product-service";
import { categoryService, Category } from "@/lib/category-service";
import { tagService, Tag } from "@/lib/tag-service";
import { MediaRecord } from "@/lib/media-service";
import { apiClient } from "@/lib/admin-api-client";
import { staticDataCache } from "@/lib/static-data-cache";
import { ChevronLeft } from "lucide-react";

export default function AdminEditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<
    (Product & { media?: MediaRecord[] }) | null
  >(null);
  const [categories, setCategories] = useState<Category[]>(
    () => staticDataCache.getCategories() ?? [],
  );
  const [styles, setStyles] = useState<Tag[]>(
    () => staticDataCache.getStyles() ?? [],
  );
  const [spaces, setSpaces] = useState<Tag[]>(
    () => staticDataCache.getSpaces() ?? [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      productService.getProductById(productId, true),
      apiClient
        .get<MediaRecord[]>(`/media/product/${productId}?_t=${Date.now()}`)
        .catch(() => []),
    ])
      .then(([prod, media]) => setProduct({ ...prod, media: media || [] }))
      .catch(() => setError("Không thể tải sản phẩm"));

    if (!staticDataCache.getCategories()) {
      Promise.all([
        categoryService.getCategories(),
        tagService.getStyles(),
        tagService.getSpaces(),
      ]).then(([cats, stls, sps]) => {
        staticDataCache.setCategories(cats);
        staticDataCache.setStyles(stls);
        staticDataCache.setSpaces(sps);
        setCategories(cats);
        setStyles(stls);
        setSpaces(sps);
      });
    }
  }, [productId]);

  const handleSubmit = async (
    data: UpdateProductRequest,
  ): Promise<Product | void> => {
    setIsLoading(true);
    try {
      return await productService.updateProduct(productId, data);
    } finally {
      setIsLoading(false);
    }
  };

  if (error)
    return (
      <div className="p-8 text-center text-[#FF3B30] bg-[#F2F2F7] min-h-screen">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 md:p-8 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-[17px] font-medium text-[#007AFF] hover:opacity-80 transition-opacity mb-2 -ml-2"
          >
            <ChevronLeft size={24} strokeWidth={2} /> Sản phẩm
          </Link>
          <h1 className="text-[34px] font-bold text-black tracking-tight leading-none mt-1">
            Sửa sản phẩm
          </h1>
        </div>

        {!product ? (
          <div className="animate-pulse space-y-4">
            <div className="h-[200px] bg-white rounded-[24px] border border-[#E5E5EA]" />
            <div className="h-[400px] bg-white rounded-[24px] border border-[#E5E5EA]" />
          </div>
        ) : (
          <ProductForm
            product={product}
            categories={categories}
            styles={styles}
            spaces={spaces}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
