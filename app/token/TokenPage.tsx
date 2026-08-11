"use client";

import { Clipboard } from "lucide-react";
import { Shell } from "@/app/components/Shell";
import { Avatar } from "@/app/components/ui";
import { ConfidenceBadge, Pill } from "@/app/components/badges";
import { ChartMarket } from "./ChartMarket";
import { renderTokenTab } from "./renderTokenTab";
import { findBundle } from "@/app/data/bundles";
import { useGo } from "@/app/utils/navigation";

export function TokenPage({ mint, tab }: { mint?: string; tab?: string }) {
  const go = useGo();
  const bundle = findBundle(mint);
  const active = tab || "trades";
  const tabs = ["trades", "participants", "most-profitable", "largest-holders", "first-100", "holders", "overview"];
  return <Shell active="live"><header className="token-hero"><Avatar token={bundle.token} large /><div><p className="eyebrow">Live terminal / token behaviour</p><h1>${bundle.token.symbol} {bundle.token.name}</h1><button className="copy" onClick={() => navigator.clipboard?.writeText(bundle.token.token_mint)}>{bundle.token.token_mint} <Clipboard size={14} /></button></div><div className="hero-pills"><Pill tone="purple">{bundle.token.behaviour_label}</Pill><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /></div></header><ChartMarket bundle={bundle} /><div className="tabs scroll layer-tabs">{tabs.map((t) => <button key={t} className={active === t ? "active" : ""} onClick={() => go(`/token/${bundle.token.token_mint}/${t}`)}>{t.replace("-", " ")}</button>)}</div>{renderTokenTab(bundle, active)}</Shell>;
}
