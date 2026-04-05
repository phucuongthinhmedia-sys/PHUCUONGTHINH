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
  Calculator,
  FileText,
  Users,
  LogOut,
  X,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── 5 MAIN NAV ITEMS ───
const MAIN_NAV = [
  { href: "/admin/dashboard", label: "Trang chính", icon: Home },
  { href: "/admin/products", label: "Sản phẩm", icon: ShoppingBag },
  { href: "/calculator", label: "Máy tính", icon: Calculator },
];

// ─── MORE MENU ITEMS ───
const MORE_ITEMS = [
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/documents", label: "Chứng từ", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/warehouse", label: "Kho hàng", icon: Warehouse },
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
      className={`flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-[15px] font-bold transition-all duration-300 group relative overflow-hidden active:scale-[0.98] ${
        isActive
          ? "text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
          : "text-gray-600 hover:bg-black/5 hover:text-gray-900"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeNavSidebar"
          className="absolute inset-0 bg-gray-900 rounded-[14px]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        size={20}
        strokeWidth={2.5}
        className={`relative z-10 transition-all duration-300 ${
          isActive
            ? "text-white scale-105"
            : "text-gray-500 group-hover:text-gray-900"
        }`}
      />
      <span className="relative z-10 flex-1 tracking-tight">{item.label}</span>
      {isActive && (
        <ChevronRight
          size={16}
          strokeWidth={2.5}
          className="relative z-10 text-white/50"
        />
      )}
    </Link>
  );
}

// ─── PLUS POPUP (Apple Frosted Glass) ───
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
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      className="absolute left-full top-0 ml-4 z-50 bg-white/80 backdrop-blur-[32px] saturate-[1.8] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/60 p-2.5 w-[220px] overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-black/5 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Thêm mới nhanh
        </span>
      </div>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[12px] text-[14px] font-bold text-gray-700 hover:bg-black/5 hover:text-gray-900 transition-all active:scale-95"
        >
          <div className="w-8 h-8 rounded-[10px] bg-black/5 flex items-center justify-center">
            <item.icon size={16} strokeWidth={2.5} className="text-gray-900" />
          </div>
          {item.label}
        </Link>
      ))}
    </motion.div>
  );
}

// ─── MORE POPUP (Apple Frosted Glass) ───
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
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      className="absolute left-full top-0 ml-4 z-50 bg-white/80 backdrop-blur-[32px] saturate-[1.8] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/60 p-2.5 w-[220px] max-h-[70vh] overflow-y-auto"
    >
      <div className="px-3 py-2 border-b border-black/5 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Mở rộng
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-bold transition-all active:scale-95 ${
              active
                ? "bg-black/5 text-gray-900"
                : "text-gray-700 hover:bg-black/5 hover:text-gray-900"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${active ? "bg-white shadow-sm" : "bg-black/5"}`}
            >
              <Icon
                size={16}
                strokeWidth={2.5}
                className={active ? "text-gray-900" : "text-gray-600"}
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
    <aside className="h-full w-64 bg-[#F5F5F7] flex flex-col border-r border-black/5 shadow-[20px_0_60px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="px-6 py-6 shrink-0 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-[12px] bg-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="object-contain w-full h-full p-1.5 filter grayscale invert group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[14px] uppercase tracking-tight text-gray-900 leading-none">
              Phú Cường
            </span>
            <span className="font-bold text-[12px] uppercase tracking-widest text-gray-500 leading-tight">
              Thịnh
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 bg-black/5 hover:bg-black/10 p-2 rounded-full transition-all active:scale-90"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5 no-scrollbar">
        <NavItem
          item={MAIN_NAV[0]}
          isActive={isActive(MAIN_NAV[0].href)}
          onClick={onClose}
        />
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
            className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-[14px] text-[15px] font-bold transition-all duration-300 active:scale-[0.98] ${
              plusOpen
                ? "bg-gray-900 text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                : "text-gray-600 hover:bg-black/5 hover:text-gray-900"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-[8px] flex items-center justify-center transition-all ${plusOpen ? "bg-white/20" : "bg-black/5"}`}
            >
              <Plus
                size={18}
                strokeWidth={2.5}
                className={plusOpen ? "text-white" : "text-gray-700"}
              />
            </div>
            <span className="flex-1 tracking-tight text-left">Thêm mới</span>
          </button>
          <AnimatePresence>
            {plusOpen && <PlusMenu onClose={() => setPlusOpen(false)} />}
          </AnimatePresence>
        </div>

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
            className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-[14px] text-[15px] font-bold transition-all duration-300 active:scale-[0.98] ${
              moreOpen
                ? "bg-gray-900 text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                : "text-gray-600 hover:bg-black/5 hover:text-gray-900"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-[8px] flex items-center justify-center transition-all ${moreOpen ? "bg-white/20" : "bg-black/5"}`}
            >
              <MoreHorizontal
                size={18}
                strokeWidth={2.5}
                className={moreOpen ? "text-white" : "text-gray-700"}
              />
            </div>
            <span className="flex-1 tracking-tight text-left">Thêm</span>
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

      {/* Footer Profile */}
      <div className="p-4 shrink-0">
        <div className="bg-white rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-sm font-black uppercase">
                {user?.email?.[0] ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-[14px] font-bold truncate tracking-tight">
                {user?.email}
              </p>
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                {user?.role ?? "admin"}
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-gray-100" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-[12px] text-[13px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all"
          >
            <LogOut size={16} strokeWidth={2.5} />
            Đăng xuất
          </button>
        </div>
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
        className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full z-50 lg:hidden shadow-2xl animate-in slide-in-from-left duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
        <SidebarContent onClose={onClose} />
      </div>
    </>
  );
}
