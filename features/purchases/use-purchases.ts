/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-context";
import { apiRequest } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { PurchaseInput } from "@/schemas/catalog";
export type Purchase = { id: string; supplier?: { name: string } | null; invoiceNumber: string | null; purchaseDate: string; total: string; subtotal: string; discount: string; tax: string; items?: any[] };
export type PurchaseFilters = { from?: string; to?: string; supplierId?: string; page: number; pageSize: number };
export function usePurchases(filters: PurchaseFilters) { const { session } = useAuth(); const client = useQueryClient(); const query = useQuery({ queryKey: queryKeys.purchases(filters), queryFn: () => apiRequest<{ items: Purchase[]; total: number; page: number; pageSize: number }>(session, `/api/purchases?page=${filters.page}&pageSize=${filters.pageSize}${filters.supplierId ? `&supplierId=${filters.supplierId}` : ""}`), enabled: Boolean(session) }); const mutation = useMutation({ mutationFn: (input: PurchaseInput) => apiRequest<Purchase>(session, "/api/purchases", { method: "POST", body: JSON.stringify(input) }), onSuccess: () => client.invalidateQueries({ queryKey: ["purchases"] }) }); return { ...query, createPurchase: mutation.mutateAsync, isSaving: mutation.isPending, saveError: mutation.error }; }
export function usePurchase(id?: string) { const { session } = useAuth(); return useQuery({ queryKey: queryKeys.purchase(id ?? ""), queryFn: () => apiRequest<Purchase>(session, `/api/purchases/${id}`), enabled: Boolean(session && id) }); }
