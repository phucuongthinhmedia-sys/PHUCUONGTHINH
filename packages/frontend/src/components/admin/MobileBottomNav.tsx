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
  { href: "/admin/leads", label: "Leads", icon: Users },
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
      {/* Overlay khi popup mở */}
      <AnimatePresence>
        {(plusOpen || moreOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]"
            onClick={closeAll}
          />
        )}
      </AnimatePresence>

      {/* Popup nút + */}
      <AnimatePresence>
        {plusOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(4px)" }}
            transition={{ duration: 0.25, type: "spring", bounce: 0.3 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 bg-white/40 backdrop-blur-[24px] saturate-[1.8] rounded-[32px] shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/60 p-3 w-64"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1 border-b border-black/5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Thêm mới
              </span>
              <button
                onClick={closeAll}
                className="p-1.5 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-900" />
              </button>
            </div>
            <div className="space-y-1">
              <Link
                href="/admin/orders/new"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-gray-900 hover:bg-black/5 transition-all active:scale-95"
              >
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
                  <ShoppingCart size={18} className="text-gray-900" />
                </div>
                Thêm đơn hàng
              </Link>
              <Link
                href="/admin/leads/new"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-gray-900 hover:bg-black/5 transition-all active:scale-95"
              >
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
                  <UserPlus size={18} className="text-gray-900" />
                </div>
                Thêm khách
              </Link>
              <Link
                href="/admin/scan"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-gray-900 hover:bg-black/5 transition-all active:scale-95"
              >
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
                  <ScanLine size={18} className="text-gray-900" />
                </div>
                Quét mã QR
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup nút ... */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(4px)" }}
            transition={{ duration: 0.25, type: "spring", bounce: 0.3 }}
            className="fixed bottom-28 right-4 lg:left-1/2 lg:-translate-x-1/2 z-40 bg-white/40 backdrop-blur-[24px] saturate-[1.8] rounded-[32px] shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/60 p-3 w-64 max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1 border-b border-black/5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Khác
              </span>
              <button
                onClick={closeAll}
                className="p-1.5 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-900" />
              </button>
            </div>
            <div className="space-y-1">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.target}
                    onClick={closeAll}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 ${
                      active
                        ? "bg-black/5 text-black"
                        : "text-gray-800 hover:bg-black/5"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? "bg-transparent" : "bg-white/40"}`}
                    >
                      <Icon
                        size={18}
                        className={active ? "text-black" : "text-gray-600"}
                      />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHUẨN IOS 18 PURE GLASS */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden w-auto">
        <LayoutGroup>
          {/* Nền kính hoàn toàn trong suốt, không pha vàng/nâu */}
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-[24px] saturate-[1.8] p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.4)_inset] border border-white/50">
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

            {/* Nút + phong cách nổi bật (Đen tuyền chuẩn Apple) */}
            <div className="relative px-1">
              <button
                onClick={() => {
                  setPlusOpen((v) => !v);
                  setMoreOpen(false);
                }}
                className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                  plusOpen
                    ? "bg-gray-900 rotate-45"
                    : "bg-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-105"
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
          className="absolute inset-0 bg-black/5 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        size={22}
        strokeWidth={active ? 2.5 : 2}
        className={`relative z-10 transition-colors duration-200 ${active ? "text-gray-900" : "text-gray-500"}`}
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
      className="relative flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all active:scale-85"
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 bg-black/5 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        size={22}
        strokeWidth={active ? 2.5 : 2}
        className={`relative z-10 transition-colors duration-200 ${active ? "text-gray-900" : "text-gray-500"}`}
      />
    </button>
  );
}
