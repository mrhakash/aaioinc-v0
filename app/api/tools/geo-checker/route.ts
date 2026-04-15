import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { checkAndIncrementUsage, rateLimitExceededResponse } from "@/lib/rate-limit"

export const maxDuration = 60

const RequestSchema = z.object({
  brand: z.string().min(2).max(200),
})

const PlatformResultSchema = z.object({
  platform: z.string(),
  mentions: z.number().int().min(0),
  sentiment: z.enum(["positive", "neutral", "negative", "none"]),
  context: z.string().nullable(),
  cited: z.boolean(),
})

const GEOOutputSchema = z.object({
  brand: z.string(),
  visibilityScore: z.number().int().min(0).max(100),
  platforms: z.array(PlatformResultSchema),
  competingBrands: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { brand } = parsed.data

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user
      ? (await supabase.from("profiles").select("plan").eq("id", user.id).single()).data
      : null
    const plan = profile?.plan ?? "free"

    // Rate limit
    const rl = await checkAndIncrementUsage("geo-checker", user?.id ?? null, plan)
    if (!rl.allowed) return rateLimitExceededResponse(rl.limit)

    // Clean the brand name (strip protocol/www if URL was pasted)
    const cleanBrand = brand
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .trim()

    const { output } = await generateText({
      model: "openai/gpt-5-mini",
      output: Output.object({ schema: GEOOutputSchema }),
      system: `You are an AI search visibility analyst. Your job is to estimate how visible a given brand is across major AI platforms: ChatGPT, Perplexity, Claude, and Gemini.

Based on your training data knowledge of the brand, provide realistic estimates of:
1. How often the brand appears in AI-generated responses on each platform
2. The sentiment of those mentions (positive/neutral/negative/none)
3. Realistic context snippets when the brand is mentioned
4. Competing brands that are typically mentioned in the same context
5. A 0–100 visibility score (0 = never mentioned, 100 = top-of-mind leader)
6. 3 specific, actionable GEO improvement recommendations

Be realistic and accurate based on actual brand knowledge. For unknown/small brands, score low (5–25) and show "none" sentiment. For well-known brands score appropriately.

Return valid JSON matching the schema exactly.`,
      messages: [
        {
          role: "user",
          content: `Analyze GEO visibility for the brand/domain: "${cleanBrand}"`,
        },
      ],
    })

    return Response.json({
      success: true,
      ...output,
      usageRemaining: rl.remaining,
      plan,
    })
  } catch (err) {
    console.error("[api/tools/geo-checker] error:", err)
    return Response.json({ error: "internal_error", message: "An unexpected error occurred." }, { status: 500 })
  }
}
