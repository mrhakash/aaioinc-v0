import { Compass, Hammer, TrendingUp } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Compass,
    title: "Discover",
    description:
      "Run your content, URLs, or niche ideas through AAIO's free analysis tools. Get your GEO score, AI visibility report, and niche opportunity map in seconds — no account required.",
    highlights: ["GEO Score Analyzer", "AI Overview Checker", "Niche Research"],
  },
  {
    step: "02",
    icon: Hammer,
    title: "Build",
    description:
      "Use our prompt library, MCP config builder, and content humanizer to create AI-optimized content and agent workflows. Connect to your stack with the API or use the visual builder.",
    highlights: ["Prompt Library", "MCP Config Builder", "Content Humanizer"],
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Scale",
    description:
      "Move from tools to managed services. Automate full content pipelines, deploy production-grade agentic AI, and manage multi-client workspaces — from $29/mo to fully managed enterprise.",
    highlights: ["Agent Pipelines", "Team Workspaces", "Managed Services"],
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            From first analysis to full deployment.
          </h2>
          <p className="max-w-xl text-muted-foreground leading-relaxed">
            Three stages, one platform. Start free with no setup — grow into production-grade agentic AI at your own pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.step}
                className="relative flex flex-col gap-5 rounded-lg border border-border bg-card p-8"
              >
                {/* Connector line between cards (desktop) */}
                {idx < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden md:block absolute top-10 -right-3 w-6 h-px bg-border z-10"
                  />
                )}

                {/* Step number + icon */}
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground/60 tracking-widest select-none">
                    {step.step}
                  </span>
                  <div className="rounded-md border border-primary/30 bg-primary/10 p-2.5">
                    <Icon size={18} className="text-primary" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                  {step.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded px-2 py-0.5 text-xs font-mono text-primary border border-primary/25 bg-primary/5"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
