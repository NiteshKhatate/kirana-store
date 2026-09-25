import { forwardRef, type SelectHTMLAttributes } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`h-11 w-full rounded-control border border-border bg-surface px-3 text-sm text-content outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:bg-surface-muted ${className}`}
        {...props}
      />
    );
  },
);
