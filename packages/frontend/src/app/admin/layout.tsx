"use client";

import { useAuth, useRequireAuth, AuthProvider } from "@repo/shared-utils";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function AdminSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">CMS Admin</h1>
      </div>
      <nav className="flex-1 mt-4 overflow-y-auto">
        <Link
          href="/admin/dashboard"
          className="block px-6 py-3 hover:bg-gray-800 transition text-sm"
        >
          📊 Tổng quan
        </Link>
        <Link
          href="/admin/products"
          className="block px-6 py-3 hover:bg-gray-800 transition text-sm"
        >
          📦 Sản phẩm
        </Link>
        <Link
          href="/admin/import"
          className="block px-6 py-3 bg-blue-700 hover:bg-blue-600 transition text-sm"
        >
          📥 Import Catalogue
        </Link>
        <Link
          href="/admin/categories"
          className="block px-6 py-3 hover:bg-gray-800 transition text-sm"
        >
          🗂️ Danh mục
        </Link>
        <Link
          href="/admin/tags"
          className="block px-6 py-3 hover:bg-gray-800 transition text-sm"
        >
          🏷️ Tags
        </Link>
        <Link
          href="/admin/media"
          className="block px-6 py-3 hover:bg-gray-800 transition text-sm"
        >
          🖼️ Media
        </Link>
        <Link
          href="/admin/leads"
          className="block px-6 py-3 hover:bg-gray-800 transition text-sm"
        >
          👥 Khách hàng
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 mb-3 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useRequireAuth(
    (path) => router.replace(path),
    "/admin/login",
  );

  // Login page: no guard, no sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminGuard>{children}</AdminGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}
