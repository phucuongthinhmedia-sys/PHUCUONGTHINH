import React from "react";
import { clsx } from "clsx";

export interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <p role="alert" className={clsx("mt-1 text-xs text-red-600", className)}>
      {message}
    </p>
  );
}
