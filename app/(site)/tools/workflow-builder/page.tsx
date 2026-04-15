"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  ChevronDown,
  GripVertical,
} from "lucide-react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Connection,
  type NodeProps,
  MarkerType,
  type Node,
} from "reactflow"
import "reactflow/dist/style.css"

// ── Node type definitions ─────────────────────────────────────────────────

type AgentNodeType = "trigger" | "agent" | "human" | "output" | "condition"

interface AgentNodeData {
  label: string
  sublabel?: string
  nodeType: AgentNodeType
}

const NODE_COLORS: Record<AgentNodeType, { border: string; bg: string; label: string; dot: string }> = {
  trigger:   { border: "#635BFF", bg: "rgba(99,91,255,0.08)",  label: "#635BFF", dot: "#635BFF" },
  agent:     { border: "rgba(255,255,255,0.12)", bg: "#111113", label: "#EDEDEC", dot: "#8B8B8D" },
  human:     { border: "#F59E0B", bg: "rgba(245,158,11,0.08)", label: "#F59E0B", dot: "#F59E0B" },
  output:    { border: "#00D47E", bg: "rgba(0,212,126,0.08)",  label: "#00D47E", dot: "#00D47E" },
  condition: { border: "#FF6B6B", bg: "rgba(255,107,107,0.08)",label: "#FF6B6B", dot: "#FF6B6B" },
}

const TYPE_LABELS: Record<AgentNodeType, string> = {
  trigger: "Trigger",
  agent: "Agent",
  human: "Human",
  output: "Output",
  condition: "Condition",
}

function AgentNode({ data, selected }: NodeProps<AgentNodeData>) {
  const c = NODE_COLORS[data.nodeType]
  return (
    <div
      style={{
        border: `1.5px solid ${selected ? "#635BFF" : c.border}`,
        background: c.bg,
        borderRadius: "10px",
        minWidth: "140px",
        maxWidth: "180px",
        padding: "10px 14px",
        boxShadow: selected ? "0 0 0 3px rgba(99,91,255,0.25)" : "none",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: c.dot, border: "none", width: 8, height: 8 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontFamily: "monospace", color: c.label, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {TYPE_LABELS[data.nodeType]}
        </span>
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#EDEDEC", lineHeight: 1.3, marginBottom: data.sublabel ? 2 : 0 }}>
        {data.label}
      </p>
      {data.sublabel && (
        <p style={{ fontSize: 9, color: "#8B8B8D", fontFamily: "monospace", lineHeight: 1.2 }}>{data.sublabel}</p>
      )}
      <Handle type="source" position={Position.Right} style={{ background: c.dot, border: "none", width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes = { agentNode: AgentNode }

// ── Preset pipelines ─────────────────────────────────────────────────────────

const defaultEdgeStyle = {
  style: { stroke: "rgba(99,91,255,0.5)", strokeWidth: 1.5, strokeDasharray: "5 3" },
  markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(99,91,255,0.7)", width: 14, height: 14 },
  animated: true,
}

const PRESETS: Record<string, { nodes: Node<AgentNodeData>[]; edges: ReturnType<typeof addEdge>[] }> = {
  blogging: {
    nodes: [
      { id: "kw",      type: "agentNode", position: { x: 40,  y: 120 }, data: { label: "Keyword Agent",   sublabel: "Cluster + intent",   nodeType: "trigger" } },
      { id: "brief",   type: "agentNode", position: { x: 240, y: 120 }, data: { label: "Brief Agent",     sublabel: "Outline + angle",    nodeType: "agent" } },
      { id: "writer",  type: "agentNode", position: { x: 440, y: 120 }, data: { label: "Writer Agent",    sublabel: "Draft generation",   nodeType: "agent" } },
      { id: "seo",     type: "agentNode", position: { x: 640, y: 40  }, data: { label: "SEO Agent",       sublabel: "Keyword density",    nodeType: "agent" } },
      { id: "human",   type: "agentNode", position: { x: 640, y: 200 }, data: { label: "Human Review",    sublabel: "Slack approval",     nodeType: "human" } },
      { id: "publish", type: "agentNode", position: { x: 840, y: 120 }, data: { label: "Publisher",       sublabel: "WordPress + images", nodeType: "output" } },
    ],
    edges: [
      { id: "e1", source: "kw",     target: "brief",   ...defaultEdgeStyle },
      { id: "e2", source: "brief",  target: "writer",  ...defaultEdgeStyle },
      { id: "e3", source: "writer", target: "seo",     ...defaultEdgeStyle },
      { id: "e4", source: "writer", target: "human",   ...defaultEdgeStyle },
      { id: "e5", source: "seo",    target: "publish", ...defaultEdgeStyle },
      { id: "e6", source: "human",  target: "publish", ...defaultEdgeStyle },
    ],
  },
  geo: {
    nodes: [
      { id: "crawl",  type: "agentNode", position: { x: 40,  y: 120 }, data: { label: "Crawl Agent",   sublabel: "Site audit",         nodeType: "trigger" } },
      { id: "geo",    type: "agentNode", position: { x: 240, y: 120 }, data: { label: "GEO Scorer",    sublabel: "Signal analysis",    nodeType: "agent" } },
      { id: "schema", type: "agentNode", position: { x: 440, y: 40  }, data: { label: "Schema Agent",  sublabel: "JSON-LD generation", nodeType: "agent" } },
      { id: "brief2", type: "agentNode", position: { x: 440, y: 200 }, data: { label: "Content Brief", sublabel: "GEO-optimized",      nodeType: "agent" } },
      { id: "report", type: "agentNode", position: { x: 640, y: 120 }, data: { label: "Report Agent",  sublabel: "Monthly delivery",   nodeType: "output" } },
    ],
    edges: [
      { id: "e1", source: "crawl",  target: "geo",    ...defaultEdgeStyle },
      { id: "e2", source: "geo",    target: "schema",  ...defaultEdgeStyle },
      { id: "e3", source: "geo",    target: "brief2",  ...defaultEdgeStyle },
      { id: "e4", source: "schema", target: "report",  ...defaultEdgeStyle },
      { id: "e5", source: "brief2", target: "report",  ...defaultEdgeStyle },
    ],
  },
  openclaw: {
    nodes: [
      { id: "vps",      type: "agentNode", position: { x: 40,  y: 120 }, data: { label: "VPS Agent",      sublabel: "Docker + hardening", nodeType: "trigger" } },
      { id: "skills",   type: "agentNode", position: { x: 240, y: 120 }, data: { label: "Skills Builder", sublabel: "5 custom skills",    nodeType: "agent" } },
      { id: "channels", type: "agentNode", position: { x: 440, y: 120 }, data: { label: "Channel Agent",  sublabel: "WhatsApp / Slack",   nodeType: "agent" } },
      { id: "audit",    type: "agentNode", position: { x: 640, y: 40  }, data: { label: "Audit Agent",    sublabel: "Pen test + report",  nodeType: "human" } },
      { id: "handover", type: "agentNode", position: { x: 640, y: 200 }, data: { label: "Handover",       sublabel: "Docs + 30-day SLA",  nodeType: "output" } },
    ],
    edges: [
      { id: "e1", source: "vps",      target: "skills",   ...defaultEdgeStyle },
      { id: "e2", source: "skills",   target: "channels", ...defaultEdgeStyle },
      { id: "e3", source: "channels", target: "audit",    ...defaultEdgeStyle },
      { id: "e4", source: "channels", target: "handover", ...defaultEdgeStyle },
    ],
  },
}

const PALETTE_NODES: { nodeType: AgentNodeType; label: string; sublabel: string }[] = [
  { nodeType: "trigger",   label: "New Trigger",   sublabel: "Webhook / Schedule" },
  { nodeType: "agent",     label: "New Agent",     sublabel: "AI task runner" },
  { nodeType: "human",     label: "Human Review",  sublabel: "Approval gate" },
  { nodeType: "condition", label: "Branch",        sublabel: "If / Else logic" },
  { nodeType: "output",    label: "Output",        sublabel: "Destination" },
]

let nodeIdCounter = 100

export default function WorkflowBuilderPage() {
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS>("blogging")
  const [nodes, setNodes, onNodesChange] = useNodesState(PRESETS.blogging.nodes as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState(PRESETS.blogging.edges as Parameters<typeof addEdge>[1])
  const [draggingType, setDraggingType] = useState<AgentNodeType | null>(null)
  const [showExport, setShowExport] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, ...defaultEdgeStyle }, eds)),
    [setEdges]
  )

  function loadPreset(key: keyof typeof PRESETS) {
    setActivePreset(key)
    setNodes(PRESETS[key].nodes as Node[])
    setEdges(PRESETS[key].edges as Parameters<typeof addEdge>[1])
    setShowExport(false)
  }

  function addNodeToCanvas(item: typeof PALETTE_NODES[0]) {
    const id = `node-${nodeIdCounter++}`
    const newNode: Node<AgentNodeData> = {
      id,
      type: "agentNode",
      position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { label: item.label, sublabel: item.sublabel, nodeType: item.nodeType },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  function deleteSelectedNodes() {
    setNodes((nds) => nds.filter((n) => !n.selected))
    setEdges((eds) => eds.filter((e) => {
      const deletedIds = nodes.filter((n) => n.selected).map((n) => n.id)
      return !deletedIds.includes(e.source) && !deletedIds.includes(e.target)
    }))
  }

  const exportJson = useMemo(() => JSON.stringify(
    {
      nodes: nodes.map(({ id, data, position }) => ({ id, data, position })),
      edges: edges.map(({ id, source, target }) => ({ id, source, target })),
    },
    null, 2
  ), [nodes, edges])

  const hasSelected = nodes.some((n) => n.selected)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3 shrink-0">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">AI Workflow Builder</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-border px-6 py-2.5 flex items-center gap-4 flex-wrap shrink-0 bg-card">
        <p className="text-sm font-semibold text-foreground hidden sm:block">Workflow Builder</p>

        {/* Preset tabs */}
        <div className="flex gap-1.5 ml-0 sm:ml-4">
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((key) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                activePreset === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {key === "openclaw" ? "OpenClaw" : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {hasSelected && (
            <button
              onClick={deleteSelectedNodes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={11} /> Delete selected
            </button>
          )}
          <button
            onClick={() => loadPreset(activePreset)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-muted-foreground text-xs hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <RotateCcw size={11} /> Reset
          </button>
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity"
          >
            <Download size={11} /> Export JSON
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 156px)" }}>
        {/* Left palette */}
        <aside className="w-48 shrink-0 border-r border-border bg-card flex flex-col p-3 gap-2 overflow-y-auto">
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider px-1 pt-1">Drag to add</p>
          {PALETTE_NODES.map((item) => {
            const c = NODE_COLORS[item.nodeType]
            return (
              <button
                key={item.nodeType}
                draggable
                onDragStart={() => setDraggingType(item.nodeType)}
                onDragEnd={() => setDraggingType(null)}
                onClick={() => addNodeToCanvas(item)}
                className="text-left flex items-start gap-2 rounded-lg border p-2.5 hover:border-primary/40 transition-colors cursor-grab active:cursor-grabbing"
                style={{ borderColor: draggingType === item.nodeType ? c.border : "rgba(255,255,255,0.06)", background: draggingType === item.nodeType ? c.bg : "#111113" }}
              >
                <GripVertical size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold" style={{ color: c.label }}>{item.label}</p>
                  <p className="text-[9px] font-mono text-muted-foreground leading-tight">{item.sublabel}</p>
                </div>
              </button>
            )
          })}

          <div className="border-t border-border pt-2 mt-2">
            <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">Legend</p>
            {(Object.keys(NODE_COLORS) as AgentNodeType[]).map((type) => {
              const c = NODE_COLORS[type]
              return (
                <div key={type} className="flex items-center gap-2 py-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.dot }} />
                  <span className="text-[10px] font-mono text-muted-foreground">{TYPE_LABELS[type]}</span>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative bg-[#08090A]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            deleteKeyCode="Backspace"
            style={{ background: "#08090A" }}
          >
            <Background color="rgba(255,255,255,0.04)" gap={20} />
            <Controls
              style={{
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
              }}
            />
            <MiniMap
              nodeColor={(n) => {
                const d = n.data as AgentNodeData
                return NODE_COLORS[d.nodeType]?.dot ?? "#635BFF"
              }}
              style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.06)" }}
              maskColor="rgba(0,0,0,0.6)"
            />
          </ReactFlow>

          {/* Add node button */}
          <button
            onClick={() => addNodeToCanvas(PALETTE_NODES[1])}
            className="absolute bottom-6 right-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={13} /> Add Agent Node
          </button>
        </div>

        {/* Export panel */}
        {showExport && (
          <aside className="w-80 shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-foreground">Export JSON</p>
              <button onClick={() => setShowExport(false)} className="text-muted-foreground hover:text-foreground text-xs">close</button>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-[10px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {exportJson}
            </pre>
            <div className="border-t border-border p-3 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(exportJson)}
                className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportJson], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `workflow-${activePreset}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Download .json
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Help bar */}
      <div className="border-t border-border px-6 py-2 flex items-center gap-4 text-[10px] font-mono text-muted-foreground shrink-0 bg-card flex-wrap">
        <span>Click nodes to select · Drag to connect handles · Backspace to delete selected</span>
        <Link href="/services/openclaw-setup" className="ml-auto text-primary hover:underline">
          Deploy a real workflow <ChevronDown size={10} className="-rotate-90 inline" />
        </Link>
      </div>
    </div>
  )
}
