"use client";

import { useEffect, useState } from "react";
import { documentService, Document } from "@/lib/document-service";
import {
  FileText,
  Trash2,
  Plus,
  Image as ImageIcon,
  FileOutput,
  Download,
} from "lucide-react";

interface RelatedDocumentsProps {
  entityType: "ORDER" | "CUSTOMER" | "PRODUCT" | "LEAD";
  entityId: string;
}

export default function RelatedDocuments({
  entityType,
  entityId,
}: RelatedDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(
        `/api/backend/documents/${doc.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = doc.original_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Tải file thất bại. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [entityType, entityId]);

  const loadDocuments = async () => {
    setLoading(true);
    // Giả lập delay để thấy hiệu ứng skeleton
    setTimeout(async () => {
      try {
        const docs = await documentService.getDocumentsByEntity(
          entityType,
          entityId,
        );
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Hàm helper để render icon theo loại file
  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.includes("image"))
      return <ImageIcon className="w-8 h-8 text-emerald-500" />;
    if (mimeType?.includes("pdf"))
      return <FileOutput className="w-8 h-8 text-rose-500" />;
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="w-full">
      {/* Header tối giản */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Hồ sơ & Chứng từ
            {!loading && documents.length > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {documents.length}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các tài liệu đính kèm liên quan
          </p>
        </div>

        <button className="group flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Tải lên
        </button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-4 h-[160px] animate-pulse flex flex-col justify-between shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                <div className="w-8 h-8 bg-gray-50 rounded-lg"></div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !documents || documents.length === 0 ? (
        <div className="w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center py-16 transition-colors hover:bg-gray-50">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-semibold">Chưa có tài liệu nào</p>
          <p className="text-gray-500 text-sm mt-1 max-w-sm text-center">
            Kéo thả hình ảnh hiện trường, bản scan hợp đồng hoặc file PDF vào
            khu vực này để tải lên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top area: Icon & Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-blue-50/50 transition-colors">
                  {getFileIcon(doc.mime_type)}
                </div>

                {/* Action buttons show on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors z-10 relative"
                    title="Tải xuống"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom area: File Info */}
              <div>
                <p
                  className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors"
                  title={doc.original_name}
                >
                  {doc.original_name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {doc.category.name}
                  </span>
                  <span>•</span>
                  <span>{formatFileSize(doc.file_size)}</span>
                </div>
              </div>

              {/* Nút xem chi tiết phủ toàn bộ card ẩn */}
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-0"
                aria-label="Xem chi tiết"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
