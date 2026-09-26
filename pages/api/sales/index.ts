import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody, parseWithSchema } from "@/lib/validation";
import { saleListQuerySchema, saleSchema } from "@/schemas/catalog";
import { createSale, listSales } from "@/services/sale.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof listSales>> | Awaited<ReturnType<typeof createSale>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (request.method !== "GET" && request.method !== "POST") { if (!requireMethod(request, response, "GET")) return; } try { const { store, user } = await requireStoreContext(request); if (request.method === "GET") { const filters = parseWithSchema(saleListQuerySchema, { from: queryString(request.query.from), to: queryString(request.query.to), paymentStatus: queryString(request.query.paymentStatus), page: queryString(request.query.page), pageSize: queryString(request.query.pageSize) }); response.status(200).json({ data: await listSales(store.id, filters), error: null }); return; } response.status(201).json({ data: await createSale(store.id, user.id, parseJsonBody(saleSchema, request.body)), error: null }); } catch (error) { sendApiError(response, error); } }
