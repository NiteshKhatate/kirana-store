import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/auth-context";
import type { CategoryInput } from "@/schemas/catalog";

export type Category = { id: string; storeId: string; name: string; description: string | null; createdAt: string; updatedAt: string };

export function useCategories() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.categories, queryFn: () => apiRequest<Category[]>(session, "/api/categories"), enabled: Boolean(session) });
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id?: string; input: CategoryInput }) => apiRequest<Category[] | Category>(session, id ? `/api/categories/${id}` : "/api/categories", { method: id ? "PATCH" : "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
  });
  return { ...query, saveCategory: mutation.mutateAsync, isSaving: mutation.isPending, saveError: mutation.error };
}
