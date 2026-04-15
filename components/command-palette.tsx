"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Globe,
  Eye,
  Wrench,
  Library,
  FileText,
  Search,
  DollarSign,
  BookOpen,
  Bot,
  Hash,
  ArrowRight,
} from "lucide-react"

interface CommandItem {
  icon: React.ElementType
  label: string
  description: string
  href: string
  group: string
  keywords?: string[]
}

const items: CommandItem[] = [
  // Tools
  { icon: Globe, label: "GEO Score Analyzer", description: "Analyze your GEO score instantly", href: "#tools", group: "Tools", keywords: ["geo", "score", "analyze"] },
  { icon: Eye, label: "AI Overview Checker", description: "Check AI overview visibility", href: "#tools", group: "Tools", keywords: ["ai", "overview", "visibility"] },
  { icon: Wrench, label: "MCP Config Builder", description: "Build MCP server configs", href: "#tools", group: "Tools", keywords: ["mcp", "config", "agent"] },
  { icon: Library, label: "Prompt Library", description: "Browse 200+ curated prompts", href: "#tools", group: "Tools", keywords: ["prompt", "library"] },
  { icon: FileText, label: "Content Humanizer", description: "Humanize AI-generated content", href: "#tools", group: "Tools", keywords: ["humanize", "content", "ai detection"] },
  { icon: Search, label: "Niche Research", description: "Find profitable niches", href: "#tools", group: "Tools", keywords: ["niche", "research", "affiliate"] },
  { icon: DollarSign, label: "LLM Cost Comparison", description: "Compare LLM pricing", href: "#tools", group: "Tools", keywords: ["llm", "cost", "price", "model"] },
  // Navigation
  { icon: Hash, label: "Pricing", description: "See plans and pricing", href: "#pricing", group: "Navigation" },
  { icon: BookOpen, label: "Resources", description: "Browse resource hub", href: "#resources", group: "Navigation" },
  { icon: Bot, label: "How It Works", description: "Discover → Build → Scale", href: "#how-it-works", group: "Navigation" },
]

function groupItems(filtered: CommandItem[]) {
  const groups: Record<string, CommandItem[]> = {}
  for (const item of filtered) {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
  }
  return groups
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [cursor, setCursor] = useState(0)
  const router = useRouter()

  const filtered = items.filter((item) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.includes(q))
    )
  })

  const flatFiltered = filtered

  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    setCursor(0)
  }, [])

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [close])

  // Arrow key + Enter navigation
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setCursor((c) => Math.min(c + 1, flatFiltered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setCursor((c) => Math.max(c - 1, 0))
      } else if (e.key === "Enter") {
        const item = flatFiltered[cursor]
        if (item) {
          close()
          router.push(item.href)
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, flatFiltered, cursor, close, router])

  // Reset cursor on query change
  useEffect(() => setCursor(0), [query])

  const grouped = groupItems(filtered)

  let itemIndex = 0

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
        onClick={close}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-label="Command palette"
        aria-modal="true"
        className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, docs, navigation..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {Object.entries(grouped).map(([group, groupItems]) => (
            <div key={group}>
              <p className="px-4 py-1.5 font-mono text-xs text-muted-foreground/60 tracking-widest uppercase">
                {group}
              </p>
              {groupItems.map((item) => {
                const Icon = item.icon
                const isCurrent = itemIndex === cursor
                const currentIndex = itemIndex
                itemIndex++
                return (
                  <button
                    key={item.label}
                    onMouseEnter={() => setCursor(currentIndex)}
                    onClick={() => { close(); router.push(item.href) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isCurrent ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className={`rounded-md border p-1.5 shrink-0 ${isCurrent ? "border-primary/30 bg-primary/10" : "border-border bg-secondary"}`}>
                      <Icon size={13} className={isCurrent ? "text-primary" : "text-muted-foreground"} />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className={`text-sm font-medium truncate ${isCurrent ? "text-foreground" : ""}`}>
                        {item.label}
                      </span>
                      <span className="text-xs text-muted-foreground/70 truncate">
                        {item.description}
                      </span>
                    </div>
                    {isCurrent && <ArrowRight size={13} className="text-primary shrink-0" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <kbd className="rounded border border-border px-1 font-mono text-xs">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <kbd className="rounded border border-border px-1 font-mono text-xs">↵</kbd> open
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <kbd className="rounded border border-border px-1 font-mono text-xs">ESC</kbd> close
          </span>
        </div>
      </div>
    </>
  )
}
