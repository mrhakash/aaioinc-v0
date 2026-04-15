"use client"

import Link from "next/link"
import { ArrowRight, Bot, PenTool, Search, FileText, Compass, Server, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const services = [
  {
    icon: Bot,
    title: "OpenClaw Agent Setup",
    tagline: "From zero to production agents in days",
    description:
      "Dockerized VPS deployment with 5 custom skills, a full security audit, and 30-day white-glove support. Get production-ready agents without the DevOps headache.",
    price: "$1,500 – $5,000",
    deliverables: ["Secure VPS Instance", "5 Custom MCP Skills", "Security Audit Report", "30-Day Priority Support"],
    href: "/services/openclaw-setup",
    span: "col-span-1 md:col-span-2",   // featured: spans 2 columns
    featured: true,
  },
  {
    icon: PenTool,
    title: "AI Blogging",
    tagline: "Scale from 4 to 50+ posts per month",
    description:
      "Complete content pipeline with n8n / FlowHunt workflows, WordPress integration, and brand voice training. Fully automated, endlessly repeatable.",
    price: "$2,000 + $500/mo",
    deliverables: ["7-Agent Pipeline", "WordPress Integration", "Brand Voice Training", "Monthly QA Report"],
    href: "/services/ai-blogging",
    span: "col-span-1",
    featured: false,
  },
  {
    icon: Search,
    title: "AI for SEOs",
    tagline: "5 agents covering every ranking signal",
    description:
      "Rank tracking, GEO monitoring, and automated technical audits — with weekly reports included. Built for agency SEOs managing multiple clients.",
    price: "$1,000 + $300/mo",
    deliverables: ["5 SEO Agents", "Rank Tracking", "GEO Monitoring", "Weekly Reports"],
    href: "/services/ai-seo",
    span: "col-span-1",
    featured: false,
  },
  {
    icon: FileText,
    title: "AI Content Service",
    tagline: "Turn one piece into an entire ecosystem",
    description:
      "Full content pipeline with 10-format repurposing, brand voice AI, and an analytics dashboard. Human-quality, on-demand, at scale.",
    price: "$2,500 + $800/mo",
    deliverables: ["Content Pipeline", "10-Format Repurposing", "Brand Voice AI", "Analytics Dashboard"],
    href: "/services/ai-content",
    span: "col-span-1",
    featured: false,
  },
  {
    icon: Compass,
    title: "Niche Research",
    tagline: "Know before you invest",
    description:
      "20-page validation report with keyword universe, competitor map, and full GEO analysis. Remove guesswork from niche selection permanently.",
    price: "$500 – $1,500",
    deliverables: ["20-Page Report", "Keyword Universe", "Competitor Map", "GEO Analysis"],
    href: "/services/niche-research",
    span: "col-span-1",
    featured: false,
  },
  {
    icon: Server,
    title: "MCP & Skills Dev",
    tagline: "Enterprise-grade agent capabilities",
    description:
      "Custom MCP server development with 3–5 skills, integration testing, and full documentation. The deepest technical engagement we offer.",
    price: "$3,000 – $15,000",
    deliverables: ["Custom MCP Server", "3–5 Skills Built", "Integration Testing", "Full Documentation"],
    href: "/services/mcp-skills",
    span: "col-span-1",
    featured: false,
  },
]

/* ─────────────────────────────────────────────
   Service Card
───────────────────────────────────────────── */
function ServiceCard({ service }: { service: typeof services[number] }) {
  const Icon = service.icon
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border p-6 transition-all duration-300",
        "hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]",
        service.featured
          ? "border-primary/40 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent"
          : "border-border bg-card hover:border-primary/30",
        service.span
      )}
    >
      {/* Featured ring */}
      {service.featured && (
        <div className="absolute inset-0 rounded-2xl border border-primary/20 pointer-events-none" />
      )}

      {/* Top: badge + price */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
            service.featured
              ? "bg-primary/15 border-primary/30"
              : "bg-secondary border-border group-hover:border-primary/25 transition-colors"
          )}>
            <Icon size={18} className={service.featured ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors"} />
          </div>
          {service.featured && (
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-mono font-semibold text-primary-foreground uppercase tracking-wide">
              Most Popular
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-primary font-semibold text-right whitespace-nowrap ml-3">
          {service.price}
        </span>
      </div>

      {/* Title + tagline */}
      <div className="mb-3">
        <h3 className="text-display-card font-bold text-foreground text-[15px] group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wide uppercase mt-0.5">
          {service.tagline}
        </p>
      </div>

      {/* Description — hidden on small non-featured */}
      <p className={cn(
        "text-[13px] text-muted-foreground leading-[1.6] flex-1",
        !service.featured && "hidden sm:block"
      )}>
        {service.description}
      </p>

      {/* Deliverables */}
      <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-4">
        {service.deliverables.map((d) => (
          <li key={d} className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <CheckCircle2 size={12} className="text-primary shrink-0" />
            {d}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={service.href}
        className={cn(
          "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
          service.featured
            ? "rounded-lg bg-primary px-4 py-2 text-primary-foreground w-fit hover:opacity-90"
            : "text-primary hover:underline underline-offset-4"
        )}
      >
        Book a Strategy Call
        <ArrowRight size={13} className={cn("transition-transform", !service.featured && "group-hover:translate-x-0.5")} />
      </Link>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Section
───────────────────────────────────────────── */
export function Services() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Managed Services</span>
          </div>
          <h2 className="text-display-sm text-[clamp(26px,3.5vw,38px)] font-extrabold text-foreground text-balance leading-[1.15]">
            Six ways we deploy{" "}
            <span className="text-primary">agentic AI</span>{" "}
            for you
          </h2>
          <p className="max-w-xl text-[15px] text-muted-foreground leading-[1.7]">
            From single-agent setups to full content automation to custom MCP development. Every service includes a free strategy call.
          </p>
        </div>

        {/* Bento grid */}
        {/*
          Layout (desktop):
          [  OpenClaw (2-col featured)  ] [ AI Blogging ]
          [ AI SEO ] [ AI Content ] [ Niche Research ] [ MCP Dev ]
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 rounded-2xl border border-border bg-card/50 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-semibold text-foreground text-balance">Not sure which service fits?</p>
            <p className="text-sm text-muted-foreground mt-0.5">Book a free 30-minute strategy call — no commitment required.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/#contact"
              className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Get a Custom Quote
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/tools"
              className="btn-press inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              Try free tools first
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
