"use client";

import { useState, useEffect } from "react";
import { ExtractedProduct } from "@/lib/import-service";

interface EditProductModalProps {
  product: ExtractedProduct;
  onSave: (updated: ExtractedProduct) => void;
  onClose: () => void;
}

export function EditProductModal({
  product,
  onSave,
  onClose,
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        ...product,
        ...formData,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatNumber = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ""));
    return isNaN(num) ? "" : num.toLocaleString("vi-VN");
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/\D/g, "")) || 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Chỉnh sửa sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: GCH-600-1200-001"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Mô tả ngắn về sản phẩm..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: gạch, thiết bị vệ sinh"
            />
          </div>

          {/* Price section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Retail price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá bán lẻ (VNĐ)
              </label>
              <input
                type="text"
                value={formatNumber(formData.price_retail.toString())}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_retail: parseNumber(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.500.000"
              />
            </div>

            {/* Dealer price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá đại lý (VNĐ)
              </label>
              <input
                type="text"
                value={formatNumber(formData.price_dealer.toString())}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_dealer: parseNumber(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.200.000"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn vị tính
            </label>
            <select
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="M2">m²</option>
              <option value="VIEN">viên</option>
              <option value="BO">bộ</option>
              <option value="CAI">cái</option>
              <option value="SET">set</option>
            </select>
          </div>

          {/* Technical specs preview */}
          {Object.keys(formData.technical_specs).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thông số kỹ thuật
              </label>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                {Object.entries(formData.technical_specs).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="text-gray-900 font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving && (
                <svg
                  className="w-4 h-4 animate-spin"
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
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
