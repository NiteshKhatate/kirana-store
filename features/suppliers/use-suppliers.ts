import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/auth-context";
import { apiRequest } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { SupplierInput } from "@/schemas/catalog";

export type Supplier = { id: string; storeId: string; name: string; phone: string | null; address: string | null; gstNumber: string | null; createdAt: string; updatedAt: string };
export type SupplierFilters = { search?: string; page: number; pageSize: number };
export type SupplierList = { items: Supplier[]; total: number; page: number; pageSize: number };

export function useSuppliers(filters: SupplierFilters) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.suppliers(filters), queryFn: () => apiRequest<SupplierList>(session, `/api/suppliers?search=${encodeURIComponent(filters.search ?? "")}&page=${filters.page}&pageSize=${filters.pageSize}`), enabled: Boolean(session) });
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id?: string; input: SupplierInput }) => apiRequest<Supplier>(session, id ? `/api/suppliers/${id}` : "/api/suppliers", { method: id ? "PATCH" : "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
  });
  return { ...query, saveSupplier: mutation.mutateAsync, isSaving: mutation.isPending, saveError: mutation.error };
}
