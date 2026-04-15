"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Globe,
  FileText,
  Search,
  DollarSign,
  Bot,
  Eye,
  Wrench,
  Type,
  Shield,
  FileCode,
  ClipboardList,
  Lightbulb,
  Layers,
  Package,
} from "lucide-react"

type Tier = "Free" | "Freemium" | "Coming Soon"
type Category = "All" | "GEO & AI Search" | "Content" | "SEO" | "Developer" | "Strategy" | "Agents"

interface Tool {
  icon: React.ElementType
  tier: Tier
  category: Category
  title: string
  description: string
  tags: string[]
  href: string
  highlight: boolean
  limit?: string
  priority: "P0" | "P1" | "P2"
}

const tools: Tool[] = [
  {
    icon: Eye,
    tier: "Freemium",
    category: "GEO & AI Search",
    title: "GEO Visibility Checker",
    description: "See whether your brand appears in ChatGPT, Perplexity, Claude, and Gemini. Visibility score, mentions per platform, and recommended fixes.",
    limit: "3/day free · 50/day Pro · Unlimited Agency",
    tags: ["GEO", "Brand", "AI Search"],
    href: "/tools/geo-checker",
    highlight: true,
    priority: "P0",
  },
  {
    icon: FileText,
    tier: "Freemium",
    category: "Content",
    title: "AI Content Humanizer",
    description: "Paste AI text, get humanized output with a full transformation diff. See exactly what changed — verify quality, not just trust the output.",
    limit: "5/day free · Unlimited on Pro",
    tags: ["Content", "AI Detection"],
    href: "/tools/humanizer",
    highlight: true,
    priority: "P0",
  },
  {
    icon: Search,
    tier: "Freemium",
    category: "SEO",
    title: "Niche Profitability Scorer",
    description: "Enter a niche keyword, get a 6-axis radar chart with a viability grade (A–F): competition, volume, monetization, AI visibility, content gap, trend.",
    limit: "3/day free · 25/day Pro",
    tags: ["Research", "Affiliate", "SEO"],
    href: "/tools/niche-scorer",
    highlight: true,
    priority: "P0",
  },
  {
    icon: DollarSign,
    tier: "Free",
    category: "Developer",
    title: "LLM Cost Calculator",
    description: "Compare real-time pricing across OpenAI, Anthropic, Google, and 20+ providers. Find the cheapest model for your exact use case. Unlimited.",
    tags: ["LLM", "Cost", "Developer"],
    href: "/tools/llm-calculator",
    highlight: false,
    priority: "P0",
  },
  {
    icon: Layers,
    tier: "Freemium",
    category: "SEO",
    title: "Keyword Cluster Generator",
    description: "Upload up to 100 keywords, get grouped clusters with intent tags. Organize your content strategy around topic clusters.",
    limit: "3/day free · Unlimited Pro",
    tags: ["SEO", "Keywords", "Content"],
    href: "/tools/keyword-cluster",
    highlight: false,
    priority: "P1",
  },
  {
    icon: ClipboardList,
    tier: "Freemium",
    category: "Content",
    title: "Content Brief Builder",
    description: "Enter a target keyword, get a complete outline with H2s, word count recommendations, and competitor analysis.",
    limit: "3/day free · Unlimited Pro",
    tags: ["Content", "SEO", "Strategy"],
    href: "/tools/content-brief",
    highlight: false,
    priority: "P1",
  },
  {
    icon: FileCode,
    tier: "Free",
    category: "SEO",
    title: "Schema Markup Generator",
    description: "Generate JSON-LD structured data for articles, products, FAQs, and more. Copy-paste ready code with validation.",
    tags: ["SEO", "Schema", "Technical"],
    href: "/tools/schema-generator",
    highlight: false,
    priority: "P1",
  },
  {
    icon: Wrench,
    tier: "Freemium",
    category: "GEO & AI Search",
    title: "Robots.txt Optimizer",
    description: "Check if your robots.txt blocks AI crawlers. Get fix recommendations and optimized code for GPTBot, Claude, and others.",
    limit: "5/day free · Unlimited Pro",
    tags: ["Technical", "SEO", "AI Crawlers"],
    href: "/tools/robots-optimizer",
    highlight: false,
    priority: "P1",
  },
  {
    icon: Type,
    tier: "Freemium",
    category: "Content",
    title: "Blog Title Generator",
    description: "Enter a topic and keyword, get 10 SEO-optimized headline options with engagement scores.",
    limit: "5/day free · Unlimited Pro",
    tags: ["Content", "Headlines", "SEO"],
    href: "/tools/title-generator",
    highlight: false,
    priority: "P2",
  },
  {
    icon: Shield,
    tier: "Free",
    category: "Content",
    title: "AI Detection Scanner",
    description: "Paste text, get multi-detector analysis showing AI probability. Client-side processing — your text never leaves your browser.",
    tags: ["AI Detection", "Content", "Privacy"],
    href: "/tools/ai-detector",
    highlight: false,
    priority: "P2",
  },
  {
    icon: Globe,
    tier: "Freemium",
    category: "SEO",
    title: "Meta Description Writer",
    description: "Enter URL and keyword, get 3 optimized meta descriptions with character counts. Perfect for on-page SEO.",
    limit: "5/day free · Unlimited Pro",
    tags: ["SEO", "Meta", "Content"],
    href: "/tools/meta-writer",
    highlight: false,
    priority: "P2",
  },
  {
    icon: Lightbulb,
    tier: "Free",
    category: "Strategy",
    title: "AI Readiness Quiz",
    description: "Answer 10 questions, get a custom AI roadmap and readiness score. Understand where to start your AI journey.",
    tags: ["Assessment", "Strategy", "AI"],
    href: "/tools/ai-readiness",
    highlight: false,
    priority: "P2",
  },
  {
    icon: Bot,
    tier: "Freemium",
    category: "Strategy",
    title: "AI Stack Recommender",
    description: "Describe your use case, get a recommended AI stack with pricing estimates. Tools, models, and infrastructure.",
    limit: "3/day free · Unlimited Pro",
    tags: ["Strategy", "AI", "Developer"],
    href: "/tools/stack-recommender",
    highlight: false,
    priority: "P2",
  },
  {
    icon: Bot,
    tier: "Free",
    category: "Agents",
    title: "OpenClaw Skill Finder",
    description: "Browse vetted OpenClaw skills with security audit status. Every skill reviewed before listing — no malicious packages.",
    tags: ["Agents", "MCP", "Security"],
    href: "/tools/openclaw",
    highlight: true,
    priority: "P1",
  },
]

const CATEGORIES: Category[] = ["All", "GEO & AI Search", "Content", "SEO", "Developer", "Strategy", "Agents"]

const categoryCounts: Record<Category, number> = CATEGORIES.reduce((acc, cat) => {
  acc[cat] = cat === "All" ? tools.length : tools.filter((t) => t.category === cat).length
  return acc
}, {} as Record<Category, number>)

const tierStyles: Record<Tier, string> = {
  Free: "bg-primary/15 text-primary border border-primary/30",
  Freemium: "bg-sky-500/10 text-sky-600 border border-sky-500/25",
  "Coming Soon": "bg-muted text-muted-foreground border border-border",
}

export function FreeTools() {
  const [activeCategory, setActiveCategory] = useState<Category>("All")

  const filtered = activeCategory === "All"
    ? tools
    : tools.filter((t) => t.category === activeCategory)

  return (
    <section id="tools" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <p className="text-mono-label text-[10px] text-muted-foreground">
            {tools.length} Free Tools
          </p>
          <h2 className="text-display-sm text-[clamp(26px,3.5vw,38px)] font-extrabold text-foreground text-balance">
            Start in seconds.{" "}
            <span className="text-primary">No account required.</span>
          </h2>
          <p className="max-w-xl text-[15px] text-muted-foreground leading-relaxed">
            Core tools are permanently free with daily limits. Upgrade to Pro ($29/mo) or Agency ($99/mo) for unlimited access.
          </p>
        </div>

        {/* Category filter chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10" role="group" aria-label="Filter tools by category">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat]
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(99,91,255,0.35)]"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono leading-none ${
                  isActive ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Package size={32} className="text-muted-foreground" />
            <p className="text-foreground font-medium">No tools in this category yet</p>
            <p className="text-sm text-muted-foreground">Check back soon — we ship weekly.</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="text-sm text-primary hover:underline"
            >
              View all tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={`card-hover group relative flex flex-col gap-4 rounded-lg border p-5 ${
                    tool.highlight
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  {/* Icon + tier */}
                  <div className="flex items-start justify-between">
                    <div className={`rounded-md border p-2 transition-colors ${
                      tool.highlight
                        ? "border-primary/30 bg-primary/10"
                        : "border-border bg-secondary group-hover:border-primary/30"
                    }`}>
                      <Icon size={16} className={tool.highlight ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors"} />
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${tierStyles[tool.tier]}`}>
                      {tool.tier}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="font-semibold text-[13px] text-foreground group-hover:text-primary transition-colors leading-snug">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                    {tool.limit && (
                      <p className="font-mono text-[10px] text-muted-foreground/70 border-t border-border pt-2 mt-auto">
                        {tool.limit}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ArrowRight size={11} className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150" />
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/tools"
            className="btn-press inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            View All Tools
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
