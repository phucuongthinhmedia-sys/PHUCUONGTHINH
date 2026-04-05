"use client";

import { useState } from "react";
import {
  calculateSkirting,
  validateSkirtingInput,
  type SkirtingInput,
} from "@/lib/skirting-calculator";
import {
  Ruler,
  Scissors,
  Settings2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

export default function CalculatorPage() {
  const [input, setInput] = useState<SkirtingInput>({
    totalLengthM: 10,
    tileWidthCM: 60,
    tileHeightCM: 60,
    skirtingHeightCM: 10,
    bladeLossMM: 2, // Lưỡi cắt mặc định 2mm (chuẩn thực tế)
    wastePercent: 0, // Mặc định 0% vì khách thường đã tự cộng hao hụt
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const validationError = validateSkirtingInput(input);
  const result = validationError ? null : calculateSkirting(input);

  const handleChange = (field: keyof SkirtingInput, value: string) => {
    const num = parseFloat(value) || 0;
    setInput((prev) => ({ ...prev, [field]: num }));
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] py-10 px-4 sm:px-8 font-sans pb-24">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight">
            Công cụ cắt len
          </h1>
          <p className="text-[17px] text-[#8E8E93] mt-2 font-medium">
            Tính toán nhanh số lượng gạch cần mua
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <div className="lg:col-span-3 space-y-6">
            {/* Box 1: Thông số chính */}
            <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E5EA] overflow-hidden">
              {/* Kích thước gạch */}
              <div className="p-5 border-b border-[#E5E5EA]">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[8px] bg-[#007AFF]/10 flex items-center justify-center">
                    <Ruler
                      size={18}
                      className="text-[#007AFF]"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-[17px] font-semibold text-black tracking-tight">
                    Kích thước gạch gốc
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">
                      Chiều rộng (cm)
                    </label>
                    <input
                      type="number"
                      value={input.tileWidthCM || ""}
                      onChange={(e) =>
                        handleChange("tileWidthCM", e.target.value)
                      }
                      className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">
                      Chiều dài (cm)
                    </label>
                    <input
                      type="number"
                      value={input.tileHeightCM || ""}
                      onChange={(e) =>
                        handleChange("tileHeightCM", e.target.value)
                      }
                      className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Thông số cắt */}
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[8px] bg-[#34C759]/10 flex items-center justify-center">
                    <Scissors
                      size={18}
                      className="text-[#34C759]"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-[17px] font-semibold text-black tracking-tight">
                    Thông số cần cắt
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">
                      Tổng mét dài (m)
                    </label>
                    <input
                      type="number"
                      value={input.totalLengthM || ""}
                      onChange={(e) =>
                        handleChange("totalLengthM", e.target.value)
                      }
                      className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#34C759] focus:ring-4 focus:ring-[#34C759]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">
                      Chiều cao len (cm)
                    </label>
                    <input
                      type="number"
                      value={input.skirtingHeightCM || ""}
                      onChange={(e) =>
                        handleChange("skirtingHeightCM", e.target.value)
                      }
                      className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#34C759] focus:ring-4 focus:ring-[#34C759]/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Cài đặt nâng cao (Hao hụt) - Dạng Accordion */}
            <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E5EA] overflow-hidden transition-all">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-5 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[8px] bg-[#8E8E93]/10 flex items-center justify-center">
                    <Settings2
                      size={18}
                      className="text-[#8E8E93]"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-[17px] font-semibold text-black tracking-tight">
                    Cài đặt hao hụt
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-[#8E8E93] transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${showAdvanced ? "max-h-[300px] opacity-100 pb-5 px-5" : "max-h-0 opacity-0 px-5"}`}
              >
                <div className="pt-2 grid grid-cols-2 gap-4 border-t border-[#E5E5EA] pt-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">
                      Độ dày lưỡi cắt (mm)
                    </label>
                    <input
                      type="number"
                      value={input.bladeLossMM}
                      onChange={(e) =>
                        handleChange("bladeLossMM", e.target.value)
                      }
                      className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">
                      Hao hụt dự phòng (%)
                    </label>
                    <input
                      type="number"
                      value={input.wastePercent}
                      onChange={(e) =>
                        handleChange("wastePercent", e.target.value)
                      }
                      className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ TÍNH TOÁN */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#007AFF] to-[#5856D6] rounded-[32px] p-6 sm:p-8 text-white shadow-[0_12px_32px_rgba(0,122,255,0.3)] sticky top-8">
              <h3 className="text-[20px] font-semibold mb-6 tracking-tight text-white/90">
                Kết quả dự tính
              </h3>

              {validationError ? (
                <div className="bg-white/10 backdrop-blur-md rounded-[16px] p-4 flex items-start gap-3 border border-white/20">
                  <AlertCircle
                    className="text-[#FF9500] shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="font-medium text-[15px]">{validationError}</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  {/* Số lượng gạch cần mua - Highlight lớn nhất */}
                  <div className="bg-white/15 backdrop-blur-xl rounded-[20px] p-5 border border-white/20 shadow-inner">
                    <p className="text-[14px] text-white/80 font-medium mb-1">
                      Tổng gạch cần mua
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-[48px] font-bold tracking-tight leading-none">
                        {result.totalTilesToBuy}
                      </p>
                      <span className="text-[20px] font-medium text-white/80">
                        viên
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/10 rounded-[16px] p-4">
                      <p className="text-[13px] text-white/70 font-medium mb-1">
                        Cắt được
                      </p>
                      <p className="text-[20px] font-semibold">
                        {result.piecesPerTile}{" "}
                        <span className="text-[14px] font-normal">
                          thanh/viên
                        </span>
                      </p>
                    </div>
                    <div className="bg-black/10 rounded-[16px] p-4">
                      <p className="text-[13px] text-white/70 font-medium mb-1">
                        Cần chính xác
                      </p>
                      <p className="text-[20px] font-semibold">
                        {result.exactTiles}{" "}
                        <span className="text-[14px] font-normal">viên</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/10 rounded-[16px] p-4 flex justify-between items-center">
                    <p className="text-[15px] text-white/80 font-medium">
                      Tổng diện tích gạch
                    </p>
                    <p className="text-[17px] font-semibold">
                      {result.totalAreaM2} m²
                    </p>
                  </div>

                  {input.wastePercent > 0 && (
                    <p className="text-[13px] text-white/60 text-center mt-4 font-medium">
                      * Đã bao gồm {input.wastePercent}% hao hụt
                    </p>
                  )}
                </div>
              ) : (
                <div className="opacity-50 text-center py-10">
                  <CalculatorIcon
                    size={40}
                    className="mx-auto mb-3 opacity-50"
                  />
                  <p className="text-[15px] font-medium">
                    Nhập thông số để xem kết quả
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple icon for empty state
function CalculatorIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <rect x="4" y="2" width="16" height="20" rx="4" />
      <path d="M8 6h8" />
      <path d="M16 14v4" />
      <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}
