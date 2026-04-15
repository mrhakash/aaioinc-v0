import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ShieldCheck, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PLANS, type PlanId } from "@/lib/plans"
import { BillingCheckoutButtons } from "@/components/billing-checkout-buttons"

export const metadata: Metadata = { title: "Billing — AAIOINC", robots: { index: false } }

export default async function DashboardBillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Read plan from profiles (kept in sync by Stripe webhook)
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id")
    .eq("id", user.id)
    .single()

  // Also fetch subscription record for period / cancellation info
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id, status, current_period_end, cancel_at_period_end, stripe_price_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const planId: PlanId = (profile?.plan as PlanId) || "free"
  const plan = PLANS[planId]

  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-xl font-bold text-foreground">Billing</h1>

      {/* Current plan card */}
      <div className="rounded-xl border border-border bg-secondary p-6 flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Current Plan</p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-foreground">{plan.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
            {sub?.status ?? "Active"}
          </span>
        </div>

        {/* Period info */}
        {periodEnd && (
          <p className="text-xs text-muted-foreground font-mono">
            {sub?.cancel_at_period_end
              ? `Cancels on ${periodEnd}`
              : `Renews on ${periodEnd}`}
          </p>
        )}

        <ul className="grid gap-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check size={13} className="text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Manage subscription (paid plans only) */}
        {planId !== "free" && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
          >
            Manage subscription <ExternalLink size={11} />
          </Link>
        )}
      </div>

      {/* Upgrade options */}
      {planId === "free" && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex flex-col gap-5">
          <p className="font-semibold text-foreground">Upgrade to unlock the full platform</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["pro", "agency"] as const).map((pid) => {
              const p = PLANS[pid]
              return (
                <div key={pid} className="rounded-xl border border-border bg-secondary p-5 flex flex-col gap-3">
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    ${p.priceMonthly}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <ul className="flex flex-col gap-1.5">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check size={12} className="text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {/* Client component handles the Stripe Checkout modal */}
                  <BillingCheckoutButtons planId={pid} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck size={13} className="text-primary shrink-0" />
        <span>Payments are processed securely by Stripe. We never store card details.</span>
      </div>
    </div>
  )
}
