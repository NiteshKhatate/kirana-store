import { useEffect, useState } from "react";
import Head from "next/head";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { AppShell } from "@/components/layout/AppShell";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/features/auth/auth-context";

type CurrentStore = {
  user: { email: string | null; displayName: string | null };
  store: { id: string; name: string };
  membership: { role: string };
};

export default function DashboardPage() {
  const { session } = useAuth();
  const [currentStore, setCurrentStore] = useState<CurrentStore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    void fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (response) => {
        const result = (await response.json()) as {
          data: CurrentStore | null;
          error: { message: string } | null;
        };
        if (!response.ok || result.error) {
          throw new Error(result.error?.message ?? "Unable to load store");
        }
        setCurrentStore(result.data);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "Unable to load store");
      });
  }, [session]);

  return (
    <>
      <Head>
        <title>Dashboard | Kirana Store Manager</title>
      </Head>
      <AppShell title="Dashboard" storeName={currentStore?.store.name}>
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-sm font-semibold text-brand-600">Overview</p><h2 className="mt-1 text-2xl font-bold text-content">Good to see you</h2><p className="mt-1 text-sm text-content-muted">Your store operations at a glance.</p></div>
            <LogoutButton />
          </div>
          {error && <Alert tone="danger">{error}</Alert>}
          {!currentStore && !error && <LoadingState label="Loading your store workspace…" />}
          {currentStore && <div className="grid gap-4 md:grid-cols-3"><Card className="p-5"><p className="text-sm text-content-muted">Current store</p><p className="mt-2 text-lg font-bold text-content">{currentStore.store.name}</p><Badge className="mt-3" tone="info">{currentStore.membership.role}</Badge></Card><Card className="p-5"><p className="text-sm text-content-muted">Today’s sales</p><p className="mt-2 text-2xl font-bold text-content">—</p><p className="mt-1 text-xs text-content-muted">Sales module coming next</p></Card><Card className="p-5"><p className="text-sm text-content-muted">Inventory alerts</p><p className="mt-2 text-2xl font-bold text-content">—</p><p className="mt-1 text-xs text-content-muted">Inventory module coming next</p></Card></div>}
        </div>
      </AppShell>
    </>
  );
}
