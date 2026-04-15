import { generateText, Output } from "ai"
import { z } from "zod"
import { checkAndIncrementUsage, rateLimitExceededResponse } from "@/lib/rate-limit"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

// ── Request schema ────────────────────────────────────────────────────────────

const TOOLS = [
  "keyword-cluster",
  "content-brief",
  "schema-generator",
  "robots-optimizer",
  "title-generator",
  "ai-detector",
  "meta-writer",
] as const

const RequestSchema = z.object({
  tool: z.enum(TOOLS),
  input: z.string().min(2).max(3000),
  extra: z.record(z.string()).optional(),
})

// ── Per-tool AI config ────────────────────────────────────────────────────────

const TOOL_CONFIG: Record<typeof TOOLS[number], {
  system: string
  prompt: (input: string, extra?: Record<string, string>) => string
  outputSchema: z.ZodTypeAny
}> = {
  "keyword-cluster": {
    system: `You are an expert SEO keyword analyst. Group the provided keyword list into semantic clusters, assigning each cluster a primary topic label, search intent (informational/commercial/transactional/navigational), and estimated priority (high/medium/low).`,
    prompt: (input) => `Group these keywords into clusters with intent tags:\n\n${input}`,
    outputSchema: z.object({
      clusters: z.array(z.object({
        topic: z.string(),
        intent: z.enum(["informational", "commercial", "transactional", "navigational"]),
        priority: z.enum(["high", "medium", "low"]),
        keywords: z.array(z.string()),
        contentAngle: z.string(),
      })),
      totalKeywords: z.number(),
      recommendations: z.array(z.string()),
    }),
  },

  "content-brief": {
    system: `You are an expert content strategist. Create a comprehensive, actionable content brief for the given target keyword. Be specific and thorough.`,
    prompt: (input) => `Create a full content brief for the keyword: "${input}"`,
    outputSchema: z.object({
      targetKeyword: z.string(),
      semanticVariants: z.array(z.string()),
      searchIntent: z.string(),
      recommendedTitle: z.string(),
      metaDescription: z.string(),
      wordCountRecommendation: z.number(),
      outline: z.array(z.object({
        h2: z.string(),
        h3s: z.array(z.string()),
      })),
      mustCoverTopics: z.array(z.string()),
      geoAngle: z.string(),
      internalLinkOpportunities: z.array(z.string()),
    }),
  },

  "schema-generator": {
    system: `You are a technical SEO specialist expert in Schema.org structured data. Generate valid JSON-LD schema markup for the given page type and details. The output must be 100% valid JSON-LD that passes Google's Rich Results Test.`,
    prompt: (input, extra) => `Generate JSON-LD schema for a ${extra?.schemaType ?? "Article"} page. Details: ${input}`,
    outputSchema: z.object({
      schemaType: z.string(),
      jsonLd: z.string(),
      fieldsGenerated: z.array(z.string()),
      validationNotes: z.string(),
      additionalSchemas: z.array(z.string()),
    }),
  },

  "robots-optimizer": {
    system: `You are a technical SEO expert specializing in AI crawl optimization. Analyze the provided robots.txt content and identify which AI crawlers are being blocked. Provide an optimized version that grants AI bots access while protecting sensitive paths.`,
    prompt: (input) => `Analyze this robots.txt and provide optimization for AI crawler access:\n\n${input}`,
    outputSchema: z.object({
      blockedAiBots: z.array(z.object({
        bot: z.string(),
        platform: z.string(),
        status: z.enum(["blocked", "allowed", "partial"]),
      })),
      issues: z.array(z.string()),
      optimizedRobotsTxt: z.string(),
      protectedPaths: z.array(z.string()),
      geoImpact: z.string(),
    }),
  },

  "title-generator": {
    system: `You are an expert headline writer and content strategist. Generate 10 diverse, high-performing title variations for the given topic, each scored for CTR potential, SEO strength, and AI citation likelihood.`,
    prompt: (input) => `Generate 10 scored headline variations for: "${input}"`,
    outputSchema: z.object({
      titles: z.array(z.object({
        title: z.string(),
        ctrScore: z.number().min(0).max(100),
        seoScore: z.number().min(0).max(100),
        aiCitationScore: z.number().min(0).max(100),
        type: z.string(),
        powerWords: z.array(z.string()),
      })),
      topPick: z.string(),
      reasoning: z.string(),
    }),
  },

  "ai-detector": {
    system: `You are an AI content detection expert trained on the signal patterns used by Originality.ai, GPTZero, and Turnitin. Analyze the provided text for AI-generated content markers. Score each detector separately and provide sentence-level analysis.`,
    prompt: (input) => `Analyze this text for AI detection signals:\n\n${input}`,
    outputSchema: z.object({
      overallScore: z.number().min(0).max(100),
      verdict: z.enum(["Human", "Likely Human", "Mixed", "Likely AI", "AI-Generated"]),
      detectorScores: z.object({
        originalityAi: z.number().min(0).max(100),
        gptZero: z.number().min(0).max(100),
        turnitin: z.number().min(0).max(100),
      }),
      highRiskPhrases: z.array(z.string()),
      signals: z.array(z.string()),
      recommendation: z.string(),
    }),
  },

  "meta-writer": {
    system: `You are an expert SEO copywriter specializing in meta descriptions. Write 3 compelling meta description variations that are under 155 characters, CTR-optimized, and include the target keyword naturally.`,
    prompt: (input, extra) => `Write 3 meta descriptions for target keyword "${extra?.keyword ?? input}". Context: ${input}`,
    outputSchema: z.object({
      metaDescriptions: z.array(z.object({
        text: z.string(),
        charCount: z.number(),
        angle: z.string(),
        ctaPower: z.enum(["high", "medium", "low"]),
      })),
      keywordUsage: z.string(),
      tips: z.array(z.string()),
    }),
  },
}

// ── Rate limit mapping ─────────────────────────────────────────────────────────

const TOOL_RATE_MAP: Record<typeof TOOLS[number], string> = {
  "keyword-cluster":  "humanizer",    // 5/day
  "content-brief":    "humanizer",
  "schema-generator": "llm-calculator", // unlimited
  "robots-optimizer": "ai-detector",  // 5/day
  "title-generator":  "humanizer",
  "ai-detector":      "ai-detector",
  "meta-writer":      "humanizer",
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { tool, input, extra } = parsed.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user
      ? (await supabase.from("profiles").select("plan").eq("id", user.id).single()).data
      : null
    const plan = profile?.plan ?? "free"

    const rateSlug = TOOL_RATE_MAP[tool]
    const rl = await checkAndIncrementUsage(rateSlug, user?.id ?? null, plan)
    if (!rl.allowed) return rateLimitExceededResponse(rl.limit)

    const config = TOOL_CONFIG[tool]

    const { output } = await generateText({
      model: "openai/gpt-5-mini",
      output: Output.object({ schema: config.outputSchema }),
      system: config.system,
      messages: [{ role: "user", content: config.prompt(input, extra) }],
    })

    return Response.json({ success: true, tool, output, usageRemaining: rl.remaining })
  } catch (err) {
    console.error("[api/tools/multi] error:", err)
    return Response.json({ error: "internal_error", message: "An unexpected error occurred." }, { status: 500 })
  }
}
