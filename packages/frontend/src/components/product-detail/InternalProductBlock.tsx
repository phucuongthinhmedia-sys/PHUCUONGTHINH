"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/admin-api-client";
import { Lock } from "lucide-react";

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
      <div className="bg-[#F2F2F7] rounded-[16px] px-4 py-3 text-[13px] font-medium text-[#8E8E93] text-center border border-[#E5E5EA]">
        Chưa có thông tin nội bộ — thêm từ trang chỉnh sửa.
      </div>
    );

  const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v) + "đ";
  const stockLabels: Record<string, { label: string; cls: string }> = {
    in_stock: { label: "Còn hàng", cls: "text-[#34C759] bg-[#34C759]/10" },
    low_stock: { label: "Sắp hết", cls: "text-[#FF9500] bg-[#FF9500]/10" },
    out_of_stock: { label: "Hết hàng", cls: "text-[#FF3B30] bg-[#FF3B30]/10" },
    pre_order: { label: "Đặt trước", cls: "text-[#007AFF] bg-[#007AFF]/10" },
    discontinued: {
      label: "Ngừng kinh doanh",
      cls: "text-[#8E8E93] bg-[#E5E5EA]",
    },
  };
  const stock = data.stock_status ? stockLabels[data.stock_status] : null;

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E5EA] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden font-sans">
      <div className="px-5 py-3.5 border-b border-[#E5E5EA] bg-[#F9F9F9] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#007AFF]">
          <Lock size={16} strokeWidth={2.5} />
          <span className="text-[14px] font-bold uppercase tracking-wider">
            Thông tin nội bộ
          </span>
        </div>
        {stock && (
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${stock.cls}`}
          >
            {stock.label}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        {/* Giá bán */}
        {(data.price_retail != null ||
          data.price_wholesale != null ||
          data.price_dealer != null ||
          data.price_promo != null) && (
          <div className="p-4 border-b border-[#E5E5EA]">
            <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">
              Giá bán
            </p>
            <div className="grid grid-cols-2 gap-4">
              {data.price_retail != null && (
                <div>
                  <p className="text-[13px] text-[#8E8E93] mb-0.5">
                    Giá bán lẻ
                  </p>
                  <p className="font-bold text-[15px] text-black">
                    {fmt(data.price_retail)}
                  </p>
                </div>
              )}
              {data.price_dealer != null && (
                <div>
                  <p className="text-[13px] text-[#8E8E93] mb-0.5">
                    Giá đại lý
                  </p>
                  <p className="font-bold text-[15px] text-black">
                    {fmt(data.price_dealer)}
                  </p>
                </div>
              )}
              {data.price_wholesale != null && (
                <div>
                  <p className="text-[13px] text-[#8E8E93] mb-0.5">
                    Giá bán sỉ
                  </p>
                  <p className="font-bold text-[15px] text-black">
                    {fmt(data.price_wholesale)}
                  </p>
                </div>
              )}
              {data.price_promo != null && (
                <div>
                  <p className="text-[13px] text-[#8E8E93] mb-0.5">
                    Khuyến mãi
                  </p>
                  <p className="font-bold text-[15px] text-[#FF3B30]">
                    {fmt(data.price_promo)}
                  </p>
                </div>
              )}
            </div>
            {data.wholesale_discount_tiers && (
              <div className="mt-3 pt-3 border-t border-[#F2F2F7]">
                <p className="text-[13px] text-[#8E8E93] mb-0.5">
                  Khung chiết khấu
                </p>
                <p className="text-[13px] text-black font-medium">
                  {data.wholesale_discount_tiers}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Khuyến mãi */}
        {(data.promo_start_date || data.promo_end_date || data.promo_note) && (
          <div className="p-4 border-b border-[#E5E5EA]">
            <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2">
              Khuyến mãi
            </p>
            <div className="text-[13px] space-y-1">
              {(data.promo_start_date || data.promo_end_date) && (
                <p className="text-black font-medium">
                  <span className="text-[#8E8E93] font-normal">
                    Thời gian:{" "}
                  </span>
                  {data.promo_start_date || "..."} →{" "}
                  {data.promo_end_date || "..."}
                </p>
              )}
              {data.promo_note && (
                <p className="text-black font-medium">
                  <span className="text-[#8E8E93] font-normal">Ghi chú: </span>
                  {data.promo_note}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Nhà cung cấp & Kho */}
        <div className="p-4 border-b border-[#E5E5EA] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(data.supplier_name || data.supplier_phone) && (
            <div>
              <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2">
                Nhà cung cấp
              </p>
              {data.supplier_name && (
                <p className="text-[13px] text-black font-medium">
                  {data.supplier_name}
                </p>
              )}
              {data.supplier_phone && (
                <p className="text-[13px] text-[#007AFF] font-medium">
                  {data.supplier_phone}
                </p>
              )}
            </div>
          )}
          {(data.warehouse_location || data.stock_quantity != null) && (
            <div>
              <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2">
                Kho hàng
              </p>
              {data.warehouse_location && (
                <p className="text-[13px] text-black font-medium">
                  <span className="text-[#8E8E93] font-normal">Vị trí: </span>
                  {data.warehouse_location}
                </p>
              )}
              {data.stock_quantity != null && (
                <p className="text-[13px] text-black font-medium">
                  <span className="text-[#8E8E93] font-normal">Số lượng: </span>
                  {data.stock_quantity}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Ghi chú */}
        {data.internal_notes && (
          <div className="p-4">
            <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
              Ghi chú nội bộ
            </p>
            <p className="text-[14px] text-black font-medium bg-[#F2F2F7] p-3 rounded-[12px]">
              {data.internal_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
