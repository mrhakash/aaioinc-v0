"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Minus } from "lucide-react"

type Visibility = "visible" | "not-found" | "partial"

interface PlatformResult {
  platform: string
  visibility: Visibility
  context?: string
}

const MOCK_RESULTS: PlatformResult[] = [
  {
    platform: "Google AI Overview",
    visibility: "visible",
    context: "\"...according to AAIOINC, generative engine optimization focuses on structured content and entity clarity...\"",
  },
  {
    platform: "Bing Copilot",
    visibility: "partial",
    context: "Brand mentioned in a list context but not cited as the primary source.",
  },
  {
    platform: "Perplexity",
    visibility: "not-found",
  },
]

const visibilityConfig: Record<Visibility, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  visible: { icon: CheckCircle2, label: "Visible", color: "text-primary", bg: "bg-primary/10 border-primary/30" },
  partial: { icon: Minus, label: "Partial", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/25" },
  "not-found": { icon: XCircle, label: "Not found", color: "text-muted-foreground", bg: "bg-secondary border-border" },
}

export default function OverviewCheckerPage() {
  const [input, setInput] = useState("")
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checksUsed] = useState(1)
  const checksLimit = 3

  const handleCheck = () => {
    if (!input.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAnalyzed(true)
    }, 1400)
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/geo" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> GEO Hub
          </Link>
          <span>/</span>
          <span className="text-foreground">AI Overview Checker</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-0.5 text-xs font-mono text-sky-400">Freemium</span>
            <span className="font-mono text-xs text-muted-foreground">{checksLimit - checksUsed} of {checksLimit} free checks remaining today</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">AI Overview Visibility Checker</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Check whether your brand or content appears in AI-generated answers across Google AI Overviews, Bing Copilot, and Perplexity. See the exact citation context when found.
          </p>
        </div>

        {/* Usage meter */}
        <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground font-mono">Daily checks used</span>
              <span className="text-xs text-muted-foreground font-mono">{checksUsed}/{checksLimit}</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(checksUsed / checksLimit) * 100}%` }} />
            </div>
          </div>
          <Link href="/pricing" className="shrink-0 text-xs font-mono text-primary hover:underline">
            Upgrade for unlimited &rarr;
          </Link>
        </div>

        {/* Input */}
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-4">
          <label htmlFor="brand-input" className="text-sm font-medium text-foreground">
            Brand name or query
          </label>
          <input
            id="brand-input"
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setAnalyzed(false) }}
            placeholder="e.g. AAIOINC, or 'best GEO optimization tools 2026'"
            className="w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-muted-foreground font-mono">
              Checks Google AI Overviews, Bing Copilot, and Perplexity simultaneously
            </p>
            <button
              onClick={handleCheck}
              disabled={!input.trim() || loading || checksUsed >= checksLimit}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              {loading ? "Checking..." : "Check Visibility"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
        </div>

        {/* Results */}
        {analyzed && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">
              Visibility results for &ldquo;{input}&rdquo;
            </h2>
            <div className="flex flex-col gap-3">
              {MOCK_RESULTS.map((result) => {
                const cfg = visibilityConfig[result.visibility]
                const Icon = cfg.icon
                return (
                  <div
                    key={result.platform}
                    className={`rounded-lg border p-5 flex flex-col gap-3 ${cfg.bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={cfg.color} />
                      <span className="font-semibold text-foreground text-sm">{result.platform}</span>
                      <span className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    {result.context && (
                      <div className="rounded-md border border-border bg-background/50 px-4 py-3">
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                          {result.context}
                        </p>
                      </div>
                    )}
                    {result.visibility === "not-found" && (
                      <p className="text-xs text-muted-foreground">
                        Your brand was not cited in any AI-generated answers for this query. See our{" "}
                        <Link href="/geo" className="text-primary hover:underline">GEO Optimization Guide</Link>{" "}
                        to improve visibility.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Upgrade CTA */}
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground text-sm">Track visibility over time with Pro</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Unlimited daily checks, trend charts, white-label PDF reports, and Slack alerts when visibility changes.
                </p>
              </div>
              <Link href="/pricing" className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
