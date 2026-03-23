"use client";

import { useState, useCallback } from "react";
import { formatVND, parseVND, validatePrices } from "@/lib/price-utils";

export type PriceUnit = "M2" | "VIEN" | "BO" | "CAI" | "SET";

export interface PriceData {
  price_retail?: number;
  price_dealer?: number;
  unit: PriceUnit;
  price_note?: string;
  price_promo?: number;
  promo_start?: string;
  promo_end?: string;
  m2_per_box?: number;
}

interface PriceSectionProps {
  value: PriceData;
  onChange: (data: PriceData) => void;
}

const UNIT_LABELS: Record<PriceUnit, string> = {
  M2: "m²",
  VIEN: "viên",
  BO: "bộ",
  CAI: "cái",
  SET: "set",
};

function fmtVND(v: number) {
  return new Intl.NumberFormat("vi-VN").format(v) + "đ";
}

export function PriceSection({ value, onChange }: PriceSectionProps) {
  const [retailDisplay, setRetailDisplay] = useState(
    value.price_retail != null ? formatVND(value.price_retail) : "",
  );
  const [dealerDisplay, setDealerDisplay] = useState(
    value.price_dealer != null ? formatVND(value.price_dealer) : "",
  );
  const [promoDisplay, setPromoDisplay] = useState(
    value.price_promo != null ? formatVND(value.price_promo) : "",
  );
  const [showPromo, setShowPromo] = useState(!!value.price_promo);

  const dealerError =
    value.price_retail != null &&
    value.price_dealer != null &&
    !validatePrices(value.price_retail, value.price_dealer)
      ? "Giá đại lý không được cao hơn giá bán lẻ"
      : null;

  const pricePerBox =
    value.price_retail && value.m2_per_box
      ? value.price_retail * value.m2_per_box
      : null;

  const handleRetailChange = useCallback(
    (raw: string) => {
      setRetailDisplay(raw);
      onChange({
        ...value,
        price_retail: raw.trim() === "" ? undefined : parseVND(raw),
      });
    },
    [value, onChange],
  );

  const handleRetailBlur = useCallback(() => {
    if (value.price_retail != null)
      setRetailDisplay(formatVND(value.price_retail));
  }, [value.price_retail]);

  const handleDealerChange = useCallback(
    (raw: string) => {
      setDealerDisplay(raw);
      onChange({
        ...value,
        price_dealer: raw.trim() === "" ? undefined : parseVND(raw),
      });
    },
    [value, onChange],
  );

  const handleDealerBlur = useCallback(() => {
    if (value.price_dealer != null)
      setDealerDisplay(formatVND(value.price_dealer));
  }, [value.price_dealer]);

  const handlePromoChange = useCallback(
    (raw: string) => {
      setPromoDisplay(raw);
      onChange({
        ...value,
        price_promo: raw.trim() === "" ? undefined : parseVND(raw),
      });
    },
    [value, onChange],
  );

  const handlePromoBlur = useCallback(() => {
    if (value.price_promo != null)
      setPromoDisplay(formatVND(value.price_promo));
  }, [value.price_promo]);

  return (
    <div className="space-y-4">
      {/* Giá bán lẻ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giá bán lẻ (VNĐ / m²) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={retailDisplay}
            onChange={(e) => handleRetailChange(e.target.value)}
            onBlur={handleRetailBlur}
            placeholder="VD: 1.500.000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            VNĐ
          </span>
        </div>
      </div>

      {/* Auto-calc giá thùng */}
      {pricePerBox !== null && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          <span className="text-sm text-green-700">
            💡 Giá 1 thùng ({value.m2_per_box} m²) ={" "}
            <span className="font-bold">{fmtVND(pricePerBox)}</span>
          </span>
          <span className="text-xs text-green-500 ml-auto">Tự động tính</span>
        </div>
      )}

      {/* Giá đại lý */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giá đại lý (VNĐ)
          <span className="ml-1 text-xs text-gray-400 font-normal">
            (tùy chọn)
          </span>
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={dealerDisplay}
            onChange={(e) => handleDealerChange(e.target.value)}
            onBlur={handleDealerBlur}
            placeholder="VD: 1.200.000"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${dealerError ? "border-red-400" : "border-gray-300"}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            VNĐ
          </span>
        </div>
        {dealerError && (
          <p className="mt-1 text-xs text-red-500">{dealerError}</p>
        )}
      </div>

      {/* Đơn vị tính */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Đơn vị tính
        </label>
        <select
          value={value.unit}
          onChange={(e) =>
            onChange({ ...value, unit: e.target.value as PriceUnit })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {(Object.entries(UNIT_LABELS) as [PriceUnit, string][]).map(
            ([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Giá khuyến mãi */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPromo((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
        >
          <span>🏷️ Giá khuyến mãi</span>
          <span className="text-gray-400 text-xs">
            {showPromo ? "▲ Thu gọn" : "▼ Mở rộng"}
          </span>
        </button>
        {showPromo && (
          <div className="px-4 py-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá KM (VNĐ)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={promoDisplay}
                  onChange={(e) => handlePromoChange(e.target.value)}
                  onBlur={handlePromoBlur}
                  placeholder="VD: 1.200.000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  VNĐ
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={value.promo_start ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      promo_start: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={value.promo_end ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      promo_end: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {value.promo_start && value.promo_end && (
              <p className="text-xs text-blue-600">
                ✓ KM từ {value.promo_start} đến {value.promo_end} — hết hạn tự
                về giá gốc
              </p>
            )}
          </div>
        )}
      </div>

      {/* Ghi chú giá */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú giá
          <span className="ml-1 text-xs text-gray-400 font-normal">
            (tùy chọn)
          </span>
        </label>
        <input
          type="text"
          value={value.price_note ?? ""}
          onChange={(e) => onChange({ ...value, price_note: e.target.value })}
          placeholder="VD: Giá chưa bao gồm VAT"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
