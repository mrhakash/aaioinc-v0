import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { checkAndIncrementUsage, rateLimitExceededResponse } from "@/lib/rate-limit"

export const maxDuration = 60

const RequestSchema = z.object({
  niche: z.string().min(3).max(200),
})

const NicheOutputSchema = z.object({
  niche: z.string(),
  grade: z.enum(["A", "B", "C", "D", "F"]),
  overall: z.number().int().min(0).max(100),
  dimensions: z.object({
    competition: z.number().int().min(0).max(100),
    searchVolume: z.number().int().min(0).max(100),
    monetization: z.number().int().min(0).max(100),
    aiOpportunity: z.number().int().min(0).max(100),
    contentGap: z.number().int().min(0).max(100),
    trend: z.number().int().min(0).max(100),
  }),
  trendDirection: z.enum(["rising", "stable", "declining"]),
  affiliatePrograms: z.array(z.string()),
  nextSteps: z.array(z.string()),
  insight: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { niche } = parsed.data

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user
      ? (await supabase.from("profiles").select("plan").eq("id", user.id).single()).data
      : null
    const plan = profile?.plan ?? "free"

    // Rate limit
    const rl = await checkAndIncrementUsage("niche-scorer", user?.id ?? null, plan)
    if (!rl.allowed) return rateLimitExceededResponse(rl.limit)

    const { output } = await generateText({
      model: "openai/gpt-5-mini",
      output: Output.object({ schema: NicheOutputSchema }),
      system: `You are a niche profitability analyst. Score the given niche keyword across 6 dimensions to help content creators and affiliate marketers evaluate opportunity.

Dimensions (each 0–100, higher = better):
1. competition (100 = very low competition, easy to rank)
2. searchVolume (100 = very high monthly search volume)
3. monetization (100 = very high earning potential — affiliate rates, ad RPM, product prices)
4. aiOpportunity (100 = major gap in AI-generated content, easy to rank in AI overviews)
5. contentGap (100 = lots of underserved sub-topics to cover)
6. trend (100 = strongly rising trend, 50 = stable, 0 = declining)

Grade thresholds: A ≥ 75, B ≥ 60, C ≥ 45, D ≥ 30, F < 30

Also return:
- affiliatePrograms: 3 real affiliate programs relevant to this niche with realistic commission rates
- nextSteps: 3 specific, actionable steps to enter and monetize this niche TODAY
- insight: 1–2 sentence expert insight on the niche's current opportunity level

Be accurate and realistic. Base scores on real market data knowledge.`,
      messages: [
        {
          role: "user",
          content: `Score this niche: "${niche}"`,
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
    console.error("[api/tools/niche-scorer] error:", err)
    return Response.json({ error: "internal_error", message: "An unexpected error occurred." }, { status: 500 })
  }
}
