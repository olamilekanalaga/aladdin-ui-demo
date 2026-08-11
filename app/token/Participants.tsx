import { Users } from "lucide-react";
import { Panel, Table } from "@/app/components/ui";
import { BehaviourBadge } from "@/app/components/badges";
import { fmtMoney, fmtPctWhole } from "@/app/utils/formatters";
import { walletInfo } from "@/app/data/wallets";
import type { ParticipantRecord } from "@/app/types";

export function Participants({ rows }: { rows: ParticipantRecord[] }) {
  const grouped = Object.values(rows.reduce((acc, p) => {
    const w = walletInfo(p.wallet);
    const key = w.behaviour;
    if (!acc[key]) acc[key] = { behaviour: key, participants: 0, buys: 0, pnlUsd: 0, holdings: 0, holdingsCount: 0 };
    acc[key].participants += 1;
    acc[key].buys += p.buys;
    acc[key].pnlUsd += w.pnlUsd ?? 0;
    if (w.holdingPct != null) { acc[key].holdings += w.holdingPct; acc[key].holdingsCount += 1; }
    return acc;
  }, {} as Record<string, { behaviour: string; participants: number; buys: number; pnlUsd: number; holdings: number; holdingsCount: number }>));
  return <Panel title="Participants by behaviour" icon={Users}><Table columns={["Behaviour", "Participants", "Buys", "Net Profit", "Holdings"]} rows={grouped.map((g) => [<BehaviourBadge value={g.behaviour} />, g.participants, g.buys, fmtMoney(g.pnlUsd, 0), g.holdingsCount ? fmtPctWhole(g.holdings / g.holdingsCount) : "Unavailable"])} /></Panel>;
}
