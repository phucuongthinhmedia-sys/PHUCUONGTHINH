"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/shared-utils";

export function HomeClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  // Nếu đã authenticated, không render gì (đang redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
