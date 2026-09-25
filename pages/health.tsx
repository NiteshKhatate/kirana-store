import Head from "next/head";

import { useHealthQuery } from "@/features/health/use-health-query";

export default function HealthPage() {
  const health = useHealthQuery();

  return (
    <>
      <Head>
        <title>System health</title>
      </Head>
      <main>
        <h1>System health</h1>
        {health.isPending && <p>Checking services…</p>}
        {health.isError && <p role="alert">{health.error.message}</p>}
        {health.data && (
          <p>
            Application: {health.data.status}; Database: {health.data.database}
          </p>
        )}
        <button type="button" onClick={() => void health.refetch()}>
          Refresh
        </button>
      </main>
    </>
  );
}
