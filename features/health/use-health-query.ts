import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse } from "@/types/api";

type HealthData = {
  status: "ok";
  database: "ok";
};

async function fetchHealth(): Promise<HealthData> {
  const response = await fetch("/api/health");
  const result = (await response.json()) as ApiResponse<HealthData>;

  if (!response.ok || result.error) {
    throw new Error(result.error?.message ?? "Health check failed");
  }

  return result.data;
}

export function useHealthQuery() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: fetchHealth,
  });
}
