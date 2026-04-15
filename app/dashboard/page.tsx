import type { Metadata } from "next"
import Link from "next/link"
import {
  Globe, Eye, FileText, DollarSign, ArrowRight,
  Clock, Zap, BarChart3, Package,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PLANS, type PlanId } from "@/lib/plans"

export const metadata: Metadata = { title: "Dashboard — AAIOINC", robots: { index: false } }

const quickLinks = [
  { icon: Globe,     label: "GEO Score Analyzer",  href: "/geo/score",              slug: "geo-checker" },
  { icon: Eye,       label: "AI Overview Checker",  href: "/geo/overview-checker",   slug: "overview-checker" },
  { icon: FileText,  label: "Content Humanizer",    href: "/tools/humanizer",        slug: "humanizer" },
  { icon: DollarSign,label: "LLM Cost Calculator",  href: "/tools/llm-calculator",   slug: "llm-calculator" },
]

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

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1)  return "Just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d === 1) return "Yesterday"
  if (d < 7)  return `${d}d ago`
  return date.toLocaleDateString()
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().split("T")[0]

  const [
    { data: profile },
    { data: recentResults },
    { count: todayCount },
    { count: totalCount },
  ] = await Promise.all([
    supabase.from("profiles").select("full_name, email, plan").eq("id", user.id).single(),
    supabase.from("tool_results")
      .select("tool_slug, created_at, output")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("tool_results")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00Z`),
    supabase.from("tool_results")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ])

  const planId = ((profile?.plan as PlanId) || "free")
  const plan = PLANS[planId]
  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    profile?.email?.split("@")[0] ||
    user.email?.split("@")[0] ||
    "there"

  const usageToday = todayCount ?? 0
  const usageTotal = totalCount ?? 0
  const dailyLimit = plan.limits.toolRunsPerDay
  const isUnlimited = dailyLimit === -1

  return (
    <div className="flex flex-col gap-8 max-w-5xl">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}.</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan.name} plan &mdash;{" "}
          {isUnlimited ? "unlimited tool runs." : `tools reset daily at midnight UTC.`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's runs */}
        <div className="col-span-2 rounded-xl border border-border bg-secondary p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Today&apos;s Runs</p>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-4xl font-bold text-foreground">{usageToday}</span>
            {!isUnlimited && (
              <span className="text-sm text-muted-foreground font-mono">/ {dailyLimit}</span>
            )}
            {isUnlimited && (
              <span className="text-sm font-mono text-primary">unlimited</span>
            )}
          </div>
          {!isUnlimited && (
            <div className="h-1.5 rounded-full bg-muted-foreground/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min((usageToday / dailyLimit) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Total runs */}
        <div className="rounded-xl border border-border bg-secondary p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-muted-foreground" />
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">All-time</p>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{usageTotal}</p>
          <p className="text-xs text-muted-foreground">total analyses</p>
        </div>

        {/* Plan */}
        <div className="rounded-xl border border-border bg-secondary p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-muted-foreground" />
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Plan</p>
          </div>
          <p className="font-display text-3xl font-bold text-foreground capitalize">{planId}</p>
          {planId === "free" && (
            <Link href="/dashboard/billing" className="text-xs font-mono text-primary hover:underline">
              Upgrade &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Quick access */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Quick Access</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((q) => {
            const Icon = q.icon
            return (
              <Link
                key={q.href}
                href={q.href}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-secondary p-4 hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
              >
                <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                  {q.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent results */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Recent Results</p>
          <Link href="/dashboard/tools" className="font-mono text-xs text-primary hover:underline">
            View all &rarr;
          </Link>
        </div>
        {recentResults && recentResults.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recentResults.map((r, i) => {
              const label = TOOL_LABELS[r.tool_slug] ?? r.tool_slug
              const href  = TOOL_HREFS[r.tool_slug]  ?? `/tools/${r.tool_slug}`
              // Attempt to extract a summary value from the stored JSON output
              const out   = r.output as Record<string, unknown> | null
              const summary =
                (out?.visibilityScore != null ? `Score: ${out.visibilityScore}/100` : null) ??
                (out?.overall         != null ? `Score: ${out.overall}/100` : null) ??
                (out?.aiScoreAfter    != null ? `AI score: ${out.aiScoreAfter}%` : null) ??
                (out?.triggered       != null ? (out.triggered ? "AI Overview found" : "No AI Overview") : null) ??
                "Completed"
              return (
                <Link
                  key={i}
                  href={href}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary px-4 py-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Clock size={13} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm text-foreground truncate">{label}</span>
                    <span className="font-mono text-xs text-primary shrink-0">{summary}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground shrink-0">
                    {relativeTime(new Date(r.created_at))}
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No results yet. Run your first tool to see history here.
            </p>
            <Link href="/tools/geo-checker" className="mt-3 inline-block text-xs font-mono text-primary hover:underline">
              Try GEO Score Analyzer &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade nudge */}
      {planId === "free" && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground text-sm">Upgrade to Pro — $29/month</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlimited analyses, full tool history, API access, and early access to new tools.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Upgrade <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  )
}
