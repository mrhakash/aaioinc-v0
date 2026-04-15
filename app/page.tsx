import { Navbar } from "@/components/navbar"
import { HomeStructuredData } from "@/components/structured-data"
import { Hero } from "@/components/hero"
import { LogosBar } from "@/components/logos-bar"
import { LiveAgentFeed } from "@/components/live-agent-feed"
import { ProblemStatement } from "@/components/problem-statement"
import { Benefits } from "@/components/benefits"
import { Services } from "@/components/services"
import { CaseStudies } from "@/components/case-studies"
import { GeoScoreDemo } from "@/components/geo-score-demo"
import { WorkflowVisualizer } from "@/components/workflow-visualizer"
import { FreeTools } from "@/components/free-tools"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { ComparisonTable } from "@/components/comparison-table"
import { FAQ } from "@/components/faq"
import { SecurityTrust } from "@/components/security-trust"
import { ContactCTA } from "@/components/contact-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <HomeStructuredData />
      <Navbar />
      <main id="main-content">
        {/* Hero with value proposition + newsletter */}
        <Hero />
        
        {/* Social proof logos */}
        <LogosBar />
        
        {/* Live agent activity ticker */}
        <LiveAgentFeed />
        
        {/* Problem Statement - why this matters */}
        <ProblemStatement />
        
        {/* Principles & Benefits of Agentic AI */}
        <Benefits />
        
        {/* 6 Managed Services */}
        <Services />
        
        {/* Case studies / success stories */}
        <CaseStudies />
        
        {/* Interactive GEO Score Demo */}
        <GeoScoreDemo />
        
        {/* Workflow Visualizer - agent pipelines */}
        <WorkflowVisualizer />
        
        {/* 14 Free Tools */}
        <FreeTools />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* Pricing tiers */}
        <Pricing />
        
        {/* Comparison table */}
        <ComparisonTable />
        
        {/* Security & Trust badges */}
        <SecurityTrust />
        
        {/* FAQ */}
        <FAQ />
        
        {/* Contact / Get Started CTA */}
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}
