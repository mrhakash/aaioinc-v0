import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About — AAIOINC",
  description: "AAIOINC is building the all-in-one agentic AI platform for bloggers, SEOs, content teams, and AI developers.",
}

const values = [
  {
    title: "Radical transparency",
    description: "We show the diff, not just the output. Every tool shows its work so you can verify quality, not just trust the result.",
  },
  {
    title: "Free by default",
    description: "Core tools are permanently free. We make money when we deliver real value at scale — not by gating basic functionality.",
  },
  {
    title: "Security-first agents",
    description: "Every OpenClaw skill in our directory is audited before listing. We will never list an unvetted extension.",
  },
  {
    title: "Built for real workflows",
    description: "We build what practitioners actually need — not demos. Every tool started as something we needed ourselves.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl flex flex-col gap-6">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">About AAIOINC</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            One platform for the{" "}
            <span className="text-primary">AI-native web.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            AAIOINC was built because the tools that matter — GEO analyzers, MCP builders, LLM cost comparisons — were either nonexistent, paywalled, or scattered across a dozen tabs.
            We fixed that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl flex flex-col gap-6">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Mission</p>
          <blockquote className="text-2xl font-bold text-foreground text-balance leading-snug border-l-2 border-primary pl-6">
            &ldquo;Agentic AI Optimization — One Platform. Every AI Tool. Zero Friction.&rdquo;
          </blockquote>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            AI-generated answers are replacing the first page of search results. Agents are replacing manual workflows. The practitioners who adapt first — bloggers, SEOs, developers, agencies — will have a structural advantage. AAIOINC exists to give every practitioner access to those tools, regardless of budget.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-10">Values</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg border border-border bg-card p-6 flex flex-col gap-3">
                <h2 className="font-semibold text-foreground">{v.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-foreground text-balance">Join us at launch</h2>
          <p className="text-muted-foreground leading-relaxed">
            AAIOINC is targeting a Q2 2026 public launch. Early waitlist members get first access and a 30-day Pro trial.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/" className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2">
              Join the Waitlist
              <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
