import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, AlertTriangle, ArrowRight, BarChart3, Brain, Clipboard, Download, Eye, LineChart, Lock, Search, ArrowUp, Target, Users, Wallet, Zap } from "lucide-react";
import { bundles, findBundle, fmtMoney, fmtPct, fmtPctWhole, searchDemo, short, walletInfo, wallets } from "./data";
import type { Confidence, FirstBuyerRecord, ParticipantRecord, TokenBundle, TokenRecord, TradeRecord } from "./types";
import aladdinLogo from "./assets/aladdin-logo.png";
import "./styles.css";

const IFA_SUGGESTIONS = [
  "Which live tokens have Fresh Wallets entering now?",
  "Show tokens where Migration Specialists are buying before migration.",
  "Are Scalpers exiting this token?",
  "Show the most profitable wallets on this token.",
  "Export first 100 wallets as CSV."
];

const route = () => window.location.pathname.replace(/\/$/, "") || "/";
const parts = () => route().split("/").filter(Boolean);
const go = (path: string) => { window.history.pushState({}, "", path); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo({ top: 0, behavior: "smooth" }); };
const solscanWallet = (wallet: string) => `https://solscan.io/account/${wallet}`;
const solscanTx = (signature: string) => `https://solscan.io/tx/${signature}`;

function useRoute() {
  const [path, setPath] = useState(route());
  React.useEffect(() => {
    const update = () => setPath(route());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return path;
}

function behaviourClass(value: string) {
  const key = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
  return `behaviour behaviour-${key}`;
}
function BehaviourBadge({ value }: { value: string }) { return <span className={behaviourClass(value)}>{value}</span>; }
function ConfidenceBadge({ value }: { value: Confidence }) { const labels: Record<Confidence, string> = { verified: "Verified", partial: "Partial", demo_only: "Evidence", unavailable: "Unavailable" }; return <span className={`confidence ${value}`}>{labels[value]}</span>; }
function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "purple" }) { return <span className={`pill ${tone}`}>{children}</span>; }
function Avatar({ token, large = false }: { token: TokenRecord; large?: boolean }) { return <div className={`avatar ${large ? "large" : ""}`}>{token.symbol.slice(0, 2)}</div>; }
function Metric({ label, value }: { label: string; value: React.ReactNode }) { return <div className="metric"><span>{label}</span><strong>{value}</strong></div>; }
function Panel({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number }>; children: React.ReactNode }) { return <section className="panel"><h2><Icon size={18} />{title}</h2>{children}</section>; }
function Table({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) { if (!rows.length) return <Empty text="No rows available." />; return <div className="table-wrap"><table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={`${i}-${j}`}>{c}</td>)}</tr>)}</tbody></table></div>; }
function Empty({ text }: { text: string }) { return <div className="empty"><AlertTriangle size={18} />{text}</div>; }

function Landing() {
  return <main className="landing"><section className="landing-card"><p className="eyebrow">Aladdin terminal</p><h1>Live Pump.fun intelligence with wallet behaviour.</h1><p className="lede">Aladdin watches tokens, trades, wallet behaviour, PnL, holdings and formations. Ask IFÁ waits until you ask a question.</p><div className="actions"><button className="primary" onClick={() => go("/login")}>Enter terminal</button><button className="ghost" onClick={() => go("/app/live")}>Open live view</button></div><div className="chips"><span>Live terminal</span><span>Wallet / CA search</span><span>Ask IFÁ on demand</span></div></section></main>;
}
function Login() { const [value, setValue] = useState(""); return <main className="login"><form className="login-card" onSubmit={(e) => { e.preventDefault(); sessionStorage.setItem("aladdin-demo-auth", value || "ok"); go("/app/live"); }}><Lock size={34} /><h1>Aladdin access</h1><p>Open the terminal workspace.</p><input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter access phrase" /><button className="primary">Open Aladdin</button></form></main>; }

function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const runSearch = () => {
    const result = searchDemo(query)[0];
    if (result) go(result.route);
  };
  const nav = [["live", "Live Terminal", "/app/live"], ["ifa", "Ask IFÁ", "/app/ask-ifa"]] as const;
  return <div className="shell no-sidebar"><header className="topbar"><button className="brand horizontal" onClick={() => go("/app/live")}><img className="brand-logo" src={aladdinLogo} alt="Aladdin" /><span><strong>Aladdin</strong><small>Live terminal</small></span></button><div className="search-space"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }} placeholder="Search CA / wallet / token / txn" /><button onClick={runSearch}>Search</button></div><nav className="top-nav">{nav.map(([id, label, path]) => <button key={id} className={active === id ? "active" : ""} onClick={() => go(path)}>{label}</button>)}</nav></header><main className="stage">{children}</main></div>;
}
function Header({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ComponentType<{ size?: number }> }) { return <header className="header"><div><p className="eyebrow"><Icon size={15} />{subtitle}</p><h1>{title}</h1></div></header>; }

function LiveTerminal() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchDemo(query), [query]);
  return <Shell active="live"><Header title="Live Terminal" subtitle="Token, then trade" icon={Zap} /><section className="top-search"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search CA, token, wallet, or transaction..." /></section>{query && <SearchResults results={results} />}<div className="live-stack">{bundles.map((bundle) => <TokenTradeBlock key={bundle.token.token_mint} bundle={bundle} />)}</div></Shell>;
}
function SearchResults({ results }: { results: ReturnType<typeof searchDemo> }) { return <div className="results live-results">{results.map((r) => <button key={`${r.type}-${r.subtitle}`} className="result" onClick={() => go(r.route)}><span>{r.type}</span><strong>{r.title}</strong><small>{r.subtitle}</small><ConfidenceBadge value={r.confidence} /></button>)}{!results.length && <Empty text="No matching token, wallet or transaction found." />}</div>; }
function TokenTradeBlock({ bundle }: { bundle: TokenBundle }) { return <section className="terminal-token"><TokenCard token={bundle.token} /><Trades rows={bundle.trades} compact /></section>; }
function TokenCard({ token }: { token: TokenRecord }) { const s = token.first_buyer_summary; return <article className="card"><div className="token-head"><Avatar token={token} /><div><div className="token-title"><strong>${token.symbol}</strong><span>{token.name}</span></div><button className="copy" onClick={() => navigator.clipboard?.writeText(token.token_mint)}>{short(token.token_mint)} <Clipboard size={13} /></button></div><Pill tone={token.lifecycle === "migrated" ? "good" : token.lifecycle === "pre_migration" ? "warn" : "purple"}>{token.lifecycle.replace("_", " ")}</Pill></div><div className="metrics compact"><Metric label="Market cap" value={fmtMoney(token.market_cap_usd, 0)} /><Metric label="Volume" value={fmtMoney(token.volume_24h_usd, 0)} /><Metric label="Liquidity" value={fmtMoney(token.liquidity_usd, 0)} /><Metric label="Behaviour" value={token.behaviour_label} /></div><MiniTrench token={token} /><p className="evidence"><b>First 100:</b> {s.holding} holding / {s.partial_exit} partial / {s.full_exit} full exit / {s.accumulated} accumulated</p><button className="card-link" onClick={() => go(`/app/token/${token.token_mint}/trades`)}>Open token <ArrowRight size={15} /></button></article>; }

function TokenPage({ mint, tab }: { mint?: string; tab?: string }) {
  const bundle = findBundle(mint);
  const active = tab || "trades";
  const tabs = ["trades", "participants", "most-profitable", "largest-holders", "first-100", "holders", "overview"];
  return <Shell active="live"><header className="token-hero"><Avatar token={bundle.token} large /><div><p className="eyebrow">Live terminal / token behaviour</p><h1>${bundle.token.symbol} {bundle.token.name}</h1><button className="copy" onClick={() => navigator.clipboard?.writeText(bundle.token.token_mint)}>{bundle.token.token_mint} <Clipboard size={14} /></button></div><div className="hero-pills"><Pill tone="purple">{bundle.token.behaviour_label}</Pill><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /></div></header><ChartMarket bundle={bundle} /><div className="tabs scroll layer-tabs">{tabs.map((t) => <button key={t} className={active === t ? "active" : ""} onClick={() => go(`/app/token/${bundle.token.token_mint}/${t}`)}>{t.replace("-", " ")}</button>)}</div>{renderTokenTab(bundle, active)}</Shell>;
}
function renderTokenTab(bundle: TokenBundle, tab: string) { if (tab === "participants") return <Participants rows={bundle.participants} />; if (tab === "most-profitable") return <MostProfitable bundle={bundle} />; if (tab === "largest-holders") return <LargestHolders bundle={bundle} />; if (tab === "first-100") return <First100 bundle={bundle} />; if (tab === "holders") return <Holders bundle={bundle} />; if (tab === "overview") return <Overview bundle={bundle} />; return <Trades rows={bundle.trades} />; }

function Trades({ rows, compact = false }: { rows: TradeRecord[]; compact?: boolean }) { return <Panel title={compact ? "Trades" : "Trade layout"} icon={Activity}><Table columns={["Time", "Behaviour", "Win Rate (No. Trades)", "Side", "Amount (SOL / USD)", "Holding %", "Txn Hash"]} rows={rows.map((t) => { const w = walletInfo(t.wallet); return [new Date(t.timestamp).toLocaleTimeString(), <BehaviourBadge value={w.behaviour} />, `${fmtPct(w.winRate)} (${w.trades})`, <Pill tone={t.side === "buy" ? "good" : "bad"}>{t.side.toUpperCase()}</Pill>, `${t.sol_amount.toFixed(2)} SOL / ${fmtMoney((t.price_usd ?? 0) * t.token_amount, 2)}`, fmtPctWhole(w.holdingPct), <button className="text-link" onClick={() => navigator.clipboard?.writeText(t.signature)}>{short(t.signature, 8, 5)}</button>]; })} /></Panel>; }
function Participants({ rows }: { rows: ParticipantRecord[] }) {
  const grouped = Object.values(rows.reduce((acc, p) => {
    const w = walletInfo(p.wallet);
    const key = w.behaviour;
    if (!acc[key]) acc[key] = { behaviour: key, participants: 0, buys: 0, pnlUsd: 0, holdings: 0, holdingsCount: 0 };
    acc[key].participants += 1;
    acc[key].buys += p.buys;
    acc[key].pnlUsd += w.pnlUsd ?? 0;
    if (w.holdingPct != null) { acc[key].holdings += w.holdingPct; acc[key].holdingsCount += 1; }
    return acc;
  }, {} as Record<string, { behaviour: string; participants: number; buys: number; pnlUsd: number; holdings: number; holdingsCount: number }>));
  return <Panel title="Participants by behaviour" icon={Users}><Table columns={["Behaviour", "Participants", "Buys", "Net Profit", "Holdings"]} rows={grouped.map((g) => [<BehaviourBadge value={g.behaviour} />, g.participants, g.buys, fmtMoney(g.pnlUsd, 0), g.holdingsCount ? fmtPctWhole(g.holdings / g.holdingsCount) : "Unavailable"])} /></Panel>;
}
function MostProfitable({ bundle }: { bundle: TokenBundle }) { const rows = bundle.participants.map((p) => ({ p, w: walletInfo(p.wallet), tx: bundle.trades.find((t) => t.wallet === p.wallet && t.side === "buy") ?? bundle.trades.find((t) => t.wallet === p.wallet) })).sort((a, b) => (b.w.pnlUsd ?? -Infinity) - (a.w.pnlUsd ?? -Infinity)); return <Panel title="Most profitable" icon={Target}><Table columns={["Behaviour", "Realised PnL", "ROI %", "Entry MC", "Sold % / Remaining", "Wallet"]} rows={rows.map(({ p, w, tx }) => [<BehaviourBadge value={w.behaviour} />, fmtMoney(w.pnlUsd, 0), fmtPctWhole(w.roiPct), fmtMoney(w.entryMc, 0), `${fmtPctWhole(w.soldPct)} / ${fmtPctWhole(w.remainingPct)}`, <a className="text-link" href={tx ? solscanTx(tx.signature) : solscanWallet(p.wallet)} target="_blank" rel="noreferrer">{short(p.wallet)}</a>])} /></Panel>; }
function LargestHolders({ bundle }: { bundle: TokenBundle }) { const rows = bundle.holders.map((h) => ({ h, w: walletInfo(h.wallet) })).sort((a, b) => (b.w.supplyPct ?? b.h.share_pct ?? -1) - (a.w.supplyPct ?? a.h.share_pct ?? -1)); return <Panel title="Largest holder" icon={Eye}><Table columns={["Wallet", "Behaviour", "Supply", "USD value", "Age", "Sold / Rem"]} rows={rows.map(({ h, w }) => [<a className="text-link" href={solscanWallet(h.wallet)} target="_blank" rel="noreferrer">{short(h.wallet)}</a>, <BehaviourBadge value={w.behaviour} />, fmtPctWhole(w.supplyPct ?? h.share_pct), fmtMoney(w.usdValue, 0), w.age, `${fmtPctWhole(w.soldPct)} / ${fmtPctWhole(w.remainingPct)}`])} /></Panel>; }
function First100({ bundle }: { bundle: TokenBundle }) { const [unit, setUnit] = useState<"usd" | "sol">("usd"); const amount = (usd: number | null) => usd == null ? "Unavailable" : unit === "usd" ? fmtMoney(usd, 0) : `${(usd / 150).toFixed(2)} SOL`; const toggle = () => setUnit(unit === "usd" ? "sol" : "usd"); return <Panel title={`First 100 - ${unit.toUpperCase()}`} icon={Target}><Table columns={["Wallet", "Behaviour", "Supply", "USD / SOL", "Sold / Rem"]} rows={bundle.first100.map((r: FirstBuyerRecord) => { const w = walletInfo(r.wallet); return [<a className="text-link" href={solscanWallet(r.wallet)} target="_blank" rel="noreferrer">{short(r.wallet)}</a>, <BehaviourBadge value={w.behaviour} />, fmtPctWhole(w.supplyPct), <button className="text-link" onClick={toggle}>{amount(w.usdValue)}</button>, `${fmtPctWhole(w.soldPct)} / ${fmtPctWhole(w.remainingPct)}`]; })} /></Panel>; }
function Holders({ bundle }: { bundle: TokenBundle }) { return <Panel title="Holders" icon={Eye}><Table columns={["Wallet", "Behaviour", "Supply", "USD value", "Age", "Sold / Rem."]} rows={bundle.holders.map((h) => { const w = walletInfo(h.wallet); return [<a className="text-link" href={solscanWallet(h.wallet)} target="_blank" rel="noreferrer">{short(h.wallet)}</a>, <BehaviourBadge value={w.behaviour} />, fmtPctWhole(w.supplyPct ?? h.share_pct), fmtMoney(w.usdValue, 0), w.age, `${fmtPctWhole(w.soldPct)} / ${fmtPctWhole(w.remainingPct)}`]; })} /></Panel>; }
function ChartMarket({ bundle }: { bundle: TokenBundle }) { return <div className="grid"><Panel title="Trench chart" icon={LineChart}><TrenchChart bundle={bundle} /></Panel><Panel title="Market" icon={BarChart3}><div className="metrics"><Metric label="Price" value={fmtMoney(bundle.token.price_usd, 8)} /><Metric label="Market cap" value={fmtMoney(bundle.token.market_cap_usd, 0)} /><Metric label="FDV" value={fmtMoney(bundle.token.fdv_usd, 0)} /><Metric label="Liquidity" value={fmtMoney(bundle.token.liquidity_usd, 0)} /><Metric label="Volume 24h" value={fmtMoney(bundle.token.volume_24h_usd, 0)} /></div></Panel></div>; }
function Overview({ bundle }: { bundle: TokenBundle }) { return <div className="grid"><Panel title="Overview" icon={BarChart3}><div className="metrics"><Metric label="Token" value={`$${bundle.token.symbol}`} /><Metric label="Lifecycle" value={bundle.token.lifecycle.replace("_", " ")} /><Metric label="Behaviour" value={bundle.token.behaviour_label} /><Metric label="Participants" value={bundle.token.participation_score ?? "Unavailable"} /></div></Panel><Panel title="Data quality" icon={AlertTriangle}><ConfidenceBadge value={bundle.token.evidence_quality.confidence} /><p>Source: {bundle.token.evidence_quality.source}</p><List items={bundle.token.evidence_quality.missing} /></Panel></div>; }

function AskIfa({ embedded = false, bundle }: { embedded?: boolean; bundle?: TokenBundle }) {
  const [query, setQuery] = useState("");
  const hasAnswer = query.trim().length > 0;
  const rows = (bundle ? [bundle] : bundles).map((b) => [`$${b.token.symbol}`, b.token.behaviour_label, b.token.current_checkpoint, fmtMoney(b.token.market_cap_usd, 0), b.token.first_buyer_summary.holding]);
  const csv = ["symbol,behaviour,checkpoint,market_cap,first100_holding", ...rows.map((r) => r.map((x) => String(x).replaceAll(",", " ")).join(","))].join("\n");
  const download = () => { const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aladdin_ifa_query.csv"; a.click(); URL.revokeObjectURL(url); };
  const content = <section className="ifa-chat"><div className="chat-hero"><h1>Ask IFÁ</h1><p>Query Aladdin evidence across tokens, wallets, behaviours, holders, and formations.</p></div><div className="assistant-row"><div className="assistant-dot"><img src={aladdinLogo} alt="Aladdin" /></div><div className="assistant-message"><strong>Ask about a token, wallet, behaviour pattern, holder group, PnL, or exportable table.</strong><small>Just now</small></div></div>{!hasAnswer && <div className="question-list">{IFA_SUGGESTIONS.map((q) => <button key={q} onClick={() => setQuery(q)}>{q}<span>Open</span></button>)}</div>}<div className="behaviour-strip"><span>Behaviour types:</span><BehaviourBadge value="Fresh Wallet" /><BehaviourBadge value="Creator" /><BehaviourBadge value="Migration Specialist" /><BehaviourBadge value="Scalper" /><BehaviourBadge value="Sniper" /></div>{hasAnswer && <div className="grid"><Panel title="IFA answer" icon={Brain}><p>Query interpreted as a Pump.fun behavioural-intelligence request. BUY checkpoints stay here, not in the terminal tables.</p><List items={["No execution instruction returned.", "Unknown fields stay unavailable.", "Use CSV export for research workflow."]} /></Panel><Panel title="Query result" icon={BarChart3}><Table columns={["Token", "Behaviour", "Checkpoint", "Market cap", "First 100 holding"]} rows={rows} /><button className="csv-button" onClick={download}><Download size={16} />Download CSV</button></Panel></div>}<div className="chat-input"><textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask IFÁ about tokens, wallets, behaviours, PnL, holders, or formations..." /><button className="primary" disabled={!query.trim()}><ArrowUp size={20} strokeWidth={3} /></button></div></section>;
  return embedded ? content : <Shell active="ifa">{content}</Shell>;
}
function WalletPage({ address }: { address?: string }) { const wallet = wallets.find((w) => w.wallet === address) ?? wallets[0]; const info = walletInfo(wallet.wallet); return <Shell active="live"><Header title="Wallet display" subtitle="Search result" icon={Wallet} /><div className="grid"><Panel title={short(wallet.wallet)} icon={Wallet}><Metric label="Behaviour" value={<BehaviourBadge value={info.behaviour} />} /><Metric label="Win rate" value={fmtPct(info.winRate)} /><Metric label="No. trades" value={info.trades} /><Metric label="Net profit" value={fmtMoney(info.pnlUsd, 0)} /><Metric label="Holdings" value={fmtPctWhole(info.holdingPct)} /></Panel><Panel title="Decision relevance" icon={Target}><p>Wallet display opens from search or table rows. It supports token investigation; it is not a separate main navigation mode.</p></Panel></div></Shell>; }

function TrenchChart({ bundle }: { bundle: TokenBundle }) { const points = bundle.token.checkpoints.map((c, i) => ({ x: 16 + i * 28, y: 82 - ((c.market_cap_usd ?? 0) / Math.max(...bundle.token.checkpoints.map((p) => p.market_cap_usd ?? 0), 1)) * 56, c })); const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "); const area = `${path} L ${points.at(-1)?.x ?? 100} 92 L ${points[0].x} 92 Z`; return <div className="trench"><svg viewBox="0 0 112 100" preserveAspectRatio="none"><defs><linearGradient id="trenchFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8f5cff" stopOpacity="0.5" /><stop offset="100%" stopColor="#8f5cff" stopOpacity="0" /></linearGradient></defs><path className="gridline" d="M 0 25 H 112 M 0 50 H 112 M 0 75 H 112" /><path className="area" d={area} /><path className="line" d={path} />{points.map((p) => <circle key={p.c.checkpoint} cx={p.x} cy={p.y} r="2.4" />)}</svg><div className="trench-labels">{bundle.token.checkpoints.map((c) => <span key={c.checkpoint}>{c.checkpoint}</span>)}</div></div>; }
function MiniTrench({ token }: { token: TokenRecord }) { const max = Math.max(...token.checkpoints.map((c) => c.market_cap_usd ?? 0), 1); const pts = token.checkpoints.map((c, i) => `${i * 33},${40 - ((c.market_cap_usd ?? 0) / max) * 30}`).join(" "); return <svg className="mini-trench" viewBox="0 0 100 44" preserveAspectRatio="none"><polyline points={pts} /></svg>; }
function List({ items }: { items: string[] }) { return items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">No missing inputs reported.</p>; }
function App() { const current = useRoute(); const p = parts(); if (current === "/") return <Landing />; if (current === "/login") return <Login />; if (p[0] !== "app") return <Landing />; if (p[1] === "live") return <LiveTerminal />; if (p[1] === "token") return <TokenPage mint={p[2]} tab={p[3] || "trades"} />; if (p[1] === "wallet") return <WalletPage address={p[2]} />; if (p[1] === "ask-ifa") return <AskIfa />; return <LiveTerminal />; }

createRoot(document.getElementById("root")!).render(<App />);