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
  Calculator,
  FileText,
  Users,
  Eye,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      {(plusOpen || moreOpen) && (
        <div className="fixed inset-0 z-30" onClick={closeAll} />
      )}

      {/* Popup nút + */}
      <AnimatePresence>
        {plusOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-3 w-60"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thêm mới
              </span>
              <button
                onClick={closeAll}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={14} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-1">
              <Link
                href="/admin/orders/new"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ShoppingCart size={16} className="text-blue-600" />
                </div>
                Thêm đơn hàng
              </Link>
              <Link
                href="/admin/leads/new"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <UserPlus size={16} className="text-emerald-600" />
                </div>
                Thêm khách
              </Link>
              <Link
                href="/admin/scan"
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <ScanLine size={16} className="text-purple-600" />
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
            initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-28 right-4 z-40 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-3 w-56 max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Khác
              </span>
              <button
                onClick={closeAll}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={14} className="text-slate-400" />
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-amber-100 text-amber-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-amber-200" : "bg-slate-100"}`}
                    >
                      <Icon
                        size={16}
                        className={active ? "text-amber-700" : "text-slate-500"}
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

      {/* Bottom Nav Bar - Floating Style */}
      <nav className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/30 border border-slate-700/50 px-2 py-2">
          <div className="flex items-center h-16">
            {/* Trang chính */}
            <NavTab
              href="/admin/dashboard"
              label="Trang chính"
              icon={Home}
              active={isActive("/admin/dashboard")}
            />

            {/* Sản phẩm */}
            <NavTab
              href="/admin/products"
              label="Sản phẩm"
              icon={ShoppingBag}
              active={isActive("/admin/products")}
            />

            {/* Nút + - Floating Action */}
            <div className="relative -mt-6">
              <button
                onClick={() => {
                  setPlusOpen((v) => !v);
                  setMoreOpen(false);
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  plusOpen
                    ? "bg-gradient-to-br from-rose-500 to-rose-600 rotate-45 shadow-rose-500/40"
                    : "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/40 hover:scale-105"
                }`}
              >
                <Plus size={26} strokeWidth={2.5} className="text-white" />
              </button>
            </div>

            {/* Kho hàng */}
            <NavTab
              href="/warehouse"
              label="Kho hàng"
              icon={Warehouse}
              active={isActive("/warehouse")}
            />

            {/* Nút ... */}
            <NavTabButton
              active={moreOpen}
              onClick={() => {
                setMoreOpen((v) => !v);
                setPlusOpen(false);
              }}
              icon={MoreHorizontal}
              label="Thêm"
            />
          </div>
        </div>
      </nav>
    </>
  );
}

function NavTab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
        active ? "text-amber-400" : "text-slate-400 hover:text-slate-300"
      }`}
    >
      <motion.div
        animate={active ? { scale: 1.1 } : { scale: 1 }}
        className={`p-2 rounded-xl transition-all ${active ? "bg-amber-500/20" : ""}`}
      >
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </motion.div>
      <span
        className={`text-[10px] font-bold leading-none tracking-wide transition-all ${active ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </span>
    </Link>
  );
}

function NavTabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
        active ? "text-amber-400" : "text-slate-400 hover:text-slate-300"
      }`}
    >
      <motion.div
        animate={active ? { scale: 1.1 } : { scale: 1 }}
        className={`p-2 rounded-xl transition-all ${active ? "bg-amber-500/20" : ""}`}
      >
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </motion.div>
      <span
        className={`text-[10px] font-bold leading-none tracking-wide transition-all ${active ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </span>
    </button>
  );
}
