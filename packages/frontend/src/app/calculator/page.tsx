"use client";

import { useState } from "react";
import {
  calculateSkirting,
  validateSkirtingInput,
  type SkirtingInput,
} from "@/lib/skirting-calculator";

export default function CalculatorPage() {
  const [input, setInput] = useState<SkirtingInput>({
    totalLengthM: 10,
    tileWidthCM: 60,
    tileHeightCM: 60,
    skirtingHeightCM: 10,
    bladeLossMM: 2,
    wastePercent: 5,
  });

  const validationError = validateSkirtingInput(input);
  const result = validationError ? null : calculateSkirting(input);

  const handleChange = (field: keyof SkirtingInput, value: string) => {
    const num = parseFloat(value) || 0;
    setInput((prev) => ({ ...prev, [field]: num }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Công cụ tính gạch cắt len
          </h1>
          <p className="text-gray-600">
            Tính toán số lượng gạch cần mua để cắt len chân tường
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Kích thước gạch
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều rộng gạch (cm)
                  </label>
                  <input
                    type="number"
                    value={input.tileWidthCM}
                    onChange={(e) =>
                      handleChange("tileWidthCM", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều dài gạch (cm)
                  </label>
                  <input
                    type="number"
                    value={input.tileHeightCM}
                    onChange={(e) =>
                      handleChange("tileHeightCM", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Thông số cắt
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tổng mét dài cần cắt (m)
                  </label>
                  <input
                    type="number"
                    value={input.totalLengthM}
                    onChange={(e) =>
                      handleChange("totalLengthM", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều cao len (cm)
                  </label>
                  <input
                    type="number"
                    value={input.skirtingHeightCM}
                    onChange={(e) =>
                      handleChange("skirtingHeightCM", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Hao hụt
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hao hụt lưỡi cắt (mm)
                  </label>
                  <input
                    type="number"
                    value={input.bladeLossMM}
                    onChange={(e) =>
                      handleChange("bladeLossMM", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phần trăm hao hụt (%)
                  </label>
                  <input
                    type="number"
                    value={input.wastePercent}
                    onChange={(e) =>
                      handleChange("wastePercent", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-6">Kết quả tính toán</h3>
            {validationError ? (
              <div className="bg-red-500/20 border border-red-300 rounded-lg p-4 text-red-100">
                <p className="font-medium">⚠️ {validationError}</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-sm text-blue-100 mb-1">
                    Số thanh cắt được trên 1 viên
                  </p>
                  <p className="text-3xl font-bold">
                    {result.piecesPerTile} thanh
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-sm text-blue-100 mb-1">
                    Số viên gạch cần (chính xác)
                  </p>
                  <p className="text-2xl font-semibold">
                    {result.exactTiles} viên
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4 border-2 border-white/30">
                  <p className="text-sm text-blue-100 mb-1">
                    Tổng số viên gạch cần mua
                  </p>
                  <p className="text-4xl font-bold">
                    {result.totalTilesToBuy} viên
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-sm text-blue-100 mb-1">Tổng diện tích</p>
                  <p className="text-3xl font-bold">{result.totalAreaM2} m²</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-blue-100">
                    💡 Kết quả đã bao gồm {input.wastePercent}% hao hụt dự phòng
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            📌 Hướng dẫn sử dụng
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Nhập kích thước gạch bạn có (chiều rộng × chiều dài)</li>
            <li>
              • Nhập tổng chiều dài len cần cắt và chiều cao len mong muốn
            </li>
            <li>• Công cụ sẽ tính số viên gạch cần mua, đã bao gồm hao hụt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
