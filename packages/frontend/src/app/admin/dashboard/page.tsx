"use client";

import Link from "next/link";
import { useAuth } from "@repo/shared-utils";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  UserPlus,
  ScanLine,
  Package,
  FolderTree,
  FileText,
  Calculator,
  Warehouse,
  Bell,
  Search,
  Activity,
  Plus,
  Users,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Star,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { productService } from "@/lib/product-service";

const QUICK_ACTIONS = [
  {
    label: "Đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "text-[#007AFF]",
    bg: "bg-[#007AFF]/10",
  },
  {
    label: "Thêm khách",
    icon: UserPlus,
    href: "/admin/leads",
    color: "text-[#34C759]",
    bg: "bg-[#34C759]/10",
  },
  {
    label: "Quét mã",
    icon: ScanLine,
    href: "/admin/scan",
    color: "text-[#AF52DE]",
    bg: "bg-[#AF52DE]/10",
  },
  {
    label: "Máy tính",
    icon: Calculator,
    href: "/calculator",
    color: "text-[#FF9500]",
    bg: "bg-[#FF9500]/10",
  },
];

function AppleStatCard({
  label,
  value,
  sub,
  icon: Icon,
  colorClass,
  bgClass,
  href,
}: any) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-transform duration-200"
    >
      <div
        className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4 transition-colors group-hover:opacity-80"
        className={bgClass}
      >
        <Icon size={24} className={colorClass} strokeWidth={1.5} />
      </div>
      <p className="text-[28px] font-semibold text-black tracking-tight leading-none mb-1">
        {value}
      </p>
      <p className="text-[15px] font-medium text-[#8E8E93]">{label}</p>
      {sub && <p className="text-[13px] text-[#C7C7CC] mt-1">{sub}</p>}
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
    <div className="min-h-screen bg-[#F2F2F7] font-sans pb-20">
      {/* ── TOP HERO ── */}
      <div className="px-5 md:px-8 pt-8 md:pt-10 pb-6 max-w-[1400px] mx-auto">
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

      <div className="px-5 md:px-8 max-w-[1400px] mx-auto space-y-6">
        {/* STATS BENTO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <AppleStatCard
            label="Tổng sản phẩm"
            value={loading ? "…" : stats.total}
            icon={Package}
            colorClass="text-[#007AFF]"
            bgClass="bg-[#007AFF]/10"
            href="/admin/products"
          />
          <AppleStatCard
            label="Đã đăng"
            value={loading ? "…" : stats.published}
            icon={Activity}
            colorClass="text-[#34C759]"
            bgClass="bg-[#34C759]/10"
            href="/admin/products"
          />
          <AppleStatCard
            label="Bản nháp"
            value={loading ? "…" : stats.draft}
            icon={AlertCircle}
            colorClass="text-[#FF9500]"
            bgClass="bg-[#FF9500]/10"
            href="/admin/products"
          />
          <AppleStatCard
            label="Danh mục"
            value="—"
            icon={FolderTree}
            colorClass="text-[#AF52DE]"
            bgClass="bg-[#AF52DE]/10"
            href="/admin/categories"
          />
        </div>

        {/* THAO TÁC NHANH MOBILE */}
        <div className="md:hidden pt-4">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-[#8E8E93] mb-3 px-1">
            Lối tắt
          </p>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div
                  className={`w-14 h-14 rounded-[16px] flex items-center justify-center ${action.bg}`}
                >
                  <action.icon
                    size={26}
                    className={action.color}
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[12px] font-medium text-[#8E8E93] text-center">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* SP GẦN ĐÂY - INSET GROUPED LIST */}
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

            <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_1px_5px_rgba(0,0,0,0.02)]">
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
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-[10px] bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-[13px] font-semibold text-[#8E8E93] uppercase">
                          {p.sku?.slice(0, 2)}
                        </span>
                      </div>
                      <div
                        className={`flex-1 flex justify-between items-center pb-3 ${index !== recentProducts.length - 1 ? "border-b border-[#E5E5EA] -mb-3" : ""}`}
                      >
                        <div>
                          <p className="text-[17px] font-medium text-black line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-[14px] text-[#8E8E93] mt-0.5">
                            {p.sku}
                          </p>
                        </div>
                        <span
                          className={`text-[13px] font-medium px-2 py-0.5 rounded-[6px] ${p.is_published ? "bg-[#34C759]/10 text-[#34C759]" : "bg-[#8E8E93]/10 text-[#8E8E93]"}`}
                        >
                          {p.is_published ? "Đăng" : "Nháp"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CÔNG CỤ - INSET GROUPED LIST */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-semibold text-black tracking-tight mb-3 px-1">
                Công cụ
              </h2>
              <div className="bg-white rounded-[20px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] flex flex-col py-1 overflow-hidden">
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

            {/* Support Widget */}
            <div className="rounded-[24px] p-6 bg-gradient-to-br from-[#007AFF] to-[#5856D6] text-white shadow-lg relative overflow-hidden">
              <Star
                size={24}
                className="mb-2 text-white/80"
                strokeWidth={1.5}
              />
              <h3 className="text-[20px] font-semibold tracking-tight mb-1">
                Cần hỗ trợ?
              </h3>
              <p className="text-[15px] text-white/80 mb-5 leading-relaxed">
                Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ bạn.
              </p>
              <a
                href="tel:0901234567"
                className="block w-full py-3 bg-white text-[#007AFF] text-center rounded-[14px] font-semibold text-[15px] active:scale-[0.97] transition-transform"
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
