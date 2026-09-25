import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/auth-context";
import type { ProductInput, ProductUpdateInput } from "@/schemas/catalog";

export type Product = { id: string; storeId: string; categoryId: string | null; sku: string; barcode: string | null; name: string; description: string | null; unit: string; mrp: string; defaultBuyPrice: string | null; defaultSellPrice: string | null; reorderLevel: string; status: string; createdAt: string; updatedAt: string; category?: { id: string; name: string } | null };
export type ProductFilters = { search?: string; status?: "ACTIVE" | "INACTIVE"; categoryId?: string; page?: number; pageSize?: number };
type ProductList = { items: Product[]; total: number; page: number; pageSize: number };

function queryString(filters: ProductFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  return params.toString();
}

export function useProducts(filters: ProductFilters) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.products(filters), queryFn: () => apiRequest<ProductList>(session, `/api/products?${queryString(filters)}`), enabled: Boolean(session) });
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id?: string; input: ProductInput | ProductUpdateInput }) => apiRequest<Product>(session, id ? `/api/products/${id}` : "/api/products", { method: id ? "PATCH" : "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
  return { ...query, saveProduct: mutation.mutateAsync, isSaving: mutation.isPending, saveError: mutation.error };
}
