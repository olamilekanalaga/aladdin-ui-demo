import { Activity } from "lucide-react";
import { Panel, Table } from "@/app/components/ui";
import { BehaviourBadge, Pill } from "@/app/components/badges";
import { fmtMoney, fmtPct, fmtPctWhole, short } from "@/app/utils/formatters";
import { walletInfo } from "@/app/data/wallets";
import type { TradeRecord } from "@/app/types";

export function Trades({ rows, compact = false }: { rows: TradeRecord[]; compact?: boolean }) {
  return <Panel title={compact ? "Trades" : "Trade layout"} icon={Activity}><Table columns={["Time", "Behaviour", "Win Rate (No. Trades)", "Side", "Amount (SOL / USD)", "Holding %", "Txn Hash"]} rows={rows.map((t) => { const w = walletInfo(t.wallet); return [new Date(t.timestamp).toLocaleTimeString(), <BehaviourBadge value={w.behaviour} />, `${fmtPct(w.winRate)} (${w.trades})`, <Pill tone={t.side === "buy" ? "good" : "bad"}>{t.side.toUpperCase()}</Pill>, `${t.sol_amount.toFixed(2)} SOL / ${fmtMoney((t.price_usd ?? 0) * t.token_amount, 2)}`, fmtPctWhole(w.holdingPct), <button className="text-link" onClick={() => navigator.clipboard?.writeText(t.signature)}>{short(t.signature, 8, 5)}</button>]; })} /></Panel>;
}
