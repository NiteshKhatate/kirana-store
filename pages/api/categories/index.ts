import type { NextApiRequest, NextApiResponse } from "next";

import { requireStoreContext } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody } from "@/lib/validation";
import { categorySchema } from "@/schemas/catalog";
import { createCategory, listCategories } from "@/services/category.service";
import type { ApiResponse } from "@/types/api";

type Category = Awaited<ReturnType<typeof listCategories>>[number];

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Category[]>>) {
  if (request.method !== "GET" && request.method !== "POST") {
    if (!requireMethod(request, response, "GET")) return;
  }

  try {
    const { store } = await requireStoreContext(request);
    if (request.method === "GET") {
      response.status(200).json({ data: await listCategories(store.id), error: null });
      return;
    }

    const input = parseJsonBody(categorySchema, request.body);
    response.status(201).json({ data: [await createCategory(store.id, input)], error: null });
  } catch (error) {
    sendApiError(response, error);
  }
}
