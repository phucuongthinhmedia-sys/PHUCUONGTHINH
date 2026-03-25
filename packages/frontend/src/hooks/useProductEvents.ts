"use client";

import { useEffect, useRef } from "react";
import { API_URL } from "@/lib/constants";

/**
 * Subscribes to backend SSE stream at /products/events.
 * Calls `onEvent` whenever a product is created, updated, or deleted.
 * If `productId` is provided, only fires when that specific product changes.
 * Auto-reconnects on disconnect.
 */
export function useProductEvents(onEvent: () => void, productId?: string) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource(`${API_URL}/products/events`);

      es.onmessage = (e) => {
        if (productId) {
          try {
            const event = JSON.parse(e.data);
            if (event.productId === productId) onEventRef.current();
          } catch {
            onEventRef.current();
          }
        } else {
          onEventRef.current();
        }
      };

      es.onerror = () => {
        es.close();
        retryTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      es?.close();
      clearTimeout(retryTimeout);
    };
  }, [productId]);
}
