"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle, ChevronDown, ChevronRight } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

interface OutlineSection { h2: string; h3s: string[] }
interface BriefResult {
  targetKeyword: string
  semanticVariants: string[]
  searchIntent: string
  recommendedTitle: string
  metaDescription: string
  wordCountRecommendation: number
  outline: OutlineSection[]
  mustCoverTopics: string[]
  geoAngle: string
  internalLinkOpportunities: string[]
}

export default function ContentBriefPage() {
  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<BriefResult | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]))

  async function handleRun() {
    if (!input.trim()) { setError("Enter a target keyword."); return }
    setError(""); setRunning(true); setResult(null)
    try {
      const res = await fetch("/api/tools/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "content-brief", input }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? "Something went wrong."); return }
      setResult(data.output)
      setOpenSections(new Set([0]))
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setRunning(false)
    }
  }

  function toggleSection(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function copyBrief() {
    if (!result) return
    const lines = [
      `# Content Brief: ${result.targetKeyword}`,
      ``,
      `## Title: ${result.recommendedTitle}`,
      `Meta: ${result.metaDescription}`,
      `Intent: ${result.searchIntent}`,
      `Word Count: ${result.wordCountRecommendation}`,
      ``,
      `## Semantic Variants`,
      result.semanticVariants.join(", "),
      ``,
      `## Outline`,
      ...result.outline.map(s => `### ${s.h2}\n${s.h3s.map(h => `- ${h}`).join("\n")}`),
      ``,
      `## GEO Angle`,
      result.geoAngle,
    ]
    navigator.clipboard.writeText(lines.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">Content Brief Builder</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono">Free</span>
            <span className="font-mono text-xs text-muted-foreground">5/day · Content &amp; SEO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Content Brief Builder</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Enter a target keyword and get a complete brief: outline, recommended word count, GEO angle, meta description, and internal linking plan.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground" htmlFor="cb-input">Target keyword</label>
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              id="cb-input"
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
              placeholder="e.g. best project management tools for remote teams"
              className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            <button
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
            >
              {running ? <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Building...</> : <>Build Brief <ArrowRight size={14} /></>}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {["best project management tools", "AI automation for small business", "how to write SEO content"].map((ex) => (
              <button key={ex} onClick={() => setInput(ex)} className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">{ex}</button>
            ))}
          </div>
        </div>

        {running && (
          <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-foreground font-medium">Building your content brief...</p>
          </div>
        )}

        {result && !running && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-lg font-bold text-foreground">Brief: {result.targetKeyword}</p>
              <button onClick={copyBrief} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors">
                {copied ? <><Check size={11} className="text-success" />Copied</> : <><Copy size={11} />Copy brief</>}
              </button>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Intent", value: result.searchIntent },
                { label: "Word Count", value: result.wordCountRecommendation.toLocaleString() },
                { label: "Variants", value: result.semanticVariants.length + " keywords" },
                { label: "Outline Depth", value: result.outline.length + " H2s" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-1">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            {/* Recommended title + meta */}
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
              <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Title &amp; Meta</p>
              <p className="text-base font-bold text-foreground">{result.recommendedTitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">{result.metaDescription}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{result.metaDescription.length} chars</p>
            </div>

            {/* Collapsible outline */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Article Outline</p>
              </div>
              <div className="divide-y divide-border">
                {result.outline.map((section, i) => (
                  <div key={i}>
                    <button
                      onClick={() => toggleSection(i)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-secondary/40 transition-colors"
                    >
                      <span className="font-mono text-xs text-primary font-bold shrink-0">H2</span>
                      <span className="text-sm font-semibold text-foreground flex-1">{section.h2}</span>
                      {openSections.has(i) ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
                    </button>
                    {openSections.has(i) && section.h3s.length > 0 && (
                      <div className="px-5 pb-3 flex flex-col gap-1.5 bg-secondary/20">
                        {section.h3s.map((h3, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-muted-foreground font-bold shrink-0">H3</span>
                            <span className="text-xs text-muted-foreground">{h3}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* GEO angle */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 flex flex-col gap-2">
              <p className="text-xs font-mono font-bold text-primary uppercase tracking-wider">GEO Angle</p>
              <p className="text-sm text-foreground leading-relaxed">{result.geoAngle}</p>
            </div>

            {/* Must-cover topics */}
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
              <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Must-Cover Topics</p>
              <div className="flex flex-wrap gap-2">
                {result.mustCoverTopics.map((t) => (
                  <span key={t} className="rounded border border-border bg-secondary px-2.5 py-1 text-xs font-mono text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>

            <ShareButtons
              shareText={`Built a full content brief for "${result.targetKeyword}" with @AAIOINC's free Content Brief Builder — outline, GEO angle, meta, and internal links.`}
              url="https://aaioinc.com/tools/content-brief"
              label="Share this brief"
            />
          </div>
        )}
      </div>
    </div>
  )
}
