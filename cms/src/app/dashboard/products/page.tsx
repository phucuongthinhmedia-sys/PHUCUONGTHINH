"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { productService, Product } from "@/lib/product-service";
import { useProductEvents } from "@/hooks/useProductEvents";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const limit = 10;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await productService.getProducts(page, limit, search);
      setProducts(response.products);
      setTotal(response.pagination.total);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Không thể tải danh sách sản phẩm";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Real-time: reload list whenever backend emits a product event
  useProductEvents(loadProducts);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể xóa sản phẩm");
    }
  };

  const handleClone = async (id: string) => {
    try {
      const cloned = await productService.cloneProduct(id);
      setProducts((prev) => [cloned, ...prev]);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Không thể nhân bản sản phẩm",
      );
    }
  };

  const handlePublish = async (id: string, isPublished: boolean) => {
    try {
      const updated = isPublished
        ? await productService.unpublishProduct(id)
        : await productService.publishProduct(id);

      setProducts(products.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Không thể cập nhật sản phẩm",
      );
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
        <Link
          href="/dashboard/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thêm sản phẩm
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy sản phẩm
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() =>
                          handlePublish(product.id, product.is_published)
                        }
                        className={`px-3 py-1 rounded text-white text-xs font-medium ${
                          product.is_published
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                      >
                        {product.is_published ? "Đã đăng" : "Nháp"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleClone(product.id)}
                        className="text-gray-500 hover:text-gray-700 ml-2"
                      >
                        Nhân bản
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Hiển thị {(page - 1) * limit + 1} đến{" "}
              {Math.min(page * limit, total)} trong {total} sản phẩm
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
