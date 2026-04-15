import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import type Stripe from "stripe"

export const maxDuration = 60

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_PRICE_PRO_MONTHLY    ?? ""]: "pro",
  [process.env.STRIPE_PRICE_PRO_ANNUAL     ?? ""]: "pro",
  [process.env.STRIPE_PRICE_AGENCY_MONTHLY ?? ""]: "agency",
  [process.env.STRIPE_PRICE_AGENCY_ANNUAL  ?? ""]: "agency",
}

async function upsertSubscription(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  subscription: Stripe.Subscription,
  userId: string
) {
  const priceId = subscription.items.data[0]?.price?.id ?? ""
  const plan = PRICE_TO_PLAN[priceId] ?? "free"

  await supabase.from("subscriptions").upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    stripe_price_id: priceId,
    plan,
    status: subscription.status,
    current_period_start: new Date((subscription as Stripe.Subscription & { current_period_start: number }).current_period_start * 1000).toISOString(),
    current_period_end: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" })

  // Also update profiles.plan for quick access
  await supabase.from("profiles").update({ plan }).eq("id", userId)
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return Response.json({ error: "Missing signature or secret" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("[webhook/stripe] Signature verification failed:", err)
    return Response.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.CheckoutSession
        const userId = session.metadata?.supabase_user_id
        if (!userId || session.mode !== "subscription") break

        // Retrieve full subscription object
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        await upsertSubscription(supabase, subscription, userId)

        // Save customer ID to profile
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: session.customer as string })
          .eq("id", userId)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id
        if (!userId) break
        await upsertSubscription(supabase, subscription, userId)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id
        if (!userId) break

        await supabase
          .from("subscriptions")
          .update({ plan: "free", status: "canceled", cancel_at_period_end: false })
          .eq("user_id", userId)

        await supabase.from("profiles").update({ plan: "free" }).eq("id", userId)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string; customer?: string }
        if (!invoice.subscription) break
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        const userId = subscription.metadata?.supabase_user_id
        if (!userId) break

        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      default:
        // Unhandled event — not an error
        break
    }
  } catch (err) {
    console.error("[webhook/stripe] Handler error:", err)
    return Response.json({ error: "Handler failed" }, { status: 500 })
  }

  return Response.json({ received: true })
}
