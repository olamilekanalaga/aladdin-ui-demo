import { BarChart3, LineChart } from "lucide-react";
import { Panel, Metric } from "@/app/components/ui";
import { TrenchChart } from "@/app/components/TrenchChart";
import { fmtMoney } from "@/app/utils/formatters";
import type { TokenBundle } from "@/app/types";

export function ChartMarket({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid"><Panel title="Trench chart" icon={LineChart}><TrenchChart bundle={bundle} /></Panel><Panel title="Market" icon={BarChart3}><div className="metrics"><Metric label="Price" value={fmtMoney(bundle.token.price_usd, 8)} /><Metric label="Market cap" value={fmtMoney(bundle.token.market_cap_usd, 0)} /><Metric label="FDV" value={fmtMoney(bundle.token.fdv_usd, 0)} /><Metric label="Liquidity" value={fmtMoney(bundle.token.liquidity_usd, 0)} /><Metric label="Volume 24h" value={fmtMoney(bundle.token.volume_24h_usd, 0)} /></div></Panel></div>;
}
