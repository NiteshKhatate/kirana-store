import { forwardRef, type InputHTMLAttributes } from "react";

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className = "", type = "checkbox", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={`h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-600 ${className}`}
        {...props}
      />
    );
  },
);
