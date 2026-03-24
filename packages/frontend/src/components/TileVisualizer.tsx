"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon } from "lucide-react";

interface TileVisualizerProps {
  tileImageUrl?: string;
  productName: string;
}

export function TileVisualizer({
  tileImageUrl,
  productName,
}: TileVisualizerProps) {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [tileOpacity, setTileOpacity] = useState(0.75);
  const [tileScale, setTileScale] = useState(15); // % of container width per tile
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setRoomImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const tileSize = `${tileScale}%`;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon className="text-primary" size={22} />
        <h3 className="text-xl font-bold text-primary">
          Ướm thử gạch vào không gian
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Tải ảnh phòng của bạn lên để xem thử vân gạch{" "}
        <span className="font-medium">{productName}</span> trông như thế nào.
      </p>

      {!roomImage ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-14 cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-gray-100"
          }`}
        >
          <Upload size={36} className="text-gray-400" />
          <p className="font-semibold text-gray-600">
            Kéo thả hoặc click để tải ảnh phòng lên
          </p>
          <p className="text-xs text-gray-400">JPG, PNG, WEBP — tối đa 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div
              className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-900"
              style={{ paddingBottom: "56.25%" }}
            >
              {/* Room photo */}
              <img
                src={roomImage}
                alt="Phòng của bạn"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Tile overlay pattern */}
              {tileImageUrl && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${tileImageUrl})`,
                    backgroundSize: tileSize,
                    backgroundRepeat: "repeat",
                    opacity: tileOpacity,
                    mixBlendMode: "multiply",
                  }}
                />
              )}

              <button
                onClick={() => setRoomImage(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ trong suốt lớp phủ: {Math.round(tileOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min={0.2}
                  max={1}
                  step={0.05}
                  value={tileOpacity}
                  onChange={(e) => setTileOpacity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kích thước vân gạch: {tileScale}%
                </label>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={tileScale}
                  onChange={(e) => setTileScale(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              * Đây là mô phỏng tham khảo. Màu sắc thực tế có thể khác tùy ánh
              sáng và thiết bị.
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
