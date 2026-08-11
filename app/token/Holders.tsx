import { Eye } from "lucide-react";
import { Panel, Table } from "@/app/components/ui";
import { BehaviourBadge } from "@/app/components/badges";
import { fmtMoney, fmtPctWhole, short } from "@/app/utils/formatters";
import { solscanWallet } from "@/app/utils/links";
import { walletInfo } from "@/app/data/wallets";
import type { TokenBundle } from "@/app/types";

export function Holders({ bundle }: { bundle: TokenBundle }) {
  return <Panel title="Holders" icon={Eye}><Table columns={["Wallet", "Behaviour", "Supply", "USD value", "Age", "Sold / Rem."]} rows={bundle.holders.map((h) => { const w = walletInfo(h.wallet); return [<a className="text-link" href={solscanWallet(h.wallet)} target="_blank" rel="noreferrer">{short(h.wallet)}</a>, <BehaviourBadge value={w.behaviour} />, fmtPctWhole(w.supplyPct ?? h.share_pct), fmtMoney(w.usdValue, 0), w.age, `${fmtPctWhole(w.soldPct)} / ${fmtPctWhole(w.remainingPct)}`]; })} /></Panel>;
}
