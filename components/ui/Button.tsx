import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600",
  secondary: "border border-border bg-surface text-content hover:bg-surface-muted focus-visible:ring-brand-600",
  ghost: "text-content-muted hover:bg-surface-muted hover:text-content focus-visible:ring-brand-600",
  danger: "bg-danger-700 text-white hover:bg-danger-700 focus-visible:ring-danger-700",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-control font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-sm"
      } ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
