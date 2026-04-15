import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar, User, ChevronRight, ExternalLink } from "lucide-react"
import { getPillarPageBySlug, pillarPages, type ContentSection } from "@/lib/pillar-pages"
import { NewsletterSignup } from "@/components/newsletter-signup"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return pillarPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getPillarPageBySlug(slug)
  if (!page) return { title: "Article Not Found" }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.targetKeywords,
    authors: [{ name: page.author }],
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
      url: `https://aaioinc.com/blog/${page.slug}`,
      publishedTime: page.publishDate,
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
    alternates: { canonical: `https://aaioinc.com/blog/${page.slug}` },
  }
}

const categoryColors: Record<string, string> = {
  GEO: "text-primary border-primary/30 bg-primary/10",
  "Agentic AI": "text-sky-400 border-sky-500/25 bg-sky-500/10",
  Content: "text-amber-400 border-amber-500/25 bg-amber-500/10",
  Developer: "text-violet-400 border-violet-500/25 bg-violet-500/10",
  SEO: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
}

function ArticleSection({ section }: { section: ContentSection }) {
  const paragraphs = section.body.split("\n\n").filter(Boolean)

  return (
    <section id={section.id} className="scroll-mt-24">
      {section.level === 2 ? (
        <h2 className="text-2xl font-bold text-foreground mb-5 leading-tight">{section.title}</h2>
      ) : (
        <h3 className="text-xl font-semibold text-foreground mb-4 leading-tight">{section.title}</h3>
      )}

      <div className="flex flex-col gap-4">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed text-[15px]">
            {para}
          </p>
        ))}

        {section.callout && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 my-2">
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {section.callout}
            </p>
          </div>
        )}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="flex flex-col gap-2.5 pl-0">
            {section.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {section.code && (
          <div className="rounded-lg border border-border bg-secondary overflow-x-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/80">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground ml-2">code</span>
            </div>
            <pre className="p-4 text-[12px] font-mono text-foreground/85 leading-relaxed overflow-x-auto whitespace-pre">
              <code>{section.code}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params
  const page = getPillarPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    author: {
      "@type": "Organization",
      name: "AAIOINC",
      url: "https://aaioinc.com",
    },
    publisher: {
      "@type": "Organization",
      name: "AAIOINC",
      logo: { "@type": "ImageObject", url: "https://aaioinc.com/logo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://aaioinc.com/blog/${page.slug}`,
    },
    keywords: page.targetKeywords.join(", "),
    wordCount: page.wordCount,
    datePublished: page.publishDate,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: "https://aaioinc.com" },
      { "@type": "ListItem", position: 2, name: "Blog",  item: "https://aaioinc.com/blog" },
      { "@type": "ListItem", position: 3, name: page.title, item: `https://aaioinc.com/blog/${page.slug}` },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.tableOfContents.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: page.sections.find((s) => s.id === item.id)?.body.split("\n\n")[0] ??
          `This section covers ${item.title.toLowerCase()} in detail.`,
      },
    })),
  }

  return (
    <>
      <Script id="article-schema"    type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="faq-schema"        type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <nav className="px-6 py-4 border-b border-border" aria-label="Breadcrumb">
          <div className="mx-auto max-w-4xl flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-foreground truncate max-w-[220px]">{page.title}</span>
          </div>
        </nav>

        {/* Article header */}
        <header className="px-6 py-16 border-b border-border">
          <div className="mx-auto max-w-4xl flex flex-col gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`rounded-full border px-3 py-1 text-xs font-mono font-medium ${categoryColors[page.category]}`}>
                {page.category}
              </span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
                Pillar Guide
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
              {page.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {page.excerpt}
            </p>

            {/* TL;DR box for GEO */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
              <p className="text-xs font-mono text-primary uppercase tracking-wider mb-2">TL;DR</p>
              <p className="text-foreground leading-relaxed text-sm">{page.excerpt}</p>
            </div>

            <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock size={14} aria-hidden="true" />
                <span className="font-mono">{page.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} aria-hidden="true" />
                <time dateTime={page.publishDate} className="font-mono">{page.publishDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} aria-hidden="true" />
                <span className="font-mono">{page.author}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-12">
          <div className="mx-auto max-w-4xl grid lg:grid-cols-[1fr_260px] gap-12">
            {/* Main article content */}
            <article className="flex flex-col gap-10">
              {page.sections.map((section) => (
                <ArticleSection key={section.id} section={section} />
              ))}

              {/* Related tools */}
              {page.relatedTools.length > 0 && (
                <section className="mt-4 pt-8 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Related Free Tools</h2>
                  <div className="flex flex-wrap gap-3">
                    {page.relatedTools.map((tool) => (
                      <Link
                        key={tool}
                        href={`/tools/${tool}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {tool.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        <ExternalLink size={11} aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-5">
                {/* TOC */}
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                    On this page
                  </p>
                  <nav className="flex flex-col gap-2" aria-label="Table of contents">
                    {page.tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors leading-snug"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Share */}
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                    Share this guide
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(page.title)}&url=${encodeURIComponent(`https://aaioinc.com/blog/${page.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      X / Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://aaioinc.com/blog/${page.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* Newsletter CTA */}
                <NewsletterSignup variant="card" />

                {/* Service CTA */}
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs text-muted-foreground mb-1 font-mono">Need expert help?</p>
                  <p className="text-sm font-medium text-foreground mb-3 leading-snug">
                    Our team implements this for you — start to finish.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center rounded-md border border-primary/50 text-primary px-4 py-2 text-sm font-semibold hover:bg-primary/10 transition-colors"
                  >
                    Get a quote
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Back link */}
        <div className="px-6 py-8 border-t border-border">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
