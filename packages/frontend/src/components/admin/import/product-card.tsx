import { ExtractedProduct } from "@/lib/import-service";

interface ProductCardProps {
  product: ExtractedProduct;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function ProductCard({
  product,
  selected,
  onSelect,
  onEdit,
}: ProductCardProps) {
  const statusColors = {
    valid: "border-green-500 bg-green-50",
    warning: "border-yellow-500 bg-yellow-50",
    error: "border-red-500 bg-red-50",
  };

  const statusIcons = {
    valid: "✓",
    warning: "⚠",
    error: "✕",
  };

  const statusTextColors = {
    valid: "text-green-700",
    warning: "text-yellow-700",
    error: "text-red-700",
  };

  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className={`relative border-2 rounded-lg p-4 transition-all ${
        selected ? "ring-2 ring-blue-500" : ""
      } ${statusColors[product.validation_status]}`}
    >
      <div className="absolute top-3 left-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
        />
      </div>

      <div className="absolute top-3 right-3">
        <span
          className={`text-lg ${statusTextColors[product.validation_status]}`}
        >
          {statusIcons[product.validation_status]}
        </span>
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600">
          <span className="font-medium">SKU:</span>{" "}
          {product.sku || <span className="text-gray-400 italic">Chưa có</span>}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Danh mục:</span>{" "}
          {product.category || (
            <span className="text-gray-400 italic">Chưa xác định</span>
          )}
        </p>

        <div className="text-sm">
          <p className="text-gray-900 font-medium">
            {formatPrice(product.price_retail)}
            {product.unit && (
              <span className="text-gray-500 font-normal">/{product.unit}</span>
            )}
          </p>
          {product.price_dealer && (
            <p className="text-gray-600 text-xs">
              Đại lý: {formatPrice(product.price_dealer)}
            </p>
          )}
        </div>

        {product.validation_errors.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-1">Vấn đề:</p>
            <ul className="text-xs text-gray-600 space-y-0.5">
              {product.validation_errors.slice(0, 2).map((err, i) => (
                <li key={i}>• {err}</li>
              ))}
              {product.validation_errors.length > 2 && (
                <li className="text-gray-500 italic">
                  ... và {product.validation_errors.length - 2} vấn đề khác
                </li>
              )}
            </ul>
          </div>
        )}

        <button
          onClick={onEdit}
          className="w-full mt-3 px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Chỉnh sửa
        </button>

        {product.user_edited && (
          <div className="text-xs text-blue-600 text-center">
            ✏️ Đã chỉnh sửa
          </div>
        )}
      </div>
    </div>
  );
}
