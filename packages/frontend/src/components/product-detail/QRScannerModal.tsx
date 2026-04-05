"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import QRScanner from "@/components/internal/QRScanner";

interface QRScannerModalProps {
  onClose: () => void;
}

export function QRScannerModal({ onClose }: QRScannerModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 font-sans"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[360px] bg-white/80 backdrop-blur-[40px] saturate-150 rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h3 className="text-[17px] font-semibold text-black tracking-tight">
            Quét mã QR
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-[#E5E5EA] rounded-full active:scale-90 transition-transform"
          >
            <X size={16} strokeWidth={2.5} className="text-[#8E8E93]" />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="rounded-[24px] overflow-hidden shadow-inner border border-black/5 w-full aspect-square relative">
            <QRScanner />
          </div>
          <p className="text-[14px] font-medium text-[#8E8E93] text-center mt-5">
            Căn chỉnh mã QR vào khung hình
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
