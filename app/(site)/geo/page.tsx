import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Globe, Eye, BarChart2, BookOpen, FileText, GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: "GEO Hub — Generative Engine Optimization — AAIOINC",
  description:
    "Everything you need to optimize for AI-generated search answers. GEO Score Analyzer, AI Overview Checker, guides, case studies, and the definitive GEO resource library.",
}

const tools = [
  {
    icon: Globe,
    title: "GEO Score Analyzer",
    description: "Instant 0–100 GEO score for any URL or content. Free, no login required.",
    href: "/geo/score",
    badge: "Free",
  },
  {
    icon: Eye,
    title: "AI Overview Checker",
    description: "See if your brand appears in Google AI Overviews, Bing Copilot, and Perplexity.",
    href: "/geo/overview-checker",
    badge: "3/day Free",
  },
]

const resources = [
  { icon: BookOpen, title: "GEO Optimization Guide", description: "End-to-end guide to ranking in AI-generated answers", href: "/resources" },
  { icon: FileText, title: "AI Overview Playbook", description: "Strategies to appear in Google AI Overviews consistently", href: "/resources" },
  { icon: GraduationCap, title: "GEO Crash Course", description: "4-hour self-paced video course, completely free", href: "/resources" },
  { icon: BarChart2, title: "State of GEO 2026 Report", description: "Annual benchmark report on AI search visibility trends", href: "/resources" },
]

const faqs = [
  {
    q: "What is GEO (Generative Engine Optimization)?",
    a: "GEO is the practice of optimizing your content to appear in AI-generated answers from ChatGPT, Google AI Overviews, Bing Copilot, Perplexity, and similar systems. It extends traditional SEO with signals that AI models use to select and cite sources.",
  },
  {
    q: "How is GEO different from traditional SEO?",
    a: "Traditional SEO targets keyword rankings in search engine results pages (SERPs). GEO targets citation and appearance in AI-generated answer summaries. Many GEO signals — like schema markup, content authority, and entity clarity — overlap with SEO, but GEO has unique requirements.",
  },
  {
    q: "What does a GEO score of 78/100 mean?",
    a: "A GEO score reflects how well your content satisfies the signals that AI models use to select sources. A score of 78 means your content performs well across most signals but has specific improvement areas — the analyzer shows you exactly which.",
  },
  {
    q: "Is GEO optimization permanent?",
    a: "GEO signals change as AI models update. We recommend re-analyzing content every 30–60 days and tracking your GEO score trend over time. Pro users get automated re-analysis and trend reporting.",
  },
]

export default function GeoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            GEO Hub
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            Generative Engine Optimization{" "}
            <span className="text-primary">starts here.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            AI-generated answers are replacing the first page of search results. GEO is how you stay visible.
            Start with a free GEO score — no account required.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/geo/score"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Get Your GEO Score
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/geo/overview-checker"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              Check AI Visibility
            </Link>
          </div>
        </div>
      </section>

      {/* GEO Tools */}
      <section className="px-6 py-16 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-8">GEO Tools</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-start gap-5 rounded-lg border border-border bg-card p-6 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="rounded-md border border-border bg-secondary p-3 shrink-0 group-hover:border-primary/30 transition-colors">
                    <Icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</h2>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">{tool.badge}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* GEO Resources */}
      <section className="px-6 py-16 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-8">GEO Resources</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((r) => {
              const Icon = r.icon
              return (
                <Link
                  key={r.title}
                  href={r.href}
                  className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{r.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-8 text-center">Frequently Asked Questions</p>
          <div className="flex flex-col gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="flex flex-col gap-2">
                <h3 className="font-semibold text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
