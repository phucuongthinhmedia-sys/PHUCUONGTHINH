import { CheckCircle2, Clock, AlertCircle, X } from "lucide-react";

type StockStatus = "in_stock" | "pre_order" | "coming_soon" | "out_of_stock";

interface StockBadgeProps {
  status: StockStatus;
}

export function StockBadge({ status }: StockBadgeProps) {
  const map: Record<
    StockStatus,
    { label: string; cls: string; Icon: React.ElementType }
  > = {
    in_stock: {
      label: "Sẵn hàng",
      cls: "bg-[#34C759]/10 text-[#34C759]",
      Icon: CheckCircle2,
    },
    pre_order: {
      label: "Đặt trước",
      cls: "bg-[#FF9500]/10 text-[#FF9500]",
      Icon: Clock,
    },
    coming_soon: {
      label: "Sắp về",
      cls: "bg-[#007AFF]/10 text-[#007AFF]",
      Icon: AlertCircle,
    },
    out_of_stock: {
      label: "Tạm hết",
      cls: "bg-[#FF3B30]/10 text-[#FF3B30]",
      Icon: X,
    },
  };
  const { label, cls, Icon } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-[12px] font-bold uppercase tracking-wider ${cls}`}
    >
      <Icon size={14} strokeWidth={2.5} />
      {label}
    </span>
  );
}
