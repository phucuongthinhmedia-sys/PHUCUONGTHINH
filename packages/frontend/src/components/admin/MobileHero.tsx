"use client";

import Link from "next/link";
import {
  Search,
  Bell,
  MessageCircle,
  ShoppingCart,
  UserPlus,
  ScanLine,
  Calculator,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    label: "Đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "text-[#007AFF]", // Apple Blue
    bg: "bg-[#007AFF]/10",
  },
  {
    label: "Thêm khách",
    icon: UserPlus,
    href: "/admin/leads",
    color: "text-[#34C759]", // Apple Green
    bg: "bg-[#34C759]/10",
  },
  {
    label: "Quét mã",
    icon: ScanLine,
    href: "/admin/scan",
    color: "text-[#AF52DE]", // Apple Purple
    bg: "bg-[#AF52DE]/10",
  },
  {
    label: "Máy tính",
    icon: Calculator,
    href: "/calculator",
    color: "text-[#FF9500]", // Apple Orange
    bg: "bg-[#FF9500]/10",
  },
];

export function MobileHero() {
  return (
    // Lớp bọc ngoài để căn lề và xử lý "Tai thỏ/Dynamic Island" (Safe area)
    <div className="md:hidden px-4 pt-[max(env(safe-area-inset-top),16px)] pb-2 relative z-20">
      {/* ── KHỐI KÍNH NỔI (FLOATING GLASS CARD) ── */}
      <div className="bg-white/70 backdrop-blur-[32px] saturate-[1.8] border border-white/60 rounded-[32px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.3)_inset] transition-all">
        {/* ── HÀNG 1: SEARCH + BELL + MESSAGE ── */}
        <div className="flex items-center gap-2 mb-4">
          {/* Thanh Search gọn gàng */}
          <div className="flex-1 relative">
            <Search
              size={16}
              strokeWidth={2.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full bg-black/5 border-2 border-transparent rounded-[16px] py-2 pl-9 pr-3 text-[15px] font-medium text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all placeholder:text-[#8E8E93]"
            />
          </div>

          {/* Nút Chuông báo */}
          <button className="w-10 h-10 shrink-0 bg-black/5 hover:bg-black/10 rounded-[14px] flex items-center justify-center text-black active:scale-90 transition-all relative">
            <Bell size={18} strokeWidth={2} />
            {/* Chấm đỏ mượt mà */}
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF3B30] rounded-full ring-2 ring-white/50" />
          </button>

          {/* Nút Tin nhắn */}
          <button className="w-10 h-10 shrink-0 bg-black/5 hover:bg-black/10 rounded-[14px] flex items-center justify-center text-black active:scale-90 transition-all relative">
            <MessageCircle size={18} strokeWidth={2} />
          </button>
        </div>

        {/* ── HÀNG 2: 4 NÚT THAO TÁC NHANH ── */}
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform group"
            >
              <div
                className={`w-[52px] h-[52px] rounded-[16px] flex items-center justify-center ${action.bg} group-active:opacity-70 transition-opacity`}
              >
                <action.icon
                  size={22}
                  className={action.color}
                  strokeWidth={2}
                />
              </div>
              <span className="text-[11px] font-semibold text-[#8E8E93] text-center tracking-tight leading-none">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
