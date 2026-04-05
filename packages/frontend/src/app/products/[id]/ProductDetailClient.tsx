"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, X } from "lucide-react";
import { useAuth } from "@repo/shared-utils";
import { Product } from "@/types";
import {
  ProductImageGallery,
  InternalProductBlock,
  AddToQuoteButton,
  Lightbox,
  StockBadge,
  TrustBadges,
  ProductBreadcrumb,
  QRScannerModal,
} from "@/components/product-detail";
import { ProductSpecs, QRSection } from "@/components/ProductSpecs";
import { CrossSellSection } from "@/components/CrossSellSection";
import { ShippingPolicies } from "@/components/ShippingPolicies";
import { TileCalculator } from "@/components/TileCalculator";

interface ProductDetailClientProps {
  productId: string;
  initialProduct: Product; // FIX: Định nghĩa prop mới
}

export default function ProductDetailClient({
  productId: _productId,
  initialProduct,
}: ProductDetailClientProps) {
  const { isAuthenticated } = useAuth();

  // FIX: Lấy dữ liệu ngay từ ban đầu, xoá loading và fetch loop
  const [product] = useState<Product>(initialProduct);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Filter images from media
  const images =
    product.media?.filter(
      (m) =>
        m.media_type === "lifestyle" ||
        m.media_type === "cutout" ||
        m.media_type === "showcase" ||
        (!m.media_type &&
          (m.file_type?.startsWith("image") ||
            m.file_url?.match(/\.(jpg|jpeg|png|webp|svg)$/i)))
    ) || [];

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb - Full width */}
        <div className="mb-6 lg:mb-8">
          <ProductBreadcrumb
            productId={product.id}
            productName={product.name}
            productSku={product.sku}
            isAuthenticated={isAuthenticated}
            onScanClick={() => setShowQRScanner(true)}
          />
        </div>

        {/* Main Content Grid - Mobile First Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 relative items-start">
          {/* MỚI: Khối Tiêu đề hiển thị TRÊN CÙNG cho Mobile (Ẩn trên Desktop) */}
          <div className="lg:hidden w-full space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 font-mono">
                SKU: {product.sku}
              </p>
            </div>

            {/* Tags (Mobile) */}
            {((product.style_tags && product.style_tags.length > 0) ||
              (product.space_tags && product.space_tags.length > 0)) && (
              <div className="flex flex-wrap gap-2">
                {product.style_tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px] font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
                {product.space_tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CỘT TRÁI (Visual & Specs) */}
          <div className="lg:col-span-7 xl:col-span-7 w-full space-y-6 lg:space-y-8">
            {/* 1. Product Image Gallery */}
            <div className="-mx-4 sm:mx-0">
              {/* Mobile: Ảnh tràn viền màn hình */}
              <ProductImageGallery
                images={images}
                productName={product.name}
                stockBadge={<StockBadge status="in_stock" />}
                onImageClick={(url) => setLightboxImage(url)}
              />
            </div>

            {/* MỚI: Description, Action Buttons hiển thị NGAY DƯỚI ảnh cho Mobile (Ẩn trên Desktop) */}
            <div className="lg:hidden w-full space-y-4">
              {/* Mô tả (Mobile) */}
              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Action Buttons (Mobile) */}
              <div className="pt-2">
                <AddToQuoteButton
                  product={product}
                  onOpenCalculator={() => setShowCalculator(true)}
                />
              </div>
            </div>

            {/* 2. Technical Specs */}
            {product.technical_specs &&
              Object.keys(product.technical_specs).length > 0 && (
                <section className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm mt-4 lg:mt-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Thông số kỹ thuật
                  </h2>
                  <ProductSpecs specs={product.technical_specs} />
                </section>
              )}

            {/* 3. Cross Sell */}
            <section className="pt-2 sm:pt-4">
              <CrossSellSection
                currentProductId={product.id}
                currentCategoryId={product.category_id}
              />
            </section>
          </div>

          {/* CỘT PHẢI (Action & Info) - Sticky Sidebar */}
          <div className="lg:col-span-5 xl:col-span-5 w-full lg:sticky lg:top-24 space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4 sm:space-y-6">
              {/* Khối Tiêu đề (Ẩn trên Mobile, chỉ hiện Desktop) */}
              <div className="hidden lg:block">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 font-mono">
                  SKU: {product.sku}
                </p>
              </div>

              {/* Tags (Ẩn trên Mobile, chỉ hiện Desktop) */}
              {((product.style_tags && product.style_tags.length > 0) ||
                (product.space_tags && product.space_tags.length > 0)) && (
                <div className="hidden lg:flex flex-wrap gap-2">
                  {product.style_tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {product.space_tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Description (Ẩn trên Mobile, chỉ hiện Desktop) */}
              {product.description && (
                <div className="hidden lg:block">
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed lg:border-t lg:border-gray-50 lg:pt-4">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Add to Quote Button & Calculator (Ẩn trên Mobile, chỉ hiện Desktop) */}
              <div className="hidden lg:block pt-2">
                <AddToQuoteButton
                  product={product}
                  onOpenCalculator={() => setShowCalculator(true)}
                />
              </div>
            </div>

            {/* Internal Info (Authenticated users only) */}
            {isAuthenticated && (
              <div className="space-y-6">
                <InternalProductBlock productId={product.id} />

                {/* QR Code */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <QRSection
                    sku={product.sku}
                    productUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/p/${product.sku}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      Mã QR sản phẩm
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Quét để xem nhanh trên điện thoại hoặc chia sẻ
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Badges & Shipping */}
            <div className="space-y-4 pt-2">
              <ShippingPolicies />
              <TrustBadges />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox
            src={lightboxImage}
            alt={product.name}
            onClose={() => setLightboxImage(null)}
          />
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <QRScannerModal onClose={() => setShowQRScanner(false)} />
        )}
      </AnimatePresence>

      {/* Tile Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-gray-900">
                  <Calculator size={20} className="text-blue-600" />
                  <h3 className="font-bold text-lg">Tính toán số lượng gạch</h3>
                </div>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="p-2 bg-white rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors shadow-sm border border-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto">
                <TileCalculator
                  technicalSpecs={product.technical_specs}
                  productName={product.name}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
