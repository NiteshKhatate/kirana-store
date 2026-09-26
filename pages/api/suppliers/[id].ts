import type { NextApiRequest, NextApiResponse } from "next";

import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody } from "@/lib/validation";
import { supplierUpdateSchema } from "@/schemas/catalog";
import { getSupplier, updateSupplier } from "@/services/supplier.service";
import type { ApiResponse } from "@/types/api";

type Supplier = Awaited<ReturnType<typeof getSupplier>>;

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Supplier>>) {
  if (request.method !== "GET" && request.method !== "PATCH") {
    if (!requireMethod(request, response, "GET")) return;
  }
  try {
    const { store } = await requireStoreContext(request);
    const id = queryString(request.query.id);
    if (!id) {
      response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: "Supplier id is required" } });
      return;
    }
    if (request.method === "GET") {
      response.status(200).json({ data: await getSupplier(store.id, id), error: null });
      return;
    }
    response.status(200).json({ data: await updateSupplier(store.id, id, parseJsonBody(supplierUpdateSchema, request.body)), error: null });
  } catch (error) {
    sendApiError(response, error);
  }
}
