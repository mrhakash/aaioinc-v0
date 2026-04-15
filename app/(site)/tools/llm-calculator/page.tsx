"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, RefreshCw, TrendingDown, Zap, BookOpen, Globe } from "lucide-react"

// ── Pricing data (updated 2025) ──────────────────────────────────────────────
// Prices in USD per 1M tokens
interface Model {
  id: string
  name: string
  provider: string
  inputPer1M: number   // USD
  outputPer1M: number  // USD
  contextK: number     // context window in K tokens
  speed: "fast" | "medium" | "slow"
  notes?: string
}

const MODELS: Model[] = [
  // OpenAI
  { id: "gpt-4o",              name: "GPT-4o",               provider: "OpenAI",    inputPer1M: 2.50,  outputPer1M: 10.00, contextK: 128,  speed: "fast" },
  { id: "gpt-4o-mini",         name: "GPT-4o mini",          provider: "OpenAI",    inputPer1M: 0.15,  outputPer1M: 0.60,  contextK: 128,  speed: "fast" },
  { id: "gpt-4.1",             name: "GPT-4.1",              provider: "OpenAI",    inputPer1M: 2.00,  outputPer1M: 8.00,  contextK: 1000, speed: "fast" },
  { id: "gpt-4.1-mini",        name: "GPT-4.1 mini",         provider: "OpenAI",    inputPer1M: 0.40,  outputPer1M: 1.60,  contextK: 1000, speed: "fast" },
  { id: "o3-mini",             name: "o3-mini",              provider: "OpenAI",    inputPer1M: 1.10,  outputPer1M: 4.40,  contextK: 200,  speed: "slow",   notes: "Reasoning" },
  { id: "o4-mini",             name: "o4-mini",              provider: "OpenAI",    inputPer1M: 1.10,  outputPer1M: 4.40,  contextK: 200,  speed: "medium", notes: "Reasoning" },
  // Anthropic
  { id: "claude-opus-4.6",     name: "Claude Opus 4.6",      provider: "Anthropic", inputPer1M: 15.00, outputPer1M: 75.00, contextK: 200,  speed: "medium" },
  { id: "claude-sonnet-4",     name: "Claude Sonnet 4",      provider: "Anthropic", inputPer1M: 3.00,  outputPer1M: 15.00, contextK: 200,  speed: "fast" },
  { id: "claude-haiku-3-5",    name: "Claude Haiku 3.5",     provider: "Anthropic", inputPer1M: 0.80,  outputPer1M: 4.00,  contextK: 200,  speed: "fast" },
  // Google
  { id: "gemini-3-flash",      name: "Gemini 3 Flash",       provider: "Google",    inputPer1M: 0.075, outputPer1M: 0.30,  contextK: 1000, speed: "fast" },
  { id: "gemini-2-pro",        name: "Gemini 2 Pro",         provider: "Google",    inputPer1M: 1.25,  outputPer1M: 5.00,  contextK: 1000, speed: "medium" },
  { id: "gemini-2-flash",      name: "Gemini 2.0 Flash",     provider: "Google",    inputPer1M: 0.10,  outputPer1M: 0.40,  contextK: 1000, speed: "fast" },
  // Mistral
  { id: "mistral-large",       name: "Mistral Large",        provider: "Mistral",   inputPer1M: 2.00,  outputPer1M: 6.00,  contextK: 128,  speed: "medium" },
  { id: "mistral-small",       name: "Mistral Small",        provider: "Mistral",   inputPer1M: 0.10,  outputPer1M: 0.30,  contextK: 128,  speed: "fast" },
  { id: "codestral",           name: "Codestral",            provider: "Mistral",   inputPer1M: 0.20,  outputPer1M: 0.60,  contextK: 256,  speed: "fast",   notes: "Code" },
  // Meta / Groq
  { id: "llama-3-3-70b",       name: "Llama 3.3 70B",        provider: "Meta/Groq", inputPer1M: 0.59,  outputPer1M: 0.79,  contextK: 128,  speed: "fast" },
  { id: "llama-3-1-8b",        name: "Llama 3.1 8B",         provider: "Meta/Groq", inputPer1M: 0.05,  outputPer1M: 0.08,  contextK: 128,  speed: "fast" },
  // DeepSeek
  { id: "deepseek-v3",         name: "DeepSeek V3",          provider: "DeepSeek",  inputPer1M: 0.27,  outputPer1M: 1.10,  contextK: 64,   speed: "medium" },
  { id: "deepseek-r1",         name: "DeepSeek R1",          provider: "DeepSeek",  inputPer1M: 0.55,  outputPer1M: 2.19,  contextK: 64,   speed: "slow",   notes: "Reasoning" },
  // xAI
  { id: "grok-2",              name: "Grok-2",               provider: "xAI",       inputPer1M: 2.00,  outputPer1M: 10.00, contextK: 131,  speed: "fast" },
  { id: "grok-3-mini",         name: "Grok-3 Mini",          provider: "xAI",       inputPer1M: 0.30,  outputPer1M: 0.50,  contextK: 131,  speed: "fast" },
  // Cohere
  { id: "command-r-plus",      name: "Command R+",           provider: "Cohere",    inputPer1M: 2.50,  outputPer1M: 10.00, contextK: 128,  speed: "medium" },
  { id: "command-r",           name: "Command R",            provider: "Cohere",    inputPer1M: 0.15,  outputPer1M: 0.60,  contextK: 128,  speed: "fast" },
]

const PROVIDERS = ["All", ...Array.from(new Set(MODELS.map((m) => m.provider))).sort()]

const speedBadge: Record<Model["speed"], { label: string; cls: string }> = {
  fast:   { label: "Fast",   cls: "text-primary bg-primary/10 border-primary/25" },
  medium: { label: "Medium", cls: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
  slow:   { label: "Slow",   cls: "text-muted-foreground bg-secondary border-border" },
}

function formatCost(usd: number): string {
  if (usd === 0) return "$0.00"
  if (usd < 0.01) return `$${usd.toFixed(5)}`
  if (usd < 1)    return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(2)}`
}

export default function LLMCalculatorPage() {
  const [inputTokensM, setInputTokensM]   = useState(1)    // millions
  const [outputTokensM, setOutputTokensM] = useState(0.25) // millions
  const [batchMode, setBatchMode]         = useState(false)
  const [provider, setProvider]           = useState("All")
  const [sortBy, setSortBy]               = useState<"cost" | "input" | "output" | "speed">("cost")

  const rows = useMemo(() => {
    const filtered = provider === "All" ? MODELS : MODELS.filter((m) => m.provider === provider)
    const batchMultiplier = batchMode ? 0.5 : 1

    const withCost = filtered.map((m) => {
      const inputCost  = (inputTokensM  * m.inputPer1M  * batchMultiplier)
      const outputCost = (outputTokensM * m.outputPer1M * batchMultiplier)
      const totalCost  = inputCost + outputCost
      return { ...m, inputCost, outputCost, totalCost }
    })

    if (sortBy === "cost")   return withCost.sort((a, b) => a.totalCost  - b.totalCost)
    if (sortBy === "input")  return withCost.sort((a, b) => a.inputPer1M - b.inputPer1M)
    if (sortBy === "output") return withCost.sort((a, b) => a.outputPer1M - b.outputPer1M)
    // speed: fast < medium < slow
    const order = { fast: 0, medium: 1, slow: 2 }
    return withCost.sort((a, b) => order[a.speed] - order[b.speed])
  }, [inputTokensM, outputTokensM, batchMode, provider, sortBy])

  const cheapest = rows[0]
  const mostExpensive = rows[rows.length - 1]

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-6xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">LLM Cost Calculator</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono font-medium">FREE</span>
            <span className="font-mono text-xs text-muted-foreground">Developer Tools</span>
            <span className="font-mono text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
              {MODELS.length} models · Updated Apr 2025
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">LLM Cost Calculator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Compare real pricing across {MODELS.length} LLM models from OpenAI, Anthropic, Google, Mistral, and more. Enter your token usage and find the cheapest model for your exact workload.
          </p>
        </div>

        {/* Controls */}
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Input tokens */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Input tokens</label>
                <span className="font-mono text-sm font-bold text-primary">
                  {inputTokensM >= 1
                    ? `${inputTokensM.toFixed(1)}M`
                    : `${(inputTokensM * 1000).toFixed(0)}K`
                  }
                </span>
              </div>
              <input
                type="range" min={0.01} max={20} step={0.01}
                value={inputTokensM}
                onChange={(e) => setInputTokensM(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>10K</span><span>1M</span><span>5M</span><span>20M</span>
              </div>
            </div>

            {/* Output tokens */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Output tokens</label>
                <span className="font-mono text-sm font-bold text-primary">
                  {outputTokensM >= 1
                    ? `${outputTokensM.toFixed(2)}M`
                    : `${(outputTokensM * 1000).toFixed(0)}K`
                  }
                </span>
              </div>
              <input
                type="range" min={0.001} max={5} step={0.001}
                value={outputTokensM}
                onChange={(e) => setOutputTokensM(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1K</span><span>250K</span><span>1M</span><span>5M</span>
              </div>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
            {/* Provider filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {PROVIDERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
                    provider === p
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {/* Batch mode toggle */}
              <button
                onClick={() => setBatchMode(!batchMode)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-mono transition-colors ${
                  batchMode
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <TrendingDown size={11} />
                Batch 50% off
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="cost">Sort: Total cost</option>
                <option value="input">Sort: Input price</option>
                <option value="output">Sort: Output price</option>
                <option value="speed">Sort: Speed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary callouts */}
        {rows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex flex-col gap-1">
              <p className="font-mono text-xs text-muted-foreground">Cheapest for this workload</p>
              <p className="font-bold text-foreground">{cheapest.name}</p>
              <p className="font-mono text-sm text-primary">{formatCost(cheapest.totalCost)}</p>
              <p className="font-mono text-xs text-muted-foreground">{cheapest.provider}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-1">
              <p className="font-mono text-xs text-muted-foreground">Most expensive</p>
              <p className="font-bold text-foreground">{mostExpensive.name}</p>
              <p className="font-mono text-sm text-foreground">{formatCost(mostExpensive.totalCost)}</p>
              <p className="font-mono text-xs text-muted-foreground">{mostExpensive.provider}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-1">
              <p className="font-mono text-xs text-muted-foreground">Savings (cheapest vs most exp.)</p>
              <p className="font-bold text-foreground">
                {mostExpensive.totalCost > 0
                  ? `${((1 - cheapest.totalCost / mostExpensive.totalCost) * 100).toFixed(0)}% cheaper`
                  : "—"
                }
              </p>
              <p className="font-mono text-sm text-foreground">
                {formatCost(mostExpensive.totalCost - cheapest.totalCost)} saved
              </p>
            </div>
          </div>
        )}

        {/* Results table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-foreground">
              {rows.length} model{rows.length !== 1 ? "s" : ""} compared
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              Based on {inputTokensM >= 1 ? `${inputTokensM.toFixed(1)}M` : `${(inputTokensM * 1000).toFixed(0)}K`} input + {outputTokensM >= 1 ? `${outputTokensM.toFixed(2)}M` : `${(outputTokensM * 1000).toFixed(0)}K`} output tokens
              {batchMode ? " (batch pricing)" : ""}
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground font-medium">Model</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground font-medium">Provider</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground font-medium">Input / 1M</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground font-medium">Output / 1M</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground font-medium">Context</th>
                  <th className="text-center px-4 py-3 font-mono text-xs text-muted-foreground font-medium">Speed</th>
                  <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground font-medium">Est. Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((m, i) => {
                  const isChampion = i === 0
                  const sb = speedBadge[m.speed]
                  return (
                    <tr
                      key={m.id}
                      className={`transition-colors ${isChampion ? "bg-primary/5" : "hover:bg-secondary/50"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isChampion && <Zap size={12} className="text-primary shrink-0" />}
                          <span className={`font-medium ${isChampion ? "text-primary" : "text-foreground"}`}>
                            {m.name}
                          </span>
                          {m.notes && (
                            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                              {m.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">{m.provider}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-foreground">
                        ${m.inputPer1M.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-foreground">
                        ${m.outputPer1M.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                        {m.contextK >= 1000 ? `${m.contextK / 1000}M` : `${m.contextK}K`}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${sb.cls}`}>
                          {sb.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-mono text-sm font-bold ${isChampion ? "text-primary" : "text-foreground"}`}>
                          {formatCost(m.totalCost)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-2 sm:hidden">
            {rows.map((m, i) => {
              const isChampion = i === 0
              const sb = speedBadge[m.speed]
              return (
                <div
                  key={m.id}
                  className={`rounded-lg border p-4 flex flex-col gap-2 ${
                    isChampion ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isChampion && <Zap size={12} className="text-primary shrink-0" />}
                      <span className={`font-medium text-sm ${isChampion ? "text-primary" : "text-foreground"}`}>
                        {m.name}
                      </span>
                    </div>
                    <span className={`font-mono text-sm font-bold ${isChampion ? "text-primary" : "text-foreground"}`}>
                      {formatCost(m.totalCost)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{m.provider}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${sb.cls}`}>{sb.label}</span>
                    {m.notes && (
                      <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {m.notes}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                    <span>In: ${m.inputPer1M.toFixed(2)}/1M</span>
                    <span>Out: ${m.outputPer1M.toFixed(2)}/1M</span>
                    <span>Ctx: {m.contextK >= 1000 ? `${m.contextK / 1000}M` : `${m.contextK}K`}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: TrendingDown,
              title: "Reduce output tokens",
              detail: "Output tokens cost 3–5x more than input. Use structured prompts with JSON output and strict length instructions to cut costs by 30–50%.",
            },
            {
              icon: RefreshCw,
              title: "Use batch mode",
              detail: "OpenAI and Anthropic both offer 50% discounts for async batch jobs. If your use case can tolerate 24h latency, batch mode halves your bill.",
            },
            {
              icon: Globe,
              title: "Cache input prompts",
              detail: "Anthropic and OpenAI offer prompt caching for repeated system prompts. Cache hit rates >70% can reduce input costs by up to 90%.",
            },
          ].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-primary shrink-0" />
                <p className="font-semibold text-foreground text-sm">{title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground/70 font-mono">
          Prices are sourced from official provider pricing pages and updated regularly. Actual costs may vary — always verify with the provider before committing to a workload.{" "}
          <Link href="/blog" className="text-primary hover:underline">Read our LLM cost guide</Link>.
        </p>

        {/* CTA */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="font-semibold text-foreground">Need help choosing the right model?</p>
            <p className="text-sm text-muted-foreground mt-1">Our AI Stack Recommender analyzes your use case and recommends the optimal provider, model, and prompt strategy.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/tools/stack-recommender" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
              AI Stack Recommender <ArrowRight size={14} />
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
