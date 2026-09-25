const PLACEHOLDER_POOLER_HOST = "aws-x-region.pooler.supabase.com";

/**
 * Returns the configured Postgres URL and repairs the starter placeholder
 * that is sometimes copied from Supabase's connection-string template.
 */
export function getDatabaseUrl(): string {
  const configuredUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!configuredUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const url = new URL(configuredUrl);

  if (url.hostname !== PLACEHOLDER_POOLER_HOST) {
    return configuredUrl;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error(
      "DATABASE_URL still contains the Supabase pooler placeholder. Set it to the connection string from Supabase > Connect.",
    );
  }

  const projectHost = new URL(supabaseUrl).hostname;
  const projectRef = projectHost.split(".")[0];

  if (!projectRef) {
    throw new Error(
      "Could not determine the Supabase project reference from NEXT_PUBLIC_SUPABASE_URL.",
    );
  }

  // The direct Supabase database endpoint is deterministic; unlike the pooler,
  // it does not require knowing the project's AWS region.
  url.hostname = `db.${projectRef}.supabase.co`;
  url.username = "postgres";
  url.port = url.port || "5432";

  return url.toString();
}
