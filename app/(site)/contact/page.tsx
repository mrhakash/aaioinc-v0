"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"

const serviceOptions = [
  "OpenClaw Setup & Deployment",
  "AI Blogging Service",
  "AI SEO Service",
  "AI Content Service",
  "Niche Research Service",
  "MCP Skills Development",
  "General Inquiry",
  "Partnership",
]

const budgetOptions = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", email: "", service: "", budget: "", message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center flex flex-col gap-5">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <ArrowRight size={20} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Message received.</h1>
          <p className="text-muted-foreground leading-relaxed">
            We&apos;ll get back to you within one business day. If you booked a strategy call, check your email for the calendar invite.
          </p>
          <Link href="/" className="text-sm font-mono text-primary hover:underline">
            Back to homepage &rarr;
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            Book a strategy call or send a message.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Free 30-minute strategy calls for any service inquiry. We&apos;ll assess your stack and recommend the highest-leverage engagement.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                <input
                  id="name" type="text" required value={form.name} onChange={update("name")}
                  placeholder="Your name"
                  className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  suppressHydrationWarning
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="email" type="email" required value={form.email} onChange={update("email")}
                  placeholder="you@company.com"
                  className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="service" className="text-sm font-medium text-foreground">Service interest</label>
              <select
                id="service" value={form.service} onChange={update("service")}
                className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Select a service...</option>
                {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="budget" className="text-sm font-medium text-foreground">Budget range</label>
              <select
                id="budget" value={form.budget} onChange={update("budget")}
                className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Select a range...</option>
                {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">Brief description</label>
              <textarea
                id="message" rows={4} value={form.message} onChange={update("message")}
                placeholder="Tell us what you're trying to accomplish..."
                className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                suppressHydrationWarning
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2 self-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
