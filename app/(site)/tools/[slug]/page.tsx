import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Check, ArrowLeft, ArrowRight, Lock } from "lucide-react"
import { tools, getToolBySlug } from "@/lib/tools-data"
import { ToolFAQ } from "@/components/tool-faq"
import { ToolMobileBar } from "@/components/tool-mobile-bar"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  return {
    title: tool.seoTitle ?? `${tool.title} — Free Tool | AAIOINC`,
    description: tool.description,
  }
}

const tierStyles: Record<string, string> = {
  Free:          "text-primary bg-primary/10 border-primary/30",
  Freemium:      "text-sky-400 bg-sky-500/10 border-sky-500/25",
  Paid:          "text-amber-400 bg-amber-500/10 border-amber-500/25",
  "Coming Soon": "text-muted-foreground bg-muted border-border",
}

// ── Generic "How It Works" steps per input type ───────────────────────
function getHowItWorks(slug: string) {
  const maps: Record<string, { step: string; title: string; detail: string }[]> = {
    humanizer: [
      { step: "01", title: "Paste your AI-generated text", detail: "Copy any AI-generated draft and paste it into the input area. Free accounts can process up to 5,000 characters per run." },
      { step: "02", title: "Humanizer runs pattern analysis", detail: "Our pipeline targets the specific linguistic patterns each detector flags — predictable sentence structure, overused transitions, and repetitive phrasing." },
      { step: "03", title: "Review the word-level diff", detail: "Every changed word is highlighted in the before/after view. You stay in control — see exactly what changed and why before using the output." },
    ],
    "geo-checker": [
      { step: "01", title: "Enter your domain or brand name", detail: "Type in your full domain (example.com) or brand name. No login required for the first check of each session." },
      { step: "02", title: "We query 4 AI platforms simultaneously", detail: "We send representative queries to ChatGPT, Perplexity, Claude, and Gemini and analyze every response for brand mentions, citation context, and sentiment." },
      { step: "03", title: "Get your visibility score and action plan", detail: "A 0–100 score with platform-by-platform breakdown, competing brands cited alongside yours, and prioritized actions to improve your citation rate." },
    ],
    "niche-scorer": [
      { step: "01", title: "Enter a niche keyword", detail: "Be specific — 'indoor hydroponics for apartments' will score more accurately than just 'plants'. The more specific, the higher confidence in the output." },
      { step: "02", title: "We analyze 6 profitability dimensions", detail: "Competition level, search volume, monetization potential, AI visibility opportunity, content gap, and trend direction are all scored in real time." },
      { step: "03", title: "Get a radar chart + A–F viability grade", detail: "An animated radar chart visualizes all 6 dimensions. Share your grade as a social card or book our full Niche Research service for a 20-page deep dive." },
    ],
  }
  return maps[slug] ?? [
    { step: "01", title: "Enter your input", detail: "Paste text, enter a URL, or fill in the fields — depending on the tool. No account required for free usage." },
    { step: "02", title: "Our agents analyze in seconds", detail: "We run the input through our AI pipeline and return structured, actionable results — not raw model output." },
    { step: "03", title: "Act on the result", detail: "Copy, share, export, or book a managed service to have our team handle the heavy lifting for you." },
  ]
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const relatedTools = tools.filter((t) => t.slug !== slug && t.tier !== "Coming Soon").slice(0, 3)
  const howItWorks = getHowItWorks(slug)

  // ── FAQ JSON-LD schema ────────────────────────────────────────────
  const faqSchema = tool.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  } : null

  // ── Breadcrumb JSON-LD schema ─────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://aaioinc.com/" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://aaioinc.com/tools" },
      { "@type": "ListItem", "position": 3, "name": tool.title, "item": `https://aaioinc.com/tools/${slug}` },
    ],
  }

  return (
    <>
      {/* Structured data */}
      <Script id="breadcrumb-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      {faqSchema && (
        <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(faqSchema)}
        </Script>
      )}

      <div className="min-h-screen pb-20 sm:pb-0">
        {/* ── Breadcrumb ── */}
        <div className="border-b border-border px-6 py-3">
          <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft size={12} /> Tools
            </Link>
            <span>/</span>
            <span className="text-muted-foreground">{tool.category}</span>
            <span>/</span>
            <span className="text-foreground">{tool.title}</span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-12">
          {/* ── Header ── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold ${tierStyles[tool.tier]}`}>
                {tool.tier === "Free" ? "FREE" : tool.tier}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{tool.category}</span>
              {tool.tags.map((tag) => (
                <span key={tag} className="rounded border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{tool.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{tool.tagline}</p>
            {tool.limit && (
              <p className="font-mono text-xs text-muted-foreground/70 border border-border rounded-md px-3 py-2 bg-secondary w-fit">
                {tool.limit}
              </p>
            )}
          </div>

          {/* ── Tool Area ── */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground">Try it now</p>

            {tool.tier === "Coming Soon" ? (
              <div className="rounded-md border border-border bg-secondary p-8 text-center flex flex-col gap-3 items-center">
                <Lock size={24} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground max-w-sm">
                  This tool is in development. Join the waitlist for early access — you&apos;ll be notified before public launch.
                </p>
                <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                  Join Waitlist
                </button>
              </div>
            ) : tool.inputType === "none" ? (
              <div className="rounded-md border border-border bg-secondary p-6 flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-muted-foreground">
                  This tool has a dedicated interface. Click below to open the full tool.
                </p>
                <Link
                  href={`/tools/${slug}`}
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  {tool.ctaLabel} <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                {tool.inputType === "sliders" ? (
                  <div className="rounded-md border border-border bg-secondary p-4 flex flex-col gap-4">
                    <p className="text-xs text-muted-foreground font-mono">Configure your token usage:</p>
                    {["Input tokens (millions)", "Output tokens (millions)"].map((label) => (
                      <div key={label} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-muted-foreground">{label}</label>
                          <span className="font-mono text-xs text-foreground">1.0M</span>
                        </div>
                        <input type="range" min={0} max={10} step={0.1} defaultValue={1}
                          className="w-full accent-primary h-1.5 rounded-full cursor-pointer" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={tool.inputType === "text" ? 1 : 6}
                    placeholder={tool.placeholder ?? "Enter your input here..."}
                    className="w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                  />
                )}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-xs text-muted-foreground font-mono">
                    {tool.limit ?? "Unlimited · No account required"}
                  </p>
                  <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2">
                    {tool.ctaLabel} <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── How It Works ── */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-foreground">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {howItWorks.map(({ step, title, detail }) => (
                <div key={step} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
                  <span className="font-mono text-2xl font-bold text-primary/40">{step}</span>
                  <p className="font-semibold text-foreground text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── What you get ── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">What you get</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── FAQ ── */}
          {tool.faqs.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
              <ToolFAQ faqs={tool.faqs} />
            </div>
          )}

          {/* ── Related Tools grid ── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">Related tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group rounded-lg border border-border bg-card p-5 flex flex-col gap-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold ${tierStyles[t.tier]}`}>
                      {t.tier === "Free" ? "FREE" : t.tier}
                    </span>
                    <ArrowRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{t.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{t.tagline}</p>
                </Link>
              ))}
            </div>
            <Link href="/tools" className="text-xs font-mono text-primary hover:underline w-fit">
              Browse all tools &rarr;
            </Link>
          </div>

          {/* ── Upsell CTA ── */}
          {(tool.tier === "Free" || tool.tier === "Freemium") && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-foreground">
                  {tool.upsellMessage ?? "Unlock unlimited access with Pro"}
                </p>
                <p className="text-sm text-muted-foreground">Unlimited usage, saved history, API access, and team workspaces from $29/month.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  See Pro Plans <ArrowRight size={14} />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap"
                >
                  All Free Tools
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Sticky mobile bottom bar ── */}
        <ToolMobileBar toolTitle={tool.title} />
      </div>
    </>
  )
}
