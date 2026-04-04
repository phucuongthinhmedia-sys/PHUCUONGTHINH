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
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Icon: CheckCircle2,
    },
    pre_order: {
      label: "Đặt trước (Order)",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      Icon: Clock,
    },
    coming_soon: {
      label: "Hàng sắp về",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      Icon: AlertCircle,
    },
    out_of_stock: {
      label: "Tạm hết",
      cls: "bg-red-50 text-red-700 border-red-200",
      Icon: X,
    },
  };
  const { label, cls, Icon } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${cls}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}
