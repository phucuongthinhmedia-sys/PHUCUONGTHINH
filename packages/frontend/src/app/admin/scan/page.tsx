"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, X, ScanLine } from "lucide-react";
import QRScanner from "@/components/internal/QRScanner";

export default function ScanPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans">
      {/* Màn hình Header kiểu Apple Camera UI */}
      <div className="absolute top-0 left-0 w-full z-10 px-4 py-5 md:py-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white transition-colors active:scale-95"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
          <span className="text-[17px] font-medium pr-1">Quay lại</span>
        </button>

        <div className="flex items-center gap-2 text-white/90">
          <ScanLine size={18} />
          <span className="text-[15px] font-semibold uppercase tracking-wider">
            Mã QR
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white transition-colors active:scale-95"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Vùng quét Scanner (Nằm giữa màn hình đen) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-[360px] aspect-square relative rounded-[32px] overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10">
          {/* Lớp khung ngắm (Viewfinder corners) */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-[32px] z-10 m-4 opacity-80 pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-[32px] z-10 m-4 opacity-80 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-[32px] z-10 m-4 opacity-80 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-[32px] z-10 m-4 opacity-80 pointer-events-none" />

          <QRScanner />
        </div>
      </div>

      {/* Vùng văn bản hướng dẫn phía dưới */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center">
        <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/5">
          <p className="text-white text-[15px] font-medium tracking-tight">
            Căn chỉnh mã QR vào trong khung hình
          </p>
        </div>
      </div>
    </div>
  );
}
