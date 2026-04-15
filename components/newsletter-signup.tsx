"use client"

import { useState } from "react"
import { Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "banner"
  className?: string
}

export function NewsletterSignup({ variant = "card", className = "" }: NewsletterSignupProps) {
  const [email, setEmail]       = useState("")
  const [firstName, setFirst]   = useState("")
  const [status, setStatus]     = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.")
        setStatus("error")
        return
      }
      setStatus("success")
    } catch {
      setErrorMsg("Network error. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 ${className}`}>
        <CheckCircle2 size={18} className="text-primary shrink-0" />
        <div>
          <p className="font-semibold text-foreground text-sm">You&apos;re in!</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Check your inbox — Issue #1 arrives next Monday.
          </p>
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`} aria-label="Newsletter signup">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
          suppressHydrationWarning
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
        >
          {status === "loading" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>Subscribe <ArrowRight size={13} /></>
          )}
        </button>
        {status === "error" && (
          <p className="text-xs text-destructive mt-1">{errorMsg}</p>
        )}
      </form>
    )
  }

  if (variant === "banner") {
    return (
      <section className={`border-t border-border py-16 px-6 ${className}`}>
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center gap-6">
          <div className="rounded-full border border-primary/30 bg-primary/10 p-3">
            <Mail size={20} className="text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground text-balance">
              Agentic AI Weekly — free every Monday
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              GEO deep-dives, agent build walkthroughs, tool benchmarks, and LLM cost data. No fluff.
              Unsubscribe any time.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2" aria-label="Newsletter signup">
            <input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
              className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 sm:w-36 shrink-0"
              suppressHydrationWarning
            />
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
              suppressHydrationWarning
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
            >
              {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : "Subscribe"}
            </button>
          </form>
          {status === "error" && (
            <p className="text-xs text-destructive">{errorMsg}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Join 2,400+ developers, SEOs, and AI builders.
          </p>
        </div>
      </section>
    )
  }

  // Default: card variant
  return (
    <div className={`rounded-xl border border-border bg-card p-6 flex flex-col gap-5 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-2 shrink-0">
          <Mail size={16} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">Agentic AI Weekly</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            GEO insights, agent walkthroughs, and tool benchmarks — free every Monday.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2" aria-label="Newsletter signup">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
          suppressHydrationWarning
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {status === "loading" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>Subscribe free <ArrowRight size={13} /></>
          )}
        </button>
        {status === "error" && (
          <p className="text-xs text-destructive">{errorMsg}</p>
        )}
      </form>
      <p className="text-[11px] text-muted-foreground text-center">
        No spam. Unsubscribe any time.
      </p>
    </div>
  )
}
