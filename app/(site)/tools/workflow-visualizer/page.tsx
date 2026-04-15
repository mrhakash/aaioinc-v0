import type { Metadata } from "next"
import { WorkflowVisualizer } from "@/components/workflow-visualizer"

export const metadata: Metadata = {
  title: "Workflow Visualizer — AAIOINC | AI Pipeline Builder",
  description:
    "Explore 3 production AI workflow templates — blogging pipeline, client onboarding, and content factory. See how agentic systems automate multi-step tasks end-to-end.",
  alternates: { canonical: "https://aaioinc.com/tools/workflow-visualizer" },
  openGraph: {
    title: "AI Workflow Visualizer — AAIOINC",
    description: "3 preset AI agent pipeline visualizations: blogging, client onboarding, and content factory.",
    url: "https://aaioinc.com/tools/workflow-visualizer",
    type: "website",
  },
}

export default function WorkflowVisualizerPage() {
  return (
    <div className="min-h-screen">
      <section className="px-6 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl text-center flex flex-col gap-4">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Free Tool
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            AI Workflow Visualizer
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground leading-relaxed">
            See how production agentic pipelines are structured — step by step, node by node.
            Choose a preset workflow or use it as a blueprint for your own build.
          </p>
        </div>
      </section>

      <div className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <WorkflowVisualizer />
        </div>
      </div>
    </div>
  )
}
