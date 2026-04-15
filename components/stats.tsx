const stats = [
  {
    value: "100%",
    label: "of orgs have agentic AI on 2026 roadmap",
    source: "Deloitte 2025",
  },
  {
    value: "11%",
    label: "actually have solutions in production",
    source: "Deloitte 2025",
  },
  {
    value: "$499/mo",
    label: "max cost for existing GEO tools — we're free",
    source: "Market average",
  },
  {
    value: "5M+",
    label: "AI developers globally who need better tooling",
    source: "Industry estimate",
  },
]

const segments = [
  { label: "Bloggers & Affiliates", count: "~2M", color: "text-primary" },
  { label: "SEO Professionals", count: "~500K", color: "text-primary" },
  { label: "Content Agencies", count: "~200K", color: "text-primary" },
  { label: "AI Developers", count: "~5M", color: "text-primary" },
  { label: "Enterprise Teams", count: "~50K", color: "text-primary" },
]

export function Stats() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <p className="font-mono text-xs text-muted-foreground text-center mb-12 tracking-widest uppercase">
          The Gap We&apos;re Closing
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border border border-border rounded-lg overflow-hidden">
          {stats.map((stat) => (
            <div key={stat.value} className="p-8 flex flex-col gap-3">
              <span className="font-mono text-3xl font-bold text-primary">
                {stat.value}
              </span>
              <p className="text-sm text-foreground leading-relaxed">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {stat.source}
              </p>
            </div>
          ))}
        </div>

        {/* Target segments */}
        <div className="mt-16">
          <p className="font-mono text-xs text-muted-foreground text-center mb-8 tracking-widest uppercase">
            Who We Serve
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
              >
                <span className={`font-mono text-xs font-bold ${seg.color}`}>
                  {seg.count}
                </span>
                <span className="text-sm text-muted-foreground">{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
