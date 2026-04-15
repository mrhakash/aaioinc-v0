export type ToolTier = "Free" | "Freemium" | "Paid" | "Coming Soon"

export interface FAQ {
  question: string
  answer: string
}

export interface ToolData {
  slug: string
  title: string
  tagline: string
  description: string
  seoTitle?: string
  tier: ToolTier
  limit?: string
  category: string
  tags: string[]
  ctaLabel: string
  placeholder?: string
  inputType?: "textarea" | "text" | "sliders" | "quiz" | "none"
  benefits: string[]
  faqs: FAQ[]
  /** Shown after 3rd use as inline banner */
  upsellMessage?: string
}

export const tools: ToolData[] = [
  // ── P0 Tools ──────────────────────────────────────────────────────────
  {
    slug: "humanizer",
    title: "AI Content Humanizer",
    tagline: "Bypass all detectors — see the full transformation diff.",
    seoTitle: "Free AI Content Humanizer — Bypass All Detectors | AAIOINC",
    description:
      "Paste AI-generated content and get a humanized version that passes Originality.ai, GPTZero, and Turnitin. Unlike other tools, AAIO shows you the complete before/after diff so you can verify every change — not just trust the output.",
    tier: "Free",
    limit: "5 docs/day free · Unlimited on Pro",
    category: "Content & SEO",
    tags: ["Content", "AI Detection", "Humanizer"],
    ctaLabel: "Humanize Content",
    inputType: "textarea",
    placeholder: "Paste your AI-generated content here (max 5,000 chars on Free)...",
    benefits: [
      "Full transformation diff — every changed word is highlighted",
      "AI detection score before and after, side-by-side",
      "Targets Originality.ai, GPTZero, and Turnitin patterns",
      "Preserves SEO keywords and heading structure",
      "5 docs/day free · 25,000 chars/doc on Pro",
    ],
    upsellMessage: "Loving the humanizer? Go Pro for unlimited runs + 25,000 char limit + API access.",
    faqs: [
      { question: "Which AI detectors does this bypass?", answer: "We target Originality.ai, GPTZero, and Turnitin. Our humanization patterns specifically address the linguistic fingerprints each detector uses. Most outputs score 90+ on Originality.ai." },
      { question: "Does it change my meaning or keywords?", answer: "No. The humanization pass preserves semantic meaning, target keywords, and heading structure. Only surface-level phrasing patterns are modified." },
      { question: "What's the character limit?", answer: "Free accounts: 5,000 characters per run, 5 runs per day. Pro accounts: 25,000 characters per run, unlimited runs. Both are tracked per browser session + IP fingerprint." },
      { question: "Is my content stored?", answer: "No. Content is processed in-memory and not persisted. We do not train on user submissions or store text after a session ends." },
      { question: "Will Google penalize humanized AI content?", answer: "Google's guidelines focus on quality and helpfulness, not origin. Our humanization pass maintains readability and natural sentence variation, which aligns with quality signals." },
    ],
  },
  {
    slug: "geo-checker",
    title: "GEO Visibility Checker",
    tagline: "See if your brand appears in AI-generated answers.",
    seoTitle: "Free GEO Visibility Checker — Brand Citations in AI Overviews | AAIOINC",
    description:
      "Enter a domain or brand name and see exactly where it appears in ChatGPT, Perplexity, Claude, and Gemini responses. Get a 0–100 visibility score, platform-by-platform citation breakdown, sentiment analysis, and recommended actions.",
    tier: "Freemium",
    limit: "3 checks/day free · 50/day on Pro · Unlimited on Agency",
    category: "GEO & AI Search",
    tags: ["GEO", "Brand", "AI Search"],
    ctaLabel: "Check Visibility",
    inputType: "text",
    placeholder: "Enter your domain (e.g. example.com) or brand name...",
    benefits: [
      "Checks ChatGPT, Perplexity, Claude, and Gemini simultaneously",
      "0–100 brand visibility score with platform breakdown",
      "Sentiment classification: positive / neutral / negative",
      "Competing brands mentioned alongside yours",
      "Recommended actions to improve citation rate",
      "Historical tracking and competitor comparison (Pro)",
    ],
    upsellMessage: "Track your GEO visibility weekly and compare against competitors with Pro.",
    faqs: [
      { question: "How does the visibility score work?", answer: "We query each AI platform with brand-related prompts and analyze responses for mentions, citations, and context. The 0–100 score reflects frequency, prominence, and sentiment across platforms." },
      { question: "Which AI platforms do you check?", answer: "ChatGPT (GPT-4o), Perplexity, Claude (Sonnet), and Gemini. We rotate through multiple query types per platform to get a representative sample." },
      { question: "How often should I check?", answer: "Weekly checks give the best trend data. AI model training cycles mean visibility can shift significantly between updates. Pro accounts get automated weekly reports." },
      { question: "What if no mentions are found?", answer: "A zero score is actionable data. We provide a specific action plan: schema markup, authoritative content signals, citation-building targets, and GEO-optimized content recommendations." },
      { question: "Can I check competitor brands?", answer: "Yes. Pro accounts can run competitor checks and see side-by-side visibility comparisons. Agency accounts get white-label reports for client delivery." },
    ],
  },
  {
    slug: "niche-scorer",
    title: "Niche Profitability Scorer",
    tagline: "Radar chart viability score for any niche keyword.",
    seoTitle: "Free Niche Profitability Scorer — Viability Score + Radar Chart | AAIOINC",
    description:
      "Enter any niche keyword and get an animated radar chart scoring across 6 dimensions: competition, search volume, monetization potential, AI visibility opportunity, content gap, and trend direction. Plus an A–F overall viability grade.",
    tier: "Free",
    limit: "3 analyses/day free · 25/day on Pro",
    category: "Content & SEO",
    tags: ["Research", "Affiliate", "SEO", "Niche"],
    ctaLabel: "Score This Niche",
    inputType: "text",
    placeholder: "Enter a niche keyword (e.g. 'indoor gardening', 'AI tools for lawyers')...",
    benefits: [
      "Animated radar chart across 6 profitability dimensions",
      "A–F overall viability grade with confidence score",
      "Affiliate program discovery and avg. commission rates",
      "GEO content opportunity — AI citation gap analysis",
      "Trend direction: rising, stable, or declining",
      "3 recommended next steps with specific actions",
    ],
    upsellMessage: "Want the full 20-page Niche Validation Report? Book our Niche Research service.",
    faqs: [
      { question: "What are the 6 radar chart dimensions?", answer: "Competition level (SERP difficulty), search volume (estimated monthly), monetization potential (affiliate/ad RPM), AI visibility opportunity (GEO gap), content gap (underserved subtopics), and trend direction." },
      { question: "How specific should my keyword be?", answer: "More specific niches produce more accurate scores. 'Food' is too broad — try 'keto meal prep for diabetics' or 'home automation for renters'. Too-broad keywords trigger a prompt to narrow down." },
      { question: "Where does the data come from?", answer: "We combine estimated search volume data, affiliate program databases, SERP pattern analysis, and AI visibility gap analysis. All estimates carry a confidence interval shown in the report." },
      { question: "Can I share my niche score?", answer: "Yes. The 'Share Score' button generates a branded social card with your radar chart and grade — suitable for Twitter/LinkedIn. No account required to share." },
      { question: "How accurate are the scores?", answer: "Niche scoring involves estimation. We show confidence intervals and recommend validating top opportunities with our full Niche Research Service before committing resources." },
    ],
  },

  // ── Other Tools ───────────────────────────────────────────────────────
  {
    slug: "overview-checker",
    title: "AI Overview Visibility Checker",
    tagline: "See if your content appears in Google AI Overviews.",
    description:
      "Check whether your brand or content appears in Google AI Overviews, Bing Copilot, and Perplexity for target queries. Free for 3 checks per day — unlimited on Pro.",
    tier: "Freemium",
    limit: "3 checks/day free · Unlimited on Pro",
    category: "GEO & AI Search",
    tags: ["GEO", "Brand", "AI Search"],
    ctaLabel: "Check Visibility",
    inputType: "text",
    placeholder: "Enter a brand name or query...",
    benefits: [
      "Checks Google AI Overviews, Bing Copilot, and Perplexity",
      "Shows exact citation context when your brand appears",
      "Tracks visibility trend over time (Pro)",
      "Export white-label reports for clients (Agency)",
    ],
    upsellMessage: "Track your AI Overview visibility weekly with Pro — includes competitor comparison.",
    faqs: [
      { question: "How is this different from the GEO Visibility Checker?", answer: "The GEO Visibility Checker focuses on general AI platform citations across ChatGPT, Perplexity, Claude, and Gemini. This tool specifically checks Google AI Overviews, Bing Copilot response boxes, and featured snippet positions." },
      { question: "How often do AI Overviews change?", answer: "Google updates AI Overview coverage frequently, sometimes daily. We recommend weekly checks to catch changes before they impact organic traffic." },
      { question: "What if I'm not appearing at all?", answer: "We provide a prioritized action plan: schema markup types to add, content format recommendations, and authority signal gaps to address." },
    ],
  },
  {
    slug: "mcp-config-builder",
    title: "MCP Config Builder",
    tagline: "Generate and validate MCP server configs in seconds.",
    description:
      "Select tools from the directory and the builder generates a valid, ready-to-use MCP configuration file. Supports Claude Desktop, Cursor, and all MCP-compatible runtimes. Fully free, unlimited.",
    tier: "Free",
    category: "MCP & Tooling",
    tags: ["MCP", "Agents", "Developer"],
    ctaLabel: "Build Config",
    inputType: "none",
    placeholder: "Search for MCP servers to add...",
    benefits: [
      "Generates validated JSON config files instantly",
      "Supports Claude Desktop, Cursor, and all MCP runtimes",
      "Directory of 100+ pre-vetted MCP servers",
      "Export and share configs with your team",
    ],
    faqs: [
      { question: "What runtimes does this support?", answer: "Claude Desktop, Cursor, Windsurf, Cline, and any MCP-compatible runtime that accepts a standard JSON configuration file." },
      { question: "Are all MCP servers in the directory vetted?", answer: "Yes. Every server in our directory has passed a basic security review. We do not list unvetted community packages." },
      { question: "Can I add custom servers not in the directory?", answer: "Yes. You can add custom server entries with a manual config form and validate the schema before exporting." },
    ],
  },
  {
    slug: "prompts",
    title: "Prompt Library",
    tagline: "200+ curated prompts for SEO, content, and agents.",
    description:
      "Browse a curated library of 200+ high-quality prompts organized by use case. Free to read, Pro to fork and save to your workspace.",
    tier: "Freemium",
    limit: "Read free · Fork/save on Pro",
    category: "Content & SEO",
    tags: ["Prompts", "Content", "Agents"],
    ctaLabel: "Browse Prompts",
    inputType: "none",
    benefits: [
      "200+ hand-curated, tested prompts across 10 categories",
      "Works with ChatGPT, Claude, Gemini, and any LLM",
      "Fork and edit prompts to your workspace (Pro)",
      "Submit your own prompts to the community",
    ],
    faqs: [
      { question: "Can I submit my own prompts?", answer: "Yes. Community submissions are reviewed and published within 3–5 business days. Accepted submitters are credited on the prompt card." },
      { question: "What categories are included?", answer: "SEO, content creation, niche research, agentic workflows, code generation, data analysis, email marketing, social media, customer support, and product development." },
    ],
  },
  {
    slug: "llm-calculator",
    title: "LLM Cost Calculator",
    tagline: "Compare real-time LLM pricing across 20+ providers.",
    description:
      "Enter your token usage and compare costs across OpenAI, Anthropic, Google, Mistral, and 20+ providers in real time. Find the cheapest model for your exact use case.",
    tier: "Free",
    category: "Developer Tools",
    tags: ["LLM", "Cost", "Developer"],
    ctaLabel: "Compare Costs",
    inputType: "sliders",
    benefits: [
      "Real-time pricing data across 20+ providers",
      "Input/output token cost breakdown by model",
      "Side-by-side capability comparison (context window, speed)",
      "Export cost estimate as shareable link",
    ],
    faqs: [
      { question: "How current is the pricing data?", answer: "Pricing data is updated weekly from official provider APIs and pricing pages. We show the last-updated date on each row." },
      { question: "Does it account for batch API discounts?", answer: "Yes. Toggle 'Batch Mode' to see batch API pricing where available (OpenAI offers 50% batch discounts on most models)." },
    ],
  },
  // ── Coming Soon ───────────────────────────────────────────────────────
  {
    slug: "keyword-cluster",
    title: "Keyword Cluster Generator",
    tagline: "Group keyword lists into intent-tagged clusters.",
    description: "Paste up to 100 keywords and get them automatically grouped into semantic clusters with intent tags (informational, commercial, transactional). Free 5/day.",
    tier: "Free",
    limit: "5/day free · Unlimited on Pro",
    category: "Content & SEO",
    tags: ["Keywords", "SEO", "Content"],
    ctaLabel: "Cluster Keywords",
    inputType: "textarea",
    placeholder: "Paste your keyword list (one per line, up to 100)...",
    benefits: [
      "Semantic clustering using AI intent analysis",
      "Intent tags: informational, commercial, transactional, navigational",
      "Export clusters as CSV or copy to clipboard",
      "Content brief suggestions per cluster",
    ],
    faqs: [],
  },
  {
    slug: "content-brief",
    title: "Content Brief Builder",
    tagline: "Full content brief from a single target keyword.",
    description: "Enter a target keyword and get a complete content brief: outline, H2s, recommended word count, SERP competitors, and content angle recommendations.",
    tier: "Free",
    limit: "5/day free · Unlimited on Pro",
    category: "Content & SEO",
    tags: ["Content", "SEO", "Briefs"],
    ctaLabel: "Build Brief",
    inputType: "text",
    placeholder: "Enter your target keyword...",
    benefits: [
      "Full outline with H2/H3 structure",
      "Recommended word count based on SERP analysis",
      "Top 5 competitor content analysis",
      "Unique content angle recommendations",
    ],
    faqs: [],
  },
  {
    slug: "schema-generator",
    title: "Schema Markup Generator",
    tagline: "Generate JSON-LD schema markup instantly.",
    description: "Select your schema type, fill in the fields, and get valid JSON-LD code with a copy button and validation status. Supports Article, FAQ, HowTo, Product, and 20+ types.",
    tier: "Free",
    limit: "Unlimited · No account required",
    category: "Developer Tools",
    tags: ["Schema", "SEO", "Developer"],
    ctaLabel: "Generate Schema",
    inputType: "textarea",
    placeholder: "Describe your page. E.g. for Article: title, author, publish date, description, image URL...",
    benefits: [
      "20+ schema types supported",
      "Real-time validation against Schema.org spec",
      "One-click copy as JSON-LD script tag",
      "No account required — unlimited use",
    ],
    faqs: [],
  },
  {
    slug: "robots-optimizer",
    title: "Robots.txt AI Optimizer",
    tagline: "Find which AI bots you're blocking — and fix it.",
    description: "Enter your URL and we fetch and analyze your robots.txt. See which AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are blocked, and get a one-click optimized version.",
    tier: "Free",
    limit: "5/day free",
    category: "GEO & AI Search",
    tags: ["GEO", "Robots.txt", "Technical SEO"],
    ctaLabel: "Analyze robots.txt",
    inputType: "text",
    placeholder: "Enter your site URL (e.g. https://example.com)...",
    benefits: [
      "Detects all major AI crawler blocks (GPTBot, ClaudeBot, PerplexityBot, etc.)",
      "Shows which AI platforms are affected",
      "One-click optimized robots.txt with correct directives",
      "Explanation of trade-offs for each AI bot",
    ],
    faqs: [],
  },
  {
    slug: "ai-detector",
    title: "AI Detection Scanner",
    tagline: "Multi-model AI detection score visualization.",
    description: "Paste text and get a multi-detector score visualization using pattern analysis across the same signals used by Originality.ai, GPTZero, and Turnitin.",
    tier: "Free",
    limit: "3/day free",
    category: "Content & SEO",
    tags: ["AI Detection", "Content"],
    ctaLabel: "Scan for AI",
    inputType: "textarea",
    placeholder: "Paste text to scan for AI detection...",
    benefits: [
      "Scores against Originality.ai, GPTZero, and Turnitin signal patterns",
      "Sentence-level highlighting of high-risk phrases",
      "Before/after comparison when used with the Humanizer",
      "Fully client-side — no text is transmitted",
    ],
    faqs: [],
  },
  {
    slug: "title-generator",
    title: "Blog Title Generator",
    tagline: "10 scored headlines: CTR, SEO, and AI citation potential.",
    description: "Enter a topic and target keyword and get 10 headline variations scored for click-through rate, SEO signal strength, and AI citation potential.",
    tier: "Free",
    limit: "5/day free · Unlimited on Pro",
    category: "Content & SEO",
    tags: ["Content", "Headlines", "SEO"],
    ctaLabel: "Generate Titles",
    inputType: "text",
    placeholder: "Enter your topic + target keyword...",
    benefits: [
      "10 headline variations per query",
      "CTR score, SEO strength score, and AI citation score per title",
      "Emotional trigger and power word analysis",
      "One-click copy for each title",
    ],
    faqs: [],
  },
  {
    slug: "meta-writer",
    title: "Meta Description Writer",
    tagline: "3 meta descriptions with character counts, instantly.",
    description: "Enter a URL and target keyword and get 3 meta description variations — all within the 155-character limit, optimized for CTR, and ready to copy.",
    tier: "Free",
    limit: "5/day free · Unlimited on Pro",
    category: "Content & SEO",
    tags: ["SEO", "Meta", "Content"],
    ctaLabel: "Write Meta",
    inputType: "text",
    placeholder: "Enter URL + target keyword...",
    benefits: [
      "3 variations per request — different angles and tones",
      "Real-time character count with 155-char limit enforcement",
      "CTR-optimized phrasing based on proven patterns",
      "One-click copy per description",
    ],
    faqs: [],
  },
  {
    slug: "ai-readiness",
    title: "AI Readiness Assessment",
    tagline: "10-question quiz with a custom AI adoption roadmap.",
    description: "Answer 10 questions about your business and content operations and get a custom AI adoption roadmap, readiness score card, and recommended tools.",
    tier: "Free",
    category: "Strategy",
    tags: ["Strategy", "AI Adoption"],
    ctaLabel: "Start Assessment",
    inputType: "quiz",
    benefits: [
      "10-question adaptive quiz (takes 3–4 minutes)",
      "Custom AI adoption roadmap based on your answers",
      "Readiness score with category breakdown",
      "Recommended tools and services for your situation",
    ],
    faqs: [],
  },
  {
    slug: "stack-recommender",
    title: "AI Stack Recommender",
    tagline: "Describe your use case — get your optimal AI stack.",
    description: "Describe what you want to build or automate in plain language and get a recommended AI stack with pricing comparison, integration complexity rating, and setup guide.",
    tier: "Freemium",
    limit: "3/day free · Unlimited Pro",
    category: "Strategy",
    tags: ["Strategy", "AI Stack", "Developer"],
    ctaLabel: "Get Recommendation",
    inputType: "textarea",
    placeholder: "Describe your use case (e.g. 'I want to automate blog writing and SEO for a niche site')...",
    benefits: [
      "Stack recommendations tailored to your use case",
      "Pricing comparison across recommended tools",
      "Integration complexity rating (Easy / Medium / Hard)",
      "Step-by-step setup guide for recommended stack",
    ],
    faqs: [],
  },
  {
    slug: "openclaw",
    title: "OpenClaw Skill Finder",
    tagline: "Vetted, audited OpenClaw skills — no malicious packages.",
    description:
      "Browse and deploy curated OpenClaw skills with full security audit status. Every skill in the directory has been reviewed before listing — no unvetted extensions.",
    tier: "Free",
    category: "Agentic AI",
    tags: ["Agents", "MCP", "Security"],
    ctaLabel: "Browse Skills",
    inputType: "none",
    benefits: [
      "Every skill audited before listing — no malware risk",
      "One-click deployment to your OpenClaw instance",
      "Community ratings and usage statistics",
      "Submit your own skill for review",
    ],
    faqs: [],
  },
]

export function getToolBySlug(slug: string): ToolData | undefined {
  return tools.find((t) => t.slug === slug)
}
