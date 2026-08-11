"use client";

import { Download } from "lucide-react";
import { Table } from "@/app/components/ui";
import { useGo } from "@/app/utils/navigation";
import { downloadIfaCsv } from "./mock";
import type { IfaEvidenceBlock } from "./ifa-types";

export function IfaMetricSummary({ block }: { block: Extract<IfaEvidenceBlock, { kind: "metrics" }> }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong>{block.metadata && <span>{block.metadata}</span>}</div><div className="ifa-metric-grid">{block.items.map((item) => <div className="ifa-metric" key={item.label}><b>{item.value}</b><span>{item.label}</span>{item.detail && <small>{item.detail}</small>}</div>)}</div></div>;
}

export function IfaEvidenceActions({ actions = [], terminalPath }: { actions?: string[]; terminalPath: string }) {
  const go = useGo();
  if (!actions.length) return null;
  return <div className="ifa-evidence-actions">{actions.map((action) => <button key={action} type="button" onClick={() => action === "Open in Terminal" ? go(terminalPath) : action === "Export" ? downloadIfaCsv() : undefined}>{action === "Export" && <Download size={14} />}{action}</button>)}</div>;
}

export function IfaEvidenceTable({ block, terminalPath }: { block: Extract<IfaEvidenceBlock, { kind: "table" }>; terminalPath: string }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong><span>{block.subtitle}</span></div><Table columns={block.columns} rows={block.rows} /><IfaEvidenceActions actions={block.actions} terminalPath={terminalPath} /></div>;
}

export function IfaChartBlock({ block, terminalPath }: { block: Extract<IfaEvidenceBlock, { kind: "chart" }>; terminalPath: string }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong><span>{block.subtitle}</span></div><div className="ifa-chart-bars">{block.points.map((point) => <div className="ifa-chart-item" key={point.label}><div><i style={{ height: `${Math.max(10, point.value)}%` }} /></div><b>{point.label}</b><span>{point.detail}</span></div>)}</div><IfaEvidenceActions actions={block.actions} terminalPath={terminalPath} /></div>;
}

export function IfaTimelineBlock({ block }: { block: Extract<IfaEvidenceBlock, { kind: "timeline" }> }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong><span>Context timeline</span></div><div className="ifa-timeline">{block.events.map((event) => <div key={`${event.time}-${event.label}`}><time>{event.time}</time><b>{event.label}</b><span>{event.detail}</span></div>)}</div></div>;
}

export function IfaEvidence({ block, terminalPath }: { block: IfaEvidenceBlock; terminalPath: string }) {
  if (block.kind === "metrics") return <IfaMetricSummary block={block} />;
  if (block.kind === "table") return <IfaEvidenceTable block={block} terminalPath={terminalPath} />;
  if (block.kind === "chart") return <IfaChartBlock block={block} terminalPath={terminalPath} />;
  return <IfaTimelineBlock block={block} />;
}
