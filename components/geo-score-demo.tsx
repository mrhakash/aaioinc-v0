"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  ArrowRight,
  AlertCircle,
  Lock,
  Share2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
} from "lucide-react"
import { trackToolShared } from "@/lib/analytics"

// ── Signal config ──────────────────────────────────────────────────────────────
const SIGNAL_LABELS: Record<string, string> = {
  schema:      "Structured data (JSON-LD)",
  faq:         "FAQ / HowTo content",
  authority:   "External citation signals",
  readability: "Readability & semantic clarity",
  freshness:   "Content freshness",
  entities:    "Named entity density",
}

type SignalKey = keyof typeof SIGNAL_LABELS

function mockAnalyze(input: string) {
  const seed = input.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const base = 30 + (seed % 55)

  const signals: Record<SignalKey, number> = {
    schema:      20 + (seed % 80),
    faq:         15 + ((seed * 3) % 75),
    authority:   10 + ((seed * 7) % 90),
    readability: 40 + ((seed * 2) % 55),
    freshness:   25 + ((seed * 5) % 70),
    entities:    30 + ((seed * 4) % 65),
  }

  const sorted = (Object.entries(signals) as [SignalKey, number][]).sort(([, a], [, b]) => a - b)
  const weakest = sorted[0]

  const issues: Record<SignalKey, string> = {
    schema:      "Add JSON-LD Article or FAQ schema markup to your key pages",
    faq:         "Add a FAQ section targeting common question queries from AI engines",
    authority:   "Build citations from authoritative external sources and directories",
    readability: "Improve sentence structure and semantic keyword placement",
    freshness:   "Update content with a recent publish date and fresh statistics",
    entities:    "Add specific named entities: brands, products, locations, people",
  }

  const gradeMap = (s: number) => {
    if (s >= 80) return "A"
    if (s >= 65) return "B"
    if (s >= 50) return "C"
    if (s >= 35) return "D"
    return "F"
  }

  return {
    score: base,
    grade: gradeMap(base),
    signals,
    sorted,
    topIssue: issues[weakest[0]],
    passCount: Object.values(signals).filter((v) => v >= 60).length,
  }
}

// ── Score ring SVG ────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color =
    score >= 70 ? "var(--success)" :
    score >= 45 ? "var(--warning)" : "var(--danger)"

  return (
    <svg width="112" height="112" viewBox="0 0 112 112" className="shrink-0" aria-hidden="true">
      <circle cx="56" cy="56" r={r} fill="none" stroke="currentColor" strokeWidth="7" className="text-border" />
      <circle
        cx="56" cy="56" r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x="56" y="50" textAnchor="middle" fontSize="26" fontWeight="800" fill={color} fontFamily="var(--font-mono)">
        {score}
      </text>
      <text x="56" y="65" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)" fontFamily="var(--font-mono)" letterSpacing="0.06em">
        /100
      </text>
    </svg>
  )
}

// ── Signal bar row ────────────────────────────────────────────────────────────
function SignalRow({ label, value }: { label: string; value: number }) {
  const passing = value >= 60
  const StatusIcon = value >= 70 ? CheckCircle2 : value >= 45 ? AlertTriangle : XCircle
  const iconClass = value >= 70 ? "text-green-400" : value >= 45 ? "text-amber-400" : "text-red-400"
  const barColor = value >= 70 ? "bg-green-400" : value >= 45 ? "bg-amber-400" : "bg-red-400"

  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
      <StatusIcon size={13} className={`shrink-0 ${iconClass}`} aria-hidden="true" />
      <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">{label}</span>
      <div className="w-20 h-1 rounded-full bg-secondary overflow-hidden shrink-0">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground w-7 text-right shrink-0">{value}</span>
    </div>
  )
}

// ── Platform pill ─────────────────────────────────────────────────────────────
function PlatformPill({ name, score }: { name: string; score: number }) {
  const visible = score > 50
  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-mono ${
      visible ? "border-green-500/30 bg-green-500/8 text-green-400" : "border-border bg-secondary text-muted-foreground"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${visible ? "bg-green-400" : "bg-muted-foreground"}`} />
      {name}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function GeoScoreDemo() {
  const SESSION_KEY = "aaio_geo_demo_used"
  const [url, setUrl] = useState("")
  const [state, setState] = useState<"idle" | "running" | "done" | "locked">("idle")
  const [result, setResult] = useState<ReturnType<typeof mockAnalyze> | null>(null)
  const [error, setError] = useState("")
  const resultRef = useRef<HTMLDivElement>(null)

  function checkLocked() {
    try { return sessionStorage.getItem(SESSION_KEY) === "1" } catch { return false }
  }

  async function handleAnalyze() {
    const trimmed = url.trim()
    if (!trimmed) { setError("Enter a URL or brand name."); return }
    if (checkLocked()) { setState("locked"); return }
    setError("")
    setState("running")
    await new Promise((r) => setTimeout(r, 1600))
    setResult(mockAnalyze(trimmed))
    setState("done")
    try { sessionStorage.setItem(SESSION_KEY, "1") } catch {}
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80)
  }

  const gradeColor = (g: string) =>
    g === "A" ? "text-green-400" : g === "B" ? "text-sky-400" : g === "C" ? "text-amber-400" : "text-red-400"

  const seed = url.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)

  return (
    <section id="geo-demo" className="border-y border-border bg-card/40 px-6 py-20">
      <div className="mx-auto max-w-6xl">

        {/* ── 2-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Copy + Input */}
          <div className="flex flex-col gap-7 lg:sticky lg:top-24">
            <div className="flex flex-col gap-3">
              <p className="text-mono-label text-[10px] text-muted-foreground">Live Demo — GEO Score</p>
              <h2 className="text-display-sm text-[clamp(24px,3vw,36px)] font-extrabold text-foreground text-balance leading-tight">
                Check your GEO visibility score{" "}
                <span className="text-primary">— free</span>
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                Enter any URL or brand name and get an instant 0–100 GEO score with a per-signal breakdown. One free analysis per session — full tool gives you 3/day.
              </p>
            </div>

            {/* What you get */}
            <ul className="flex flex-col gap-2.5">
              {[
                { icon: TrendingUp, text: "Overall GEO score with letter grade" },
                { icon: Zap,        text: "6-signal breakdown with pass/fail" },
                { icon: CheckCircle2, text: "Platform visibility across 4 AI engines" },
                { icon: ArrowRight, text: "Top actionable fix to raise your score" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icon size={14} className="text-primary shrink-0" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Input */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError("") }}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="yoursite.com or Your Brand Name"
                  disabled={state === "done" || state === "locked"}
                  aria-label="URL or brand name to analyze"
                  className="flex-1 rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={state === "running" || state === "done" || state === "locked"}
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {state === "running" ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : "Analyze GEO Score"}
                </button>
              </div>

              {error && (
                <p className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                  <AlertCircle size={12} className="shrink-0" />
                  {error}
                </p>
              )}

              <p className="text-[11px] text-muted-foreground font-mono">
                1 free scan per session &middot; No account needed &middot; Results not stored
              </p>
            </div>

            {/* Locked */}
            {state === "locked" && (
              <div className="rounded-lg border border-border bg-secondary p-5 flex items-start gap-3">
                <Lock size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-foreground text-sm">Session limit reached</p>
                  <p className="text-xs text-muted-foreground">Unlimited scans on Pro — or use the full tool for 3 checks/day.</p>
                  <Link href="/tools/geo-checker" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                    Open Full Tool <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Results panel */}
          <div ref={resultRef} className="flex flex-col gap-4">

            {/* Idle placeholder */}
            {state === "idle" && (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[360px]">
                <div className="w-16 h-16 rounded-full border border-border bg-secondary flex items-center justify-center">
                  <TrendingUp size={24} className="text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">Your score will appear here</p>
                  <p className="text-xs text-muted-foreground">Enter a URL or brand name on the left to start</p>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {state === "running" && (
              <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 animate-pulse min-h-[360px]">
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28 rounded-full bg-secondary" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 bg-secondary rounded" style={{ width: `${70 + (i * 5) % 30}%` }} />
                ))}
              </div>
            )}

            {/* Results */}
            {state === "done" && result && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500">

                {/* Score card */}
                <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-5">
                  {/* Ring + grade + platform visibility */}
                  <div className="flex items-center gap-5">
                    <ScoreRing score={result.score} />
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-extrabold font-mono ${gradeColor(result.grade)}`}>{result.grade}</span>
                        <span className="text-sm text-muted-foreground">grade</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {result.passCount} / 6 signals passing
                      </p>
                    </div>
                  </div>

                  {/* Platform visibility row */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">AI Platform Visibility</p>
                    <div className="flex flex-wrap gap-2">
                      <PlatformPill name="ChatGPT"    score={result.signals.authority} />
                      <PlatformPill name="Perplexity" score={result.signals.readability} />
                      <PlatformPill name="Claude"     score={result.signals.schema} />
                      <PlatformPill name="Gemini"     score={result.signals.entities} />
                    </div>
                  </div>

                  {/* Signal breakdown */}
                  <div className="flex flex-col gap-0">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Signal Breakdown</p>
                    {(Object.entries(result.signals) as [SignalKey, number][]).map(([key, val]) => (
                      <SignalRow key={key} label={SIGNAL_LABELS[key]} value={val} />
                    ))}
                  </div>
                </div>

                {/* Top recommendation */}
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-5 py-4 flex flex-col gap-2">
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Top Fix</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.topIssue}</p>
                  <div className="flex gap-2 mt-1">
                    <Link href="/tools/geo-checker" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                      Full analysis <ArrowRight size={11} />
                    </Link>
                    <span className="text-muted-foreground">·</span>
                    <Link href="/services/ai-seo" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                      Fix it for me <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Share */}
                <div className="rounded-lg border border-border bg-secondary px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-foreground font-medium">
                    Score: <span className="text-primary font-mono">{result.score}/100</span> ({result.grade})
                  </p>
                  <div className="flex gap-2">
                    {[
                      { label: "Twitter", fn: () => {
                        const t = `My GEO visibility score is ${result.score}/100 (${result.grade} grade). Check yours free at aaioinc.com`
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}`, "_blank")
                        trackToolShared("geo-checker", "twitter")
                      }},
                      { label: "LinkedIn", fn: () => {
                        const t = `My GEO visibility score is ${result.score}/100 (${result.grade} grade). Check yours at aaioinc.com`
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aaioinc.com/tools/geo-checker")}&summary=${encodeURIComponent(t)}`, "_blank")
                        trackToolShared("geo-checker", "linkedin")
                      }},
                    ].map(({ label, fn }) => (
                      <button
                        key={label}
                        onClick={fn}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                      >
                        <Share2 size={11} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
