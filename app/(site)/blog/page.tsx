import type { Metadata } from "next"
import { BlogClient } from "./client"

export const metadata: Metadata = {
  title: "Blog — AAIOINC | GEO, Agentic AI & SEO Guides",
  description:
    "Practical guides, case studies, and analysis on GEO, agentic AI, MCP, and AI content from the AAIOINC team. No fluff — actionable insights for AI practitioners.",
  alternates: { canonical: "https://aaioinc.com/blog" },
  openGraph: {
    title: "Blog — AAIOINC | GEO, Agentic AI & SEO Guides",
    description: "Practical guides on GEO, agentic AI, MCP, and AI content.",
    url: "https://aaioinc.com/blog",
    type: "website",
  },
}

export default function BlogPage() {
  return <BlogClient />
}
