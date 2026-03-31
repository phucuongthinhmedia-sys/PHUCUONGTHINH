"use client";

import Link from "next/link";
import { useAuth } from "@repo/shared-utils";
import {
  ShoppingCart,
  UserPlus,
  ScanLine,
  Package,
  FolderTree,
  Upload,
  ImageIcon,
  Warehouse,
  Bell,
  Search,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    label: "Đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
    bg: "#EEF2FF",
    color: "#4F46E5",
  },
  {
    label: "Thêm khách",
    icon: UserPlus,
    href: "/admin/leads",
    bg: "#F0FDF4",
    color: "#16A34A",
  },
  {
    label: "Quét mã",
    icon: ScanLine,
    href: "/admin/scan",
    bg: "#FDF4FF",
    color: "#9333EA",
  },
  {
    label: "Sản phẩm",
    icon: Package,
    href: "/admin/products",
    bg: "#FFF7ED",
    color: "#EA580C",
  },
  {
    label: "Danh mục",
    icon: FolderTree,
    href: "/admin/categories",
    bg: "#FEFCE8",
    color: "#CA8A04",
  },
  {
    label: "Import",
    icon: Upload,
    href: "/admin/import",
    bg: "#FFF1F2",
    color: "#E11D48",
  },
  {
    label: "Kho hàng",
    icon: Warehouse,
    href: "/warehouse",
    bg: "#F0FDFA",
    color: "#0D9488",
  },
  {
    label: "Media",
    icon: ImageIcon,
    href: "/admin/media",
    bg: "#EFF6FF",
    color: "#2563EB",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng ☀️"
      : hour < 18
        ? "Chào buổi chiều 🌤️"
        : "Chào buổi tối 🌙";

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      {/* ── TOP HERO: ~1/3 màn hình ── */}
      <div
        className="relative overflow-hidden px-5 pt-12 pb-6 flex flex-col gap-5"
        style={{
          minHeight: "33dvh",
          background: "linear-gradient(145deg, #ffffff 0%, #EEF0F8 100%)",
        }}
      >
        {/* Greeting + Bell */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm">{greeting}</p>
            <h1 className="text-gray-800 text-2xl font-black mt-0.5">
              {user?.email?.split("@")[0] ?? "Admin"}
            </h1>
          </div>
          <button className="relative p-3 bg-white rounded-2xl shadow-sm text-gray-500 active:scale-95 transition-all">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <Search size={17} className="text-gray-400 shrink-0" />
            <span className="text-gray-400 text-sm">
              Tìm sản phẩm, khách hàng…
            </span>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="px-4 pt-5 pb-32">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-1">
          Thao tác nhanh
        </p>

        <div className="grid grid-cols-4 gap-x-3 gap-y-5">
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, bg, color }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              {/* Icon tile */}
              <div
                className="w-full aspect-square rounded-[20px] flex items-center justify-center shadow-sm"
                style={{ backgroundColor: bg }}
              >
                <Icon size={26} strokeWidth={1.7} style={{ color }} />
              </div>
              {/* Label */}
              <span className="text-[11px] font-semibold text-gray-500 text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
