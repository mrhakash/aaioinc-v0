import type { Metadata } from "next"
import Link from "next/link"
import { Lock, ArrowRight } from "lucide-react"

export const metadata: Metadata = { title: "Saved Prompts — AAIOINC", robots: { index: false } }

export default function DashboardPromptsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <h1 className="text-xl font-bold text-foreground">Saved Prompts</h1>

      <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center text-center gap-5">
        <div className="w-12 h-12 rounded-full border border-border bg-secondary flex items-center justify-center">
          <Lock size={18} className="text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-foreground">Fork and save prompts with Pro</p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Pro users can fork any prompt from the library, customize it to their workflow, and save it here for quick access.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/pricing" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2">
            Upgrade to Pro <ArrowRight size={13} />
          </Link>
          <Link href="/prompts" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors">
            Browse Prompt Library
          </Link>
        </div>
      </div>
    </div>
  )
}
