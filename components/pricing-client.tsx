"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import {
  Check,
  Minus,
  Zap,
  Building2,
  Sparkles,
  ChevronDown,
  Crown,
} from "lucide-react"
import { Checkout } from "@/components/checkout"

// ── Plan definitions ──────────────────────────────────────────────────────────

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "forever",
    description: "All core tools, daily limits. No credit card.",
    cta: "Get Started Free",
    ctaHref: "/auth/signup",
    featured: false,
    Icon: Sparkles,
    productId: null as string | null,
    annualProductId: null as string | null,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 23,
    annualNote: "billed $276/yr — save $72",
    period: "/mo",
    description: "Unlimited analyses, full API access, tool history.",
    cta: "Start Pro Trial",
    ctaHref: null as string | null,
    featured: true,
    Icon: Zap,
    productId: "pro-monthly",
    annualProductId: "pro-annual",
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 99,
    annualPrice: 79,
    annualNote: "billed $948/yr — save $240",
    period: "/mo",
    description: "Team seats, white-label reports, multi-client workspaces.",
    cta: "Start Agency Trial",
    ctaHref: null as string | null,
    featured: false,
    Icon: Building2,
    productId: "agency-monthly",
    annualProductId: "agency-annual",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null as number | null,
    annualPrice: null as number | null,
    period: "",
    description: "Custom deployment, SLA guarantees, dedicated support.",
    cta: "Contact Sales",
    ctaHref: "/#contact",
    featured: false,
    Icon: Crown,
    productId: null as string | null,
    annualProductId: null as string | null,
  },
]

// ── Feature comparison table ──────────────────────────────────────────────────

type Val = boolean | string

interface Row { label: string; free: Val; pro: Val; agency: Val; enterprise: Val }
interface Group { group: string; rows: Row[] }

const groups: Group[] = [
  {
    group: "GEO & AI Tools",
    rows: [
      { label: "GEO Score Analyzer",      free: "10/day",    pro: "Unlimited", agency: "Unlimited", enterprise: "Unlimited" },
      { label: "AI Overview Checker",     free: "3/day",     pro: "Unlimited", agency: "Unlimited", enterprise: "Unlimited" },
      { label: "GEO Visibility Checker",  free: "3/day",     pro: "Unlimited", agency: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    group: "Content Tools",
    rows: [
      { label: "Content Humanizer",          free: "5/day",  pro: "Unlimited", agency: "Unlimited", enterprise: "Unlimited" },
      { label: "Niche Profitability Scorer", free: "3/day",  pro: "25/day",    agency: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    group: "Developer Tools",
    rows: [
      { label: "MCP Config Builder",   free: true,           pro: true,              agency: true,              enterprise: true },
      { label: "LLM Cost Calculator",  free: true,           pro: true,              agency: true,              enterprise: true },
      { label: "API Access",           free: false,          pro: "1,000 calls/mo",  agency: "10,000 calls/mo", enterprise: "Unlimited" },
      { label: "Webhook integrations", free: false,          pro: false,             agency: true,              enterprise: true },
    ],
  },
  {
    group: "Workspace",
    rows: [
      { label: "Tool history & saved results", free: false,       pro: true,        agency: true,       enterprise: true },
      { label: "Prompt library (fork & save)", free: "Read-only", pro: true,        agency: true,       enterprise: true },
      { label: "Team seats",                   free: false,       pro: false,       agency: "10 seats", enterprise: "Custom" },
      { label: "White-label reports",          free: false,       pro: false,       agency: true,       enterprise: true },
      { label: "Multi-client workspace",       free: false,       pro: false,       agency: true,       enterprise: true },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Community support",       free: true,  pro: true,  agency: true,  enterprise: true },
      { label: "Priority support",        free: false, pro: true,  agency: true,  enterprise: true },
      { label: "Dedicated account mgr",   free: false, pro: false, agency: true,  enterprise: true },
      { label: "SLA uptime guarantee",    free: false, pro: false, agency: false, enterprise: true },
    ],
  },
]

const COLS: Array<"free" | "pro" | "agency" | "enterprise"> = ["free", "pro", "agency", "enterprise"]

function Cell({ value }: { value: Val }) {
  if (value === true)  return <Check  size={15} className="text-success mx-auto" aria-label="Included" />
  if (value === false) return <Minus  size={15} className="text-border  mx-auto" aria-label="Not included" />
  return <span className="text-xs text-foreground font-medium">{value}</span>
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. Upgrades are instant and prorated. Downgrades take effect at the end of the current billing period.",
  },
  {
    q: "What counts as one 'use'?",
    a: "Each analysis submission counts as one use. Viewing previous results from your history does not consume your daily quota.",
  },
  {
    q: "Is there a free trial for Pro or Agency?",
    a: "Both plans include a 7-day free trial. You are not charged until the trial ends, and you can cancel any time before that.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major credit and debit cards (Visa, Mastercard, Amex, Discover) via Stripe. Annual Agency and Enterprise plans can also be invoiced.",
  },
  {
    q: "Do API call quotas roll over?",
    a: "No — quotas reset on the first of each calendar month. Unused calls do not carry forward.",
  },
  {
    q: "How does the annual discount work?",
    a: "Annual plans are billed as a single upfront charge. Pro saves $72/year and Agency saves $240/year compared to monthly billing.",
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function PricingClient() {
  const [annual, setAnnual]               = useState(false)
  const [checkoutProduct, setCheckout]    = useState<string | null>(null)
  const [openFaq, setOpenFaq]             = useState<number | null>(null)

  function pickProduct(plan: typeof plans[0]) {
    if (plan.ctaHref) return          // external link — handled by <Link>
    const pid = annual ? plan.annualProductId : plan.productId
    if (pid) setCheckout(pid)
  }

  return (
    <main className="min-h-screen bg-background">

      {/* Checkout overlay */}
      {checkoutProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setCheckout(null) }}
        >
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <button
              onClick={() => setCheckout(null)}
              aria-label="Close checkout"
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
            >
              &times;
            </button>
            <Checkout productId={checkoutProduct} onClose={() => setCheckout(null)} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-20">

        {/* ── Header ── */}
        <div className="text-center space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Pricing</p>
          <h1 className="font-display text-4xl font-bold text-foreground text-balance lg:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground text-lg leading-relaxed">
            Start free. Upgrade when your workflow demands it. Cancel any time.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-secondary px-4 py-2">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual billing"
              onClick={() => setAnnual((a) => !a)}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${annual ? "bg-primary" : "bg-muted-foreground/30"}`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${annual ? "translate-x-4" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual{" "}
              <span className="ml-1 rounded-full bg-success-badge px-2 py-0.5 text-xs font-semibold text-success">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* ── Plan cards ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const { Icon } = plan
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  plan.featured
                    ? "border-primary bg-primary/8 shadow-[0_0_48px_-8px_rgba(99,91,255,0.3)]"
                    : "border-border bg-secondary hover:border-primary/30"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon + name */}
                <div className="mb-5 flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${plan.featured ? "bg-primary text-primary-foreground" : "bg-muted-foreground/10 text-muted-foreground"}`}>
                    <Icon size={15} />
                  </div>
                  <span className="font-display font-semibold text-foreground">{plan.name}</span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  {price !== null ? (
                    <div className="flex items-end gap-1">
                      <span className="font-display text-4xl font-bold text-foreground">${price}</span>
                      <span className="mb-1 text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                  ) : (
                    <span className="font-display text-3xl font-bold text-foreground">Custom</span>
                  )}
                  {annual && "annualNote" in plan && plan.annualNote && (
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{plan.annualNote}</p>
                  )}
                </div>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                {plan.ctaHref ? (
                  <Link
                    href={plan.ctaHref}
                    className={`block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border text-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => pickProduct(plan)}
                    className={`w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border text-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Comparison table ── */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            Compare all features
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="py-4 pl-6 pr-4 text-left font-medium text-muted-foreground w-2/5">
                    Feature
                  </th>
                  {["Free", "Pro", "Agency", "Enterprise"].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-4 text-center font-semibold ${
                        h === "Pro" ? "text-primary bg-primary/5" : "text-foreground"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <Fragment key={g.group}>
                    <tr className="border-b border-border/50 bg-secondary/40">
                      <td
                        colSpan={5}
                        className="py-2.5 pl-6 font-mono text-xs uppercase tracking-widest text-muted-foreground"
                      >
                        {g.group}
                      </td>
                    </tr>
                    {g.rows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-border/30 transition-colors hover:bg-secondary/50"
                      >
                        <td className="py-3 pl-6 pr-4 text-foreground">{row.label}</td>
                        {COLS.map((col) => (
                          <td
                            key={col}
                            className={`px-4 py-3 text-center ${col === "pro" ? "bg-primary/5" : ""}`}
                          >
                            <Cell value={row[col]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            Frequently asked questions
          </h2>

          <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={i} className="bg-secondary">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {faq.q}
                    <ChevronDown
                      size={15}
                      className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="border-t border-border/40 px-6 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Still have questions?{" "}
            <a href="/#contact" className="text-primary hover:underline">Contact us</a>
            {" "}or{" "}
            <a href="mailto:hello@aaioinc.com" className="text-primary hover:underline">
              email hello@aaioinc.com
            </a>
          </p>
        </div>

      </div>
    </main>
  )
}
