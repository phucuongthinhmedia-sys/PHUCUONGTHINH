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
  "/admin/media": "Media",
  "/admin/import": "Import",
  "/admin/leads": "Leads",
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
      className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50"
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="shrink-0 w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20"
          >
            <img
              src="/logo.png"
              alt="Logo"
              width="20"
              height="20"
              className="object-contain"
            />
          </Link>
          <div>
            <h1 className="text-slate-900 font-bold text-base tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
          <button
            onClick={onMenuOpen}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all active:scale-95"
            aria-label="Mở menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-2">
          <Search size={16} className="text-slate-400 shrink-0" />
          <span className="text-slate-400 text-sm">Tìm kiếm...</span>
        </div>
      </div>
    </motion.div>
  );
}
