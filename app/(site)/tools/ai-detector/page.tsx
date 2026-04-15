"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

type Verdict = "Human" | "Likely Human" | "Mixed" | "Likely AI" | "AI-Generated"

interface DetectorResult {
  overallScore: number
  verdict: Verdict
  detectorScores: {
    originalityAi: number
    gptZero: number
    turnitin: number
  }
  highRiskPhrases: string[]
  signals: string[]
  recommendation: string
}

const VERDICT_CONFIG: Record<Verdict, { color: string; bg: string; border: string }> = {
  "Human":         { color: "text-success",          bg: "bg-success/10",          border: "border-success/30" },
  "Likely Human":  { color: "text-success",          bg: "bg-success/8",           border: "border-success/20" },
  "Mixed":         { color: "text-warning",          bg: "bg-warning/10",          border: "border-warning/30" },
  "Likely AI":     { color: "text-red-400",          bg: "bg-red-500/10",          border: "border-red-500/30" },
  "AI-Generated":  { color: "text-red-400",          bg: "bg-red-500/15",          border: "border-red-500/40" },
}

function DetectorBar({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#00d47e"
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className="font-mono text-xs font-bold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function AIDetectorPage() {
  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<DetectorResult | null>(null)
  const [error, setError] = useState("")

  async function handleRun() {
    if (input.trim().length < 50) { setError("Paste at least 50 characters for an accurate result."); return }
    setError(""); setRunning(true); setResult(null)
    try {
      const res = await fetch("/api/tools/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "ai-detector", input }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? "Something went wrong."); return }
      setResult(data.output)
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setRunning(false)
    }
  }

  const charCount = input.length

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">AI Detection Scanner</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono">Free</span>
            <span className="font-mono text-xs text-muted-foreground">5/day · Content &amp; SEO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">AI Detection Scanner</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Paste any text and get a multi-detector score visualization across the same signal patterns used by Originality.ai, GPTZero, and Turnitin.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground" htmlFor="detector-input">Paste text to scan</label>
            <span className="font-mono text-xs text-muted-foreground">{charCount} chars</span>
          </div>
          <textarea
            id="detector-input"
            rows={8}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError("") }}
            placeholder="Paste your article, blog post, or any text to check for AI-generated content patterns..."
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
          />
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-muted-foreground font-mono">Minimum 50 chars for accurate results · No text is stored</p>
            <button
              onClick={handleRun}
              disabled={running || charCount < 50}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {running ? <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Scanning...</> : <>Scan for AI <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>

        {result && (
          <div className="flex flex-col gap-5 animate-slide-up">
            {/* Verdict card */}
            {(() => {
              const cfg = VERDICT_CONFIG[result.verdict]
              return (
                <div className={`rounded-lg border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 ${cfg.border} ${cfg.bg}`}>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-4xl font-extrabold font-mono" style={{ color: result.overallScore >= 70 ? "#ef4444" : result.overallScore >= 40 ? "#f59e0b" : "#00d47e" }}>
                      {result.overallScore}%
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">AI score</span>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <p className={`text-xl font-bold ${cfg.color}`}>{result.verdict}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
                  </div>
                </div>
              )
            })()}

            {/* Per-detector scores */}
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
              <p className="text-xs font-mono font-bold text-muted-foreground uppercase">Detector breakdown</p>
              <DetectorBar label="Originality.ai patterns" score={result.detectorScores.originalityAi} />
              <DetectorBar label="GPTZero patterns" score={result.detectorScores.gptZero} />
              <DetectorBar label="Turnitin patterns" score={result.detectorScores.turnitin} />
            </div>

            {/* High-risk phrases */}
            {result.highRiskPhrases.length > 0 && (
              <div className="rounded-lg border border-red-500/25 bg-card p-5 flex flex-col gap-3">
                <p className="text-xs font-mono font-bold text-red-400 uppercase">High-risk phrases detected</p>
                <div className="flex flex-wrap gap-2">
                  {result.highRiskPhrases.map((phrase) => (
                    <span key={phrase} className="rounded border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-mono text-red-400">{phrase}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Signals */}
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
              <p className="text-xs font-mono font-bold text-muted-foreground uppercase">Signal patterns identified</p>
              {result.signals.map((signal, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-warning mt-0.5 shrink-0">·</span>
                  <p className="text-sm text-muted-foreground">{signal}</p>
                </div>
              ))}
            </div>

            <ShareButtons
              shareText={`Scanned my content with @AAIOINC's AI Detection Scanner — verdict: ${result.verdict} (${result.overallScore}% AI score). Free tool:`}
              url="https://aaioinc.com/tools/ai-detector"
              label="Share your scan result"
            />

            {/* Upsell to humanizer */}
            {result.overallScore >= 40 && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-foreground">Score too high?</p>
                  <p className="text-xs text-muted-foreground mt-1">Run it through the AI Content Humanizer to bring detection scores down.</p>
                </div>
                <Link href="/tools/humanizer" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                  Humanize Content <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
