"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];
  const maxVisible = 5;
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push("...");
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-12">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        aria-label="Trang trước"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </motion.button>

      {pages.map((page, index) => (
        <motion.button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`flex items-center justify-center min-w-[40px] h-[40px] sm:min-w-[44px] sm:h-[44px] px-2 text-[14px] sm:text-[15px] rounded-full transition-all duration-300 ${
            page === currentPage
              ? "bg-gray-900 text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              : page === "..."
                ? "cursor-default text-gray-400 font-medium"
                : "text-gray-700 font-semibold hover:bg-black/5"
          }`}
          whileHover={page !== "..." ? { scale: 1.05 } : {}}
          whileTap={page !== "..." ? { scale: 0.95 } : {}}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        aria-label="Trang sau"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
