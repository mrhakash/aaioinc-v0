"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertCircle, TrendingUp, TrendingDown, Minus, X, ExternalLink } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

const DAILY_LIMIT = 3

type RunState = "idle" | "running" | "done"

interface NicheScore {
  niche: string
  grade: "A" | "B" | "C" | "D" | "F"
  overall: number
  dimensions: {
    competition: number
    searchVolume: number
    monetization: number
    aiOpportunity: number
    contentGap: number
    trend: number
  }
  trendDirection: "rising" | "stable" | "declining"
  affiliatePrograms: string[]
  nextSteps: string[]
}

const DIMENSION_LABELS: Record<keyof NicheScore["dimensions"], string> = {
  competition: "Low Competition",
  searchVolume: "Search Volume",
  monetization: "Monetization",
  aiOpportunity: "AI Opportunity",
  contentGap: "Content Gap",
  trend: "Trend Direction",
}



// Animated SVG radar chart
function RadarChart({ dims, animate }: { dims: NicheScore["dimensions"]; animate: boolean }) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!animate) { setProgress(0); return }
    const start = performance.now()
    const duration = 900
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setProgress(p)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [animate])

  const cx = 120
  const cy = 120
  const maxR = 90
  const values = Object.values(dims)
  const labels = Object.values(DIMENSION_LABELS)
  const n = values.length
  const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

  function polar(r: number, i: number) {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  const gridLevels = [20, 40, 60, 80, 100]
  const dataPoints = values.map((v, i) => polar((v / 100) * maxR * eased, i))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => polar((level / 100) * maxR, i))
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"
        return <path key={level} d={path} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
      })}
      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const outer = polar(maxR, i)
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="currentColor" strokeWidth="0.5" className="text-border" />
      })}
      {/* Data area */}
      <path d={dataPath} fill="hsl(var(--primary))" fillOpacity="0.15" stroke="hsl(var(--primary))" strokeWidth="2" />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="hsl(var(--primary))" />
      ))}
      {/* Labels */}
      {Array.from({ length: n }, (_, i) => {
        const lp = polar(maxR + 16, i)
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            style={{ fontSize: "8px", fontFamily: "monospace" }}
          >
            {labels[i]}
          </text>
        )
      })}
    </svg>
  )
}

const gradeColors: Record<string, string> = {
  A: "text-primary",
  B: "text-sky-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
}

const trendIcons = {
  rising: { icon: TrendingUp, label: "Rising", color: "text-primary" },
  stable: { icon: Minus, label: "Stable", color: "text-muted-foreground" },
  declining: { icon: TrendingDown, label: "Declining", color: "text-red-400" },
}

export default function NicheScorerPage() {
  const [input, setInput] = useState("")
  const [runState, setRunState] = useState<RunState>("idle")
  const [result, setResult] = useState<NicheScore | null>(null)
  const [runsToday, setRunsToday] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [animate, setAnimate] = useState(false)

  const isAtLimit = runsToday >= DAILY_LIMIT

  async function handleScore() {
    if (!input.trim()) {
      setErrorMsg("Enter a niche keyword to score.")
      return
    }
    if (input.split(" ").length <= 0 || input.length < 3) {
      setErrorMsg("Try a more specific niche (e.g. 'keto meal prep' instead of 'food').")
      return
    }
    if (isAtLimit) {
      setErrorMsg("You've reached the free limit of 3/day. Upgrade to Pro for 25/day.")
      return
    }
    setErrorMsg("")
    setAnimate(false)
    setRunState("running")

    try {
      const res = await fetch("/api/tools/niche-scorer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: input }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMsg(data.message ?? "Daily limit reached. Upgrade to Pro for 25 analyses/day.")
          setRunState("idle")
          return
        }
        throw new Error(data.message ?? "Something went wrong.")
      }

      setResult(data)
      setRunState("done")
      setAnimate(true)
      const newCount = runsToday + 1
      setRunsToday(newCount)
      setShowUpsell(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.")
      setRunState("idle")
    }
  }

  const TrendIcon = result ? trendIcons[result.trendDirection].icon : Minus

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">Niche Profitability Scorer</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono font-medium">Free</span>
            <span className="font-mono text-xs text-muted-foreground">Content &amp; SEO</span>
            <span className="font-mono text-xs text-muted-foreground border border-border rounded px-2 py-0.5">{runsToday}/{DAILY_LIMIT} runs today</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Niche Profitability Scorer</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Enter any niche keyword and get an animated radar chart scored across 6 dimensions — plus an A–F viability grade, affiliate program discovery, and 3 recommended next steps.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70 border border-border rounded-md px-3 py-2 bg-secondary w-fit">
            Free: 3 analyses/day · Pro: 25/day + export + deep report
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setErrorMsg("") }}
              onKeyDown={(e) => e.key === "Enter" && handleScore()}
              placeholder="Enter a niche keyword (e.g. 'indoor gardening', 'AI tools for lawyers')..."
              className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              suppressHydrationWarning
            />
            <button
              onClick={handleScore}
              disabled={runState === "running" || isAtLimit}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              {runState === "running" ? (
                <>
                  <span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Scoring...
                </>
              ) : (
                <>Score This Niche <ArrowRight size={14} /></>
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
              Want the full <span className="font-semibold">20-page Niche Validation Report</span>? Book our Niche Research service.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/services/niche-research" className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                See Niche Research
              </Link>
              <button onClick={() => setShowUpsell(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Running */}
        {runState === "running" && (
          <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-foreground font-medium">Analyzing competition, monetization, and AI opportunity...</p>
          </div>
        )}

        {/* Results */}
        {result && runState === "done" && (
          <div className="flex flex-col gap-6">
            {/* Main result card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">Niche Viability Score</p>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Radar chart */}
                <div className="w-full md:w-64 shrink-0">
                  <RadarChart dims={result.dimensions} animate={animate} />
                </div>

                {/* Score summary */}
                <div className="flex flex-col gap-4 flex-1 w-full">
                  <div className="flex items-start gap-4">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">Overall Grade</p>
                      <p className={`text-6xl font-bold ${gradeColors[result.grade]}`}>{result.grade}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">Viability Score</p>
                      <p className="text-4xl font-bold text-foreground">{result.overall}<span className="text-lg font-normal text-muted-foreground">/100</span></p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">Trend</p>
                      <div className={`flex items-center gap-1 mt-1 ${trendIcons[result.trendDirection].color}`}>
                        <TrendIcon size={18} />
                        <p className="text-sm font-semibold">{trendIcons[result.trendDirection].label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dimension bars */}
                  <div className="flex flex-col gap-2">
                    {Object.entries(result.dimensions).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <p className="font-mono text-xs text-muted-foreground w-28 shrink-0">{DIMENSION_LABELS[key as keyof NicheScore["dimensions"]]}</p>
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-700"
                            style={{ width: `${val * (animate ? 1 : 0)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground w-6 text-right">{val}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs font-mono text-muted-foreground">
                    Niche: <span className="text-foreground">{result.niche}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Affiliate programs */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">Affiliate programs found</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.affiliatePrograms.map((p) => (
                  <div key={p} className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground font-mono text-xs">
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">Recommended next steps</h2>
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
                {result.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-mono text-xs text-primary font-bold mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
                <div className="border-t border-border pt-3 mt-1">
                  <Link href="/services/niche-research" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                    Get the full 20-page Niche Validation Report <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            </div>

            <ShareButtons
              shareText={`Scored "${result.niche}" on the @AAIOINC Niche Profitability Scorer — Grade: ${result.grade} (${result.overall}/100).`}
              url="https://aaioinc.com/tools/niche-scorer"
              label="Share your niche score"
            />
          </div>
        )}

        {/* FAQ */}
        <div className="border-t border-border pt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="flex flex-col gap-0 rounded-lg border border-border bg-card px-6 divide-y divide-border">
            {[
              { q: "What are the 6 radar chart dimensions?", a: "Competition level (SERP difficulty), search volume (estimated monthly), monetization potential (affiliate/ad RPM), AI visibility opportunity (GEO gap), content gap (underserved subtopics), and trend direction." },
              { q: "How specific should my keyword be?", a: "More specific niches produce more accurate scores. 'Food' is too broad — try 'keto meal prep for diabetics' or 'home automation for renters'. Too-broad keywords trigger a prompt to narrow down." },
              { q: "Where does the data come from?", a: "We combine estimated search volume data, affiliate program databases, SERP pattern analysis, and AI visibility gap analysis. All estimates carry a confidence interval shown in the report." },
              { q: "Can I share my niche score?", a: "Yes. The 'Share Score' button generates social-ready text with your grade and score for Twitter/LinkedIn. No account required." },
              { q: "How accurate are the scores?", a: "Niche scoring involves estimation. We show scores as directional signals and recommend validating top opportunities with our full Niche Research Service before committing resources." },
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
            <p className="font-semibold text-foreground">Need the full niche validation?</p>
            <p className="text-sm text-muted-foreground mt-1">Our Niche Research Service delivers a 20-page report: 50+ niches analyzed, affiliate matrix, 12-month content calendar, and top 50 keywords.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/services/niche-research" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
              View Niche Research <ArrowRight size={14} />
            </Link>
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap">
              All Free Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
