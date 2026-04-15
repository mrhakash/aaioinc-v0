"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Search, X } from "lucide-react"
import { pillarPages, type PillarPage } from "@/lib/pillar-pages"
import { NewsletterSignup } from "@/components/newsletter-signup"

// ── Static posts (non-pillar) ──────────────────────────────────────────────
interface Post {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  featured?: boolean
}

const staticPosts: Post[] = [
  {
    slug: "what-is-geo-generative-engine-optimization",
    title: "What Is GEO? The Complete Guide to Generative Engine Optimization in 2026",
    excerpt: "AI-generated answers are replacing traditional search results. Here is how to optimize for them — and why your current SEO strategy is not enough.",
    category: "GEO",
    date: "April 10, 2026",
    readTime: "12 min read",
    featured: true,
  },
  {
    slug: "mcp-security-what-you-need-to-know",
    title: "MCP Security: What Every Developer Needs to Know Before Deploying Agent Skills",
    excerpt: "Model Context Protocol skills can be powerful — or catastrophically dangerous. Here is the audit checklist we use before deploying any skill to production.",
    category: "Agentic AI",
    date: "April 7, 2026",
    readTime: "8 min read",
  },
  {
    slug: "ai-content-detection-2026",
    title: "AI Content Detection in 2026: What Actually Works and What Doesn't",
    excerpt: "We tested 12 AI detection tools against 500 pieces of content. The results are more nuanced than vendors admit.",
    category: "Content",
    date: "April 3, 2026",
    readTime: "10 min read",
  },
  {
    slug: "llm-cost-comparison-q1-2026",
    title: "LLM Cost Comparison Q1 2026: The Cheapest Models That Don't Sacrifice Quality",
    excerpt: "Token prices dropped 40% in Q1 2026. Here is where to move your pipelines without touching performance.",
    category: "Developer",
    date: "March 28, 2026",
    readTime: "7 min read",
  },
  {
    slug: "niche-site-strategy-ai-era",
    title: "Niche Site Strategy in the AI Era: What Still Works, What's Dead",
    excerpt: "Traffic patterns have shifted dramatically since AI Overviews rolled out globally. Here is the data on what niche content still drives organic visits.",
    category: "SEO",
    date: "March 21, 2026",
    readTime: "14 min read",
  },
  {
    slug: "openclaw-vs-custom-agents",
    title: "OpenClaw vs. Custom Agents: When to Use Each and Why It Matters",
    excerpt: "Both approaches have real trade-offs. We break down the architecture decision most teams get wrong.",
    category: "Agentic AI",
    date: "March 15, 2026",
    readTime: "9 min read",
  },
]

// ── Colour tokens ────────────────────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  GEO:          "text-primary border-primary/30 bg-primary/10",
  "Agentic AI": "text-sky-400 border-sky-500/25 bg-sky-500/10",
  Content:      "text-amber-400 border-amber-500/25 bg-amber-500/10",
  Developer:    "text-violet-400 border-violet-500/25 bg-violet-500/10",
  SEO:          "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
}

const ALL_CATEGORIES = ["All", "GEO", "Agentic AI", "Content", "Developer", "SEO"]
const POSTS_PER_PAGE = 6

// Merge pillar pages into the posts pool (pillar pages take priority via sorting)
function buildPostPool(): Post[] {
  const pillarAsPosts: Post[] = pillarPages.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.publishDate,
    readTime: p.readTime,
  }))

  // De-dupe by slug (pillar page wins)
  const slugsSeen = new Set(pillarAsPosts.map((p) => p.slug))
  const extras = staticPosts.filter((p) => !slugsSeen.has(p.slug))

  return [...pillarAsPosts, ...extras]
}

export function BlogClient() {
  const allPosts = useMemo(() => buildPostPool(), [])
  const featured = staticPosts.find((p) => p.featured)!

  const [query,    setQuery]    = useState("")
  const [category, setCategory] = useState("All")
  const [page,     setPage]     = useState(1)

  const filtered = useMemo(() => {
    let posts = allPosts.filter((p) => !p.featured)
    if (category !== "All") posts = posts.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    return posts
  }, [allPosts, category, query])

  const totalPages   = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const paginated    = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
  const pillarSlices = pillarPages.slice(0, 8)

  const handleCategory = (cat: string) => {
    setCategory(cat)
    setPage(1)
  }
  const handleQuery = (q: string) => {
    setQuery(q)
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Blog</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            Practical guides on GEO, agents, and AI content.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            No fluff. Actionable analysis from practitioners building with AI every day.
          </p>

          {/* Search */}
          <div className="mx-auto mt-2 w-full max-w-lg relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search articles…"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              aria-label="Search articles"
            />
            {query && (
              <button
                onClick={() => handleQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Pillar Guides ───────────────────────────────────────── */}
      <section className="px-6 py-12 border-b border-border">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-primary" aria-hidden="true" />
            <h2 className="text-lg font-bold text-foreground">Pillar Guides</h2>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-mono text-primary">
              {pillarSlices.length} deep-dives
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillarSlices.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-5 hover:border-primary/40 hover:bg-primary/8 transition-all"
              >
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium w-fit ${categoryColors[p.category] ?? "text-muted-foreground border-border"}`}>
                  {p.category}
                </span>
                <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors text-balance">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                  {p.excerpt}
                </p>
                <div className="flex items-center pt-2 border-t border-border/50">
                  <span className="font-mono text-xs text-muted-foreground">{p.readTime}</span>
                  <span className="ml-auto text-xs font-mono text-primary flex items-center gap-1">
                    Read <ArrowRight size={10} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Articles ─────────────────────────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl flex flex-col gap-8">
          {/* Featured post — always shown when no filter active */}
          {category === "All" && !query && page === 1 && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group rounded-xl border border-primary/30 bg-primary/5 p-8 hover:bg-primary/8 transition-colors flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${categoryColors[featured.category]}`}>
                  {featured.category}
                </span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-mono text-primary">
                  Featured
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors text-balance">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">{featured.excerpt}</p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground">{featured.date}</span>
                <span className="font-mono text-xs text-muted-foreground">{featured.readTime}</span>
                <span className="ml-auto flex items-center gap-1 text-sm font-mono text-primary group-hover:underline">
                  Read article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}

          {/* Category filter tabs */}
          <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Filter by category">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={category === cat}
                onClick={() => handleCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
            {(query || category !== "All") && (
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Post grid */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium w-fit ${categoryColors[post.category] ?? "text-muted-foreground border-border"}`}>
                    {post.category}
                  </span>
                  <h2 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors text-balance flex-1">
                    {post.title}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
                    <span className="font-mono text-xs text-muted-foreground">{post.readTime}</span>
                    <ArrowRight size={12} className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground text-sm">
                No articles match{" "}
                {query ? (
                  <>
                    &quot;<span className="text-foreground font-medium">{query}</span>&quot;
                  </>
                ) : (
                  "this filter"
                )}
                .{" "}
                <button
                  onClick={() => { setQuery(""); setCategory("All") }}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Clear filters
                </button>
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4" aria-label="Pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={page === n ? "page" : undefined}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                    page === n
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <NewsletterSignup variant="banner" />
    </div>
  )
}
