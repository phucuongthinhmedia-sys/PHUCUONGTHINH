"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Truck,
  FileCheck,
  X,
  Download,
  ZoomIn,
  MessageCircle,
} from "lucide-react";
import { useQuoteCart } from "@/lib/wishlist-context";
import { productService } from "@/lib/product-service";
import { TileCalculator } from "@/components/TileCalculator";
import { AppointmentForm } from "@/components/AppointmentForm";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

const ZALO_URL = "https://zalo.me/0901234567";

const TRUST_BADGES = [
  { icon: CheckCircle2, label: "Hàng chính hãng" },
  { icon: Truck, label: "Giao toàn quốc" },
  { icon: FileCheck, label: "Có CO / CQ" },
  { icon: MapPin, label: "Kho tại TP.HCM" },
];

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    productService
      .getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 pt-24">
        <div className="max-w-6xl mx-auto">
          <p>Đang tải...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">Không tìm thấy sản phẩm.</p>
        <Link href="/products" className="text-primary underline">
          Quay lại danh sách sản phẩm
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-4">{product.name}</h1>
        <p className="text-gray-600">Mã SP: {product.sku}</p>
        {product.description && <p className="mt-4">{product.description}</p>}
      </div>
    </main>
  );
}
