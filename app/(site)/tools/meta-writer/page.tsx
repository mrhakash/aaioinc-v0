"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

type CTAPower = "high" | "medium" | "low"

interface MetaEntry {
  text: string
  charCount: number
  angle: string
  ctaPower: CTAPower
}

interface MetaResult {
  metaDescriptions: MetaEntry[]
  keywordUsage: string
  tips: string[]
}

const CTA_STYLES: Record<CTAPower, string> = {
  high:   "text-success border-success/30 bg-success/8",
  medium: "text-warning border-warning/30 bg-warning/8",
  low:    "text-muted-foreground border-border bg-secondary",
}

const CHAR_LIMIT = 155

export default function MetaWriterPage() {
  const [input, setInput] = useState("")
  const [keyword, setKeyword] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<MetaResult | null>(null)
  const [error, setError] = useState("")
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  async function handleRun() {
    if (!input.trim()) { setError("Enter a URL or page description."); return }
    setError(""); setRunning(true); setResult(null)
    try {
      const res = await fetch("/api/tools/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "meta-writer", input, extra: { keyword } }),
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

  function copyMeta(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">Meta Description Writer</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono">Free</span>
            <span className="font-mono text-xs text-muted-foreground">5/day · Content &amp; SEO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Meta Description Writer</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Get 3 CTR-optimized meta descriptions — all under 155 characters, keyword-inclusive, and ready to copy.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground" htmlFor="meta-input">URL or page description</label>
              <input
                id="meta-input"
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError("") }}
                placeholder="https://example.com/blog/best-ai-tools or 'Article about top AI tools for marketers in 2026'"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground" htmlFor="meta-keyword">Target keyword (optional)</label>
              <input
                id="meta-keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. best AI tools for marketers"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

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
              {running ? <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Writing...</> : <>Write Metas <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>

        {result && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <p className="text-sm font-semibold text-foreground">3 meta description variations</p>

            {result.metaDescriptions.map((meta, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-primary/60 shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-foreground leading-relaxed flex-1">{meta.text}</p>
                  <button
                    onClick={() => copyMeta(meta.text, i)}
                    className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    {copiedIdx === i ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Char bar */}
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(meta.charCount / CHAR_LIMIT) * 100}%`,
                          background: meta.charCount > CHAR_LIMIT ? "#ef4444" : meta.charCount > 130 ? "#f59e0b" : "#00d47e",
                        }}
                      />
                    </div>
                    <span className={`font-mono text-[10px] shrink-0 ${meta.charCount > CHAR_LIMIT ? "text-red-400" : "text-muted-foreground"}`}>
                      {meta.charCount}/{CHAR_LIMIT}
                    </span>
                  </div>
                  <span className={`rounded-full border px-2 py-px text-[9px] font-mono font-bold uppercase ${CTA_STYLES[meta.ctaPower]}`}>
                    {meta.ctaPower} CTA
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground italic">{meta.angle}</span>
                </div>
              </div>
            ))}

            {/* Keyword usage */}
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-1.5">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Keyword integration</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.keywordUsage}</p>
            </div>

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Tips</p>
                {result.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-primary shrink-0 mt-0.5">·</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            <ShareButtons
              shareText={`Generated 3 CTR-optimized meta descriptions in seconds with @AAIOINC's free Meta Description Writer.`}
              url="https://aaioinc.com/tools/meta-writer"
              label="Share this result"
            />
          </div>
        )}
      </div>
    </div>
  )
}
