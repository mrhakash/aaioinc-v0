import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { checkAndIncrementUsage, rateLimitExceededResponse } from "@/lib/rate-limit"

export const maxDuration = 60

const RequestSchema = z.object({
  url: z.string().url().max(500),
})

const SignalSchema = z.object({
  label: z.string(),
  status: z.enum(["pass", "warn", "fail"]),
  detail: z.string(),
  impact: z.enum(["high", "medium", "low"]),
})

const OverviewOutputSchema = z.object({
  url: z.string(),
  pageTitle: z.string(),
  hasAIOverviewPotential: z.boolean(),
  overallScore: z.number().int().min(0).max(100),
  grade: z.enum(["A", "B", "C", "D", "F"]),
  signals: z.array(SignalSchema),
  triggeredByQueries: z.array(z.string()),
  missingElements: z.array(z.string()),
  topFix: z.string(),
  fullAnalysis: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid URL", details: parsed.error.flatten() }, { status: 400 })
    }

    const { url } = parsed.data

    // Auth + plan
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user
      ? (await supabase.from("profiles").select("plan").eq("id", user.id).single()).data
      : null
    const plan = profile?.plan ?? "free"

    // Rate limit
    const rl = await checkAndIncrementUsage("overview-checker", user?.id ?? null, plan)
    if (!rl.allowed) return rateLimitExceededResponse(rl.limit)

    const { output } = await generateText({
      model: "openai/gpt-5-mini",
      output: Output.object({ schema: OverviewOutputSchema }),
      system: `You are an expert in Google's AI Overviews (formerly SGE/Search Generative Experience). 
Your job is to analyze a URL and predict whether its content is likely to be cited in Google AI Overviews, based on known ranking signals.

Evaluate the following 8 signals (even if you cannot fetch the URL — use domain + URL structure as context):
1. FAQ/HowTo Schema markup presence (high impact)
2. Content type match (informational > transactional) (high impact)
3. E-E-A-T signals: author bio, expertise markers, citations (high impact)
4. Heading structure & scannability (medium impact)
5. Content freshness indicators in URL/domain (medium impact)
6. Readability level appropriate for topic (medium impact)
7. Internal linking signals from URL depth (low impact)
8. Mobile-friendliness indicators (low impact)

Return realistic estimates — if the URL is a product page or checkout, score it low. If it's a "how to" or "what is" guide, score higher.
Return JSON matching the schema. Include 4-6 signals, 2-5 triggeredByQueries that would show AI Overviews for this page, and 2-4 missingElements.`,
      messages: [
        {
          role: "user",
          content: `Analyze this URL for AI Overview potential: ${url}`,
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
    console.error("[api/tools/overview-checker] error:", err)
    return Response.json({ error: "internal_error", message: "An unexpected error occurred." }, { status: 500 })
  }
}
