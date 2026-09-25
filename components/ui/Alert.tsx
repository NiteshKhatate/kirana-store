import type { ReactNode } from "react";

type AlertProps = { tone?: "info" | "success" | "warning" | "danger"; children: ReactNode };

const tones = {
  info: "border-info-700/20 bg-info-50 text-info-700",
  success: "border-success-700/20 bg-success-50 text-success-700",
  warning: "border-warning-700/20 bg-warning-50 text-warning-700",
  danger: "border-danger-700/20 bg-danger-50 text-danger-700",
};

export function Alert({ tone = "info", children }: AlertProps) {
  return <div className={`rounded-control border px-4 py-3 text-sm ${tones[tone]}`} role="status">{children}</div>;
}
