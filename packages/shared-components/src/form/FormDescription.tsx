import React from "react";
import { clsx } from "clsx";

export interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormDescription({ children, className }: FormDescriptionProps) {
  return (
    <p className={clsx("mt-1 text-xs text-gray-500", className)}>{children}</p>
  );
}
