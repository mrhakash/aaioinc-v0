import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PLANS, type PlanId } from "@/lib/plans"

export const metadata: Metadata = { title: "Tool History — AAIOINC", robots: { index: false } }

const TOOL_LABELS: Record<string, string> = {
  "geo-checker":      "GEO Score Analyzer",
  "overview-checker": "AI Overview Checker",
  humanizer:          "Content Humanizer",
  "niche-scorer":     "Niche Profitability",
  "llm-calculator":   "LLM Cost Calculator",
  "mcp-config":       "MCP Config Builder",
}

const TOOL_HREFS: Record<string, string> = {
  "geo-checker":      "/tools/geo-checker",
  "overview-checker": "/tools/overview-checker",
  humanizer:          "/tools/humanizer",
  "niche-scorer":     "/tools/niche-scorer",
  "llm-calculator":   "/tools/llm-calculator",
  "mcp-config":       "/tools/mcp-config-builder",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function extractSummary(output: Record<string, unknown> | null): string {
  if (!output) return "Completed"
  if (output.visibilityScore != null) return `Score: ${output.visibilityScore}/100`
  if (output.overall         != null) return `Score: ${output.overall}/100`
  if (output.aiScoreAfter    != null) return `AI score after: ${output.aiScoreAfter}%`
  if (output.triggered       != null) return output.triggered ? "AI Overview found" : "No AI Overview"
  return "Completed"
}

export default async function DashboardToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single()

  const planId = ((profile?.plan as PlanId) || "free")
  const isUnlimited = PLANS[planId].limits.toolRunsPerDay === -1
  // Free plan: show latest 10. Pro+: show all (up to 200 for perf).
  const limit = isUnlimited ? 200 : 10

  const { data: results, count } = await supabase
    .from("tool_results")
    .select("id, tool_slug, created_at, output", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  const total = count ?? 0

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Tool History</h1>
        <span className="font-mono text-xs text-muted-foreground">
          {total === 0 ? "No results yet" : `${results?.length ?? 0} of ${total} results`}
        </span>
      </div>

      {results && results.length > 0 ? (
        <div className="flex flex-col gap-2">
          {results.map((item) => {
            const label   = TOOL_LABELS[item.tool_slug] ?? item.tool_slug
            const href    = TOOL_HREFS[item.tool_slug]  ?? `/tools/${item.tool_slug}`
            const summary = extractSummary(item.output as Record<string, unknown> | null)
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-secondary px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <span className="font-mono text-xs text-primary">{summary}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(item.created_at)}
                  </span>
                  <Link
                    href={href}
                    className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                  >
                    Re-run <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-10 text-center">
          <Package size={24} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No results yet. Run a tool and your history will appear here.
          </p>
          <Link href="/tools/geo-checker" className="mt-3 inline-block font-mono text-xs text-primary hover:underline">
            Try GEO Score Analyzer &rarr;
          </Link>
        </div>
      )}

      {planId === "free" && total > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Upgrade to Pro for full history, unlimited results, and saved comparisons.
          </p>
          <Link
            href="/pricing"
            className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  )
}
