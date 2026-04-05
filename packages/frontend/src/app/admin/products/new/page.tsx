"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import {
  productService,
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from "@/lib/product-service";
import { categoryService, Category } from "@/lib/category-service";
import { tagService, Tag } from "@/lib/tag-service";
import { staticDataCache } from "@/lib/static-data-cache";
import { ChevronLeft } from "lucide-react";

export default function AdminNewProductPage() {
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

  useEffect(() => {
    if (staticDataCache.getCategories()) return;
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
  }, []);

  const handleSubmit = async (
    data: CreateProductRequest | UpdateProductRequest,
  ): Promise<Product | void> => {
    setIsLoading(true);
    try {
      return await productService.createProduct(data as CreateProductRequest);
    } finally {
      setIsLoading(false);
    }
  };

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
            Tạo sản phẩm mới
          </h1>
        </div>
        <ProductForm
          categories={categories}
          styles={styles}
          spaces={spaces}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
