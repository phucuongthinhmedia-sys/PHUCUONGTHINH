"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@repo/shared-utils";
import { authService } from "@/lib/auth-service";
import {
  FolderTree,
  Tags,
  ImageIcon,
  Upload,
  Users,
  LogOut,
  ChevronRight,
  Warehouse,
  ClipboardList,
  FileText,
  Home,
  ShoppingBag,
  Eye,
  X,
} from "lucide-react";

// ─── 1. TÁCH DATA MENU RA CHO GỌN CODE ───
const MENU_GROUPS = [
  {
    title: "Trang web",
    items: [
      { href: "/", label: "Trang chủ", icon: Home },
      { href: "/products", label: "Sản phẩm", icon: ShoppingBag },
    ],
  },
  {
    title: "Quản trị",
    items: [
      { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
      { href: "/admin/tags", label: "Tags", icon: Tags },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
      { href: "/admin/import", label: "Import", icon: Upload },
      { href: "/admin/leads", label: "Leads", icon: Users },
    ],
  },
  {
    title: "Vận hành",
    items: [
      { href: "/warehouse", label: "Kho hàng", icon: Warehouse },
      { href: "/catalogue", label: "Catalogue", icon: ClipboardList },
      { href: "/management", label: "Nội dung", icon: FileText },
      { href: "/leads", label: "Leads nội bộ", icon: Users },
    ],
  },
];

// ─── 2. COMPONENT NAV ITEM ───
function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: any;
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
          ? "bg-[#804000] text-white shadow-md shadow-[#804000]/20 -translate-y-0.5" // Active: Nền nâu, chữ trắng nổi bật
          : "text-[#804000]/70 hover:bg-[#804000]/5 hover:text-[#804000]" // Inactive: Chữ nâu mờ, hover nền nâu nhạt
      }`}
    >
      <Icon
        size={18}
        className={
          isActive
            ? "text-white"
            : "text-[#804000]/50 group-hover:text-[#804000] transition-colors"
        }
      />
      <span className="flex-1">{item.label}</span>
      {isActive && <ChevronRight size={16} className="text-white/70" />}
    </Link>
  );
}

// ─── 3. MAIN SIDEBAR CONTENT (BẢN SÁNG - LIGHT THEME) ───
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    authService.logout();
    router.replace("/admin/login");
  };

  return (
    // Nền màu Kem sáng (#FDF5E6) thay vì Nâu đen nặng nề
    <aside className="h-full w-64 bg-[#FDF5E6] flex flex-col border-r border-[#804000]/10 shadow-[20px_0_40px_rgba(128,64,0,0.03)]">
      {/* Header Logo */}
      <div className="px-6 py-8 shrink-0 flex items-center justify-between relative">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-[#804000]/10 overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="object-contain w-full h-full p-1 group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="font-black text-[15px] uppercase tracking-tight text-[#804000]">
            Phú Cường <br /> Thịnh
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#804000]/50 hover:text-[#804000] bg-white p-2 rounded-full shadow-sm"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-6 custom-scrollbar">
        {MENU_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-4 pb-2 text-[11px] font-black uppercase tracking-widest text-[#804000]/40">
              {group.title}
            </p>
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={
                  pathname === item.href || pathname.startsWith(item.href + "/")
                }
                onClick={onClose}
              />
            ))}
          </div>
        ))}

        <div className="border-t border-[#804000]/10 mx-4 pt-4">
          <NavItem
            item={{
              href: "/products",
              label: "Xem như khách",
              icon: Eye,
              target: "_blank",
            }}
            isActive={false}
          />
        </div>
      </nav>

      {/* Footer Profile */}
      <div className="p-4 bg-white/50 border-t border-[#804000]/10 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-sm border border-[#804000]/5 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#804000]/10 flex items-center justify-center shrink-0">
            <span className="text-[#804000] text-sm font-black uppercase">
              {user?.email?.[0] ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#804000] text-sm font-bold truncate">
              {user?.email}
            </p>
            <p className="text-[#804000]/60 text-xs font-medium capitalize">
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

// ─── 4. CÁC EXPORT CHÍNH ───
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
