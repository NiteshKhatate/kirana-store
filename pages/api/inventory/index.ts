import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody, parseWithSchema } from "@/lib/validation";
import { inventoryAdjustmentSchema, inventoryListQuerySchema } from "@/schemas/catalog";
import { adjustInventory, listInventory } from "@/services/inventory.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof listInventory>> | Awaited<ReturnType<typeof adjustInventory>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (request.method !== "GET" && request.method !== "POST") { if (!requireMethod(request, response, "GET")) return; } try { const { store, user } = await requireStoreContext(request); if (request.method === "GET") { const filters = parseWithSchema(inventoryListQuerySchema, { search: queryString(request.query.search), categoryId: queryString(request.query.categoryId), status: queryString(request.query.status), page: queryString(request.query.page), pageSize: queryString(request.query.pageSize) }); response.status(200).json({ data: await listInventory(store.id, filters), error: null }); return; } response.status(201).json({ data: await adjustInventory(store.id, user.id, parseJsonBody(inventoryAdjustmentSchema, request.body)), error: null }); } catch (error) { sendApiError(response, error); } }
