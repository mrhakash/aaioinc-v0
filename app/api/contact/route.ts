import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL ?? "hello@aaioinc.com"
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "AAIOINC Contact <contact@aaioinc.com>"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, service, budget, message } = schema.parse(body)

    // Send notification email to team
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Contact: ${name} — ${service || "General Inquiry"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service || "Not specified"}</p>
        <p><strong>Budget:</strong> ${budget || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No message provided"}</p>
      `,
    })

    if (error) {
      console.error("[contact] Resend error:", error)
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We received your message — AAIOINC",
      html: `
        <h2>Thanks for reaching out, ${name}!</h2>
        <p>We received your message and will get back to you within one business day.</p>
        <p>If you requested a strategy call, keep an eye out for a calendar invite.</p>
        <br/>
        <p>— The AAIOINC Team</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? "Invalid input." }, { status: 400 })
    }
    console.error("[contact] Unexpected error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
