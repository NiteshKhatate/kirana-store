import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody, parseWithSchema } from "@/lib/validation";
import { customerListQuerySchema, customerSchema } from "@/schemas/catalog";
import { createCustomer, listCustomers } from "@/services/customer.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof listCustomers>> | Awaited<ReturnType<typeof createCustomer>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (request.method !== "GET" && request.method !== "POST") { if (!requireMethod(request, response, "GET")) return; } try { const { store } = await requireStoreContext(request); if (request.method === "GET") { const filters = parseWithSchema(customerListQuerySchema, { search: queryString(request.query.search), page: queryString(request.query.page), pageSize: queryString(request.query.pageSize) }); response.status(200).json({ data: await listCustomers(store.id, filters), error: null }); return; } response.status(201).json({ data: await createCustomer(store.id, parseJsonBody(customerSchema, request.body)), error: null }); } catch (error) { sendApiError(response, error); } }
