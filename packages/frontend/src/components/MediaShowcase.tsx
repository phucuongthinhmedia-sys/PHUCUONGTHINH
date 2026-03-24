"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Images, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  id: string;
  file_url: string;
  file_type?: string;
  media_type?: string;
}

interface MediaShowcaseProps {
  videos: MediaItem[];
  images: MediaItem[];
  productName: string;
  onLightbox: (src: string) => void;
}

export function MediaShowcase({
  videos,
  images,
  productName,
  onLightbox,
}: MediaShowcaseProps) {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const hasVideos = videos.length > 0;
  const hasImages = images.length > 0;

  if (!hasVideos && !hasImages) return null;

  return (
    <section className="mt-14">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10">
          {hasVideos && (
            <Play size={14} className="text-primary fill-primary" />
          )}
          {hasImages && <Images size={14} className="text-primary" />}
          <span className="text-sm font-semibold text-primary">
            {hasVideos && hasImages
              ? "Video & Thư viện thiết kế"
              : hasVideos
                ? "Video sản phẩm"
                : "Thư viện thiết kế"}
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      <div
        className={`grid gap-6 items-stretch ${hasVideos && hasImages ? "lg:grid-cols-2" : "grid-cols-1"}`}
      >
        {/* ── Video player ── */}
        {hasVideos && (
          <div className="flex flex-col gap-3">
            <div
              className="relative w-full flex-1 bg-gray-950 rounded-2xl overflow-hidden shadow-lg"
              style={{ minHeight: 0 }}
            >
              <video
                key={videos[activeVideoIdx].file_url}
                src={videos[activeVideoIdx].file_url}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              >
                Trình duyệt không hỗ trợ video.
              </video>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                <Play size={10} className="fill-white" />
                Video sản phẩm
              </div>
            </div>
            {videos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {videos.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVideoIdx(idx)}
                    className={`relative shrink-0 w-24 rounded-lg overflow-hidden border-2 transition-all ${activeVideoIdx === idx ? "border-primary shadow-md scale-105" : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"}`}
                    style={{ paddingBottom: "56.25%", height: 0 }}
                  >
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                      <Play
                        size={20}
                        className={
                          activeVideoIdx === idx
                            ? "text-primary fill-primary"
                            : "text-white fill-white"
                        }
                      />
                    </div>
                    <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-white font-medium">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Design gallery ── */}
        {hasImages && (
          <DesignGallery
            images={images}
            productName={productName}
            onLightbox={onLightbox}
          />
        )}
      </div>
    </section>
  );
}

function DesignGallery({
  images,
  productName,
  onLightbox,
}: {
  images: MediaItem[];
  productName: string;
  onLightbox: (src: string) => void;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  const prev = () => setActive((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setActive((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Images size={16} className="text-primary" />
          <span className="text-sm font-semibold text-gray-700">
            Thư viện thiết kế
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {images.length} ảnh
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {active + 1} / {images.length}
        </span>
      </div>

      {/* Slideshow + thumbnail dọc bên phải */}
      <div className="flex gap-2">
        {/* Main image */}
        <div
          className="relative flex-1 aspect-video rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group"
          onClick={() => onLightbox(images[active].file_url)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={images[active].id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={images[active].file_url}
                alt={`${productName} - ảnh ${active + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority={active === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2.5">
              <ZoomIn size={18} className="text-primary" />
            </div>
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip dọc bên phải */}
        {images.length > 1 && (
          <div
            className="flex flex-col gap-2 overflow-y-auto w-16 shrink-0"
            style={{ maxHeight: "calc(100% + 0px)" }}
          >
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActive(idx)}
                className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  active === idx
                    ? "border-primary shadow-md"
                    : "border-transparent opacity-50 hover:opacity-100 hover:border-gray-300"
                }`}
              >
                <Image
                  src={img.file_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
