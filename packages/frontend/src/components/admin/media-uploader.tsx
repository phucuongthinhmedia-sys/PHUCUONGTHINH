"use client";

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { validateFile, validateSocialUrl } from "@/lib/media-service";

export type MediaType = "lifestyle" | "cutout" | "video" | "social_link";

export interface PendingMedia {
  clientId: string;
  file?: File;
  url?: string;
  media_type: MediaType;
  is_cover: boolean;
  sort_order: number;
  preview_url?: string;
  status: "pending" | "uploading" | "done" | "error";
  progress?: number;
  error?: string;
  alt_text?: string;
}

export interface MediaUploaderProps {
  productId?: string;
  existingMedia?: PendingMedia[];
  onChange: (media: PendingMedia[]) => void;
  productName?: string;
}

let _idCounter = 0;
function nextId() {
  return `media-${Date.now()}-${++_idCounter}`;
}

const SOCIAL_PLATFORM_ICONS: Record<string, string> = {
  "pinterest.com": "📌",
  "instagram.com": "📷",
  "houzz.com": "🏠",
  "facebook.com": "👍",
};

function getPlatformIcon(url: string): string {
  try {
    const { hostname } = new URL(url);
    for (const [domain, icon] of Object.entries(SOCIAL_PLATFORM_ICONS)) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) return icon;
    }
  } catch {
    /* ignore */
  }
  return "🔗";
}

function getPlatformName(url: string): string {
  try {
    const { hostname } = new URL(url);
    if (hostname.includes("pinterest")) return "Pinterest";
    if (hostname.includes("instagram")) return "Instagram";
    if (hostname.includes("houzz")) return "Houzz";
    if (hostname.includes("facebook")) return "Facebook";
  } catch {
    /* ignore */
  }
  return "Social Link";
}

export function setCover(list: PendingMedia[], index: number): PendingMedia[] {
  return list.map((item, i) => ({ ...item, is_cover: i === index }));
}

export function MediaUploader({
  existingMedia = [],
  onChange,
  productName = "",
}: MediaUploaderProps) {
  const [items, setItems] = useState<PendingMedia[]>(existingMedia);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [socialUrl, setSocialUrl] = useState("");
  const [socialError, setSocialError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      const newItems: PendingMedia[] = [];

      for (const file of arr) {
        const isVideo = file.type.startsWith("video/");
        const mediaType: MediaType = isVideo ? "video" : "lifestyle";

        const result = validateFile(file, mediaType);
        if (!result.valid) {
          newItems.push({
            clientId: nextId(),
            file,
            media_type: mediaType,
            is_cover: false,
            sort_order: 0,
            status: "error",
            error: result.error,
          });
          continue;
        }

        newItems.push({
          clientId: nextId(),
          file,
          media_type: mediaType,
          is_cover: false,
          sort_order: 0,
          preview_url: URL.createObjectURL(file),
          status: "pending",
        });
      }

      setItems((prev) => {
        const base = prev.length;
        const withOrder = newItems.map((item, i) => ({
          ...item,
          sort_order: base + i,
        }));
        const next = [...prev, ...withOrder];

        const hasCover = next.some((item) => item.is_cover);
        if (!hasCover) {
          const firstImage = next.find(
            (item) =>
              item.media_type === "lifestyle" || item.media_type === "cutout",
          );
          if (firstImage) firstImage.is_cover = true;
        }

        onChange(next);
        return next;
      });
    },
    [onChange],
  );

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeItem = (clientId: string) => {
    setItems((prev) => {
      const next = prev
        .filter((i) => i.clientId !== clientId)
        .map((item, idx) => ({ ...item, sort_order: idx }));
      onChange(next);
      return next;
    });
  };

  const handleSetCover = (index: number) => {
    setItems((prev) => {
      const next = setCover(prev, index);
      onChange(next);
      return next;
    });
  };

  const handleItemDragStart = (index: number) => setDraggedIndex(index);

  const handleItemDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(index, 0, moved);
      const reordered = next.map((item, i) => ({ ...item, sort_order: i }));
      onChange(reordered);
      setDraggedIndex(index);
      return reordered;
    });
  };

  const handleItemDragEnd = () => setDraggedIndex(null);

  const handleAltChange = (clientId: string, alt: string) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.clientId === clientId ? { ...item, alt_text: alt } : item,
      );
      onChange(next);
      return next;
    });
  };

  const handleCopyAltAll = () => {
    if (!productName.trim()) return;
    setItems((prev) => {
      const next = prev.map((item) =>
        item.media_type !== "social_link"
          ? { ...item, alt_text: productName }
          : item,
      );
      onChange(next);
      return next;
    });
  };

  const handleAddSocialLink = () => {
    setSocialError("");
    const trimmed = socialUrl.trim();
    if (!trimmed) return;

    if (!validateSocialUrl(trimmed)) {
      setSocialError(
        "URL không hợp lệ. Chỉ chấp nhận: pinterest.com, instagram.com, houzz.com, facebook.com",
      );
      return;
    }

    setItems((prev) => {
      const next = [
        ...prev,
        {
          clientId: nextId(),
          url: trimmed,
          media_type: "social_link" as MediaType,
          is_cover: false,
          sort_order: prev.length,
          status: "pending" as const,
        },
      ];
      onChange(next);
      return next;
    });
    setSocialUrl("");
  };

  const fileItems = items.filter((i) => i.media_type !== "social_link");
  const socialItems = items.filter((i) => i.media_type === "social_link");

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDraggingOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mov"
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-600">
            Kéo thả ảnh/video vào đây hoặc{" "}
            <span className="text-blue-600">chọn file</span>
          </p>
          <p className="text-xs text-gray-400">
            JPG, PNG, WEBP, MP4, MOV — tối đa 50MB mỗi file
          </p>
        </div>
      </div>

      {fileItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">
              Kéo để sắp xếp · Click ảnh bìa để đặt làm cover
            </p>
            {productName && (
              <button
                type="button"
                onClick={handleCopyAltAll}
                className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                Copy tên SP vào Alt tất cả ảnh
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {fileItems.map((item, idx) => {
              const globalIdx = items.indexOf(item);
              const isVideo = item.media_type === "video";
              return (
                <div
                  key={item.clientId}
                  draggable
                  onDragStart={() => handleItemDragStart(globalIdx)}
                  onDragOver={(e) => handleItemDragOver(e, globalIdx)}
                  onDragEnd={handleItemDragEnd}
                  className={`relative group rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                    item.is_cover
                      ? "border-blue-500 shadow-md"
                      : "border-transparent hover:border-gray-300"
                  } ${draggedIndex === globalIdx ? "opacity-50" : ""}`}
                >
                  <div className="aspect-square bg-gray-100">
                    {item.preview_url && !isVideo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.preview_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : item.preview_url && isVideo ? (
                      <video
                        src={item.preview_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                        {isVideo ? "🎬" : "🖼️"}
                      </div>
                    )}
                  </div>

                  {item.status === "uploading" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${item.progress ?? 0}%` }}
                      />
                    </div>
                  )}

                  {item.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-1">
                      <p className="text-white text-xs text-center leading-tight">
                        {item.error}
                      </p>
                    </div>
                  )}

                  {item.is_cover && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      Bìa
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!item.is_cover && item.media_type !== "video" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCover(globalIdx);
                        }}
                        className="bg-white text-gray-800 text-xs px-2 py-1 rounded shadow hover:bg-blue-50"
                      >
                        Bìa
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.clientId);
                      }}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 space-y-2">
            {fileItems.map((item) => (
              <div
                key={`alt-${item.clientId}`}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-gray-100">
                  {item.preview_url && item.media_type !== "video" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.preview_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      {item.media_type === "video" ? "🎬" : "🖼️"}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={item.alt_text ?? ""}
                  onChange={(e) =>
                    handleAltChange(item.clientId, e.target.value)
                  }
                  placeholder={`Alt text ảnh ${item.sort_order + 1}...`}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Link mạng xã hội
        </h4>
        <p className="text-xs text-gray-400">
          Pinterest, Instagram, Houzz, Facebook
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            value={socialUrl}
            onChange={(e) => {
              setSocialUrl(e.target.value);
              setSocialError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSocialLink();
              }
            }}
            placeholder="https://www.pinterest.com/pin/..."
            className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${socialError ? "border-red-400" : "border-gray-300"}`}
          />
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Thêm
          </button>
        </div>
        {socialError && <p className="text-xs text-red-500">{socialError}</p>}

        {socialItems.length > 0 && (
          <ul className="space-y-2">
            {socialItems.map((item) => (
              <li
                key={item.clientId}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-xl" aria-hidden>
                  {getPlatformIcon(item.url ?? "")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700">
                    {getPlatformName(item.url ?? "")}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{item.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.clientId)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Xóa link"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
