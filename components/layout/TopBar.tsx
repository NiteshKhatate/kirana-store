import { Button } from "@/components/ui/Button";

export function TopBar({ title, storeName, onMenuClick }: { title: string; storeName?: string; onMenuClick: () => void }) {
  return <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation">☰</Button><div><h1 className="text-lg font-bold text-content sm:text-xl">{title}</h1>{storeName && <p className="text-xs text-content-muted">{storeName}</p>}</div></div><div className="hidden text-sm text-content-muted sm:block">Phase 1</div></header>;
}
