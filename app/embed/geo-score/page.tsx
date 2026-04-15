"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const SIGNALS = [
  { name: "Schema Markup", score: 18, max: 20 },
  { name: "Entity Clarity", score: 14, max: 20 },
  { name: "Factual Density", score: 16, max: 20 },
  { name: "Readability", score: 15, max: 20 },
  { name: "Citation Signals", score: 15, max: 20 },
]

function ScoreArc({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score))
  const color = clamped >= 80 ? "#00D47E" : clamped >= 50 ? "#F59E0B" : "#EF4444"
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="68" viewBox="0 0 120 68" fill="none" aria-hidden="true">
        <path d="M8 64 A52 52 0 0 1 112 64" stroke="#1e1e1e" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path
          d="M8 64 A52 52 0 0 1 112 64"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * 163} 163`}
          fill="none"
        />
      </svg>
      <div className="-mt-9 flex flex-col items-center">
        <span className="text-4xl font-bold leading-none" style={{ color }}>{clamped}</span>
        <span className="font-mono text-[10px] text-muted-foreground mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

function GradeLabel({ score }: { score: number }) {
  if (score >= 90) return <span className="text-success font-mono text-xs">Excellent</span>
  if (score >= 75) return <span className="text-success font-mono text-xs">Good</span>
  if (score >= 55) return <span className="text-warning font-mono text-xs">Needs work</span>
  return <span className="text-danger font-mono text-xs">Poor</span>
}

function EmbedWidgetInner() {
  const params = useSearchParams()
  const domain = params.get("domain") || "your-site.com"
  const rawScore = parseInt(params.get("score") || "0", 10)
  const score = isNaN(rawScore) ? 78 : Math.min(100, Math.max(0, rawScore))

  // Scale signals proportionally to the given score
  const scaleFactor = score / 78 // default signals sum to 78
  const signals = SIGNALS.map((s) => ({
    ...s,
    score: Math.min(s.max, Math.round(s.score * scaleFactor)),
  }))

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3">
      <div className="w-full max-w-[360px] rounded-xl border border-border bg-card shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">GEO Score</span>
            <span className="font-semibold text-foreground text-xs truncate max-w-[180px]">{domain}</span>
          </div>
          <ScoreArc score={score} />
        </div>

        {/* Signals */}
        <div className="px-4 py-3 flex flex-col gap-2">
          {signals.map((sig) => {
            const pct = (sig.score / sig.max) * 100
            const color = pct >= 80 ? "#00D47E" : pct >= 55 ? "#F59E0B" : "#EF4444"
            return (
              <div key={sig.name} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">{sig.name}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color }}>{sig.score}/{sig.max}</span>
                </div>
                <div className="h-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: color, transition: "width 0.8s ease" }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Grade + status row */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-muted-foreground">Rating:</span>
            <GradeLabel score={score} />
          </div>
          <Link
            href={`https://aaioinc.com/geo/score`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-primary px-3 py-1.5 text-[10px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Analyze your site
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-center gap-1">
          <span className="text-[9px] font-mono text-muted-foreground">Powered by</span>
          <Link
            href="https://aaioinc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-mono font-bold text-primary hover:underline"
          >
            AAIOINC
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function GeoScoreEmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <EmbedWidgetInner />
    </Suspense>
  )
}
