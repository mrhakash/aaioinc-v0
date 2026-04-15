import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components"

interface WelcomeEmailProps {
  firstName?: string
}

export function WelcomeEmail({ firstName = "there" }: WelcomeEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        Welcome to Agentic AI Weekly — your edge on GEO, AI agents, and the tools that matter.
      </Preview>
      <Tailwind>
        <Body className="bg-[#0a0a0a] font-sans m-0 p-0">
          <Container className="mx-auto max-w-[600px] py-10 px-6">

            {/* Logo / wordmark */}
            <Section className="mb-8">
              <Text className="text-[#6366f1] font-bold text-xl tracking-tight m-0">
                AAIOINC
              </Text>
              <Text className="text-[#6b7280] font-mono text-[11px] m-0 mt-0.5 uppercase tracking-widest">
                Agentic AI Weekly
              </Text>
            </Section>

            {/* Hero */}
            <Section className="mb-8">
              <Heading className="text-[#f9fafb] text-[28px] font-bold leading-tight m-0 mb-4">
                Welcome, {firstName}.
              </Heading>
              <Text className="text-[#9ca3af] text-[15px] leading-relaxed m-0">
                You&apos;re now subscribed to <strong className="text-[#f9fafb]">Agentic AI Weekly</strong> — the no-fluff digest for developers, SEOs, and builders who want to stay ahead of AI search, autonomous agents, and the tools that are reshaping how we work.
              </Text>
            </Section>

            {/* What to expect */}
            <Section className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 mb-8">
              <Text className="text-[#6366f1] font-mono text-[11px] uppercase tracking-widest m-0 mb-4">
                What you&apos;ll get every week
              </Text>
              {[
                ["GEO deep-dives", "How to rank in ChatGPT, Perplexity, and Google AI Overviews"],
                ["Agent builds", "Step-by-step walkthroughs of real production agent deployments"],
                ["Tool radar", "New AI tools benchmarked against what you already use"],
                ["Data & research", "LLM cost indices, benchmark updates, and industry numbers"],
              ].map(([label, desc]) => (
                <Section key={label} className="flex gap-3 mb-3">
                  <Text className="text-[#6366f1] m-0 mr-2 font-mono text-sm">›</Text>
                  <Text className="text-[#d1d5db] text-[14px] m-0">
                    <strong className="text-[#f9fafb]">{label}</strong> — {desc}
                  </Text>
                </Section>
              ))}
            </Section>

            {/* CTA */}
            <Section className="mb-8 text-center">
              <Button
                href="https://aaioinc.com/tools"
                className="bg-[#6366f1] text-white font-semibold text-sm px-6 py-3 rounded-lg no-underline inline-block"
              >
                Explore the free tools
              </Button>
            </Section>

            {/* Issue #1 preview */}
            <Section className="border-t border-[#1f1f1f] pt-6 mb-8">
              <Text className="text-[#6b7280] font-mono text-[11px] uppercase tracking-widest m-0 mb-3">
                Coming in Issue #1
              </Text>
              <Text className="text-[#f9fafb] font-semibold text-[15px] m-0 mb-1">
                How to Score 80+ on the GEO Analyzer (and Why it Matters in 2026)
              </Text>
              <Text className="text-[#9ca3af] text-[14px] leading-relaxed m-0">
                A breakdown of the 12 signals AI search engines use to decide whether to cite your content — and the exact checklist we use with clients.
              </Text>
            </Section>

            <Hr className="border-[#1f1f1f] mb-6" />

            {/* Footer */}
            <Section>
              <Text className="text-[#4b5563] text-[12px] m-0 mb-1">
                You&apos;re receiving this because you subscribed at{" "}
                <Link href="https://aaioinc.com" className="text-[#6366f1] no-underline">
                  aaioinc.com
                </Link>
                .
              </Text>
              <Text className="text-[#4b5563] text-[12px] m-0">
                <Link href="https://aaioinc.com/unsubscribe" className="text-[#4b5563]">
                  Unsubscribe
                </Link>{" "}
                &middot;{" "}
                <Link href="https://aaioinc.com/privacy" className="text-[#4b5563]">
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default WelcomeEmail
