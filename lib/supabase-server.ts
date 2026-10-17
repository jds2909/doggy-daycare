import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseServerClient: SupabaseClient | undefined;

export function getSupabaseServerClient(): SupabaseClient {
  if (supabaseServerClient) return supabaseServerClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing required server environment variable: SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing required server environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  supabaseServerClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return supabaseServerClient;
}
