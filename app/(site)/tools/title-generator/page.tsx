"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle, TrendingUp } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

interface TitleEntry {
  title: string
  ctrScore: number
  seoScore: number
  aiCitationScore: number
  type: string
  powerWords: string[]
}

interface TitleResult {
  titles: TitleEntry[]
  topPick: string
  reasoning: string
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground w-6 text-right">{score}</span>
    </div>
  )
}

export default function TitleGeneratorPage() {
  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<TitleResult | null>(null)
  const [error, setError] = useState("")
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  async function handleRun() {
    if (!input.trim()) { setError("Enter a topic or target keyword."); return }
    setError(""); setRunning(true); setResult(null)
    try {
      const res = await fetch("/api/tools/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "title-generator", input }),
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

  function copyTitle(title: string, idx: number) {
    navigator.clipboard.writeText(title)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const avgScore = (t: TitleEntry) => Math.round((t.ctrScore + t.seoScore + t.aiCitationScore) / 3)

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">Blog Title Generator</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono">Free</span>
            <span className="font-mono text-xs text-muted-foreground">5/day · Content &amp; SEO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Blog Title Generator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Enter a topic and get 10 headline variations scored for CTR, SEO strength, and AI citation potential — with power word analysis on each.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground" htmlFor="title-input">Topic + target keyword</label>
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              id="title-input"
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
              placeholder="e.g. best AI tools for content marketing 2026"
              className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            <button
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
            >
              {running ? <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Generating...</> : <>Generate Titles <ArrowRight size={14} /></>}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {["best AI tools for content marketing", "how to rank in AI Overviews", "affiliate marketing for beginners 2026"].map((ex) => (
              <button key={ex} onClick={() => setInput(ex)} className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">{ex}</button>
            ))}
          </div>
        </div>

        {result && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <ShareButtons
              shareText={`Generated 10 scored blog title variations for "${result.topPick}" with @AAIOINC's free Title Generator — CTR, SEO, and AI citation scores included.`}
              url="https://aaioinc.com/tools/title-generator"
              label="Share your titles"
            />

            {/* Top pick */}
            <div className="rounded-lg border border-primary/40 bg-primary/8 p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" />
                <p className="text-xs font-mono font-bold text-primary uppercase">Top Pick</p>
              </div>
              <p className="text-base font-bold text-foreground">{result.topPick}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.reasoning}</p>
            </div>

            {/* All titles */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">All 10 variations — sorted by overall score</p>
              {[...result.titles].sort((a, b) => avgScore(b) - avgScore(a)).map((title, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground leading-snug">{title.title}</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">{title.type}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-bold text-primary">{avgScore(title)}</span>
                      <button
                        onClick={() => copyTitle(title.title, i)}
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        {copiedIdx === i ? <Check size={11} className="text-success" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase">CTR</p>
                      <ScoreBar score={title.ctrScore} color="#635BFF" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase">SEO</p>
                      <ScoreBar score={title.seoScore} color="#00D47E" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase">AI Cite</p>
                      <ScoreBar score={title.aiCitationScore} color="#F59E0B" />
                    </div>
                  </div>
                  {title.powerWords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {title.powerWords.map((w) => (
                        <span key={w} className="rounded border border-primary/25 bg-primary/8 px-2 py-px text-[9px] font-mono text-primary">{w}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
