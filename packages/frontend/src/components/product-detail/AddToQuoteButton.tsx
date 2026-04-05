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

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className={`flex-1 h-9 flex items-center justify-center gap-1.5 font-semibold rounded-full transition-all active:scale-95 text-[14px] ${
          isAdded
            ? "bg-[#E5E5EA] text-[#8E8E93] pointer-events-none"
            : "bg-[#F2F2F7] text-[#007AFF] hover:bg-[#E5E5EA]"
        }`}
      >
        {isAdded ? (
          <Check size={16} strokeWidth={2.5} />
        ) : (
          <ShoppingCart size={16} strokeWidth={2} />
        )}
        <span>{isAdded ? "Đã thêm" : "Thêm"}</span>
      </button>
    );
  }

  return (
    <div className="w-full rounded-[32px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E5EA] font-sans">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
          {/* Apple Stepper */}
          <div className="rounded-[16px] bg-[#F2F2F7] p-1 flex items-center justify-between">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-white text-black shadow-sm active:scale-90 transition-transform"
            >
              <Minus size={18} strokeWidth={2} />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-12 bg-transparent text-center text-[17px] font-semibold text-black outline-none [appearance:textfield]"
            />
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-white text-black shadow-sm active:scale-90 transition-transform"
            >
              <Plus size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Apple Primary Button */}
          <button
            onClick={handleAdd}
            className={`flex h-[48px] w-full items-center justify-center gap-2 rounded-[16px] transition-all active:scale-[0.98] ${
              isAdded
                ? "bg-[#34C759] text-white pointer-events-none"
                : "bg-[#007AFF] text-white shadow-[0_4px_14px_rgba(0,122,255,0.3)]"
            }`}
          >
            {isAdded ? (
              <Check size={20} strokeWidth={2.5} />
            ) : (
              <ShoppingCart size={20} strokeWidth={2} />
            )}
            <span className="text-[17px] font-semibold tracking-tight">
              {isAdded ? "Đã thêm" : "Thêm vào báo giá"}
            </span>
          </button>
        </div>

        {/* Apple Segmented Control */}
        <div className="rounded-[12px] bg-[#E5E5EA]/60 p-1 relative flex">
          {UNIT_OPTIONS.map((option) => {
            const isActive = unit === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setUnit(option.value)}
                className={`relative flex-1 py-1.5 rounded-[8px] text-[15px] font-medium transition-all z-10 ${isActive ? "text-black shadow-[0_1px_4px_rgba(0,0,0,0.1)] bg-white" : "text-[#8E8E93]"}`}
              >
                <span className="sm:hidden">{option.shortLabel}</span>
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            );
          })}
        </div>

        {onOpenCalculator && (
          <button
            onClick={onOpenCalculator}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#F2F2F7] text-[15px] font-medium text-black transition-all active:bg-[#E5E5EA]"
          >
            <Calculator size={18} className="text-[#007AFF]" />
            <span>Công cụ tính gạch</span>
          </button>
        )}
      </div>
    </div>
  );
}
