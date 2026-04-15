"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, FileText, Search, ChevronRight } from "lucide-react"
import { DefaultChatTransport } from "ai"
import { useChat } from "@ai-sdk/react"

// ── Preset definitions ──────────────────────────────────────────────────────

type Preset = {
  id: "geo-analyzer" | "content-brief" | "niche-scout"
  label: string
  tagline: string
  icon: typeof Sparkles
  placeholder: string
  exampleInputs: string[]
  color: string
  borderColor: string
}

const PRESETS: Preset[] = [
  {
    id: "geo-analyzer",
    label: "GEO Analyzer",
    tagline: "AI visibility report for any brand or domain",
    icon: Search,
    placeholder: "Enter a domain or brand (e.g. stripe.com, Notion)",
    exampleInputs: ["stripe.com", "Notion", "Ahrefs", "Zapier"],
    color: "text-primary",
    borderColor: "border-primary/40 bg-primary/5",
  },
  {
    id: "content-brief",
    label: "Content Brief",
    tagline: "Full SEO brief with outline, GEO angle, and meta",
    icon: FileText,
    placeholder: "Enter a target keyword (e.g. best project management tools)",
    exampleInputs: [
      "best project management tools for remote teams",
      "how to set up a home office",
      "AI automation for small business",
    ],
    color: "text-success",
    borderColor: "border-success/40 bg-success/5",
  },
  {
    id: "niche-scout",
    label: "Niche Scout",
    tagline: "A–F viability grade + affiliate + content plan",
    icon: Sparkles,
    placeholder: "Enter a niche keyword (e.g. indoor hydroponics for apartments)",
    exampleInputs: [
      "indoor hydroponics for apartments",
      "AI tools for lawyers",
      "keto meal prep for diabetics",
      "biohacking supplements",
    ],
    color: "text-warning",
    borderColor: "border-warning/40 bg-warning/5",
  },
]

const STEP_LABELS = ["Choose preset", "Enter input", "Run agent"]

// ── Markdown renderer (minimal, no deps) ────────────────────────────────────

function MiniMarkdown({ text }: { text: string }) {
  const lines = text.split("\n")
  return (
    <div className="flex flex-col gap-1.5 text-sm text-foreground leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) {
          return <p key={i} className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-wider mt-3 first:mt-0">{line.slice(4)}</p>
        }
        if (line.startsWith("## ")) {
          return <p key={i} className="text-base font-bold text-foreground mt-4 first:mt-0">{line.slice(3)}</p>
        }
        if (line.startsWith("# ")) {
          return <p key={i} className="text-lg font-extrabold text-foreground mt-4 first:mt-0">{line.slice(2)}</p>
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-semibold text-foreground">{line.slice(2, -2)}</p>
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">·</span>
              <span className="text-muted-foreground">{content}</span>
            </div>
          )
        }
        if (/^\d+\. /.test(line)) {
          const content = line.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, "$1")
          const num = line.match(/^(\d+)\./)?.[1]
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="font-mono text-xs text-primary font-bold mt-0.5 shrink-0 w-4">{num}.</span>
              <span className="text-muted-foreground">{content}</span>
            </div>
          )
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        // Inline bold
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i} className="text-muted-foreground">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-foreground font-semibold">{part}</strong> : part
            )}
          </p>
        )
      })}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0])
  const [userInput, setUserInput] = useState("")
  const outputRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/playground" }),
  })

  const isStreaming = status === "streaming" || status === "submitted"
  const lastMessage = messages.findLast((m) => m.role === "assistant")
  const outputText = lastMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") ?? ""

  function handleRun() {
    if (!userInput.trim()) return
    setStep(2)
    sendMessage(
      { text: userInput },
      { body: { preset: selectedPreset.id, input: userInput } }
    )
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 300)
  }

  function handleReset() {
    setMessages([])
    setUserInput("")
    setStep(0)
  }

  const PresetIcon = selectedPreset.icon

  return (
    <div className="min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">Agent Playground</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-success/30 bg-success/10 text-success px-2.5 py-0.5 text-xs font-mono font-medium">Free Demo</span>
            <span className="font-mono text-xs text-muted-foreground">Powered by Claude</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Agent Playground</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Try three of our AI agents in a scoped sandbox. Pick a preset, enter your input, and watch the agent run a real analysis.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0" role="list">
          {STEP_LABELS.map((label, idx) => (
            <div key={label} className="flex items-center gap-0 flex-1">
              <button
                role="listitem"
                onClick={() => step > idx && setStep(idx as 0 | 1 | 2)}
                className={`flex items-center gap-2 transition-colors ${step > idx ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 border transition-all ${
                  idx === step
                    ? "bg-primary text-primary-foreground border-primary"
                    : idx < step
                    ? "bg-success/20 text-success border-success/40"
                    : "bg-secondary text-muted-foreground border-border"
                }`}>
                  {idx < step ? "✓" : idx + 1}
                </span>
                <span className={`text-xs font-medium hidden sm:block ${idx === step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </button>
              {idx < STEP_LABELS.length - 1 && (
                <div className="flex-1 h-px mx-3 bg-border" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* Step 0 — Pick preset */}
        {step === 0 && (
          <div className="flex flex-col gap-4 animate-slide-up">
            <p className="text-sm font-medium text-foreground">Choose an agent preset:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRESETS.map((preset) => {
                const Icon = preset.icon
                const isSelected = selectedPreset.id === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={`text-left rounded-lg border p-5 flex flex-col gap-3 transition-all ${
                      isSelected ? preset.borderColor : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={isSelected ? preset.color : "text-muted-foreground"} />
                      <span className={`text-sm font-semibold ${isSelected ? preset.color : "text-foreground"}`}>{preset.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{preset.tagline}</p>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-primary">Selected ·</span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Continue <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1 — Enter input */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center gap-3 mb-1">
              <PresetIcon size={16} className={selectedPreset.color} />
              <p className="text-sm font-semibold text-foreground">{selectedPreset.label}</p>
              <button onClick={() => setStep(0)} className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors ml-auto">
                Change preset
              </button>
            </div>
            <textarea
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={selectedPreset.placeholder}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            />
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-mono">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {selectedPreset.exampleInputs.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setUserInput(ex)}
                    className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setStep(0)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Back
              </button>
              <button
                onClick={handleRun}
                disabled={!userInput.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Run Agent <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Output */}
        {step === 2 && (
          <div ref={outputRef} className="flex flex-col gap-6 animate-slide-up">
            {/* Context bar */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3 flex-wrap">
              <PresetIcon size={14} className={selectedPreset.color} />
              <span className="text-xs font-semibold text-foreground">{selectedPreset.label}</span>
              <span className="text-xs text-muted-foreground font-mono">→ {userInput}</span>
              <button
                onClick={handleReset}
                className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw size={11} /> New run
              </button>
            </div>

            {/* Output card */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-secondary/40">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <p className="font-mono text-xs text-muted-foreground">{selectedPreset.label} — output</p>
                {isStreaming && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
                    <span className="font-mono text-[10px] text-success">running</span>
                  </div>
                )}
                {!isStreaming && outputText && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="font-mono text-[10px] text-success">complete</span>
                  </div>
                )}
              </div>

              <div className="p-6 min-h-48">
                {isStreaming && !outputText && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
                    <span className="font-mono text-xs">Agent running...</span>
                  </div>
                )}
                {outputText ? (
                  <MiniMarkdown text={outputText} />
                ) : null}
                {isStreaming && outputText && (
                  <span className="inline-block w-0.5 h-4 bg-primary animate-blink ml-0.5" aria-hidden="true" />
                )}
              </div>
            </div>

            {/* Actions */}
            {!isStreaming && outputText && (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(outputText)}
                    className="rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    Copy output
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={11} /> Run another
                  </button>
                </div>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Unlock full agents <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* What the playground covers */}
        {step === 0 && (
          <div className="border-t border-border pt-8 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">What this playground covers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "GEO Analyzer", detail: "Visibility score + platform breakdown + top 3 action items. Powered by real brand knowledge." },
                { label: "Content Brief", detail: "Full outline, H2/H3 structure, GEO angle, meta description, and internal linking plan." },
                { label: "Niche Scout", detail: "A–F grade, 6-dimension analysis, affiliate programs, and a 5-post content plan." },
              ].map(({ label, detail }) => (
                <div key={label} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Free: 5 runs/day · Pro: unlimited runs + saved history + API access
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
