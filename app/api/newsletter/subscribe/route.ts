import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { WelcomeEmail } from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.NEWSLETTER_FROM_EMAIL ?? "Agentic AI Weekly <newsletter@aaioinc.com>"
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? ""

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, firstName } = schema.parse(body)

    // Add contact to Resend audience (if AUDIENCE_ID set)
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName: firstName ?? "",
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      })
    }

    // Send welcome confirmation email
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're in — welcome to Agentic AI Weekly",
      react: WelcomeEmail({ firstName: firstName ?? "there" }),
    })

    if (error) {
      console.error("[newsletter] Resend error:", error)
      return NextResponse.json({ error: "Failed to send confirmation." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }
    console.error("[newsletter] Unexpected error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
