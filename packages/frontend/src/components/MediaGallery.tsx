"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Media } from "@/types";

interface MediaGalleryProps {
  media: Media[];
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = media.filter(
    (m) => m.media_type === "lifestyle" || m.media_type === "cutout",
  );
  const videos = media.filter((m) => m.media_type === "video");
  const files = media.filter(
    (m) => m.media_type === "3d_file" || m.media_type === "pdf",
  );

  const selectedMedia = images[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
        >
          <Image
            src={selectedMedia.file_url}
            alt="Product"
            fill
            className="object-cover"
            priority
          />

          {images.length > 1 && (
            <>
              <motion.button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>
              <motion.button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-4 md:grid-cols-6 gap-2"
        >
          {images.map((img, index) => (
            <motion.button
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex ? "border-accent" : "border-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={img.file_url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold">Video</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video"
                whileHover={{ scale: 1.02 }}
              >
                <video
                  src={video.file_url}
                  controls
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Downloadable Files Section */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold">Tải xuống</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <motion.a
                key={file.id}
                href={file.file_url}
                download
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded flex items-center justify-center text-primary font-bold">
                    {file.media_type === "3d_file" ? "3D" : "PDF"}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">
                      {file.media_type === "3d_file"
                        ? "Mô hình 3D"
                        : "Catalogue PDF"}
                    </p>
                    {file.file_size && (
                      <p className="text-sm text-gray-600">
                        {(file.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-accent font-semibold">↓</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
