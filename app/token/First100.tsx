"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { Panel, Table } from "@/app/components/ui";
import { BehaviourBadge } from "@/app/components/badges";
import { fmtMoney, fmtPctWhole, short } from "@/app/utils/formatters";
import { solscanWallet } from "@/app/utils/links";
import { walletInfo } from "@/app/data/wallets";
import type { FirstBuyerRecord, TokenBundle } from "@/app/types";

export function First100({ bundle }: { bundle: TokenBundle }) {
  const [unit, setUnit] = useState<"usd" | "sol">("usd");
  const amount = (usd: number | null) => usd == null ? "Unavailable" : unit === "usd" ? fmtMoney(usd, 0) : `${(usd / 150).toFixed(2)} SOL`;
  const toggle = () => setUnit(unit === "usd" ? "sol" : "usd");
  return <Panel title={`First 100 - ${unit.toUpperCase()}`} icon={Target}><Table columns={["Wallet", "Behaviour", "Supply", "USD / SOL", "Sold / Rem"]} rows={bundle.first100.map((r: FirstBuyerRecord) => { const w = walletInfo(r.wallet); return [<a className="text-link" href={solscanWallet(r.wallet)} target="_blank" rel="noreferrer">{short(r.wallet)}</a>, <BehaviourBadge value={w.behaviour} />, fmtPctWhole(w.supplyPct), <button className="text-link" onClick={toggle}>{amount(w.usdValue)}</button>, `${fmtPctWhole(w.soldPct)} / ${fmtPctWhole(w.remainingPct)}`]; })} /></Panel>;
}
