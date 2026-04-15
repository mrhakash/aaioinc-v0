"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import {
  Copy, Check, Lock, ArrowRight, Search, BookOpen, X, SlidersHorizontal,
} from "lucide-react"
import { prompts, PROMPT_CATEGORIES, type PromptItem, type PromptCategory } from "@/lib/prompts-data"

const tierStyles = {
  Free: "text-primary bg-primary/10 border-primary/30",
  Pro: "text-amber-400 bg-amber-500/10 border-amber-500/25",
}

const categoryCounts = PROMPT_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
  acc[cat] = cat === "All" ? prompts.length : prompts.filter((p) => p.category === cat).length
  return acc
}, {})

function PromptCard({
  p,
  copiedId,
  onCopy,
  forkedIds,
  onFork,
}: {
  p: PromptItem
  copiedId: string | null
  onCopy: (p: PromptItem) => void
  forkedIds: Set<string>
  onFork: (p: PromptItem) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isCopied = copiedId === p.id
  const isForked = forkedIds.has(p.id)

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col gap-0 overflow-hidden hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground">{p.category}</span>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-mono font-medium ${tierStyles[p.tier]}`}>
                {p.tier}
              </span>
            </div>
            <h2 className="font-semibold text-foreground text-sm">{p.title}</h2>
            <p className="text-xs text-muted-foreground">{p.description}</p>
          </div>
        </div>

        {/* Prompt preview */}
        <div className="relative rounded-md border border-border bg-secondary overflow-hidden">
          {p.tier === "Pro" ? (
            <div className="p-4 flex flex-col items-center justify-center gap-2 min-h-[80px]">
              <Lock size={14} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Pro prompt — unlock to view</p>
            </div>
          ) : (
            <div className="p-4">
              <p className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {expanded ? p.prompt : p.prompt.length > 220 ? `${p.prompt.slice(0, 220)}…` : p.prompt}
              </p>
              {p.prompt.length > 220 && !expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="mt-2 text-xs font-mono text-primary hover:underline"
                >
                  Show full prompt
                </button>
              )}
              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  className="mt-2 text-xs font-mono text-muted-foreground hover:text-foreground hover:underline"
                >
                  Collapse
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags + Actions */}
      <div className="px-5 pb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {p.tier === "Free" ? (
            <>
              <button
                onClick={() => onCopy(p)}
                className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                aria-label={`Copy prompt: ${p.title}`}
              >
                {isCopied ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
                {isCopied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={() => onFork(p)}
                className={`flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors ${
                  isForked
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
                aria-label={isForked ? `Unfork prompt: ${p.title}` : `Fork prompt: ${p.title}`}
              >
                <BookOpen size={11} />
                {isForked ? "Saved" : "Fork"}
              </button>
            </>
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 rounded border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <Lock size={11} />
              Unlock Pro
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PromptsClient() {
  const [activeCategory, setActiveCategory] = useState<PromptCategory>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [forkedIds, setForkedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [tierFilter, setTierFilter] = useState<"All" | "Free" | "Pro">("All")

  const filtered = useMemo(() => {
    let result = prompts

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (tierFilter !== "All") {
      result = result.filter((p) => p.tier === tierFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      )
    }

    return result
  }, [activeCategory, searchQuery, tierFilter])

  const handleCopy = useCallback((p: PromptItem) => {
    if (p.tier === "Pro") return
    navigator.clipboard.writeText(p.prompt).catch(() => {})
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleFork = useCallback((p: PromptItem) => {
    if (p.tier === "Pro") return
    setForkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(p.id)) {
        next.delete(p.id)
      } else {
        next.add(p.id)
      }
      return next
    })
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
    setActiveCategory("All")
    setTierFilter("All")
  }

  const hasActiveFilters = searchQuery || activeCategory !== "All" || tierFilter !== "All"

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Prompt Library</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            {prompts.length}+ prompts for SEO, content,
            <br className="hidden sm:block" /> and AI agents.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Curated, tested, and ready to use across any LLM. Free to read and copy — fork and save to your workspace with Pro.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
              {prompts.length}+ Prompts
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground">
              {PROMPT_CATEGORIES.length - 1} categories
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground">
              Free to copy · Pro to fork & save
            </span>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="sticky top-0 z-20 bg-background border-b border-border px-6 py-4">
        <div className="mx-auto max-w-7xl flex flex-col gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search prompts, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-secondary pl-9 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                aria-label="Search prompts"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-mono transition-colors shrink-0 ${
                showFilters || tierFilter !== "All"
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearSearch}
                className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center gap-1"
              >
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">Tier:</span>
              {(["All", "Free", "Pro"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`rounded-full px-3 py-1 text-xs font-mono border transition-colors ${
                    tierFilter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {PROMPT_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-mono font-medium border transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                  {cat !== "All" && (
                    <span className="ml-1 opacity-60">{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-xs text-muted-foreground">
              {filtered.length} prompt{filtered.length !== 1 ? "s" : ""}
              {hasActiveFilters ? " found" : ""}
            </p>
            {forkedIds.size > 0 && (
              <Link
                href="/dashboard/prompts"
                className="flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
              >
                <BookOpen size={11} />
                {forkedIds.size} saved
              </Link>
            )}
          </div>

          {/* Prompt grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <PromptCard
                  key={p.id}
                  p={p}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                  forkedIds={forkedIds}
                  onFork={handleFork}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center text-center gap-4">
              <p className="font-semibold text-foreground">No prompts found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or category.
              </p>
              <button
                onClick={clearSearch}
                className="text-xs font-mono text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pro upsell */}
          <div className="mt-10 rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Fork and save prompts to your workspace
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pro users can fork any prompt, customize it, and save it for quick access — plus unlock all Pro prompts.
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
            >
              Unlock Pro
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
