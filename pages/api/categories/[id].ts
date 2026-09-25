import type { NextApiRequest, NextApiResponse } from "next";

import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody } from "@/lib/validation";
import { categorySchema } from "@/schemas/catalog";
import { updateCategory } from "@/services/category.service";
import type { ApiResponse } from "@/types/api";

type Category = Awaited<ReturnType<typeof updateCategory>>;

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Category>>) {
  if (!requireMethod(request, response, "PATCH")) return;

  try {
    const { store } = await requireStoreContext(request);
    const id = queryString(request.query.id);
    if (!id) {
      response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: "Category id is required" } });
      return;
    }
    const input = parseJsonBody(categorySchema, request.body);
    response.status(200).json({ data: await updateCategory(store.id, id, input), error: null });
  } catch (error) {
    sendApiError(response, error);
  }
}
