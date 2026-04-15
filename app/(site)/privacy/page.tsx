import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — AAIOINC",
  description: "AAIOINC Privacy Policy — how we collect, use, and protect your data.",
}

const sections = [
  {
    title: "Information we collect",
    content: "We collect information you provide directly (email, usage data, form submissions) and information collected automatically (usage analytics, IP address, browser type). We do not sell your personal data to third parties.",
  },
  {
    title: "How we use your information",
    content: "We use your information to provide and improve the platform, send product updates you opt into, process payments via Stripe, and provide customer support. We use anonymized usage data for product analytics.",
  },
  {
    title: "Data storage and security",
    content: "Data is stored in Supabase (EU region by default) with encryption at rest and in transit. We are pursuing SOC 2 Type II certification. All tool inputs are processed transiently and not stored beyond your session unless you explicitly save a result.",
  },
  {
    title: "Cookies",
    content: "We use essential cookies for authentication and session management. We use analytics cookies only with your consent. You can manage cookie preferences from the Cookie Settings link in the footer.",
  },
  {
    title: "GDPR and data subject rights",
    content: "If you are in the EU/EEA, you have the right to access, correct, port, or delete your personal data. To exercise these rights, contact privacy@aaioinc.com. We will respond within 30 days.",
  },
  {
    title: "Data retention",
    content: "We retain account data for as long as your account is active. Free tier tool results are retained for 30 days. Pro/Agency results are retained indefinitely until you delete them. You can delete your account and all associated data at any time from your dashboard settings.",
  },
  {
    title: "Contact",
    content: "For privacy-related questions or requests, contact privacy@aaioinc.com. Our data controller is AAIOINC, Inc.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-3xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Legal</p>
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground font-mono">Last updated: April 13, 2026</p>
        </div>
        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-2">
              <h2 className="font-semibold text-foreground">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
