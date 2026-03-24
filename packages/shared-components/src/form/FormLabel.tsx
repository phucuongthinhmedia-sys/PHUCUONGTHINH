import React from "react";
import { clsx } from "clsx";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({
  children,
  required,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={clsx(
        "block text-sm font-medium text-gray-700 mb-1",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
