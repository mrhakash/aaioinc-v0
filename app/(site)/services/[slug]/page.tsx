import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { services, getServiceBySlug } from "@/lib/services-data"
import ServicePageClient from "./client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: `${service.title} — AAIOINC Managed Services`,
    description: `${service.tagline} ${service.description.slice(0, 120)}`,
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()
  return <ServicePageClient service={service} />
}
