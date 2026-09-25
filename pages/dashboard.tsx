import { useEffect, useState } from "react";
import Head from "next/head";

import { LogoutButton } from "@/components/layout/LogoutButton";
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
      <main>
        <h1>Dashboard</h1>
        {error && <p role="alert">{error}</p>}
        {currentStore && (
          <p>
            {currentStore.store.name} · {currentStore.membership.role}
          </p>
        )}
        <LogoutButton />
      </main>
    </>
  );
}
