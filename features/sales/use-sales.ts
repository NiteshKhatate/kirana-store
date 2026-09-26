/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-context";
import { apiRequest } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { SaleInput } from "@/schemas/catalog";
export type Sale = { id: string; saleNumber: string; customer?: { name: string } | null; saleDate: string; total: string; amountPaid: string; paymentStatus: string; items?: any[] };
export type SaleFilters = { from?: string; to?: string; paymentStatus?: string; page: number; pageSize: number };
export function useSales(filters: SaleFilters) { const { session } = useAuth(); const client = useQueryClient(); const query = useQuery({ queryKey: queryKeys.sales(filters), queryFn: () => apiRequest<{ items: Sale[]; total: number; page: number; pageSize: number }>(session, `/api/sales?page=${filters.page}&pageSize=${filters.pageSize}${filters.paymentStatus ? `&paymentStatus=${filters.paymentStatus}` : ""}`), enabled: Boolean(session) }); const mutation = useMutation({ mutationFn: (input: SaleInput) => apiRequest<Sale>(session, "/api/sales", { method: "POST", body: JSON.stringify(input) }), onSuccess: () => client.invalidateQueries({ queryKey: ["sales"] }) }); return { ...query, createSale: mutation.mutateAsync, isSaving: mutation.isPending, saveError: mutation.error }; }
export function useSale(id?: string) { const { session } = useAuth(); return useQuery({ queryKey: queryKeys.sale(id ?? ""), queryFn: () => apiRequest<Sale>(session, `/api/sales/${id}`), enabled: Boolean(session && id) }); }
