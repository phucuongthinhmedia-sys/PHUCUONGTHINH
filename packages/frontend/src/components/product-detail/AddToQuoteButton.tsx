"use client";

import { useState } from "react";
import { ShoppingCart, Calculator, Plus, Minus, Check } from "lucide-react";
import { useQuoteCart } from "@/lib/wishlist-context";
import { Product } from "@/types";
import { motion } from "framer-motion";

interface AddToQuoteButtonProps {
  product: Product;
  compact?: boolean;
  onOpenCalculator?: () => void;
}

const UNIT_OPTIONS: Array<{
  value: "m2" | "thùng" | "bộ";
  label: string;
  shortLabel: string;
}> = [
  { value: "m2", label: "Mét vuông", shortLabel: "m²" },
  { value: "thùng", label: "Thùng", shortLabel: "Thùng" },
  { value: "bộ", label: "Bộ", shortLabel: "Bộ" },
];

export function AddToQuoteButton({
  product,
  compact = false,
  onOpenCalculator,
}: AddToQuoteButtonProps) {
  const { addItem } = useQuoteCart();
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<"m2" | "thùng" | "bộ">("m2");
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity, unit);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // ================= Bản thu gọn (Cho Card/Danh sách) =================
  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className={`flex-1 h-10 sm:h-11 flex items-center justify-center gap-1.5 sm:gap-2 font-bold rounded-full transition-all duration-300 shadow-sm text-xs sm:text-sm active:scale-95 ${
          isAdded
            ? "bg-gray-200 text-gray-900 pointer-events-none"
            : "bg-gray-900 text-white hover:bg-black hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        }`}
      >
        {isAdded ? (
          <Check size={16} strokeWidth={3} />
        ) : (
          <ShoppingCart size={16} strokeWidth={2.5} />
        )}
        <span className="hidden xs:inline">
          {isAdded ? "Đã thêm" : "Thêm báo giá"}
        </span>
        <span className="xs:hidden">{isAdded ? "Xong" : "Báo giá"}</span>
      </button>
    );
  }

  // ================= Bản đầy đủ (Cho Trang Chi tiết) =================
  return (
    <div className="w-full rounded-[32px] bg-white/80 backdrop-blur-[32px] saturate-150 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white">
      <div className="flex flex-col gap-4">
        {/* Khối Số Lượng & Nút Thêm (Hàng ngang trên Desktop, dọc trên Mobile) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
          {/* Bộ đếm số lượng: Apple Control Center Style */}
          <div className="rounded-[24px] bg-black/5 p-1.5">
            <div className="flex items-center justify-between bg-transparent">
              <button
                onClick={handleDecrease}
                className="flex h-12 w-12 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white hover:text-gray-900 hover:shadow-sm active:scale-90"
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="h-12 min-w-0 flex-1 bg-transparent px-1 text-center text-[17px] font-bold text-gray-900 outline-none [appearance:textfield]"
              />
              <button
                onClick={handleIncrease}
                className="flex h-12 w-12 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white hover:text-gray-900 hover:shadow-sm active:scale-90"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Nút chính Add to Cart - Monochrome */}
          <button
            onClick={handleAdd}
            className={`group relative flex h-[60px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-[24px] px-4 shadow-lg transition-all duration-300 active:scale-[0.98] sm:h-auto sm:min-h-[60px] ${
              isAdded
                ? "bg-gray-100 text-gray-900 shadow-none pointer-events-none"
                : "bg-gray-900 text-white hover:bg-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
            }`}
          >
            {isAdded ? (
              <Check size={20} strokeWidth={3} className="text-green-600" />
            ) : (
              <ShoppingCart
                size={20}
                strokeWidth={2.5}
                className="relative z-10 shrink-0"
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[15px] font-bold tracking-tight">
                {isAdded ? "Đã thêm vào giỏ báo giá" : "Thêm vào báo giá"}
              </span>
              {!isAdded && (
                <span className="text-[12px] font-medium text-white/70">
                  {quantity} {unit === "m2" ? "m²" : unit}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Khối Đơn vị tính: Segmented Control (iOS Style) */}
        <div className="rounded-[24px] bg-black/5 p-1.5 relative flex">
          {UNIT_OPTIONS.map((option) => {
            const isActive = unit === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setUnit(option.value)}
                className={`relative flex-1 min-h-[44px] items-center justify-center rounded-[20px] text-[14px] sm:text-[15px] font-bold transition-all z-10 ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700 active:scale-95"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="unitActiveTab"
                    className="absolute inset-0 bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 sm:hidden">
                  {option.shortLabel}
                </span>
                <span className="relative z-10 hidden sm:inline">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Nút Công cụ tính gạch - Frosted Glass Button */}
        {onOpenCalculator && (
          <button
            onClick={onOpenCalculator}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[24px] bg-black/5 px-4 text-[14px] font-bold text-gray-900 transition-all hover:bg-black/10 active:scale-[0.98]"
          >
            <Calculator size={18} strokeWidth={2.5} className="text-gray-700" />
            <span>Tính số lượng gạch dự kiến</span>
          </button>
        )}
      </div>
    </div>
  );
}
