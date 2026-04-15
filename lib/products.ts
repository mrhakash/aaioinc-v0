// Source of truth for all subscription plans.
// Stripe Price IDs are set via environment variables so they can differ
// between sandbox and live without code changes.

export type BillingInterval = "month" | "year"

export interface Product {
  id: string
  planId: "pro" | "agency"
  name: string
  description: string
  monthlyPrice: number  // in cents
  annualPrice: number   // in cents (per month, billed annually)
  stripePriceIds: {
    month: string
    year: string
  }
}

export const PRODUCTS: Product[] = [
  {
    id: "pro",
    planId: "pro",
    name: "AAIOINC Pro",
    description: "Unlimited GEO analyses, AI Overview checks, content humanization, niche scoring, and API access.",
    monthlyPrice: 2900,   // $29.00
    annualPrice: 2300,    // $23.00/mo billed $276/yr
    stripePriceIds: {
      month: process.env.STRIPE_PRICE_PRO_MONTHLY  ?? "price_pro_monthly",
      year:  process.env.STRIPE_PRICE_PRO_ANNUAL   ?? "price_pro_annual",
    },
  },
  {
    id: "agency",
    planId: "agency",
    name: "AAIOINC Agency",
    description: "Everything in Pro plus 10 team seats, white-label reports, multi-client workspaces, and 10k API calls/month.",
    monthlyPrice: 9900,   // $99.00
    annualPrice: 7900,    // $79.00/mo billed $948/yr
    stripePriceIds: {
      month: process.env.STRIPE_PRICE_AGENCY_MONTHLY ?? "price_agency_monthly",
      year:  process.env.STRIPE_PRICE_AGENCY_ANNUAL  ?? "price_agency_annual",
    },
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getPriceId(productId: string, interval: BillingInterval): string | undefined {
  const product = getProductById(productId)
  return product?.stripePriceIds[interval]
}
