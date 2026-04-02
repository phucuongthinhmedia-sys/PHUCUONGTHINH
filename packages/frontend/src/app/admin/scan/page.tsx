"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import QRScanner from "@/components/internal/QRScanner";

export default function ScanPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-gray-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Quay lại</span>
        </button>
        <h1 className="text-white text-sm font-semibold">Quét mã QR sản phẩm</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scanner */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <QRScanner />
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-4 bg-black border-t border-gray-800">
        <p className="text-gray-400 text-xs text-center">
          Đưa camera vào mã QR để tìm sản phẩm nhanh
        </p>
      </div>
    </div>
  );
}
