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
  Upload,
  Users,
  LogOut,
  X,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useState } from "react";

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
  { href: "/admin/import", label: "Import", icon: Upload },
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
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all group ${
        isActive
          ? "bg-amber-900 text-white shadow-md shadow-amber-900/20 -translate-y-0.5"
          : "text-amber-900/70 hover:bg-amber-900/5 hover:text-amber-900"
      }`}
    >
      <Icon
        size={18}
        className={
          isActive
            ? "text-white"
            : "text-amber-900/50 group-hover:text-amber-900 transition-colors"
        }
      />
      <span className="flex-1">{item.label}</span>
      {isActive && <ChevronRight size={16} className="text-white/70" />}
    </Link>
  );
}

// ─── PLUS POPUP ───
function PlusMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute left-full top-0 ml-3 z-50 bg-white rounded-2xl shadow-xl border border-amber-900/10 p-2 w-52 animate-in slide-in-from-left-2">
      <button
        onClick={onClose}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-amber-900/70 hover:bg-amber-900/5 hover:text-amber-900 transition-all"
      >
        <ShoppingCart size={17} />
        Thêm đơn hàng
      </button>
      <button
        onClick={onClose}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-amber-900/70 hover:bg-amber-900/5 hover:text-amber-900 transition-all"
      >
        <UserPlus size={17} />
        Thêm khách
      </button>
      <button
        onClick={onClose}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-amber-900/70 hover:bg-amber-900/5 hover:text-amber-900 transition-all"
      >
        <ScanLine size={17} />
        Quét mã QR / Barcode
      </button>
    </div>
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
    <div className="absolute left-full top-0 ml-3 z-50 bg-white rounded-2xl shadow-xl border border-amber-900/10 p-2 w-52 animate-in slide-in-from-left-2">
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              active
                ? "bg-amber-900/10 text-amber-900"
                : "text-amber-900/70 hover:bg-amber-900/5 hover:text-amber-900"
            }`}
          >
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </div>
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
    <aside className="h-full w-64 bg-amber-50 flex flex-col border-r border-amber-900/10 shadow-[20px_0_40px_rgba(128,64,0,0.03)]">
      {/* Logo */}
      <div className="px-6 py-8 shrink-0 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-amber-900/10 overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="object-contain w-full h-full p-1 group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="font-black text-[15px] uppercase tracking-tight text-amber-900">
            Phú Cường <br /> Thịnh
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-amber-900/50 hover:text-amber-900 bg-white p-2 rounded-full shadow-sm"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
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
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              plusOpen
                ? "bg-amber-900 text-white shadow-md"
                : "text-amber-900/70 hover:bg-amber-900/5 hover:text-amber-900"
            }`}
          >
            <Plus
              size={18}
              className={plusOpen ? "text-white" : "text-amber-900/50"}
            />
            <span className="flex-1">Thêm mới</span>
          </button>
          {plusOpen && <PlusMenu onClose={() => setPlusOpen(false)} />}
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
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              moreOpen
                ? "bg-amber-900 text-white shadow-md"
                : "text-amber-900/70 hover:bg-amber-900/5 hover:text-amber-900"
            }`}
          >
            <MoreHorizontal
              size={18}
              className={moreOpen ? "text-white" : "text-amber-900/50"}
            />
            <span className="flex-1">Thêm</span>
          </button>
          {moreOpen && (
            <MoreMenu onClose={() => setMoreOpen(false)} onNavClose={onClose} />
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 bg-white/50 border-t border-amber-900/10 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-sm border border-amber-900/5 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-900/10 flex items-center justify-center shrink-0">
            <span className="text-amber-900 text-sm font-black uppercase">
              {user?.email?.[0] ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber-900 text-sm font-bold truncate">
              {user?.email}
            </p>
            <p className="text-amber-900/60 text-xs font-medium capitalize">
              {user?.role ?? "admin"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
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
