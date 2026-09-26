/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-context";
import { apiRequest } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
export function useReport(type: string, filters: Record<string, string | undefined> = {}) { const { session } = useAuth(); const query = new URLSearchParams({ type }); Object.entries(filters).forEach(([key, value]) => { if (value) query.set(key, value); }); return useQuery({ queryKey: queryKeys.reports(type, filters), queryFn: () => apiRequest<any>(session, `/api/reports?${query.toString()}`), enabled: Boolean(session) }); }
export function useDashboardSummary() { const { session } = useAuth(); return useQuery({ queryKey: queryKeys.dashboardSummary(), queryFn: () => apiRequest<any>(session, "/api/dashboard-summary"), enabled: Boolean(session) }); }
