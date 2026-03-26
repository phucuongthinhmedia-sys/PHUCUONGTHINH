"use client";

import { useEffect, useRef } from "react";
import { API_URL } from "@/lib/constants";

/**
 * Subscribes to backend SSE stream at /products/events.
 * Calls `onEvent` whenever a product is created, updated, or deleted.
 * If `productId` is provided, only fires when that specific product changes.
 * Auto-reconnects on disconnect.
 *
 * DISABLED: SSE not working through Next.js API proxy
 */
export function useProductEvents(onEvent: () => void, productId?: string) {
  // Temporarily disabled - SSE causes timeout through Next.js proxy
  // TODO: Use direct backend connection or WebSocket instead
  return;
}
