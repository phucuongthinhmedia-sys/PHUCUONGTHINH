"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
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
    <div className="lg:hidden sticky top-0 z-30 bg-[#804000] border-b border-[#D2B48C]/20 flex items-center justify-between px-5 h-16 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="shrink-0 bg-[#FDF5E6] p-1.5 rounded-xl">
          <img
            src="/logo.png"
            alt="Logo"
            width="24"
            height="24"
            className="object-contain"
          />
        </Link>
        <h1 className="text-[#FDF5E6] font-bold text-base tracking-wide truncate">
          {title}
        </h1>
      </div>

      <button
        onClick={onMenuOpen}
        className="p-2 bg-[#FDF5E6]/10 rounded-xl text-[#FDF5E6] hover:bg-[#FDF5E6]/20 active:scale-95 transition-all"
        aria-label="Mở menu"
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
