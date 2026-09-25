import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`h-11 w-full rounded-control border border-border bg-surface px-3 text-sm text-content outline-none placeholder:text-content-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:bg-surface-muted ${className}`}
        {...props}
      />
    );
  },
);
