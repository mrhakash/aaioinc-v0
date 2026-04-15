import type { Metadata } from "next"
import { Resources } from "@/components/resources"

export const metadata: Metadata = {
  title: "Resource Directory — AAIOINC",
  description:
    "The most comprehensive directory of GEO, agentic AI, MCP, developer tools, content, courses, videos, research, and template resources — tagged by access tier.",
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Resource Directory
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            Everything you need to learn, build, and ship.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Guides, courses, research, templates, and tools — organized across 9 categories and tagged by access tier. Most are free.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">205+ Resources</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground">9 categories</span>
          </div>
        </div>
      </section>

      <div className="[&>section]:border-t-0 [&>section]:pt-10">
        <Resources />
      </div>
    </div>
  )
}
