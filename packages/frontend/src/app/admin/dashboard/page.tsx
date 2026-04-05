"use client";

import Link from "next/link";
import { useAuth } from "@repo/shared-utils";
import { useState, useEffect } from "react";
import {
  Package,
  FolderTree,
  FileText,
  Warehouse,
  Bell,
  Search,
  Activity,
  Plus,
  AlertCircle,
  Star,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { productService } from "@/lib/product-service";
import { MobileHero } from "@/components/admin/MobileHero";

// ── COMPONENT MỚI: Ô THỐNG KÊ LIỀN MẠCH (SEAMLESS CELL) ──
function AppleStatCell({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  href,
}: any) {
  return (
    <Link
      href={href}
      className="bg-white p-5 md:p-6 flex flex-col justify-between min-h-[130px] group hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-colors relative"
    >
      <div className="flex justify-between items-start">
        <div
          className={`w-11 h-11 rounded-[12px] flex items-center justify-center ${bgClass}`}
        >
          <Icon size={22} className={colorClass} strokeWidth={2} />
        </div>
        <ChevronRight
          size={18}
          className="text-[#C7C7CC] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
        />
      </div>
      <div className="mt-4">
        <p className="text-[28px] md:text-[32px] font-bold text-black tracking-tight leading-none mb-1.5">
          {value}
        </p>
        <p className="text-[13px] md:text-[14px] font-medium text-[#8E8E93]">
          {label}
        </p>
      </div>
    </Link>
  );
}

function AppleActionRow({
  href,
  icon: Icon,
  label,
  desc,
  colorClass,
  bgClass,
}: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-3 active:bg-gray-50 transition-colors cursor-pointer group"
    >
      <div
        className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${bgClass}`}
      >
        <Icon size={20} className={colorClass} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[17px] font-medium text-black group-hover:text-[#007AFF] transition-colors">
          {label}
        </p>
        <p className="text-[13px] text-[#8E8E93]">{desc}</p>
      </div>
      <ChevronRight size={20} className="text-[#C7C7CC] shrink-0" />
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    productService
      .getProducts({ page: 1, limit: 5, published: "all" as any })
      .then((all) => {
        const total = all.pagination?.total ?? 0;
        const published = (all.products ?? []).filter(
          (p) => p.is_published,
        ).length;
        setStats({ total, published, draft: total - published });
        setRecentProducts(all.products.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng"
      : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans pb-24">
      {/* ── MOBILE HERO ── */}
      <MobileHero />

      {/* ── DESKTOP HERO ── */}
      <div className="hidden md:block px-8 pt-10 pb-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-medium text-[#8E8E93]">{greeting}</p>
            <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight">
              {user?.email?.split("@")[0] ?? "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 md:w-64 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full bg-black/[0.05] rounded-[10px] py-2 pl-9 pr-4 text-[15px] outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
            </div>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#8E8E93] active:scale-95">
              <Bell size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── NỘI DUNG CHÍNH ── */}
      <div className="px-4 md:px-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8 mt-6 md:mt-0">
        {/* ── SECTION TỔNG QUAN (SEAMLESS WIDGET) ── */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[20px] font-semibold text-black tracking-tight">
              Tổng quan hệ thống
            </h2>
          </div>

          {/* Vỏ ngoài bọc lưới */}
          <div className="bg-[#E5E5EA] rounded-[24px] md:rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E5E5EA] overflow-hidden">
            {/* Lưới phân chia 1px */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px]">
              <AppleStatCell
                label="Tổng sản phẩm"
                value={loading ? "…" : stats.total}
                icon={Package}
                colorClass="text-[#007AFF]"
                bgClass="bg-[#007AFF]/10"
                href="/admin/products"
              />
              <AppleStatCell
                label="Đã đăng"
                value={loading ? "…" : stats.published}
                icon={Activity}
                colorClass="text-[#34C759]"
                bgClass="bg-[#34C759]/10"
                href="/admin/products"
              />
              <AppleStatCell
                label="Bản nháp"
                value={loading ? "…" : stats.draft}
                icon={AlertCircle}
                colorClass="text-[#FF9500]"
                bgClass="bg-[#FF9500]/10"
                href="/admin/products"
              />
              <AppleStatCell
                label="Danh mục"
                value="—" // Bạn có thể call API tổng danh mục để điền vào đây
                icon={FolderTree}
                colorClass="text-[#AF52DE]"
                bgClass="bg-[#AF52DE]/10"
                href="/admin/categories"
              />
            </div>
          </div>
        </section>

        {/* ── CÁC WIDGET KHÁC ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DANH SÁCH SẢN PHẨM GẦN ĐÂY */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[20px] font-semibold text-black tracking-tight">
                Sản phẩm gần đây
              </h2>
              <Link
                href="/admin/products"
                className="text-[15px] font-medium text-[#007AFF]"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] border border-[#E5E5EA]">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="animate-spin text-[#8E8E93]" />
                </div>
              ) : recentProducts.length === 0 ? (
                <p className="p-8 text-center text-[#8E8E93] text-[15px]">
                  Chưa có sản phẩm nào
                </p>
              ) : (
                <div className="flex flex-col">
                  {recentProducts.map((p, index) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-3 pl-4 hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-[12px] bg-[#F2F2F7] flex items-center justify-center shrink-0">
                        <span className="text-[13px] font-semibold text-[#8E8E93] uppercase">
                          {p.sku?.slice(0, 2)}
                        </span>
                      </div>
                      <div
                        className={`flex-1 flex justify-between items-center py-2 ${index !== recentProducts.length - 1 ? "border-b border-[#E5E5EA] -mb-5 pb-5" : ""}`}
                      >
                        <div className="pr-4">
                          <p className="text-[17px] font-medium text-black line-clamp-1 group-hover:text-[#007AFF] transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[14px] text-[#8E8E93] mt-0.5">
                            {p.sku}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 mr-2">
                          <span
                            className={`text-[13px] font-semibold px-2.5 py-1 rounded-[8px] ${p.is_published ? "bg-[#34C759]/10 text-[#34C759]" : "bg-[#8E8E93]/10 text-[#8E8E93]"}`}
                          >
                            {p.is_published ? "Đăng" : "Nháp"}
                          </span>
                          <ChevronRight size={20} className="text-[#C7C7CC]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CÔNG CỤ & WIDGET HỖ TRỢ */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-semibold text-black tracking-tight mb-3 px-1">
                Công cụ
              </h2>
              <div className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] border border-[#E5E5EA] flex flex-col py-1.5 overflow-hidden">
                <AppleActionRow
                  href="/admin/products/new"
                  icon={Plus}
                  label="Thêm sản phẩm"
                  desc="Tạo mới"
                  colorClass="text-[#007AFF]"
                  bgClass="bg-[#007AFF]/10"
                />
                <div className="ml-16 border-b border-[#E5E5EA]" />
                <AppleActionRow
                  href="/admin/documents"
                  icon={FileText}
                  label="Chứng từ"
                  desc="Quản lý tài liệu"
                  colorClass="text-[#FF9500]"
                  bgClass="bg-[#FF9500]/10"
                />
                <div className="ml-16 border-b border-[#E5E5EA]" />
                <AppleActionRow
                  href="/warehouse"
                  icon={Warehouse}
                  label="Kho hàng"
                  desc="Tồn kho"
                  colorClass="text-[#34C759]"
                  bgClass="bg-[#34C759]/10"
                />
              </div>
            </div>

            {/* Support Widget - Apple Wallet Card Style */}
            <div className="rounded-[24px] p-6 bg-gradient-to-br from-[#007AFF] to-[#5856D6] text-white shadow-[0_8px_24px_rgba(0,122,255,0.2)] relative overflow-hidden">
              <Star
                size={24}
                className="mb-2 text-white/80"
                strokeWidth={1.5}
              />
              <h3 className="text-[20px] font-semibold tracking-tight mb-1">
                Cần hỗ trợ?
              </h3>
              <p className="text-[15px] text-white/80 mb-5 leading-relaxed font-medium">
                Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ bạn vận hành.
              </p>
              <a
                href="tel:0901234567"
                className="flex items-center justify-center w-full py-3.5 bg-white text-[#007AFF] rounded-[14px] font-semibold text-[15px] active:scale-[0.97] transition-transform shadow-sm"
              >
                Liên hệ ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
