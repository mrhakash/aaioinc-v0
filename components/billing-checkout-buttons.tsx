"use client"

import { useState } from "react"
import { Checkout } from "@/components/checkout"

interface Props {
  planId: "pro" | "agency"
}

const PRODUCT_IDS: Record<Props["planId"], { monthly: string; annual: string }> = {
  pro:    { monthly: "pro-monthly",    annual: "pro-annual" },
  agency: { monthly: "agency-monthly", annual: "agency-annual" },
}

export function BillingCheckoutButtons({ planId }: Props) {
  const [checkoutProduct, setCheckout] = useState<string | null>(null)
  const [annual, setAnnual] = useState(false)

  const productId = annual
    ? PRODUCT_IDS[planId].annual
    : PRODUCT_IDS[planId].monthly

  return (
    <>
      {checkoutProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setCheckout(null) }}
        >
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <button
              onClick={() => setCheckout(null)}
              aria-label="Close checkout"
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              &times;
            </button>
            <Checkout productId={checkoutProduct} onClose={() => setCheckout(null)} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => { setAnnual(false); setCheckout(productId) }}
          className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity text-center"
        >
          Monthly
        </button>
        <button
          onClick={() => { setAnnual(true); setCheckout(annual ? productId : PRODUCT_IDS[planId].annual) }}
          className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors text-center"
        >
          Annual <span className="text-xs text-success font-mono">–20%</span>
        </button>
      </div>
    </>
  )
}
