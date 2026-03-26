"use client";

import { useState, useCallback } from "react";
import { formatVND, parseVND } from "@/lib/price-utils";

export interface InternalInfoData {
  cost_price?: number;
  supplier_name?: string;
  supplier_contact?: string;
  internal_notes?: string;
}

interface InternalInfoSectionProps {
  value: InternalInfoData;
  onChange: (data: InternalInfoData) => void;
}

export function InternalInfoSection({
  value,
  onChange,
}: InternalInfoSectionProps) {
  const [costDisplay, setCostDisplay] = useState(
    value.cost_price != null ? formatVND(value.cost_price) : "",
  );

  const handleCostChange = useCallback(
    (raw: string) => {
      setCostDisplay(raw);
      onChange({
        ...value,
        cost_price: raw.trim() === "" ? undefined : parseVND(raw),
      });
    },
    [value, onChange],
  );

  const handleCostBlur = useCallback(() => {
    if (value.cost_price != null) setCostDisplay(formatVND(value.cost_price));
  }, [value.cost_price]);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <p className="text-xs text-amber-800">
          🔒 Thông tin này chỉ hiển thị cho admin đã đăng nhập
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giá vốn (VNĐ)
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={costDisplay}
            onChange={(e) => handleCostChange(e.target.value)}
            onBlur={handleCostBlur}
            placeholder="VD: 800.000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            VNĐ
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nhà cung cấp
        </label>
        <input
          type="text"
          value={value.supplier_name ?? ""}
          onChange={(e) =>
            onChange({ ...value, supplier_name: e.target.value })
          }
          placeholder="Tên nhà cung cấp"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Liên hệ NCC
        </label>
        <input
          type="text"
          value={value.supplier_contact ?? ""}
          onChange={(e) =>
            onChange({ ...value, supplier_contact: e.target.value })
          }
          placeholder="SĐT hoặc email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú nội bộ
        </label>
        <textarea
          value={value.internal_notes ?? ""}
          onChange={(e) =>
            onChange({ ...value, internal_notes: e.target.value })
          }
          rows={3}
          placeholder="Ghi chú nội bộ về sản phẩm..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        />
      </div>
    </div>
  );
}
