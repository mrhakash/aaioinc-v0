export interface DeliverableRow {
  item: string
  description: string
  timeline: string
}

export interface PricingTier {
  name: string
  price: string
  description: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Problem {
  headline: string
  stat: string
  description: string
}

export interface ServiceData {
  slug: string
  title: string
  tagline: string
  description: string
  /** Legacy flat list — kept for sidebar */
  priceAnchor: string
  priceNote: string
  problems: Problem[]
  solutionSummary: string
  process: ProcessStep[]
  deliverableTable: DeliverableRow[]
  pricingTiers: PricingTier[]
  idealFor: string[]
  caseStudy: {
    result: string
    detail: string
    metrics: string[]
  }
  faqs: FAQ[]
}

export const services: ServiceData[] = [
  // ─────────────────────────────────────────────
  // 1. OpenClaw Setup
  // ─────────────────────────────────────────────
  {
    slug: "openclaw-setup",
    title: "OpenClaw Agent Setup",
    tagline: "Production-grade MCP agent deployment, done for you.",
    description:
      "OpenClaw is powerful but risky — 12% of ClawHub skills are malicious, setup requires CLI expertise, and security hardening is complex. We handle secure VPS deployment, custom skill development, multi-channel integration, and a full security audit so you get a hardened, production-ready instance.",
    priceAnchor: "From $1,500",
    priceNote: "One-time setup — three tiers available",
    problems: [
      {
        headline: "12% of public skills are malicious",
        stat: "12%",
        description: "ClawHub has no mandatory security review. Nearly 1 in 8 community skills contains credential-harvesting or data-exfiltration code.",
      },
      {
        headline: "CLI setup takes 3–5 days minimum",
        stat: "3–5 days",
        description: "Proper VPS hardening, Docker isolation, fail2ban, UFW rules, and SSH key management requires deep DevOps knowledge most teams don't have.",
      },
      {
        headline: "Multi-channel integration breaks constantly",
        stat: "40% failure rate",
        description: "WhatsApp, Slack, and Telegram webhooks break on server restarts without proper systemd configuration and health-check automation.",
      },
    ],
    solutionSummary:
      "We handle everything: secure VPS provisioning with Docker isolation and fail2ban, 5 custom skills built to your spec and security-audited, 2 multi-channel integrations fully configured, and a penetration-test report with credential rotation guide. You get a production-ready instance with 30-day support.",
    process: [
      { number: "01", title: "Discovery Call", description: "30-minute scoping call to map your use case, required skills, and channel integrations." },
      { number: "02", title: "VPS Provisioning", description: "Dockerized OpenClaw on hardened Ubuntu VPS. fail2ban, UFW, SSH keys, auto-updates configured on Day 1–2." },
      { number: "03", title: "Skills & Channels", description: "5 custom skills built and security-audited. 2 channel integrations (WhatsApp, Telegram, Slack, or Discord) fully connected." },
      { number: "04", title: "Audit & Handover", description: "Penetration test, ClawHub skill scan, credential rotation report, full documentation, and 30-day Slack support channel." },
    ],
    deliverableTable: [
      { item: "Secure VPS Instance", description: "Dockerized OpenClaw on hardened Ubuntu VPS with fail2ban, UFW, SSH keys, auto-updates", timeline: "Day 1–2" },
      { item: "5 Custom Skills", description: "Built to client spec, security-audited, documented with SKILL.md", timeline: "Day 3–7" },
      { item: "Multi-Channel Setup", description: "WhatsApp, Telegram, Slack, or Discord (client choice of 2)", timeline: "Day 2–3" },
      { item: "Security Audit Report", description: "Penetration test, ClawHub skill scan, credential rotation report", timeline: "Day 7–8" },
      { item: "Documentation", description: "Setup guide, skill registry, escalation procedures, recovery playbook", timeline: "Day 8–10" },
      { item: "30-Day Support", description: "Slack channel, 4hr response SLA during business hours", timeline: "Day 10–40" },
    ],
    pricingTiers: [
      { name: "Basic", price: "$1,500", description: "2 channels, 3 skills, standard VPS" },
      { name: "Standard", price: "$3,000", description: "3 channels, 5 skills, load-balanced setup" },
      { name: "Enterprise", price: "$5,000", description: "All channels, 10 skills, priority support + quarterly audit" },
    ],
    idealFor: [
      "Developer Dave — building production agent infrastructure",
      "Enterprise Eva — deploying secure internal automation",
      "Agencies automating multi-client workflows",
    ],
    caseStudy: {
      result: "Production-ready OpenClaw in 4 days, zero security incidents",
      detail: "A Series A SaaS needed an OpenClaw environment with 8 custom skills and Slack + WhatsApp integration. Previous DIY attempt took 3 weeks and was compromised via a malicious ClawHub skill.",
      metrics: ["8 skills built and audited", "2 channels live in 72 hours", "0 security incidents in 6 months", "3-week DIY attempt replaced in 4 days"],
    },
    faqs: [
      { question: "What VPS provider do you use?", answer: "We provision on DigitalOcean, Hetzner, or your preferred provider. We can also deploy to AWS EC2 or GCP Compute Engine." },
      { question: "Can I use my own ClawHub skills?", answer: "Yes, but we audit every skill before installation. Any skill that fails our security check is flagged and we build a clean replacement." },
      { question: "What counts as a 'channel integration'?", answer: "WhatsApp (via Twilio or Meta Business API), Telegram Bot, Slack App, Discord Bot, or email via SMTP/SendGrid." },
      { question: "What happens after the 30-day support period?", answer: "You can continue on a $300/month retainer for ongoing monitoring, skill updates, and priority support, or manage independently with our documentation." },
      { question: "Do you offer on-premise deployment?", answer: "Yes, for Enterprise tier clients. We support bare-metal and on-premise Kubernetes deployments with custom networking requirements." },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. AI Blogging
  // ─────────────────────────────────────────────
  {
    slug: "ai-blogging",
    title: "Agentic AI for Blogging",
    tagline: "A 7-agent pipeline that researches, writes, humanizes, and publishes for you.",
    description:
      "Manual blog writing takes 4–6 hours per post. AI content gets flagged by detectors. Maintaining a 20+ post/month schedule is impossible solo. We build a multi-agent pipeline on n8n/FlowHunt that handles everything from niche research to WordPress publish — with a human review checkpoint before every post goes live.",
    priceAnchor: "From $2,000 setup",
    priceNote: "+ $500/month management (30 posts)",
    problems: [
      {
        headline: "4–6 hours wasted per post",
        stat: "4–6 hrs",
        description: "Manual research, writing, editing, SEO optimization, and publishing takes half a working day per article — impossible to scale solo.",
      },
      {
        headline: "AI content flagged 73% of the time",
        stat: "73%",
        description: "Raw GPT output fails Originality.ai and GPTZero checks at an alarming rate, exposing publishers to Google quality penalties.",
      },
      {
        headline: "Solo bloggers cap out at 4–6 posts/month",
        stat: "4–6 posts",
        description: "Without a content team, most bloggers plateau. Hiring writers at $60–120/article is cost-prohibitive at scale.",
      },
    ],
    solutionSummary:
      "A 7-agent pipeline: Niche Research → Keyword Cluster → Content Brief → Writer → SEO Optimizer → Humanizer → Publisher. Every draft hits a human review checkpoint in Slack before publish. You get consistent, humanized, SEO-optimized content at $10–15/article.",
    process: [
      { number: "01", title: "Pipeline Configuration", description: "n8n/FlowHunt workflow with 7 connected agents, tested end-to-end. WordPress integration with Yoast SEO metadata, categories, and AI-generated featured images." },
      { number: "02", title: "Brand Voice Training", description: "Custom prompt tuning on 10 sample articles to match your tone, vocabulary, and style. Outputs feel like you, not like ChatGPT." },
      { number: "03", title: "Content Calendar", description: "30-day calendar with topic clusters, keyword targets, and publish schedule — ready before launch." },
      { number: "04", title: "Human Review Workflow", description: "Draft → Slack notification → Your approval/edit → Auto-publish. You stay in control without being in the weeds." },
    ],
    deliverableTable: [
      { item: "Pipeline Configuration", description: "n8n/FlowHunt workflow with 7 agents, end-to-end tested", timeline: "Week 1" },
      { item: "WordPress Integration", description: "Auto-publish with Yoast SEO metadata, categories, featured images (Leonardo AI)", timeline: "Week 1" },
      { item: "Brand Voice Training", description: "Custom prompt tuning on 10 sample articles for tone/style match", timeline: "Week 1–2" },
      { item: "Content Calendar", description: "30-day calendar with topic clusters, keywords, and publish schedule", timeline: "Week 1" },
      { item: "Human Review Workflow", description: "Draft → Slack notification → Approve/Edit → Publish flow", timeline: "Week 2" },
      { item: "Monthly QA Report", description: "Traffic, rankings, AI detection scores, content quality audit", timeline: "Monthly" },
    ],
    pricingTiers: [
      { name: "Starter", price: "$2,000 + $500/mo", description: "Setup + 30 posts/month management" },
      { name: "Premium", price: "$3,500 + $1,000/mo", description: "Setup + 50 posts/month, A/B testing, premium humanization" },
    ],
    idealFor: [
      "Blogger Ben — scaling from 4 to 20+ posts/month",
      "Agency Alex — managing multiple content clients",
      "Affiliate site builders running lean operations",
    ],
    caseStudy: {
      result: "Scaled from 4 to 18 posts/month at $12/article",
      detail: "A personal finance blogger needed to scale content without hiring. Our pipeline reduced per-article cost from $60 to $12, maintained 94+ Originality.ai human scores, and grew organic traffic 3.2x in 90 days.",
      metrics: ["18 posts/month vs. 4 before", "$12/article vs. $60 before", "94+ avg. human score (Originality.ai)", "3.2x organic traffic growth in 90 days"],
    },
    faqs: [
      { question: "Will Google penalize AI content from your pipeline?", answer: "Our pipeline includes a mandatory humanization pass that consistently scores 90+ on Originality.ai. We also include a human review checkpoint — nothing publishes without your approval." },
      { question: "What CMS platforms do you support?", answer: "WordPress (primary), Ghost, Webflow CMS, and any platform with a REST API. We also support direct Markdown export to GitHub for static sites." },
      { question: "Can I request specific topics or keywords?", answer: "Yes. The content calendar is collaborative. You can provide topic lists, keyword targets, or seasonal priorities — the pipeline handles research and execution." },
      { question: "How do you handle featured images?", answer: "We use Leonardo AI to generate niche-appropriate featured images that are unique to your content. You can also provide brand asset folders for consistent styling." },
      { question: "What if I want to pause the service?", answer: "Monthly management is paused or cancelled with 14 days notice. The pipeline and workflows remain yours — no vendor lock-in." },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. AI SEO
  // ─────────────────────────────────────────────
  {
    slug: "ai-seo",
    title: "AI SEO Service",
    tagline: "GEO-optimized content and technical SEO powered by AI agents.",
    description:
      "Traditional SEO alone no longer drives visibility. Google's AI Overviews, Bing Copilot, and Perplexity are reshaping how users discover brands — and most sites are completely invisible in these new channels. We deploy AI-driven SEO workflows targeting both traditional search and generative engine optimization.",
    priceAnchor: "From $1,500/month",
    priceNote: "Includes audit, strategy, and ongoing execution",
    problems: [
      {
        headline: "60%+ of searches now end without a click",
        stat: "60%+",
        description: "AI Overviews answer queries directly. Sites not cited in these overviews are invisible to the majority of searchers in their niche.",
      },
      {
        headline: "Most sites have zero AI Overview citations",
        stat: "~0",
        description: "Without structured data, authoritative content signals, and GEO optimization, brands simply don't appear in ChatGPT, Perplexity, or Google AI answers.",
      },
      {
        headline: "Technical SEO debt compounds monthly",
        stat: "12% avg crawl errors",
        description: "The average site accumulates 12% new crawl errors per month — broken links, missing schema, duplicate meta — which compound over time without active management.",
      },
    ],
    solutionSummary:
      "Full-stack GEO + SEO: technical audit, schema markup generation, AI Overview visibility analysis, GEO-optimized content briefs, and monthly progress reports covering both traditional rankings and AI citation rates.",
    process: [
      { number: "01", title: "GEO + Technical Audit", description: "Full crawl analysis, GEO signal assessment, schema coverage audit, and AI Overview visibility baseline across your top 50 queries." },
      { number: "02", title: "Schema & Structure", description: "JSON-LD schema markup for all key content types. FAQ, HowTo, Article, Product, and Organization schema deployed and validated." },
      { number: "03", title: "Content Strategy", description: "GEO-optimized content briefs targeting AI citation patterns. Semantic authority building through content clusters and internal linking." },
      { number: "04", title: "Monthly Reporting", description: "GEO score tracking, AI Overview citation monitoring, traditional rank movement, and content performance review." },
    ],
    deliverableTable: [
      { item: "Technical SEO + GEO Audit", description: "Full crawl analysis, schema coverage, GEO signal baseline", timeline: "Week 1" },
      { item: "JSON-LD Schema Deployment", description: "FAQ, HowTo, Article, Organization, Product schema", timeline: "Week 1–2" },
      { item: "AI Overview Analysis", description: "Visibility baseline + strategy for 50 target queries", timeline: "Week 2" },
      { item: "Content Gap Analysis", description: "Competitor content mapping, topic cluster strategy", timeline: "Week 2" },
      { item: "Monthly GEO Score Report", description: "Citation tracking, rank movement, GEO signal improvements", timeline: "Monthly" },
      { item: "Backlink & Citation Strategy", description: "Authority source identification, outreach templates", timeline: "Month 2+" },
    ],
    pricingTiers: [
      { name: "Starter", price: "$1,500/month", description: "Audit + 10 content briefs + monthly reporting" },
      { name: "Growth", price: "$3,000/month", description: "Full execution: briefs, schema, link building, 20 pages" },
      { name: "Agency", price: "$6,000/month", description: "Multi-site management up to 5 domains, white-label reporting" },
    ],
    idealFor: [
      "SEO agencies with 5+ clients needing GEO expertise",
      "E-commerce brands targeting AI search product discovery",
      "SaaS companies optimizing for branded AI queries",
    ],
    caseStudy: {
      result: "3x AI Overview citations in 90 days — 47 branded queries",
      detail: "A B2B SaaS had zero AI Overview mentions despite strong traditional rankings. After schema overhaul, GEO content strategy, and authority signal building, they appeared in 47 branded queries within 90 days.",
      metrics: ["0 → 47 branded AI Overview citations", "3x increase in organic click-through", "92% schema coverage (up from 23%)", "14 featured snippet acquisitions"],
    },
    faqs: [
      { question: "How is GEO different from traditional SEO?", answer: "GEO (Generative Engine Optimization) targets AI-generated answers in ChatGPT, Perplexity, Google AI Overviews, and Bing Copilot — not just blue-link rankings. It requires different signals: structured data, authoritative citations, semantic clarity, and FAQ-style content." },
      { question: "How long until we see GEO results?", answer: "AI Overview citations typically appear within 30–90 days of deploying schema and GEO-optimized content. Traditional SEO results follow the standard 3–6 month timeline." },
      { question: "Do you handle content creation or just strategy?", answer: "Both. Our Starter tier covers strategy and briefs. Growth tier includes full content creation with humanization passes." },
      { question: "Can you manage multiple sites?", answer: "Yes. Our Agency tier covers up to 5 domains with consolidated white-label reporting suitable for client-facing use." },
      { question: "What reporting do we get?", answer: "Monthly reports covering: GEO citation count by query, AI Overview appearance rate, traditional rank movement for target keywords, technical health score, and content performance metrics." },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. AI Content
  // ─────────────────────────────────────────────
  {
    slug: "ai-content",
    title: "AI Content Service",
    tagline: "Human-quality AI content, on-demand.",
    description:
      "On-demand AI-assisted content creation with full humanization, editorial review, and brand voice consistency. From blog posts and landing pages to product descriptions and email sequences — at $0.04/word, not $0.40/word.",
    priceAnchor: "From $0.04/word",
    priceNote: "Volume pricing available from 50,000 words/month",
    problems: [
      {
        headline: "Quality freelancers cost $0.10–$0.40/word",
        stat: "$0.40/word",
        description: "Professional content at scale is expensive. A 100K word/month content program at agency rates costs $10,000–40,000 monthly.",
      },
      {
        headline: "Raw AI content fails detection 73% of the time",
        stat: "73%",
        description: "Unhumanized AI drafts consistently fail Originality.ai and GPTZero. Publishers using raw output risk Google quality penalties.",
      },
      {
        headline: "Brand voice is lost in AI output",
        stat: "Generic output",
        description: "Off-the-shelf AI content sounds identical regardless of brand. Without proper voice training, outputs undermine brand identity.",
      },
    ],
    solutionSummary:
      "We combine AI generation with systematic humanization, brand voice training on your existing content, multi-detector verification (Originality.ai + GPTZero), and SEO optimization — delivering CMS-ready content at a fraction of freelancer rates.",
    process: [
      { number: "01", title: "Brand Voice Training", description: "We analyze 10–20 samples of your best content to extract tone, vocabulary, sentence patterns, and style guidelines." },
      { number: "02", title: "AI Draft Generation", description: "Content briefs fed to our tuned generation pipeline. Every draft is unique, SEO-structured, and internally consistent." },
      { number: "03", title: "Humanization Pass", description: "Systematic transformation targeting AI detection patterns. Scored against Originality.ai and GPTZero before delivery." },
      { number: "04", title: "QA & Delivery", description: "Editorial review pass, SEO keyword density check, CMS formatting, and delivery in your preferred format (HTML, Markdown, DOCX)." },
    ],
    deliverableTable: [
      { item: "Brand Voice Guide", description: "Extracted style guide from your content samples", timeline: "Week 1" },
      { item: "AI Draft", description: "SEO-structured draft using your brief and target keywords", timeline: "Per order" },
      { item: "Humanization Pass", description: "Full transformation targeting Originality.ai + GPTZero", timeline: "Per order" },
      { item: "Detection Report", description: "Score certificate from Originality.ai and GPTZero", timeline: "Per order" },
      { item: "SEO Optimization", description: "Keyword density check, meta description, title tag", timeline: "Per order" },
      { item: "CMS-Ready Output", description: "HTML, Markdown, or DOCX in your preferred format", timeline: "Per order" },
    ],
    pricingTiers: [
      { name: "Standard", price: "$0.04/word", description: "Blog posts, articles, landing pages (min. 5,000 words/order)" },
      { name: "Volume", price: "$0.03/word", description: "50,000+ words/month — product descriptions, catalogs" },
      { name: "Premium", price: "$0.06/word", description: "Technical content, whitepapers, thought leadership" },
    ],
    idealFor: [
      "Content agencies needing overflow capacity",
      "E-commerce brands building product catalog descriptions",
      "SaaS companies scaling documentation and blog libraries",
    ],
    caseStudy: {
      result: "100,000 words/month at $0.04/word, 98% human score",
      detail: "An e-commerce agency needed 100K words monthly for product descriptions across 3 client sites. Our pipeline delivered at $4,000/month — versus $20,000+ at agency rates — with 98% average Originality.ai human score.",
      metrics: ["100K words/month delivered", "$4,000/month vs. $20,000+ at agency rates", "98% avg. Originality.ai human score", "3 client sites managed concurrently"],
    },
    faqs: [
      { question: "What AI detection score do you guarantee?", answer: "We target 90+ on Originality.ai and 85+ on GPTZero. If a piece falls below threshold, we re-humanize at no cost." },
      { question: "What content types do you support?", answer: "Blog posts, landing pages, product descriptions, email sequences, social media copy, whitepapers, case studies, and FAQ content." },
      { question: "How long does turnaround take?", answer: "Standard orders (under 5,000 words): 24–48 hours. Large batch orders (50K+ words): 5–7 business days. Rush delivery available at +25%." },
      { question: "Can you match our exact brand voice?", answer: "Yes. Brand voice training is included for all accounts over 10,000 words/month. We analyze your best-performing content to extract patterns before production begins." },
      { question: "Is the content unique?", answer: "All content is generated fresh for each order and checked against Copyscape for plagiarism. We do not reuse or resell any content." },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. Niche Research
  // ─────────────────────────────────────────────
  {
    slug: "niche-research",
    title: "Niche Research Service",
    tagline: "Data-driven niche and keyword strategy, delivered in 5 days.",
    description:
      "We conduct a comprehensive niche research engagement — 50+ niche analysis, competitor content mapping, affiliate program discovery, GEO content opportunity scoring, and a 12-month content roadmap. For bloggers, investors, and affiliate marketers who want data before committing.",
    priceAnchor: "From $750",
    priceNote: "One-time engagement, delivered in 5 business days",
    problems: [
      {
        headline: "Most bloggers choose niches based on gut feel",
        stat: "87% fail",
        description: "87% of new niche sites fail to reach $1,000/month. The primary cause: picking niches without validating monetization potential and competition ceiling.",
      },
      {
        headline: "Affiliate program research takes weeks",
        stat: "2–3 weeks",
        description: "Manually researching 50+ affiliate programs across CJ, ShareASale, and individual networks takes 2–3 weeks and produces inconsistent data.",
      },
      {
        headline: "AI content opportunity is invisible without GEO data",
        stat: "Invisible gap",
        description: "Traditional keyword tools don't show GEO content gaps — the emerging opportunity where AI-generated answers cite authoritative sources in underserved topics.",
      },
    ],
    solutionSummary:
      "We analyze 50+ niches across 6 dimensions: competition level, search volume, monetization potential, AI visibility opportunity, content gaps, and trend direction — delivering a comprehensive report with a 12-month content calendar and affiliate program matrix.",
    process: [
      { number: "01", title: "Scope & Seed Keywords", description: "You provide 3–5 broad topic areas. We generate 50+ sub-niche candidates using AI-assisted expansion and market signal analysis." },
      { number: "02", title: "Competitive Analysis", description: "SERP analysis, domain authority assessment, content gap mapping, and affiliate program discovery for top 10 candidates." },
      { number: "03", title: "GEO Opportunity Scoring", description: "AI visibility gap analysis — identifying niches where AI-generated answers are underserved and citation opportunities exist." },
      { number: "04", title: "Roadmap Delivery", description: "Final report with viability scores (A–F), recommended niche(s), 12-month content calendar, top 50 keywords with metrics, and affiliate program matrix." },
    ],
    deliverableTable: [
      { item: "Niche Opportunity Report", description: "50+ niches analyzed across 6 dimensions with viability scores", timeline: "Day 1–3" },
      { item: "Competitor Content Analysis", description: "Top 5 competitors per niche, content gap mapping", timeline: "Day 2–3" },
      { item: "Affiliate Program Matrix", description: "Programs, commission rates, cookie windows, EPC data", timeline: "Day 3–4" },
      { item: "GEO Content Scoring", description: "AI Overview opportunity analysis per niche", timeline: "Day 3–4" },
      { item: "12-Month Content Calendar", description: "Topic clusters, keywords, and publish schedule for recommended niche", timeline: "Day 4–5" },
      { item: "Top 50 Priority Keywords", description: "KD, volume, CPC, intent, and recommended content format", timeline: "Day 5" },
    ],
    pricingTiers: [
      { name: "Standard", price: "$750", description: "Single niche deep-dive, 5-day delivery" },
      { name: "Comprehensive", price: "$1,500", description: "3 niche comparisons, full roadmap, affiliate matrix" },
    ],
    idealFor: [
      "Bloggers launching a new niche site from scratch",
      "Affiliate marketers pivoting after Google HCU impact",
      "Investors evaluating content site acquisition targets",
    ],
    caseStudy: {
      result: "Identified a $180K/year affiliate niche in 3 days",
      detail: "A full-time blogger wanted to launch a second site and had been considering 'smart home' broadly. Our analysis surfaced 'home automation for renters' as a high-opportunity sub-niche: low competition, high affiliate commissions, and a strong GEO content gap.",
      metrics: ["$180K estimated annual affiliate revenue", "$47 avg. commission per sale", "Competition score: 31/100 (low)", "14 underserved GEO content angles identified"],
    },
    faqs: [
      { question: "What format is the final report?", answer: "A PDF report with all analysis, plus a Google Sheets workbook with the keyword matrix and affiliate program data for easy reference and manipulation." },
      { question: "Can I provide my own niche candidates?", answer: "Yes. If you have specific niches in mind, we can assess them alongside our generated candidates. Just provide your list during onboarding." },
      { question: "Do you include international markets?", answer: "Standard reports focus on US markets. International (UK, AU, CA) analysis is available as an add-on at $250 per additional market." },
      { question: "What if I'm not satisfied with the recommended niches?", answer: "We offer one free revision round. If the revised recommendations still don't fit your criteria, we provide a full refund." },
      { question: "Is this report confidential?", answer: "Yes. We never share, resell, or reference client niche research. Each report is produced exclusively for the purchasing client." },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. MCP Skills Development
  // ─────────────────────────────────────────────
  {
    slug: "mcp-skills",
    title: "MCP Skills Development",
    tagline: "Custom OpenClaw skill builds, audited and production-ready.",
    description:
      "We design, build, test, and optionally publish custom MCP skills for your OpenClaw environment. Each skill is security-audited before delivery and includes SKILL.md documentation, usage examples, and an integration guide.",
    priceAnchor: "From $1,500/skill",
    priceNote: "Bulk discounts for 3+ skills",
    problems: [
      {
        headline: "12% of ClawHub skills are malicious",
        stat: "12%",
        description: "Public ClawHub has no mandatory security review. Enterprises can't afford to use unvetted community skills in production environments.",
      },
      {
        headline: "Custom skill development requires rare expertise",
        stat: "< 0.1% of devs",
        description: "MCP protocol implementation, sandbox isolation, credential handling, and tool schema design require a narrow skill set most teams don't have in-house.",
      },
      {
        headline: "Poorly built skills break agent workflows",
        stat: "34% failure rate",
        description: "Skills without proper error handling, rate limiting, and retry logic fail silently in production, causing agent loops and data loss.",
      },
    ],
    solutionSummary:
      "We own the full lifecycle: architecture and spec design, implementation, isolated testing, security audit, MCP-compliant documentation, and optional submission to the AAIO skill directory with our security certification badge.",
    process: [
      { number: "01", title: "Spec Design", description: "We document the skill's input schema, tool manifest, authentication requirements, error states, and rate-limiting strategy before writing a line of code." },
      { number: "02", title: "Implementation", description: "Full skill implementation with proper MCP protocol compliance, error handling, retry logic, and sandbox isolation." },
      { number: "03", title: "Security Audit", description: "Static analysis, credential handling review, input sanitization check, and penetration testing of the skill's exposed surface." },
      { number: "04", title: "Documentation & Delivery", description: "SKILL.md documentation, usage examples, integration guide for your stack, and optional submission to the AAIO directory with audit certificate." },
    ],
    deliverableTable: [
      { item: "Architecture Spec", description: "Input schema, tool manifest, auth requirements, error states", timeline: "Day 1–2" },
      { item: "Full Implementation", description: "MCP-compliant skill with error handling, retry logic, sandbox isolation", timeline: "Day 2–8" },
      { item: "Security Audit Certificate", description: "Static analysis, credential handling review, pen test report", timeline: "Day 8–10" },
      { item: "SKILL.md Documentation", description: "MCP-compliant docs with usage examples and parameter reference", timeline: "Day 9–10" },
      { item: "Integration Guide", description: "Step-by-step install and config for your specific stack", timeline: "Day 10" },
      { item: "Directory Submission (optional)", description: "Submission to AAIO skill directory with audit certification badge", timeline: "Day 11–14" },
    ],
    pricingTiers: [
      { name: "Single Skill", price: "$1,500", description: "1 custom skill, full audit, documentation" },
      { name: "Bundle (3 skills)", price: "$3,750", description: "3 skills — saves $750 vs. individual pricing" },
      { name: "Enterprise Pack (6 skills)", price: "$6,000", description: "6 skills — saves $3,000 vs. individual pricing" },
    ],
    idealFor: [
      "Enterprises needing proprietary, audited internal tools",
      "Developers building MCP-based product features",
      "Agencies creating white-label agent skill sets for clients",
    ],
    caseStudy: {
      result: "6 custom skills audited and live in 14 days",
      detail: "A logistics SaaS needed 6 custom MCP skills for their agent platform: shipment tracking, carrier API, label generation, address validation, rate shopping, and ERP sync. We delivered all six, fully audited, in 14 days.",
      metrics: ["6 skills delivered in 14 days", "Estimated 3 months internal dev time saved", "0 security audit failures across all 6 skills", "All skills passed MCP protocol compliance review"],
    },
    faqs: [
      { question: "What languages do you build skills in?", answer: "Primarily TypeScript/Node.js for MCP compatibility. Python is available for skills requiring ML libraries. We match your team's primary language where possible." },
      { question: "What does the security audit cover?", answer: "Static code analysis, credential handling and storage review, input sanitization and injection prevention, rate limiting implementation, and a sandbox penetration test." },
      { question: "Can we see the audit report?", answer: "Yes. The full security audit report is a deliverable. It includes findings (if any), remediation actions taken, and a final clearance certificate." },
      { question: "Do you maintain the skills after delivery?", answer: "Maintenance is available at $200/skill/month covering MCP protocol updates, dependency security patches, and bug fixes with a 24-hour response SLA." },
      { question: "What if a skill needs significant changes after delivery?", answer: "Minor changes (under 2 hours) within 30 days of delivery are free. Major architectural changes are scoped and quoted separately." },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug)
}
