"use client"

import { useState, useEffect, useRef } from "react"
import { Pause, Play } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface FeedMessage {
  id: string
  category: string
  categoryColor: string
  text: string
  isLive?: boolean
}

// Tool slug → display category + color (sky-600/amber-600 for light mode contrast)
const TOOL_META: Record<string, { category: string; color: string }> = {
  "geo-checker":      { category: "GEO",      color: "text-primary bg-primary/10 border-primary/25" },
  "overview-checker": { category: "AI OV",    color: "text-primary bg-primary/10 border-primary/25" },
  "niche-scorer":     { category: "Niche",    color: "text-warning bg-warning/10 border-warning/25" },
  "humanizer":        { category: "Humanizer",color: "text-sky-600 bg-sky-500/10 border-sky-500/25" },
  "mcp-builder":      { category: "MCP",      color: "text-amber-600 bg-amber-500/10 border-amber-500/25" },
  "ai-detector":      { category: "AI Det",   color: "text-sky-600 bg-sky-500/10 border-sky-500/25" },
  "keyword-cluster":  { category: "Keywords", color: "text-warning bg-warning/10 border-warning/25" },
  "content-brief":    { category: "Brief",    color: "text-success bg-success/10 border-success/25" },
  "schema-generator": { category: "Schema",   color: "text-amber-600 bg-amber-500/10 border-amber-500/25" },
  "robots-optimizer": { category: "Robots",   color: "text-primary bg-primary/10 border-primary/25" },
  "title-generator":  { category: "Titles",   color: "text-success bg-success/10 border-success/25" },
  "meta-writer":      { category: "Meta",     color: "text-sky-600 bg-sky-500/10 border-sky-500/25" },
}

const SEED_MESSAGES: FeedMessage[] = [
  { id: "s1",  category: "GEO",      categoryColor: "text-primary bg-primary/10 border-primary/25",       text: "example.com → score 71/100 — schema coverage +18 pts" },
  { id: "s2",  category: "Agent",    categoryColor: "text-success bg-success/10 border-success/25",       text: "content-pipeline deployed → 4 posts published to WordPress" },
  { id: "s3",  category: "Niche",    categoryColor: "text-warning bg-warning/10 border-warning/25",       text: "'home automation for renters' → A grade, $47 avg EPC" },
  { id: "s4",  category: "Humanizer",categoryColor: "text-sky-600 bg-sky-500/10 border-sky-500/25",       text: "3,240 chars processed → detection score 94% → 6%" },
  { id: "s5",  category: "SEO",      categoryColor: "text-primary bg-primary/10 border-primary/25",       text: "seo-auditor agent → 47 schema issues fixed across 12 pages" },
  { id: "s6",  category: "AI OV",    categoryColor: "text-success bg-success/10 border-success/25",       text: "'best crm for freelancers' → brand cited in Perplexity answer" },
  { id: "s7",  category: "MCP",      categoryColor: "text-amber-600 bg-amber-500/10 border-amber-500/25", text: "shipment-tracker-v2 skill → passed all 14 security checks" },
  { id: "s8",  category: "Niche",    categoryColor: "text-warning bg-warning/10 border-warning/25",       text: "'keto meal prep for diabetics' → B+ grade, rising 3-mo trend" },
  { id: "s9",  category: "GEO",      categoryColor: "text-primary bg-primary/10 border-primary/25",       text: "agency-site.io → score 88/100 — 3 new AI Overview citations" },
  { id: "s10", category: "Agent",    categoryColor: "text-success bg-success/10 border-success/25",       text: "niche-scout agent → 50 niches analyzed, top: biohacking supplements" },
]

function toolUsageToMessage(row: { id: string; tool_slug: string }): FeedMessage {
  const meta = TOOL_META[row.tool_slug] ?? { category: "Tool", color: "text-muted-foreground bg-secondary border-border" }
  const texts: Record<string, string[]> = {
    "geo-checker":      ["brand visibility check completed", "new GEO score analysis run", "AI platform citations analyzed"],
    "overview-checker": ["AI Overview check completed", "Google AI Overview status updated"],
    "niche-scorer":     ["niche profitability scored", "radar chart analysis complete"],
    "humanizer":        ["content humanized successfully", "AI detection score improved"],
    "mcp-builder":      ["MCP config generated", "new server config exported"],
    "ai-detector":      ["AI detection scan complete", "text patterns analyzed"],
    "keyword-cluster":  ["keyword clusters generated", "intent tags assigned"],
    "content-brief":    ["content brief created", "outline + H2s generated"],
    "schema-generator": ["JSON-LD schema generated", "schema markup exported"],
    "robots-optimizer": ["robots.txt analyzed", "AI bot directives updated"],
    "title-generator":  ["10 headline variations scored", "CTR-optimized titles ready"],
    "meta-writer":      ["3 meta descriptions generated", "155-char limit enforced"],
  }
  const pool = texts[row.tool_slug] ?? ["tool analysis completed"]
  const text = pool[Math.floor(Math.random() * pool.length)]
  return { id: row.id, category: meta.category, categoryColor: meta.color, text, isLive: true }
}

export function LiveAgentFeed() {
  const [isPaused, setIsPaused] = useState(false)
  const [messages, setMessages] = useState<FeedMessage[]>(SEED_MESSAGES)
  const [liveCount, setLiveCount] = useState(0)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    const supabase = supabaseRef.current

    const channel = supabase
      .channel("tool_usage_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tool_usage" },
        (payload) => {
          const row = payload.new as { id: string; tool_slug: string }
          const msg = toolUsageToMessage(row)
          setMessages((prev) => {
            // Keep max 20 messages, prepend the new live one
            const next = [msg, ...prev].slice(0, 20)
            return next
          })
          setLiveCount((c) => c + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Duplicate for seamless loop
  const doubled = [...messages, ...messages]

  return (
    <section
      aria-label="Live agent activity feed"
      className="relative border-y border-border bg-secondary/30 overflow-hidden"
      style={{ height: "44px" }}
    >
      {/* Left fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--secondary), transparent)" }}
      />
      {/* Right fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--secondary), transparent)" }}
      />

      <div className="flex items-center h-full">
        {/* LIVE badge */}
        <div
          className="shrink-0 flex items-center gap-2 pl-4 pr-5 h-full z-20 border-r border-border bg-background/50 backdrop-blur-sm"
          aria-hidden="true"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-pulse-live absolute inline-flex h-full w-full rounded-full bg-success" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="font-mono text-[10px] font-bold text-success whitespace-nowrap tracking-[0.12em] uppercase">
            LIVE
          </span>
        </div>

        {/* Scrolling track */}
        <div
          className="relative flex-1 overflow-hidden h-full flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div
            className="flex items-center gap-0 whitespace-nowrap"
            style={{
              animation: "ticker-scroll 70s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {doubled.map((msg, i) => (
              <span key={`${msg.id}-${i}`} className="inline-flex items-center gap-2.5 px-6">
                <span className={`shrink-0 rounded-full border px-2 py-px font-mono text-[9px] font-semibold tracking-wide uppercase ${msg.categoryColor} ${msg.isLive ? "ring-1 ring-success/40" : ""}`}>
                  {msg.category}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {msg.text}
                </span>
                <span className="text-border font-mono text-sm select-none" aria-hidden="true">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Live count + pause/play */}
        {liveCount > 0 && (
          <span className="shrink-0 font-mono text-[9px] text-success/70 px-3 border-l border-border h-full flex items-center">
            +{liveCount} live
          </span>
        )}
        <button
          onClick={() => setIsPaused(p => !p)}
          aria-label={isPaused ? "Resume feed" : "Pause feed"}
          className="shrink-0 flex items-center justify-center w-9 h-full z-20 border-l border-border bg-background/50 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isPaused
            ? <Play  size={11} className="text-success" />
            : <Pause size={11} />
          }
        </button>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
