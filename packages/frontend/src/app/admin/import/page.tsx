"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { importService } from "@/lib/import-service";

export default function AdminImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (f: File) => {
    setError("");
    if (!f.type.includes("pdf")) {
      setError("Vui lòng chọn file PDF");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError("File không được vượt quá 50MB");
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const result = await importService.uploadCatalogue(file);
      router.push(`/admin/import/${result.job_id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Upload thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Quay lại Sản phẩm
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Import Catalogue
        </h1>
        <p className="text-gray-600 mt-2">
          Upload file PDF catalogue để tự động trích xuất sản phẩm bằng AI
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFileSelect(f);
        }}
        onClick={() => document.getElementById("file-input")?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
          }}
        />
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {file ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Xóa file
              </button>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                Kéo thả file PDF vào đây hoặc{" "}
                <span className="text-blue-600">chọn file</span>
              </p>
              <p className="text-sm text-gray-500">File PDF tối đa 50MB</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Lưu ý:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>AI sẽ tự động trích xuất thông tin sản phẩm từ catalogue</li>
          <li>Bạn có thể xem và chỉnh sửa trước khi tạo sản phẩm</li>
          <li>
            Sản phẩm được tạo ở trạng thái Draft, cần review trước khi publish
          </li>
          <li>Quá trình xử lý có thể mất vài phút tùy số trang</li>
        </ul>
      </div>

      {file && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isUploading && (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {isUploading ? "Đang upload..." : "Bắt đầu xử lý"}
          </button>
        </div>
      )}
    </div>
  );
}
