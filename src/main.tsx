import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, AlertTriangle, ArrowRight, BarChart3, Brain, Clipboard, Command, Compass, Eye, LineChart, Lock, MessageSquare, Search, ShieldAlert, Sparkles, Target, Users, Wallet } from "lucide-react";
import { CHECKPOINTS, bundles, findBundle, fmtMoney, fmtPct, questions, searchDemo, short, wallets } from "./data";
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

function DemoBadge() {
  return <span className="demo-badge"><i />Demo data - Backend not connected</span>;
}

function ConfidenceBadge({ value }: { value: Confidence }) {
  const labels: Record<Confidence, string> = { verified: "Verified", partial: "Partial", demo_only: "Demo", unavailable: "Unavailable" };
  return <span className={`confidence ${value}`}>{labels[value]}</span>;
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
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
  if (!rows.length) return <Empty text="No rows available in this demo fixture." />;
  return <div className="table-wrap"><table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={`${i}-${j}`}>{c}</td>)}</tr>)}</tbody></table></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="empty"><AlertTriangle size={18} />{text}</div>;
}

function Landing() {
  return <main className="landing"><section className="landing-card"><DemoBadge /><p className="eyebrow">Aladdin / IFAGRITHM</p><h1>Evidence-first Solana behavioural intelligence.</h1><p className="lede">A frontend-only prototype for launch evidence, token formation, wallet behaviour, and IFAGRITHM search. It is not an execution terminal and it does not make token calls.</p><div className="actions"><button className="primary" onClick={() => go("/login")}>Enter terminal</button><button className="ghost" onClick={() => go("/app/launches/new")}>View demo</button></div><div className="chips"><span>BUY_10 to BUY_100</span><span>No bot logic</span><span>Evidence before opinion</span></div></section></main>;
}

function Login() {
  const [value, setValue] = useState("");
  return <main className="login"><form className="login-card" onSubmit={(e) => { e.preventDefault(); sessionStorage.setItem("aladdin-demo-auth", value || "demo"); go("/app/launches/new"); }}><DemoBadge /><Lock size={34} /><h1>Demo terminal access</h1><p>Use any passphrase. This is frontend-only demo access.</p><input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter demo passphrase" /><button className="primary">Open Aladdin</button></form></main>;
}

function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  const nav = [
    ["launches", "Launches", Sparkles, "/app/launches/new"],
    ["tokens", "Token Intelligence", LineChart, `/app/token/${bundles[0].token.token_mint}/overview`],
    ["wallets", "Wallet Intelligence", Wallet, `/app/wallet/${wallets[0].wallet}`],
    ["terminal", "IFAGRITHM Search", Command, "/app/terminal"]
  ] as const;
  return <div className="shell"><aside><button className="brand" onClick={() => go("/app/launches/new")}><b>A</b><span><strong>Aladdin</strong><small>Behaviour terminal</small></span></button><DemoBadge /><nav>{nav.map(([id, label, Icon, path]) => <button key={id} className={active === id ? "active" : ""} onClick={() => go(path)}><Icon size={18} />{label}</button>)}</nav><div className="side-note"><ShieldAlert size={18} /><p>No execution, no predictions, no live backend claim.</p></div></aside><main className="stage">{children}</main></div>;
}

function Header({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ComponentType<{ size?: number }> }) {
  return <header className="header"><div><p className="eyebrow"><Icon size={15} />{subtitle}</p><h1>{title}</h1></div><DemoBadge /></header>;
}

function Launches({ tab }: { tab: string }) {
  const filtered = bundles.filter((b) => tab === "new" ? b.token.lifecycle === "new_launch" : tab === "premigration" ? b.token.lifecycle === "pre_migration" : tab === "migrated" ? b.token.lifecycle === "migrated" : true);
  const tabs = [["new", "New Launches"], ["premigration", "Pre-Migration"], ["migrated", "Migrated"], ["trending", "Discovery / Trending"]];
  return <Shell active="launches"><Header title="Launch intelligence" subtitle="Evidence workspace" icon={Compass} /><div className="tabs">{tabs.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => go(`/app/launches/${id}`)}>{label}</button>)}</div><div className="grid">{filtered.map((b) => <TokenCard key={b.token.token_mint} token={b.token} />)}{!filtered.length && <Empty text="No demo tokens in this workspace." />}</div></Shell>;
}

function TokenCard({ token }: { token: TokenRecord }) {
  const s = token.first_buyer_summary;
  return <article className="card"><div className="token-head"><Avatar token={token} /><div><div className="token-title"><strong>${token.symbol}</strong><span>{token.name}</span></div><button className="copy" onClick={() => navigator.clipboard?.writeText(token.token_mint)}>{short(token.token_mint)} <Clipboard size={13} /></button></div><Pill tone={token.lifecycle === "migrated" ? "good" : token.lifecycle === "pre_migration" ? "warn" : "neutral"}>{token.lifecycle.replace("_", " ")}</Pill></div><div className="metrics compact"><Metric label="Market cap" value={fmtMoney(token.market_cap_usd, 0)} /><Metric label="Volume" value={fmtMoney(token.volume_24h_usd, 0)} /><Metric label="Market Index" value={token.market_index ?? "Unavailable"} /><Metric label="Participation" value={token.participation_score ?? "Unavailable"} /></div><p className="evidence"><b>First 100:</b> {s.holding} holding / {s.partial_exit} partial / {s.full_exit} full exit / {s.accumulated} accumulated / {s.unknown} unknown</p><p className="muted">{token.behaviour_label}</p><button className="card-link" onClick={() => go(`/app/token/${token.token_mint}/overview`)}>Investigate evidence <ArrowRight size={15} /></button></article>;
}

function TokenPage({ mint, tab }: { mint?: string; tab?: string }) {
  const bundle = findBundle(mint);
  const active = tab || "overview";
  const tabs = ["overview", "trades", "participants", "first-100", "holders", "wallet-token", "live-state", "formation-evidence", "historical-match", "consultation", "profitable"];
  return <Shell active="tokens"><header className="token-hero"><Avatar token={bundle.token} large /><div><p className="eyebrow">Token Intelligence / {bundle.token.lifecycle.replace("_", " ")}</p><h1>${bundle.token.symbol} {bundle.token.name}</h1><button className="copy" onClick={() => navigator.clipboard?.writeText(bundle.token.token_mint)}>{bundle.token.token_mint} <Clipboard size={14} /></button></div><div className="hero-pills"><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /><Pill tone="warn">Backend not connected</Pill></div></header><div className="tabs scroll">{tabs.map((t) => <button key={t} className={active === t ? "active" : ""} onClick={() => go(`/app/token/${bundle.token.token_mint}/${t}`)}>{t.replace("-", " ")}</button>)}</div>{renderTokenTab(bundle, active)}</Shell>;
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
  if (tab === "consultation") return <Consultation bundle={bundle} />;
  if (tab === "profitable") return <Profitable />;
  return <Overview bundle={bundle} />;
}

function Overview({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid"><Panel title="Market evidence" icon={BarChart3}><div className="metrics"><Metric label="Price" value={fmtMoney(bundle.token.price_usd, 8)} /><Metric label="Market cap" value={fmtMoney(bundle.token.market_cap_usd, 0)} /><Metric label="FDV" value={fmtMoney(bundle.token.fdv_usd, 0)} /><Metric label="Liquidity" value={fmtMoney(bundle.token.liquidity_usd, 0)} /><Metric label="Volume 24h" value={fmtMoney(bundle.token.volume_24h_usd, 0)} /><Metric label="Market Index" value={bundle.token.market_index ?? "Unavailable"} /></div></Panel><Panel title="Checkpoint chart" icon={LineChart}><Chart bundle={bundle} /></Panel><Panel title="First-buyer retention" icon={Users}><Retention token={bundle.token} /></Panel><Panel title="Data quality" icon={AlertTriangle}><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /><p>Source: {bundle.token.evidence_quality.source}</p><List items={bundle.token.evidence_quality.missing} /></Panel></div>;
}

function Trades({ rows }: { rows: TradeRecord[] }) {
  return <Panel title="Canonical trade facts" icon={Activity}><Table columns={["Time", "Side", "Wallet", "SOL", "Price", "Checkpoint"]} rows={rows.map((t) => [new Date(t.timestamp).toLocaleTimeString(), <Pill tone={t.side === "buy" ? "good" : "bad"}>{t.side.toUpperCase()}</Pill>, <button className="text-link" onClick={() => go(`/app/wallet/${t.wallet}`)}>{short(t.wallet)}</button>, t.sol_amount.toFixed(2), fmtMoney(t.price_usd, 8), t.checkpoint])} /></Panel>;
}

function Participants({ rows }: { rows: ParticipantRecord[] }) {
  return <Panel title="Participant wallets" icon={Users}><Table columns={["Wallet", "Buys", "Sells", "Net SOL", "Retained", "Behaviour"]} rows={rows.map((p) => [<button className="text-link" onClick={() => go(`/app/wallet/${p.wallet}`)}>{short(p.wallet)}</button>, p.buys, p.sells, p.net_sol.toFixed(2), `${p.retained_pct}%`, p.behaviour])} /></Panel>;
}

function First100({ rows }: { rows: FirstBuyerRecord[] }) {
  return <Panel title="First 100 buyer retention" icon={Target}><p className="muted">First buyers are classified as holding, partial exit, full exit, accumulated, or unknown.</p><Table columns={["Rank", "Wallet", "First buy", "SOL", "Status", "Retained", "Later action"]} rows={rows.map((r) => [r.rank, <button className="text-link" onClick={() => go(`/app/wallet/${r.wallet}`)}>{short(r.wallet)}</button>, new Date(r.first_buy_at).toLocaleTimeString(), r.buy_sol.toFixed(2), r.current_status.replace("_", " "), r.retained_pct === null ? "Unknown" : `${r.retained_pct}%`, r.later_action])} /></Panel>;
}

function Holders({ bundle }: { bundle: TokenBundle }) {
  return <Panel title="Holder evidence" icon={Eye}><Table columns={["Wallet", "Share", "Source", "Note"]} rows={bundle.holders.map((h) => [h.wallet.includes("Unavailable") || h.wallet.includes("Holder") ? h.wallet : short(h.wallet), h.share_pct === null ? "Unavailable" : `${h.share_pct}%`, <ConfidenceBadge value={h.confidence} />, h.note])} /></Panel>;
}

function WalletToken({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid">{bundle.participants.map((p) => <Panel key={p.wallet} title={short(p.wallet)} icon={Wallet}><Metric label="Behaviour" value={p.behaviour} /><Metric label="Action" value={`${p.buys} buys / ${p.sells} sells`} /><Metric label="Retained" value={`${p.retained_pct}%`} /><p className="muted">Supports hold, avoid and risk sizing decisions only when combined with token evidence.</p></Panel>)}</div>;
}

function LiveState({ bundle }: { bundle: TokenBundle }) {
  return <Panel title="Simulated live state" icon={Activity}><p className="muted">This is how live state should look after backend connection. It is not a live feed.</p><div className="timeline"><div><b>Current checkpoint</b><span>{bundle.token.current_checkpoint}</span></div><div><b>Lifecycle</b><span>{bundle.token.lifecycle.replace("_", " ")}</span></div><div><b>Latest displayed evidence</b><span>{bundle.token.behaviour_label}</span></div></div></Panel>;
}

function Formation({ bundle }: { bundle: TokenBundle }) {
  const [checkpoint, setCheckpoint] = useState<Checkpoint>(bundle.token.current_checkpoint);
  const state = bundle.token.checkpoints.find((c) => c.checkpoint === checkpoint) ?? bundle.token.checkpoints[0];
  return <div className="grid"><Panel title="Checkpoint selector" icon={Target}><div className="checkpoint-row">{CHECKPOINTS.map((c) => <button key={c} className={checkpoint === c ? "active" : ""} onClick={() => setCheckpoint(c)}>{c}</button>)}</div><p className="muted">Formation is event-based, not a fixed 1/5/10-minute boundary.</p></Panel><Panel title={`${state.checkpoint} evidence`} icon={Brain}><div className="metrics"><Metric label="Buys" value={state.buys} /><Metric label="Sells" value={state.sells} /><Metric label="Unique buyers" value={state.unique_buyers} /><Metric label="Buy pressure" value={fmtPct(state.buy_pressure)} /><Metric label="First-buyer retention" value={fmtPct(state.first_buyer_retention)} /><Metric label="Top 5 buyer share" value={fmtPct(state.top5_buyer_share)} /></div><p className="note">{state.note}</p></Panel></div>;
}

function Historical({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid">{bundle.historical.map((h) => <Panel key={h.title} title={h.title} icon={Compass}><Metric label="Similarity" value={fmtPct(h.similarity)} /><Metric label="Checkpoint" value={h.checkpoint} /><Metric label="Decision affected" value={h.decision} /><p>{h.outcome}</p><p className="note warn">{h.caution}</p></Panel>)}{!bundle.historical.length && <Empty text="No historical matches in this demo fixture." />}</div>;
}

function Consultation({ bundle }: { bundle: TokenBundle }) {
  return <div className="grid">{bundle.consultation.map((c) => <Panel key={c.question} title={c.question} icon={MessageSquare}><p>{c.answer}</p><List items={c.evidence} /><Metric label="Trade decision impact" value={c.trade_change} /><ConfidenceBadge value={c.confidence} /></Panel>)}</div>;
}

function Profitable() {
  return <Panel title="Profitable secondary research" icon={Target}><p className="note warn">Research drift detected if this page becomes a promise of profitable calls.</p><p>This page is intentionally secondary. It should only answer what trade decision changes because of the evidence.</p><List items={["Buy: only after evidence improves expectancy", "Sell: when retained cohort collapses", "Hold: when participation remains broad", "Avoid: when concentration dominates", "Position size: when confidence is partial"]} /></Panel>;
}

function WalletPage({ address }: { address?: string }) {
  const wallet = wallets.find((w) => w.wallet === address) ?? wallets[0];
  return <Shell active="wallets"><Header title="Wallet Intelligence" subtitle="Behaviour profile" icon={Wallet} /><div className="grid"><Panel title={short(wallet.wallet)} icon={Wallet}><Metric label="Label" value={wallet.label} /><Metric label="Temperament" value={wallet.temperament} /><Metric label="Observed tokens" value={wallet.observed_tokens} /><Metric label="Early entries" value={wallet.early_entries} /><Metric label="Median hold" value={`${wallet.median_hold_minutes} min`} /><ConfidenceBadge value={wallet.evidence_quality.confidence} /></Panel><Panel title="Decision relevance" icon={Target}><p>Wallet evidence is supporting research. It changes risk sizing, avoid and hold decisions only when joined with token formation.</p></Panel></div></Shell>;
}

function Terminal() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchDemo(query), [query]);
  return <Shell active="terminal"><Header title="IFAGRITHM Search Terminal" subtitle="Ask evidence questions" icon={Command} /><section className="terminal"><div className="search-box"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mint, token, wallet, transaction, or question..." /></div><div className="suggestions">{questions.map((q) => <button key={q} onClick={() => setQuery(q)}>{q}</button>)}</div><div className="results">{results.map((r) => <button key={`${r.type}-${r.subtitle}`} className="result" onClick={() => go(r.route)}><span>{r.type}</span><strong>{r.title}</strong><small>{r.subtitle}</small><ConfidenceBadge value={r.confidence} /></button>)}{query && !results.length && <Empty text="No demo result found. Backend semantic search is not connected." />}</div></section></Shell>;
}

function Chart({ bundle }: { bundle: TokenBundle }) {
  const max = Math.max(...bundle.token.checkpoints.map((c) => c.market_cap_usd ?? 0), 1);
  return <div className="chart">{bundle.token.checkpoints.map((c) => <div className="bar" key={c.checkpoint}><span>{fmtMoney(c.market_cap_usd, 0)}</span><i style={{ height: `${Math.max(7, ((c.market_cap_usd ?? 0) / max) * 100)}%` }} /><small>{c.checkpoint}</small></div>)}</div>;
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
  if (p[1] === "launches") return <Launches tab={p[2] || "new"} />;
  if (p[1] === "token") return <TokenPage mint={p[2]} tab={p[3] || "overview"} />;
  if (p[1] === "wallet") return <WalletPage address={p[2]} />;
  if (p[1] === "terminal") return <Terminal />;
  return <Launches tab="new" />;
}

createRoot(document.getElementById("root")!).render(<App />);
