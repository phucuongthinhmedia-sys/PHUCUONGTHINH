"use client";

import { useState } from "react";
import { Truck, RefreshCw, Award, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PolicyItem {
  icon: React.ElementType;
  title: string;
  summary: string;
  detail: string;
}

const POLICIES: PolicyItem[] = [
  {
    icon: Truck,
    title: "Chính sách vận chuyển",
    summary: "Giao toàn quốc — Miễn phí nội thành TP.HCM cho đơn từ 5m²",
    detail: `• Nội thành TP.HCM: Miễn phí vận chuyển cho đơn hàng từ 5m² trở lên. Đơn nhỏ hơn: 50.000đ/chuyến.
• Tỉnh thành khác: Tính theo cước xe tải thực tế (liên hệ để báo giá chính xác theo địa chỉ).
• Gạch lớn (60x120, 80x80 trở lên): Hỗ trợ dịch vụ cẩu hàng lên tầng cao theo yêu cầu (phụ phí).
• Thời gian giao hàng: 1–3 ngày nội thành, 3–7 ngày tỉnh thành.
• Hàng được đóng gói pallet, bọc màng co chắc chắn trước khi xuất kho.`,
  },
  {
    icon: RefreshCw,
    title: "Chính sách đổi trả",
    summary:
      "Đổi trả trong 7 ngày — Hỗ trợ xử lý gạch dư và gạch vỡ do vận chuyển",
    detail: `• Gạch vỡ do vận chuyển: Chụp ảnh và báo trong vòng 24h sau khi nhận hàng — chúng tôi đổi miễn phí.
• Gạch dư sau thi công: Nhận lại tối đa 2 thùng nguyên vẹn trong vòng 7 ngày (trừ phí vận chuyển chiều về).
• Điều kiện đổi trả: Gạch còn nguyên thùng, chưa thi công, không bị trầy xước.
• Sai màu/sai mã so với đơn hàng: Đổi toàn bộ lô miễn phí, chúng tôi chịu phí vận chuyển 2 chiều.
• Không áp dụng đổi trả với hàng đặt theo yêu cầu (hàng order riêng).`,
  },
  {
    icon: Award,
    title: "Chứng chỉ & Chất lượng",
    summary: "Hàng có CO/CQ đầy đủ — Đạt tiêu chuẩn ISO và kiểm định độc lập",
    detail: `• Chứng nhận xuất xứ (CO) và chứng nhận chất lượng (CQ) đi kèm theo từng lô hàng.
• Tiêu chuẩn ISO 13006 (tiêu chuẩn quốc tế cho gạch ceramic và porcelain).
• Độ hút nước: ≤ 0.5% (Porcelain) — đạt chuẩn khu vực ẩm ướt.
• Độ mài mòn bề mặt: PEI Class III–V tùy dòng sản phẩm.
• Độ chống trơn trượt: R9–R11 tùy bề mặt (matte/anti-slip).
• Kiểm định bởi bên thứ ba độc lập. Tải file CO/CQ tại mục tài liệu phía trên.`,
  },
];

function PolicyAccordion({ policy }: { policy: PolicyItem }) {
  const [open, setOpen] = useState(false);
  const Icon = policy.icon;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <Icon size={20} className="text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-primary text-sm">{policy.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {policy.summary}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                {policy.detail}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ShippingPolicies() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-primary mb-5">
        Chính sách & Cam kết
      </h2>
      <div className="flex flex-col gap-3">
        {POLICIES.map((p) => (
          <PolicyAccordion key={p.title} policy={p} />
        ))}
      </div>
    </section>
  );
}
