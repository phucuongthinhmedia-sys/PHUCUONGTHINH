"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  unit: "m2" | "thùng" | "bộ" | "viên";
}

interface StoreContextType {
  // Quote cart
  items: CartItem[];
  addItem: (product: Product, quantity: number, unit: CartItem["unit"]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("pct_quote_cart");
      if (savedCart) setItems(JSON.parse(savedCart));
    } catch {
      // ignore corrupt data
    }
    try {
      const savedWishlist = localStorage.getItem("pct_wishlist");
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
    } catch {
      // ignore corrupt data
    }
    setIsLoaded(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pct_quote_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Persist wishlist
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pct_wishlist", JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isLoaded]);

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

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const isInWishlist = (id: string) => wishlistIds.includes(id);

  return (
    <StoreContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount: items.length,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context)
    throw new Error("useStore must be used within a QuoteCartProvider");
  return context;
}

export function useQuoteCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, itemCount } =
    useStore();
  return { items, addItem, removeItem, updateQuantity, clearCart, itemCount };
}

export function useWishlist() {
  const { wishlistIds, toggleWishlist, isInWishlist } = useStore();
  return { wishlist: wishlistIds, toggleWishlist, isInWishlist };
}

// Alias for backward compatibility
export const WishlistProvider = QuoteCartProvider;
