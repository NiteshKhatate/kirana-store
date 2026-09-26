import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody, parseWithSchema } from "@/lib/validation";
import { purchaseListQuerySchema, purchaseSchema } from "@/schemas/catalog";
import { createPurchase, listPurchases } from "@/services/purchase.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof listPurchases>> | Awaited<ReturnType<typeof createPurchase>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (request.method !== "GET" && request.method !== "POST") { if (!requireMethod(request, response, "GET")) return; } try { const { store, user } = await requireStoreContext(request); if (request.method === "GET") { const filters = parseWithSchema(purchaseListQuerySchema, { from: queryString(request.query.from), to: queryString(request.query.to), supplierId: queryString(request.query.supplierId), page: queryString(request.query.page), pageSize: queryString(request.query.pageSize) }); response.status(200).json({ data: await listPurchases(store.id, filters), error: null }); return; } response.status(201).json({ data: await createPurchase(store.id, user.id, parseJsonBody(purchaseSchema, request.body)), error: null }); } catch (error) { sendApiError(response, error); } }
