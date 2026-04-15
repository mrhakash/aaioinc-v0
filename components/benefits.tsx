import { Brain, Workflow, Target, Gauge, Users, Sparkles } from "lucide-react"

const principles = [
  {
    icon: Brain,
    title: "Autonomous Decision-Making",
    description:
      "Agentic AI doesn't wait for instructions — it reasons through problems, makes decisions, and takes action within defined guardrails.",
  },
  {
    icon: Workflow,
    title: "Multi-Step Task Execution",
    description:
      "Unlike traditional automation, agentic systems handle complex workflows with branching logic, error recovery, and adaptive sequencing.",
  },
  {
    icon: Target,
    title: "Goal-Oriented Behavior",
    description:
      "Agents work toward outcomes, not just outputs. They adjust tactics in real-time to achieve the objectives you define.",
  },
]

const benefits = [
  {
    icon: Gauge,
    title: "10x Operational Efficiency",
    description:
      "Automate knowledge work that previously required human judgment. Teams report 70-90% time savings on repetitive cognitive tasks.",
  },
  {
    icon: Users,
    title: "Scale Without Headcount",
    description:
      "Deploy agents that work 24/7 without burnout. Handle 10x the workload without 10x the team size.",
  },
  {
    icon: Sparkles,
    title: "Competitive Moat",
    description:
      "Early adopters of agentic AI are building sustainable advantages. The gap between AI-native and AI-resistant companies is widening.",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Why Agentic AI
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            The principles behind intelligent automation
          </h2>
          <p className="max-w-2xl text-muted-foreground leading-relaxed">
            Agentic AI represents a paradigm shift from reactive tools to proactive systems that reason, plan, and act.
          </p>
        </div>

        {/* Principles row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {principles.map((principle, index) => {
            const Icon = principle.icon
            return (
              <div
                key={principle.title}
                className="relative flex flex-col items-center text-center p-8 rounded-lg border border-border bg-card"
              >
                {/* Number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-mono font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Benefits divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-border" />
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase shrink-0">
            The Business Impact
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Benefits row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="flex gap-4 p-6 rounded-lg border border-border bg-secondary/50"
              >
                <div className="shrink-0 w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
