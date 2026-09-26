import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { dashboardSummary } from "@/services/report.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof dashboardSummary>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (!requireMethod(request, response, "GET")) return; try { const { store } = await requireStoreContext(request); response.status(200).json({ data: await dashboardSummary(store.id), error: null }); } catch (error) { sendApiError(response, error); } }
