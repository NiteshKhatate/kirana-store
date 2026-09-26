import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/purchases", label: "Purchases" },
  { href: "/sales", label: "Sales" },
  { href: "/inventory", label: "Inventory" },
  { href: "/customers", label: "Customers" },
  { href: "/reports", label: "Reports" },
];

export function Sidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const router = useRouter();

  return (
    <aside className={mobile ? "flex h-full w-72 flex-col bg-surface p-4" : "fixed inset-y-0 left-0 hidden w-[var(--sidebar-width)] flex-col border-r border-border bg-surface p-4 lg:flex"}>
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-control bg-brand-600 font-bold text-white">K</div>
        <div><p className="font-bold text-content">Kirana Manager</p><p className="text-xs text-content-muted">Store operations</p></div>
      </div>
      <nav className="space-y-1" aria-label="Main navigation">
        {links.map((link) => {
          const active = router.pathname === link.href;
          return <Link key={link.href} href={link.href} onClick={onNavigate} className={`flex min-h-11 items-center rounded-control px-3 text-sm font-semibold transition-colors ${active ? "bg-brand-50 text-brand-700" : "text-content-muted hover:bg-surface-muted hover:text-content"}`}>{link.label}</Link>;
        })}
      </nav>
    </aside>
  );
}
