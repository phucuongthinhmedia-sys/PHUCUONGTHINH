"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Plus,
  Warehouse,
  MoreHorizontal,
  ShoppingCart,
  UserPlus,
  ScanLine,
  FolderTree,
  Tags,
  FileText,
  Users,
  Eye,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const MORE_ITEMS = [
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/documents", label: "Chứng từ", icon: FileText },
  { href: "/admin/leads", label: "Khách hàng", icon: Users },
  { href: "/products", label: "Xem như khách", icon: Eye, target: "_blank" },
];

export function MobileBottomNav({
  onMenuOpen: _onMenuOpen,
}: {
  onMenuOpen?: () => void;
}) {
  const pathname = usePathname();
  const [plusOpen, setPlusOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const closeAll = () => {
    setPlusOpen(false);
    setMoreOpen(false);
  };

  return (
    <>
      {/* Overlay làm tối nền nhẹ khi mở menu */}
      <AnimatePresence>
        {(plusOpen || moreOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]"
            onClick={closeAll}
          />
        )}
      </AnimatePresence>

      {/* POPUP NÚT + (Đã fix lỗi lệch phải, căn giữa 100%) */}
      <AnimatePresence>
        {plusOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            // Fix: Dùng inset-x-0 mx-auto để căn giữa tuyệt đối
            className="fixed bottom-[100px] inset-x-0 mx-auto z-40 bg-white/70 backdrop-blur-[32px] saturate-[1.8] rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-white/60 p-2.5 w-[250px]"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1.5 border-b border-[#E5E5EA]">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
                Thêm mới
              </span>
              <button
                onClick={closeAll}
                className="p-1.5 bg-[#E5E5EA]/60 hover:bg-[#E5E5EA] rounded-full transition-colors active:scale-90"
              >
                <X size={16} strokeWidth={2.5} className="text-[#8E8E93]" />
              </button>
            </div>
            <div className="flex flex-col gap-1 mt-1.5">
              <Link
                href="/admin/orders/new"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-3 rounded-[16px] text-[15px] font-semibold text-black hover:bg-white/50 active:bg-black/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                  <ShoppingCart
                    size={18}
                    strokeWidth={2}
                    className="text-[#007AFF]"
                  />
                </div>
                Thêm đơn hàng
              </Link>
              <Link
                href="/admin/leads/new"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-3 rounded-[16px] text-[15px] font-semibold text-black hover:bg-white/50 active:bg-black/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#34C759]/10 flex items-center justify-center shrink-0">
                  <UserPlus
                    size={18}
                    strokeWidth={2}
                    className="text-[#34C759]"
                  />
                </div>
                Thêm khách
              </Link>
              <Link
                href="/admin/scan"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-3 rounded-[16px] text-[15px] font-semibold text-black hover:bg-white/50 active:bg-black/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#AF52DE]/10 flex items-center justify-center shrink-0">
                  <ScanLine
                    size={18}
                    strokeWidth={2}
                    className="text-[#AF52DE]"
                  />
                </div>
                Quét mã QR
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP NÚT ... (Căn lề phải) */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-[100px] right-4 z-40 bg-white/70 backdrop-blur-[32px] saturate-[1.8] rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-white/60 p-2.5 w-[220px] max-h-[60vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1.5 border-b border-[#E5E5EA]">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
                Khác
              </span>
              <button
                onClick={closeAll}
                className="p-1.5 bg-[#E5E5EA]/60 hover:bg-[#E5E5EA] rounded-full transition-colors active:scale-90"
              >
                <X size={16} strokeWidth={2.5} className="text-[#8E8E93]" />
              </button>
            </div>
            <div className="flex flex-col gap-1 mt-1.5">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.target}
                    onClick={closeAll}
                    className={`flex items-center gap-3 px-3 py-3 rounded-[16px] text-[15px] font-medium transition-colors ${
                      active
                        ? "bg-white text-black shadow-sm"
                        : "text-black hover:bg-white/50 active:bg-black/5"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${active ? "bg-[#007AFF]/10 text-[#007AFF]" : "bg-[#F2F2F7] text-[#8E8E93]"}`}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHUẨN IOS 18 FLOATING NAV BAR */}
      {/* Fix: Dùng inset-x-0 mx-auto w-fit thay vì left-1/2 -translate-x-1/2 để Navbar cũng căn chính giữa tuyệt đối */}
      <nav className="fixed bottom-6 inset-x-0 mx-auto w-fit z-40 lg:hidden">
        <LayoutGroup>
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-[32px] saturate-[1.8] p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.4)_inset] border border-white/40">
            <NavTab
              href="/admin/dashboard"
              icon={Home}
              active={isActive("/admin/dashboard", true)}
            />
            <NavTab
              href="/admin/products"
              icon={ShoppingBag}
              active={isActive("/admin/products")}
            />

            {/* Nút + phong cách nổi bật (Đen tuyền) */}
            <div className="relative px-1">
              <button
                onClick={() => {
                  setPlusOpen((v) => !v);
                  setMoreOpen(false);
                }}
                className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  plusOpen
                    ? "bg-black rotate-45 scale-95"
                    : "bg-black shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-90"
                }`}
              >
                <Plus size={24} strokeWidth={2.5} className="text-white" />
              </button>
            </div>

            <NavTab
              href="/warehouse"
              icon={Warehouse}
              active={isActive("/warehouse")}
            />

            <NavTabButton
              active={moreOpen}
              onClick={() => {
                setMoreOpen((v) => !v);
                setPlusOpen(false);
              }}
              icon={MoreHorizontal}
            />
          </div>
        </LayoutGroup>
      </nav>
    </>
  );
}

// ─── Component Button dùng chung ───
function NavTab({
  href,
  icon: Icon,
  active,
}: {
  href: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all active:scale-85"
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 bg-[#E5E5EA]/70 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        size={22}
        strokeWidth={active ? 2.5 : 2}
        className={`relative z-10 transition-colors duration-200 ${active ? "text-black" : "text-[#8E8E93]"}`}
      />
    </Link>
  );
}

function NavTabButton({
  active,
  onClick,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all active:scale-85 outline-none"
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 bg-[#E5E5EA]/70 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        size={22}
        strokeWidth={active ? 2.5 : 2}
        className={`relative z-10 transition-colors duration-200 ${active ? "text-black" : "text-[#8E8E93]"}`}
      />
    </button>
  );
}
