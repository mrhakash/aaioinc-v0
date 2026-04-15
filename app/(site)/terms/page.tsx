import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — AAIOINC",
  description: "Read our terms of service that govern your use of AAIOINC's platform, tools, and services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: April 15, 2026</p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing or using AAIOINC&apos;s website, tools, and services (&quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use our Services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AAIOINC provides AI-powered tools, optimization services, and related software for content creation, SEO, and generative engine optimization. Our free tools are available without an account, while premium features require registration and subscription.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you create an account, you must provide accurate and complete information. You are responsible for maintaining the security of your account credentials and for all activities under your account.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to use our Services to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Generate harmful, misleading, or illegal content</li>
              <li>Attempt to circumvent usage limits or security measures</li>
              <li>Resell or redistribute our Services without authorization</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Content generated using our tools belongs to you. However, AAIOINC retains all rights to our platform, software, branding, and proprietary technology. You may not copy, modify, or reverse-engineer our Services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Payment and Subscriptions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Paid subscriptions are billed in advance on a monthly or annual basis. Refunds are provided at our discretion. You may cancel your subscription at any time; access continues until the end of the billing period.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AAIOINC is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of our Services. Our total liability is limited to the amount you paid us in the past 12 months.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update these Terms from time to time. Continued use of our Services after changes constitutes acceptance of the new Terms. We will notify you of material changes via email or platform notification.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@aaioinc.com" className="text-primary hover:underline">legal@aaioinc.com</a>.
            </p>
          </section>
        </article>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-border flex gap-6 text-sm">
          <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
