import Head from "next/head";

import { useHealthQuery } from "@/features/health/use-health-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";

export default function HealthPage() {
  const health = useHealthQuery();

  return (
    <>
      <Head>
        <title>System health</title>
      </Head>
      <main className="min-h-screen bg-page"><PageContainer><Card className="mx-auto max-w-xl p-6"><div className="mb-6"><p className="text-sm font-bold text-brand-600">System diagnostics</p><h1 className="mt-1 text-2xl font-bold text-content">System health</h1><p className="mt-1 text-sm text-content-muted">Verify the application and database are reachable.</p></div>{health.isPending && <LoadingState label="Checking services…" />}{health.isError && <ErrorState message={health.error.message} onRetry={() => void health.refetch()} />}{health.data && <Alert tone="success">Application: {health.data.status}; Database: {health.data.database}</Alert>}<Button className="mt-5" variant="secondary" type="button" onClick={() => void health.refetch()}>Refresh</Button></Card></PageContainer></main>
    </>
  );
}
