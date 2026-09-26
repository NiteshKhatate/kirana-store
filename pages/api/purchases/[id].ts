import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { getPurchase } from "@/services/purchase.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof getPurchase>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (!requireMethod(request, response, "GET")) return; try { const { store } = await requireStoreContext(request); const id = queryString(request.query.id); if (!id) { response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: "Purchase id is required" } }); return; } response.status(200).json({ data: await getPurchase(store.id, id), error: null }); } catch (error) { sendApiError(response, error); } }
