import type { TokenRecord } from "@/app/types";

export function MiniTrench({ token }: { token: TokenRecord }) {
  const max = Math.max(...token.checkpoints.map((c) => c.market_cap_usd ?? 0), 1);
  const pts = token.checkpoints.map((c, i) => `${i * 33},${40 - ((c.market_cap_usd ?? 0) / max) * 30}`).join(" ");
  return <svg className="mini-trench" viewBox="0 0 100 44" preserveAspectRatio="none"><polyline points={pts} /></svg>;
}
