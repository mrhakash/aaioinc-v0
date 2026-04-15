"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, ShieldCheck, Accessibility, Lock } from "lucide-react"

interface Plan {
  name: string
  monthly: string
  annual: string
  annualNote?: string
  period: string
  description: string
  cta: string
  ctaHref: string
  featured: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    name: "Free",
    monthly: "$0",
    annual: "$0",
    period: "forever",
    description: "All core tools, unlimited. No credit card.",
    cta: "Start Free",
    ctaHref: "/auth/signup",
    featured: false,
    features: [
      "GEO Score Analyzer (10/day)",
      "AI Overview Checker (3/day)",
      "Content Humanizer (5 docs/day)",
      "Niche Research (5 searches/day)",
      "LLM Cost Comparison",
      "MCP Config Builder (unlimited)",
      "Prompt Library (read-only)",
      "Community support",
    ],
  },
  {
    name: "Pro",
    monthly: "$29",
    annual: "$23",
    annualNote: "billed $276/yr",
    period: "/month",
    description: "For serious bloggers and solo SEOs scaling their workflow.",
    cta: "Start Pro Trial",
    ctaHref: "/auth/signup?plan=pro",
    featured: true,
    features: [
      "Everything in Free",
      "Unlimited GEO analyses",
      "Unlimited AI Overview checks",
      "Unlimited humanizer",
      "Fork + save prompts",
      "Advanced niche scoring",
      "Content pipeline automation",
      "API access (1,000 calls/mo)",
      "Priority support",
      "Early access to new tools",
    ],
  },
  {
    name: "Agency",
    monthly: "$99",
    annual: "$79",
    annualNote: "billed $948/yr",
    period: "/month",
    description: "Multi-client pipelines, white-label output, and team seats.",
    cta: "Start Agency Trial",
    ctaHref: "/auth/signup?plan=agency",
    featured: false,
    features: [
      "Everything in Pro",
      "10 team seats",
      "White-label reports",
      "Multi-client workspace",
      "API access (10,000 calls/mo)",
      "Webhook integrations",
      "Dedicated account manager",
      "SLA uptime guarantee",
    ],
  },
  {
    name: "Enterprise",
    monthly: "Custom",
    annual: "Custom",
    period: "",
    description: "Managed agent deployment, compliance, and custom SLAs.",
    cta: "Contact Sales",
    ctaHref: "/#contact",
    featured: false,
    features: [
      "Everything in Agency",
      "Managed agent deployment",
      "Custom compliance controls",
      "On-premise option",
      "Unlimited API access",
      "Custom integrations",
      "24/7 dedicated support",
      "Custom contract & billing",
    ],
  },
]

const trustBadges = [
  {
    icon: ShieldCheck,
    label: "SOC 2 Type II",
    note: "In progress",
  },
  {
    icon: Accessibility,
    label: "WCAG 2.1 AA",
    note: "Compliant",
  },
  {
    icon: Lock,
    label: "GDPR",
    note: "Ready",
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Free forever. Upgrade when you scale.
          </h2>
          <p className="max-w-xl text-muted-foreground leading-relaxed">
            No hidden costs. No bait-and-switch. Core tools stay free permanently — Pro and Agency unlock the full platform.
          </p>
        </div>

        {/* Monthly / Annual toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full border transition-colors duration-200 ${
              annual ? "bg-primary border-primary" : "bg-secondary border-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-card shadow-sm border border-border transition-transform duration-200 ${
                annual ? "translate-x-5 border-primary/20" : "translate-x-0"
              }`}
            />
            <span className="sr-only">Toggle annual billing</span>
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual
          </span>
          {annual && (
            <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-xs font-mono text-primary">
              Save ~20%
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const price = annual ? plan.annual : plan.monthly
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-lg border p-6 ${
                  plan.featured
                    ? "border-primary/60 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-mono font-semibold text-primary-foreground whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="flex flex-col gap-1 mb-6">
                  <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      {price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  {annual && plan.annualNote && (
                    <p className="font-mono text-xs text-muted-foreground/70">{plan.annualNote}</p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`mb-6 rounded-md px-4 py-2.5 text-sm font-medium text-center transition-opacity hover:opacity-90 ${
                    plan.featured
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex items-center justify-center flex-wrap gap-4">
          {trustBadges.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
              >
                <Icon size={14} className="text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{badge.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{badge.note}</span>
              </div>
            )
          })}
        </div>

        {/* Managed services note */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Need managed agentic AI deployment?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Six service offerings from $500 to $15,000. From OpenClaw setup to full production agent pipelines.
            </p>
          </div>
          <Link
            href="/#services"
            className="shrink-0 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  )
}
