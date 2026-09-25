import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, description, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-content">
        {label}
      </label>
      {children}
      {description && <p className="text-xs text-content-muted">{description}</p>}
      {error && <p className="text-sm text-danger-700" role="alert">{error}</p>}
    </div>
  );
}
