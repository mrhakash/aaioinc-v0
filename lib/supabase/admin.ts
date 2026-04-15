import "server-only"
import { createClient } from "@supabase/supabase-js"

/**
 * Supabase admin client using the service role key.
 * Bypasses RLS — only use in trusted server contexts (webhooks, migrations).
 * NEVER expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export async function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
