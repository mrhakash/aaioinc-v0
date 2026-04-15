import Script from "next/script"

// ─── Article Schema ──────────────────────────────────────────────────────────

interface ArticleStructuredDataProps {
  slug: string
  title: string
  description: string
  publishDate: string
  author?: string
  category?: string
  wordCount?: string
  imageUrl?: string
}

export function ArticleStructuredData({
  slug,
  title,
  description,
  publishDate,
  author = "AAIOINC Editorial",
  category,
  wordCount,
  imageUrl = "https://aaioinc.com/og-default.jpg",
}: ArticleStructuredDataProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://aaioinc.com",
    },
    publisher: {
      "@type": "Organization",
      name: "AAIOINC",
      logo: {
        "@type": "ImageObject",
        url: "https://aaioinc.com/logo.png",
      },
    },
    datePublished: new Date(publishDate).toISOString(),
    dateModified: new Date(publishDate).toISOString(),
    image: imageUrl,
    url: `https://aaioinc.com/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://aaioinc.com/blog/${slug}`,
    },
    articleSection: category,
    wordCount: wordCount ? parseInt(wordCount.replace(/,/g, ""), 10) : undefined,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Blog",
      "@id": "https://aaioinc.com/blog",
      name: "AAIOINC Blog",
      publisher: {
        "@type": "Organization",
        name: "AAIOINC",
      },
    },
  }

  return (
    <Script
      id={`article-schema-${slug}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  )
}

// ─── Breadcrumb Schema ────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `https://aaioinc.com${item.href}`,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}

// ─── Service Page Schema ──────────────────────────────────────────────────────

interface ServiceStructuredDataProps {
  slug: string
  name: string
  description: string
  priceFrom?: string
}

export function ServiceStructuredData({
  slug,
  name,
  description,
  priceFrom,
}: ServiceStructuredDataProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `https://aaioinc.com/services/${slug}`,
    provider: {
      "@type": "Organization",
      name: "AAIOINC",
      url: "https://aaioinc.com",
    },
    ...(priceFrom && {
      offers: {
        "@type": "Offer",
        price: priceFrom,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
  }

  return (
    <Script
      id={`service-schema-${slug}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  )
}

// ─── Home / Organization Schema ───────────────────────────────────────────────

export function HomeStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AAIOINC",
    alternateName: "Agentic AI Optimization Inc",
    url: "https://aaioinc.com",
    logo: "https://aaioinc.com/logo.png",
    description:
      "One platform for every AI tool. Free GEO optimizer, content humanizer, niche research, LLM cost comparison, and managed agentic AI services.",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/aaioinc",
      "https://linkedin.com/company/aaioinc",
      "https://github.com/aaioinc",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@aaioinc.com",
      contactType: "customer service",
      availableLanguage: "English",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "99",
      offerCount: "4",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AAIOINC",
    url: "https://aaioinc.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://aaioinc.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AAIOINC Platform",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Agentic AI Optimization?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agentic AI Optimization is the practice of configuring AI systems to perform multi-step tasks autonomously, make decisions based on context, and continuously improve outputs.",
        },
      },
      {
        "@type": "Question",
        name: "Are the free tools really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All 14 core tools are permanently free with daily usage limits. No credit card or account required. Pro users get unlimited access.",
        },
      },
      {
        "@type": "Question",
        name: "What is GEO (Generative Engine Optimization)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GEO optimizes content for AI visibility — ensuring your content appears in AI-generated answers from ChatGPT, Perplexity, Claude, and Google AI Overviews.",
        },
      },
      {
        "@type": "Question",
        name: "What AI models power your tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We use OpenAI GPT-4o, Anthropic Claude 3.5, and specialized fine-tuned models. All API calls use zero-retention endpoints for data privacy.",
        },
      },
    ],
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="software-app-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
