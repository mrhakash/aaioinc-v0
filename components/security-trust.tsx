import { ShieldCheck, Lock, Eye, Server, FileCheck, Globe } from "lucide-react"

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "SOC 2 Type II",
    description: "Enterprise-grade compliance in progress",
    status: "In Progress",
  },
  {
    icon: Lock,
    title: "GDPR Compliant",
    description: "Full data privacy controls & DPA ready",
    status: "Compliant",
  },
  {
    icon: Eye,
    title: "Zero Data Retention",
    description: "AI APIs never store your content",
    status: "Active",
  },
  {
    icon: Server,
    title: "AES-256 Encryption",
    description: "Data encrypted at rest and in transit",
    status: "Active",
  },
  {
    icon: FileCheck,
    title: "WCAG 2.2 AA",
    description: "Accessible design for all users",
    status: "Compliant",
  },
  {
    icon: Globe,
    title: "99.9% Uptime SLA",
    description: "Enterprise reliability guarantee",
    status: "Guaranteed",
  },
]

export function SecurityTrust() {
  return (
    <section className="py-24 px-6 border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">
            Security & Compliance
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Enterprise-grade security by default
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Your data security is our priority. Built on Vercel + Supabase with industry-leading protections.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                      <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust badges row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock size={14} />
            <span className="text-xs font-mono">TLS 1.3</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Server size={14} />
            <span className="text-xs font-mono">Vercel Edge</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck size={14} />
            <span className="text-xs font-mono">Supabase RLS</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCheck size={14} />
            <span className="text-xs font-mono">Daily Backups</span>
          </div>
        </div>
      </div>
    </section>
  )
}
