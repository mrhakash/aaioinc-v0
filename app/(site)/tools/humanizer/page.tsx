"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle, Sparkles, X } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

const DAILY_LIMIT = 5
const FREE_MAX_CHARS = 5000

type RunState = "idle" | "running" | "done" | "error"

interface HumanizerResult {
  original: string
  humanized: string
  aiScoreBefore: number
  aiScoreAfter: number
  changeCount: number
  summary: string
}

function DiffView({ original, humanized, summary }: { original: string; humanized: string; summary?: string }) {
  const origWords = original.split(/\b/)
  const humanWords = humanized.split(/\b/)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg border border-border overflow-hidden">
      {/* Original */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-red-500/10">
          <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
          <span className="font-mono text-xs font-semibold text-red-400">Original (AI)</span>
        </div>
        <div className="p-4 text-sm leading-relaxed text-foreground bg-card min-h-[200px] whitespace-pre-wrap font-mono text-xs">
          {original}
        </div>
      </div>
      {/* Divider */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border" />
      {/* Humanized */}
      <div className="flex flex-col border-t md:border-t-0 md:border-l border-border">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-primary/10">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="font-mono text-xs font-semibold text-primary">Humanized</span>
        </div>
        <div className="p-4 text-sm leading-relaxed text-foreground bg-card min-h-[200px] whitespace-pre-wrap font-mono text-xs">
          {humanWords.map((word, i) => {
            const isChanged = origWords[i] !== word
            return (
              <span
                key={i}
                className={isChanged ? "bg-primary/20 text-primary rounded px-0.5" : ""}
              >
                {word}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ScoreBadge({ label, score, type }: { label: string; score: number; type: "danger" | "success" }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-1 ${type === "danger" ? "border-red-500/30 bg-red-500/5" : "border-primary/30 bg-primary/5"}`}>
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
      <p className={`text-3xl font-bold ${type === "danger" ? "text-red-400" : "text-primary"}`}>{score}%</p>
      <p className="text-xs text-muted-foreground">AI detection probability</p>
    </div>
  )
}

export default function HumanizerPage() {
  const [input, setInput] = useState("")
  const [runState, setRunState] = useState<RunState>("idle")
  const [result, setResult] = useState<HumanizerResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [runsToday, setRunsToday] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const resultRef = useRef<HTMLDivElement>(null)

  const charCount = input.length
  const isOverLimit = charCount > FREE_MAX_CHARS
  const isAtDailyLimit = runsToday >= DAILY_LIMIT

  async function handleRun() {
    if (!input.trim()) {
      setErrorMsg("Paste some text to humanize.")
      return
    }
    if (isOverLimit) {
      setErrorMsg(`Upgrade to Pro for up to 25,000 characters. (Current: ${charCount.toLocaleString()})`)
      return
    }
    if (isAtDailyLimit) {
      setErrorMsg("You've reached the free daily limit of 5 runs. Upgrade to Pro for unlimited runs.")
      return
    }
    setErrorMsg("")
    setRunState("running")

    try {
      const res = await fetch("/api/tools/humanizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMsg(data.message ?? "Daily limit reached. Upgrade to Pro for unlimited runs.")
          setRunState("error")
          return
        }
        throw new Error(data.message ?? "Something went wrong.")
      }

      setResult({
        original: input,
        humanized: data.humanized,
        aiScoreBefore: data.aiScoreBefore,
        aiScoreAfter: data.aiScoreAfter,
        changeCount: data.changeCount,
        summary: data.summary,
      })
      setRunState("done")
      const newCount = runsToday + 1
      setRunsToday(newCount)
      if (newCount >= 3) setShowUpsell(true)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.")
      setRunState("error")
    }
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.humanized)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          <span className="text-foreground">AI Content Humanizer</span>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">AI Content Humanizer</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Paste AI-generated text and get a humanized version that bypasses Originality.ai, GPTZero, and Turnitin — with a full word-level diff so you can see every change.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70 border border-border rounded-md px-3 py-2 bg-secondary w-fit">
            Free: 5 docs/day · 5,000 chars · Pro: unlimited · 25,000 chars
          </p>
        </div>

        {/* Input area */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              rows={8}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setErrorMsg("")
              }}
              placeholder="Paste your AI-generated content here (max 5,000 chars on Free)..."
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              suppressHydrationWarning
            />
            <div className={`absolute bottom-3 right-3 font-mono text-xs ${isOverLimit ? "text-red-400" : "text-muted-foreground/50"}`}>
              {charCount.toLocaleString()} / {FREE_MAX_CHARS.toLocaleString()}
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} className="shrink-0" />
              {errorMsg}
              {(isAtDailyLimit || isOverLimit) && (
                <Link href="/pricing" className="ml-auto text-xs underline text-primary whitespace-nowrap">
                  Upgrade to Pro
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => { setInput(""); setResult(null); setRunState("idle"); setErrorMsg("") }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              disabled={!input && !result}
            >
              Clear
            </button>
            <button
              onClick={handleRun}
              disabled={runState === "running" || isAtDailyLimit}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {runState === "running" ? (
                <>
                  <span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Humanizing...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Humanize Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upsell banner */}
        {showUpsell && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-foreground">
              Loving the humanizer? <span className="font-semibold">Go Pro</span> for unlimited runs, 25,000 char limit, and API access.
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

        {/* Results */}
        {result && runState === "done" && (
          <div ref={resultRef} className="flex flex-col gap-6">
            {/* Score cards */}
            <div className="grid grid-cols-2 gap-4">
              <ScoreBadge label="AI Detection Score — Before" score={result.aiScoreBefore} type="danger" />
              <ScoreBadge label="AI Detection Score — After" score={result.aiScoreAfter} type="success" />
            </div>

            {/* Diff view */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-bold text-foreground">Transformation diff</h2>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5 transition-colors"
                >
                  {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy humanized"}
                </button>
              </div>
              <DiffView original={result.original} humanized={result.humanized} summary={result.summary} />
              <p className="text-xs text-muted-foreground font-mono">
                Green highlights = changed words &middot; {result.changeCount} phrase{result.changeCount !== 1 ? "s" : ""} modified &middot; AI scores are estimates.
              </p>
            </div>

            <ShareButtons
              shareText={`Just humanized AI content with @AAIOINC — AI detection score dropped from ${result.aiScoreBefore}% to ${result.aiScoreAfter}%. Free tool:`}
              url="https://aaioinc.com/tools/humanizer"
              label="Share your before/after result"
            />
          </div>
        )}

        {/* FAQ */}
        <div className="border-t border-border pt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="flex flex-col gap-0 rounded-lg border border-border bg-card px-6 divide-y divide-border">
            {[
              { q: "Which AI detectors does this bypass?", a: "We target Originality.ai, GPTZero, and Turnitin. Our humanization patterns specifically address the linguistic fingerprints each detector uses. Most outputs score 90+ on Originality.ai." },
              { q: "Does it change my meaning or keywords?", a: "No. The humanization pass preserves semantic meaning, target keywords, and heading structure. Only surface-level phrasing patterns are modified." },
              { q: "What's the character limit?", a: "Free accounts: 5,000 characters per run, 5 runs per day. Pro accounts: 25,000 characters per run, unlimited runs." },
              { q: "Is my content stored?", a: "No. Content is processed in-memory and not persisted. We do not train on user submissions or store text after a session ends." },
              { q: "Will Google penalize humanized AI content?", a: "Google's guidelines focus on quality and helpfulness, not origin. Our humanization pass maintains readability and natural sentence variation, which aligns with quality signals." },
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
            <p className="font-semibold text-foreground">Need unlimited humanization?</p>
            <p className="text-sm text-muted-foreground mt-1">Go Pro for 25,000 char limit, unlimited runs, API access, and bulk processing.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
              See Pro Plans <ArrowRight size={14} />
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
