"use client";

import { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

interface FileInputProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  accept?: string;
  disabled?: boolean;
  isDragging?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export default function FileInput({
  file,
  onFileSelect,
  onFileRemove,
  accept,
  disabled = false,
  isDragging = false,
  onDragOver,
  onDragLeave,
  onDrop,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        accept={accept}
        disabled={disabled}
        className="hidden"
      />

      {file ? (
        <div>
          <div className="flex justify-center mb-3">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-green-600 font-semibold">{file.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <button
            onClick={onFileRemove}
            disabled={disabled}
            className="mt-3 flex items-center justify-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Chọn file khác
          </button>
        </div>
      ) : (
        <div>
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Kéo thả file vào đây</p>
          <p className="text-sm text-gray-500 mb-4">hoặc</p>
          <button
            onClick={handleClick}
            disabled={disabled}
            className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Chọn file
          </button>
        </div>
      )}
    </div>
  );
}
