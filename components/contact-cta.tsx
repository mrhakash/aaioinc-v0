"use client"

import { useState } from "react"
import { ArrowRight, Calendar, Mail, CheckCircle, MessageSquare, Zap } from "lucide-react"

const HIGHLIGHTS = [
  "Custom agent deployment from $499",
  "30-day hands-on onboarding",
  "Managed maintenance & monitoring",
  "SLA-backed support",
]

export function ContactCTA() {
  const [email, setEmail]     = useState("")
  const [message, setMessage] = useState("")
  const [name, setName]       = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } catch {
      // Silently fail - form will stay visible for retry
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">

        {/* Top label */}
        <div className="flex justify-center mb-10">
          <p className="text-mono-label text-[10px] text-muted-foreground">Get Started — Sprint Q2 2026</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Value proposition */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-display-sm text-[clamp(26px,3.5vw,42px)] font-extrabold text-foreground text-balance leading-tight">
                Ready to deploy{" "}
                <span className="text-primary">agentic AI</span>?
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm">
                Whether you need a custom agent setup, content automation, or a full GEO strategy — book a call or send a message. We respond within 24 hours.
              </p>
            </div>

            {/* Bullet points */}
            <ul className="flex flex-col gap-2.5">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle size={14} className="text-primary shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Quick CTA cards */}
            <div className="flex flex-col gap-3">
              <a
                href="https://calendly.com/aaioinc"
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">Book a Strategy Call</p>
                  <p className="text-xs text-muted-foreground">30-min free consultation — no sales pitch</p>
                </div>
                <ArrowRight size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="mailto:hello@aaioinc.com"
                className="card-hover flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">Email Us</p>
                  <p className="text-xs text-muted-foreground">hello@aaioinc.com</p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href="https://discord.gg/aaioinc"
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">Join Discord</p>
                  <p className="text-xs text-muted-foreground">Real-time community + live support</p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </div>

          {/* RIGHT — Contact form */}
          <div className="rounded-2xl border border-border bg-card p-7">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-5">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
                  <CheckCircle size={26} className="text-primary" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold text-foreground text-lg">Message received!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    We&apos;ll get back to you within 24 hours. Keep an eye on <span className="text-foreground font-medium">{email}</span>.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setEmail(""); setMessage(""); setName("") }}
                  className="text-xs text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold text-foreground text-lg">Send us a message</h3>
                  <p className="text-xs text-muted-foreground">We respond within 24 hours. No spam, ever.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-muted-foreground">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                    suppressHydrationWarning
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cta-email" className="text-xs font-medium text-muted-foreground">Email</label>
                  <input
                    id="cta-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                    suppressHydrationWarning
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-muted-foreground">How can we help?</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="Tell us about your project, goals, or questions..."
                    className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                    suppressHydrationWarning
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
