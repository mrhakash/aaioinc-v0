"use client"

// Analytics event tracking based on Content & Growth Strategy spec
// Events are sent to Vercel Analytics and can be forwarded to other providers

type AnalyticsEvent =
  | { name: "page_view"; properties: { path: string; referrer?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string } }
  | { name: "tool_used"; properties: { tool_slug: string; input_length?: number; plan: "free" | "pro" | "agency" } }
  | { name: "tool_shared"; properties: { tool_slug: string; platform: "twitter" | "linkedin" | "copy" | "native" } }
  | { name: "signup_started"; properties: { trigger_location: string } }
  | { name: "signup_completed"; properties: { method: "email" | "google" | "github"; role?: string } }
  | { name: "upgrade_clicked"; properties: { current_plan: string; target_plan: string } }
  | { name: "upgrade_completed"; properties: { plan: string; period: "monthly" | "yearly"; revenue: number } }
  | { name: "service_inquiry"; properties: { service_slug: string; budget?: string } }
  | { name: "newsletter_subscribed"; properties: { source: "hero" | "footer" | "cta" | "blog" } }
  | { name: "prompt_forked"; properties: { prompt_id: string } }
  | { name: "search_used"; properties: { query: string; results_count: number } }
  | { name: "free_limit_hit"; properties: { tool_slug: string; plan: string } }
  | { name: "resource_submitted"; properties: { category: string } }
  | { name: "demo_requested"; properties: { source: string } }
  | { name: "cta_clicked"; properties: { cta_id: string; location: string } }

/**
 * Track an analytics event
 * Uses Vercel Analytics track() when available, falls back to console in dev
 */
export function track<T extends AnalyticsEvent>(event: T["name"], properties: T["properties"]) {
  // Vercel Analytics
  if (typeof window !== "undefined" && "va" in window && typeof (window as unknown as { va: (cmd: string, ...args: unknown[]) => void }).va === "function") {
    (window as unknown as { va: (cmd: string, ...args: unknown[]) => void }).va("track", event, properties)
  }

  // Log in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties)
  }
}

/**
 * Track tool usage event
 */
export function trackToolUsed(toolSlug: string, inputLength?: number, plan: "free" | "pro" | "agency" = "free") {
  track("tool_used", { tool_slug: toolSlug, input_length: inputLength, plan })
}

/**
 * Track tool share event
 */
export function trackToolShared(toolSlug: string, platform: "twitter" | "linkedin" | "copy" | "native") {
  track("tool_shared", { tool_slug: toolSlug, platform })
}

/**
 * Track newsletter subscription
 */
export function trackNewsletterSubscribed(source: "hero" | "footer" | "cta" | "blog") {
  track("newsletter_subscribed", { source })
}

/**
 * Track CTA click
 */
export function trackCtaClicked(ctaId: string, location: string) {
  track("cta_clicked", { cta_id: ctaId, location })
}

/**
 * Track service inquiry
 */
export function trackServiceInquiry(serviceSlug: string, budget?: string) {
  track("service_inquiry", { service_slug: serviceSlug, budget })
}

/**
 * Track demo request
 */
export function trackDemoRequested(source: string) {
  track("demo_requested", { source })
}

/**
 * Track upgrade click
 */
export function trackUpgradeClicked(currentPlan: string, targetPlan: string) {
  track("upgrade_clicked", { current_plan: currentPlan, target_plan: targetPlan })
}

/**
 * Track free limit hit
 */
export function trackFreeLimitHit(toolSlug: string, plan: string) {
  track("free_limit_hit", { tool_slug: toolSlug, plan })
}

/**
 * Track search usage
 */
export function trackSearchUsed(query: string, resultsCount: number) {
  track("search_used", { query, results_count: resultsCount })
}
