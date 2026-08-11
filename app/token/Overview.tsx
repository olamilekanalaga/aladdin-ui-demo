import { AlertTriangle, BarChart3 } from "lucide-react";
import { Panel, Metric, List } from "@/app/components/ui";
import { ConfidenceBadge } from "@/app/components/badges";
import type { TokenBundle } from "@/app/types";

export function Overview({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid"><Panel title="Overview" icon={BarChart3}><div className="metrics"><Metric label="Token" value={`$${bundle.token.symbol}`} /><Metric label="Lifecycle" value={bundle.token.lifecycle.replace("_", " ")} /><Metric label="Behaviour" value={bundle.token.behaviour_label} /><Metric label="Participants" value={bundle.token.participation_score ?? "Unavailable"} /></div></Panel><Panel title="Data quality" icon={AlertTriangle}><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /><p>Source: {bundle.token.evidence_quality.source}</p><List items={bundle.token.evidence_quality.missing} /></Panel></div>;
}
