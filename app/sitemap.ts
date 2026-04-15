import type { MetadataRoute } from "next"
import { pillarPages } from "@/lib/pillar-pages"
import { services } from "@/lib/services-data"
import { RESOURCE_CATEGORIES } from "@/lib/resources-data"

const BASE = "https://aaioinc.com"

// Static routes with their priorities and change frequencies
const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/tools`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
  { url: `${BASE}/blog`,           lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/services`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/pricing`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/resources`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
  { url: `${BASE}/prompts`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
  { url: `${BASE}/geo`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/geo/score`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/geo/overview-checker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },

  // Tool pages
  { url: `${BASE}/tools/geo-checker`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/tools/overview-checker`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/tools/humanizer`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/tools/niche-scorer`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/tools/llm-calculator`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/tools/mcp-config-builder`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/tools/workflow-visualizer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },

  // Auth (low priority, no-index via robots)
  { url: `${BASE}/auth/login`,    lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/auth/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },

  // Submit form
  { url: `${BASE}/resources/submit`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Blog pillar pages
  const blogRoutes: MetadataRoute.Sitemap = pillarPages.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }))

  // Service pages
  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  // Resource category pages
  const resourceRoutes: MetadataRoute.Sitemap = RESOURCE_CATEGORIES.map((c) => ({
    url: `${BASE}/resources/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }))

  return [...staticRoutes, ...blogRoutes, ...serviceRoutes, ...resourceRoutes]
}
