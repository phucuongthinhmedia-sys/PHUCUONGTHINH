"use client";

import { useEffect, useRef } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

/**
 * Subscribes to the backend SSE stream at /products/events.
 * Calls `onEvent` whenever a product is created, updated, or deleted.
 * Automatically reconnects on disconnect.
 */
export function useProductEvents(onEvent: () => void) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("cms_auth_token")
          : null;

      // EventSource doesn't support custom headers, so we pass token as query param
      const url = `${API_URL}/products/events${token ? `?token=${token}` : ""}`;
      es = new EventSource(url);

      es.onmessage = () => {
        onEventRef.current();
      };

      es.onerror = () => {
        es.close();
        // Reconnect after 3s
        retryTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      es?.close();
      clearTimeout(retryTimeout);
    };
  }, []);
}
