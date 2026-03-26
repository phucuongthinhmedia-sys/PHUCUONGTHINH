"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Warehouse,
  ClipboardList,
  Menu,
} from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/products", label: "Sản phẩm", icon: ShoppingBag },
  { href: "/warehouse", label: "Kho", icon: Warehouse },
  { href: "/catalogue", label: "Catalogue", icon: ClipboardList },
];

export function MobileBottomNav({ onMenuOpen }: { onMenuOpen: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#804000] border-t border-[#D2B48C]/20 safe-area-pb shadow-[0_-10px_40px_rgba(128,64,0,0.2)] rounded-t-3xl">
      <div className="flex items-stretch h-20 px-2 pb-2">
        {TABS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                active
                  ? "text-[#FDF5E6] -translate-y-1"
                  : "text-[#D2B48C]/60 hover:text-[#D2B48C]"
              }`}
            >
              <div
                className={`p-2.5 rounded-2xl transition-all ${active ? "bg-[#FDF5E6]/15 shadow-inner" : ""}`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span
                className={`text-[11px] font-bold leading-none tracking-wide ${active ? "text-[#FDF5E6]" : "text-transparent"}`}
              >
                {active ? label : "•"}
              </span>
            </Link>
          );
        })}

        <button
          onClick={onMenuOpen}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 text-[#D2B48C]/60 hover:text-[#D2B48C] active:scale-95 transition-all"
        >
          <div className="p-2.5 rounded-2xl">
            <Menu size={22} strokeWidth={2} />
          </div>
          <span className="text-[11px] font-bold leading-none text-transparent">
            •
          </span>
        </button>
      </div>
    </nav>
  );
}
