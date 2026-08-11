import { Avatar, Metric } from "@/app/components/ui";
import { BehaviourBadge, Pill } from "@/app/components/badges";
import { MiniTrench } from "@/app/components/MiniTrench";
import { bundles } from "@/app/data/bundles";
import { fmtMoney, fmtPctWhole, short } from "@/app/utils/formatters";
import { walletInfo } from "@/app/data/wallets";

export function DemoTerminalPreview() {
  const bundle = bundles[0];
  return <article className="public-product-preview">
    <div className="preview-top"><span>ALADDIN</span><small>Demo interface</small></div>
    <div className="preview-search">Search token / wallet / transaction...</div>
    <div className="preview-token">
      <Avatar token={bundle.token} />
      <div><strong>${bundle.token.symbol}</strong><span>{bundle.token.name}</span></div>
      <Pill tone="purple">demo evidence</Pill>
    </div>
    <div className="preview-metrics">
      <Metric label="Market cap" value={fmtMoney(bundle.token.market_cap_usd, 0)} />
      <Metric label="Holders" value={bundle.holders.length} />
      <Metric label="Net flow" value="+4.7 SOL" />
    </div>
    <MiniTrench token={bundle.token} />
    <div className="preview-table">
      <span>Participants</span><span>Behaviour</span><span>Holding</span>
      {bundle.first100.slice(0, 3).map((row) => <div className="preview-table-row" key={row.wallet}><b>{short(row.wallet)}</b><BehaviourBadge value={walletInfo(row.wallet).behaviour} /><b>{fmtPctWhole(row.retained_pct)}</b></div>)}
    </div>
  </article>;
}
