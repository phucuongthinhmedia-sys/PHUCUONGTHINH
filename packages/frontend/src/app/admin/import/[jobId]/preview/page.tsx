"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { importService, ExtractedProduct } from "@/lib/import-service";
import { ProductCard } from "@/components/admin/import/product-card";
import { EditProductModal } from "@/components/admin/import/edit-product-modal";

export default function AdminImportPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<ExtractedProduct | null>(
    null,
  );
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const {
    data: rawProducts,
    isLoading,
    refetch,
  } = useQuery<ExtractedProduct[]>({
    queryKey: ["extracted-products", jobId],
    queryFn: () => importService.getExtractedProducts(jobId),
  });

  const products: ExtractedProduct[] = rawProducts ?? [];

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkImport = async () => {
    if (selectedIds.size === 0) return;
    setIsImporting(true);
    try {
      const result = await importService.bulkCreate(
        jobId,
        Array.from(selectedIds),
      );
      setImportResult(result);
      if (result.failed.length === 0) {
        setTimeout(() => router.push("/admin/products"), 2000);
      } else {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          result.success.forEach((id: string) => next.delete(id));
          return next;
        });
        refetch();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Import thất bại");
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveEdit = async (updated: ExtractedProduct) => {
    try {
      await importService.updateExtractedProduct(updated.id, updated);
      setEditingProduct(null);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  const validCount = products.filter(
    (p) => p.validation_status === "valid",
  ).length;
  const warningCount = products.filter(
    (p) => p.validation_status === "warning",
  ).length;
  const errorCount = products.filter(
    (p) => p.validation_status === "error",
  ).length;

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/import"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Quay lại Import
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Preview: {products.length} sản phẩm
            </h1>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-600">✓ {validCount} hợp lệ</span>
              <span className="text-yellow-600">⚠ {warningCount} cảnh báo</span>
              <span className="text-red-600">✕ {errorCount} lỗi</span>
            </div>
          </div>
          <button
            onClick={handleBulkImport}
            disabled={selectedIds.size === 0 || isImporting}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isImporting && (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {isImporting
              ? "Đang import..."
              : `Import ${selectedIds.size} sản phẩm`}
          </button>
        </div>
      </div>

      {importResult && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-medium text-blue-900 mb-2">Kết quả import:</p>
          <p className="text-sm text-blue-800">
            ✓ {importResult.success.length} thành công
          </p>
          {importResult.failed.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-red-600">
                ✕ {importResult.failed.length} thất bại:
              </p>
              <ul className="text-xs text-red-600 mt-1 space-y-1">
                {importResult.failed.slice(0, 5).map((f: any) => (
                  <li key={f.id}>• {f.error}</li>
                ))}
                {importResult.failed.length > 5 && (
                  <li>... và {importResult.failed.length - 5} lỗi khác</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedIds.size === products.length && products.length > 0}
          onChange={() =>
            setSelectedIds(
              selectedIds.size === products.length
                ? new Set()
                : new Set(products.map((p) => p.id)),
            )
          }
          className="rounded border-gray-300 text-blue-600"
        />
        <label className="text-sm text-gray-700">
          Chọn tất cả ({selectedIds.size}/{products.length})
        </label>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={selectedIds.has(product.id)}
              onSelect={() => toggleSelect(product.id)}
              onEdit={() => setEditingProduct(product)}
            />
          ))}
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveEdit}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
