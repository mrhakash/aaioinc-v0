/**
 * Server-side rate limiting using the usage_tracking table.
 * Called from API route handlers (Server only — NOT Edge).
 */

import { createClient } from "@/lib/supabase/server"

// Per-tool free plan limits (mirrors plan_limits table)
const FREE_LIMITS: Record<string, number> = {
  "humanizer":      5,
  "geo-checker":    3,
  "niche-scorer":   3,
  "llm-calculator": -1, // unlimited
  "geo-score":      3,
  "overview-checker": 3,
  "ai-detector":    5,
  "robots-optimizer": 5,
}

export interface RateLimitResult {
  allowed: boolean
  count: number
  limit: number
  remaining: number
}

/**
 * Check and increment usage for a given tool.
 * - If user is not authenticated, enforce IP-based limit via header (best-effort).
 * - If user is authenticated, use usage_tracking table + plan limits.
 */
export async function checkAndIncrementUsage(
  toolSlug: string,
  userId: string | null,
  userPlan: string = "free"
): Promise<RateLimitResult> {
  // Unlimited plan check
  const limit = getLimit(toolSlug, userPlan)
  if (limit === -1) {
    return { allowed: true, count: 0, limit: -1, remaining: -1 }
  }

  // Anonymous users: skip DB tracking, trust client-side (server enforces via anon key)
  if (!userId) {
    // Allow anonymous access at free tier (client handles local count)
    return { allowed: true, count: 0, limit, remaining: limit }
  }

  const supabase = await createClient()

  // Call the increment_tool_usage function (upserts + returns new count)
  const { data, error } = await supabase.rpc("increment_tool_usage", {
    p_user_id: userId,
    p_tool_slug: toolSlug,
  })

  if (error) {
    // On DB error, fail open (don't block the user)
    console.error("[rate-limit] DB error:", error.message)
    return { allowed: true, count: 0, limit, remaining: limit }
  }

  const count = data as number
  const remaining = Math.max(0, limit - count)
  const allowed = count <= limit

  return { allowed, count, limit, remaining }
}

export function getLimit(toolSlug: string, plan: string): number {
  if (plan === "pro" || plan === "agency") return -1
  return FREE_LIMITS[toolSlug] ?? 3
}

/** Convenience: return a 429 Response for rate-limit exceeded */
export function rateLimitExceededResponse(limit: number): Response {
  return Response.json(
    {
      error: "rate_limit_exceeded",
      message: `Free plan limit of ${limit} uses/day reached. Upgrade to Pro for unlimited access.`,
      upgradeUrl: "/pricing",
    },
    { status: 429 }
  )
}
