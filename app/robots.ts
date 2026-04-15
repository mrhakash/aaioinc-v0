import type { MetadataRoute } from "next"

const BASE = "https://aaioinc.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — allow everything except private/auth routes
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/auth/",
          "/checkout/",
        ],
      },

      // ── AI training & retrieval bots — explicitly welcome ──────────────────
      // Allowing AI bots is a deliberate GEO strategy: being indexed by AI
      // search engines (Perplexity, ChatGPT, Bing Copilot) drives visibility
      // in AI-generated answers.
      {
        userAgent: "GPTBot",          // OpenAI / ChatGPT
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "ClaudeBot",       // Anthropic
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "PerplexityBot",   // Perplexity
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "Applebot",        // Apple Intelligence / Siri
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "Bytespider",      // ByteDance / TikTok
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "cohere-ai",       // Cohere
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
      {
        userAgent: "Google-Extended", // Google Gemini training
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/checkout/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
