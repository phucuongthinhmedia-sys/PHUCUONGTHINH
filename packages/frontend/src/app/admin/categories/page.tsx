"use client";

import { useState, useEffect } from "react";
import {
  categoryService,
  Category,
  CreateCategoryRequest,
} from "@/lib/category-service";
import { staticDataCache } from "@/lib/static-data-cache";
import { Plus, X, ChevronRight, FolderTree, AlertCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_id: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      setCategories(await categoryService.getCategories());
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError("Tên và slug là bắt buộc");
      return;
    }
    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, formData);
      } else {
        const payload: CreateCategoryRequest = {
          name: formData.name,
          slug: formData.slug,
          ...(formData.parent_id ? { parent_id: formData.parent_id } : {}),
        };
        await categoryService.createCategory(payload);
      }
      setFormData({ name: "", slug: "", parent_id: "" });
      setEditingId(null);
      setShowForm(false);
      staticDataCache.clearAll();
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể lưu danh mục");
    }
  };

  const handleEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id || "",
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await categoryService.deleteCategory(id);
      staticDataCache.clearAll();
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 md:p-8 font-sans pb-24">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[34px] font-bold text-black tracking-tight">
            Danh mục
          </h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-10 h-10 bg-[#007AFF]/10 text-[#007AFF] rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus size={22} strokeWidth={2} />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FF3B30]/10 rounded-[16px] text-[#FF3B30] text-[15px] font-medium flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="flex-1">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-[#FF3B30]/70 hover:text-[#FF3B30]"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Floating Form Modal-like */}
        {showForm && (
          <div className="mb-8 bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E5E5EA] animate-in slide-in-from-top-4 fade-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[20px] font-semibold tracking-tight">
                {editingId ? "Sửa danh mục" : "Danh mục mới"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", slug: "", parent_id: "" });
                }}
                className="p-2 text-[#8E8E93] hover:text-black bg-[#F2F2F7] rounded-full transition-colors"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Tên danh mục..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all placeholder:text-[#8E8E93]"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug (VD: phong-khach)..."
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 px-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all placeholder:text-[#8E8E93]"
                  required
                />
                <div className="relative">
                  <select
                    value={formData.parent_id}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_id: e.target.value })
                    }
                    className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[14px] py-3 pl-4 pr-10 text-[17px] text-black appearance-none outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all"
                  >
                    <option value="">Không có thư mục cha</option>
                    {categories
                      .filter((c) => c.id !== editingId)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  <ChevronRight
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E93] rotate-90 pointer-events-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#007AFF] text-white rounded-[14px] font-semibold text-[17px] active:scale-[0.98] transition-transform shadow-[0_2px_10px_rgba(0,122,255,0.3)]"
                >
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inset Grouped List (macOS/iOS Style) */}
        <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center">
              <FolderTree
                size={40}
                className="mx-auto mb-3 text-[#E5E5EA]"
                strokeWidth={1.5}
              />
              <p className="text-[17px] font-medium text-black">
                Chưa có danh mục
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {categories.map((cat, index) => {
                const parent = cat.parent_id
                  ? categories.find((c) => c.id === cat.parent_id)
                  : null;
                return (
                  <div
                    key={cat.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 pl-5 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                  >
                    <div className="flex-1">
                      <h3 className="text-[17px] font-medium text-black">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[15px] text-[#8E8E93] font-mono">
                          {cat.slug}
                        </span>
                        {parent && (
                          <>
                            <span className="text-[#E5E5EA]">•</span>
                            <span className="text-[13px] bg-[#F2F2F7] text-[#8E8E93] px-2 py-0.5 rounded-md font-medium">
                              Thuộc: {parent.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons (Reveal on hover/always show on mobile) */}
                    <div className="flex items-center gap-3 mt-3 sm:mt-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-3 py-1.5 bg-[#007AFF]/10 text-[#007AFF] rounded-[8px] text-[14px] font-semibold active:scale-95"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-3 py-1.5 bg-[#FF3B30]/10 text-[#FF3B30] rounded-[8px] text-[14px] font-semibold active:scale-95"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
