"use client";

import { useState, useEffect } from "react";
import { X, Download, Eye } from "lucide-react";
import { Document as DocumentType } from "@/lib/document-service";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  document: DocumentType | null;
  onClose: () => void;
}

export default function DocumentPreviewModal({
  isOpen,
  document: doc,
  onClose,
}: DocumentPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getBaseUrl = () => "/api/backend";
  const getToken = () => localStorage.getItem("auth_token");

  useEffect(() => {
    if (!isOpen || !doc) {
      setBlobUrl(null);
      return;
    }

    let currentObjectUrl: string | null = null;

    const loadPreview = async () => {
      setLoading(true);
      try {
        const url = `${getBaseUrl()}/documents/${doc.id}/preview`;
        console.log("[Preview] fetching:", url);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        console.log(
          "[Preview] status:",
          res.status,
          "content-type:",
          res.headers.get("content-type"),
        );
        if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
        const blob = await res.blob();
        console.log("[Preview] blob size:", blob.size, "type:", blob.type);
        currentObjectUrl = window.URL.createObjectURL(blob);
        setBlobUrl(currentObjectUrl);
      } catch (err) {
        console.error("[Preview] error:", err);
        setBlobUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (currentObjectUrl) window.URL.revokeObjectURL(currentObjectUrl);
      setBlobUrl(null);
    };
  }, [isOpen, doc?.id]);

  const handleDownload = async () => {
    if (!doc) return;
    try {
      const res = await fetch(`${getBaseUrl()}/documents/${doc.id}/download`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = doc.original_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Tải file thất bại. Vui lòng thử lại.");
    }
  };

  if (!isOpen || !doc) return null;

  const isPDF = doc.mime_type.includes("pdf");
  const isImage = doc.mime_type.includes("image");
  const isOffice =
    doc.mime_type.includes("wordprocessingml") ||
    doc.mime_type.includes("spreadsheetml") ||
    doc.mime_type.includes("presentationml") ||
    doc.mime_type.includes("msword") ||
    doc.mime_type.includes("ms-excel") ||
    doc.mime_type.includes("ms-powerpoint");
  const officeViewerUrl = isOffice
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(doc.file_url)}`
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 truncate max-w-lg">
              {doc.original_name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {(doc.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
              {new Date(doc.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : isPDF && blobUrl ? (
            <iframe
              src={blobUrl}
              className="w-full min-h-[500px] rounded-lg border border-gray-200"
              title="PDF Preview"
            />
          ) : isImage && blobUrl ? (
            <div className="flex items-center justify-center">
              <img
                src={blobUrl}
                alt={doc.original_name}
                className="max-w-full max-h-[500px] rounded-lg shadow-lg"
              />
            </div>
          ) : officeViewerUrl ? (
            <iframe
              src={officeViewerUrl}
              className="w-full min-h-[500px] rounded-lg border border-gray-200"
              title="Office Preview"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-200">
                <Eye className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500">Không thể xem trước file này</p>
              <p className="text-sm text-gray-400">
                Loại file: {doc.mime_type}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Đóng
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Tải về
          </button>
        </div>
      </div>
    </div>
  );
}
