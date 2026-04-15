"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, RotateCcw, Download, Sparkles } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"

interface Question {
  id: number
  text: string
  options: { label: string; score: number }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "How much of your content is currently AI-assisted?",
    options: [
      { label: "None - everything is manually written", score: 0 },
      { label: "Some drafts use AI, but heavily edited", score: 25 },
      { label: "About half our content workflow uses AI", score: 50 },
      { label: "Most content is AI-assisted with human review", score: 75 },
      { label: "Fully automated with minimal human input", score: 100 },
    ],
  },
  {
    id: 2,
    text: "Does your team have experience with AI/ML tools?",
    options: [
      { label: "No experience with AI tools", score: 0 },
      { label: "Basic ChatGPT usage only", score: 25 },
      { label: "Regular use of multiple AI tools", score: 50 },
      { label: "Building custom prompts and workflows", score: 75 },
      { label: "Developing custom AI integrations", score: 100 },
    ],
  },
  {
    id: 3,
    text: "How do you currently handle repetitive tasks?",
    options: [
      { label: "All done manually", score: 0 },
      { label: "Some basic scripts or macros", score: 25 },
      { label: "Use automation tools like Zapier", score: 50 },
      { label: "Custom automation pipelines", score: 75 },
      { label: "AI-powered intelligent automation", score: 100 },
    ],
  },
  {
    id: 4,
    text: "What's your current data infrastructure like?",
    options: [
      { label: "Spreadsheets and documents only", score: 0 },
      { label: "Basic database but siloed data", score: 25 },
      { label: "Centralized data with basic analytics", score: 50 },
      { label: "Data warehouse with BI tools", score: 75 },
      { label: "ML-ready data pipelines in place", score: 100 },
    ],
  },
  {
    id: 5,
    text: "How does leadership view AI adoption?",
    options: [
      { label: "Skeptical or resistant to AI", score: 0 },
      { label: "Cautiously interested but no action", score: 25 },
      { label: "Actively exploring AI solutions", score: 50 },
      { label: "AI is a strategic priority", score: 75 },
      { label: "AI-first approach across the org", score: 100 },
    ],
  },
  {
    id: 6,
    text: "What's your budget for AI tools and services?",
    options: [
      { label: "No dedicated AI budget", score: 0 },
      { label: "Under $500/month", score: 25 },
      { label: "$500 - $2,000/month", score: 50 },
      { label: "$2,000 - $10,000/month", score: 75 },
      { label: "Over $10,000/month", score: 100 },
    ],
  },
  {
    id: 7,
    text: "How do you measure content/marketing performance?",
    options: [
      { label: "We don't track metrics systematically", score: 0 },
      { label: "Basic traffic and engagement metrics", score: 25 },
      { label: "Full funnel analytics in place", score: 50 },
      { label: "Attribution modeling and A/B testing", score: 75 },
      { label: "AI-driven optimization and predictions", score: 100 },
    ],
  },
  {
    id: 8,
    text: "What's your current SEO maturity level?",
    options: [
      { label: "No SEO strategy in place", score: 0 },
      { label: "Basic on-page SEO only", score: 25 },
      { label: "Content + technical SEO covered", score: 50 },
      { label: "Advanced SEO with link building", score: 75 },
      { label: "GEO-optimized for AI search too", score: 100 },
    ],
  },
  {
    id: 9,
    text: "How quickly can you implement new tools?",
    options: [
      { label: "Very slow - months of approval needed", score: 0 },
      { label: "Weeks for most new tools", score: 25 },
      { label: "Days for SaaS, weeks for custom", score: 50 },
      { label: "Same-day trials, fast procurement", score: 75 },
      { label: "Self-serve with instant deployment", score: 100 },
    ],
  },
  {
    id: 10,
    text: "What's your content production volume?",
    options: [
      { label: "Less than 5 pieces per month", score: 0 },
      { label: "5-15 pieces per month", score: 25 },
      { label: "15-50 pieces per month", score: 50 },
      { label: "50-200 pieces per month", score: 75 },
      { label: "200+ pieces per month", score: 100 },
    ],
  },
]

interface ReadinessResult {
  score: number
  level: "Beginner" | "Developing" | "Intermediate" | "Advanced" | "Leader"
  summary: string
  recommendations: string[]
  nextSteps: { title: string; description: string }[]
}

function calculateResult(answers: Record<number, number>): ReadinessResult {
  const total = Object.values(answers).reduce((sum, val) => sum + val, 0)
  const score = Math.round(total / questions.length)

  if (score < 20) {
    return {
      score,
      level: "Beginner",
      summary: "Your organization is at the early stages of AI adoption. There's significant opportunity to leverage AI for competitive advantage, but foundational work is needed first.",
      recommendations: [
        "Start with low-risk AI tools like ChatGPT for content ideation",
        "Invest in basic AI literacy training for your team",
        "Identify 2-3 high-impact, low-complexity use cases to pilot",
        "Centralize your data before attempting AI/ML projects",
      ],
      nextSteps: [
        { title: "AI Content Tools", description: "Begin with our Content Humanizer and Title Generator to see immediate value" },
        { title: "Training", description: "Consider our AI Readiness Workshop for teams" },
        { title: "Audit", description: "Get a free GEO Visibility check to understand your AI search presence" },
      ],
    }
  } else if (score < 40) {
    return {
      score,
      level: "Developing",
      summary: "You've started exploring AI but haven't yet integrated it systematically. Focus on building foundational capabilities and selecting the right tools for your specific needs.",
      recommendations: [
        "Standardize AI tool usage with approved vendor list",
        "Create prompt libraries and best practices documentation",
        "Build basic automation workflows for repetitive tasks",
        "Start tracking AI-assisted vs manual content performance",
      ],
      nextSteps: [
        { title: "Workflow Automation", description: "Our AI Blogging Service can automate your content pipeline" },
        { title: "Tool Stack", description: "Use our AI Stack Recommender to find the right tools" },
        { title: "Quick Wins", description: "Deploy our free tools across your workflow" },
      ],
    }
  } else if (score < 60) {
    return {
      score,
      level: "Intermediate",
      summary: "You have solid AI foundations in place. Focus on optimization, integration between tools, and measuring ROI to justify further investment.",
      recommendations: [
        "Integrate AI tools into existing workflows (not standalone)",
        "Build custom prompts optimized for your brand voice",
        "Implement A/B testing for AI vs human content",
        "Explore agentic workflows for multi-step automation",
      ],
      nextSteps: [
        { title: "AI SEO Service", description: "Optimize for both traditional and AI search visibility" },
        { title: "Custom Agents", description: "Consider OpenClaw Setup for production agent deployment" },
        { title: "Content Scale", description: "Our AI Content Service delivers $0.04/word quality content" },
      ],
    }
  } else if (score < 80) {
    return {
      score,
      level: "Advanced",
      summary: "Your AI adoption is mature. Focus on advanced use cases, custom integrations, and staying ahead of emerging capabilities like agentic AI and GEO.",
      recommendations: [
        "Build custom AI agents for your specific workflows",
        "Implement GEO optimization for AI search visibility",
        "Create feedback loops to continuously improve AI outputs",
        "Explore fine-tuning models on your proprietary data",
      ],
      nextSteps: [
        { title: "Managed GEO", description: "Our AI SEO Service includes full GEO optimization" },
        { title: "Agent Development", description: "Custom OpenClaw skill development for your use case" },
        { title: "Enterprise Strategy", description: "Book a strategy call to discuss advanced implementations" },
      ],
    }
  } else {
    return {
      score,
      level: "Leader",
      summary: "You're at the forefront of AI adoption. Focus on emerging capabilities, competitive moats, and helping shape industry best practices.",
      recommendations: [
        "Invest in proprietary AI capabilities and fine-tuned models",
        "Build AI into your product/service offering",
        "Establish thought leadership in your industry's AI adoption",
        "Partner with AI tool vendors for early access to capabilities",
      ],
      nextSteps: [
        { title: "Agency Partnership", description: "White-label our tools and services for your clients" },
        { title: "Custom Development", description: "Bespoke AI solutions for unique requirements" },
        { title: "Advisory", description: "Ongoing AI strategy advisory and implementation support" },
      ],
    }
  }
}

const levelColors: Record<string, string> = {
  Beginner: "text-red-400",
  Developing: "text-orange-400",
  Intermediate: "text-amber-400",
  Advanced: "text-sky-400",
  Leader: "text-primary",
}

export default function AIReadinessPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)

  const progress = (Object.keys(answers).length / questions.length) * 100
  const question = questions[currentQuestion]
  const result = showResult ? calculateResult(answers) : null

  function handleSelect(score: number) {
    const newAnswers = { ...answers, [question.id]: score }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setTimeout(() => setShowResult(true), 300)
    }
  }

  function handleReset() {
    setAnswers({})
    setCurrentQuestion(0)
    setShowResult(false)
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-3xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">AI Readiness Assessment</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-mono font-medium">Free</span>
            <span className="font-mono text-xs text-muted-foreground">Strategy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">AI Readiness Assessment</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Answer 10 questions to get a custom AI adoption roadmap, readiness score, and personalized recommendations for your organization.
          </p>
        </div>

        {!showResult ? (
          <>
            {/* Progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
              <p className="text-lg font-semibold text-foreground mb-6">{question.text}</p>

              <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => {
                  const isSelected = answers[question.id] === option.score
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(option.score)}
                      className={`text-left rounded-lg border px-4 py-3 text-sm transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {isSelected && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        {option.label}
                      </div>
                    </button>
                  )
                })}
              </div>

              {currentQuestion > 0 && (
                <button
                  onClick={handleBack}
                  className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Previous question
                </button>
              )}
            </div>
          </>
        ) : result && (
          <div className="flex flex-col gap-8">
            {/* Result summary */}
            <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-primary" />
                <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Your AI Readiness Score</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-foreground">{result.score}</span>
                  <span className="text-2xl font-medium text-muted-foreground">/100</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className={`text-xl font-bold ${levelColors[result.level]}`}>{result.level}</p>
                  <p className="text-sm text-muted-foreground">AI Adoption Level</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-6">
                <div className="h-3 w-full rounded-full bg-secondary overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-primary"
                    style={{ width: "100%" }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-lg transition-all duration-700"
                    style={{ left: `calc(${result.score}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
                  <span>Beginner</span>
                  <span>Developing</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Leader</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">Recommended Actions</h2>
              <div className="rounded-lg border border-border bg-card divide-y divide-border">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 px-5 py-4">
                    <span className="font-mono text-xs text-primary font-bold mt-0.5 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">Suggested Next Steps</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.nextSteps.map((step, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
                    <p className="font-semibold text-sm text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <RotateCcw size={14} /> Retake Assessment
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Download size={14} /> Save Results
              </button>
            </div>

            <ShareButtons
              shareText={`Just took the AAIOINC AI Readiness Assessment — scored ${result.score}/100 (${result.level} level). Take yours:`}
              url="https://aaioinc.com/tools/ai-readiness"
              label="Share your score"
            />

            {/* CTA */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="font-semibold text-foreground">Need help implementing your AI roadmap?</p>
                <p className="text-sm text-muted-foreground mt-1">Book a strategy call to discuss your specific situation and get personalized guidance.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                  Book Strategy Call <ArrowRight size={14} />
                </Link>
                <Link href="/tools" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap">
                  Explore Free Tools
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="border-t border-border pt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="flex flex-col gap-0 rounded-lg border border-border bg-card px-6 divide-y divide-border">
            {[
              { q: "How long does the assessment take?", a: "About 3-4 minutes. There are 10 multiple-choice questions with no right or wrong answers — just select what best describes your current situation." },
              { q: "Is my data saved or shared?", a: "No. The assessment runs entirely in your browser. We don't collect, store, or transmit your answers or results. Your data stays on your device." },
              { q: "How accurate is the readiness score?", a: "The score provides a directional assessment based on common AI adoption patterns. It's designed to surface areas of opportunity and suggest next steps — not provide a definitive evaluation." },
              { q: "Can I retake the assessment?", a: "Yes, unlimited times. Click 'Retake Assessment' at the bottom of your results to start over. Your previous answers are not stored." },
            ].map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer text-sm font-medium text-foreground flex items-center justify-between">
                  {q}
                  <span className="font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
