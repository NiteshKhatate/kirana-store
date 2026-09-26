import type { NextApiRequest, NextApiResponse } from "next";
import { requireStoreContext, queryString } from "@/lib/api-auth";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody } from "@/lib/validation";
import { creditAdjustmentSchema, creditPaymentSchema } from "@/schemas/catalog";
import { createCreditAdjustment, createCreditPayment, listCreditEntries } from "@/services/credit.service";
import type { ApiResponse } from "@/types/api";
type Result = Awaited<ReturnType<typeof listCreditEntries>> | Awaited<ReturnType<typeof createCreditPayment>> | Awaited<ReturnType<typeof createCreditAdjustment>>;
export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Result>>) { if (request.method !== "GET" && request.method !== "POST") { if (!requireMethod(request, response, "GET")) return; } try { const { store, user } = await requireStoreContext(request); const id = queryString(request.query.id); if (!id) { response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: "Customer id is required" } }); return; } if (request.method === "GET") { response.status(200).json({ data: await listCreditEntries(store.id, id, { from: queryString(request.query.from), to: queryString(request.query.to) }), error: null }); return; } if (queryString(request.query.action) === "adjustment") { response.status(201).json({ data: await createCreditAdjustment(store.id, user.id, id, parseJsonBody(creditAdjustmentSchema, request.body)), error: null }); return; } response.status(201).json({ data: await createCreditPayment(store.id, user.id, id, parseJsonBody(creditPaymentSchema, request.body)), error: null }); } catch (error) { sendApiError(response, error); } }
