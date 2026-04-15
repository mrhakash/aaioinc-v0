"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, X, AlertCircle, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"

const DAILY_LIMIT = 3

type RunState = "idle" | "running" | "done" | "error"

interface PlatformResult {
  platform: string
  icon: string
  mentions: number
  sentiment: "positive" | "neutral" | "negative" | "none"
  context?: string
}

interface GEOResult {
  brand: string
  visibilityScore: number
  platforms: PlatformResult[]
  competingBrands: string[]
  recommendations: string[]
}



const sentimentConfig = {
  positive: { label: "Positive", color: "text-primary", bg: "bg-primary/10 border-primary/30", icon: TrendingUp },
  neutral: { label: "Neutral", color: "text-muted-foreground", bg: "bg-secondary border-border", icon: Minus },
  negative: { label: "Negative", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", icon: TrendingDown },
  none: { label: "Not found", color: "text-muted-foreground/50", bg: "bg-secondary border-border opacity-60", icon: Minus },
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDash = (score / 100) * circumference
  const color = score >= 60 ? "#22c55e" : score >= 35 ? "#f59e0b" : "#ef4444"
  const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : score >= 20 ? "D" : "F"

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-border" />
        <circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs font-mono text-muted-foreground">/ 100</span>
        <span
          className="text-sm font-bold mt-0.5"
          style={{ color }}
        >{grade}</span>
      </div>
    </div>
  )
}

export default function GEOCheckerPage() {
  const [input, setInput] = useState("")
  const [runState, setRunState] = useState<RunState>("idle")
  const [result, setResult] = useState<GEOResult | null>(null)
  const [checksToday, setChecksToday] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const isAtLimit = checksToday >= DAILY_LIMIT

  async function handleCheck() {
    if (!input.trim()) {
      setErrorMsg("Enter a valid domain or brand name.")
      return
    }
    if (isAtLimit) {
      setErrorMsg("You've reached the free limit of 3 checks/day. Upgrade to Pro for 50/day.")
      return
    }
    setErrorMsg("")
    setRunState("running")

    try {
      const res = await fetch("/api/tools/geo-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: input }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMsg(data.message ?? "Daily limit reached. Upgrade to Pro for 50 checks/day.")
          setRunState("idle")
          return
        }
        throw new Error(data.message ?? "Something went wrong.")
      }

      setResult(data)
      setRunState("done")
      const newCount = checksToday + 1
      setChecksToday(newCount)
      setShowUpsell(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.")
      setRunState("idle")
    }
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">GEO Visibility Checker</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 px-2.5 py-0.5 text-xs font-mono font-medium">Freemium</span>
            <span className="font-mono text-xs text-muted-foreground">GEO &amp; AI Search</span>
            <span className="font-mono text-xs text-muted-foreground border border-border rounded px-2 py-0.5">{checksToday}/{DAILY_LIMIT} checks today</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">GEO Visibility Checker</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            See where your brand appears in ChatGPT, Perplexity, Claude, and Gemini responses. Get a 0–100 visibility score, platform-by-platform breakdown, sentiment analysis, and recommended actions.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70 border border-border rounded-md px-3 py-2 bg-secondary w-fit">
            Free: 3 checks/day · Pro: 50/day · Agency: unlimited + historical tracking
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setErrorMsg("") }}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="Enter domain (e.g. example.com) or brand name..."
              className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              suppressHydrationWarning
            />
            <button
              onClick={handleCheck}
              disabled={runState === "running" || isAtLimit}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              {runState === "running" ? (
                <>
                  <span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>Check Visibility <ArrowRight size={14} /></>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} className="shrink-0" />
              {errorMsg}
              {isAtLimit && (
                <Link href="/pricing" className="ml-auto text-xs underline text-primary whitespace-nowrap">Upgrade to Pro</Link>
              )}
            </div>
          )}
        </div>

        {/* Upsell */}
        {showUpsell && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-foreground">
              Track your GEO visibility <span className="font-semibold">weekly</span> and compare against competitors — unlock with Pro.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/pricing" className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                See Pro Plans
              </Link>
              <button onClick={() => setShowUpsell(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Running indicator */}
        {runState === "running" && (
          <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-foreground font-medium">Checking ChatGPT, Perplexity, Claude, and Gemini...</p>
            <p className="text-xs text-muted-foreground">This takes about 5–10 seconds</p>
          </div>
        )}

        {/* Results */}
        {result && runState === "done" && (
          <div className="flex flex-col gap-6">
            {/* Brand card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">Brand Visibility Report</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <ScoreRing score={result.visibilityScore} />
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{result.brand}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.visibilityScore >= 60
                        ? "Good AI visibility — your brand appears in AI-generated answers."
                        : result.visibilityScore >= 35
                        ? "Moderate AI visibility — room for significant improvement."
                        : "Low AI visibility — your brand is largely invisible in AI-generated answers."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.competingBrands.map((b) => (
                      <span key={b} className="rounded border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground bg-secondary">
                        also mentioned: {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform breakdown */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">Platform breakdown</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.platforms.map((p) => {
                  const cfg = sentimentConfig[p.sentiment]
                  const SentimentIcon = cfg.icon
                  return (
                    <div key={p.platform} className={`rounded-lg border p-4 flex flex-col gap-3 ${cfg.bg}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground text-sm">{p.platform}</p>
                        <div className={`flex items-center gap-1 text-xs font-mono ${cfg.color}`}>
                          <SentimentIcon size={12} />
                          {cfg.label}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {p.mentions}
                        <span className="text-sm font-normal text-muted-foreground ml-1">mentions</span>
                      </p>
                      {p.context && (
                        <p className="text-xs text-muted-foreground italic leading-relaxed border-t border-border/50 pt-2">{p.context}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">Recommended actions</h2>
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                {result.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-mono text-xs text-primary font-bold mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
                  </div>
                ))}
                <div className="border-t border-border pt-3 mt-1">
                  <Link href="/services/ai-seo" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                    Get a full GEO strategy from our AI SEO team <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-foreground">Share your GEO score on Twitter or LinkedIn.</p>
              <button
                onClick={() => {
                  const text = `Just checked my GEO visibility with @AAIOINC — ${result.brand} scored ${result.visibilityScore}/100 across ChatGPT, Perplexity, Claude, and Gemini. Free tool: https://aaioinc.com/tools/geo-checker`
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
                }}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap"
              >
                Share Result <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* No result empty state */}
        {result?.visibilityScore === 0 && runState === "done" && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 flex flex-col gap-3">
            <p className="font-semibold text-foreground">Your brand has low AI visibility</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We found minimal citations across all four platforms. This is fixable — start with our{" "}
              <Link href="/blog/what-is-geo-generative-engine-optimization" className="text-primary underline">complete GEO guide</Link> or{" "}
              <Link href="/contact" className="text-primary underline">book a strategy call</Link>.
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="border-t border-border pt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="flex flex-col gap-0 rounded-lg border border-border bg-card px-6 divide-y divide-border">
            {[
              { q: "How does the visibility score work?", a: "We query each AI platform with brand-related prompts and analyze responses for mentions, citations, and context. The 0–100 score reflects frequency, prominence, and sentiment across all four platforms." },
              { q: "Which AI platforms do you check?", a: "ChatGPT (GPT-4o), Perplexity, Claude (Sonnet), and Gemini. We rotate through multiple query types per platform to get a representative sample." },
              { q: "How often should I check?", a: "Weekly checks give the best trend data. AI model training cycles mean visibility can shift significantly between updates. Pro accounts get automated weekly reports." },
              { q: "What if no mentions are found?", a: "A zero score is actionable data. We provide a specific action plan: schema markup, authoritative content signals, citation-building targets, and GEO-optimized content recommendations." },
              { q: "Can I check competitor brands?", a: "Yes. Pro accounts can run competitor checks and see side-by-side visibility comparisons. Agency accounts get white-label reports for client delivery." },
            ].map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer text-sm font-medium text-foreground flex items-center justify-between">
                  {q}
                  <span className="font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="font-semibold text-foreground">Want weekly GEO tracking?</p>
            <p className="text-sm text-muted-foreground mt-1">Pro gives you automated weekly reports, historical trending, competitor comparison, and agency-ready exports.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
              See Pro Plans <ArrowRight size={14} />
            </Link>
            <Link href="/services/ai-seo" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap">
              AI SEO Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
