import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { checkAndIncrementUsage, rateLimitExceededResponse } from "@/lib/rate-limit"

export const maxDuration = 60

const RequestSchema = z.object({
  text: z.string().min(10).max(25000),
})

const HumanizerOutputSchema = z.object({
  humanized: z.string(),
  aiScoreBefore: z.number().int().min(0).max(100),
  aiScoreAfter: z.number().int().min(0).max(100),
  changeCount: z.number().int().min(0),
  summary: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { text } = parsed.data

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user
      ? (await supabase.from("profiles").select("plan").eq("id", user.id).single()).data
      : null
    const plan = profile?.plan ?? "free"

    // Free plan character limit
    const charLimit = plan === "free" ? 5000 : 25000
    if (text.length > charLimit) {
      return Response.json(
        { error: "character_limit_exceeded", message: `Text exceeds the ${charLimit.toLocaleString()} character limit for your plan.` },
        { status: 400 }
      )
    }

    // Rate limit
    const rl = await checkAndIncrementUsage("humanizer", user?.id ?? null, plan)
    if (!rl.allowed) return rateLimitExceededResponse(rl.limit)

    const { output } = await generateText({
      model: "anthropic/claude-opus-4.6",
      output: Output.object({ schema: HumanizerOutputSchema }),
      system: `You are an expert content editor who rewrites AI-generated text to sound naturally human-written.
Your goal is to eliminate AI-detection patterns while fully preserving meaning, keywords, and structure.

Rules:
- Vary sentence length and structure (short punchy sentences mixed with longer ones)
- Replace overused AI phrases: "delve into", "leverage", "paradigm", "multifaceted", "holistic", "In conclusion", "Furthermore", "utilize", "showcase"
- Break passive voice where natural
- Add conversational connectives: "Here's the thing —", "Worth noting:", "Put simply,"
- Preserve ALL SEO keywords, heading structure, and factual claims
- NEVER add new information or change meaning

Return a JSON object with:
- humanized: the rewritten text (preserve original line breaks and paragraph structure)
- aiScoreBefore: estimated % AI probability of original (70–95 range)
- aiScoreAfter: estimated % AI probability of humanized version (5–18 range)
- changeCount: number of phrases/sentences modified
- summary: one sentence describing the main transformations applied`,
      messages: [
        {
          role: "user",
          content: `Humanize the following text:\n\n${text}`,
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
    console.error("[api/tools/humanizer] error:", err)
    return Response.json({ error: "internal_error", message: "An unexpected error occurred." }, { status: 500 })
  }
}
