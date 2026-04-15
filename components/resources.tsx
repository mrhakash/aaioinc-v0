"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Globe, Bot, Code2, Layers, BookOpen, Video, Newspaper, Wrench, GraduationCap, ArrowRight, ChevronDown,
} from "lucide-react"
import { RESOURCE_CATEGORIES, totalResourceCount, type ResourceCategory } from "@/lib/resources-data"

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Bot, Code2, Layers, BookOpen, Video, Newspaper, Wrench, GraduationCap,
}

const tierColors: Record<string, string> = {
  Free:     "text-primary border-primary/30 bg-primary/10",
  Freemium: "text-sky-400 border-sky-500/25 bg-sky-500/10",
  Paid:     "text-amber-400 border-amber-500/25 bg-amber-500/10",
}

export function Resources() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="resources" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Resource Hub</p>
          <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold text-foreground text-balance">
            Everything you need to learn, build, and ship.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
            {totalResourceCount}+ guides, courses, research, templates, and tools — organised across 9 categories and tagged by access tier.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESOURCE_CATEGORIES.map((cat: ResourceCategory) => {
            const Icon = ICON_MAP[cat.icon] ?? Globe
            const isOpen = active === cat.slug
            const previewResources = cat.resources.slice(0, 4)
            return (
              <div
                key={cat.slug}
                className={`rounded-xl border overflow-hidden transition-all duration-200 ${isOpen ? "border-primary/30" : "border-border"} bg-card`}
              >
                <button
                  onClick={() => setActive(isOpen ? null : cat.slug)}
                  aria-expanded={isOpen}
                  aria-controls={`resources-${cat.slug}`}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className={`rounded-lg border bg-secondary p-2 shrink-0 transition-colors ${isOpen ? "border-primary/30 bg-primary/10" : "border-border"}`}>
                    <Icon size={15} className={isOpen ? "text-primary" : cat.accent} aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-foreground text-sm truncate">{cat.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{cat.resources.length} resources</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div id={`resources-${cat.slug}`} className="border-t border-border divide-y divide-border">
                    {previewResources.map((res) => (
                      <Link
                        key={res.id}
                        href={res.href}
                        target={res.href.startsWith("http") ? "_blank" : undefined}
                        rel={res.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-secondary/40 transition-colors group"
                      >
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">
                            {res.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                            {res.description}
                          </span>
                        </div>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium ${tierColors[res.tier]}`}>
                          {res.tier}
                        </span>
                      </Link>
                    ))}
                    <div className="px-5 py-3">
                      <Link
                        href={`/resources/${cat.slug}`}
                        className="text-[11px] font-mono text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View all {cat.resources.length} resources <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            Browse All {totalResourceCount}+ Resources
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
