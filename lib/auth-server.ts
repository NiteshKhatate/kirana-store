import { createClient, type User as SupabaseUser } from "@supabase/supabase-js";
import type { NextApiRequest } from "next";

import { ApiError } from "@/lib/api-errors";

function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new ApiError("INTERNAL_ERROR", "Supabase is not configured", 500);
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getBearerToken(request: NextApiRequest): string | null {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

export async function requireAuthenticatedUser(
  request: NextApiRequest,
): Promise<SupabaseUser> {
  const token = getBearerToken(request);
  if (!token) {
    throw new ApiError("UNAUTHORIZED", "Authentication is required", 401);
  }

  const { data, error } = await getServerSupabaseClient().auth.getUser(token);
  if (error || !data.user) {
    throw new ApiError("UNAUTHORIZED", "Authentication is required", 401);
  }

  return data.user;
}
