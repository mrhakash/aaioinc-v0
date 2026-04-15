import type { Metadata } from "next"
import PromptsClient from "./client"

export const metadata: Metadata = {
  title: "Prompt Library — 200+ SEO, Content & Agent Prompts | AAIOINC",
  description:
    "200+ curated, tested prompts for SEO, GEO, content creation, AI agents, MCP, email, social, technical, and business. Free to copy — fork and save with Pro.",
}

export default function PromptsPage() {
  return <PromptsClient />
}
