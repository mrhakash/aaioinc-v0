import { AlertTriangle, TrendingDown, Lock, Frown, Puzzle } from "lucide-react"

const problems = [
  {
    icon: AlertTriangle,
    stat: "100%",
    label: "of orgs have agentic AI on their 2026 roadmap",
    problem: "but only 11% have agents in production",
    source: "Deloitte",
  },
  {
    icon: Lock,
    stat: "12%",
    label: "of ClawHub skills are malicious",
    problem: "Users need trusted setup and curation",
    source: "OpenClaw Security Report",
  },
  {
    icon: TrendingDown,
    stat: "$20–$499",
    label: "per month for GEO optimization tools",
    problem: "No free, instant option exists",
    source: "Market Research",
  },
  {
    icon: Frown,
    stat: "0",
    label: "platforms combine all AI tools",
    problem: "Agent setup, SEO tools, content automation, niche research, and resources in one place",
    source: "Competitive Analysis",
  },
]

export function ProblemStatement() {
  return (
    <section className="py-20 px-6 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            The gap between AI capability and{" "}
            <span className="text-primary">practical execution</span>
          </h2>
          <p className="max-w-2xl text-muted-foreground leading-relaxed">
            Everyone wants agentic AI. Few know how to deploy it safely and effectively.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((problem) => {
            const Icon = problem.icon
            return (
              <div
                key={problem.label}
                className="relative flex flex-col p-6 rounded-lg border border-border bg-background"
              >
                {/* Icon */}
                <div className="mb-4 w-10 h-10 rounded-md bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <Icon size={20} className="text-destructive" />
                </div>

                {/* Stat */}
                <p className="font-mono text-2xl font-bold text-foreground mb-1">
                  {problem.stat}
                </p>

                {/* Label */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {problem.label}
                </p>

                {/* Problem highlight */}
                <p className="text-sm font-medium text-foreground border-t border-border pt-3 mt-auto">
                  {problem.problem}
                </p>

                {/* Source */}
                <p className="font-mono text-xs text-muted-foreground/60 mt-2">
                  — {problem.source}
                </p>
              </div>
            )
          })}
        </div>

        {/* Solution teaser */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Puzzle size={14} className="text-primary" />
            <span className="text-sm text-primary font-medium">
              AAIOINC bridges this gap with tools, services, and resources — all in one platform.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
