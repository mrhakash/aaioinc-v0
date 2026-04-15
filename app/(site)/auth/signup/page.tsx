"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const roles = ["Blogger", "SEO Professional", "Developer", "Content Agency", "Enterprise Team"]

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setStep(2)
  }

  const handleRoleSubmit = async () => {
    if (!role) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: { role },
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setStep(3)
    }
  }

  const handleGoogle = async () => {
    setOauthLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setOauthLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-mono text-sm font-bold text-primary tracking-widest uppercase">AAIO</span>
            <span className="font-mono text-sm text-muted-foreground tracking-widest">INC</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Create your free account</h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 justify-center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-6 h-6 rounded-full border font-mono text-xs transition-colors ${
                s < step
                  ? "bg-primary border-primary text-primary-foreground"
                  : s === step
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {s < step ? <Check size={12} /> : s}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-5">
          {/* Step 1: Email / Google */}
          {step === 1 && (
            <>
              <button
                onClick={handleGoogle}
                disabled={oauthLoading}
                className="w-full flex items-center justify-center gap-3 rounded-md border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-60"
              >
                {oauthLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.31a3.68 3.68 0 01-1.6 2.42v2h2.59c1.52-1.4 2.39-3.45 2.39-5.88z" fill="#4285F4"/>
                    <path d="M8 16c2.16 0 3.97-.71 5.3-1.94l-2.59-2c-.72.48-1.63.76-2.71.76-2.08 0-3.85-1.4-4.48-3.29H.84v2.07A8 8 0 008 16z" fill="#34A853"/>
                    <path d="M3.52 9.53A4.8 4.8 0 013.27 8c0-.53.09-1.05.25-1.53V4.4H.84A8 8 0 000 8c0 1.29.31 2.5.84 3.6l2.68-2.07z" fill="#FBBC05"/>
                    <path d="M8 3.18c1.17 0 2.22.4 3.05 1.2l2.28-2.28C11.97.79 10.16 0 8 0A8 8 0 00.84 4.4l2.68 2.07C4.15 4.58 5.92 3.18 8 3.18z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-mono">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={14} />
                </button>
              </form>
            </>
          )}

          {/* Step 2: Role selection */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-semibold text-foreground">What best describes you?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ll personalize your dashboard and tool recommendations.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`w-full text-left rounded-md border px-4 py-3 text-sm transition-colors ${
                      role === r
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-secondary text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button
                onClick={handleRoleSubmit}
                disabled={!role || loading}
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Check size={16} className="text-primary" />
              </div>
              <p className="font-semibold text-foreground">Check your email.</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We sent a magic link to{" "}
                <span className="text-foreground font-medium">{email}</span>.
                Click it to activate your free account and go to your dashboard.
              </p>
              <Link
                href="/tools"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Explore Tools
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
