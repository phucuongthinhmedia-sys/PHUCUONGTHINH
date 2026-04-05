"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Tìm kiếm sản phẩm...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div
      className={`relative flex items-center w-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isFocused ? "scale-[1.02]" : "scale-100"
      }`}
    >
      {/* Icon Search cố định bên trái (Stroke dày để đồng bộ SF Symbols) */}
      <div className="absolute left-4 z-10 text-gray-400 pointer-events-none">
        <Search size={18} strokeWidth={2.5} />
      </div>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-black/5 backdrop-blur-xl border border-transparent text-gray-900 text-[15px] font-semibold rounded-full focus:outline-none focus:bg-white focus:shadow-[0_8px_24px_rgba(0,0,0,0.08)] focus:border-black/5 placeholder:text-gray-400 placeholder:font-medium transition-all duration-300"
      />

      {/* Nút Clear chuẩn Apple: Vòng tròn xám nhỏ chứa dấu X */}
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleClear}
            className="absolute right-3 p-1.5 bg-gray-200/80 hover:bg-gray-300 text-gray-500 rounded-full transition-colors active:scale-90"
            aria-label="Xóa tìm kiếm"
          >
            <X size={14} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
