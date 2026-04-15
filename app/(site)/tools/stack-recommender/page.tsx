"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertCircle, Sparkles, Copy, Check, ExternalLink, X } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

const DAILY_LIMIT = 3

type RunState = "idle" | "running" | "done"

interface StackTool {
  name: string
  category: string
  description: string
  pricing: string
  complexity: "Easy" | "Medium" | "Hard"
  url: string
}

interface StackResult {
  useCase: string
  summary: string
  totalCost: string
  tools: StackTool[]
  setupSteps: string[]
  alternatives: { name: string; tradeoff: string }[]
}

const complexityColors: Record<string, string> = {
  Easy: "text-primary bg-primary/10 border-primary/30",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Hard: "text-red-400 bg-red-400/10 border-red-400/30",
}

export default function StackRecommenderPage() {
  const [input, setInput] = useState("")
  const [runState, setRunState] = useState<RunState>("idle")
  const [result, setResult] = useState<StackResult | null>(null)
  const [runsToday, setRunsToday] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const isAtLimit = runsToday >= DAILY_LIMIT

  async function handleRecommend() {
    if (!input.trim()) {
      setErrorMsg("Describe your use case to get recommendations.")
      return
    }
    if (input.length < 20) {
      setErrorMsg("Please provide more detail about what you want to build or automate.")
      return
    }
    if (isAtLimit) {
      setErrorMsg("You've reached the free limit of 3/day. Upgrade to Pro for unlimited.")
      return
    }
    setErrorMsg("")
    setRunState("running")

    try {
      const res = await fetch("/api/tools/stack-recommender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase: input }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMsg(data.message ?? "Daily limit reached. Upgrade to Pro for unlimited recommendations.")
          setRunState("idle")
          return
        }
        throw new Error(data.message ?? "Something went wrong.")
      }

      setResult(data)
      setRunState("done")
      const newCount = runsToday + 1
      setRunsToday(newCount)
      setShowUpsell(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.")
      setRunState("idle")
    }
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
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
          <span className="text-foreground">AI Stack Recommender</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 px-2.5 py-0.5 text-xs font-mono font-medium">Freemium</span>
            <span className="font-mono text-xs text-muted-foreground">Strategy</span>
            <span className="font-mono text-xs text-muted-foreground border border-border rounded px-2 py-0.5">{runsToday}/{DAILY_LIMIT} runs today</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">AI Stack Recommender</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Describe what you want to build or automate in plain language. Get a recommended AI stack with pricing comparison, integration complexity, and setup guide.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70 border border-border rounded-md px-3 py-2 bg-secondary w-fit">
            Free: 3/day · Pro: Unlimited + export + custom integrations
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setErrorMsg("") }}
            placeholder="Describe your use case (e.g. 'I want to automate blog writing and SEO for a niche site' or 'Build a customer support chatbot that integrates with our helpdesk')..."
            rows={4}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleRecommend}
              disabled={runState === "running" || isAtLimit}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {runState === "running" ? (
                <>
                  <span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Get Stack Recommendation <ArrowRight size={14} /></>
              )}
            </button>
            <span className="text-xs text-muted-foreground">{input.length} characters</span>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} className="shrink-0" />
              {errorMsg}
              {isAtLimit && (
                <Link href="/pricing" className="ml-auto text-xs underline text-primary whitespace-nowrap">Upgrade to Pro</Link>
              )}
            </div>
          )}
        </div>

        {/* Upsell */}
        {showUpsell && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-foreground">
              Want <span className="font-semibold">custom integrations</span> and implementation support? Check out our services.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/services" className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                View Services
              </Link>
              <button onClick={() => setShowUpsell(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Running */}
        {runState === "running" && (
          <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-foreground font-medium">Analyzing your use case and finding the optimal stack...</p>
            <p className="text-xs text-muted-foreground">Comparing 50+ tools across categories</p>
          </div>
        )}

        {/* Results */}
        {result && runState === "done" && (
          <div className="flex flex-col gap-8">
            {/* Summary */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-primary" />
                <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Recommended Stack</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6 mb-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">For your use case:</p>
                  <p className="text-foreground font-medium">{result.useCase}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground mb-1">Estimated monthly cost</p>
                  <p className="text-2xl font-bold text-primary">{result.totalCost}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Tools */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">Recommended Tools ({result.tools.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.tools.map((tool, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{tool.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{tool.category}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium ${complexityColors[tool.complexity]}`}>
                        {tool.complexity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                      <span className="font-mono text-xs text-primary font-medium">{tool.pricing}</span>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Visit <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup steps */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">Setup Guide</h2>
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
                {result.setupSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="font-mono text-xs text-primary font-bold mt-0.5 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                    <div className="flex-1 flex items-start justify-between gap-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                      <button
                        onClick={() => copyToClipboard(step, idx)}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy step"
                      >
                        {copiedIdx === idx ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">Alternative Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.alternatives.map((alt, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
                    <p className="font-semibold text-sm text-foreground">{alt.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{alt.tradeoff}</p>
                  </div>
                ))}
              </div>
            </div>

            <ShareButtons
              shareText={`Just used the @AAIOINC AI Stack Recommender to plan my AI implementation. Check it out:`}
              url="https://aaioinc.com/tools/stack-recommender"
              label="Share your stack"
            />
          </div>
        )}

        {/* FAQ */}
        <div className="border-t border-border pt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="flex flex-col gap-0 rounded-lg border border-border bg-card px-6 divide-y divide-border">
            {[
              { q: "How does the recommender work?", a: "We analyze your use case description against a database of 50+ AI tools and services. The recommendation considers pricing, integration complexity, feature coverage, and common stack patterns for similar use cases." },
              { q: "How current is the pricing data?", a: "Tool pricing is updated monthly from official sources. Some tools have usage-based pricing that may vary — we show typical monthly costs for the described use case." },
              { q: "What does integration complexity mean?", a: "Easy = no-code or simple API. Medium = some development required but well-documented. Hard = significant custom development or infrastructure setup needed." },
              { q: "Can I get help implementing the stack?", a: "Yes. Our managed services team can implement any recommended stack for you. Book a strategy call to discuss your specific requirements." },
              { q: "Are these affiliate recommendations?", a: "No. We don't receive affiliate commissions from tool vendors. Recommendations are based purely on fit for your described use case." },
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
            <p className="font-semibold text-foreground">Need help implementing your AI stack?</p>
            <p className="text-sm text-muted-foreground mt-1">Our managed services team handles setup, integration, and ongoing optimization. From OpenClaw agents to full content pipelines.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/services" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
              View Services <ArrowRight size={14} />
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
