import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight, LayoutDashboard } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) redirect("/pricing")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch plan from profile (webhook will have updated it by now)
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, full_name, email")
    .eq("id", user.id)
    .single()

  const plan = profile?.plan ?? "pro"
  const name = profile?.full_name?.split(" ")[0] ?? profile?.email ?? "there"
  const planLabel = plan === "agency" ? "Agency" : "Pro"

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-badge ring-1 ring-success/30">
          <CheckCircle2 size={40} className="text-success" />
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            Payment confirmed
          </p>
          <h1 className="font-display text-3xl font-bold text-foreground text-balance">
            Welcome to {planLabel}, {name}
          </h1>
          <p className="text-muted-foreground">
            Your subscription is active. All limits have been unlocked — head to
            your dashboard to start using your tools.
          </p>
        </div>

        {/* What&apos;s unlocked */}
        <div className="rounded-xl border border-border bg-secondary p-5 text-left space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Unlocked for you
          </p>
          {[
            "Unlimited GEO Score analyses",
            "Unlimited AI Overview checks",
            "Unlimited Content Humanizer",
            "Unlimited Niche Profitability scoring",
            plan === "agency" ? "10 team seats + white-label reports" : "1,000 API calls/month",
            "Full tool history in your dashboard",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 size={14} className="shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <LayoutDashboard size={15} />
            Go to Dashboard
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            Explore Tools
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  )
}
