"use client"

import { useEffect, useState } from "react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createCheckoutSession } from "@/app/actions/stripe"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutProps {
  productId: string
  onClose?: () => void
}

export function Checkout({ productId, onClose }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createCheckoutSession(productId)
      .then((result) => {
        if (result.error) {
          setError(result.error)
        } else if (result.clientSecret) {
          setClientSecret(result.clientSecret)
        }
      })
      .catch(() => setError("Failed to start checkout. Please try again."))
  }, [productId])

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary p-8 text-center">
        <AlertCircle size={24} className="text-danger" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <button
          onClick={onClose}
          className="text-xs text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
