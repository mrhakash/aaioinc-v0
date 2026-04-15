import type { Metadata } from "next"
import { PricingClient } from "@/components/pricing-client"

export const metadata: Metadata = {
  title: "Pricing — AAIOINC",
  description:
    "Free forever for core tools. Pro at $29/month, Agency at $99/month, Enterprise custom. No hidden fees, no bait-and-switch.",
}

export default function PricingPage() {
  return <PricingClient />
}
