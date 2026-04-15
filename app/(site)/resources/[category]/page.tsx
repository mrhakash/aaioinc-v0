import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import {
  RESOURCE_CATEGORIES, RESOURCE_CATEGORY_SLUGS, getCategoryBySlug,
} from "@/lib/resources-data"

const tierStyles: Record<string, string> = {
  Free:     "text-primary bg-primary/10 border-primary/30",
  Freemium: "text-sky-400 bg-sky-500/10 border-sky-500/25",
  Paid:     "text-amber-400 bg-amber-500/10 border-amber-500/25",
}

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return RESOURCE_CATEGORY_SLUGS.map((c) => ({ category: c }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return {}
  return {
    title: `${cat.name} Resources — AAIOINC`,
    description: cat.description,
  }
}

export default async function ResourceCategoryPage({ params }: Props) {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const otherCategories = RESOURCE_CATEGORIES.filter((c) => c.slug !== category).slice(0, 6)

  const freeCount      = cat.resources.filter((r) => r.tier === "Free").length
  const freemiumCount  = cat.resources.filter((r) => r.tier === "Freemium").length
  const paidCount      = cat.resources.filter((r) => r.tier === "Paid").length

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link href="/resources" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Resources
          </Link>
          <span>/</span>
          <span className="text-foreground">{cat.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{cat.name}</h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{cat.description}</p>
            <div className="flex items-center gap-3 flex-wrap font-mono text-xs text-muted-foreground">
              <span>{cat.resources.length} resources</span>
              <span>&middot;</span>
              <span className="text-primary">{freeCount} free</span>
              {freemiumCount > 0 && <><span>&middot;</span><span className="text-sky-400">{freemiumCount} freemium</span></>}
              {paidCount > 0 && <><span>&middot;</span><span className="text-amber-400">{paidCount} paid</span></>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {cat.resources.map((res) => {
              const isExternal = res.href.startsWith("http")
              return (
                <Link
                  key={res.id}
                  href={res.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {res.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{res.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {res.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-medium ${tierStyles[res.tier]}`}>
                      {res.tier}
                    </span>
                    {isExternal
                      ? <ExternalLink size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      : <ArrowRight size={13} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    }
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
            <p className="font-mono text-xs font-semibold text-foreground tracking-widest uppercase">Other Categories</p>
            <ul className="flex flex-col gap-2">
              {otherCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/resources/${c.slug}`}
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {c.name}
                    <span className="font-mono text-xs text-muted-foreground/60">{c.resources.length}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/resources" className="font-mono text-xs text-primary hover:underline">
                  All categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col gap-3">
            <p className="font-semibold text-foreground text-sm">Submit a resource</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Know a guide, tool, or template that belongs here? Submit it for review and help the community.
            </p>
            <Link href="/resources/submit" className="font-mono text-xs text-primary hover:underline">
              Submit a resource &rarr;
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
