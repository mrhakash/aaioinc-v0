"use client"

import Link from "next/link"
import { ArrowRight, Play, Sparkles, CheckCircle2, TrendingUp, Users, Zap } from "lucide-react"
import { useState, useEffect, useRef } from "react"

/* ─────────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────────── */
const TERMINAL_LINES = [
  { prefix: "→", text: "Analyzing GEO visibility signals...",   color: "text-muted-foreground", delay: 0 },
  { prefix: "→", text: "Running citation coverage check...",    color: "text-muted-foreground", delay: 900 },
  { prefix: "→", text: "Scoring schema & entity density...",    color: "text-muted-foreground", delay: 1800 },
  { prefix: "→", text: "Deploying semantic enhancements...",    color: "text-muted-foreground", delay: 2700 },
  { prefix: "→", text: "Generating AI-citation clusters...",    color: "text-muted-foreground", delay: 3600 },
  { prefix: "✓", text: "AI visibility score:",                  color: "text-success",          delay: 4500, metric: "+340%" },
]

function useTypewriter(text: string, started: boolean, speed = 22) {
  const [displayed, setDisplayed] = useState("")
  useEffect(() => {
    if (!started) { setDisplayed(""); return }
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, started, speed])
  return displayed
}

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
function useCounter(target: number, duration = 1400, started: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!started) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, started])
  return value
}

/* ─────────────────────────────────────────────
   Terminal line component
───────────────────────────────────────────── */
function TerminalLine({ prefix, text, color, metric, visible }: {
  prefix: string
  text: string
  color: string
  metric?: string
  visible: boolean
}) {
  const typed = useTypewriter(text, visible)
  return (
    <div
      className={`flex items-start gap-2 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <span className={`shrink-0 font-mono text-xs mt-0.5 ${color}`}>{prefix}</span>
      <span className={`font-mono text-xs ${color}`}>
        {typed}
        {metric && visible && typed === text && (
          <span className="text-success font-bold ml-1">{metric}</span>
        )}
        {visible && typed !== text && (
          <span className="animate-blink opacity-70">|</span>
        )}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Stat card
───────────────────────────────────────────── */
function StatCard({ value, suffix, label, started }: {
  value: number
  suffix: string
  label: string
  started: boolean
}) {
  const count = useCounter(value, 1200, started)
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 text-center">
      <p className="font-mono text-xl font-bold text-primary tabular-nums">
        {count}{suffix}
      </p>
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Hero
───────────────────────────────────────────── */
export function Hero() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [visibleLines, setVisibleLines] = useState<boolean[]>(TERMINAL_LINES.map(() => false))
  const [statsStarted, setStatsStarted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  /* Intersection observer → start animations when visible */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          TERMINAL_LINES.forEach((line, i) => {
            setTimeout(() => {
              setVisibleLines(prev => { const n = [...prev]; n[i] = true; return n })
            }, line.delay)
          })
          setTimeout(() => setStatsStarted(true), 800)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100dvh-3.5rem)] flex items-center px-4 sm:px-6 pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden"
      aria-label="Hero"
    >
      {/* Dot-grid background — uses foreground at low opacity so it's visible in both themes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 80% at 50% 60%, transparent 0%, var(--background) 80%)",
        }}
      />
      {/* Primary glow — slightly stronger so it reads on the lighter background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.09]"
        style={{ background: "radial-gradient(circle, #635BFF 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── Left: Text ── */}
        <div className="flex flex-col gap-6 lg:gap-7">

          {/* Badge */}
          <div className="animate-slide-up opacity-0 animate-slide-up-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5">
              <Sparkles size={11} className="text-primary" />
              <span className="font-mono text-[10px] font-semibold text-primary tracking-widest uppercase">
                Agentic AI Optimization — Now in Beta
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-display animate-slide-up opacity-0 animate-slide-up-2 text-[clamp(36px,5vw,60px)] font-extrabold text-foreground leading-[1.06] text-balance">
            One Platform.{" "}
            <span className="text-primary">Every AI Tool.</span>
            <br className="hidden sm:block" />
            {" "}Zero Friction.
          </h1>

          {/* Sub-headline */}
          <p className="animate-slide-up opacity-0 animate-slide-up-3 max-w-[480px] text-[16px] sm:text-[17px] text-muted-foreground leading-[1.72]">
            The all-in-one platform where bloggers, SEOs, and AI developers discover, build, and deploy autonomous AI systems. 14 free tools. 6 managed services.
          </p>

          {/* CTAs */}
          <div className="animate-slide-up opacity-0 animate-slide-up-4 flex flex-wrap items-center gap-3">
            <Link
              href="/auth/signup"
              className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Get Started Free
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/#contact"
              className="btn-press inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Play size={13} className="text-primary" />
              Book a Strategy Call
            </Link>
          </div>

          {/* Newsletter */}
          {!submitted ? (
            <div className="animate-slide-up opacity-0 animate-slide-up-5 max-w-[420px]" suppressHydrationWarning>
              <form
                onSubmit={handleSubmit}
                className="flex gap-2"
                aria-label="Newsletter signup"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com — get weekly AI updates"
                  className="flex-1 rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors min-w-0"
                />
                <button
                  type="submit"
                  className="btn-press shrink-0 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-slide-up opacity-0 animate-slide-up-5 flex items-center gap-2 text-sm text-success max-w-[420px]">
              <CheckCircle2 size={15} />
              <span>You&apos;re on the list — we&apos;ll be in touch.</span>
            </div>
          )}

          {/* Trust line */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-success" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Users size={12} className="text-primary" /> 2,400+ practitioners</span>
            <span className="flex items-center gap-1.5"><Zap size={12} className="text-warning" /> Ships in minutes</span>
          </div>
        </div>

        {/* ── Right: Terminal ── */}
        <div className="lg:justify-self-end w-full max-w-[500px]">

          {/* Terminal window */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            {/* Chrome bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/60 select-none">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27CA40]" />
              </div>
              <div className="flex items-center gap-1.5 ml-3 px-3 py-0.5 rounded-md bg-background border border-border flex-1 max-w-[220px]">
                <span className="w-2 h-2 rounded-full bg-success shrink-0" aria-hidden="true" />
                <span className="font-mono text-[10px] text-muted-foreground truncate">agentic-optimizer.sh</span>
              </div>
              <div className="ml-auto font-mono text-[9px] text-muted-foreground/40">v2.1.0</div>
            </div>

            {/* Terminal body */}
            <div className="p-5 space-y-3 min-h-[220px]" aria-live="polite" aria-label="Agent terminal output">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] text-muted-foreground/60">$</span>
                <span className="font-mono text-[10px] text-muted-foreground/60">run geo-optimizer --url example.com</span>
                <span className="animate-blink text-primary ml-1 font-mono text-xs" aria-hidden="true">|</span>
              </div>
              {TERMINAL_LINES.map((line, i) => (
                <TerminalLine
                  key={i}
                  prefix={line.prefix}
                  text={line.text}
                  color={line.color}
                  metric={line.metric}
                  visible={visibleLines[i]}
                />
              ))}
            </div>

            {/* Metric bar */}
            <div className="border-t border-border bg-secondary/30 px-5 py-3 flex items-center gap-3">
              <TrendingUp size={14} className="text-success shrink-0" />
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all duration-[2s] ease-out"
                  style={{ width: visibleLines[5] ? "100%" : "0%" }}
                />
              </div>
              <span className="font-mono text-xs text-success font-semibold whitespace-nowrap">+340% visibility</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-4 divide-x divide-border border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <StatCard value={14}  suffix=""   label="Tools"     started={statsStarted} />
            <StatCard value={6}   suffix=""   label="Services"  started={statsStarted} />
            <StatCard value={200} suffix="+"  label="Prompts"   started={statsStarted} />
            <StatCard value={9}   suffix=""   label="Categories" started={statsStarted} />
          </div>
        </div>
      </div>
    </section>
  )
}
