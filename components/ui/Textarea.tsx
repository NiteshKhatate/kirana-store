import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`min-h-28 w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-content outline-none placeholder:text-content-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:bg-surface-muted ${className}`}
        {...props}
      />
    );
  },
);
