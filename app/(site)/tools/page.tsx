import type { Metadata } from "next"
import { FreeTools } from "@/components/free-tools"

export const metadata: Metadata = {
  title: "Free AI Tools — AAIOINC",
  description:
    "Every AI tool you need: GEO Score Analyzer, AI Overview Checker, MCP Config Builder, Prompt Library, Content Humanizer, LLM Cost Comparison, and more. Most are free.",
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Free Tools
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            Every AI tool you need.{" "}
            <span className="text-primary">Most are free.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Start with any tool — no account, no credit card. Core tools are permanently free.
            Upgrade to Pro for higher limits and automation features.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
              14 Tools
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground">
              No account required for free tier
            </span>
          </div>
        </div>
      </section>

      {/* Tools grid — reuses the existing component, no padding-top */}
      <div className="[&>section]:border-t-0 [&>section]:pt-10">
        <FreeTools />
      </div>
    </div>
  )
}
