"use client";

import { ArrowRight, Clipboard } from "lucide-react";
import { Avatar, Metric } from "@/app/components/ui";
import { Pill } from "@/app/components/badges";
import { MiniTrench } from "@/app/components/MiniTrench";
import { fmtMoney, short } from "@/app/utils/formatters";
import { useGo } from "@/app/utils/navigation";
import type { TokenRecord } from "@/app/types";

export function TokenCard({ token }: { token: TokenRecord }) {
  const go = useGo();
  const s = token.first_buyer_summary;
  return <article className="card"><div className="token-head"><Avatar token={token} /><div><div className="token-title"><strong>${token.symbol}</strong><span>{token.name}</span></div><button className="copy" onClick={() => navigator.clipboard?.writeText(token.token_mint)}>{short(token.token_mint)} <Clipboard size={13} /></button></div><Pill tone={token.lifecycle === "migrated" ? "good" : token.lifecycle === "pre_migration" ? "warn" : "purple"}>{token.lifecycle.replace("_", " ")}</Pill></div><div className="metrics compact"><Metric label="Market cap" value={fmtMoney(token.market_cap_usd, 0)} /><Metric label="Volume" value={fmtMoney(token.volume_24h_usd, 0)} /><Metric label="Liquidity" value={fmtMoney(token.liquidity_usd, 0)} /><Metric label="Behaviour" value={token.behaviour_label} /></div><MiniTrench token={token} /><p className="evidence"><b>First 100:</b> {s.holding} holding / {s.partial_exit} partial / {s.full_exit} full exit / {s.accumulated} accumulated</p><button className="card-link" onClick={() => go(`/token/${token.token_mint}/trades`)}>Open token <ArrowRight size={15} /></button></article>;
}
