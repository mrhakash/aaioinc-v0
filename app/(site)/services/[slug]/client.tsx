"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Check, ArrowLeft, ArrowRight, TrendingUp, ChevronDown, ChevronUp,
  AlertTriangle, Lightbulb,
} from "lucide-react"
import { services, type ServiceData } from "@/lib/services-data"

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground pr-4">{question}</span>
        {open ? (
          <ChevronUp size={15} className="shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </div>
  )
}

export default function ServicePageClient({ service }: { service: ServiceData }) {
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/services" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Services
          </Link>
          <span>/</span>
          <span className="text-foreground">{service.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-border bg-card/40 px-6 py-16">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-start justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Managed Service</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{service.title}</h1>
            <p className="text-lg text-primary font-medium">{service.tagline}</p>
            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Book a Strategy Call <ArrowRight size={14} />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                Explore Free Tools
              </Link>
            </div>
          </div>
          {/* Pricing anchor card */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 flex flex-col gap-4 w-full lg:w-72 shrink-0">
            <div>
              <p className="text-2xl font-bold text-foreground">{service.priceAnchor}</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">{service.priceNote}</p>
            </div>
            <Link
              href="/contact"
              className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Get Custom Quote <ArrowRight size={14} />
            </Link>
            <p className="text-xs text-muted-foreground text-center">Free 30-min strategy call — no obligation</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 flex flex-col lg:flex-row gap-14">
        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-14">

          {/* Problem Statement */}
          <section className="flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">The Problem</p>
              <h2 className="text-2xl font-bold text-foreground">Why this matters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.problems.map((p) => (
                <div key={p.headline} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                    <span className="font-mono text-xl font-bold text-amber-400">{p.stat}</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm">{p.headline}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Solution Overview */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">Our Solution</p>
              <h2 className="text-2xl font-bold text-foreground">How we solve it</h2>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 flex items-start gap-3">
              <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed text-sm">{service.solutionSummary}</p>
            </div>
          </section>

          {/* How It Works */}
          <section className="flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">Process</p>
              <h2 className="text-2xl font-bold text-foreground">How it works</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.process.map((step) => (
                <div key={step.number} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                  <span className="font-mono text-2xl font-bold text-primary/40">{step.number}</span>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Deliverables Table */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">Deliverables</p>
              <h2 className="text-2xl font-bold text-foreground">Exactly what you get</h2>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground tracking-widest uppercase">Deliverable</th>
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground tracking-widest uppercase hidden md:table-cell">Description</th>
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground tracking-widest uppercase whitespace-nowrap">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {service.deliverableTable.map((row, i) => (
                    <tr key={row.item} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-secondary/30"}`}>
                      <td className="px-4 py-3 font-medium text-foreground align-top">{row.item}</td>
                      <td className="px-4 py-3 text-muted-foreground align-top hidden md:table-cell leading-relaxed">{row.description}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground align-top whitespace-nowrap">{row.timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing Tiers */}
          <section className="flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">Pricing</p>
              <h2 className="text-2xl font-bold text-foreground">Investment</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.pricingTiers.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`rounded-lg border p-5 flex flex-col gap-3 ${
                    i === 1 ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{tier.name}</p>
                  <p className="text-2xl font-bold text-foreground">{tier.price}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                  <Link
                    href="/contact"
                    className={`mt-auto rounded-md px-4 py-2.5 text-sm font-medium text-center transition-opacity hover:opacity-90 ${
                      i === 1
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    Get a Quote
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Case Study */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">Case Study</p>
              <h2 className="text-2xl font-bold text-foreground">Real results</h2>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary shrink-0" />
                <p className="text-lg font-bold text-primary">{service.caseStudy.result}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.caseStudy.detail}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
                {service.caseStudy.metrics.map((m) => (
                  <div key={m} className="flex items-start gap-2">
                    <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">FAQ</p>
              <h2 className="text-2xl font-bold text-foreground">Common questions</h2>
            </div>
            <div className="rounded-lg border border-border bg-card px-6">
              {service.faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          {/* CTA Footer */}
          <section className="rounded-lg border border-primary/30 bg-primary/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-foreground text-lg">Ready to get started?</p>
              <p className="text-sm text-muted-foreground">Book a free 30-minute strategy call. No obligation — we scope the project together.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Book a Strategy Call <ArrowRight size={14} />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap"
              >
                Explore Free Tools
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
            <p className="font-mono text-xs font-semibold text-foreground tracking-widest uppercase">Ideal for</p>
            <ul className="flex flex-col gap-2">
              {service.idealFor.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
            <p className="font-mono text-xs font-semibold text-foreground tracking-widest uppercase">Other Services</p>
            <ul className="flex flex-col gap-2">
              {otherServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-between group"
                  >
                    {s.title}
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-xs font-mono text-primary hover:underline">All services &rarr;</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
