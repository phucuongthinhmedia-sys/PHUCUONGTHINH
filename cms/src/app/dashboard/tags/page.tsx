"use client";

import { useState, useEffect } from "react";
import { tagService, Tag, CreateTagRequest } from "@/lib/tag-service";

export default function TagsPage() {
  const [styles, setStyles] = useState<Tag[]>([]);
  const [spaces, setSpaces] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"styles" | "spaces">("styles");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [stls, sps] = await Promise.all([
        tagService.getStyles(),
        tagService.getSpaces(),
      ]);
      setStyles(stls);
      setSpaces(sps);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể tải thẻ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Tên là bắt buộc");
      return;
    }

    try {
      if (editingId) {
        if (activeTab === "styles") {
          await tagService.updateStyle(editingId, formData);
        } else {
          await tagService.updateSpace(editingId, formData);
        }
      } else {
        if (activeTab === "styles") {
          await tagService.createStyle(formData as CreateTagRequest);
        } else {
          await tagService.createSpace(formData as CreateTagRequest);
        }
      }
      setFormData({ name: "" });
      setEditingId(null);
      setShowForm(false);
      loadTags();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể lưu thẻ");
    }
  };

  const handleEdit = (tag: Tag) => {
    setFormData({ name: tag.name });
    setEditingId(tag.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thẻ này?")) return;

    try {
      if (activeTab === "styles") {
        await tagService.deleteStyle(id);
      } else {
        await tagService.deleteSpace(id);
      }
      loadTags();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể xóa thẻ");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const currentTags = activeTab === "styles" ? styles : spaces;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thẻ phân loại</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thêm thẻ
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("styles")}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === "styles"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Phong cách
          </button>
          <button
            onClick={() => setActiveTab("spaces")}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === "spaces"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Không gian
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Chỉnh sửa thẻ" : "Thẻ mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={handleCancel}
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
      ) : currentTags.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Không tìm thấy thẻ</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTags.map((tag) => (
                <tr key={tag.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="text-red-600 hover:text-red-800"
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
