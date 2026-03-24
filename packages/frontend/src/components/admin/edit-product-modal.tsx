"use client";

import { useState, useEffect } from "react";
import { ExtractedProduct } from "@/lib/import-service";

interface EditProductModalProps {
  product: ExtractedProduct;
  onSave: (updated: ExtractedProduct) => void;
  onClose: () => void;
}

const formatNum = (v: number) => (v ? v.toLocaleString("vi-VN") : "");
const parseNum = (v: string) => parseInt(v.replace(/\D/g, "")) || 0;

export function EditProductModal({
  product,
  onSave,
  onClose,
}: EditProductModalProps) {
  const [form, setForm] = useState({
    name: product.name,
    sku: product.sku || "",
    description: product.description || "",
    category: product.category || "",
    price_retail: product.price_retail || 0,
    price_dealer: product.price_dealer || 0,
    unit: product.unit || "M2",
    technical_specs: product.technical_specs,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ ...product, ...form });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Chỉnh sửa sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá bán lẻ (VNĐ)
              </label>
              <input
                type="text"
                value={formatNum(form.price_retail)}
                onChange={(e) =>
                  setForm({ ...form, price_retail: parseNum(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá đại lý (VNĐ)
              </label>
              <input
                type="text"
                value={formatNum(form.price_dealer)}
                onChange={(e) =>
                  setForm({ ...form, price_dealer: parseNum(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn vị tính
            </label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="M2">m²</option>
              <option value="VIEN">viên</option>
              <option value="BO">bộ</option>
              <option value="CAI">cái</option>
              <option value="SET">set</option>
            </select>
          </div>
          {Object.keys(form.technical_specs).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thông số kỹ thuật
              </label>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                {Object.entries(form.technical_specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-600">{k}:</span>
                    <span className="text-gray-900 font-medium">
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
