"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number; // Có thể hiểu là số m2, số thùng, hoặc số bộ (với TBVS)
  unit: "m2" | "thùng" | "bộ" | "viên";
}

interface QuoteCartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, unit: CartItem["unit"]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(
  undefined,
);

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("pct_quote_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart data");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pct_quote_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (
    product: Product,
    quantity: number,
    unit: CartItem["unit"],
  ) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity, unit }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setItems([]);

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount: items.length,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (context === undefined) {
    throw new Error("useQuoteCart must be used within a QuoteCartProvider");
  }
  return context;
}

// Aliases để tương thích với các import cũ
export const WishlistProvider = QuoteCartProvider;
export function useWishlist() {
  useQuoteCart(); // ensure context is available
  const [wishlistIds, setWishlistIds] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("pct_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("pct_wishlist", JSON.stringify(next));
      return next;
    });
  };

  return {
    wishlist: wishlistIds,
    isInWishlist: (id: string) => wishlistIds.includes(id),
    toggleWishlist,
  };
}
