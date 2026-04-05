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
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── NAV ITEMS ───
const MAIN_NAV = [
  { href: "/admin/dashboard", label: "Trang chính", icon: Home },
  { href: "/admin/products", label: "Sản phẩm", icon: ShoppingBag },
  { href: "/calculator", label: "Máy tính", icon: Calculator },
];

const PLUS_ITEMS = [
  { href: "/admin/orders/new", label: "Thêm đơn hàng", icon: ShoppingCart },
  { href: "/admin/leads/new", label: "Thêm khách", icon: UserPlus },
  { href: "/admin/scan", label: "Quét mã QR", icon: ScanLine },
];

const MORE_ITEMS = [
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/documents", label: "Chứng từ", icon: FileText },
  { href: "/admin/leads", label: "Khách hàng", icon: Users },
  { href: "/warehouse", label: "Kho hàng", icon: Warehouse },
  { href: "/products", label: "Xem như khách", icon: Eye, target: "_blank" },
];

// ─── COMPONENT: ITEM ĐƠN LẺ ───
function NavItem({ item, isActive, onClick, isSubItem = false }: any) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      target={item.target}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[15px] transition-colors cursor-pointer active:scale-[0.98] ${
        isActive
          ? "bg-[#007AFF] text-white font-semibold shadow-[0_2px_8px_rgba(0,122,255,0.25)]"
          : "text-black hover:bg-[#E5E5EA]/70 font-medium"
      } ${isSubItem ? "ml-7 pl-3" : ""}`}
    >
      <Icon
        size={isSubItem ? 18 : 20}
        strokeWidth={isActive ? 2.5 : 2}
        className={isActive ? "text-white" : "text-[#8E8E93]"}
      />
      <span className="flex-1 tracking-tight">{item.label}</span>
    </Link>
  );
}

// ─── COMPONENT: MENU XỔ XUỐNG (ACCORDION) ───
function AccordionNav({
  icon: Icon,
  label,
  items,
  isOpen,
  onToggle,
  onClose,
  pathname,
}: any) {
  // Kiểm tra xem có item con nào đang active không
  const hasActiveChild = items.some(
    (item: any) =>
      pathname === item.href || pathname.startsWith(item.href + "/"),
  );

  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[15px] font-medium transition-colors cursor-pointer active:scale-[0.98] ${
          isOpen
            ? "bg-[#E5E5EA]/50 text-black"
            : "text-black hover:bg-[#E5E5EA]/70"
        }`}
      >
        <Icon
          size={20}
          strokeWidth={2}
          className={
            hasActiveChild && !isOpen ? "text-[#007AFF]" : "text-[#8E8E93]"
          }
        />
        <span className="flex-1 tracking-tight text-left">{label}</span>
        <ChevronDown
          size={16}
          className={`text-[#8E8E93] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Hiệu ứng trượt xuống mượt mà của Apple */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 mt-1 relative">
              {/* Đường line mờ dọc theo các item con */}
              <div className="absolute left-[21px] top-2 bottom-2 w-[1.5px] bg-[#E5E5EA] rounded-full" />
              {items.map((item: any) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isSubItem={true}
                  isActive={
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                  }
                  onClick={onClose}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SIDEBAR CONTENT ───
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Quản lý state mở/đóng của các Accordion
  const [openSection, setOpenSection] = useState<"plus" | "more" | null>(null);

  const handleLogout = () => {
    logout();
    authService.logout();
    router.replace("/admin/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="h-full w-64 bg-[#F2F2F7] flex flex-col border-r border-[#E5E5EA] font-sans">
      {/* Logo Area */}
      <div className="px-5 py-6 shrink-0 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-[10px] bg-black shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">
            {/* Nếu có logo thật hãy dùng <img />, ở đây dùng Icon chữ tạm */}
            <span className="text-white font-bold text-[18px]">PC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[15px] tracking-tight text-black leading-tight">
              Phú Cường
            </span>
            <span className="font-medium text-[13px] tracking-wide text-[#8E8E93] leading-tight uppercase">
              Thịnh CMS
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#8E8E93] hover:text-black bg-[#E5E5EA]/50 hover:bg-[#E5E5EA] p-2 rounded-full transition-colors active:scale-90"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 no-scrollbar">
        <div className="px-3 mb-2 mt-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
            Hệ thống
          </span>
        </div>

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
        <NavItem
          item={MAIN_NAV[2]}
          isActive={isActive(MAIN_NAV[2].href)}
          onClick={onClose}
        />

        <div className="mt-4 mb-2 px-3 pt-4 border-t border-[#E5E5EA]">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
            Tiện ích
          </span>
        </div>

        {/* Nút Thêm mới - Accordion */}
        <AccordionNav
          icon={Plus}
          label="Thêm mới"
          items={PLUS_ITEMS}
          isOpen={openSection === "plus"}
          onToggle={() =>
            setOpenSection(openSection === "plus" ? null : "plus")
          }
          onClose={onClose}
          pathname={pathname}
        />

        {/* Nút Mở rộng - Accordion */}
        <AccordionNav
          icon={MoreHorizontal}
          label="Mở rộng"
          items={MORE_ITEMS}
          isOpen={openSection === "more"}
          onToggle={() =>
            setOpenSection(openSection === "more" ? null : "more")
          }
          onClose={onClose}
          pathname={pathname}
        />
      </nav>

      {/* Footer Profile - Chuẩn thẻ Settings iOS */}
      <div className="p-4 shrink-0">
        <div className="bg-white rounded-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] border border-[#E5E5EA] overflow-hidden">
          <div className="flex items-center gap-3 p-3 border-b border-[#E5E5EA]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shrink-0">
              <span className="text-white text-[16px] font-semibold uppercase">
                {user?.email?.[0] ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-black truncate tracking-tight">
                {user?.email?.split("@")[0] || "Admin User"}
              </p>
              <p className="text-[12px] font-medium text-[#8E8E93] uppercase">
                {user?.role ?? "Quản trị viên"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 text-[14px] font-medium text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors active:bg-[#FF3B30]/20"
          >
            <LogOut size={16} strokeWidth={2} />
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full z-50 lg:hidden shadow-[20px_0_40px_rgba(0,0,0,0.2)] animate-in slide-in-from-left duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
        <SidebarContent onClose={onClose} />
      </div>
    </>
  );
}
