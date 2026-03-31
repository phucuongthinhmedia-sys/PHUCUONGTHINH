"use client";

import { useEffect, useRef } from "react";
import { clientCache } from "@/lib/cache-utils";

/**
 * Subscribes to backend SSE stream at /products/events.
 * Calls `onEvent` whenever a product is created, updated, or deleted.
 * If `productId` is provided, only fires when that specific product changes.
 * Auto-reconnects on disconnect.
 */
export function useProductEvents(onEvent: () => void, productId?: string) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Get backend URL from environment
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const url = `${backendUrl}/api/v1/products/events`;

    const connect = () => {
      try {
        // Close existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // Create new EventSource - direct connection to backend (bypass Next.js proxy)
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log("✅ SSE connected to product events");
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("📡 Product event received:", data);

            // Invalidate cache for the affected product
            if (data.productId) {
              clientCache.invalidateProduct(data.productId);
            }

            // If productId filter is set, only trigger for matching product
            if (productId && data.productId !== productId) {
              return;
            }

            // Trigger callback
            onEvent();
          } catch (err) {
            console.error("Failed to parse SSE event:", err);
          }
        };

        eventSource.onerror = (error) => {
          console.error("❌ SSE error:", error);
          eventSource.close();

          // Auto-reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔄 Reconnecting SSE...");
            connect();
          }, 3000);
        };
      } catch (err) {
        console.error("Failed to create EventSource:", err);
      }
    };

    connect();

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [onEvent, productId]);
}
