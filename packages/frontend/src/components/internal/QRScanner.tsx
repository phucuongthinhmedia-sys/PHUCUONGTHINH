"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

const VIDEO_ID = "qr-video-element";

function isCuid(value: string): boolean {
  return /^c[a-z0-9]{20,30}$/.test(value);
}

// Trả về path nội bộ nếu nhận ra, null nếu không
function resolveQR(text: string): string | null {
  const trimmed = text.trim();

  // Thử parse URL — lấy path /products/{id} hoặc /p/{sku}
  try {
    const { pathname } = new URL(trimmed);
    const productMatch = pathname.match(/^\/products\/([^/]+)$/);
    if (productMatch) return `/products/${productMatch[1]}`;
    const shortMatch = pathname.match(/^\/p\/([^/]+)$/);
    if (shortMatch) return `/p/${shortMatch[1]}`;
  } catch {
    /* không phải URL */
  }

  // cuid thuần
  if (isCuid(trimmed)) return `/products/${trimmed}`;

  return null;
}

type ScanState = "requesting" | "scanning" | "error";

export default function QRScanner() {
  const router = useRouter();
  const scannerRef = useRef<any>(null);
  const processingRef = useRef(false);
  const [state, setState] = useState<ScanState>("requesting");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleScan(text: string) {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      // 1. Thử resolve trực tiếp (URL hoặc cuid)
      const path = resolveQR(text);
      if (path) {
        router.push(path);
        return;
      }

      // 2. Thử lookup SKU
      try {
        const product = await apiClient.get<{ id: string }>(
          `/products/sku/${encodeURIComponent(text.trim())}`,
        );
        if (product?.id) {
          router.push(`/p/${product.sku}`);
          return;
        }
      } catch {
        /* không phải SKU */
      }

      // 3. Không nhận ra
      showToast("Không tìm thấy sản phẩm");
    } finally {
      // Cho phép scan lại sau 1.5s
      setTimeout(() => {
        processingRef.current = false;
      }, 1500);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        const scanner = new Html5Qrcode(VIDEO_ID);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1,
          },
          (text) => handleScan(text),
          () => {},
        );

        if (!cancelled) setState("scanning");
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(
          err?.message?.toLowerCase().includes("permission")
            ? "Vui lòng cấp quyền camera để quét mã QR"
            : "Không thể khởi động camera",
        );
        setState("error");
      }
    }

    start();
    return () => {
      cancelled = true;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden bg-black"
      style={{ minHeight: 360 }}
    >
      {/* Camera feed */}
      <div id={VIDEO_ID} className="w-full" style={{ minHeight: 360 }} />

      {/* Requesting */}
      {state === "requesting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm">Đang khởi động camera...</p>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black px-6 text-center">
          <p className="text-red-400 text-sm">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-white text-black text-sm rounded-lg font-medium"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Scanning frame */}
      {state === "scanning" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-60 h-60 relative">
            <span className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-white rounded-tl-md" />
            <span className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-white rounded-tr-md" />
            <span className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-white rounded-bl-md" />
            <span className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-white rounded-br-md" />
            {/* Scan line animation */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-white/60 animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            top: 0;
          }
          50% {
            top: calc(100% - 2px);
          }
        }
      `}</style>
    </div>
  );
}
