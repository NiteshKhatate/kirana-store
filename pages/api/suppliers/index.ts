import type { NextApiRequest, NextApiResponse } from "next";

import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody, parseWithSchema } from "@/lib/validation";
import { supplierListQuerySchema, supplierSchema } from "@/schemas/catalog";
import { createSupplier, listSuppliers } from "@/services/supplier.service";
import type { ApiResponse } from "@/types/api";

type SupplierList = Awaited<ReturnType<typeof listSuppliers>>;

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<SupplierList | Awaited<ReturnType<typeof createSupplier>>>>) {
  if (request.method !== "GET" && request.method !== "POST") {
    if (!requireMethod(request, response, "GET")) return;
  }
  try {
    const { store } = await requireStoreContext(request);
    if (request.method === "GET") {
      const filters = parseWithSchema(supplierListQuerySchema, { search: queryString(request.query.search), page: queryString(request.query.page), pageSize: queryString(request.query.pageSize) });
      response.status(200).json({ data: await listSuppliers(store.id, filters), error: null });
      return;
    }
    response.status(201).json({ data: await createSupplier(store.id, parseJsonBody(supplierSchema, request.body)), error: null });
  } catch (error) {
    sendApiError(response, error);
  }
}
