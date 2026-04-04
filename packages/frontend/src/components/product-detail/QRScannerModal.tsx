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
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">
            Quét mã QR sản phẩm
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <QRScanner />
          <p className="text-xs text-gray-500 text-center mt-3">
            Đưa camera vào mã QR để chuyển đến sản phẩm
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
