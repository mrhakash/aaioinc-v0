"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

interface AgentNode {
  id: string
  label: string
  sublabel?: string
  pulse?: boolean
  type?: "input" | "agent" | "human" | "output"
}

interface Workflow {
  id: string
  label: string
  shortLabel: string
  description: string
  nodes: AgentNode[]
  cta: { label: string; href: string }
}

const WORKFLOWS: Workflow[] = [
  {
    id: "blogging",
    label: "AI Blogging Pipeline",
    shortLabel: "Blogging",
    description: "7 agents — from keyword research to WordPress publish, with a mandatory human review checkpoint before every post goes live.",
    nodes: [
      { id: "kw",      label: "Keyword Agent",  sublabel: "Cluster + intent",    type: "input" },
      { id: "brief",   label: "Brief Agent",    sublabel: "Outline + angle" },
      { id: "writer",  label: "Writer Agent",   sublabel: "Draft generation",    pulse: true },
      { id: "seo",     label: "SEO Agent",      sublabel: "Keyword density" },
      { id: "human",   label: "Humanizer",      sublabel: "Detection bypass" },
      { id: "review",  label: "Human Review",   sublabel: "Slack approval",      type: "human" },
      { id: "publish", label: "Publisher",      sublabel: "WordPress + images",  type: "output" },
    ],
    cta: { label: "AI Blogging Service", href: "/services/ai-blogging" },
  },
  {
    id: "geo",
    label: "GEO Optimization Pipeline",
    shortLabel: "GEO",
    description: "5 agents — crawl your site, score GEO signals, generate schema, build content briefs, and ship a monthly visibility report.",
    nodes: [
      { id: "crawl",   label: "Crawl Agent",    sublabel: "Site audit",          type: "input" },
      { id: "geo",     label: "GEO Scorer",     sublabel: "Signal analysis",     pulse: true },
      { id: "schema",  label: "Schema Agent",   sublabel: "JSON-LD generation" },
      { id: "brief",   label: "Content Brief",  sublabel: "GEO-optimized" },
      { id: "report",  label: "Report Agent",   sublabel: "Monthly delivery",    type: "output" },
    ],
    cta: { label: "SEO + GEO Service", href: "/services/ai-seo" },
  },
  {
    id: "openclaw",
    label: "OpenClaw Setup Pipeline",
    shortLabel: "OpenClaw",
    description: "4-phase deployment — VPS provisioning, custom skill builds, multi-channel integration, and security audit handover.",
    nodes: [
      { id: "vps",      label: "VPS Agent",     sublabel: "Docker + hardening",  type: "input" },
      { id: "skills",   label: "Skills Builder", sublabel: "5 custom MCP skills", pulse: true },
      { id: "channels", label: "Channel Agent", sublabel: "WhatsApp / Slack" },
      { id: "audit",    label: "Audit Agent",   sublabel: "Pen test + report" },
      { id: "handover", label: "Handover",      sublabel: "Docs + 30-day SLA",   type: "output" },
    ],
    cta: { label: "OpenClaw Service", href: "/services/openclaw-setup" },
  },
]

const nodeStyles: Record<string, string> = {
  input:  "border-primary/50 bg-primary/8",
  output: "border-green-500/40 bg-green-500/8",
  human:  "border-amber-500/40 bg-amber-500/8",
  agent:  "border-border bg-card",
}

const nodeTextStyles: Record<string, string> = {
  input:  "text-primary",
  output: "text-green-400",
  human:  "text-amber-400",
  agent:  "text-foreground",
}

function Node({ node }: { node: AgentNode }) {
  const type = node.type ?? "agent"
  return (
    <div
      className={`relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border text-center shrink-0 ${nodeStyles[type]}`}
      style={{ minWidth: "100px" }}
    >
      {node.pulse && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
        </span>
      )}
      <p className={`text-[11px] font-semibold leading-tight ${nodeTextStyles[type]}`}>{node.label}</p>
      {node.sublabel && (
        <p className="font-mono text-[9px] text-muted-foreground leading-tight">{node.sublabel}</p>
      )}
    </div>
  )
}

function Connector() {
  return (
    <div className="flex items-center shrink-0 mx-1" aria-hidden="true">
      <svg width="32" height="12" className="overflow-visible">
        <line x1="0" y1="6" x2="24" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="text-primary/40" style={{ animationName: "dash-flow", animationDuration: "1.4s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />
        <polygon points="24,3 32,6 24,9" fill="currentColor" className="text-primary/50" />
      </svg>
    </div>
  )
}

export function WorkflowVisualizer() {
  const [activeId, setActiveId] = useState<string>(WORKFLOWS[0].id)
  const active = WORKFLOWS.find((w) => w.id === activeId)!

  return (
    <section id="how-it-works" className="border-y border-border bg-background px-6 py-20">
      {/* Dash-flow keyframe */}
      <style>{`@keyframes dash-flow { to { stroke-dashoffset: -14; } }`}</style>

      <div className="mx-auto max-w-5xl flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-mono-label text-[10px] text-muted-foreground">How It Works</p>
            <h2 className="text-display-sm text-[clamp(22px,3vw,34px)] font-extrabold text-foreground text-balance">
              Every workflow, visualized
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">
              Each service runs as a coordinated multi-agent pipeline with a defined handoff at every step.
            </p>
          </div>

          {/* Workflow tabs */}
          <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Workflow selector">
            {WORKFLOWS.map((w) => (
              <button
                key={w.id}
                role="tab"
                aria-selected={activeId === w.id}
                onClick={() => setActiveId(w.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-150 ${
                  activeId === w.id
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(99,91,255,0.3)]"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                <Play size={9} className={activeId === w.id ? "opacity-100" : "opacity-0 w-0 overflow-hidden"} />
                {w.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Graph card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Pipeline header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-secondary/40">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <p className="font-mono text-xs text-muted-foreground">{active.label}</p>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-live" aria-hidden="true" />
              <span className="font-mono text-[10px] text-green-400">LIVE</span>
            </div>
          </div>

          {/* Nodes — horizontal scroll on mobile */}
          <div className="p-6 overflow-x-auto">
            <div className="flex items-center gap-0" style={{ minWidth: "max-content" }}>
              {active.nodes.map((node, idx) => (
                <div key={node.id} className="flex items-center">
                  <Node node={node} />
                  {idx < active.nodes.length - 1 && <Connector />}
                </div>
              ))}
            </div>
          </div>

          {/* Description bar */}
          <div className="px-5 py-3 border-t border-border bg-secondary/20">
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{active.description}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {[
            { color: "border-primary/50 bg-primary/8 text-primary", label: "Input" },
            { color: "border-border bg-card text-foreground", label: "Agent" },
            { color: "border-amber-500/40 bg-amber-500/8 text-amber-400", label: "Human checkpoint" },
            { color: "border-green-500/40 bg-green-500/8 text-green-400", label: "Output" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`rounded border px-2 py-0.5 text-[10px] font-mono ${color}`}>{label}</span>
            </div>
          ))}
          <div className="ml-auto flex gap-3">
            <Link
              href={active.cta.href}
              className="btn-press inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {active.cta.label} <ArrowRight size={12} />
            </Link>
            <Link
              href="/services"
              className="text-xs text-muted-foreground hover:text-primary transition-colors self-center"
            >
              All services &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
