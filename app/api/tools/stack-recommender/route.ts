import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { checkAndIncrementUsage, rateLimitExceededResponse } from "@/lib/rate-limit"

export const maxDuration = 60

const RequestSchema = z.object({
  useCase: z.string().min(20).max(1000),
})

const StackToolSchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  pricing: z.string(),
  complexity: z.enum(["Easy", "Medium", "Hard"]),
  url: z.string().url(),
})

const StackOutputSchema = z.object({
  useCase: z.string(),
  summary: z.string(),
  totalCost: z.string(),
  tools: z.array(StackToolSchema).min(2).max(6),
  setupSteps: z.array(z.string()).min(3).max(6),
  alternatives: z.array(z.object({
    name: z.string(),
    tradeoff: z.string(),
  })).min(2).max(4),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { useCase } = parsed.data

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user
      ? (await supabase.from("profiles").select("plan").eq("id", user.id).single()).data
      : null
    const plan = profile?.plan ?? "free"

    // Rate limit
    const rl = await checkAndIncrementUsage("stack-recommender", user?.id ?? null, plan)
    if (!rl.allowed) return rateLimitExceededResponse(rl.limit)

    const { output } = await generateText({
      model: "openai/gpt-5-mini",
      output: Output.object({ schema: StackOutputSchema }),
      system: `You are an AI stack architect. Given a use case description, recommend the optimal set of AI tools and services.

For each recommended tool, provide:
- name: The actual product name (real tools only)
- category: LLM Provider | Automation | Vector DB | Embedding | Hosting | UI Framework | etc.
- description: 1-2 sentences on what it does and why it fits this use case
- pricing: Realistic monthly cost estimate (e.g. "$20/mo", "Free tier available", "$0.002/1K tokens")
- complexity: Easy (no-code/simple API), Medium (some dev work), Hard (significant custom dev)
- url: Official website URL

Guidelines:
- Recommend 3-5 tools that work together as a coherent stack
- Always include at least one LLM provider
- Prioritize cost-effectiveness for the described use case
- totalCost should be a realistic monthly estimate range (e.g. "$50-150/mo")
- setupSteps should be actionable and specific (not generic advice)
- alternatives should suggest different approaches with clear tradeoffs

Use only real, currently available tools and accurate pricing.`,
      messages: [
        {
          role: "user",
          content: `Recommend an AI stack for this use case:\n\n"${useCase}"`,
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
    console.error("[api/tools/stack-recommender] error:", err)
    return Response.json({ error: "internal_error", message: "An unexpected error occurred." }, { status: 500 })
  }
}
