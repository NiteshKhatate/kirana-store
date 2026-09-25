export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <div className="rounded-card border border-border bg-surface p-8 text-center text-sm text-content-muted" role="status">{label}</div>;
}
