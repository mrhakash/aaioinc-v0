"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu, X, ChevronDown,
  Globe, Eye, Wrench, Library, FileText, Search, DollarSign, Bot,
  Code2, Cpu, PenTool, Target, Compass, Server,
  Sun, Moon, Command,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const servicesItems = [
  { icon: Cpu,      label: "OpenClaw Setup",     description: "Production-grade MCP agent deployment", href: "/services/openclaw-setup", badge: "Popular" },
  { icon: PenTool,  label: "AI Blogging",        description: "Automated content pipelines at scale",  href: "/services/ai-blogging",    badge: null },
  { icon: Target,   label: "AI SEO Service",     description: "GEO-optimized content + technical SEO", href: "/services/ai-seo",         badge: null },
  { icon: FileText, label: "AI Content Service", description: "Human-quality AI content, on-demand",   href: "/services/ai-content",     badge: null },
  { icon: Compass,  label: "Niche Research",     description: "Data-driven niche and keyword strategy", href: "/services/niche-research", badge: null },
  { icon: Server,   label: "MCP Skills Dev",     description: "Custom OpenClaw skill builds",           href: "/services/mcp-skills",     badge: null },
]

const toolsItems = [
  { icon: Globe,     label: "GEO Score Analyzer",  tier: "Free",        href: "/tools/geo-checker" },
  { icon: Eye,       label: "AI Overview Checker", tier: "Freemium",    href: "/tools/overview-checker" },
  { icon: Wrench,    label: "MCP Config Builder",  tier: "Free",        href: "/tools/mcp-config-builder" },
  { icon: Library,   label: "Prompt Library",      tier: "Freemium",    href: "/prompts" },
  { icon: FileText,  label: "Content Humanizer",   tier: "Free",        href: "/tools/humanizer" },
  { icon: Search,    label: "Niche Scorer",        tier: "Free",        href: "/tools/niche-scorer" },
  { icon: DollarSign,label: "LLM Cost Calculator", tier: "Free",        href: "/tools/llm-calculator" },
  { icon: Bot,       label: "OpenClaw Skills",     tier: "Free",        href: "/tools/openclaw" },
]

const resourcesItems = {
  "GEO Hub": [
    { label: "GEO Hub Landing",      href: "/geo" },
    { label: "GEO Score Analyzer",   href: "/geo/score" },
    { label: "AI Overview Checker",  href: "/geo/overview-checker" },
  ],
  "Prompt Library": [
    { label: "Browse Prompts",  href: "/prompts" },
    { label: "Submit a Prompt", href: "/resources/submit" },
  ],
  "Directory": [
    { label: "MCP Servers",       href: "/resources/mcp" },
    { label: "AI Agents",         href: "/resources/agents" },
    { label: "Dev Tools",         href: "/resources/developer-tools" },
    { label: "Research & Reports",href: "/resources/research" },
    { label: "Browse All",        href: "/resources" },
  ],
  "Blog": [
    { label: "All Posts",     href: "/blog" },
    { label: "Pillar Guides", href: "/blog#pillar-guides" },
  ],
}

const tierStyles: Record<string, string> = {
  Free:          "text-primary bg-primary/10 border-primary/25",
  Freemium:      "text-sky-600 bg-sky-500/10 border-sky-500/25",
  Paid:          "text-amber-600 bg-amber-500/10 border-amber-500/25",
  "Coming Soon": "text-muted-foreground bg-muted border-border",
}

type MenuKey = "services" | "tools" | "resources" | null

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export function Navbar() {
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [activeMenu, setActiveMenu]         = useState<MenuKey>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled]             = useState(false)
  const { theme, toggleTheme } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Close mega-menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* Close on route change */
  useEffect(() => {
    setActiveMenu(null)
    setMobileOpen(false)
  }, [pathname])

  /* Keyboard: Escape closes menus */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActiveMenu(null); setMobileOpen(false) }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  // Theme state and toggle come from ThemeProvider via useTheme()

  /* Command palette */
  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))
  }

  const toggle = (key: MenuKey) => setActiveMenu(prev => prev === key ? null : key)

  return (
    <header
      ref={menuRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-[0_1px_16px_rgba(0,0,0,0.12)]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-14">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group" aria-label="AAIOINC home">
          <span className="font-mono text-sm font-bold text-primary tracking-[0.18em] uppercase transition-opacity group-hover:opacity-80">AAIO</span>
          <span className="font-mono text-sm text-muted-foreground tracking-[0.18em]">INC</span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
          {(["services", "tools", "resources"] as MenuKey[]).map((key) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              aria-expanded={activeMenu === key}
              aria-haspopup="true"
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                activeMenu === key
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {key === "tools" ? "Free Tools" : key.charAt(0).toUpperCase() + key.slice(1)}
              <ChevronDown
                size={13}
                className={cn("transition-transform duration-200", activeMenu === key && "rotate-180")}
              />
            </button>
          ))}
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* ── Right controls ── */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search */}
          <button
            onClick={openSearch}
            aria-label="Open command palette (Ctrl+K)"
            className="flex items-center gap-2 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            <Command size={11} />
            <span>Search</span>
            <kbd className="font-mono text-[10px] opacity-50 ml-0.5">K</kbd>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

          <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="btn-press rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground"
          >
            Get Started Free
          </Link>
        </div>

        {/* ── Mobile: right side ── */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MEGA MENUS
      ════════════════════════════════════════ */}

      {/* Services */}
      {activeMenu === "services" && (
        <div
          role="dialog"
          aria-label="Services menu"
          className="hidden md:block absolute top-full left-0 right-0 border-b border-border bg-background shadow-2xl"
        >
          <div className="mx-auto max-w-7xl px-6 py-6">
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-4">Managed Services</p>
            <div className="grid grid-cols-3 gap-3">
              {servicesItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div className="rounded-lg border border-border bg-secondary p-2 shrink-0 group-hover:border-primary/30 transition-colors">
                      <Icon size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                        {item.badge && (
                          <span className="rounded-full bg-primary/10 border border-primary/25 px-1.5 py-px text-[9px] font-mono text-primary">{item.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Managed services from $500 to $15,000 — strategy call included</p>
              <Link href="/services" className="text-xs font-mono text-primary hover:underline underline-offset-4">View all services &rarr;</Link>
            </div>
          </div>
        </div>
      )}

      {/* Tools */}
      {activeMenu === "tools" && (
        <div
          role="dialog"
          aria-label="Free Tools menu"
          className="hidden md:block absolute top-full left-0 right-0 border-b border-border bg-background shadow-2xl"
        >
          <div className="mx-auto max-w-7xl px-6 py-6">
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-4">Free AI Tools</p>
            <div className="grid grid-cols-4 gap-3">
              {toolsItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                      <Icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{item.label}</span>
                      <span className={cn("rounded-full border px-1.5 py-px text-[9px] font-mono w-fit", tierStyles[item.tier])}>{item.tier}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">All core tools permanently free. No account required.</p>
              <Link href="/tools" className="text-xs font-mono text-primary hover:underline underline-offset-4">Browse all 14 tools &rarr;</Link>
            </div>
          </div>
        </div>
      )}

      {/* Resources */}
      {activeMenu === "resources" && (
        <div
          role="dialog"
          aria-label="Resources menu"
          className="hidden md:block absolute top-full left-0 right-0 border-b border-border bg-background shadow-2xl"
        >
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="grid grid-cols-4 gap-8">
              {Object.entries(resourcesItems).map(([group, links]) => (
                <div key={group}>
                  <p className="font-mono text-[10px] font-semibold text-foreground tracking-widest uppercase mb-3">{group}</p>
                  <ul className="flex flex-col gap-2" role="list">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MOBILE MENU
      ════════════════════════════════════════ */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden border-t border-border bg-background overflow-y-auto transition-all duration-300 ease-in-out",
          mobileOpen ? "max-h-[calc(100dvh-3.5rem)] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col px-5 py-4 gap-0.5" aria-label="Mobile navigation">
          {/* Services */}
          <button
            onClick={() => setMobileExpanded(mobileExpanded === "services" ? null : "services")}
            aria-expanded={mobileExpanded === "services"}
            className="flex items-center justify-between w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Services
            <ChevronDown size={13} className={cn("transition-transform duration-200", mobileExpanded === "services" && "rotate-180")} />
          </button>
          <div className={cn("overflow-hidden transition-all duration-200", mobileExpanded === "services" ? "max-h-96" : "max-h-0")}>
            <div className="pl-4 pb-3 flex flex-col gap-2.5">
              {servicesItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <button
            onClick={() => setMobileExpanded(mobileExpanded === "tools" ? null : "tools")}
            aria-expanded={mobileExpanded === "tools"}
            className="flex items-center justify-between w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Free Tools
            <ChevronDown size={13} className={cn("transition-transform duration-200", mobileExpanded === "tools" && "rotate-180")} />
          </button>
          <div className={cn("overflow-hidden transition-all duration-200", mobileExpanded === "tools" ? "max-h-96" : "max-h-0")}>
            <div className="pl-4 pb-3 flex flex-col gap-2.5">
              {toolsItems.map((item) => (
                <div key={item.href} className="flex items-center gap-2">
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex-1">
                    {item.label}
                  </Link>
                  <span className={cn("rounded-full border px-1.5 py-px text-[9px] font-mono", tierStyles[item.tier])}>{item.tier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <button
            onClick={() => setMobileExpanded(mobileExpanded === "resources" ? null : "resources")}
            aria-expanded={mobileExpanded === "resources"}
            className="flex items-center justify-between w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Resources
            <ChevronDown size={13} className={cn("transition-transform duration-200", mobileExpanded === "resources" && "rotate-180")} />
          </button>
          <div className={cn("overflow-hidden transition-all duration-200", mobileExpanded === "resources" ? "max-h-96" : "max-h-0")}>
            <div className="pl-4 pb-3 flex flex-col gap-2.5">
              {Object.values(resourcesItems).flat().map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/pricing" className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>

          <div className="pt-4 mt-2 flex flex-col gap-3 border-t border-border">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="btn-press rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground text-center"
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
