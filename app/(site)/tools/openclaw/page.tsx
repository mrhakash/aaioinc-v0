"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Download,
  Star,
  Zap,
  Globe,
  Database,
  Mail,
  Code2,
  Bot,
  FileText,
  BarChart3,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

type AuditStatus = "verified" | "pending" | "flagged"
type SkillCategory = "Content" | "Data" | "Communication" | "Developer" | "Analytics" | "Search" | "Automation"

interface Skill {
  id: string
  name: string
  author: string
  version: string
  description: string
  category: SkillCategory
  auditStatus: AuditStatus
  auditDate: string
  auditChecks: number
  rating: number
  installs: number
  tags: string[]
  mcpCompatible: boolean
  featured?: boolean
}

// ── Skill directory data ──────────────────────────────────────────────────

const SKILLS: Skill[] = [
  {
    id: "web-search",
    name: "Web Search Pro",
    author: "AAIOINC",
    version: "2.1.0",
    description: "Multi-provider web search with result summarization. Supports Brave, SerpAPI, and Bing. Returns structured results with title, URL, and snippet.",
    category: "Search",
    auditStatus: "verified",
    auditDate: "2026-03-12",
    auditChecks: 18,
    rating: 4.9,
    installs: 3241,
    tags: ["search", "web", "research"],
    mcpCompatible: true,
    featured: true,
  },
  {
    id: "blog-publisher",
    name: "Blog Publisher",
    author: "AAIOINC",
    version: "1.4.2",
    description: "Publish formatted blog posts to WordPress, Ghost, and Webflow via API. Supports images, categories, tags, and scheduled publishing.",
    category: "Content",
    auditStatus: "verified",
    auditDate: "2026-02-28",
    auditChecks: 22,
    rating: 4.8,
    installs: 1876,
    tags: ["wordpress", "ghost", "publish", "content"],
    mcpCompatible: true,
    featured: true,
  },
  {
    id: "email-sender",
    name: "Email Sender",
    author: "AAIOINC",
    version: "1.2.0",
    description: "Send transactional and campaign emails via Resend, SendGrid, or Postmark. Supports HTML templates, tracking, and batch sending.",
    category: "Communication",
    auditStatus: "verified",
    auditDate: "2026-01-15",
    auditChecks: 20,
    rating: 4.7,
    installs: 1542,
    tags: ["email", "resend", "sendgrid", "notifications"],
    mcpCompatible: true,
  },
  {
    id: "supabase-query",
    name: "Supabase Query",
    author: "AAIOINC",
    version: "3.0.1",
    description: "Read and write to Supabase databases with natural language. Supports RLS-aware queries, real-time subscriptions, and storage operations.",
    category: "Data",
    auditStatus: "verified",
    auditDate: "2026-03-01",
    auditChecks: 24,
    rating: 4.9,
    installs: 2108,
    tags: ["database", "supabase", "sql", "storage"],
    mcpCompatible: true,
    featured: true,
  },
  {
    id: "code-executor",
    name: "Code Executor",
    author: "AAIOINC",
    version: "1.1.0",
    description: "Execute Python, JavaScript, and Bash code in an isolated sandbox. Returns stdout/stderr and supports file I/O for data processing tasks.",
    category: "Developer",
    auditStatus: "verified",
    auditDate: "2026-02-10",
    auditChecks: 28,
    rating: 4.6,
    installs: 987,
    tags: ["python", "javascript", "sandbox", "execution"],
    mcpCompatible: true,
  },
  {
    id: "ga4-reporter",
    name: "GA4 Reporter",
    author: "AAIOINC",
    version: "1.0.3",
    description: "Pull Google Analytics 4 reports by date range, dimensions, and metrics. Summarizes traffic, conversions, and audience data in plain language.",
    category: "Analytics",
    auditStatus: "verified",
    auditDate: "2026-01-22",
    auditChecks: 16,
    rating: 4.5,
    installs: 743,
    tags: ["analytics", "google", "reporting", "traffic"],
    mcpCompatible: true,
  },
  {
    id: "slack-notifier",
    name: "Slack Notifier",
    author: "Community",
    version: "2.0.0",
    description: "Send messages, create channels, and manage workflows in Slack. Supports blocks, attachments, threads, and reactions.",
    category: "Communication",
    auditStatus: "verified",
    auditDate: "2026-02-05",
    auditChecks: 19,
    rating: 4.7,
    installs: 2341,
    tags: ["slack", "notifications", "messaging"],
    mcpCompatible: true,
  },
  {
    id: "pdf-parser",
    name: "PDF Parser",
    author: "Community",
    version: "1.3.1",
    description: "Extract text, tables, and metadata from PDF files. Supports multi-page documents, OCR for scanned PDFs, and structured table extraction.",
    category: "Content",
    auditStatus: "verified",
    auditDate: "2026-01-30",
    auditChecks: 14,
    rating: 4.4,
    installs: 891,
    tags: ["pdf", "extraction", "ocr", "documents"],
    mcpCompatible: false,
  },
  {
    id: "scraper-pro",
    name: "Web Scraper Pro",
    author: "Community",
    version: "1.0.0",
    description: "Structured web scraping with CSS selectors and XPath. Supports JavaScript-rendered pages via headless browser, rate limiting, and proxy rotation.",
    category: "Data",
    auditStatus: "pending",
    auditDate: "2026-03-20",
    auditChecks: 8,
    rating: 4.2,
    installs: 412,
    tags: ["scraping", "web", "data-extraction"],
    mcpCompatible: true,
  },
  {
    id: "airtable-sync",
    name: "Airtable Sync",
    author: "Community",
    version: "0.9.2",
    description: "Read and write Airtable bases. Supports filtering, sorting, linked records, and formula fields. Batch operations supported.",
    category: "Data",
    auditStatus: "pending",
    auditDate: "2026-03-18",
    auditChecks: 7,
    rating: 3.9,
    installs: 289,
    tags: ["airtable", "database", "no-code"],
    mcpCompatible: false,
  },
  {
    id: "crypto-tracker",
    name: "Crypto Price Tracker",
    author: "Anonymous",
    version: "1.0.0",
    description: "Fetches cryptocurrency prices from multiple exchanges. Flagged for excessive permission requests and unclear data handling.",
    category: "Data",
    auditStatus: "flagged",
    auditDate: "2026-03-10",
    auditChecks: 12,
    rating: 2.1,
    installs: 156,
    tags: ["crypto", "prices", "finance"],
    mcpCompatible: false,
  },
]

// ── Config ─────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<SkillCategory, typeof Search> = {
  Content: FileText,
  Data: Database,
  Communication: Mail,
  Developer: Code2,
  Analytics: BarChart3,
  Search: Globe,
  Automation: Bot,
}

const AUDIT_CONFIG: Record<AuditStatus, {
  icon: typeof ShieldCheck
  label: string
  color: string
  bg: string
  border: string
  badgeColor: string
}> = {
  verified: {
    icon: ShieldCheck,
    label: "Verified",
    color: "text-success",
    bg: "bg-success/8",
    border: "border-success/30",
    badgeColor: "text-success bg-success/10 border-success/30",
  },
  pending: {
    icon: ShieldAlert,
    label: "Audit Pending",
    color: "text-warning",
    bg: "bg-warning/8",
    border: "border-warning/30",
    badgeColor: "text-warning bg-warning/10 border-warning/30",
  },
  flagged: {
    icon: ShieldX,
    label: "Flagged",
    color: "text-red-400",
    bg: "bg-red-500/8",
    border: "border-red-500/30",
    badgeColor: "text-red-400 bg-red-500/10 border-red-500/30",
  },
}

const CATEGORIES: SkillCategory[] = ["Content", "Data", "Communication", "Developer", "Analytics", "Search", "Automation"]

// ── Component ──────────────────────────────────────────────────────────────

export default function OpenClawSkillFinderPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "All">("All")
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "All">("All")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const filtered = useMemo(() => {
    return SKILLS.filter((skill) => {
      const matchesSearch =
        !search ||
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        skill.description.toLowerCase().includes(search.toLowerCase()) ||
        skill.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = categoryFilter === "All" || skill.category === categoryFilter
      const matchesStatus = statusFilter === "All" || skill.auditStatus === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [search, categoryFilter, statusFilter])

  return (
    <div className="min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-6xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">OpenClaw Skill Finder</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 px-2.5 py-0.5 text-xs font-mono font-medium">Agentic AI</span>
            <span className="rounded-full border border-success/30 bg-success/10 text-success px-2.5 py-0.5 text-xs font-mono font-medium flex items-center gap-1.5">
              <ShieldCheck size={10} /> All audited before listing
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">OpenClaw Skill Finder</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Vetted, security-audited OpenClaw skills for your AI agent. Every skill in this directory has passed a mandatory security review before listing — no malicious packages, no unverified authors.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { label: "Verified skills", value: SKILLS.filter(s => s.auditStatus === "verified").length.toString() },
              { label: "Security checks per skill", value: "14–28" },
              { label: "MCP-compatible", value: SKILLS.filter(s => s.mcpCompatible).length.toString() },
              { label: "Avg audit time", value: "48 hrs" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-xl font-bold text-primary">{value}</span>
                <span className="text-xs text-muted-foreground font-mono">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills by name, tag, or description..."
              className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("All")}
              className={`rounded-full border px-3 py-1 text-xs font-mono transition-all ${categoryFilter === "All" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
            >
              All categories
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-mono flex items-center gap-1.5 transition-all ${categoryFilter === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                >
                  <Icon size={10} />{cat}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            {(["All", "verified", "pending", "flagged"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full border px-3 py-1 text-xs font-mono capitalize transition-all ${statusFilter === status ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
              >
                {status === "All" ? "All status" : status}
              </button>
            ))}
          </div>

          <p className="text-xs font-mono text-muted-foreground">{filtered.length} skill{filtered.length !== 1 ? "s" : ""} found</p>
        </div>

        {/* Skill grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => {
            const auditCfg = AUDIT_CONFIG[skill.auditStatus]
            const AuditIcon = auditCfg.icon
            const CatIcon = CATEGORY_ICONS[skill.category]
            return (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`text-left rounded-xl border bg-card p-5 flex flex-col gap-3 hover:border-primary/40 transition-all ${skill.featured ? "border-primary/25 bg-primary/3" : "border-border"}`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      {skill.featured && <Zap size={11} className="text-primary shrink-0" />}
                      <p className="text-sm font-bold text-foreground leading-tight">{skill.name}</p>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground">by {skill.author} · v{skill.version}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-px text-[9px] font-mono font-bold uppercase flex items-center gap-1 ${auditCfg.badgeColor}`}>
                    <AuditIcon size={8} />{auditCfg.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{skill.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1"><CatIcon size={10} />{skill.category}</span>
                  <span className="flex items-center gap-1"><Star size={9} className="text-warning" />{skill.rating}</span>
                  <span>{skill.installs.toLocaleString()} installs</span>
                  {skill.mcpCompatible && <span className="text-primary">MCP</span>}
                </div>

                {/* Audit checks */}
                <div className={`rounded-md border px-2.5 py-1.5 ${auditCfg.bg} ${auditCfg.border}`}>
                  <p className={`text-[9px] font-mono font-bold uppercase ${auditCfg.color}`}>
                    {auditCfg.label} · {skill.auditChecks} security checks · {skill.auditDate}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-foreground font-medium">No skills match your search</p>
            <p className="text-xs text-muted-foreground">Try adjusting your filters or search terms</p>
            <button onClick={() => { setSearch(""); setCategoryFilter("All"); setStatusFilter("All") }} className="text-xs text-primary hover:underline mt-1">Clear all filters</button>
          </div>
        )}

        {/* Submit skill CTA */}
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="font-semibold text-foreground">Want to submit your own skill?</p>
            <p className="text-sm text-muted-foreground mt-1">All submissions go through a mandatory security audit before being listed. Average review time: 48 hours.</p>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap shrink-0">
            Submit a skill <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Skill detail modal */}
      {selectedSkill && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedSkill(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const skill = selectedSkill
              const auditCfg = AUDIT_CONFIG[skill.auditStatus]
              const AuditIcon = auditCfg.icon
              return (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {skill.featured && <Zap size={13} className="text-primary" />}
                        <p className="text-lg font-bold text-foreground">{skill.name}</p>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">by {skill.author} · v{skill.version}</p>
                    </div>
                    <button onClick={() => setSelectedSkill(null)} className="text-muted-foreground hover:text-foreground text-xs font-mono shrink-0">close</button>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>

                  {/* Audit detail */}
                  <div className={`rounded-lg border p-4 flex flex-col gap-2 ${auditCfg.bg} ${auditCfg.border}`}>
                    <div className="flex items-center gap-2">
                      <AuditIcon size={15} className={auditCfg.color} />
                      <p className={`text-sm font-semibold ${auditCfg.color}`}>{auditCfg.label}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{skill.auditChecks} security checks completed on {skill.auditDate}</p>
                    {skill.auditStatus === "flagged" && (
                      <p className="text-xs text-red-400 leading-relaxed">This skill has been flagged for excessive permission requests and unclear data handling. We recommend avoiding installation until the audit is resolved.</p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <span key={tag} className="rounded border border-border bg-secondary px-2.5 py-1 text-[10px] font-mono text-muted-foreground">{tag}</span>
                    ))}
                    {skill.mcpCompatible && (
                      <span className="rounded border border-primary/30 bg-primary/8 px-2.5 py-1 text-[10px] font-mono text-primary">MCP compatible</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Rating", value: `${skill.rating}/5` },
                      { label: "Installs", value: skill.installs.toLocaleString() },
                      { label: "Security checks", value: skill.auditChecks.toString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-lg border border-border p-3 flex flex-col gap-0.5">
                        <p className="text-[9px] font-mono text-muted-foreground uppercase">{label}</p>
                        <p className="text-sm font-bold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  {skill.auditStatus !== "flagged" && (
                    <div className="flex gap-3">
                      <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                        <Download size={14} /> Install skill
                      </button>
                      <Link href="/services/openclaw-setup" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors">
                        Managed setup <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
