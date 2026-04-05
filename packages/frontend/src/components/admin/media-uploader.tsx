"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  DragEvent,
  ChangeEvent,
} from "react";
import { validateFile, validateSocialUrl } from "@/lib/media-service";
import { realtimeService } from "@/lib/realtime-service";
import {
  Image as ImageIcon,
  Video,
  X,
  Star,
  Wifi,
  WifiOff,
} from "lucide-react";

export type MediaType =
  | "lifestyle"
  | "cutout"
  | "video"
  | "showcase"
  | "social_link";

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

export function setCover(list: PendingMedia[], index: number): PendingMedia[] {
  return list.map((item, i) => ({ ...item, is_cover: i === index }));
}

// ── Toast Component (Apple Pill Style) ──────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = type === "error";

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.15)] text-[14px] font-bold animate-in slide-in-from-bottom-6 fade-in duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isError
          ? "bg-red-50 text-red-600 border border-red-100"
          : "bg-gray-900 text-white backdrop-blur-xl saturate-150"
      }`}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity p-1 active:scale-90"
      >
        <X size={16} strokeWidth={3} />
      </button>
    </div>
  );
}

// ── Thumbnail item (Bo góc 16px, nút kính) ────────────────────────────────────
function MediaThumb({
  item,
  index,
  globalIdx,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onSetCover,
  onRemove,
  isNew,
}: {
  item: PendingMedia;
  index: number;
  globalIdx: number;
  draggedIndex: number | null;
  onDragStart: (i: number) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>, i: number) => void;
  onDragEnd: () => void;
  onSetCover: (i: number) => void;
  onRemove: (id: string) => void;
  isNew?: boolean;
}) {
  const isVideo = item.media_type === "video";
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => onRemove(item.clientId), 300);
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(globalIdx)}
      onDragOver={(e) => onDragOver(e, globalIdx)}
      onDragEnd={onDragEnd}
      className={`relative group rounded-[16px] overflow-hidden bg-black/5 cursor-grab active:cursor-grabbing transition-all duration-300 border-2 ${
        item.is_cover
          ? "border-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          : "border-transparent hover:border-black/10"
      } ${draggedIndex === globalIdx ? "opacity-40 scale-95" : ""} ${
        isNew ? "animate-in zoom-in-95 fade-in duration-300" : ""
      } ${isRemoving ? "animate-out zoom-out-95 fade-out scale-95 duration-300" : ""}`}
    >
      <div className="aspect-square bg-transparent">
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
            preload="metadata"
            onLoadedMetadata={(e) => {
              (e.target as HTMLVideoElement).currentTime = 0.5;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {isVideo ? <Video size={24} /> : <ImageIcon size={24} />}
          </div>
        )}
      </div>

      {item.status === "uploading" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <div
            className="h-full bg-gray-900 transition-all"
            style={{ width: `${item.progress ?? 0}%` }}
          />
        </div>
      )}

      {item.status === "error" && (
        <div className="absolute inset-0 bg-red-500/90 backdrop-blur-sm flex items-center justify-center p-2">
          <p className="text-white text-[11px] font-bold text-center leading-tight">
            {item.error}
          </p>
        </div>
      )}

      {item.is_cover && (
        <div className="absolute top-2 left-2 bg-gray-900/90 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={10} strokeWidth={3} className="fill-white" /> Bìa
        </div>
      )}

      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
        {!item.is_cover && !isVideo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSetCover(globalIdx);
            }}
            className="bg-white/90 text-gray-900 font-bold text-[11px] px-3 py-1.5 rounded-full shadow-md hover:bg-white active:scale-95 transition-all"
          >
            Đặt Bìa
          </button>
        )}
        <button
          type="button"
          onClick={handleRemove}
          className="bg-red-500/90 text-white font-bold text-[11px] px-3 py-1.5 rounded-full shadow-md hover:bg-red-500 active:scale-95 transition-all"
        >
          Xóa
        </button>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {index + 1}
      </div>
    </div>
  );
}

// ── Drop zone (Bo góc cực lớn, nền xám trong) ──────────────────────────────────
function DropZone({
  label,
  hint,
  accept,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  inputRef,
  onFileChange,
  icon,
}: {
  label: string;
  hint: string;
  accept: string;
  isDragging: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`flex-1 rounded-[24px] p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[120px] border-2 border-dashed ${
        isDragging
          ? "border-gray-900 bg-black/10 scale-[0.98]"
          : "border-black/10 bg-black/5 hover:bg-black/10 hover:border-black/20"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={onFileChange}
      />
      <div className="pointer-events-none flex flex-col items-center gap-1.5">
        {icon}
        <p className="text-[14px] font-bold text-gray-900">{label}</p>
        <p className="text-[11px] font-medium text-gray-500">{hint}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MediaUploader({
  existingMedia = [],
  onChange,
  productName = "",
  productId,
}: MediaUploaderProps) {
  const [items, setItems] = useState<PendingMedia[]>(existingMedia);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [uploadingCount, setUploadingCount] = useState(0);

  const prevMediaKey = useRef<string>("");
  const isInitialMount = useRef(true);

  useEffect(() => {
    setIsRealtimeConnected("BroadcastChannel" in window);
  }, []);

  useEffect(() => {
    const key = existingMedia.map((m) => m.clientId).join(",");
    if (key !== prevMediaKey.current) {
      prevMediaKey.current = key;
      if (existingMedia.length > 0) setItems(existingMedia);
    }
  }, [existingMedia]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const existingKey = existingMedia.map((m) => m.clientId).join(",");
    const currentKey = items.map((m) => m.clientId).join(",");
    if (existingKey === currentKey && existingMedia.length === items.length)
      return;
    onChange(items);
  }, [items, onChange]);

  const [dragging1, setDragging1] = useState(false);
  const [dragging2, setDragging2] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [socialUrl, setSocialUrl] = useState("");
  const [socialError, setSocialError] = useState("");
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  const PRODUCT_TYPES: MediaType[] = ["lifestyle", "cutout"];
  const SHOWCASE_TYPES: MediaType[] = ["video", "showcase"];

  const addFilesAs = useCallback(
    (files: FileList | File[], zone: 1 | 2) => {
      const arr = Array.from(files);
      const newItems: PendingMedia[] = [];
      const newIds: string[] = [];

      for (const file of arr) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        const isVideo =
          file.type.startsWith("video/") ||
          ["mp4", "mov", "webm"].includes(ext);
        let mediaType: MediaType =
          zone === 1 ? "lifestyle" : isVideo ? "video" : "showcase";
        const result = validateFile(file, mediaType);
        const clientId = nextId();

        newItems.push({
          clientId,
          file,
          media_type: mediaType,
          is_cover: false,
          sort_order: 0,
          preview_url: result.valid ? URL.createObjectURL(file) : undefined,
          status: result.valid ? "pending" : "error",
          error: result.valid ? undefined : result.error,
        });
        if (result.valid) newIds.push(clientId);
      }

      setItems((prev) => {
        const base = prev.length;
        const withOrder = newItems.map((item, i) => ({
          ...item,
          sort_order: base + i,
        }));
        const next = [...prev, ...withOrder];
        if (!next.some((i) => i.is_cover)) {
          const first = next.find((i) => PRODUCT_TYPES.includes(i.media_type));
          if (first) first.is_cover = true;
        }
        onChange(next);
        return next;
      });

      setNewItemIds(new Set(newIds));
      setTimeout(() => setNewItemIds(new Set()), 500);

      if (productId) {
        newIds.forEach((id) => {
          const item = newItems.find((i) => i.clientId === id);
          if (item?.file) {
            realtimeService?.broadcastMediaUploadStart(productId, {
              clientId: id,
              fileName: item.file.name,
              mediaType: item.media_type,
            });
          }
        });
      }

      const validCount = newItems.filter((i) => i.status === "pending").length;
      const errorCount = newItems.filter((i) => i.status === "error").length;

      if (validCount > 0)
        setToast({
          message: `Đã thêm ${validCount} file${errorCount > 0 ? ` (${errorCount} lỗi)` : ""}`,
          type: "success",
        });
      else if (errorCount > 0)
        setToast({ message: `${errorCount} file không hợp lệ`, type: "error" });
    },
    [onChange],
  );

  const removeItem = (clientId: string) => {
    setItems((prev) =>
      prev
        .filter((i) => i.clientId !== clientId)
        .map((item, idx) => ({ ...item, sort_order: idx })),
    );
  };

  const handleSetCover = (globalIdx: number) => {
    setItems((prev) => setCover(prev, globalIdx));
  };

  const handleItemDragStart = (index: number) => setDraggedIndex(index);
  const handleItemDragEnd = () => setDraggedIndex(null);
  const handleItemDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(index, 0, moved);
      return next.map((item, i) => ({ ...item, sort_order: i }));
    });
  };

  const handleAddSocialLink = () => {
    setSocialError("");
    const trimmed = socialUrl.trim();
    if (!trimmed) return;
    if (!validateSocialUrl(trimmed)) {
      setSocialError("Chỉ hỗ trợ: pinterest, instagram, houzz, facebook");
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        clientId: nextId(),
        url: trimmed,
        media_type: "social_link",
        is_cover: false,
        sort_order: prev.length,
        status: "pending",
      },
    ]);
    setSocialUrl("");
  };

  const productItems = items.filter((i) =>
    PRODUCT_TYPES.includes(i.media_type),
  );
  const showcaseItems = items.filter((i) =>
    SHOWCASE_TYPES.includes(i.media_type),
  );
  const socialItems = items.filter((i) => i.media_type === "social_link");

  const thumbProps = (item: PendingMedia, zoneItems: PendingMedia[]) => ({
    item,
    index: zoneItems.indexOf(item),
    globalIdx: items.indexOf(item),
    draggedIndex,
    onDragStart: handleItemDragStart,
    onDragOver: handleItemDragOver,
    onDragEnd: handleItemDragEnd,
    onSetCover: handleSetCover,
    onRemove: removeItem,
    isNew: newItemIds.has(item.clientId),
  });

  useEffect(() => {
    setUploadingCount(items.filter((i) => i.status === "uploading").length);
  }, [items]);

  return (
    <div className="space-y-5">
      {/* Real-time status bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/5 rounded-[14px]">
        <div className="flex items-center gap-2">
          {isRealtimeConnected ? (
            <Wifi size={14} className="text-gray-900" />
          ) : (
            <WifiOff size={14} className="text-gray-400" />
          )}
          <span
            className={`text-[12px] font-bold ${isRealtimeConnected ? "text-gray-900" : "text-gray-500"}`}
          >
            {isRealtimeConnected ? "Trạng thái: Online" : "Trạng thái: Offline"}
          </span>
        </div>
        {uploadingCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-[2px] border-gray-900 border-t-transparent rounded-full animate-spin" />
            <span className="text-[12px] font-bold text-gray-900">
              Đang tải {uploadingCount}...
            </span>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Zone 1 */}
        <div className="flex flex-col gap-3" style={{ flex: "7" }}>
          <DropZone
            label="Ảnh chính sản phẩm"
            hint="JPG, PNG, WEBP"
            accept=".jpg,.jpeg,.png,.webp"
            isDragging={dragging1}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging1(true);
            }}
            onDragLeave={() => setDragging1(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging1(false);
              if (e.dataTransfer.files?.length)
                addFilesAs(e.dataTransfer.files, 1);
            }}
            onClick={() => inputRef1.current?.click()}
            inputRef={inputRef1}
            onFileChange={(e) => {
              if (e.target.files?.length) {
                addFilesAs(e.target.files, 1);
                e.target.value = "";
              }
            }}
            icon={
              <ImageIcon
                size={26}
                strokeWidth={2.5}
                className="text-gray-400 mb-1"
              />
            }
          />
          {productItems.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {productItems.map((item) => (
                <MediaThumb
                  key={item.clientId}
                  {...thumbProps(item, productItems)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Zone 2 */}
        <div className="flex flex-col gap-3" style={{ flex: "3" }}>
          <DropZone
            label="Video & Banner"
            hint="MP4, MOV, WEBP"
            accept=".jpg,.jpeg,.png,.webp,.mp4,.mov"
            isDragging={dragging2}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging2(true);
            }}
            onDragLeave={() => setDragging2(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging2(false);
              if (e.dataTransfer.files?.length)
                addFilesAs(e.dataTransfer.files, 2);
            }}
            onClick={() => inputRef2.current?.click()}
            inputRef={inputRef2}
            onFileChange={(e) => {
              if (e.target.files?.length) {
                addFilesAs(e.target.files, 2);
                e.target.value = "";
              }
            }}
            icon={
              <Video
                size={26}
                strokeWidth={2.5}
                className="text-gray-400 mb-1"
              />
            }
          />
          {showcaseItems.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5">
              {showcaseItems.map((item) => (
                <MediaThumb
                  key={item.clientId}
                  {...thumbProps(item, showcaseItems)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alt text & Social */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black/5">
        {/* Alt text */}
        <div className="bg-black/5 p-4 rounded-[20px] space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-gray-900">
              Mô tả ảnh (Alt text SEO)
            </p>
            {productName && (
              <button
                type="button"
                onClick={() =>
                  setItems((prev) =>
                    prev.map((item) =>
                      PRODUCT_TYPES.includes(item.media_type)
                        ? { ...item, alt_text: productName }
                        : item,
                    ),
                  )
                }
                className="text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Dùng tên SP
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar pr-1">
            {productItems
              .filter((i) => i.status !== "error")
              .map((item) => (
                <div
                  key={`alt-${item.clientId}`}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-[8px] overflow-hidden shrink-0 bg-white">
                    {item.preview_url && (
                      <img
                        src={item.preview_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.alt_text ?? ""}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((m) =>
                          m.clientId === item.clientId
                            ? { ...m, alt_text: e.target.value }
                            : m,
                        ),
                      )
                    }
                    placeholder={`Mô tả ảnh ${item.sort_order + 1}...`}
                    className="flex-1 bg-white border border-transparent rounded-[10px] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-black/5 p-4 rounded-[20px] space-y-3">
          <p className="text-[13px] font-bold text-gray-900">
            Nguồn MXH (Instagram, Pinterest...)
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
              placeholder="https://..."
              className={`flex-1 bg-white border rounded-[12px] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${socialError ? "border-red-400" : "border-transparent"}`}
            />
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="px-4 py-2 bg-gray-900 text-white font-bold text-[13px] rounded-[12px] hover:bg-black active:scale-95 transition-all"
            >
              Thêm
            </button>
          </div>
          {socialError && (
            <p className="text-[11px] font-semibold text-red-500">
              {socialError}
            </p>
          )}
          {socialItems.length > 0 && (
            <ul className="space-y-1.5 mt-2">
              {socialItems.map((item) => (
                <li
                  key={item.clientId}
                  className="flex items-center gap-2 p-2.5 bg-white rounded-[12px] text-[12px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                >
                  <span className="text-[14px]">🔗</span>
                  <span className="flex-1 truncate text-gray-600">
                    {item.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.clientId)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
