import type { Metadata } from "next"
import SubmitResourceForm from "./client"

export const metadata: Metadata = {
  title: "Submit a Resource — AAIOINC",
  description:
    "Submit a guide, tool, course, template, or research paper to the AAIOINC Resource Directory. We review every submission and publish the best ones.",
}

export default function SubmitResourcePage() {
  return (
    <div className="min-h-screen">
      <section className="px-6 py-20 border-b border-border">
        <div className="mx-auto max-w-2xl text-center flex flex-col gap-5">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Resource Directory</p>
          <h1 className="text-4xl font-bold text-foreground text-balance">Submit a resource</h1>
          <p className="text-muted-foreground leading-relaxed">
            Share a guide, tool, course, research report, or template with the AAIOINC community. We review every
            submission and publish the best ones — usually within 3–5 business days.
          </p>
        </div>
      </section>

      <SubmitResourceForm />
    </div>
  )
}
