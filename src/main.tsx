import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, AlertTriangle, ArrowRight, BarChart3, Brain, Clipboard, Command, Compass, Download, Eye, LineChart, Lock, MessageSquare, Search, ShieldAlert, Sparkles, Target, Users, Wallet, Zap } from "lucide-react";
import { CHECKPOINTS, bundles, findBundle, fmtMoney, fmtPct, searchDemo, short, wallets } from "./data";
import type { Checkpoint, Confidence, FirstBuyerRecord, ParticipantRecord, TokenBundle, TokenRecord, TradeRecord } from "./types";
import "./styles.css";

const route = () => window.location.pathname.replace(/\/$/, "") || "/";
const parts = () => route().split("/").filter(Boolean);
const go = (path: string) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function useRoute() {
  const [path, setPath] = useState(route());
  React.useEffect(() => {
    const update = () => setPath(route());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return path;
}

function ConfidenceBadge({ value }: { value: Confidence }) {
  const labels: Record<Confidence, string> = { verified: "Verified", partial: "Partial", demo_only: "Evidence", unavailable: "Unavailable" };
  return <span className={`confidence ${value}`}>{labels[value]}</span>;
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "purple" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function Avatar({ token, large = false }: { token: TokenRecord; large?: boolean }) {
  return <div className={`avatar ${large ? "large" : ""}`}>{token.symbol.slice(0, 2)}</div>;
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number }>; children: React.ReactNode }) {
  return <section className="panel"><h2><Icon size={18} />{title}</h2>{children}</section>;
}

function Table({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  if (!rows.length) return <Empty text="No rows available." />;
  return <div className="table-wrap"><table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={`${i}-${j}`}>{c}</td>)}</tr>)}</tbody></table></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="empty"><AlertTriangle size={18} />{text}</div>;
}

function Landing() {
  return <main className="landing"><section className="landing-card"><p className="eyebrow">Aladdin terminal</p><h1>Live Pump.fun intelligence with behavioural labels.</h1><p className="lede">Aladdin watches launches, trades, wallets and formations. IFÁ waits until you ask a question.</p><div className="actions"><button className="primary" onClick={() => go("/login")}>Enter terminal</button><button className="ghost" onClick={() => go("/app/live")}>Open live view</button></div><div className="chips"><span>Live terminal</span><span>Wallet / CA search</span><span>Ask IFÁ on demand</span></div></section></main>;
}

function Login() {
  const [value, setValue] = useState("");
  return <main className="login"><form className="login-card" onSubmit={(e) => { e.preventDefault(); sessionStorage.setItem("aladdin-demo-auth", value || "ok"); go("/app/live"); }}><Lock size={34} /><h1>Aladdin access</h1><p>Open the terminal workspace.</p><input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter access phrase" /><button className="primary">Open Aladdin</button></form></main>;
}

function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  const nav = [
    ["live", "Live Terminal", Zap, "/app/live"],
    ["launches", "Launches", Sparkles, "/app/launches/new"],
    ["tokens", "Token Intelligence", LineChart, `/app/token/${bundles[0].token.token_mint}/overview`],
    ["ifa", "Ask IFÁ", Command, "/app/ask-ifa"]
  ] as const;
  return <div className="shell"><aside><button className="brand" onClick={() => go("/app/live")}><b>A</b><span><strong>Aladdin</strong><small>Live intelligence</small></span></button><nav>{nav.map(([id, label, Icon, path]) => <button key={id} className={active === id ? "active" : ""} onClick={() => go(path)}><Icon size={18} />{label}</button>)}</nav><div className="side-note"><ShieldAlert size={18} /><p>Labels explain behaviour. IFÁ answers only when asked.</p></div></aside><main className="stage">{children}</main></div>;
}

function Header({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ComponentType<{ size?: number }> }) {
  return <header className="header"><div><p className="eyebrow"><Icon size={15} />{subtitle}</p><h1>{title}</h1></div></header>;
}

function LiveTerminal() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchDemo(query), [query]);
  const trades = bundles.flatMap((b) => b.trades.map((t) => ({ ...t, token: b.token }))).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return <Shell active="live"><Header title="Live Terminal" subtitle="Market stream and search" icon={Zap} /><section className="top-search"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search CA, token, wallet, or transaction..." /></section>{query && <div className="results live-results">{results.map((r) => <button key={`${r.type}-${r.subtitle}`} className="result" onClick={() => go(r.route)}><span>{r.type}</span><strong>{r.title}</strong><small>{r.subtitle}</small><ConfidenceBadge value={r.confidence} /></button>)}{!results.length && <Empty text="No matching token, wallet or transaction found." />}</div>}<div className="live-layout"><section><div className="grid terminal-cards">{bundles.map((b) => <TokenCard key={b.token.token_mint} token={b.token} />)}</div></section><aside className="stream-panel"><h2><Activity size={18} /> Trade stream</h2><div className="stream-list">{trades.map((t) => <button key={t.signature} onClick={() => go(`/app/token/${t.token_mint}/trades`)}><Pill tone={t.side === "buy" ? "good" : "bad"}>{t.side.toUpperCase()}</Pill><span>${t.token.symbol}</span><strong>{t.sol_amount.toFixed(2)} SOL</strong><small>{short(t.wallet)}</small></button>)}</div></aside></div></Shell>;
}

function Launches({ tab }: { tab: string }) {
  const filtered = bundles.filter((b) => tab === "new" ? b.token.lifecycle === "new_launch" : tab === "premigration" ? b.token.lifecycle === "pre_migration" : tab === "migrated" ? b.token.lifecycle === "migrated" : true);
  const tabs = [["new", "New Launches"], ["premigration", "Pre-Migration"], ["migrated", "Migrated"], ["trending", "Discovery / Trending"]];
  return <Shell active="launches"><Header title="Launch intelligence" subtitle="Token lifecycle" icon={Compass} /><div className="tabs">{tabs.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => go(`/app/launches/${id}`)}>{label}</button>)}</div><div className="grid">{filtered.map((b) => <TokenCard key={b.token.token_mint} token={b.token} />)}{!filtered.length && <Empty text="No tokens in this workspace." />}</div></Shell>;
}

function TokenCard({ token }: { token: TokenRecord }) {
  const s = token.first_buyer_summary;
  return <article className="card"><div className="token-head"><Avatar token={token} /><div><div className="token-title"><strong>${token.symbol}</strong><span>{token.name}</span></div><button className="copy" onClick={() => navigator.clipboard?.writeText(token.token_mint)}>{short(token.token_mint)} <Clipboard size={13} /></button></div><Pill tone={token.lifecycle === "migrated" ? "good" : token.lifecycle === "pre_migration" ? "warn" : "purple"}>{token.lifecycle.replace("_", " ")}</Pill></div><div className="metrics compact"><Metric label="Market cap" value={fmtMoney(token.market_cap_usd, 0)} /><Metric label="Volume" value={fmtMoney(token.volume_24h_usd, 0)} /><Metric label="Market Index" value={token.market_index ?? "Unavailable"} /><Metric label="Label" value={token.behaviour_label} /></div><MiniTrench token={token} /><p className="evidence"><b>First 100:</b> {s.holding} holding / {s.partial_exit} partial / {s.full_exit} full exit / {s.accumulated} accumulated</p><button className="card-link" onClick={() => go(`/app/token/${token.token_mint}/overview`)}>Open token <ArrowRight size={15} /></button></article>;
}

function TokenPage({ mint, tab }: { mint?: string; tab?: string }) {
  const bundle = findBundle(mint);
  const active = tab || "overview";
  const tabs = ["overview", "trades", "participants", "first-100", "holders", "wallet-token", "live-state", "formation-evidence", "historical-match", "ask-ifa", "profitable"];
  return <Shell active="tokens"><header className="token-hero"><Avatar token={bundle.token} large /><div><p className="eyebrow">Token Intelligence / {bundle.token.lifecycle.replace("_", " ")}</p><h1>${bundle.token.symbol} {bundle.token.name}</h1><button className="copy" onClick={() => navigator.clipboard?.writeText(bundle.token.token_mint)}>{bundle.token.token_mint} <Clipboard size={14} /></button></div><div className="hero-pills"><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /><Pill tone="purple">{bundle.token.current_checkpoint}</Pill></div></header><div className="tabs scroll">{tabs.map((t) => <button key={t} className={active === t ? "active" : ""} onClick={() => go(`/app/token/${bundle.token.token_mint}/${t}`)}>{t.replace("-", " ")}</button>)}</div>{renderTokenTab(bundle, active)}</Shell>;
}

function renderTokenTab(bundle: TokenBundle, tab: string) {
  if (tab === "trades") return <Trades rows={bundle.trades} />;
  if (tab === "participants") return <Participants rows={bundle.participants} />;
  if (tab === "first-100") return <First100 rows={bundle.first100} />;
  if (tab === "holders") return <Holders bundle={bundle} />;
  if (tab === "wallet-token") return <WalletToken bundle={bundle} />;
  if (tab === "live-state") return <LiveState bundle={bundle} />;
  if (tab === "formation-evidence") return <Formation bundle={bundle} />;
  if (tab === "historical-match") return <Historical bundle={bundle} />;
  if (tab === "ask-ifa") return <AskIfa embedded bundle={bundle} />;
  if (tab === "profitable") return <Profitable />;
  return <Overview bundle={bundle} />;
}

function Overview({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid"><Panel title="Market evidence" icon={BarChart3}><div className="metrics"><Metric label="Price" value={fmtMoney(bundle.token.price_usd, 8)} /><Metric label="Market cap" value={fmtMoney(bundle.token.market_cap_usd, 0)} /><Metric label="FDV" value={fmtMoney(bundle.token.fdv_usd, 0)} /><Metric label="Liquidity" value={fmtMoney(bundle.token.liquidity_usd, 0)} /><Metric label="Volume 24h" value={fmtMoney(bundle.token.volume_24h_usd, 0)} /><Metric label="Behaviour label" value={bundle.token.behaviour_label} /></div></Panel><Panel title="Trench chart" icon={LineChart}><TrenchChart bundle={bundle} /></Panel><Panel title="First-buyer retention" icon={Users}><Retention token={bundle.token} /></Panel><Panel title="Data quality" icon={AlertTriangle}><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /><p>Source: {bundle.token.evidence_quality.source}</p><List items={bundle.token.evidence_quality.missing} /></Panel></div>;
}

function Trades({ rows }: { rows: TradeRecord[] }) {
  return <Panel title="Trade stream" icon={Activity}><Table columns={["Time", "Side", "Wallet", "SOL", "Price", "Checkpoint"]} rows={rows.map((t) => [new Date(t.timestamp).toLocaleTimeString(), <Pill tone={t.side === "buy" ? "good" : "bad"}>{t.side.toUpperCase()}</Pill>, <button className="text-link" onClick={() => go(`/app/wallet/${t.wallet}`)}>{short(t.wallet)}</button>, t.sol_amount.toFixed(2), fmtMoney(t.price_usd, 8), t.checkpoint])} /></Panel>;
}

function Participants({ rows }: { rows: ParticipantRecord[] }) {
  return <Panel title="Participant wallets" icon={Users}><Table columns={["Wallet", "Buys", "Sells", "Net SOL", "Retained", "Behaviour"]} rows={rows.map((p) => [<button className="text-link" onClick={() => go(`/app/wallet/${p.wallet}`)}>{short(p.wallet)}</button>, p.buys, p.sells, p.net_sol.toFixed(2), `${p.retained_pct}%`, p.behaviour])} /></Panel>;
}

function First100({ rows }: { rows: FirstBuyerRecord[] }) {
  return <Panel title="First 100 buyer retention" icon={Target}><Table columns={["Rank", "Wallet", "First buy", "SOL", "Status", "Retained", "Later action"]} rows={rows.map((r) => [r.rank, <button className="text-link" onClick={() => go(`/app/wallet/${r.wallet}`)}>{short(r.wallet)}</button>, new Date(r.first_buy_at).toLocaleTimeString(), r.buy_sol.toFixed(2), r.current_status.replace("_", " "), r.retained_pct === null ? "Unknown" : `${r.retained_pct}%`, r.later_action])} /></Panel>;
}

function Holders({ bundle }: { bundle: TokenBundle }) {
  return <Panel title="Holder evidence" icon={Eye}><Table columns={["Wallet", "Share", "Source", "Note"]} rows={bundle.holders.map((h) => [h.wallet.includes("Unavailable") || h.wallet.includes("Holder") ? h.wallet : short(h.wallet), h.share_pct === null ? "Unavailable" : `${h.share_pct}%`, <ConfidenceBadge value={h.confidence} />, h.note])} /></Panel>;
}

function WalletToken({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid">{bundle.participants.map((p) => <Panel key={p.wallet} title={short(p.wallet)} icon={Wallet}><Metric label="Behaviour" value={p.behaviour} /><Metric label="Action" value={`${p.buys} buys / ${p.sells} sells`} /><Metric label="Retained" value={`${p.retained_pct}%`} /><p className="muted">Wallet evidence supports risk sizing, avoid and hold decisions only when joined with token evidence.</p></Panel>)}</div>;
}

function LiveState({ bundle }: { bundle: TokenBundle }) {
  return <Panel title="Current state" icon={Activity}><div className="timeline"><div><b>Checkpoint</b><span>{bundle.token.current_checkpoint}</span></div><div><b>Lifecycle</b><span>{bundle.token.lifecycle.replace("_", " ")}</span></div><div><b>Behaviour label</b><span>{bundle.token.behaviour_label}</span></div></div></Panel>;
}

function Formation({ bundle }: { bundle: TokenBundle }) {
  const [checkpoint, setCheckpoint] = useState<Checkpoint>(bundle.token.current_checkpoint);
  const state = bundle.token.checkpoints.find((c) => c.checkpoint === checkpoint) ?? bundle.token.checkpoints[0];
  return <div className="grid"><Panel title="Checkpoint selector" icon={Target}><div className="checkpoint-row">{CHECKPOINTS.map((c) => <button key={c} className={checkpoint === c ? "active" : ""} onClick={() => setCheckpoint(c)}>{c}</button>)}</div></Panel><Panel title={`${state.checkpoint} evidence`} icon={Brain}><div className="metrics"><Metric label="Buys" value={state.buys} /><Metric label="Sells" value={state.sells} /><Metric label="Unique buyers" value={state.unique_buyers} /><Metric label="Buy pressure" value={fmtPct(state.buy_pressure)} /><Metric label="First-buyer retention" value={fmtPct(state.first_buyer_retention)} /><Metric label="Top 5 buyer share" value={fmtPct(state.top5_buyer_share)} /></div><p className="note">{state.note}</p></Panel></div>;
}

function Historical({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid">{bundle.historical.map((h) => <Panel key={h.title} title={h.title} icon={Compass}><Metric label="Similarity" value={fmtPct(h.similarity)} /><Metric label="Checkpoint" value={h.checkpoint} /><Metric label="Decision affected" value={h.decision} /><p>{h.outcome}</p><p className="note warn">{h.caution}</p></Panel>)}{!bundle.historical.length && <Empty text="No historical matches available." />}</div>;
}

function AskIfa({ embedded = false, bundle }: { embedded?: boolean; bundle?: TokenBundle }) {
  const [query, setQuery] = useState("");
  const hasAnswer = query.trim().length > 0;
  const rows = (bundle ? [bundle] : bundles).map((b) => [ `$${b.token.symbol}`, b.token.behaviour_label, b.token.current_checkpoint, fmtMoney(b.token.market_cap_usd, 0), b.token.first_buyer_summary.holding ]);
  const csv = ["symbol,label,checkpoint,market_cap,first100_holding", ...rows.map((r) => r.map((x) => String(x).replaceAll(",", " ")).join(","))].join("\n");
  const download = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aladdin_ifa_query.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const content = <section className="ifa-shell"><div className="query-box"><MessageSquare size={22} /><textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask IFÁ about Pump.fun tokens, wallets, labels, retention, or formations..." /><button className="primary" disabled={!query.trim()}>Ask IFÁ</button></div>{!hasAnswer && <Panel title="IFÁ is waiting" icon={Command}><p className="muted">Ask a question when you want an explanation or a table. Frequent questions will become FAQ shortcuts over time.</p></Panel>}{hasAnswer && <div className="grid"><Panel title="IFÁ answer" icon={Brain}><p>Query interpreted as a Pump.fun behavioural-intelligence request. The table is constrained to Aladdin token, wallet and formation evidence.</p><List items={["No execution instruction returned.", "Unknown fields stay unavailable.", "Use CSV export for research workflow."]} /></Panel><Panel title="Query result" icon={BarChart3}><Table columns={["Token", "Label", "Checkpoint", "Market cap", "First 100 holding"]} rows={rows} /><button className="csv-button" onClick={download}><Download size={16} />Download CSV</button></Panel></div>}</section>;
  return embedded ? content : <Shell active="ifa"><Header title="Ask IFÁ" subtitle="Query Aladdin evidence" icon={Command} />{content}</Shell>;
}

function Profitable() {
  return <Panel title="Profitable secondary research" icon={Target}><p className="note warn">Research drift detected if this page becomes a promise of profitable calls.</p><p>This page is intentionally secondary. It should only answer what trade decision changes because of the evidence.</p><List items={["Buy: only after evidence improves expectancy", "Sell: when retained cohort collapses", "Hold: when participation remains broad", "Avoid: when concentration dominates", "Position size: when confidence is partial"]} /></Panel>;
}

function WalletPage({ address }: { address?: string }) {
  const wallet = wallets.find((w) => w.wallet === address) ?? wallets[0];
  return <Shell active="live"><Header title="Wallet display" subtitle="Search result" icon={Wallet} /><div className="grid"><Panel title={short(wallet.wallet)} icon={Wallet}><Metric label="Label" value={wallet.label} /><Metric label="Temperament" value={wallet.temperament} /><Metric label="Observed tokens" value={wallet.observed_tokens} /><Metric label="Early entries" value={wallet.early_entries} /><Metric label="Median hold" value={`${wallet.median_hold_minutes} min`} /><ConfidenceBadge value={wallet.evidence_quality.confidence} /></Panel><Panel title="Decision relevance" icon={Target}><p>Wallet evidence is shown after search. It supports token investigation, not a separate product mode.</p></Panel></div></Shell>;
}

function TrenchChart({ bundle }: { bundle: TokenBundle }) {
  const points = bundle.token.checkpoints.map((c, i) => ({ x: 16 + i * 28, y: 82 - ((c.market_cap_usd ?? 0) / Math.max(...bundle.token.checkpoints.map((p) => p.market_cap_usd ?? 0), 1)) * 56, c }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${points.at(-1)?.x ?? 100} 92 L ${points[0].x} 92 Z`;
  return <div className="trench"><svg viewBox="0 0 112 100" preserveAspectRatio="none"><defs><linearGradient id="trenchFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8f5cff" stopOpacity="0.5" /><stop offset="100%" stopColor="#8f5cff" stopOpacity="0" /></linearGradient></defs><path className="gridline" d="M 0 25 H 112 M 0 50 H 112 M 0 75 H 112" /><path className="area" d={area} /><path className="line" d={path} />{points.map((p) => <circle key={p.c.checkpoint} cx={p.x} cy={p.y} r="2.4" />)}</svg><div className="trench-labels">{bundle.token.checkpoints.map((c) => <span key={c.checkpoint}>{c.checkpoint}</span>)}</div></div>;
}

function MiniTrench({ token }: { token: TokenRecord }) {
  const max = Math.max(...token.checkpoints.map((c) => c.market_cap_usd ?? 0), 1);
  const pts = token.checkpoints.map((c, i) => `${i * 33},${40 - ((c.market_cap_usd ?? 0) / max) * 30}`).join(" ");
  return <svg className="mini-trench" viewBox="0 0 100 44" preserveAspectRatio="none"><polyline points={pts} /><path d={`M ${pts.replaceAll(",", " ").replaceAll(" ", " L ")}`} /></svg>;
}

function Retention({ token }: { token: TokenRecord }) {
  return <div className="retention">{Object.entries(token.first_buyer_summary).map(([k, v]) => <div key={k}><span>{k.replace("_", " ")}</span><b>{v}</b><i style={{ width: `${Math.min(100, Number(v) * 2)}%` }} /></div>)}</div>;
}

function List({ items }: { items: string[] }) {
  return items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">No missing inputs reported.</p>;
}

function App() {
  const current = useRoute();
  const p = parts();
  if (current === "/") return <Landing />;
  if (current === "/login") return <Login />;
  if (p[0] !== "app") return <Landing />;
  if (p[1] === "live") return <LiveTerminal />;
  if (p[1] === "launches") return <Launches tab={p[2] || "new"} />;
  if (p[1] === "token") return <TokenPage mint={p[2]} tab={p[3] || "overview"} />;
  if (p[1] === "wallet") return <WalletPage address={p[2]} />;
  if (p[1] === "ask-ifa") return <AskIfa />;
  return <LiveTerminal />;
}

createRoot(document.getElementById("root")!).render(<App />);
