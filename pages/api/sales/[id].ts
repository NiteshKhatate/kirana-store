import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { getSale } from "@/services/sale.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof getSale>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (!requireMethod(request, response, "GET")) return; try { const { store } = await requireStoreContext(request); const id = queryString(request.query.id); if (!id) { response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: "Sale id is required" } }); return; } response.status(200).json({ data: await getSale(store.id, id), error: null }); } catch (error) { sendApiError(response, error); } }
