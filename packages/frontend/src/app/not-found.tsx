"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] to-[#f5e6d3]">
      <div className="text-center px-6 max-w-lg">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#804000]/10 flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-[#804000]" />
          </div>
          <h1 className="text-6xl font-black text-[#804000] mb-2">404</h1>
          <h2 className="text-2xl font-bold text-[#804000] mb-4">
            Không tìm thấy trang
          </h2>
          <p className="text-[#804000]/70 text-lg">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#804000] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6b3400] transition-colors"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#804000] text-[#804000] px-6 py-3 rounded-full font-semibold hover:bg-[#804000]/5 transition-colors"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
