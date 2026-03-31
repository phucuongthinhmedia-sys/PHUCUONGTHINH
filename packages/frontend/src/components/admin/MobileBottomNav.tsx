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
  ImageIcon,
  Upload,
  Users,
  Eye,
  X,
} from "lucide-react";
import { useState } from "react";

const MORE_ITEMS = [
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/import", label: "Import", icon: Upload },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/products", label: "Xem như khách", icon: Eye, target: "_blank" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      {plusOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl shadow-2xl border border-[#804000]/10 p-2 w-56 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#804000]/40">
              Thêm mới
            </span>
            <button onClick={closeAll}>
              <X size={14} className="text-[#804000]/40" />
            </button>
          </div>
          <button
            onClick={closeAll}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#804000]/70 hover:bg-[#804000]/5 hover:text-[#804000] transition-all"
          >
            <ShoppingCart size={17} /> Thêm đơn hàng
          </button>
          <button
            onClick={closeAll}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#804000]/70 hover:bg-[#804000]/5 hover:text-[#804000] transition-all"
          >
            <UserPlus size={17} /> Thêm khách
          </button>
          <button
            onClick={closeAll}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#804000]/70 hover:bg-[#804000]/5 hover:text-[#804000] transition-all"
          >
            <ScanLine size={17} /> Quét mã QR / Barcode
          </button>
        </div>
      )}

      {/* Popup nút ... */}
      {moreOpen && (
        <div className="fixed bottom-24 right-2 z-40 bg-white rounded-2xl shadow-2xl border border-[#804000]/10 p-2 w-52 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#804000]/40">
              Thêm
            </span>
            <button onClick={closeAll}>
              <X size={14} className="text-[#804000]/40" />
            </button>
          </div>
          {MORE_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                onClick={closeAll}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#804000]/10 text-[#804000]"
                    : "text-[#804000]/70 hover:bg-[#804000]/5 hover:text-[#804000]"
                }`}
              >
                <Icon size={17} /> {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#804000] border-t border-[#D2B48C]/20 safe-area-pb shadow-[0_-10px_40px_rgba(128,64,0,0.2)] rounded-t-3xl">
        <div className="flex items-stretch h-20 px-2 pb-2">
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

          {/* Nút + */}
          <button
            onClick={() => {
              setPlusOpen((v) => !v);
              setMoreOpen(false);
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <div
              className={`p-2.5 rounded-2xl transition-all ${plusOpen ? "bg-[#FDF5E6]/20 shadow-inner" : ""}`}
            >
              <Plus
                size={22}
                strokeWidth={plusOpen ? 2.5 : 2}
                className="text-[#FDF5E6]"
              />
            </div>
            <span
              className={`text-[11px] font-bold leading-none tracking-wide ${plusOpen ? "text-[#FDF5E6]" : "text-transparent"}`}
            >
              {plusOpen ? "Thêm" : "•"}
            </span>
          </button>

          {/* Kho hàng */}
          <NavTab
            href="/warehouse"
            label="Kho hàng"
            icon={Warehouse}
            active={isActive("/warehouse")}
          />

          {/* Nút ... */}
          <button
            onClick={() => {
              setMoreOpen((v) => !v);
              setPlusOpen(false);
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <div
              className={`p-2.5 rounded-2xl transition-all ${moreOpen ? "bg-[#FDF5E6]/20 shadow-inner" : ""}`}
            >
              <MoreHorizontal
                size={22}
                strokeWidth={moreOpen ? 2.5 : 2}
                className={moreOpen ? "text-[#FDF5E6]" : "text-[#D2B48C]/60"}
              />
            </div>
            <span
              className={`text-[11px] font-bold leading-none tracking-wide ${moreOpen ? "text-[#FDF5E6]" : "text-transparent"}`}
            >
              {moreOpen ? "Thêm" : "•"}
            </span>
          </button>
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
      className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
        active
          ? "text-[#FDF5E6] -translate-y-1"
          : "text-[#D2B48C]/60 hover:text-[#D2B48C]"
      }`}
    >
      <div
        className={`p-2.5 rounded-2xl transition-all ${active ? "bg-[#FDF5E6]/15 shadow-inner" : ""}`}
      >
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span
        className={`text-[11px] font-bold leading-none tracking-wide ${active ? "text-[#FDF5E6]" : "text-transparent"}`}
      >
        {active ? label : "•"}
      </span>
    </Link>
  );
}
