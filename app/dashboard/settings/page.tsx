import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { User, Mail, Shield, Bell, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Settings — AAIOINC", robots: { index: false } }

export default async function DashboardSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single()

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User"

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      {/* Profile Section */}
      <div className="rounded-xl border border-border bg-secondary p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-border bg-card p-2">
            <User size={16} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Profile</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Display Name</label>
            <input
              type="text"
              defaultValue={displayName}
              className="rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              disabled
            />
            <p className="text-xs text-muted-foreground">Profile editing coming soon.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5">
              <Mail size={14} className="text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>

          {profile?.role && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary w-fit">
                {profile.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-xl border border-border bg-secondary p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-border bg-card p-2">
            <Bell size={16} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Notifications</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly AI Digest</p>
              <p className="text-xs text-muted-foreground mt-0.5">GEO insights, tool updates, and industry news</p>
            </div>
            <button className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
              Subscribed
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Product Updates</p>
              <p className="text-xs text-muted-foreground mt-0.5">New features and tool releases</p>
            </div>
            <button className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-xl border border-border bg-secondary p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-border bg-card p-2">
            <Shield size={16} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Security</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Authentication Method</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user.app_metadata?.provider === "google" ? "Google OAuth" : "Magic Link"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Last Sign In</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2">
            <Trash2 size={16} className="text-destructive" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-destructive">Danger Zone</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button className="rounded-md border border-destructive/50 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
