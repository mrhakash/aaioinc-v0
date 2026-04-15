"use client"

import Link from "next/link"
import { Share2, ArrowLeft, ArrowRight } from "lucide-react"

interface ToolMobileBarProps {
  toolTitle: string
}

export function ToolMobileBar({ toolTitle }: ToolMobileBarProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: toolTitle, url: window.location.href }).catch(() => {})
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 sm:hidden z-50 border-t border-border bg-card/95 backdrop-blur px-4 py-3 flex items-center gap-2">
      <button
        onClick={handleShare}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
      >
        <Share2 size={13} />
        Share
      </button>
      <Link
        href="/tools"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
      >
        <ArrowLeft size={12} />
        All Tools
      </Link>
      <Link
        href="/pricing"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Upgrade
        <ArrowRight size={12} />
      </Link>
    </div>
  )
}
