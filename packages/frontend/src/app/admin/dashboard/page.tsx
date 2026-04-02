"use client";

import Link from "next/link";
import { useAuth } from "@repo/shared-utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  UserPlus,
  ScanLine,
  Package,
  FolderTree,
  FileText,
  ImageIcon,
  Warehouse,
  Bell,
  Search,
  TrendingUp,
  Activity,
  Plus,
  Users,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Star,
} from "lucide-react";
import { productService } from "@/lib/product-service";

const QUICK_ACTIONS = [
  {
    label: "Đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
    bg: "bg-blue-50",
    color: "text-blue-600",
    border: "border-blue-100",
  },
  {
    label: "Thêm khách",
    icon: UserPlus,
    href: "/admin/leads",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    label: "Quét mã",
    icon: ScanLine,
    href: "/admin/scan",
    bg: "bg-purple-50",
    color: "text-purple-600",
    border: "border-purple-100",
  },
  {
    label: "Sản phẩm",
    icon: Package,
    href: "/admin/products",
    bg: "bg-amber-50",
    color: "text-amber-600",
    border: "border-amber-100",
  },
  {
    label: "Danh mục",
    icon: FolderTree,
    href: "/admin/categories",
    bg: "bg-yellow-50",
    color: "text-yellow-600",
    border: "border-yellow-100",
  },
  {
    label: "Chứng từ",
    icon: FileText,
    href: "/admin/documents",
    bg: "bg-rose-50",
    color: "text-rose-600",
    border: "border-rose-100",
  },
  {
    label: "Kho hàng",
    icon: Warehouse,
    href: "/warehouse",
    bg: "bg-teal-50",
    color: "text-teal-600",
    border: "border-teal-100",
  },
  {
    label: "Media",
    icon: ImageIcon,
    href: "/admin/media",
    bg: "bg-sky-50",
    color: "text-sky-600",
    border: "border-sky-100",
  },
];

// Mobile Stat Card Component
function MobileStatCard({ label, value, icon: Icon, trend, href }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shrink-0">
        <Icon size={22} className="text-amber-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
      {trend && (
        <div
          className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${trend.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}
        >
          <TrendingUp size={12} />
          {trend.value}%
        </div>
      )}
    </Link>
  );
}

// Desktop Stat Card
function StatCard({ label, value, sub, icon: Icon, trend, href }: any) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        href={href}
        className="group block bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
            <Icon size={22} className="text-amber-700" />
          </div>
          {trend && (
            <span
              className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}
            >
              <TrendingUp size={12} />
              {trend.value}%
            </span>
          )}
        </div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-sm font-bold text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </Link>
    </motion.div>
  );
}

// Desktop Quick Action
function QuickAction({ href, icon: Icon, label, desc }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-3 bg-slate-50 hover:bg-amber-50 rounded-xl transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0 shadow-md">
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ArrowRight
        size={16}
        className="text-slate-300 group-hover:text-amber-500 transition-colors"
      />
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
        setRecentProducts(all.products.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng ☀️"
      : hour < 18
        ? "Chào buổi chiều 🌤️"
        : "Chào buổi tối 🌙";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ── TOP HERO (Mobile) ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden relative overflow-hidden px-5 pt-12 pb-6 flex flex-col gap-5"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #F8FAFC 100%)",
        }}
      >
        {/* Greeting + Bell */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">{greeting}</p>
            <h1 className="text-slate-900 text-2xl font-black mt-1">
              {user?.email?.split("@")[0] ?? "Admin"}
            </h1>
          </div>
          <button className="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-500 active:scale-95 transition-all hover:shadow-md">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100">
            <Search size={17} className="text-slate-400 shrink-0" />
            <span className="text-slate-400 text-sm">
              Tìm sản phẩm, khách hàng…
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── DESKTOP HERO ── */}
      <div className="hidden lg:block px-8 py-6 max-w-[1920px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-100 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {greeting}, {user?.email?.split("@")[0] ?? "Admin"}! 👋
              </h1>
            </div>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30 hover:-translate-y-0.5 group"
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              Thêm sản phẩm mới
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── STATS CARDS (Mobile) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:hidden px-4 -mt-2"
      >
        <div className="grid grid-cols-2 gap-3">
          <MobileStatCard
            label="Tổng SP"
            value={loading ? "—" : stats.total}
            icon={Package}
            trend={{ value: 12, up: true }}
            href="/admin/products"
          />
          <MobileStatCard
            label="Đã xuất bản"
            value={loading ? "—" : stats.published}
            icon={Activity}
            href="/admin/products"
          />
        </div>
      </motion.div>

      {/* ── DESKTOP STATS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden lg:block px-8 max-w-[1920px] mx-auto mt-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Tổng sản phẩm"
            value={loading ? "…" : stats.total}
            sub="trong hệ thống"
            icon={Package}
            trend={{ value: 12, up: true }}
            href="/admin/products"
          />
          <StatCard
            label="Đã xuất bản"
            value={loading ? "…" : stats.published}
            sub="đang hiển thị"
            icon={Activity}
            trend={{ value: 8, up: true }}
            href="/admin/products"
          />
          <StatCard
            label="Bản nháp"
            value={loading ? "…" : stats.draft}
            sub="chưa sẵn sàng"
            icon={AlertCircle}
            href="/admin/products"
          />
          <StatCard
            label="Danh mục"
            value="—"
            sub="nhóm phân loại"
            icon={FolderTree}
            href="/admin/categories"
          />
        </div>
      </motion.div>

      {/* ── QUICK ACTIONS (Mobile) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:hidden px-4 pt-6 pb-32"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Thao tác nhanh
        </p>

        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, bg, color }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              {/* Icon tile */}
              <div
                className={`w-full aspect-square rounded-2xl flex items-center justify-center shadow-sm ${bg}`}
              >
                <Icon size={24} strokeWidth={1.8} className={color} />
              </div>
              {/* Label */}
              <span className="text-[11px] font-semibold text-slate-500 text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── DESKTOP QUICK ACTIONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block px-8 max-w-[1920px] mx-auto mt-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity size={20} className="text-amber-600" /> Sản phẩm gần
                đây
              </h2>
              <Link
                href="/admin/products"
                className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
              </div>
            ) : recentProducts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center font-medium py-8">
                Chưa có sản phẩm nào
              </p>
            ) : (
              <div className="space-y-2">
                {recentProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-amber-700 uppercase">
                        {p.sku?.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500">{p.sku}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.is_published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {p.is_published ? "LIVE" : "NHÁP"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Thao tác nhanh
              </h2>
              <div className="space-y-2">
                <QuickAction
                  href="/admin/products/new"
                  icon={Plus}
                  label="Thêm sản phẩm"
                  desc="Tạo sản phẩm mới"
                />
                <QuickAction
                  href="/admin/documents"
                  icon={FileText}
                  label="Quản lý chứng từ"
                  desc="CO/CQ, hợp đồng, biên bản"
                />
                <QuickAction
                  href="/warehouse"
                  icon={Warehouse}
                  label="Quản lý kho"
                  desc="Tồn kho & nhập xuất"
                />
                <QuickAction
                  href="/admin/leads"
                  icon={Users}
                  label="Xem leads"
                  desc="Khách hàng tiềm năng"
                />
                <QuickAction
                  href="/products"
                  icon={ShoppingBag}
                  label="Trang sản phẩm"
                  desc="Xem như khách hàng"
                />
              </div>
            </div>

            <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg bg-gradient-to-br from-amber-600 to-amber-800">
              <div className="relative z-10">
                <Star size={24} className="mb-3 text-amber-200" />
                <h3 className="text-lg font-black mb-1">Cần hỗ trợ?</h3>
                <p className="text-sm font-medium text-amber-100 mb-4 leading-relaxed">
                  Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ bạn vận hành hệ thống.
                </p>
                <a
                  href="tel:0901234567"
                  className="inline-flex items-center justify-center w-full py-3 bg-white text-amber-700 rounded-xl font-bold text-sm hover:bg-amber-50 transition-colors"
                >
                  Liên hệ Hotline
                </a>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
