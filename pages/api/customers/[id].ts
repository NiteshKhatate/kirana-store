import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody } from "@/lib/validation";
import { customerUpdateSchema } from "@/schemas/catalog";
import { getCustomer, updateCustomer } from "@/services/customer.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof getCustomer>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (request.method !== "GET" && request.method !== "PATCH") { if (!requireMethod(request, response, "GET")) return; } try { const { store } = await requireStoreContext(request); const id = queryString(request.query.id); if (!id) { response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: "Customer id is required" } }); return; } if (request.method === "GET") { response.status(200).json({ data: await getCustomer(store.id, id), error: null }); return; } response.status(200).json({ data: await updateCustomer(store.id, id, parseJsonBody(customerUpdateSchema, request.body)), error: null }); } catch (error) { sendApiError(response, error); } }
