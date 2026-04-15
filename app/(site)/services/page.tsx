import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Cpu, PenTool, Target, FileText, Search, Wrench } from "lucide-react"
import { services } from "@/lib/services-data"

export const metadata: Metadata = {
  title: "Managed AI Services — AAIOINC",
  description:
    "Six managed agentic AI services from $500 to $15,000. OpenClaw setup, AI blogging pipelines, AI SEO, content production, niche research, and MCP skills development.",
}

const iconMap: Record<string, React.ElementType> = {
  "openclaw-setup": Cpu,
  "ai-blogging": PenTool,
  "ai-seo": Target,
  "ai-content": FileText,
  "niche-research": Search,
  "mcp-skills": Wrench,
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Managed Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            From tools to full{" "}
            <span className="text-primary">agentic deployment.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Six managed services that take you from first analysis to production-grade agentic AI.
            Every service includes a dedicated lead and delivery guarantee.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground">
              From $500 · One-time or retainer
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground">
              Book a free 30-min strategy call
            </span>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = iconMap[service.slug] ?? Wrench
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col gap-5 rounded-lg border border-border bg-card p-6 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                {/* Icon */}
                <div className="rounded-md border border-border bg-secondary p-2.5 w-fit group-hover:border-primary/30 transition-colors">
                  <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h2 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.tagline}
                  </p>
                </div>

                {/* Price anchor + arrow */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {service.priceAnchor}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Book a call CTA */}
      <section className="px-6 py-16 border-t border-border">
        <div className="mx-auto max-w-3xl rounded-lg border border-primary/30 bg-primary/5 p-10 flex flex-col items-center text-center gap-5">
          <h2 className="text-2xl font-bold text-foreground text-balance">
            Not sure which service fits your needs?
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-lg">
            Book a free 30-minute strategy call. We&apos;ll assess your current stack, identify the highest-leverage opportunities, and recommend the right engagement.
          </p>
          <Link
            href="/contact"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Book a Strategy Call
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
