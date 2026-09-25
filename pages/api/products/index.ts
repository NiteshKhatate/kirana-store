import type { NextApiRequest, NextApiResponse } from "next";

import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody, parseWithSchema } from "@/lib/validation";
import { listQuerySchema, productSchema } from "@/schemas/catalog";
import { createProduct, listProducts } from "@/services/product.service";
import type { ApiResponse } from "@/types/api";

type ProductList = Awaited<ReturnType<typeof listProducts>>;
type Product = Awaited<ReturnType<typeof createProduct>>;

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<ProductList | Product>>) {
  if (request.method !== "GET" && request.method !== "POST") {
    if (!requireMethod(request, response, "GET")) return;
  }

  try {
    const { store } = await requireStoreContext(request);
    if (request.method === "GET") {
      const filters = parseWithSchema(listQuerySchema, {
        search: queryString(request.query.search),
        status: queryString(request.query.status),
        categoryId: queryString(request.query.categoryId),
        page: queryString(request.query.page),
        pageSize: queryString(request.query.pageSize),
      });
      response.status(200).json({ data: await listProducts(store.id, filters), error: null });
      return;
    }

    const input = parseJsonBody(productSchema, request.body);
    response.status(201).json({ data: await createProduct(store.id, input), error: null });
  } catch (error) {
    sendApiError(response, error);
  }
}
