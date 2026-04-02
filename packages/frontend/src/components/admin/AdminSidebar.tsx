"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@repo/shared-utils";
import { authService } from "@/lib/auth-service";
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
  ImageIcon,
  FileText,
  Users,
  LogOut,
  X,
  ChevronRight,
  Eye,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── 5 MAIN NAV ITEMS ───
const MAIN_NAV = [
  { href: "/admin/dashboard", label: "Trang chính", icon: Home },
  { href: "/admin/products", label: "Sản phẩm", icon: ShoppingBag },
  // index 2 = nút "+"  (handled separately)
  { href: "/warehouse", label: "Kho hàng", icon: Warehouse },
  // index 4 = nút "..." (handled separately)
];

// ─── MORE MENU ITEMS ───
const MORE_ITEMS = [
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/documents", label: "Chứng từ", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/products", label: "Xem như khách", icon: Eye, target: "_blank" },
];

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: {
    href: string;
    label: string;
    icon: React.ElementType;
    target?: string;
  };
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      target={item.target}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/25"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <Icon
        size={18}
        className={`relative z-10 transition-all duration-300 ${
          isActive
            ? "text-white scale-110"
            : "text-slate-400 group-hover:text-amber-600 group-hover:scale-105"
        }`}
      />
      <span className="relative z-10 flex-1">{item.label}</span>
      {isActive && (
        <ChevronRight size={16} className="relative z-10 text-white/70" />
      )}
    </Link>
  );
}

// ─── PLUS POPUP ───
function PlusMenu({ onClose }: { onClose: () => void }) {
  const menuItems = [
    { icon: ShoppingCart, label: "Thêm đơn hàng", href: "/admin/orders/new" },
    { icon: UserPlus, label: "Thêm khách", href: "/admin/leads/new" },
    { icon: ScanLine, label: "Quét mã QR", href: "/admin/scan" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute left-full top-0 ml-3 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-2 w-56 overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-slate-100 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Thêm mới nhanh
        </span>
      </div>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <item.icon size={16} className="text-amber-600" />
          </div>
          {item.label}
        </Link>
      ))}
    </motion.div>
  );
}

// ─── MORE POPUP ───
function MoreMenu({
  onClose,
  onNavClose,
}: {
  onClose: () => void;
  onNavClose?: () => void;
}) {
  const pathname = usePathname();
  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute left-full top-0 ml-3 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-2 w-56 max-h-[70vh] overflow-y-auto"
    >
      <div className="px-3 py-2 border-b border-slate-100 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Khác
        </span>
      </div>
      {MORE_ITEMS.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            target={item.target}
            onClick={() => {
              onClose();
              onNavClose?.();
            }}
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
    </motion.div>
  );
}

// ─── SIDEBAR CONTENT ───
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [plusOpen, setPlusOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => {
    logout();
    authService.logout();
    router.replace("/admin/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="h-full w-64 bg-gradient-to-b from-white to-slate-50 flex flex-col border-r border-slate-200/60 shadow-[20px_0_60px_rgba(0,0,0,0.03)]">
      {/* Logo */}
      <div className="px-5 py-6 shrink-0 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/25 flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="object-contain w-full h-full p-1.5 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[13px] uppercase tracking-tight text-slate-900 leading-tight">
              Phú Cường
            </span>
            <span className="font-bold text-[11px] uppercase tracking-wider text-amber-600 leading-tight">
              Thịnh
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {/* Trang chính */}
        <NavItem
          item={MAIN_NAV[0]}
          isActive={isActive(MAIN_NAV[0].href)}
          onClick={onClose}
        />

        {/* Sản phẩm */}
        <NavItem
          item={MAIN_NAV[1]}
          isActive={isActive(MAIN_NAV[1].href)}
          onClick={onClose}
        />

        {/* Nút + */}
        <div className="relative">
          <button
            onClick={() => {
              setPlusOpen((v) => !v);
              setMoreOpen(false);
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              plusOpen
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${plusOpen ? "bg-white/20" : "bg-amber-100"}`}
            >
              <Plus
                size={16}
                className={plusOpen ? "text-white" : "text-amber-600"}
              />
            </div>
            <span className="flex-1">Thêm mới</span>
          </button>
          <AnimatePresence>
            {plusOpen && <PlusMenu onClose={() => setPlusOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* Kho hàng */}
        <NavItem
          item={MAIN_NAV[2]}
          isActive={isActive(MAIN_NAV[2].href)}
          onClick={onClose}
        />

        {/* Nút ... */}
        <div className="relative">
          <button
            onClick={() => {
              setMoreOpen((v) => !v);
              setPlusOpen(false);
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              moreOpen
                ? "bg-slate-800 text-white shadow-lg shadow-slate-800/25"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${moreOpen ? "bg-white/20" : "bg-slate-100"}`}
            >
              <MoreHorizontal
                size={16}
                className={moreOpen ? "text-white" : "text-slate-500"}
              />
            </div>
            <span className="flex-1">Thêm</span>
          </button>
          <AnimatePresence>
            {moreOpen && (
              <MoreMenu
                onClose={() => setMoreOpen(false)}
                onNavClose={onClose}
              />
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 bg-white/80 backdrop-blur-sm border-t border-slate-200/60 shrink-0">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-slate-50 to-white shadow-sm border border-slate-200/50 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-md">
            <span className="text-white text-sm font-black uppercase">
              {user?.email?.[0] ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 text-sm font-bold truncate">
              {user?.email}
            </p>
            <p className="text-slate-500 text-xs font-medium capitalize">
              {user?.role ?? "admin"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:shadow-md transition-all"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

// ─── EXPORTS ───
export default function AdminSidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 z-50 hidden lg:block">
      <SidebarContent />
    </div>
  );
}

export function MobileSidebarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full z-50 lg:hidden shadow-2xl animate-in slide-in-from-left">
        <SidebarContent onClose={onClose} />
      </div>
    </>
  );
}
