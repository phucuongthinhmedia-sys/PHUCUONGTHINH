"use client";

import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tổng quan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Sản phẩm</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Danh mục</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Khách hàng</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">
            Tài nguyên media
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Chào mừng</h2>
        <p className="text-gray-600">
          Chào mừng đến với Digital Showroom CMS, {user?.email}. Sử dụng menu
          điều hướng để quản lý nội dung.
        </p>
      </div>
    </div>
  );
}
