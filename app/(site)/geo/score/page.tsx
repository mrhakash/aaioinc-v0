"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Info, Copy, Check, Code2 } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

interface Signal {
  name: string
  score: number
  max: number
  tip: string
}

const MOCK_SIGNALS: Signal[] = [
  { name: "Schema Markup", score: 18, max: 20, tip: "Add JSON-LD schema for Article, FAQPage, or HowTo to improve AI crawler parsing." },
  { name: "Entity Clarity", score: 14, max: 20, tip: "Clearly define the main entity (person, product, organization) in the first 100 words." },
  { name: "Factual Density", score: 16, max: 20, tip: "Include specific data points, statistics, and citations that AI models can verify." },
  { name: "Readability", score: 15, max: 20, tip: "Short paragraphs, clear headings, and plain language improve AI comprehension." },
  { name: "Citation Signals", score: 15, max: 20, tip: "External links to authoritative sources and internal linking to related content both help." },
]

function ScoreArc({ score }: { score: number }) {
  const clampedScore = Math.min(100, Math.max(0, score))
  const color = clampedScore >= 80 ? "#00e5ff" : clampedScore >= 50 ? "#f59e0b" : "#ef4444"
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="160" height="90" viewBox="0 0 160 90" fill="none" aria-hidden="true">
        {/* Background arc */}
        <path d="M10 85 A70 70 0 0 1 150 85" stroke="#1e1e1e" strokeWidth="14" strokeLinecap="round" fill="none" />
        {/* Filled arc */}
        <path
          d="M10 85 A70 70 0 0 1 150 85"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(clampedScore / 100) * 220} 220`}
          fill="none"
        />
      </svg>
      <div className="-mt-12 flex flex-col items-center">
        <span className="text-5xl font-bold text-foreground" style={{ color }}>{clampedScore}</span>
        <span className="font-mono text-xs text-muted-foreground mt-1">/ 100</span>
      </div>
    </div>
  )
}

export default function GeoScorePage() {
  const [input, setInput] = useState("")
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [embedDomain, setEmbedDomain] = useState("")
  const [embedCopied, setEmbedCopied] = useState(false)

  function copyEmbedCode() {
    const domain = embedDomain.trim() || "your-domain.com"
    const code = `<iframe\n  src="https://aaioinc.com/embed/geo-score?domain=${encodeURIComponent(domain)}&score=${totalScore}"\n  width="380"\n  height="280"\n  frameborder="0"\n  style="border-radius:12px;overflow:hidden;"\n  title="GEO Score — ${domain}"\n></iframe>`
    navigator.clipboard.writeText(code)
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2500)
  }

  const handleAnalyze = () => {
    if (!input.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAnalyzed(true)
    }, 1200)
  }

  const totalScore = MOCK_SIGNALS.reduce((acc, s) => acc + s.score, 0)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/geo" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> GEO Hub
          </Link>
          <span>/</span>
          <span className="text-foreground">GEO Score Analyzer</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-mono text-primary">Free</span>
            <span className="font-mono text-xs text-muted-foreground">No account required · 10 analyses/day</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">GEO Score Analyzer</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Paste a URL or content block to receive an instant 0–100 GEO score with a per-signal breakdown showing exactly what to fix.
          </p>
        </div>

        {/* Input */}
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-4">
          <label htmlFor="geo-input" className="text-sm font-medium text-foreground">
            URL or content to analyze
          </label>
          <textarea
            id="geo-input"
            rows={6}
            value={input}
            onChange={(e) => { setInput(e.target.value); setAnalyzed(false) }}
            placeholder="Paste a URL (https://...) or the full text of your article or page..."
            className="w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
          />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-muted-foreground font-mono">
              Supports raw URLs, pasted HTML, or plain-text content
            </p>
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || loading}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              {loading ? "Analyzing..." : "Analyze GEO Score"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
        </div>

        {/* Results */}
        {analyzed && (
          <div className="flex flex-col gap-6">
            {/* Score summary */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 flex flex-col md:flex-row items-center gap-8">
              <ScoreArc score={totalScore} />
              <div className="flex flex-col gap-3 flex-1">
                <p className="text-xl font-bold text-foreground">Your GEO Score: {totalScore}/100</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your content scores well on readability and citation signals, but has room to improve on schema markup and entity clarity — the two highest-impact GEO signals.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/auth/signup" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                    Save Result
                  </Link>
                </div>
              </div>
            </div>

            {/* Signal breakdown */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-foreground">Signal breakdown</h2>
              <div className="flex flex-col gap-3">
                {MOCK_SIGNALS.map((sig) => {
                  const pct = (sig.score / sig.max) * 100
                  return (
                    <div key={sig.name} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm text-foreground">{sig.name}</span>
                        <span className="font-mono text-sm text-foreground">{sig.score}/{sig.max}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {/* Tip */}
                      <div className="flex items-start gap-2">
                        <Info size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{sig.tip}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Share */}
            <ShareButtons
              shareText={`My site scored ${totalScore}/100 on the @AAIOINC GEO Score Analyzer — see the full signal breakdown:`}
              url="https://aaioinc.com/geo/score"
              label="Share your GEO score"
            />

            {/* Embed code generator */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/40">
                <Code2 size={14} className="text-muted-foreground" />
                <p className="text-xs font-mono font-semibold text-foreground">Embed this widget on your site</p>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Show your GEO score on your own website or blog. The badge auto-updates when you re-analyze.
                </p>
                <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                  <input
                    type="text"
                    value={embedDomain}
                    onChange={(e) => setEmbedDomain(e.target.value)}
                    placeholder="yourdomain.com"
                    className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors font-mono"
                  />
                  <button
                    onClick={copyEmbedCode}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
                  >
                    {embedCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy embed code</>}
                  </button>
                </div>
                {/* Code preview */}
                <div className="rounded-md bg-secondary border border-border overflow-hidden">
                  <pre className="p-4 text-[10px] font-mono text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre">{`<iframe
  src="https://aaioinc.com/embed/geo-score?domain=${embedDomain.trim() || "your-domain.com"}&score=${totalScore}"
  width="380"
  height="280"
  frameborder="0"
  style="border-radius:12px;overflow:hidden;"
  title="GEO Score — ${embedDomain.trim() || "your-domain.com"}"
></iframe>`}</pre>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  Widget dimensions: 380 × 280px · Responsive · No cookies
                </p>
              </div>
            </div>

            {/* Upgrade nudge */}
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground text-sm">Unlock unlimited analyses + history</p>
                <p className="text-xs text-muted-foreground mt-1">Pro plan saves every result, tracks score over time, and supports bulk URL scanning.</p>
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
