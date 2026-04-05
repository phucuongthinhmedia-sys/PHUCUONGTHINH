"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { productService, Product } from "@/lib/product-service";
import {
  ImageIcon,
  Eye,
  EyeOff,
  Plus,
  Search,
  Copy,
  Trash2,
  Pencil,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

// ── Thumbnail helper ──────────────────────────────────────────────────────────
function getCoverUrl(product: Product): string | null {
  const media = product.media;
  if (!media?.length) return null;
  return (media.find((m) => m.is_cover) ?? media[0])?.file_url ?? null;
}

function ProductAvatar({ url }: { url: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        loading="lazy"
        className="w-11 h-11 rounded-[10px] object-cover bg-[#F2F2F7] shrink-0 border border-black/5"
      />
    );
  }
  return (
    <div className="w-11 h-11 rounded-[10px] bg-[#F2F2F7] flex items-center justify-center shrink-0 border border-black/5">
      <ImageIcon size={18} className="text-[#8E8E93]" strokeWidth={1.5} />
    </div>
  );
}

// ── Bulk action bar (Kiểu Dynamic Island / Floating Menu) ────────────────────
function BulkActionBar({
  count,
  onPublish,
  onUnpublish,
  onDelete,
  onClear,
}: {
  count: number;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[20px] mb-6 animate-in slide-in-from-top-4 fade-in duration-200">
      <span className="text-[15px] font-semibold text-black flex-1 min-w-0">
        Đã chọn {count}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#34C759]/10 text-[#34C759] hover:bg-[#34C759]/20 rounded-[10px] text-[14px] font-semibold transition-colors active:scale-95"
        >
          <Eye size={16} strokeWidth={2} /> Đăng
        </button>
        <button
          onClick={onUnpublish}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8E8E93]/10 text-[#8E8E93] hover:bg-[#8E8E93]/20 rounded-[10px] text-[14px] font-semibold transition-colors active:scale-95"
        >
          <EyeOff size={16} strokeWidth={2} /> Ẩn
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3B30]/10 text-[#FF3B30] hover:bg-[#FF3B30]/20 rounded-[10px] text-[14px] font-semibold transition-colors active:scale-95"
        >
          <Trash2 size={16} strokeWidth={2} /> Xóa
        </button>
        <div className="w-[1px] h-6 bg-[#E5E5EA] mx-1" />
        <button
          onClick={onClear}
          className="p-1.5 text-[#8E8E93] hover:bg-[#E5E5EA] hover:text-black rounded-full transition-colors"
          title="Hủy chọn"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ── Desktop table (Kiểu macOS Finder / Mail) ──────────────────────────────────
function DesktopTable({
  products,
  selected,
  onToggleSelect,
  onToggleAll,
  onPublish,
  onClone,
  onDelete,
}: {
  products: Product[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onPublish: (id: string, current: boolean) => void;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const allSelected = products.length > 0 && selected.size === products.length;
  const someSelected = selected.size > 0 && selected.size < products.length;

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E5EA] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E5EA] bg-[#F9F9F9]">
            <th className="px-5 py-3 w-12 text-left">
              <button
                onClick={onToggleAll}
                className="text-[#C7C7CC] hover:text-[#007AFF] transition-colors focus:outline-none"
              >
                {allSelected ? (
                  <CheckCircle2
                    size={20}
                    className="text-[#007AFF]"
                    fill="#007AFF"
                    color="white"
                  />
                ) : someSelected ? (
                  <CheckCircle2
                    size={20}
                    className="text-[#007AFF]/50"
                    fill="currentColor"
                    color="white"
                  />
                ) : (
                  <Circle size={20} strokeWidth={1.5} />
                )}
              </button>
            </th>
            <th className="px-4 py-3 w-16 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Ảnh
            </th>
            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              SKU
            </th>
            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-5 py-3 text-right text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5EA]">
          {products.map((product) => {
            const isSelected = selected.has(product.id);
            return (
              <tr
                key={product.id}
                className={`transition-colors cursor-pointer group ${
                  isSelected ? "bg-[#007AFF]/[0.03]" : "hover:bg-[#F2F2F7]/60"
                }`}
                onClick={() => onToggleSelect(product.id)}
              >
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleSelect(product.id)}
                    className="text-[#C7C7CC] hover:text-[#007AFF] transition-colors focus:outline-none"
                  >
                    {isSelected ? (
                      <CheckCircle2
                        size={20}
                        className="text-[#007AFF]"
                        fill="#007AFF"
                        color="white"
                      />
                    ) : (
                      <Circle size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <ProductAvatar url={getCoverUrl(product)} />
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/p/${product.sku}`}
                    className="text-[15px] font-semibold text-black hover:text-[#007AFF] line-clamp-1 transition-colors"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[14px] text-[#8E8E93] font-mono">
                  {product.sku}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onPublish(product.id, product.is_published)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-transform active:scale-95 ${
                      product.is_published
                        ? "bg-[#34C759]/10 text-[#34C759] hover:bg-[#34C759]/20"
                        : "bg-[#8E8E93]/10 text-[#8E8E93] hover:bg-[#8E8E93]/20"
                    }`}
                  >
                    {product.is_published ? (
                      <>
                        <Eye size={14} strokeWidth={2} /> Đã đăng
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} strokeWidth={2} /> Nháp
                      </>
                    )}
                  </button>
                </td>
                <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 rounded-[10px] text-[#8E8E93] hover:text-[#007AFF] hover:bg-[#007AFF]/10 transition-colors"
                      title="Sửa"
                    >
                      <Pencil size={18} strokeWidth={1.5} />
                    </Link>
                    <button
                      onClick={() => onClone(product.id)}
                      className="p-2 rounded-[10px] text-[#8E8E93] hover:text-black hover:bg-[#E5E5EA] transition-colors"
                      title="Nhân bản"
                    >
                      <Copy size={18} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 rounded-[10px] text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Mobile Card List (Kiểu iOS Inset Grouped) ─────────────────────────────────
function MobileCardList({
  products,
  selected,
  onToggleSelect,
  onPublish,
  onClone,
  onDelete,
}: {
  products: Product[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onPublish: (id: string, current: boolean) => void;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] overflow-hidden">
      {products.map((product, index) => {
        const isSelected = selected.has(product.id);
        return (
          <div
            key={product.id}
            className={`p-4 flex flex-col gap-3 transition-colors ${
              isSelected ? "bg-[#007AFF]/[0.03]" : ""
            } ${index !== products.length - 1 ? "border-b border-[#E5E5EA]" : ""}`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => onToggleSelect(product.id)}
                className="mt-1 shrink-0 text-[#C7C7CC] hover:text-[#007AFF] transition-colors"
              >
                {isSelected ? (
                  <CheckCircle2
                    size={22}
                    className="text-[#007AFF]"
                    fill="#007AFF"
                    color="white"
                  />
                ) : (
                  <Circle size={22} strokeWidth={1.5} />
                )}
              </button>

              {/* Thumbnail */}
              <ProductAvatar url={getCoverUrl(product)} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/p/${product.sku}`}
                  className="text-[16px] font-semibold text-black leading-snug line-clamp-2 hover:text-[#007AFF]"
                >
                  {product.name}
                </Link>
                <p className="text-[13px] text-[#8E8E93] font-mono mt-0.5">
                  {product.sku}
                </p>
              </div>

              {/* Status badge */}
              <button
                onClick={() => onPublish(product.id, product.is_published)}
                className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold active:scale-95 transition-transform ${
                  product.is_published
                    ? "bg-[#34C759]/10 text-[#34C759]"
                    : "bg-[#8E8E93]/10 text-[#8E8E93]"
                }`}
              >
                {product.is_published ? (
                  <>
                    <Eye size={12} strokeWidth={2} /> Đăng
                  </>
                ) : (
                  <>
                    <EyeOff size={12} strokeWidth={2} /> Nháp
                  </>
                )}
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#F2F2F7]">
              <Link
                href={`/admin/products/${product.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] text-[14px] font-semibold text-[#007AFF] bg-[#007AFF]/10 active:bg-[#007AFF]/20 transition-colors"
              >
                <Pencil size={16} /> Sửa
              </Link>
              <button
                onClick={() => onClone(product.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] text-[14px] font-semibold text-black bg-[#E5E5EA] active:bg-[#C7C7CC] transition-colors"
              >
                <Copy size={16} /> Bản sao
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] text-[14px] font-semibold text-[#FF3B30] bg-[#FF3B30]/10 active:bg-[#FF3B30]/20 transition-colors"
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const limit = 20;

  // Stable reference to track if we're already loading
  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(
    async (bustCache = false) => {
      // Prevent concurrent loads
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);
      setError("");
      try {
        // Always add timestamp for admin to ensure fresh data
        const response = await productService.getProducts(
          page,
          limit,
          search,
          bustCache,
        );
        setProducts(response.products);
        setTotal(response.pagination.total);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể tải danh sách sản phẩm",
        );
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [page, search],
  );

  // Initial load and reload on page/search change
  useEffect(() => {
    loadProducts(true);
  }, [loadProducts]);

  useEffect(() => {
    setSelected(new Set());
  }, [page, search]);

  const handleToggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelected(
      selected.size === products.length
        ? new Set()
        : new Set(products.map((p) => p.id)),
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    // Optimistic update
    const deletedProduct = products.find((p) => p.id === id);
    setProducts((p) => p.filter((x) => x.id !== id));
    setTotal((t) => t - 1);

    try {
      await productService.deleteProduct(id);
      await loadProducts(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        await loadProducts(true);
        return;
      }
      if (deletedProduct) {
        setProducts((p) => [...p, deletedProduct]);
        setTotal((t) => t + 1);
      }
      setError(err.response?.data?.message || "Không thể xóa sản phẩm");
    }
  };

  const handleClone = async (id: string) => {
    try {
      const cloned = await productService.cloneProduct(id);
      setProducts((p) => [cloned, ...p]);
      setTotal((t) => t + 1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể nhân bản sản phẩm");
    }
  };

  const handlePublish = async (id: string, isPublished: boolean) => {
    try {
      // Optimistic update
      setProducts((p) =>
        p.map((x) => (x.id === id ? { ...x, is_published: !isPublished } : x)),
      );

      const updated = isPublished
        ? await productService.unpublishProduct(id)
        : await productService.publishProduct(id);

      setProducts((p) => p.map((x) => (x.id === id ? updated : x)));
      await loadProducts(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể cập nhật sản phẩm");
      await loadProducts(true);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Xóa ${selected.size} sản phẩm đã chọn? Không thể hoàn tác.`))
      return;
    setIsBulkLoading(true);
    const ids = Array.from(selected);

    // Optimistic update
    const deletedProducts = products.filter((p) => ids.includes(p.id));
    setProducts((p) => p.filter((x) => !ids.includes(x.id)));
    setTotal((t) => t - ids.length);
    setSelected(new Set());

    const results = await Promise.allSettled(
      ids.map((id) => productService.deleteProduct(id)),
    );
    const deleted = ids.filter((_, i) => results[i].status === "fulfilled");
    const failCount = ids.length - deleted.length;

    if (failCount > 0) {
      // Restore failed items
      const failedIds = ids.filter((_, i) => results[i].status === "rejected");
      const restored = deletedProducts.filter((p) => failedIds.includes(p.id));
      setProducts((p) => [...p, ...restored]);
      setTotal((t) => t + restored.length);
      setError(`Xóa thất bại ${failCount} sản phẩm.`);
    }

    setIsBulkLoading(false);
    await loadProducts(true);
  };

  const handleBulkPublish = async (publish: boolean) => {
    setIsBulkLoading(true);
    const ids = Array.from(selected);

    // Optimistic update
    setProducts((p) =>
      p.map((x) => (ids.includes(x.id) ? { ...x, is_published: publish } : x)),
    );
    setSelected(new Set());

    const results = await Promise.allSettled(
      ids.map((id) =>
        publish
          ? productService.publishProduct(id)
          : productService.unpublishProduct(id),
      ),
    );
    const updated: Product[] = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<Product>).value);

    // Update with server results
    setProducts((p) => p.map((x) => updated.find((u) => u.id === x.id) ?? x));
    setIsBulkLoading(false);

    await loadProducts(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans pb-24">
      <div className="p-5 md:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[34px] font-bold text-black tracking-tight leading-none mb-1">
              Sản phẩm
            </h1>
            <p className="text-[15px] text-[#8E8E93] font-medium">
              {total} sản phẩm trong hệ thống
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#007AFF] text-white rounded-[14px] text-[15px] font-semibold hover:bg-[#007AFF]/90 active:scale-95 transition-all shadow-[0_2px_10px_rgba(0,122,255,0.3)]"
          >
            <Plus size={18} strokeWidth={2} /> Thêm mới
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-[#FF3B30]/10 rounded-[16px] text-[#FF3B30] text-[15px] font-medium flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-3 text-[#FF3B30]/70 hover:text-[#FF3B30] transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Bulk Action Bar */}
        {selected.size > 0 && (
          <BulkActionBar
            count={selected.size}
            onPublish={() => handleBulkPublish(true)}
            onUnpublish={() => handleBulkPublish(false)}
            onDelete={handleBulkDelete}
            onClear={() => setSelected(new Set())}
          />
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Tìm theo tên, SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-[#E5E5EA]/60 border-2 border-transparent rounded-[16px] text-[17px] focus:outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all text-black placeholder:text-[#8E8E93]"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
          </div>
        ) : !products.length ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#E5E5EA] rounded-[18px] flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-[#8E8E93]" />
            </div>
            <p className="text-[17px] font-medium text-black">Không tìm thấy</p>
            <p className="text-[15px] text-[#8E8E93] mt-1">
              Thử đổi từ khóa tìm kiếm khác
            </p>
          </div>
        ) : (
          <div
            className={
              isBulkLoading
                ? "opacity-50 pointer-events-none transition-opacity"
                : "transition-opacity"
            }
          >
            {/* Mobile: Inset Grouped List */}
            <div className="md:hidden">
              <MobileCardList
                products={products}
                selected={selected}
                onToggleSelect={handleToggleSelect}
                onPublish={handlePublish}
                onClone={handleClone}
                onDelete={handleDelete}
              />
            </div>
            {/* Desktop: macOS Style Table */}
            <div className="hidden md:block">
              <DesktopTable
                products={products}
                selected={selected}
                onToggleSelect={handleToggleSelect}
                onToggleAll={handleToggleAll}
                onPublish={handlePublish}
                onClone={handleClone}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}

        {/* Pagination Apple Style */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between text-[15px]">
            <span className="text-[#8E8E93] font-medium">
              {(page - 1) * limit + 1} – {Math.min(page * limit, total)} của{" "}
              {total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-[#E5E5EA] rounded-[12px] font-semibold text-black hover:bg-[#F2F2F7] disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-95"
              >
                Trước
              </button>
              <div className="px-3 font-semibold text-black">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-[#E5E5EA] rounded-[12px] font-semibold text-black hover:bg-[#F2F2F7] disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-95"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
