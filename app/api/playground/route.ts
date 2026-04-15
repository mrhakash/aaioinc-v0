import { streamText } from "ai"
import { z } from "zod"
import { checkAndIncrementUsage, rateLimitExceededResponse } from "@/lib/rate-limit"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

const RequestSchema = z.object({
  preset: z.enum(["geo-analyzer", "content-brief", "niche-scout"]),
  input: z.string().min(2).max(2000),
})

const PRESET_SYSTEMS: Record<string, string> = {
  "geo-analyzer": `You are an AI-powered GEO (Generative Engine Optimization) analyst. Analyze the given brand or domain and produce a structured GEO visibility report covering:

1. **Executive Summary** — 2 sentences on overall AI visibility status
2. **Platform-by-Platform Analysis** — Estimate brand presence in ChatGPT, Perplexity, Claude, and Gemini. For each: cited (yes/no), typical context, sentiment (positive/neutral/negative/none)
3. **GEO Score** — Give a score from 0–100 with reasoning
4. **Schema Coverage Gap** — What schema types are likely missing based on the brand category
5. **Top 3 Action Items** — Specific, implementable GEO improvement steps with expected impact

Format with Markdown headings. Be specific and actionable. If the brand is small/unknown, note this honestly.`,

  "content-brief": `You are an expert content strategist and SEO specialist. Create a comprehensive content brief for the given target keyword. Include:

1. **Target Keyword & Intent** — Primary keyword, search intent (informational/commercial/transactional), and 3 semantic variants
2. **Recommended Title** — An optimized H1 (under 60 chars)
3. **Outline** — Full H2 and H3 structure (minimum 5 H2s with 2–3 H3s each)
4. **Recommended Word Count** — With reasoning based on SERP competition level
5. **Key Topics to Cover** — 8–10 must-have subtopics based on SERP analysis
6. **GEO Angle** — How to write this content to be cited in AI-generated answers (schema types, citation-worthy claims, stat-backed assertions)
7. **Internal Linking Suggestions** — 3 logical internal link anchor opportunities
8. **Meta Description** — 155-char optimized meta description

Format with clear Markdown sections.`,

  "niche-scout": `You are a niche research analyst specializing in affiliate marketing and content business viability. Analyze the given niche keyword and produce a detailed viability report:

1. **Niche Overview** — Brief description and target audience profile
2. **Viability Score** — A–F grade with a 0–100 numeric score and confidence interval
3. **Six Dimensions Analysis**:
   - Competition (SERP difficulty, major players)
   - Search Volume (estimated monthly, trend direction)
   - Monetization Potential (affiliate programs, avg commission, RPM estimate)
   - AI Visibility Opportunity (GEO citation gap — is this niche underrepresented in AI answers?)
   - Content Gap (underserved subtopics and formats)
   - Trend Direction (rising/stable/declining with evidence)
4. **Top Affiliate Programs** — 3–5 programs with commission rates
5. **Recommended First Content Pieces** — 5 article titles to publish first
6. **Red Flags** — Any concerns (seasonal, regulatory, saturation)
7. **Next Steps** — 3 specific actions to validate and launch

Be realistic and evidence-based.`,
}

const PRESET_PROMPTS: Record<string, (input: string) => string> = {
  "geo-analyzer": (input) => `Analyze GEO visibility for: "${input}"`,
  "content-brief": (input) => `Create a comprehensive content brief for the keyword: "${input}"`,
  "niche-scout": (input) => `Analyze niche viability for: "${input}"`,
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { preset, input } = parsed.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user
      ? (await supabase.from("profiles").select("plan").eq("id", user.id).single()).data
      : null
    const plan = profile?.plan ?? "free"

    // Playground uses the humanizer rate-limit bucket (5/day free)
    const rl = await checkAndIncrementUsage("humanizer", user?.id ?? null, plan)
    if (!rl.allowed) return rateLimitExceededResponse(rl.limit)

    const result = streamText({
      model: "anthropic/claude-opus-4.6",
      system: PRESET_SYSTEMS[preset],
      messages: [{ role: "user", content: PRESET_PROMPTS[preset](input) }],
      maxOutputTokens: 1500,
    })

    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error("[api/playground] error:", err)
    return Response.json({ error: "internal_error", message: "An unexpected error occurred." }, { status: 500 })
  }
}
