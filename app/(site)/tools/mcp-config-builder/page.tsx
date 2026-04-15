"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Plus, Trash2, Copy, Check, Download, Code2, AlertCircle } from "lucide-react"

// MCP is client-side only — no API call needed, fully computed in-browser
type Transport = "stdio" | "sse" | "websocket"

interface EnvVar { key: string; value: string }

interface MCPServer {
  id: string
  name: string
  transport: Transport
  command?: string
  args: string[]
  env: EnvVar[]
  url?: string
  description: string
}

const PRESET_SERVERS: MCPServer[] = [
  {
    id: "filesystem",
    name: "Filesystem",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"],
    env: [],
    description: "Read/write files in allowed directories",
  },
  {
    id: "github",
    name: "GitHub",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: [{ key: "GITHUB_PERSONAL_ACCESS_TOKEN", value: "" }],
    description: "GitHub repos, issues, PRs, and code search",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"],
    env: [],
    description: "Read-only queries to a PostgreSQL database",
  },
  {
    id: "brave-search",
    name: "Brave Search",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-brave-search"],
    env: [{ key: "BRAVE_API_KEY", value: "" }],
    description: "Real-time web search via Brave API",
  },
  {
    id: "puppeteer",
    name: "Puppeteer (Browser)",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-puppeteer"],
    env: [],
    description: "Headless browser for web scraping and screenshots",
  },
  {
    id: "slack",
    name: "Slack",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-slack"],
    env: [
      { key: "SLACK_BOT_TOKEN", value: "" },
      { key: "SLACK_TEAM_ID", value: "" },
    ],
    description: "Read Slack channels, send messages, manage workspaces",
  },
  {
    id: "custom-sse",
    name: "Custom SSE Server",
    transport: "sse",
    url: "https://your-server.com/mcp",
    args: [],
    env: [{ key: "API_KEY", value: "" }],
    description: "Connect to any SSE-based MCP server",
  },
]

const CLIENT_CONFIGS: Record<string, string> = {
  "Claude Desktop": "claude_desktop_config.json",
  "Cursor": ".cursor/mcp.json",
  "Continue": ".continue/config.json",
  "Zed": "settings.json",
}

function buildConfig(servers: MCPServer[]): string {
  const mcpServers: Record<string, unknown> = {}

  for (const s of servers) {
    const key = s.name.toLowerCase().replace(/\s+/g, "-")
    const envObj: Record<string, string> = {}
    for (const { key: k, value: v } of s.env) {
      if (k) envObj[k] = v || `YOUR_${k}`
    }

    if (s.transport === "stdio") {
      mcpServers[key] = {
        command: s.command,
        args: s.args.filter(Boolean),
        ...(Object.keys(envObj).length > 0 ? { env: envObj } : {}),
      }
    } else {
      mcpServers[key] = {
        url: s.url,
        transport: s.transport,
        ...(Object.keys(envObj).length > 0 ? { env: envObj } : {}),
      }
    }
  }

  return JSON.stringify({ mcpServers }, null, 2)
}

function newServer(): MCPServer {
  return {
    id: crypto.randomUUID(),
    name: "",
    transport: "stdio",
    command: "npx",
    args: [],
    env: [],
    description: "",
  }
}

export default function MCPConfigBuilderPage() {
  const [servers, setServers] = useState<MCPServer[]>([])
  const [targetClient, setTargetClient] = useState("Claude Desktop")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder")

  const config = buildConfig(servers)

  function addPreset(preset: MCPServer) {
    setServers(prev => [...prev, { ...preset, id: crypto.randomUUID() }])
  }

  function addCustom() {
    setServers(prev => [...prev, newServer()])
  }

  function removeServer(id: string) {
    setServers(prev => prev.filter(s => s.id !== id))
  }

  function updateServer(id: string, patch: Partial<MCPServer>) {
    setServers(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  function updateArg(serverId: string, idx: number, value: string) {
    setServers(prev => prev.map(s => {
      if (s.id !== serverId) return s
      const args = [...s.args]
      args[idx] = value
      return { ...s, args }
    }))
  }

  function addArg(serverId: string) {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, args: [...s.args, ""] } : s))
  }

  function removeArg(serverId: string, idx: number) {
    setServers(prev => prev.map(s => {
      if (s.id !== serverId) return s
      return { ...s, args: s.args.filter((_, i) => i !== idx) }
    }))
  }

  function updateEnv(serverId: string, idx: number, field: "key" | "value", val: string) {
    setServers(prev => prev.map(s => {
      if (s.id !== serverId) return s
      const env = s.env.map((e, i) => i === idx ? { ...e, [field]: val } : e)
      return { ...s, env }
    }))
  }

  function addEnvVar(serverId: string) {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, env: [...s.env, { key: "", value: "" }] } : s))
  }

  function removeEnvVar(serverId: string, idx: number) {
    setServers(prev => prev.map(s => {
      if (s.id !== serverId) return s
      return { ...s, env: s.env.filter((_, i) => i !== idx) }
    }))
  }

  function copyConfig() {
    navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadConfig() {
    const filename = CLIENT_CONFIGS[targetClient] ?? "mcp.json"
    const blob = new Blob([config], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.split("/").pop() ?? "mcp.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-6 py-3">
        <div className="mx-auto max-w-6xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">MCP Config Builder</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-green-500/30 bg-green-500/10 text-green-400 px-2.5 py-0.5 text-xs font-mono font-medium">Free</span>
            <span className="font-mono text-xs text-muted-foreground">Developer</span>
            <span className="font-mono text-xs text-muted-foreground border border-border rounded px-2 py-0.5">No account needed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">MCP Config Builder</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Visually build your Model Context Protocol configuration for Claude Desktop, Cursor, Continue, and Zed. Pick from presets or add custom servers — get a ready-to-paste JSON config.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Builder */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Client target */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Target Client</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(CLIENT_CONFIGS).map((client) => (
                  <button
                    key={client}
                    onClick={() => setTargetClient(client)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-mono transition-colors ${
                      targetClient === client
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {client}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Config will be saved as <code className="font-mono bg-secondary px-1 rounded">{CLIENT_CONFIGS[targetClient]}</code></p>
            </div>

            {/* Presets */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Add from Presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_SERVERS.map((preset) => {
                  const already = servers.some(s => s.description === preset.description)
                  return (
                    <button
                      key={preset.id}
                      onClick={() => !already && addPreset(preset)}
                      disabled={already}
                      className={`rounded-lg border p-3 text-left flex flex-col gap-1 transition-all ${
                        already
                          ? "border-border opacity-40 cursor-not-allowed"
                          : "border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{preset.name}</span>
                      <span className="text-xs text-muted-foreground leading-snug line-clamp-2">{preset.description}</span>
                      <span className="text-xs font-mono text-primary/70 mt-auto pt-1">{preset.transport}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Added servers */}
            {servers.length > 0 && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Configured Servers ({servers.length})</label>
                {servers.map((s) => (
                  <div key={s.id} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        value={s.name}
                        onChange={(e) => updateServer(s.id, { name: e.target.value })}
                        placeholder="Server name"
                        className="flex-1 bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none border-b border-transparent focus:border-primary pb-0.5 transition-colors"
                      />
                      <button onClick={() => removeServer(s.id)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Transport */}
                    <div className="flex gap-2 text-xs">
                      {(["stdio", "sse", "websocket"] as Transport[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => updateServer(s.id, { transport: t })}
                          className={`rounded border px-2 py-1 font-mono transition-colors ${s.transport === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {s.transport === "stdio" ? (
                      <div className="flex flex-col gap-2">
                        <input
                          value={s.command ?? ""}
                          onChange={(e) => updateServer(s.id, { command: e.target.value })}
                          placeholder="command (e.g. npx)"
                          className="w-full bg-secondary border border-border rounded px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                        <div className="flex flex-col gap-1">
                          {s.args.map((arg, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                value={arg}
                                onChange={(e) => updateArg(s.id, i, e.target.value)}
                                placeholder={`arg[${i}]`}
                                className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                              />
                              <button onClick={() => removeArg(s.id, i)} className="text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                            </div>
                          ))}
                          <button onClick={() => addArg(s.id)} className="text-xs text-primary hover:underline w-fit flex items-center gap-1">
                            <Plus size={11} /> Add arg
                          </button>
                        </div>
                      </div>
                    ) : (
                      <input
                        value={s.url ?? ""}
                        onChange={(e) => updateServer(s.id, { url: e.target.value })}
                        placeholder="https://your-server.com/mcp"
                        className="w-full bg-secondary border border-border rounded px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    )}

                    {/* Env vars */}
                    {s.env.length > 0 && (
                      <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                        <span className="text-xs font-mono text-muted-foreground">Environment variables</span>
                        {s.env.map((e, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              value={e.key}
                              onChange={(val) => updateEnv(s.id, i, "key", val.target.value)}
                              placeholder="KEY"
                              className="w-36 bg-secondary border border-border rounded px-2 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                            <input
                              value={e.value}
                              onChange={(val) => updateEnv(s.id, i, "value", val.target.value)}
                              placeholder="value (leave empty for placeholder)"
                              className="flex-1 bg-secondary border border-border rounded px-2 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                            <button onClick={() => removeEnvVar(s.id, i)} className="text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                          </div>
                        ))}
                        <button onClick={() => addEnvVar(s.id)} className="text-xs text-primary hover:underline w-fit flex items-center gap-1 mt-1">
                          <Plus size={11} /> Add env var
                        </button>
                      </div>
                    )}
                    {s.env.length === 0 && (
                      <button onClick={() => addEnvVar(s.id)} className="text-xs text-muted-foreground hover:text-primary transition-colors w-fit flex items-center gap-1 border-t border-border pt-3">
                        <Plus size={11} /> Add env var
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={addCustom}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-5 py-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors w-fit"
            >
              <Plus size={14} /> Add custom server
            </button>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="sticky top-20 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${activeTab === "preview" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                  >
                    <Code2 size={11} className="inline mr-1" />Preview
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyConfig}
                    disabled={servers.length === 0}
                    className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:opacity-40"
                  >
                    {copied ? <><Check size={11} className="text-green-400" />Copied</> : <><Copy size={11} />Copy</>}
                  </button>
                  <button
                    onClick={downloadConfig}
                    disabled={servers.length === 0}
                    className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    <Download size={11} />Download
                  </button>
                </div>
              </div>

              {servers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-secondary p-8 flex flex-col items-center gap-3 text-center">
                  <Code2 size={24} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Add servers to see your config</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground ml-2">{CLIENT_CONFIGS[targetClient]}</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed max-h-[60vh] overflow-y-auto">
                    {config}
                  </pre>
                </div>
              )}

              {/* Empty env warning */}
              {servers.some(s => s.env.some(e => e.key && !e.value)) && (
                <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  <span>Some env vars have empty values — they&apos;ll appear as <code className="font-mono">YOUR_KEY</code> placeholders in the config.</span>
                </div>
              )}

              {/* Install instructions */}
              {servers.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Install {targetClient}</p>
                  <ol className="flex flex-col gap-2">
                    {[
                      targetClient === "Claude Desktop" && "Open Claude Desktop → Settings → Developer → Edit Config",
                      targetClient === "Cursor" && "Open Cursor → Settings → MCP → Edit MCP Config",
                      targetClient === "Continue" && "Open VS Code → Continue extension → Configure",
                      targetClient === "Zed" && "Open Zed → Settings (⌘,) → Paste in mcpServers section",
                      `Download and paste the config into ${CLIENT_CONFIGS[targetClient]}`,
                      "Restart the client to load new MCP servers",
                    ].filter(Boolean).map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="font-mono text-primary font-bold shrink-0">{i + 1}.</span>
                        <span>{step as string}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-border pt-8">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Need a custom MCP server built?</p>
              <p className="text-sm text-muted-foreground mt-1">Our team builds bespoke MCP servers that connect your existing tools and data to any AI agent. Typical turnaround: 1–2 weeks.</p>
            </div>
            <Link href="/#contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shrink-0">
              Get a Quote <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
