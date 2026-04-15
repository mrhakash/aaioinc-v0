const logos = [
  { name: "TechCrunch", width: "w-28" },
  { name: "Wired", width: "w-20" },
  { name: "Forbes", width: "w-24" },
  { name: "VentureBeat", width: "w-28" },
  { name: "The Verge", width: "w-24" },
]

export function LogosBar() {
  return (
    <section className="py-12 px-6 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs text-muted-foreground text-center mb-8 tracking-widest uppercase">
          Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className={`${logo.width} h-8 flex items-center justify-center`}
            >
              <span className="font-mono text-sm font-medium text-muted-foreground/60 tracking-wide">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
