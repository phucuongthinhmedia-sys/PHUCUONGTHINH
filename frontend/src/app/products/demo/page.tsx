"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MediaShowcase } from "@/components/MediaShowcase";
import { Media } from "@/types";

const MOCK_IMAGES: Media[] = [
  {
    id: "1",
    file_url: "https://picsum.photos/seed/tile1/800/800",
    file_type: "image/jpeg",
    media_type: "lifestyle",
    product_id: "demo",
    sort_order: 0,
    is_cover: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    file_url: "https://picsum.photos/seed/tile2/800/1200",
    file_type: "image/jpeg",
    media_type: "lifestyle",
    product_id: "demo",
    sort_order: 1,
    is_cover: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    file_url: "https://picsum.photos/seed/tile3/800/600",
    file_type: "image/jpeg",
    media_type: "lifestyle",
    product_id: "demo",
    sort_order: 2,
    is_cover: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    file_url: "https://picsum.photos/seed/tile4/800/800",
    file_type: "image/jpeg",
    media_type: "lifestyle",
    product_id: "demo",
    sort_order: 3,
    is_cover: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    file_url: "https://picsum.photos/seed/tile5/800/1000",
    file_type: "image/jpeg",
    media_type: "lifestyle",
    product_id: "demo",
    sort_order: 4,
    is_cover: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "6",
    file_url: "https://picsum.photos/seed/tile6/800/800",
    file_type: "image/jpeg",
    media_type: "lifestyle",
    product_id: "demo",
    sort_order: 5,
    is_cover: false,
    created_at: "",
    updated_at: "",
  },
];

const MOCK_VIDEOS: Media[] = [
  {
    id: "v1",
    file_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    file_type: "video/mp4",
    media_type: "video",
    product_id: "demo",
    sort_order: 0,
    is_cover: false,
    created_at: "",
    updated_at: "",
  },
];

export default function DemoPage() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <X size={24} />
            </button>
            <div
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxSrc}
                alt="preview"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-1.5 mb-4 w-fit">
            🧪 Demo — MediaShowcase preview
          </p>
          <MediaShowcase
            videos={MOCK_VIDEOS}
            images={MOCK_IMAGES}
            productName="Gạch Granite 600x600 Vân Đá Xám"
            onLightbox={setLightboxSrc}
          />
        </div>
      </main>
    </>
  );
}
