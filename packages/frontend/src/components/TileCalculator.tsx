"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

interface TileCalculatorProps {
  tileLengthMm?: number; // VD: 600
  tileWidthMm?: number; // VD: 600
  piecesPerBox?: number; // VD: 4 (4 viên/thùng)
  technicalSpecs?: Record<string, any>;
  productName?: string;
}

function firstValue(source: Record<string, any> | undefined, paths: string[]) {
  if (!source) return undefined;
  for (const path of paths) {
    const value = path.split(".").reduce<any>((acc, key) => {
      if (acc === null || acc === undefined) return undefined;
      return acc[key];
    }, source);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function toPositiveNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : undefined;
  if (typeof value === "string") {
    const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }
  return undefined;
}

function parseSizeToMm(value: unknown) {
  if (typeof value !== "string") return undefined;
  const matches = value.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i);
  if (!matches) return undefined;

  const first = Number(matches[1].replace(",", "."));
  const second = Number(matches[2].replace(",", "."));

  if (!Number.isFinite(first) || !Number.isFinite(second) || first <= 0 || second <= 0) {
    return undefined;
  }

  const multiplier = first <= 300 && second <= 300 ? 10 : 1;

  return {
    lengthMm: first * multiplier,
    widthMm: second * multiplier,
  };
}

function getTileReferenceData(
  technicalSpecs: Record<string, any> | undefined,
  fallbackLengthMm?: number,
  fallbackWidthMm?: number,
  fallbackPiecesPerBox?: number,
) {
  const directLength = toPositiveNumber(
    firstValue(technicalSpecs, [
      "length_mm",
      "dimensions.length_mm",
      "chieu_dai_vien",
      "dai_mm",
    ]),
  );
  const directWidth = toPositiveNumber(
    firstValue(technicalSpecs, [
      "width_mm",
      "dimensions.width_mm",
      "chieu_rong_vien",
      "rong_mm",
    ]),
  );
  const parsedSize = parseSizeToMm(
    firstValue(technicalSpecs, ["size", "kich_thuoc", "size_custom"]),
  );

  const tileLengthMm = directLength ?? parsedSize?.lengthMm ?? fallbackLengthMm ?? 600;
  const tileWidthMm = directWidth ?? parsedSize?.widthMm ?? fallbackWidthMm ?? 600;

  const directPiecesPerBox = toPositiveNumber(
    firstValue(technicalSpecs, [
      "pieces_per_box",
      "so_vien_thung",
      "vien_per_thung",
      "slab_per_box",
    ]),
  );
  const m2PerBox = toPositiveNumber(
    firstValue(technicalSpecs, ["m2_per_box", "box_coverage", "dien_tich_thung"]),
  );

  const tileArea = (tileLengthMm / 1000) * (tileWidthMm / 1000);
  const inferredPiecesPerBox =
    !directPiecesPerBox && m2PerBox && tileArea > 0
      ? Math.max(1, Math.round(m2PerBox / tileArea))
      : undefined;

  return {
    tileLengthMm,
    tileWidthMm,
    piecesPerBox: directPiecesPerBox ?? inferredPiecesPerBox ?? fallbackPiecesPerBox ?? 4,
    m2PerBox,
  };
}

export function TileCalculator({
  tileLengthMm = 600,
  tileWidthMm = 600,
  piecesPerBox = 4,
  technicalSpecs,
  productName,
}: TileCalculatorProps) {
  const [roomLength, setRoomLength] = useState<number | "">("");
  const [roomWidth, setRoomWidth] = useState<number | "">("");
  const [wastage, setWastage] = useState<number>(5); // Mặc định hao hụt 5% (cắt góc, len chân tường)

  const [results, setResults] = useState({
    area: 0,
    tilesNeeded: 0,
    boxesNeeded: 0,
  });

  const referenceData = getTileReferenceData(
    technicalSpecs,
    tileLengthMm,
    tileWidthMm,
    piecesPerBox,
  );
  const referenceTileArea =
    (referenceData.tileLengthMm / 1000) * (referenceData.tileWidthMm / 1000);

  useEffect(() => {
    if (roomLength && roomWidth && referenceData.tileLengthMm && referenceData.tileWidthMm) {
      const baseArea = Number(roomLength) * Number(roomWidth);
      const totalAreaWithWastage = baseArea * (1 + wastage / 100);
      const tileArea =
        (referenceData.tileLengthMm / 1000) * (referenceData.tileWidthMm / 1000);
      const tiles = Math.ceil(totalAreaWithWastage / tileArea);
      const boxes = Math.ceil(tiles / referenceData.piecesPerBox);

      setResults({
        area: totalAreaWithWastage,
        tilesNeeded: tiles,
        boxesNeeded: boxes,
      });
    } else {
      setResults({ area: 0, tilesNeeded: 0, boxesNeeded: 0 });
    }
  }, [
    roomLength,
    roomWidth,
    wastage,
    referenceData.tileLengthMm,
    referenceData.tileWidthMm,
    referenceData.piecesPerBox,
  ]);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-primary" size={24} />
        <h3 className="text-xl font-bold text-primary">Tính số lượng gạch</h3>
      </div>
      <div className="space-y-3 mb-6">
        <p className="text-sm text-gray-500">
          Nhập kích thước phòng để dự toán số lượng gạch cần thiết dựa trên thông số đã nhập của sản phẩm.
        </p>
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-sm font-semibold text-gray-900">
            {productName ? `Thông số tham chiếu của ${productName}` : "Thông số tham chiếu của sản phẩm"}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white px-3 py-2 border border-blue-100">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Kích thước
              </p>
              <p className="text-sm font-bold text-gray-900">
                {referenceData.tileLengthMm} × {referenceData.tileWidthMm} mm
              </p>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 border border-blue-100">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Số viên/thùng
              </p>
              <p className="text-sm font-bold text-gray-900">
                {referenceData.piecesPerBox} viên
              </p>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 border border-blue-100">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Diện tích/viên
              </p>
              <p className="text-sm font-bold text-gray-900">
                {referenceTileArea.toFixed(3)} m²
              </p>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 border border-blue-100">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Diện tích/thùng
              </p>
              <p className="text-sm font-bold text-gray-900">
                {referenceData.m2PerBox ? `${referenceData.m2PerBox} m²` : "Tự suy ra"}
              </p>
            </div>
          </div>
        </div>
      </div>

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
