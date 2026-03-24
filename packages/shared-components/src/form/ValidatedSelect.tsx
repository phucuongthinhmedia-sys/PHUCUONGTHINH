import React from "react";
import { clsx } from "clsx";

export interface ValidatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const ValidatedSelect = React.forwardRef<
  HTMLSelectElement,
  ValidatedSelectProps
>(({ error, className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      aria-invalid={!!error}
      className={clsx(
        "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

ValidatedSelect.displayName = "ValidatedSelect";
