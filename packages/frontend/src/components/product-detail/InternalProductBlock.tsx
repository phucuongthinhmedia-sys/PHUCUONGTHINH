"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/admin-api-client";

interface InternalProductBlockProps {
  productId: string;
}

export function InternalProductBlock({ productId }: InternalProductBlockProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<any>(`/products/${productId}/internal?_t=${Date.now()}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return null;
  if (!data)
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
        Chưa có thông tin nội bộ — thêm từ trang chỉnh sửa sản phẩm.
      </div>
    );

  const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v) + "đ";
  const stockLabels: Record<string, { label: string; cls: string }> = {
    in_stock: {
      label: "Còn hàng",
      cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    low_stock: {
      label: "Sắp hết",
      cls: "text-amber-700 bg-amber-50 border-amber-200",
    },
    out_of_stock: {
      label: "Hết hàng",
      cls: "text-red-700 bg-red-50 border-red-200",
    },
    pre_order: {
      label: "Đặt trước",
      cls: "text-blue-700 bg-blue-50 border-blue-200",
    },
    discontinued: {
      label: "Ngừng kinh doanh",
      cls: "text-gray-700 bg-gray-50 border-gray-200",
    },
  };
  const stock = data.stock_status ? stockLabels[data.stock_status] : null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-amber-200 bg-amber-100/60 flex items-center justify-between">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
          🔒 Thông tin nội bộ
        </span>
        {stock && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stock.cls}`}
          >
            {stock.label}
          </span>
        )}
      </div>
      <div className="px-4 py-3 space-y-4">
        {/* Giá bán */}
        {(data.price_retail != null ||
          data.price_wholesale != null ||
          data.price_dealer != null ||
          data.price_promo != null) && (
          <div>
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">
              Giá bán
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {data.price_retail != null && (
                <div className="text-xs">
                  <p className="text-amber-600 mb-0.5">Giá bán lẻ</p>
                  <p className="font-bold text-amber-900">
                    {fmt(data.price_retail)}
                  </p>
                </div>
              )}
              {data.price_dealer != null && (
                <div className="text-xs">
                  <p className="text-amber-600 mb-0.5">Giá đại lý</p>
                  <p className="font-bold text-amber-900">
                    {fmt(data.price_dealer)}
                  </p>
                </div>
              )}
              {data.price_wholesale != null && (
                <div className="text-xs">
                  <p className="text-amber-600 mb-0.5">Giá bán sỉ</p>
                  <p className="font-bold text-amber-900">
                    {fmt(data.price_wholesale)}
                  </p>
                </div>
              )}
              {data.price_promo != null && (
                <div className="text-xs">
                  <p className="text-amber-600 mb-0.5">Giá khuyến mãi</p>
                  <p className="font-bold text-red-700">
                    {fmt(data.price_promo)}
                  </p>
                </div>
              )}
            </div>
            {data.wholesale_discount_tiers && (
              <div className="text-xs mt-2 pt-2 border-t border-amber-200">
                <p className="text-amber-600 mb-0.5">Khung chiết khấu</p>
                <p className="text-amber-900 text-[11px] leading-relaxed">
                  {data.wholesale_discount_tiers}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Khuyến mãi */}
        {(data.promo_start_date || data.promo_end_date || data.promo_note) && (
          <div className="pt-3 border-t border-amber-200">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">
              Khuyến mãi
            </p>
            <div className="text-xs space-y-1">
              {(data.promo_start_date || data.promo_end_date) && (
                <p className="text-amber-900">
                  <span className="text-amber-600">Thời gian: </span>
                  {data.promo_start_date || "..."} →{" "}
                  {data.promo_end_date || "..."}
                </p>
              )}
              {data.promo_note && (
                <p className="text-amber-900">
                  <span className="text-amber-600">Ghi chú: </span>
                  {data.promo_note}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Kho hàng */}
        {(data.warehouse_location ||
          data.stock_quantity != null ||
          data.stock_levels?.length > 0) && (
          <div className="pt-3 border-t border-amber-200">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">
              Kho hàng
            </p>
            <div className="text-xs space-y-1.5">
              {data.warehouse_location && (
                <p className="text-amber-900">
                  <span className="text-amber-600">Vị trí: </span>
                  {data.warehouse_location}
                </p>
              )}
              {data.stock_quantity != null && (
                <p className="text-amber-900">
                  <span className="text-amber-600">Số lượng: </span>
                  <span className="font-bold">{data.stock_quantity}</span>
                </p>
              )}
              {data.stock_levels?.length > 0 && (
                <div>
                  <p className="text-amber-600 mb-1">Tồn kho chi tiết:</p>
                  {data.stock_levels.map((sl: any) => (
                    <div
                      key={sl.id}
                      className="flex justify-between text-[11px] ml-2"
                    >
                      <span className="text-amber-700">
                        {sl.warehouse?.name}
                        {sl.warehouse?.location
                          ? ` — ${sl.warehouse.location}`
                          : ""}
                      </span>
                      <span
                        className={`font-bold ${sl.quantity > 0 ? "text-emerald-700" : "text-red-600"}`}
                      >
                        {sl.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nhà cung cấp */}
        {(data.supplier_name || data.supplier_phone) && (
          <div className="pt-3 border-t border-amber-200">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">
              Nhà cung cấp
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              {data.supplier_name && (
                <div>
                  <p className="text-amber-600 mb-0.5">Tên</p>
                  <p className="font-semibold text-amber-900">
                    {data.supplier_name}
                  </p>
                </div>
              )}
              {data.supplier_phone && (
                <div>
                  <p className="text-amber-600 mb-0.5">Số điện thoại</p>
                  <p className="font-semibold text-amber-900">
                    {data.supplier_phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ghi chú */}
        {data.internal_notes && (
          <div className="pt-3 border-t border-amber-200">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
              Ghi chú nội bộ
            </p>
            <p className="text-xs text-amber-900 leading-relaxed">
              {data.internal_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
