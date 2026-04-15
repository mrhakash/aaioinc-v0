"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ShieldCheck, Accessibility, Lock, Github, Twitter, Youtube, MessageSquare } from "lucide-react"

const footerLinks = {
  Tools: [
    { label: "GEO Score Analyzer",    href: "/tools/geo-checker" },
    { label: "AI Content Humanizer",  href: "/tools/humanizer" },
    { label: "Niche Scorer",          href: "/tools/niche-scorer" },
    { label: "LLM Cost Calculator",   href: "/tools/llm-calculator" },
    { label: "Prompt Library",        href: "/prompts" },
    { label: "All Tools",             href: "/tools" },
  ],
  Platform: [
    { label: "How It Works",          href: "/#how-it-works" },
    { label: "Pricing",               href: "/pricing" },
    { label: "Managed Services",      href: "/services" },
    { label: "Resources",             href: "/resources" },
    { label: "Blog",                  href: "/blog" },
    { label: "About",                 href: "/about" },
  ],
  Community: [
    { label: "Discord",   href: "https://discord.gg/aaioinc",           external: true },
    { label: "Twitter/X", href: "https://twitter.com/aaioinc",          external: true },
    { label: "GitHub",    href: "https://github.com/aaioinc",           external: true },
    { label: "YouTube",   href: "https://youtube.com/@aaioinc",         external: true },
    { label: "Dev.to",    href: "https://dev.to/aaioinc",               external: true },
  ],
  Legal: [
    { label: "Privacy Policy",    href: "/privacy" },
    { label: "Terms of Service",  href: "/terms" },
    { label: "Contact",           href: "/contact" },
  ],
}

const socials = [
  { icon: Twitter,      href: "https://twitter.com/aaioinc",    label: "Twitter / X" },
  { icon: Github,       href: "https://github.com/aaioinc",     label: "GitHub" },
  { icon: Youtube,      href: "https://youtube.com/@aaioinc",   label: "YouTube" },
  { icon: MessageSquare, href: "https://discord.gg/aaioinc",    label: "Discord" },
]

const trustBadges = [
  { icon: ShieldCheck,   label: "SOC 2 Type II",  note: "In progress" },
  { icon: Accessibility, label: "WCAG 2.1 AA",    note: "Compliant" },
  { icon: Lock,          label: "GDPR",           note: "Ready" },
]

export function Footer() {
  const [email, setEmail]       = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <>
      {/* ── Newsletter / Launch CTA banner ───────────────────────────────── */}
      <section className="py-24 px-6 border-t border-border bg-card/30">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center gap-7">
          <p className="text-mono-label text-[10px] text-muted-foreground">Launch — Q2 2026</p>

          <h2 className="text-display text-[clamp(28px,5vw,56px)] font-extrabold text-foreground text-balance leading-tight">
            Zero friction.{" "}
            <span className="text-primary">Every AI tool.</span>
            <br />
            Start free today.
          </h2>

          <p className="max-w-md text-[14px] text-muted-foreground leading-relaxed">
            Join the waitlist and get early access plus a 30-day Pro trial on launch day.
          </p>

          {submitted ? (
            <div className="rounded-xl border border-primary/30 bg-primary/8 px-8 py-5">
              <p className="text-sm font-semibold text-primary">
                You&apos;re on the list. We&apos;ll be in touch before launch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address for waitlist"
                className="flex-1 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="btn-press shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Join Waitlist <ArrowRight size={13} />
              </button>
            </form>
          )}

          <p className="text-[11px] text-muted-foreground font-mono">No spam. Unsubscribe any time.</p>

          {/* Trust badges */}
          <div className="flex items-center justify-center flex-wrap gap-2.5">
            {trustBadges.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.label} className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                  <Icon size={12} className="text-primary shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium text-foreground">{b.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{b.note}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Main footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-14" role="contentinfo">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">

            {/* Brand column — spans 2 cols */}
            <div className="col-span-2 flex flex-col gap-5">
              {/* Logo wordmark */}
              <Link href="/" className="inline-flex items-center gap-1" aria-label="AAIO Inc home">
                <span className="font-mono text-sm font-bold text-primary tracking-widest uppercase">AAIO</span>
                <span className="font-mono text-sm text-muted-foreground tracking-widest uppercase">INC</span>
              </Link>

              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[220px]">
                Agentic AI Optimization — One Platform. Every AI Tool. Zero Friction.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    <Icon size={14} aria-hidden="true" />
                  </a>
                ))}
              </div>

              {/* Footer mini newsletter */}
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-[220px]">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Weekly AI digest"
                    aria-label="Footer newsletter email"
                    className="flex-1 min-w-0 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    suppressHydrationWarning
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-primary bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <p className="text-xs text-primary font-mono">Subscribed.</p>
              )}
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-4">
                <p className="font-mono text-[10px] font-semibold text-foreground tracking-widest uppercase">{group}</p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-2.5 pb-8 border-b border-border">
            {trustBadges.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.label} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
                  <Icon size={11} className="text-primary" aria-hidden="true" />
                  <span className="text-xs font-medium text-foreground">{b.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{b.note}</span>
                </div>
              )
            })}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
            <p className="font-mono text-[11px] text-muted-foreground">
              &copy; {new Date().getFullYear()} AAIOINC. All rights reserved.
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              Beta — targeting Q2 2026 &middot; aaioinc.com
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
