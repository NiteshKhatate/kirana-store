import { Sidebar } from "@/components/layout/Sidebar";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-40 lg:hidden"><button type="button" className="absolute inset-0 bg-content/40" onClick={onClose} aria-label="Close navigation" /><div className="relative h-full w-72 shadow-card"><Sidebar mobile onNavigate={onClose} /></div></div>;
}
