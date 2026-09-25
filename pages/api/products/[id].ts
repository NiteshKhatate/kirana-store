import type { NextApiRequest, NextApiResponse } from "next";

import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody } from "@/lib/validation";
import { productUpdateSchema } from "@/schemas/catalog";
import { getProduct, updateProduct } from "@/services/product.service";
import type { ApiResponse } from "@/types/api";

type Product = Awaited<ReturnType<typeof getProduct>>;

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Product>>) {
  if (request.method !== "GET" && request.method !== "PATCH") {
    if (!requireMethod(request, response, "GET")) return;
  }

  try {
    const { store } = await requireStoreContext(request);
    const id = queryString(request.query.id);
    if (!id) {
      response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: "Product id is required" } });
      return;
    }
    if (request.method === "GET") {
      response.status(200).json({ data: await getProduct(store.id, id), error: null });
      return;
    }

    const input = parseJsonBody(productUpdateSchema, request.body);
    response.status(200).json({ data: await updateProduct(store.id, id, input), error: null });
  } catch (error) {
    sendApiError(response, error);
  }
}
