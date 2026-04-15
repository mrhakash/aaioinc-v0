export type PlanId = "free" | "pro" | "agency"

export interface Plan {
  id: PlanId
  name: string
  description: string
  priceMonthly: number
  features: string[]
  limits: {
    toolRunsPerDay: number
    charLimitPerDoc: number
    apiAccess: boolean
    domains: number
  }
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Get started with essential AI SEO tools",
    priceMonthly: 0,
    features: [
      "3 free tool runs per day",
      "5,000 character limit per document",
      "Basic GEO Score analysis",
      "Community support",
    ],
    limits: {
      toolRunsPerDay: 3,
      charLimitPerDoc: 5000,
      apiAccess: false,
      domains: 1,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Unlimited access for professionals",
    priceMonthly: 29,
    features: [
      "Unlimited tool runs",
      "25,000 character limit per document",
      "Full GEO Score + recommendations",
      "API access",
      "Usage history & analytics",
      "Priority support",
    ],
    limits: {
      toolRunsPerDay: -1, // unlimited
      charLimitPerDoc: 25000,
      apiAccess: true,
      domains: 1,
    },
  },
  agency: {
    id: "agency",
    name: "Agency",
    description: "Multi-site management for teams",
    priceMonthly: 99,
    features: [
      "Everything in Pro",
      "Multi-site GEO tracking",
      "White-label reports",
      "Manage up to 5 domains",
      "Team collaboration",
      "Dedicated support",
    ],
    limits: {
      toolRunsPerDay: -1,
      charLimitPerDoc: 50000,
      apiAccess: true,
      domains: 5,
    },
  },
}

export function getPlanById(id: PlanId): Plan {
  return PLANS[id]
}
