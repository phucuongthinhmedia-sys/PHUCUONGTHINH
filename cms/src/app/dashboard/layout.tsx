"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white">
          <div className="p-6">
            <h1 className="text-2xl font-bold">CMS</h1>
          </div>

          <nav className="mt-6">
            <Link
              href="/dashboard"
              className="block px-6 py-3 hover:bg-gray-800 transition"
            >
              Tổng quan
            </Link>
            <Link
              href="/dashboard/products"
              className="block px-6 py-3 hover:bg-gray-800 transition"
            >
              Sản phẩm
            </Link>
            <Link
              href="/dashboard/import"
              className="block px-6 py-3 hover:bg-gray-800 transition bg-blue-600 hover:bg-blue-700"
            >
              📥 Import Catalogue
            </Link>
            <Link
              href="/dashboard/categories"
              className="block px-6 py-3 hover:bg-gray-800 transition"
            >
              Danh mục
            </Link>
            <Link
              href="/dashboard/tags"
              className="block px-6 py-3 hover:bg-gray-800 transition"
            >
              Tags
            </Link>
            <Link
              href="/dashboard/media"
              className="block px-6 py-3 hover:bg-gray-800 transition"
            >
              Media
            </Link>
            <Link
              href="/dashboard/leads"
              className="block px-6 py-3 hover:bg-gray-800 transition"
            >
              Khách hàng
            </Link>
          </nav>

          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
            <div className="text-sm text-gray-400 mb-4">
              {user?.email || "Admin"}
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
