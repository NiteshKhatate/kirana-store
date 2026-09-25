import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center"><h3 className="text-base font-bold text-content">{title}</h3>{description && <p className="mt-1 text-sm text-content-muted">{description}</p>}{action && <div className="mt-4">{action}</div>}</div>;
}
