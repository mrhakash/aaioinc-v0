"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Send, AlertCircle } from "lucide-react"
import { RESOURCE_CATEGORIES } from "@/lib/resources-data"

type FormState = "idle" | "submitting" | "success" | "error"

const TIER_OPTIONS = ["Free", "Freemium", "Paid"] as const
const TYPE_OPTIONS = [
  "Guide / Tutorial",
  "Tool / Software",
  "Course",
  "Research / Report",
  "Template",
  "Video / Webinar",
  "Open Source",
  "Other",
] as const

export default function SubmitResourceForm() {
  const [state, setState] = useState<FormState>("idle")
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    type: "",
    tier: "" as "" | "Free" | "Freemium" | "Paid",
    tags: "",
    submitterName: "",
    submitterEmail: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => { const next = { ...e }; delete next[key]; return next })
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim())            errs.title = "Title is required"
    if (!form.url.trim())              errs.url = "URL is required"
    else if (!/^https?:\/\//.test(form.url)) errs.url = "Must be a valid URL (https://...)"
    if (!form.description.trim())      errs.description = "Description is required"
    if (form.description.length > 280) errs.description = "Keep the description under 280 characters"
    if (!form.category)                errs.category = "Select a category"
    if (!form.type)                    errs.type = "Select a resource type"
    if (!form.tier)                    errs.tier = "Select an access tier"
    if (!form.submitterEmail.trim())   errs.submitterEmail = "Your email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail))
      errs.submitterEmail = "Enter a valid email address"
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setState("submitting")
    // Simulate async submission (swap for real API call / Supabase insert)
    await new Promise((r) => setTimeout(r, 1200))
    setState("success")
  }

  if (state === "success") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 flex flex-col items-center text-center gap-6">
        <div className="rounded-full border border-primary/30 bg-primary/10 p-4">
          <Check size={24} className="text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-foreground">Submission received!</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Thanks for contributing to the community. We&apos;ll review <strong className="text-foreground">{form.title}</strong> and
            email you at <strong className="text-foreground">{form.submitterEmail}</strong> within 3–5 business days.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/resources"
            className="flex items-center gap-1.5 font-mono text-sm text-primary hover:underline"
          >
            <ArrowLeft size={13} /> Browse resources
          </Link>
          <span className="text-muted-foreground text-xs">·</span>
          <button
            onClick={() => { setState("idle"); setForm({ title:"",url:"",description:"",category:"",type:"",tier:"",tags:"",submitterName:"",submitterEmail:"",notes:"" }) }}
            className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Submit another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={12} /> Back to resources
      </Link>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

        {/* Resource details */}
        <fieldset className="flex flex-col gap-5">
          <legend className="font-semibold text-foreground text-sm mb-1">Resource details</legend>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Resource title <span className="text-primary" aria-hidden>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. GEO Optimisation Guide for E-commerce"
              className={`rounded-lg border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors ${errors.title ? "border-red-500/50" : "border-border focus:border-primary/50"}`}
              aria-describedby={errors.title ? "title-error" : undefined}
              suppressHydrationWarning
            />
            {errors.title && <p id="title-error" className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.title}</p>}
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="url" className="text-sm font-medium text-foreground">
              Resource URL <span className="text-primary" aria-hidden>*</span>
            </label>
            <input
              id="url"
              type="url"
              value={form.url}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://..."
              className={`rounded-lg border bg-secondary px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors ${errors.url ? "border-red-500/50" : "border-border focus:border-primary/50"}`}
              aria-describedby={errors.url ? "url-error" : undefined}
              suppressHydrationWarning
            />
            {errors.url && <p id="url-error" className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.url}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Short description <span className="text-primary" aria-hidden>*</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Briefly describe what this resource covers and who it helps (max 280 characters)."
              className={`rounded-lg border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors resize-none ${errors.description ? "border-red-500/50" : "border-border focus:border-primary/50"}`}
              aria-describedby={errors.description ? "desc-error" : "desc-hint"}
            />
            <div className="flex items-start justify-between">
              {errors.description
                ? <p id="desc-error" className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.description}</p>
                : <p id="desc-hint" className="text-xs text-muted-foreground">Keep it concise — this appears in the directory card.</p>
              }
              <span className={`text-xs font-mono shrink-0 ${form.description.length > 260 ? "text-amber-400" : "text-muted-foreground"}`}>
                {form.description.length}/280
              </span>
            </div>
          </div>

          {/* Category + Type row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category <span className="text-primary" aria-hidden>*</span>
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={`rounded-lg border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors ${errors.category ? "border-red-500/50" : "border-border focus:border-primary/50"}`}
                aria-describedby={errors.category ? "cat-error" : undefined}
              >
                <option value="">Select category</option>
                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p id="cat-error" className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.category}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium text-foreground">
                Resource type <span className="text-primary" aria-hidden>*</span>
              </label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                className={`rounded-lg border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors ${errors.type ? "border-red-500/50" : "border-border focus:border-primary/50"}`}
                aria-describedby={errors.type ? "type-error" : undefined}
              >
                <option value="">Select type</option>
                {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <p id="type-error" className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.type}</p>}
            </div>
          </div>

          {/* Tier */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Access tier <span className="text-primary" aria-hidden>*</span>
            </span>
            <div className="flex items-center gap-3 flex-wrap" role="radiogroup" aria-label="Access tier">
              {TIER_OPTIONS.map((t) => (
                <label
                  key={t}
                  className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    form.tier === t
                      ? t === "Free"
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : t === "Freemium"
                        ? "border-sky-500/40 bg-sky-500/10 text-sky-400"
                        : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={t}
                    checked={form.tier === t}
                    onChange={() => update("tier", t)}
                    className="sr-only"
                    aria-label={t}
                  />
                  {form.tier === t && <Check size={12} aria-hidden />}
                  {t}
                </label>
              ))}
            </div>
            {errors.tier && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.tier}</p>}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tags" className="text-sm font-medium text-foreground">Tags</label>
            <input
              id="tags"
              type="text"
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="e.g. geo, seo, agents (comma-separated)"
              className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            <p className="text-xs text-muted-foreground">Optional — helps with search and discovery.</p>
          </div>
        </fieldset>

        {/* Submitter details */}
        <fieldset className="flex flex-col gap-5 border-t border-border pt-8">
          <legend className="font-semibold text-foreground text-sm mb-1">Your details</legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submitterName" className="text-sm font-medium text-foreground">Name</label>
              <input
                id="submitterName"
                type="text"
                value={form.submitterName}
                onChange={(e) => update("submitterName", e.target.value)}
                placeholder="Your name (optional)"
                className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submitterEmail" className="text-sm font-medium text-foreground">
                Email <span className="text-primary" aria-hidden>*</span>
              </label>
              <input
                id="submitterEmail"
                type="email"
                value={form.submitterEmail}
                onChange={(e) => update("submitterEmail", e.target.value)}
                placeholder="you@example.com"
                className={`rounded-lg border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors ${errors.submitterEmail ? "border-red-500/50" : "border-border focus:border-primary/50"}`}
                aria-describedby={errors.submitterEmail ? "email-error" : "email-hint"}
                suppressHydrationWarning
              />
              {errors.submitterEmail
                ? <p id="email-error" className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.submitterEmail}</p>
                : <p id="email-hint" className="text-xs text-muted-foreground">We&apos;ll email you when your resource is published.</p>
              }
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">Notes for reviewers</label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Any context that would help our review team — affiliation, why you recommend it, etc."
              className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
            />
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex flex-col gap-3 border-t border-border pt-8">
          {state === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
              <AlertCircle size={14} />
              Something went wrong. Please try again.
            </div>
          )}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={state === "submitting"}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {state === "submitting" ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" aria-hidden />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Submit resource
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground">
              By submitting you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">terms</Link>.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
