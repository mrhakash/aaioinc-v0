"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

const SCHEMA_TYPES = [
  "Article", "BlogPosting", "FAQPage", "HowTo", "Product", "LocalBusiness",
  "Organization", "Person", "Event", "Recipe", "Course", "VideoObject",
  "BreadcrumbList", "Review", "SoftwareApplication", "WebPage",
]

interface SchemaResult {
  schemaType: string
  jsonLd: string
  fieldsGenerated: string[]
  validationNotes: string
  additionalSchemas: string[]
}

export default function SchemaGeneratorPage() {
  const [schemaType, setSchemaType] = useState("Article")
  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<SchemaResult | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleRun() {
    if (!input.trim()) { setError("Describe your page or content."); return }
    setError(""); setRunning(true); setResult(null)
    try {
      const res = await fetch("/api/tools/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "schema-generator", input, extra: { schemaType } }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? "Something went wrong."); return }
      setResult(data.output)
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setRunning(false)
    }
  }

  function copySchema() {
    if (!result) return
    const scriptTag = `<script type="application/ld+json">\n${result.jsonLd}\n</script>`
    navigator.clipboard.writeText(scriptTag)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Tools</Link>
          <span>/</span><span className="text-foreground">Schema Markup Generator</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono">Free · Unlimited</span>
            <span className="font-mono text-xs text-muted-foreground">Developer Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Schema Markup Generator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Select a schema type, describe your page, and get valid JSON-LD markup ready to copy into your HTML.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Schema type selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Schema type</label>
            <div className="flex flex-wrap gap-2">
              {SCHEMA_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSchemaType(type)}
                  className={`rounded-full border px-3 py-1 text-xs font-mono transition-all ${
                    schemaType === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="schema-input">
              Page description / content details
            </label>
            <textarea
              id="schema-input"
              rows={5}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError("") }}
              placeholder={`Describe your ${schemaType} page. E.g. for Article: title, author name, publish date, description, image URL, and website URL...`}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {running ? <><span className="w-3 h-3 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Generating...</> : <>Generate Schema <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>

        {result && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm font-semibold text-foreground">{result.schemaType} Schema — {result.fieldsGenerated.length} fields</p>
              <button onClick={copySchema} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                {copied ? <><Check size={11} />Copied as script tag</> : <><Copy size={11} />Copy as &lt;script&gt; tag</>}
              </button>
            </div>

            {/* JSON-LD display */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/40">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <p className="font-mono text-xs text-muted-foreground">application/ld+json</p>
                <button onClick={copySchema} className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto p-5 text-[11px] font-mono text-primary leading-relaxed whitespace-pre-wrap">
                {result.jsonLd}
              </pre>
            </div>

            {/* Validation notes */}
            <div className="rounded-lg border border-success/30 bg-success/5 p-4 flex flex-col gap-1.5">
              <p className="text-xs font-mono font-bold text-success uppercase">Validation</p>
              <p className="text-sm text-foreground leading-relaxed">{result.validationNotes}</p>
            </div>

            {/* Additional schemas */}
            {result.additionalSchemas.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
                <p className="text-xs font-mono font-bold text-muted-foreground uppercase">Consider also adding</p>
                <div className="flex flex-wrap gap-2">
                  {result.additionalSchemas.map((s) => (
                    <button key={s} onClick={() => setSchemaType(s)} className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            )}

            <ShareButtons
              shareText={`Generated valid ${result.schemaType} JSON-LD schema markup in seconds with @AAIOINC's free Schema Markup Generator.`}
              url="https://aaioinc.com/tools/schema-generator"
              label="Share this tool"
            />
          </div>
        )}
      </div>
    </div>
  )
}
