import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";

type HealthData = {
  status: "ok";
  database: "ok";
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<HealthData>>,
) {
  if (!requireMethod(request, response, "GET")) {
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    response.status(200).json({
      data: { status: "ok", database: "ok" },
      error: null,
    });
  } catch (error) {
    console.error("Health check failed", error);
    sendApiError(response, error);
  }
}
