import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Wrench, Library, CreditCard, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PLANS, type PlanId } from "@/lib/plans"

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Wrench, label: "Tool History", href: "/dashboard/tools" },
  { icon: Library, label: "Saved Prompts", href: "/dashboard/prompts" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile — plan column is kept in sync by Stripe webhook
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, plan")
    .eq("id", user.id)
    .single()

  const planId = ((profile?.plan as PlanId) || "free")
  const plan = PLANS[planId]
  const displayName = profile?.full_name || user.email?.split("@")[0] || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-mono text-sm font-bold text-primary tracking-widest uppercase">AAIO</span>
            <span className="font-mono text-sm text-muted-foreground tracking-widest">INC</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Icon size={15} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Plan badge */}
        <div className="p-3 border-t border-border">
          <div className="rounded-md border border-border bg-secondary px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">{plan.name} plan</span>
            {planId === "free" && (
              <Link href="/dashboard/billing" className="text-xs font-mono text-primary hover:underline">Upgrade</Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background shrink-0">
          <p className="text-sm font-medium text-foreground">Dashboard</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-primary">{initials}</span>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
