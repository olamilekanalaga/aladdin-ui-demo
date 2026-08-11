"use client";

import { Target, Wallet } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Shell } from "@/app/components/Shell";
import { Metric, Panel } from "@/app/components/ui";
import { BehaviourBadge } from "@/app/components/badges";
import { wallets, walletInfo } from "@/app/data/wallets";
import { fmtMoney, fmtPct, fmtPctWhole, short } from "@/app/utils/formatters";

export function WalletPage({ address }: { address?: string }) {
  const wallet = wallets.find((w) => w.wallet === address) ?? wallets[0];
  const info = walletInfo(wallet.wallet);
  return <Shell active="live"><Header title="Wallet display" subtitle="Search result" icon={Wallet} /><div className="grid"><Panel title={short(wallet.wallet)} icon={Wallet}><Metric label="Behaviour" value={<BehaviourBadge value={info.behaviour} />} /><Metric label="Win rate" value={fmtPct(info.winRate)} /><Metric label="No. trades" value={info.trades} /><Metric label="Net profit" value={fmtMoney(info.pnlUsd, 0)} /><Metric label="Holdings" value={fmtPctWhole(info.holdingPct)} /></Panel><Panel title="Decision relevance" icon={Target}><p>Wallet display opens from search or table rows. It supports token investigation; it is not a separate main navigation mode.</p></Panel></div></Shell>;
}
