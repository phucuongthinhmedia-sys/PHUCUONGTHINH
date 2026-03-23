"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

interface TileCalculatorProps {
  // Nhận thông số từ product.technical_specs
  tileLengthMm?: number; // VD: 600
  tileWidthMm?: number; // VD: 600
  piecesPerBox?: number; // VD: 4 (4 viên/thùng)
}

export function TileCalculator({
  tileLengthMm = 600,
  tileWidthMm = 600,
  piecesPerBox = 4,
}: TileCalculatorProps) {
  const [roomLength, setRoomLength] = useState<number | "">("");
  const [roomWidth, setRoomWidth] = useState<number | "">("");
  const [wastage, setWastage] = useState<number>(5); // Mặc định hao hụt 5% (cắt góc, len chân tường)

  const [results, setResults] = useState({
    area: 0,
    tilesNeeded: 0,
    boxesNeeded: 0,
  });

  useEffect(() => {
    if (roomLength && roomWidth && tileLengthMm && tileWidthMm) {
      // 1. Tính diện tích phòng (m2)
      const baseArea = Number(roomLength) * Number(roomWidth);
      // 2. Cộng thêm hao hụt
      const totalAreaWithWastage = baseArea * (1 + wastage / 100);

      // 3. Diện tích 1 viên gạch (m2)
      const tileArea = (tileLengthMm / 1000) * (tileWidthMm / 1000);

      // 4. Số viên cần thiết (làm tròn lên)
      const tiles = Math.ceil(totalAreaWithWastage / tileArea);

      // 5. Số thùng cần thiết (làm tròn lên)
      const boxes = Math.ceil(tiles / piecesPerBox);

      setResults({
        area: totalAreaWithWastage,
        tilesNeeded: tiles,
        boxesNeeded: boxes,
      });
    } else {
      setResults({ area: 0, tilesNeeded: 0, boxesNeeded: 0 });
    }
  }, [roomLength, roomWidth, wastage, tileLengthMm, tileWidthMm, piecesPerBox]);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-primary" size={24} />
        <h3 className="text-xl font-bold text-primary">Tính số lượng gạch</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Nhập kích thước phòng để dự toán số lượng gạch cần thiết (Thông số gạch:{" "}
        {tileLengthMm}x{tileWidthMm}mm, {piecesPerBox} viên/thùng).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Chiều dài phòng (m)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={roomLength}
            onChange={(e) => setRoomLength(Number(e.target.value) || "")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            placeholder="VD: 5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Chiều rộng phòng (m)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={roomWidth}
            onChange={(e) => setRoomWidth(Number(e.target.value) || "")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            placeholder="VD: 4"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hao hụt thi công
          </label>
          <select
            value={wastage}
            onChange={(e) => setWastage(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent bg-white"
          >
            <option value={0}>0% (Không hao hụt)</option>
            <option value={5}>5% (Mức chuẩn)</option>
            <option value={10}>10% (Nhiều góc cạnh)</option>
            <option value={15}>15% (Lát xéo/lát xương cá)</option>
          </select>
        </div>
      </div>

      {results.area > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border border-accent/50 shadow-sm"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Diện tích (có hao hụt)
              </p>
              <p className="text-xl font-bold text-primary">
                {results.area.toFixed(2)} m²
              </p>
            </div>
            <div className="border-l border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Số viên gạch
              </p>
              <p className="text-xl font-bold text-primary">
                {results.tilesNeeded}
              </p>
            </div>
            <div className="border-l border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Số thùng cần mua
              </p>
              <p className="text-2xl font-black text-accent">
                {results.boxesNeeded}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
