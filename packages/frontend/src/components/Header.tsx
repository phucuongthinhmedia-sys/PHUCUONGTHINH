"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  X,
  Menu,
  CalendarCheck,
  Settings,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  ShoppingCart,
} from "lucide-react";
import { MegaMenu } from "@/components/MegaMenu";
import { useAuth } from "@repo/shared-utils";
import { authService } from "@/lib/auth-service";
import { useQuoteCart } from "@/lib/wishlist-context";
import { LeadNotificationBadge } from "@/components/admin/LeadNotificationBadge";

// Bảng màu
const palette = {
  be: "#FDF5E6", // Màu kem nền
  brown: "#804000", // Màu nâu chữ
  lightBrown: "#D2B48C", // Màu nâu nhạt (đường kẻ)
};

const navLinks = [
  { href: "/thiet-ke", label: "Thiết kế" },
  { href: "/thi-cong", label: "Thi công" },
  { href: "/du-an", label: "Dự án" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const isProductsPage = pathname === "/products";
  const isProductDetailPage =
    pathname.startsWith("/products/") && pathname !== "/products";
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useQuoteCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Khóa cuộn trang khi mở menu mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    authService.logout();
  };

  const compactNavLinks = [
    { href: "/thiet-ke", label: "Thiết kế" },
    { href: "/thi-cong", label: "Thi công" },
    { href: "/du-an", label: "Dự án" },
    { href: "/ve-chung-toi", label: "Về chúng tôi" },
  ];

  const textColor = isScrolled ? palette.brown : "#FFFFFF";
  const borderColor = isScrolled
    ? "rgba(128, 64, 0, 0.1)"
    : "rgba(255, 255, 255, 0.5)";
  const dividerColor = isScrolled
    ? palette.lightBrown
    : "rgba(255, 255, 255, 0.3)";

  if (isProductsPage || isProductDetailPage) {
    return (
      <>
        {isAuthenticated && (
          <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a192f] text-white text-xs flex items-center justify-between px-3 md:px-4 h-8 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-gray-400">
                Chế độ Admin
              </span>
              <span className="text-emerald-400 font-medium truncate max-w-[100px] sm:max-w-none">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-0.5">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              >
                <LayoutDashboard size={14} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              >
                <Settings size={14} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Quản lý SP</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-400"
              >
                <LogOut size={14} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        )}

        {/* Thanh Floating cho trang Sản Phẩm (Tối ưu Mobile) */}
        <div
          className={`fixed right-2 sm:right-3 md:right-4 z-50 transition-all duration-300 ${isAuthenticated ? "top-10" : "top-2 sm:top-4"} ${isScrolled ? "opacity-90 hover:opacity-100" : ""}`}
        >
          <div className="bg-[#FDF5E6] rounded-full shadow-lg border border-gray-200/50 p-1.5 sm:p-2 pr-2 sm:pr-3 flex items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center gap-1.5 shrink-0 pl-1">
              <img
                src="/favicon.png"
                alt="Phú Cường Thịnh"
                className="size-7 sm:size-8 rounded-full sm:rounded-xl object-cover"
              />
              {/* Ẩn chữ trên màn hình di động cực nhỏ để tránh tràn */}
              <span
                style={{ color: "#8B1A1A" }}
                className="hidden sm:block font-black text-[12px] tracking-tight uppercase leading-none"
              >
                Phú Cường Thịnh
              </span>
            </Link>

            <span
              style={{ backgroundColor: palette.lightBrown }}
              className="w-px h-4 sm:h-5 opacity-40"
            />

            <div className="relative">
              <button
                onClick={() => setCompactMenuOpen(!compactMenuOpen)}
                style={{ color: palette.brown }}
                className="flex items-center gap-1 text-[11px] sm:text-[12px] font-medium transition-colors hover:text-opacity-80"
              >
                Menu{" "}
                <ChevronDown
                  size={13}
                  className={`transition-transform ${compactMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {compactMenuOpen && (
                <div className="absolute top-full right-[-20px] sm:right-0 mt-2 bg-[#FDF5E6] border border-gray-200/50 rounded-lg shadow-lg py-2 min-w-[140px] z-10">
                  {compactNavLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setCompactMenuOpen(false)}
                      style={{ color: palette.brown }}
                      className="block px-4 py-2 text-[12px] hover:text-opacity-80 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <span
              style={{ backgroundColor: palette.lightBrown }}
              className="w-px h-4 sm:h-5 opacity-40"
            />

            <Link
              href="/cart"
              style={{ color: palette.brown }}
              className="relative p-1.5 sm:p-2 hover:text-opacity-80 transition-colors"
            >
              <ShoppingCart size={16} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <span
              style={{ backgroundColor: palette.lightBrown }}
              className="w-px h-4 sm:h-5 opacity-40 hidden min-[360px]:block"
            />

            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: palette.brown }}
              className="hidden min-[360px]:flex items-center gap-1.5 text-white text-[11px] sm:text-[12px] font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-opacity-90 transition-colors whitespace-nowrap shadow-sm"
            >
              <CalendarCheck size={13} />
              <span className="hidden sm:inline">Đặt lịch</span>
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Khối Admin Toolbar giữ nguyên như cũ, chỉ tối ưu gap */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a192f] text-white text-xs flex items-center justify-between px-3 md:px-4 h-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-gray-400">Chế độ Admin</span>
            <span className="text-emerald-400 font-medium truncate max-w-[100px] sm:max-w-none">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-0.5">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <LayoutDashboard size={14} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <LeadNotificationBadge />
            <Link
              href="/admin/products"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <Settings size={14} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Quản lý SP</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-400"
            >
              <LogOut size={14} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ease-in-out px-2 sm:px-4 pt-2 sm:pt-4 ${
          isAuthenticated ? "top-8" : "top-0"
        }`}
      >
        <header
          style={{ borderColor: borderColor }}
          className={`transition-all duration-300 ease-in-out border rounded-full mx-auto max-w-[1920px] ${
            isScrolled
              ? "bg-[#FDF5E6]/95 backdrop-blur-md shadow-lg"
              : "bg-transparent backdrop-blur-sm"
          }`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-300 ease-in-out px-4 sm:px-6 ${
              isScrolled ? "h-[60px] sm:h-[70px]" : "h-[70px] sm:h-[80px]"
            }`}
          >
            {/* Logo */}
            <div className="flex-1 flex justify-start">
              <Link href="/" className="flex items-center shrink-0">
                <img
                  src={isScrolled ? "/dacuon.png" : "/chuacuon.png"}
                  alt="Phú Cường Thịnh Logo"
                  className={`object-contain transition-all duration-300 ${
                    isScrolled ? "h-[35px] sm:h-[50px]" : "h-[40px] sm:h-[60px]"
                  }`}
                />
              </Link>
            </div>

            {/* Nav Links (Desktop) */}
            <nav className="hidden lg:flex shrink-0 items-center justify-center gap-1">
              {/* ... Giữ nguyên phần nav của desktop ... */}
              <div className="group/products h-full flex items-center">
                <Link
                  href="/products"
                  style={{ color: textColor }}
                  className="group relative flex items-center gap-1 px-4 py-2 text-[14px] font-medium transition-opacity hover:opacity-70 whitespace-nowrap"
                >
                  Sản phẩm
                  <ChevronDown
                    size={14}
                    className="mt-px group-hover/products:rotate-180 transition-transform duration-200"
                  />
                </Link>
                <MegaMenu />
              </div>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ color: textColor }}
                  className="group relative flex items-center gap-0.5 px-4 py-2 text-[14px] font-medium transition-opacity hover:opacity-70 whitespace-nowrap"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 lg:gap-4">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                style={{ color: textColor }}
                className="p-1.5 sm:p-2 transition-opacity hover:opacity-70"
                aria-label="Tìm kiếm"
              >
                {searchOpen ? (
                  <X size={20} className="sm:w-[18px]" />
                ) : (
                  <Search size={20} className="sm:w-[18px]" />
                )}
              </button>

              <Link
                href="/cart"
                style={{ color: textColor }}
                className="relative p-1.5 sm:p-2 transition-opacity hover:opacity-70"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart size={20} className="sm:w-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </Link>

              <span
                style={{ backgroundColor: dividerColor }}
                className="hidden sm:block w-px h-5 transition-colors duration-300"
              />

              <button
                style={{ color: textColor }}
                className="hidden sm:flex items-center gap-1 px-2 py-2 text-[13px] font-medium transition-opacity hover:opacity-70"
              >
                VI
                <ChevronDown size={13} className="opacity-80 mt-px" />
              </button>

              <span
                style={{ backgroundColor: dividerColor }}
                className="hidden lg:block w-px h-5 transition-colors duration-300"
              />

              {!isAuthenticated && (
                <Link
                  href="/admin/login"
                  style={{
                    color: textColor,
                    borderColor: isScrolled ? palette.brown : "#FFFFFF",
                  }}
                  className="hidden xl:flex items-center gap-1.5 px-5 py-2 text-[13px] font-semibold rounded-full border transition-all hover:bg-white/10 whitespace-nowrap"
                >
                  <LogOut size={14} className="rotate-180" />
                  Đăng nhập
                </Link>
              )}

              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: isScrolled ? palette.brown : "#FFFFFF",
                  color: isScrolled ? "#FFFFFF" : palette.brown,
                }}
                className="hidden lg:flex items-center gap-2 text-[13px] font-bold px-6 py-2.5 rounded-full transition-transform hover:scale-105 whitespace-nowrap shadow-sm ml-1"
              >
                <CalendarDays size={15} />
                Đặt Lịch
              </a>

              {/* Nút Hamburger Menu cho Mobile */}
              <button
                style={{ color: textColor }}
                className="lg:hidden p-1.5 sm:p-2 ml-1 transition-opacity hover:opacity-70"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Thanh Search thả xuống */}
          {searchOpen && (
            <div
              style={{
                backgroundColor: isScrolled
                  ? palette.be
                  : "rgba(255,255,255,0.1)",
                borderColor: borderColor,
              }}
              className="border-t px-4 sm:px-6 py-4 rounded-b-3xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3 max-w-2xl mx-auto">
                <Search
                  size={16}
                  style={{ color: textColor }}
                  className="opacity-70 shrink-0"
                />
                <input
                  autoFocus
                  type="text"
                  placeholder="Nhập mã gạch..."
                  style={{ color: textColor, borderColor: dividerColor }}
                  className="flex-1 text-[15px] sm:text-sm bg-transparent outline-none placeholder:opacity-50 border-b pb-1.5 transition-colors focus:border-opacity-100"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  style={{ color: textColor }}
                  className="text-sm font-medium hover:opacity-70 transition-opacity whitespace-nowrap"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* TỐI ƯU MENU MOBILE: Dạng Overlay Full-Screen sang trọng hơn */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-[#FDF5E6] flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
          {/* Mobile Header */}
          <div
            className="flex items-center justify-between px-6 h-[70px] border-b"
            style={{ borderColor: palette.lightBrown }}
          >
            <img
              src="/dacuon.png"
              alt="Logo"
              className="h-[35px] object-contain"
            />
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 -mr-2 bg-black/5 rounded-full"
            >
              <X size={24} style={{ color: palette.brown }} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col px-6 pt-6 flex-1 overflow-y-auto pb-10">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              style={{ color: palette.brown, borderColor: palette.lightBrown }}
              className="flex items-center justify-between py-5 border-b opacity-100 text-[16px] font-bold"
            >
              Sản phẩm
              <ChevronDown
                size={18}
                style={{ color: palette.brown }}
                className="opacity-40"
              />
            </Link>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: palette.brown,
                  borderColor: palette.lightBrown,
                }}
                className="flex items-center justify-between py-5 border-b opacity-90 text-[16px] font-bold hover:text-opacity-60 transition-colors"
              >
                {label}
              </Link>
            ))}

            <div className="mt-auto pt-10 flex flex-col gap-4">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: palette.brown }}
                className="flex items-center justify-center gap-2 text-white font-bold px-4 py-4 rounded-full text-[15px] hover:bg-opacity-90 transition-colors shadow-sm"
              >
                <CalendarDays size={18} />
                Đặt Lịch Trải Nghiệm Showroom
              </a>

              {!isAuthenticated && (
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  style={{ color: palette.brown, borderColor: palette.brown }}
                  className="flex items-center justify-center gap-2 border-2 font-bold px-4 py-4 rounded-full text-[15px] hover:bg-black/5 transition-colors"
                >
                  <LogOut size={18} className="rotate-180" />
                  Đăng nhập Admin
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
