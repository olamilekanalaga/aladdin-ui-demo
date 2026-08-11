import type { TokenBundle } from "@/app/types";

export function TrenchChart({ bundle }: { bundle: TokenBundle }) {
  const points = bundle.token.checkpoints.map((c, i) => ({ x: 16 + i * 28, y: 82 - ((c.market_cap_usd ?? 0) / Math.max(...bundle.token.checkpoints.map((p) => p.market_cap_usd ?? 0), 1)) * 56, c }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${points.at(-1)?.x ?? 100} 92 L ${points[0].x} 92 Z`;
  return <div className="trench"><svg viewBox="0 0 112 100" preserveAspectRatio="none"><defs><linearGradient id="trenchFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8f5cff" stopOpacity="0.5" /><stop offset="100%" stopColor="#8f5cff" stopOpacity="0" /></linearGradient></defs><path className="gridline" d="M 0 25 H 112 M 0 50 H 112 M 0 75 H 112" /><path className="area" d={area} /><path className="line" d={path} />{points.map((p) => <circle key={p.c.checkpoint} cx={p.x} cy={p.y} r="2.4" />)}</svg><div className="trench-labels">{bundle.token.checkpoints.map((c) => <span key={c.checkpoint}>{c.checkpoint}</span>)}</div></div>;
}
