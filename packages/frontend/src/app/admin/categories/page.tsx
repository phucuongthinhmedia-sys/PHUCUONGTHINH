"use client";

import { useState, useEffect } from "react";
import {
  categoryService,
  Category,
  CreateCategoryRequest,
} from "@/lib/category-service";

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
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Danh mục</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thêm danh mục
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Sửa danh mục" : "Danh mục mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục cha
              </label>
              <select
                value={formData.parent_id}
                onChange={(e) =>
                  setFormData({ ...formData, parent_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Không có</option>
                {categories
                  .filter((c) => c.id !== editingId)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", slug: "", parent_id: "" });
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy danh mục
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Danh mục cha
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cat.parent_id
                      ? categories.find((c) => c.id === cat.parent_id)?.name ||
                        "-"
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
