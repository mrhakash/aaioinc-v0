"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "I replaced three $99/mo tools with AAIO and actually get better GEO data. The score analyzer alone is worth the switch — and it's free.",
    name: "Sarah K.",
    role: "SEO Consultant",
    segment: "SEO Professional",
    initials: "SK",
  },
  {
    quote: "The content humanizer shows you the diff, not just the final output. That transparency is everything when you're reviewing work for clients.",
    name: "Marcus T.",
    role: "Content Agency Owner",
    segment: "Agency",
    initials: "MT",
  },
  {
    quote: "Finally a niche research tool that gives affiliate marketers what we actually need — monetization potential, not just search volume.",
    name: "Priya D.",
    role: "Affiliate Blogger",
    segment: "Blogger",
    initials: "PD",
  },
  {
    quote: "The LLM cost comparison table has saved us thousands. We moved three pipelines to cheaper models without touching performance.",
    name: "Alex R.",
    role: "AI Engineer",
    segment: "Developer",
    initials: "AR",
  },
  {
    quote: "The MCP Config Builder is shockingly good. What used to take an afternoon of debugging yaml takes three minutes now.",
    name: "Tomás L.",
    role: "Full-Stack Developer",
    segment: "Developer",
    initials: "TL",
  },
  {
    quote: "Our content team runs on the prompt library. 200+ verified prompts, properly categorized. It's the reference we didn't know we needed.",
    name: "Diana W.",
    role: "Head of Content",
    segment: "Enterprise Team",
    initials: "DW",
  },
]

const VISIBLE = 3

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const total = testimonials.length
  const maxIndex = total - VISIBLE

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0))
    setAutoplay(false)
  }, [])

  const next = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    setAutoplay(false)
  }, [maxIndex])

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!autoplay) return
    const t = setTimeout(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, 5000)
    return () => clearTimeout(t)
  }, [index, autoplay, maxIndex])

  const visible = testimonials.slice(index, index + VISIBLE)

  return (
    <section id="testimonials" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <p className="text-mono-label text-[10px] text-muted-foreground">Social Proof</p>
          <h2 className="text-display-sm text-[clamp(24px,3.5vw,38px)] font-extrabold text-foreground text-balance">
            Trusted by SEOs, developers, and content teams.
          </h2>
          <p className="max-w-md text-[14px] text-muted-foreground leading-relaxed">
            Used by 800+ practitioners who swapped out legacy tooling for AAIO.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {visible.map((t, i) => (
            <article
              key={`${t.name}-${index}-${i}`}
              className="card-hover flex flex-col gap-5 rounded-xl border border-border bg-card p-6"
              aria-label={`Testimonial from ${t.name}`}
            >
              {/* Quote icon */}
              <Quote size={20} className="text-primary/40" aria-hidden="true" />

              {/* Quote text */}
              <p className="text-[13px] text-foreground leading-relaxed flex-1 -mt-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0" aria-hidden="true">
                  <span className="font-mono text-[10px] font-bold text-primary">{t.initials}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">{t.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{t.role}</span>
                </div>
                <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground shrink-0">
                  {t.segment}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous testimonials"
            className="rounded-full border border-border p-2.5 text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Testimonial page indicators">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setAutoplay(false) }}
                aria-label={`Go to testimonials ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`rounded-full transition-all duration-200 ${
                  i === index ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonials"
            className="rounded-full border border-border p-2.5 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}
