import React from "react";
import { clsx } from "clsx";
import { FormLabel } from "./FormLabel";
import { FormError } from "./FormError";
import { FormDescription } from "./FormDescription";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx("flex flex-col gap-0.5", className)}>
      {label && (
        <FormLabel htmlFor={htmlFor} required={required}>
          {label}
        </FormLabel>
      )}
      {children}
      {description && !error && (
        <FormDescription>{description}</FormDescription>
      )}
      {error && <FormError message={error} />}
    </div>
  );
}
