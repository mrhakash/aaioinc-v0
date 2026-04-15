"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle, ShieldCheck, ShieldX, ShieldAlert } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

interface BotStatus {
  bot: string
  platform: string
  status: "blocked" | "allowed" | "partial"
}

interface RobotsResult {
  blockedAiBots: BotStatus[]
  issues: string[]
  optimizedRobotsTxt: string
  protectedPaths: string[]
  geoImpact: string
}

const STATUS_CONFIG = {
  blocked:  { icon: ShieldX,     color: "text-red-400",    bg: "bg-red-500/10 border-red-500/25",    label: "Blocked" },
  allowed:  { icon: ShieldCheck, color: "text-success",    bg: "bg-success/10 border-success/25",    label: "Allowed" },
  partial:  { icon: ShieldAlert, color: "text-warning",    bg: "bg-warning/10 border-warning/25",    label: "Partial" },
}

const EXAMPLE_ROBOTS = `User-agent: *
Disallow: /admin/
Disallow: /private/

User-agent: GPTBot
Disallow: /

User-agent: Googlebot
Allow: /`

export default function RobotsOptimizerPage() {
  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RobotsResult | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleRun() {
    if (!input.trim()) { setError("Paste your robots.txt content."); return }
    setError(""); setRunning(true); setResult(null)
    try {
      const res = await fetch("/api/tools/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "robots-optimizer", input }),
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

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">Robots.txt AI Optimizer</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono">Free</span>
            <span className="font-mono text-xs text-muted-foreground">5/day · GEO &amp; AI Search</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Robots.txt AI Optimizer</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Paste your current robots.txt content and see which AI crawlers you&apos;re blocking — then get an optimized version that opens up AI access while protecting sensitive paths.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground" htmlFor="robots-input">Your robots.txt content</label>
            <button onClick={() => setInput(EXAMPLE_ROBOTS)} className="text-xs font-mono text-primary hover:underline">Load example</button>
          </div>
          <textarea
            id="robots-input"
            rows={8}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError("") }}
            placeholder="User-agent: *&#10;Disallow: /admin/&#10;&#10;User-agent: GPTBot&#10;Disallow: /&#10;..."
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
              {running ? <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Analyzing...</> : <>Analyze & Optimize <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>

        {result && (
          <div className="flex flex-col gap-5 animate-slide-up">
            {/* Bot status grid */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">AI crawler status</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.blockedAiBots.map((bot) => {
                  const cfg = STATUS_CONFIG[bot.status]
                  const Icon = cfg.icon
                  return (
                    <div key={bot.bot} className={`rounded-lg border p-3 flex flex-col gap-1.5 ${cfg.bg}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono font-bold text-foreground">{bot.bot}</p>
                        <Icon size={14} className={cfg.color} />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{bot.platform}</p>
                      <span className={`text-[9px] font-mono font-bold uppercase ${cfg.color}`}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 flex flex-col gap-2">
                <p className="text-xs font-mono font-bold text-red-400 uppercase">Issues found</p>
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-400 shrink-0 mt-0.5">·</span>
                    <p className="text-sm text-muted-foreground">{issue}</p>
                  </div>
                ))}
              </div>
            )}

            {/* GEO impact */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex flex-col gap-1.5">
              <p className="text-xs font-mono font-bold text-primary uppercase">GEO Impact</p>
              <p className="text-sm text-foreground leading-relaxed">{result.geoImpact}</p>
            </div>

            {/* Optimized robots.txt */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/40">
                <p className="font-mono text-xs text-muted-foreground">Optimized robots.txt</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(result.optimizedRobotsTxt); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                  {copied ? <><Check size={10} className="text-success" />Copied</> : <><Copy size={10} />Copy</>}
                </button>
              </div>
              <pre className="overflow-x-auto p-5 text-[11px] font-mono text-success leading-relaxed whitespace-pre-wrap">
                {result.optimizedRobotsTxt}
              </pre>
            </div>

            <ShareButtons
              shareText={`Just optimized my robots.txt for AI crawlers with @AAIOINC's free Robots.txt AI Optimizer — unlocks GPTBot, ClaudeBot, and more for GEO.`}
              url="https://aaioinc.com/tools/robots-optimizer"
              label="Share this optimization"
            />
          </div>
        )}
      </div>
    </div>
  )
}
