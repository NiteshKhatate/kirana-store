import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { inventoryReport, purchaseReport, salesReport, creditReport } from "@/services/report.service";
import type { ApiResponse } from "@/types/api";
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<unknown>>) { if (!requireMethod(request, response, "GET")) return; try { const { store } = await requireStoreContext(request); const type = queryString(request.query.type); const filters = { from: queryString(request.query.from), to: queryString(request.query.to), categoryId: queryString(request.query.categoryId), supplierId: queryString(request.query.supplierId) }; const data = type === "inventory" ? await inventoryReport(store.id, filters) : type === "sales" ? await salesReport(store.id, filters) : type === "purchases" ? await purchaseReport(store.id, filters) : await creditReport(store.id, filters); response.status(200).json({ data, error: null }); } catch (error) { sendApiError(response, error); } }
