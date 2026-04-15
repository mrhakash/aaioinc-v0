"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, XCircle, Minus, ExternalLink, X, Copy, Check } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

const DAILY_LIMIT = 3

type RunState = "idle" | "running" | "done" | "error"

interface OverviewResult {
  url: string
  pageTitle: string
  hasAIOverviewPotential: boolean
  overallScore: number
  grade: "A" | "B" | "C" | "D" | "F"
  signals: {
    label: string
    status: "pass" | "warn" | "fail"
    detail: string
    impact: "high" | "medium" | "low"
  }[]
  triggeredByQueries: string[]
  missingElements: string[]
  topFix: string
  fullAnalysis: string
}

const statusConfig = {
  pass: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/25", label: "Pass" },
  warn: { icon: Minus, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/25", label: "Warning" },
  fail: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/25", label: "Fail" },
}

const impactBadge = {
  high: "bg-red-500/10 text-red-400 border-red-500/25",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  low: "bg-secondary text-muted-foreground border-border",
}

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const color = score >= 70 ? "#22c55e" : score >= 45 ? "#f59e0b" : "#ef4444"
  const radius = 52
  const circumference = Math.PI * radius // half circle
  const strokeDash = (score / 100) * circumference

  return (
    <div className="relative flex flex-col items-center gap-1">
      <svg viewBox="0 0 128 72" className="w-44 h-24 overflow-visible">
        <path
          d="M 12 64 A 52 52 0 0 1 116 64"
          fill="none" stroke="currentColor" strokeWidth="10"
          strokeLinecap="round" className="text-border"
        />
        <path
          d="M 12 64 A 52 52 0 0 1 116 64"
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.2s ease" }}
        />
      </svg>
      <div className="absolute bottom-4 flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground leading-none">{score}</span>
        <span className="text-xs font-mono text-muted-foreground">{grade} grade</span>
      </div>
    </div>
  )
}

export default function OverviewCheckerPage() {
  const [input, setInput] = useState("")
  const [runState, setRunState] = useState<RunState>("idle")
  const [result, setResult] = useState<OverviewResult | null>(null)
  const [checksToday, setChecksToday] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [copied, setCopied] = useState(false)

  const isAtLimit = checksToday >= DAILY_LIMIT

  async function handleCheck() {
    const clean = input.trim()
    if (!clean) { setErrorMsg("Enter a URL to analyze."); return }
    if (isAtLimit) { setErrorMsg("Daily limit reached. Upgrade to Pro for 25/day."); return }

    setErrorMsg("")
    setRunState("running")

    try {
      const res = await fetch("/api/tools/overview-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: clean }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMsg(data.message ?? "Daily limit reached. Upgrade to Pro.")
          setRunState("idle"); return
        }
        throw new Error(data.message ?? "Something went wrong.")
      }

      setResult(data)
      setRunState("done")
      setChecksToday(c => c + 1)
      setShowUpsell(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.")
      setRunState("error")
    }
  }

  function copyReport() {
    if (!result) return
    const text = [
      `AI Overview Checker Report — ${result.url}`,
      `Score: ${result.overallScore}/100 (${result.grade})`,
      `AI Overview Potential: ${result.hasAIOverviewPotential ? "Yes" : "No"}`,
      "",
      "Signals:",
      ...result.signals.map(s => `  [${s.status.toUpperCase()}] ${s.label}: ${s.detail}`),
      "",
      `Top Fix: ${result.topFix}`,
      "",
      "Missing elements:",
      ...result.missingElements.map(e => `  - ${e}`),
    ].join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">AI Overview Checker</span>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">AI Overview Checker</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Analyze any page&apos;s potential to appear in Google&apos;s AI Overviews (formerly Search Generative Experience). Get a scored signal breakdown and specific fixes.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70 border border-border rounded-md px-3 py-2 bg-secondary w-fit">
            Free: 3 checks/day · Pro: 25/day · Agency: unlimited + bulk crawl
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              type="url"
              value={input}
              onChange={(e) => { setInput(e.target.value); setErrorMsg("") }}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="https://example.com/your-article"
              className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors font-mono"
            />
            <button
              onClick={handleCheck}
              disabled={runState === "running" || isAtLimit}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {runState === "running" ? (
                <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Analyzing...</>
              ) : (
                <>Analyze Page <ArrowRight size={14} /></>
              )}
            </button>
          </div>
          {errorMsg && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
              {isAtLimit && <Link href="/pricing" className="ml-auto text-xs underline text-primary whitespace-nowrap">Upgrade</Link>}
            </div>
          )}
        </div>

        {/* Upsell */}
        {showUpsell && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-foreground">Run AI Overview checks across your <span className="font-semibold">entire site</span> with bulk crawl — unlock with Pro.</p>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/pricing" className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">Upgrade to Pro</Link>
              <button onClick={() => setShowUpsell(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
            </div>
          </div>
        )}

        {/* Loading */}
        {runState === "running" && (
          <div className="rounded-lg border border-border bg-card p-10 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-medium text-foreground">Analyzing page signals...</p>
            <p className="text-xs text-muted-foreground">Checking schema, content structure, E-E-A-T signals, and more</p>
          </div>
        )}

        {/* Results */}
        {result && runState === "done" && (
          <div className="flex flex-col gap-6">
            {/* Score header */}
            <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-8">
              <ScoreGauge score={result.overallScore} grade={result.grade} />
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xl font-bold text-foreground line-clamp-1">{result.pageTitle}</p>
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                      <ExternalLink size={13} />
                    </a>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5 line-clamp-1">{result.url}</p>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 w-fit ${result.hasAIOverviewPotential ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}>
                  {result.hasAIOverviewPotential
                    ? <><CheckCircle2 size={14} className="text-green-400" /><span className="text-sm font-medium text-green-400">AI Overview potential: Likely</span></>
                    : <><XCircle size={14} className="text-red-400" /><span className="text-sm font-medium text-red-400">AI Overview potential: Unlikely</span></>
                  }
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.fullAnalysis}</p>
              </div>
            </div>

            {/* Signals grid */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Signal breakdown</h2>
                <button onClick={copyReport} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <><Check size={12} className="text-green-400" />Copied</> : <><Copy size={12} />Copy report</>}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.signals.map((s) => {
                  const cfg = statusConfig[s.status]
                  const Icon = cfg.icon
                  return (
                    <div key={s.label} className={`rounded-lg border p-4 flex flex-col gap-2 ${cfg.bg}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={cfg.color} />
                          <span className="text-sm font-medium text-foreground">{s.label}</span>
                        </div>
                        <span className={`rounded border px-1.5 py-0.5 text-xs font-mono ${impactBadge[s.impact]}`}>{s.impact}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top fix */}
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-5 flex flex-col gap-2">
              <p className="font-mono text-xs text-amber-400 tracking-widest uppercase">Top Priority Fix</p>
              <p className="text-sm text-foreground">{result.topFix}</p>
            </div>

            {/* Missing elements */}
            {result.missingElements.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-foreground">Missing elements</h3>
                <ul className="flex flex-col gap-2">
                  {result.missingElements.map((el) => (
                    <li key={el} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <XCircle size={13} className="text-red-400 shrink-0" />
                      {el}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Queries that trigger overviews */}
            {result.triggeredByQueries.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-foreground">Queries likely to trigger AI Overviews</h3>
                <div className="flex flex-wrap gap-2">
                  {result.triggeredByQueries.map((q) => (
                    <span key={q} className="rounded border border-primary/25 bg-primary/8 text-primary px-3 py-1 text-xs font-mono">{q}</span>
                  ))}
                </div>
              </div>
            )}

            <ShareButtons
              shareText={`My page scored ${result.overallScore}/100 on the @AAIOINC AI Overview Checker — ${result.hasAIOverviewPotential ? "AI Overview potential: Likely" : "AI Overview potential: Unlikely"}. Free analysis:`}
              url="https://aaioinc.com/tools/overview-checker"
              label="Share your AI Overview score"
            />

            {/* CTA */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">Want bulk AI Overview analysis?</p>
                <p className="text-sm text-muted-foreground mt-1">Crawl your entire site and get a prioritized fix list. Available on Pro and Agency plans.</p>
              </div>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap">
                Upgrade to Pro <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="border-t border-border pt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="rounded-lg border border-border bg-card px-6 divide-y divide-border">
            {[
              { q: "What signals does the checker analyze?", a: "We check 10+ signals: FAQ schema, How-To schema, structured data completeness, content freshness, E-E-A-T markers (author bio, credentials, citations), readability, heading structure, internal linking, and page speed indicators." },
              { q: "Does this guarantee my page will appear in AI Overviews?", a: "No tool can guarantee Google's AI Overview inclusion — Google's algorithm is a black box. This tool tells you whether your page has the structural and content signals that correlate strongly with AI Overview appearances based on published research and observed patterns." },
              { q: "What is Google's AI Overview?", a: "Google's AI Overview (formerly SGE) is an AI-generated summary that appears above organic search results for certain queries. Pages cited in AI Overviews get significant visibility — but also less click-through than a top organic result. Being cited is increasingly important for branded searches." },
              { q: "Which pages benefit most from optimization?", a: "How-to pages, definition/explainer content, comparison articles, and FAQ pages have the highest AI Overview trigger rates. Transactional pages (product listings, checkout) rarely appear in AI Overviews." },
              { q: "Can I analyze competitor pages?", a: "Yes — you can enter any publicly accessible URL. Use this to identify what signals your top competitors have that you&apos;re missing." },
            ].map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer text-sm font-medium text-foreground flex items-center justify-between">
                  {q}<span className="font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
