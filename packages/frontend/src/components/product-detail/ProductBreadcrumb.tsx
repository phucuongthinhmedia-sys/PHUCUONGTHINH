import Link from "next/link";
import { ChevronRight, Pencil, ScanLine } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

interface ProductBreadcrumbProps {
  productId: string;
  productName: string;
  productSku: string;
  isAuthenticated: boolean;
  onScanClick: () => void;
}

export function ProductBreadcrumb({
  productId,
  productName,
  productSku,
  isAuthenticated,
  onScanClick,
}: ProductBreadcrumbProps) {
  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide sm:tracking-widest overflow-hidden w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
        <Link
          href="/"
          className="hover:text-[#0a192f] transition-colors whitespace-nowrap"
        >
          Trang chủ
        </Link>
        <ChevronRight
          size={12}
          className="hidden sm:inline sm:w-[14px] sm:h-[14px] shrink-0"
        />
        <Link
          href="/products"
          className="hover:text-[#0a192f] transition-colors whitespace-nowrap"
        >
          Sản phẩm
        </Link>
        <ChevronRight
          size={12}
          className="hidden sm:inline sm:w-[14px] sm:h-[14px] shrink-0"
        />
        <span className="text-emerald-600 truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs text-xs sm:text-sm">
          {productSku}
        </span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 sm:ml-auto shrink-0">
        <ShareButton
          url={`/p/${productSku}`}
          title={productName}
          text={`Xem sản phẩm ${productName} (SKU: ${productSku})`}
          className="normal-case tracking-normal text-[10px] sm:text-xs"
        />
        {isAuthenticated && (
          <>
            <button
              onClick={onScanClick}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-emerald-700 transition-colors normal-case tracking-normal whitespace-nowrap"
              title="Quét QR sản phẩm khác"
            >
              <ScanLine size={10} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Quét QR</span>
            </button>
            <Link
              href={`/admin/products/${productId}`}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0a192f] text-white rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-[#0d2137] transition-colors normal-case tracking-normal whitespace-nowrap"
            >
              <Pencil size={10} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Chỉnh sửa</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
