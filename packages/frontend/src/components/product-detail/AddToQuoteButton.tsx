"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useQuoteCart } from "@/lib/wishlist-context";
import { Product } from "@/types";

interface AddToQuoteButtonProps {
  product: Product;
  compact?: boolean;
}

export function AddToQuoteButton({
  product,
  compact = false,
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
        className={`flex-1 h-10 sm:h-11 flex items-center justify-center gap-1.5 sm:gap-2 font-bold rounded-lg transition-all shadow-md text-xs sm:text-sm ${isAdded ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-[#0a192f] text-white hover:bg-emerald-600 hover:shadow-emerald-500/20"}`}
      >
        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">
          {isAdded ? "Đã thêm!" : "Thêm vào báo giá"}
        </span>
        <span className="xs:hidden">{isAdded ? "Đã thêm" : "Báo giá"}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full">
      <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden h-10 sm:h-11 bg-white focus-within:border-[#0a192f] transition-colors">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-12 sm:w-16 px-2 sm:px-3 h-full outline-none text-center font-semibold text-gray-900 text-xs sm:text-sm"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as any)}
          className="h-full px-2 sm:px-3 bg-gray-50 border-l-2 border-gray-200 outline-none text-gray-700 font-semibold cursor-pointer text-xs sm:text-sm"
        >
          <option value="m2">m²</option>
          <option value="thùng">Thùng</option>
          <option value="bộ">Bộ</option>
        </select>
      </div>
      <button
        onClick={handleAdd}
        className={`flex-1 h-10 sm:h-11 flex items-center justify-center gap-1.5 sm:gap-2 font-bold rounded-lg transition-all shadow-lg text-white text-xs sm:text-sm ${isAdded ? "bg-emerald-500 shadow-emerald-500/30" : "bg-[#0a192f] hover:bg-emerald-600 hover:shadow-emerald-500/30"}`}
      >
        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">
          {isAdded ? "Đã thêm vào DS" : "Thêm vào DS Báo giá"}
        </span>
        <span className="xs:hidden">
          {isAdded ? "Đã thêm" : "Thêm báo giá"}
        </span>
      </button>
    </div>
  );
}
