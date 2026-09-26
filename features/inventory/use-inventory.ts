/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-context";
import { apiRequest } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { z } from "zod";
import { inventoryAdjustmentSchema } from "@/schemas/catalog";
export type InventoryFilters = { search?: string; categoryId?: string; status: "LOW" | "OUT" | "ALL"; page: number; pageSize: number };
export type InventoryRow = { id: string; productId: string; name: string; sku: string; category: { id: string; name: string } | null; quantity: string; reorderLevel: string; defaultBuyPrice: string | null; mrp: string; status: string };
export function useInventory(filters: InventoryFilters) { const { session } = useAuth(); const client = useQueryClient(); const query = useQuery({ queryKey: queryKeys.inventory(filters), queryFn: () => apiRequest<{ items: InventoryRow[]; total: number; page: number; pageSize: number }>(session, `/api/inventory?page=${filters.page}&pageSize=${filters.pageSize}&status=${filters.status}&search=${encodeURIComponent(filters.search ?? "")}${filters.categoryId ? `&categoryId=${filters.categoryId}` : ""}`), enabled: Boolean(session) }); const mutation = useMutation({ mutationFn: (input: z.infer<typeof inventoryAdjustmentSchema>) => apiRequest<any>(session, "/api/inventory", { method: "POST", body: JSON.stringify(input) }), onSuccess: () => client.invalidateQueries({ queryKey: ["inventory"] }) }); return { ...query, adjust: mutation.mutateAsync, isSaving: mutation.isPending, saveError: mutation.error }; }
