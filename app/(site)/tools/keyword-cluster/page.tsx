"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

type Intent = "informational" | "commercial" | "transactional" | "navigational"
type Priority = "high" | "medium" | "low"

interface Cluster {
  topic: string
  intent: Intent
  priority: Priority
  keywords: string[]
  contentAngle: string
}

interface Result {
  clusters: Cluster[]
  totalKeywords: number
  recommendations: string[]
}

const INTENT_STYLES: Record<Intent, string> = {
  informational:  "text-primary bg-primary/10 border-primary/25",
  commercial:     "text-success bg-success/10 border-success/25",
  transactional:  "text-warning bg-warning/10 border-warning/25",
  navigational:   "text-sky-400 bg-sky-500/10 border-sky-500/25",
}

const PRIORITY_STYLES: Record<Priority, string> = {
  high:   "text-success",
  medium: "text-warning",
  low:    "text-muted-foreground",
}

const EXAMPLE_KEYWORDS = `best project management tools
project management software
free project management app
asana vs monday
trello alternatives
notion project management
team collaboration software
task management for remote teams
agile project management tools
best free trello alternative`

export default function KeywordClusterPage() {
  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleRun() {
    if (!input.trim()) { setError("Paste at least 2 keywords."); return }
    setError(""); setRunning(true); setResult(null)
    try {
      const res = await fetch("/api/tools/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "keyword-cluster", input }),
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

  function copyAll() {
    if (!result) return
    const text = result.clusters.map(c =>
      `# ${c.topic} (${c.intent}, ${c.priority} priority)\n${c.keywords.join("\n")}`
    ).join("\n\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">Keyword Cluster Generator</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono">Free</span>
            <span className="font-mono text-xs text-muted-foreground">5/day free · Content &amp; SEO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Keyword Cluster Generator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Paste up to 100 keywords and get them grouped into semantic clusters with intent tags, priority ranking, and content angle suggestions.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground" htmlFor="kw-input">Keyword list (one per line)</label>
            <button onClick={() => setInput(EXAMPLE_KEYWORDS)} className="text-xs font-mono text-primary hover:underline">Load example</button>
          </div>
          <textarea
            id="kw-input"
            rows={8}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError("") }}
            placeholder="best project management tools&#10;asana vs monday&#10;trello alternatives&#10;..."
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none font-mono"
          />
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {running ? <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> Clustering...</> : <>Cluster Keywords <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>

        {result && (
          <div className="flex flex-col gap-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">{result.clusters.length} clusters from {result.totalKeywords} keywords</p>
              </div>
              <button onClick={copyAll} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors">
                {copied ? <><Check size={11} className="text-success" /> Copied</> : <><Copy size={11} /> Copy all</>}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.clusters.map((cluster, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground text-sm leading-tight">{cluster.topic}</p>
                    <span className={`shrink-0 rounded-full border px-2 py-px text-[9px] font-mono font-bold uppercase ${INTENT_STYLES[cluster.intent]}`}>
                      {cluster.intent}
                    </span>
                  </div>
                  <p className={`text-xs font-mono font-semibold uppercase ${PRIORITY_STYLES[cluster.priority]}`}>
                    {cluster.priority} priority
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.keywords.map((kw) => (
                      <span key={kw} className="rounded border border-border bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{kw}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic border-t border-border pt-2.5 leading-relaxed">{cluster.contentAngle}</p>
                </div>
              ))}
            </div>

            {result.recommendations.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground">Recommendations</p>
                {result.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-mono text-xs text-primary font-bold shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
                  </div>
                ))}
              </div>
            )}

            <ShareButtons
              shareText={`Clustered ${result.totalKeywords} keywords into ${result.clusters.length} semantic groups with @AAIOINC's free Keyword Cluster Generator.`}
              url="https://aaioinc.com/tools/keyword-cluster"
              label="Share your cluster results"
            />

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-foreground">Need full content briefs for each cluster?</p>
              <Link href="/tools/content-brief" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                Build Content Brief <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
