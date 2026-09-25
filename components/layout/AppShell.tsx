import { useState, type ReactNode } from "react";

import { MobileNav } from "@/components/layout/MobileNav";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function AppShell({ title, storeName, children }: { title: string; storeName?: string; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="min-h-screen bg-page"><Sidebar /><MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} /><div className="lg:pl-[var(--sidebar-width)]"><TopBar title={title} storeName={storeName} onMenuClick={() => setMobileOpen(true)} /><main><PageContainer>{children}</PageContainer></main></div></div>;
}
