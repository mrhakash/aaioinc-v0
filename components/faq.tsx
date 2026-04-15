"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What is Agentic AI Optimization?",
    answer:
      "Agentic AI Optimization is the practice of configuring AI systems to perform multi-step tasks autonomously, make decisions based on context, and continuously improve outputs. Unlike simple prompts, agentic AI can research, draft, edit, and publish content with minimal human intervention.",
  },
  {
    question: "Are the free tools really free?",
    answer:
      "Yes. All 14 core tools are permanently free with daily usage limits (3-5 runs/day for anonymous users). No credit card or account required. Pro users get unlimited access.",
  },
  {
    question: "How does GEO (Generative Engine Optimization) differ from SEO?",
    answer:
      "Traditional SEO optimizes for search engine rankings. GEO optimizes for AI visibility — ensuring your content appears in AI-generated answers from ChatGPT, Perplexity, Claude, and Google AI Overviews. We help you rank in both.",
  },
  {
    question: "What AI models power your tools?",
    answer:
      "We use a mix of OpenAI GPT-4o, Anthropic Claude 3.5, and specialized fine-tuned models. All API calls use zero-retention endpoints to protect your data privacy.",
  },
  {
    question: "Can I use the tools without creating an account?",
    answer:
      "Absolutely. Anonymous users can access all free tools with rate limits. Create an account to save history, increase limits, and access Pro features.",
  },
  {
    question: "What is OpenClaw?",
    answer:
      "OpenClaw is our enterprise-grade MCP (Model Control Protocol) agent deployment platform. It enables secure, isolated AI agent execution with custom skills, credential management, and network hardening for production environments.",
  },
  {
    question: "Do you offer custom AI development?",
    answer:
      "Yes. Our managed services range from $500 niche research sprints to $15,000+ custom MCP skill development. Book a free strategy call to discuss your needs.",
  },
  {
    question: "How do you handle data privacy and security?",
    answer:
      "All AI API calls use zero-retention endpoints. Data is encrypted in transit (TLS 1.3) and at rest (AES-256). We're GDPR-compliant with SOC 2 certification in progress. See our privacy policy for details.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about our platform, tools, and services.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden bg-card">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-medium text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180 text-primary"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional help */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Still have questions?{" "}
          <a href="/#contact" className="text-primary hover:underline">
            Contact us
          </a>{" "}
          or{" "}
          <a href="mailto:hello@aaioinc.com" className="text-primary hover:underline">
            email hello@aaioinc.com
          </a>
        </p>
      </div>
    </section>
  )
}
