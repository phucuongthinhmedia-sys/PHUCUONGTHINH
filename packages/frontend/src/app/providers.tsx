"use client";

import { WishlistProvider } from "@/lib/wishlist-context";
import { AuthProvider } from "@repo/shared-utils";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </AuthProvider>
  );
}
