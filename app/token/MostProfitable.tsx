import { Target } from "lucide-react";
import { Panel, Table } from "@/app/components/ui";
import { BehaviourBadge } from "@/app/components/badges";
import { fmtMoney, fmtPctWhole, short } from "@/app/utils/formatters";
import { solscanTx, solscanWallet } from "@/app/utils/links";
import { walletInfo } from "@/app/data/wallets";
import type { TokenBundle } from "@/app/types";

export function MostProfitable({ bundle }: { bundle: TokenBundle }) {
  const rows = bundle.participants.map((p) => ({ p, w: walletInfo(p.wallet), tx: bundle.trades.find((t) => t.wallet === p.wallet && t.side === "buy") ?? bundle.trades.find((t) => t.wallet === p.wallet) })).sort((a, b) => (b.w.pnlUsd ?? -Infinity) - (a.w.pnlUsd ?? -Infinity));
  return <Panel title="Most profitable" icon={Target}><Table columns={["Behaviour", "Realised PnL", "ROI %", "Entry MC", "Sold % / Remaining", "Wallet"]} rows={rows.map(({ p, w, tx }) => [<BehaviourBadge value={w.behaviour} />, fmtMoney(w.pnlUsd, 0), fmtPctWhole(w.roiPct), fmtMoney(w.entryMc, 0), `${fmtPctWhole(w.soldPct)} / ${fmtPctWhole(w.remainingPct)}`, <a className="text-link" href={tx ? solscanTx(tx.signature) : solscanWallet(p.wallet)} target="_blank" rel="noreferrer">{short(p.wallet)}</a>])} /></Panel>;
}
