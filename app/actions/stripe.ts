"use server"

import { redirect } from "next/navigation"
import { stripe } from "@/lib/stripe"
import { getPriceId, type BillingInterval } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"

export async function createCheckoutSession(productId: string, interval: BillingInterval) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/pricing")
  }

  const priceId = getPriceId(productId, interval)
  if (!priceId) {
    throw new Error(`Invalid product: ${productId}`)
  }

  // Fetch or create Stripe customer for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email, full_name")
    .eq("id", user.id)
    .single()

  let customerId: string | undefined = profile?.stripe_customer_id ?? undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    // Save customer ID back to profile
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aaioinc.com"

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard/billing?upgraded=1`,
    cancel_url:  `${siteUrl}/pricing?canceled=1`,
    metadata: {
      supabase_user_id: user.id,
      product_id: productId,
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        product_id: productId,
      },
    },
    allow_promotion_codes: true,
  })

  if (!session.url) throw new Error("No checkout URL returned from Stripe")
  redirect(session.url)
}

export async function createBillingPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    redirect("/pricing")
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aaioinc.com"

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${siteUrl}/dashboard/billing`,
  })

  redirect(session.url)
}
