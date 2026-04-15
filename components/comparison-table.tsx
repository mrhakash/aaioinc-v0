import { Check, X, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  { name: "Free GEO Analyzer", aaioinc: true, marketmuse: false, surfer: false, frase: "paid" },
  { name: "AI Content Humanizer", aaioinc: true, marketmuse: false, surfer: false, frase: false },
  { name: "MCP Agent Support", aaioinc: true, marketmuse: false, surfer: false, frase: false },
  { name: "Prompt Library (200+)", aaioinc: true, marketmuse: false, surfer: false, frase: "paid" },
  { name: "Niche Research Tool", aaioinc: true, marketmuse: "paid", surfer: "paid", frase: "paid" },
  { name: "LLM Cost Calculator", aaioinc: true, marketmuse: false, surfer: false, frase: false },
  { name: "AI Overview Tracking", aaioinc: true, marketmuse: false, surfer: false, frase: false },
  { name: "Custom Agent Development", aaioinc: true, marketmuse: false, surfer: false, frase: false },
  { name: "Free Tier Available", aaioinc: true, marketmuse: false, surfer: false, frase: "limited" },
  { name: "No Account Required", aaioinc: true, marketmuse: false, surfer: false, frase: false },
]

type CellValue = boolean | "paid" | "limited"

function StatusCell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <Check size={12} className="text-primary" />
        </div>
      </div>
    )
  }
  if (value === false) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
          <X size={12} className="text-destructive" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center">
      <span className="text-xs font-mono text-muted-foreground capitalize">{value}</span>
    </div>
  )
}

export function ComparisonTable() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">
            How We Compare
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            More tools. Less cost. Zero friction.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            See how AAIOINC stacks up against other platforms.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-foreground">Feature</th>
                <th className="text-center px-4 py-3 font-semibold text-primary bg-primary/5">AAIOINC</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">MarketMuse</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Surfer SEO</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Frase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={cn(
                    "hover:bg-secondary/50 transition-colors",
                    index % 2 === 0 && "bg-card/50"
                  )}
                >
                  <td className="px-4 py-3 text-foreground">{feature.name}</td>
                  <td className="px-4 py-3 bg-primary/5">
                    <StatusCell value={feature.aaioinc} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusCell value={feature.marketmuse} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusCell value={feature.surfer} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusCell value={feature.frase} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Comparison based on publicly available features as of Q2 2026. All trademarks belong to their respective owners.
        </p>
      </div>
    </section>
  )
}
