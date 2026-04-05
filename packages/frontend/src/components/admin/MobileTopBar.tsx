"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/products": "Sản phẩm",
  "/warehouse": "Kho hàng",
  "/catalogue": "Catalogue",
  "/management": "Nội dung",
  "/leads": "Leads nội bộ",
  "/admin/categories": "Danh mục",
  "/admin/tags": "Tags",
  "/admin/import": "Import",
  "/admin/leads": "Leads",
  "/calculator": "Máy tính",
  "/admin/products": "Quản lý SP",
  "/admin/orders": "Đơn hàng",
  "/admin/scan": "Quét mã",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES)
    .filter((k) => k !== "/" && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_TITLES[match] : "Hệ Thống Quản Trị";
}

export function MobileTopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="lg:hidden sticky top-0 z-30 bg-white/70 backdrop-blur-[32px] saturate-[1.8] border-b border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
    >
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="shrink-0 w-10 h-10 bg-gray-900 rounded-[14px] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-95 transition-transform"
          >
            <img
              src="/logo.png"
              alt="Logo"
              width="22"
              height="22"
              className="object-contain filter grayscale invert"
            />
          </Link>
          <div>
            <h1 className="text-gray-900 font-bold text-[17px] tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button className="relative p-2.5 text-gray-500 hover:text-gray-900 hover:bg-black/5 rounded-full transition-all active:scale-95">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <button
            onClick={onMenuOpen}
            className="p-2.5 bg-black/5 hover:bg-black/10 rounded-full text-gray-900 transition-all active:scale-95"
            aria-label="Mở menu"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Search bar - Safari Style */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 bg-black/5 rounded-full px-4 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus-within:border-black/5 border border-transparent">
          <Search
            size={16}
            strokeWidth={2.5}
            className="text-gray-500 shrink-0"
          />
          <span className="text-gray-500 font-medium text-[15px]">
            Tìm kiếm...
          </span>
        </div>
      </div>
    </motion.div>
  );
}
