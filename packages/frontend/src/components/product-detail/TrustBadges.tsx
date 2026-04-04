import { CheckCircle2, Truck, FileCheck, MapPin } from "lucide-react";

const TRUST_BADGES = [
  { icon: CheckCircle2, label: "Hàng chính hãng" },
  { icon: Truck, label: "Giao toàn quốc" },
  { icon: FileCheck, label: "CO / CQ đầy đủ" },
  { icon: MapPin, label: "Sẵn kho TP.HCM" },
];

export function TrustBadges() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
      <h3 className="text-xs sm:text-sm font-bold text-[#0a192f] mb-2 sm:mb-3 uppercase tracking-wider">
        Dịch vụ & Cam kết
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {TRUST_BADGES.map(({ icon: Icon, label }, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-1.5 sm:gap-2 text-center p-2 sm:p-0"
          >
            <Icon size={20} className="text-emerald-600 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
