"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { ProductMedia } from "@/types";

interface ProductImageGalleryProps {
  images: ProductMedia[];
  productName: string;
  stockBadge?: React.ReactNode;
  badges?: string[];
  onImageClick: (url: string) => void;
}

function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url?.includes("cloudinary.com")) return url;
  if (url.includes("/upload/")) {
    const transform = width ? `w_${width},q_auto,f_auto` : "q_auto,f_auto";
    return url.replace("/upload/", `/upload/${transform}/`);
  }
  return url;
}

export function ProductImageGallery({
  images,
  productName,
  stockBadge,
  badges,
  onImageClick,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-400">
        Chưa có ảnh
      </div>
    );
  }

  const activeImage = images[activeIndex]?.file_url || null;
  const optimizedActiveImage = optimizeCloudinaryUrl(activeImage || "", 800);

  const handlePrev = () =>
    setActiveIndex((p) => (p > 0 ? p - 1 : images.length - 1));
  const handleNext = () =>
    setActiveIndex((p) => (p < images.length - 1 ? p + 1 : 0));

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <div
        className="relative aspect-square bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden cursor-zoom-in group border border-gray-100"
        onClick={() => activeImage && onImageClick(activeImage)}
      >
        <Image
          src={optimizedActiveImage}
          alt={productName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[2px]">
          <div className="bg-white/90 p-3 rounded-full shadow-lg text-gray-800">
            <ZoomIn size={24} />
          </div>
        </div>

        {/* Badges */}
        <div
          className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5 pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          {stockBadge}
          {badges?.map((badge) => (
            <span
              key={badge}
              className="self-start px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-500 text-white text-xs sm:text-sm font-bold rounded-full shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Share button */}
        <div
          className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <ShareButton
            url={activeImage}
            title={`${productName} - Ảnh sản phẩm`}
            compact
            className="bg-white/90 backdrop-blur-sm rounded-full shadow-md"
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 sm:p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 sm:p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${activeIndex === idx ? "border-emerald-500 shadow-sm scale-105" : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-200"}`}
            >
              <Image
                src={optimizeCloudinaryUrl(m.file_url, 200)}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
