"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp } from "lucide-react"

const caseStudies = [
  {
    company: "ContentScale Media",
    industry: "Digital Publishing",
    challenge: "Manual content optimization was bottlenecking their 50-writer team.",
    solution: "Deployed custom content agents that auto-optimize for GEO before publication.",
    metrics: [
      { label: "AI visibility increase", value: "+340%" },
      { label: "Time saved per article", value: "2.5 hrs" },
      { label: "Organic traffic lift", value: "+89%" },
    ],
    quote: "Our content now surfaces in AI answers before our competitors even know to optimize for it.",
    author: "Head of Content Strategy",
  },
  {
    company: "TechFlow SaaS",
    industry: "B2B Software",
    challenge: "Support tickets were overwhelming their 3-person CS team.",
    solution: "Built an agentic support system that resolves 70% of tickets autonomously.",
    metrics: [
      { label: "Tickets auto-resolved", value: "70%" },
      { label: "Response time", value: "< 30s" },
      { label: "CSAT improvement", value: "+22 pts" },
    ],
    quote: "We went from drowning in tickets to proactively delighting customers.",
    author: "VP of Customer Success",
  },
  {
    company: "MarketPulse Analytics",
    industry: "Market Research",
    challenge: "Analysts spent 60% of time on data collection instead of insights.",
    solution: "Deployed research agents that aggregate, clean, and pre-analyze market data.",
    metrics: [
      { label: "Research cycle time", value: "-75%" },
      { label: "Data sources monitored", value: "500+" },
      { label: "Analyst productivity", value: "+4x" },
    ],
    quote: "Our analysts now focus on strategy instead of spreadsheets.",
    author: "Director of Research",
  },
]

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Case Studies
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Real results from real deployments
          </h2>
          <p className="max-w-2xl text-muted-foreground leading-relaxed">
            See how teams across industries are using agentic AI to transform their operations.
          </p>
        </div>

        {/* Case studies grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {caseStudies.map((study) => (
            <div
              key={study.company}
              className="flex flex-col rounded-lg border border-border bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">{study.company}</span>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
                    {study.industry}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Challenge:</span> {study.challenge}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  <span className="font-medium text-foreground">Solution:</span> {study.solution}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                {study.metrics.map((metric) => (
                  <div key={metric.label} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp size={12} className="text-primary" />
                      <span className="font-mono text-lg font-bold text-primary">
                        {metric.value}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-sm text-foreground leading-relaxed italic mb-3">
                  &ldquo;{study.quote}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  — {study.author}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            See more success stories
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
