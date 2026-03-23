"use client";

import { useState, useEffect } from "react";
import { productService, Product } from "@/lib/product-service";
import { MediaRecord } from "@/lib/media-service";

export default function MediaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingMediaId, setUploadingMediaId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadMedia(selectedProduct);
    }
  }, [selectedProduct]);

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts(1, 100);
      setProducts(response.products || []);
      if (response.products && response.products.length > 0) {
        setSelectedProduct(response.products[0].id);
      }
    } catch (err: any) {
      setError("Không thể tải danh sách sản phẩm");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMedia = async (productId: string) => {
    setError("");
    try {
      const mediaList = await mediaService.getProductMedia(productId);
      setMedia(mediaList.sort((a, b) => a.sort_order - b.sort_order));
    } catch (err: any) {
      setError("Không thể tải media");
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProduct) return;

    setUploadingMediaId(mediaType);
    setError("");

    try {
      const newMedia = await mediaService.uploadMedia(
        selectedProduct,
        file,
        mediaType,
      );
      setMedia(
        [...media, newMedia].sort((a, b) => a.sort_order - b.sort_order),
      );
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể tải lên media");
    } finally {
      setUploadingMediaId(null);
      e.target.value = "";
    }
  };

  const handleSetCover = async (mediaId: string) => {
    if (!selectedProduct) return;

    try {
      const updated = await mediaService.setCoverImage(
        selectedProduct,
        mediaId,
      );
      setMedia(
        media.map((m) => ({
          ...m,
          is_cover: m.id === mediaId,
        })),
      );
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể đặt ảnh bìa");
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Bạn có chắc muốn xóa media này?")) return;
    if (!selectedProduct) return;

    try {
      await mediaService.deleteMedia(selectedProduct, mediaId);
      setMedia(media.filter((m) => m.id !== mediaId));
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể xóa media");
    }
  };

  const handleReorder = async (mediaId: string, direction: "up" | "down") => {
    if (!selectedProduct) return;

    const index = media.findIndex((m) => m.id === mediaId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === media.length - 1)
    ) {
      return;
    }

    const newMedia = [...media];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newMedia[index], newMedia[targetIndex]] = [
      newMedia[targetIndex],
      newMedia[index],
    ];

    try {
      await Promise.all([
        mediaService.updateMediaOrder(selectedProduct, mediaId, targetIndex),
        mediaService.updateMediaOrder(
          selectedProduct,
          newMedia[index].id,
          index,
        ),
      ]);
      setMedia(newMedia);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Không thể sắp xếp lại media",
      );
    }
  };

  const mediaTypeLabels: Record<string, string> = {
    lifestyle: "Ảnh thực tế",
    cutout: "Ảnh cắt nền",
    video: "Video",
    "3d_file": "File 3D",
    pdf: "Catalogue PDF",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản lý Media</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn sản phẩm
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {products &&
                products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
            </select>
          </div>

          {/* Upload Section */}
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tải lên Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(mediaTypeLabels).map(([type, label]) => (
                <label
                  key={type}
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 transition"
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, type)}
                    disabled={uploadingMediaId === type}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {uploadingMediaId === type ? "Đang tải lên..." : label}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Media Gallery */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thư viện Media
            </h2>
            {media.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có media cho sản phẩm này
              </div>
            ) : (
              <div className="space-y-4">
                {media.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {mediaTypeLabels[item.media_type]}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.file_type}
                            {item.file_size &&
                              ` • ${(item.file_size / 1024 / 1024).toFixed(2)} MB`}
                          </p>
                        </div>
                        {item.is_cover && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Ảnh bìa
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!item.is_cover && (
                        <button
                          onClick={() => handleSetCover(item.id)}
                          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Đặt làm ảnh bìa
                        </button>
                      )}

                      <button
                        onClick={() => handleReorder(item.id, "up")}
                        disabled={index === 0}
                        className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                      >
                        ↑
                      </button>

                      <button
                        onClick={() => handleReorder(item.id, "down")}
                        disabled={index === media.length - 1}
                        className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                      >
                        ↓
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
