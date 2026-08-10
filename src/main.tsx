import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, AlertTriangle, ArrowRight, BarChart3, Brain, Clipboard, Download, Eye, LineChart, Lock, Search, ArrowUp, Target, Users, Wallet, Zap } from "lucide-react";
import { bundles, findBundle, fmtMoney, fmtPct, fmtPctWhole, searchDemo, short, walletInfo, wallets } from "./data";
import type { Confidence, FirstBuyerRecord, ParticipantRecord, TokenBundle, TokenRecord, TradeRecord } from "./types";
import aladdinLogo from "./assets/aladdin-logo.png";
import "./styles.css";

const IFA_SUGGESTIONS = [
  "Show me the first 100 buyers still holding.",
  "Which wallets bought before migration?",
  "Find historical formations similar to this token.",
  "Compare buyer activity before and after migration."
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

type IfaMetric = {
  label: string;
  value: string;
  detail?: string;
};

type IfaEvidenceBlock =
  | { kind: "metrics"; title: string; metadata?: string; items: IfaMetric[] }
  | { kind: "table"; title: string; subtitle: string; columns: string[]; rows: React.ReactNode[][]; actions?: string[] }
  | { kind: "chart"; title: string; subtitle: string; points: { label: string; value: number; detail: string }[]; actions?: string[] }
  | { kind: "timeline"; title: string; events: { time: string; label: string; detail: string }[] };

type IfaMessage = {
  role: "user" | "ifa";
  text: string;
  timestamp?: string;
  provenance?: string[];
  blocks?: IfaEvidenceBlock[];
};

const WALLET_RESULTS_ROWS: React.ReactNode[][] = [
  [<a className="text-link" href={solscanWallet("8xA92pMf7YQdrm14LdzQdK9nLXbz72pK3vMGRqfE9az") } target="_blank" rel="noreferrer">8xA...9az</a>, "#12", "4.2 SOL", "72%", "28%"],
  [<a className="text-link" href={solscanWallet("3Df6Qe2SAqvBz5qTWVng4FCJTFm6cZ1rq9KoU6sH2Rkt") } target="_blank" rel="noreferrer">3Df...Rkt</a>, "#19", "7.8 SOL", "41%", "59%"],
  [<a className="text-link" href={solscanWallet("Cw17Gk4QCLhGGVFgjhj7GNsuWAxtc6oE67bEJqm89wnP") } target="_blank" rel="noreferrer">Cw1...wnP</a>, "#24", "2.9 SOL", "0%", "100%"],
  [<a className="text-link" href={solscanWallet("Hf4CpM7DqkAd7WoY5ntPnK24dXBCiTbe27xtBz1KuBfA") } target="_blank" rel="noreferrer">Hf4...BfA</a>, "#31", "5.1 SOL", "88%", "12%"]
];

const REFINED_WALLET_ROWS: React.ReactNode[][] = [
  [<a className="text-link" href={solscanWallet("3Df6Qe2SAqvBz5qTWVng4FCJTFm6cZ1rq9KoU6sH2Rkt") } target="_blank" rel="noreferrer">3Df...Rkt</a>, "#19", "7.8 SOL", "41%", "59%"],
  [<a className="text-link" href={solscanWallet("Cw17Gk4QCLhGGVFgjhj7GNsuWAxtc6oE67bEJqm89wnP") } target="_blank" rel="noreferrer">Cw1...wnP</a>, "#24", "2.9 SOL", "0%", "100%"],
  [<a className="text-link" href={solscanWallet("9pVNQ1kmgA68Mq3HQhN6eknW2iJGTd9M9LLoV6zF1SxP") } target="_blank" rel="noreferrer">9pV...SxP</a>, "#38", "6.4 SOL", "54%", "46%"]
];

const DEMO_IFA_MESSAGES: IfaMessage[] = [
  {
    role: "user",
    text: "Which wallets bought this token before migration and were still holding 10 minutes after migration?",
    timestamp: "Investigation start"
  },
  {
    role: "ifa",
    text: "I found 47 wallets meeting those conditions. The cohort is mixed: most exited, but a small group retained meaningful supply after migration.",
    timestamp: "Demo evidence",
    provenance: ["Observation period: pre-migration to 10 minutes after migration", "Coverage: 47 matching wallets", "Freshness: mock state for frontend demonstration"],
    blocks: [
      {
        kind: "metrics",
        title: "Cohort summary",
        metadata: "Mock values; backend will supply verified counts later.",
        items: [
          { label: "Fully exited", value: "31", detail: "Sold 95%+ of acquired supply" },
          { label: "Partial position", value: "11", detail: "Still hold less than 50%" },
          { label: "Retained 50%+", value: "5", detail: "Higher-conviction holders" }
        ]
      },
      {
        kind: "table",
        title: "Wallet results",
        subtitle: "47 wallets",
        columns: ["Wallet", "Entry", "Bought", "Sold", "Remaining"],
        rows: WALLET_RESULTS_ROWS,
        actions: ["Chart", "Full Table", "Open in Terminal", "Export"]
      },
      {
        kind: "chart",
        title: "Retention distribution",
        subtitle: "Mock split of retained supply after migration",
        points: [
          { label: "Exited", value: 66, detail: "31 wallets" },
          { label: "Partial", value: 24, detail: "11 wallets" },
          { label: "50%+", value: 10, detail: "5 wallets" }
        ],
        actions: ["Open in Terminal", "Export"]
      }
    ]
  },
  {
    role: "user",
    text: "Now only show wallets that have done this on 5+ tokens.",
    timestamp: "Follow-up"
  },
  {
    role: "ifa",
    text: "That reduces the cohort from 47 to 8 wallets. These look more like repeated behaviour patterns than one-off participation.",
    timestamp: "Refined cohort",
    provenance: ["Context preserved from the previous question", "Filter added: matching pattern on 5+ tokens", "Result count: 8 wallets"],
    blocks: [
      {
        kind: "metrics",
        title: "Refined cohort",
        metadata: "Same investigation, narrower wallet history filter.",
        items: [
          { label: "Remaining wallets", value: "8", detail: "Previously 47" },
          { label: "Median repeats", value: "7", detail: "Tokens with same behaviour" },
          { label: "High retention", value: "3", detail: "Held 50%+ after migration" }
        ]
      },
      {
        kind: "table",
        title: "Repeated wallet pattern",
        subtitle: "8 wallets",
        columns: ["Wallet", "Entry", "Bought", "Sold", "Remaining"],
        rows: REFINED_WALLET_ROWS,
        actions: ["Full Table", "Open in Terminal", "Export"]
      }
    ]
  }
];

function downloadIfaCsv() {
  const csv = [
    "wallet,entry,bought,sold,remaining",
    "8xA...9az,#12,4.2 SOL,72%,28%",
    "3Df...Rkt,#19,7.8 SOL,41%,59%",
    "Cw1...wnP,#24,2.9 SOL,0%,100%"
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ask_ifa_wallet_results_demo.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function createMockIfaResponse(question: string): IfaMessage {
  const lower = question.toLowerCase();
  const tokenIntent = /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(question) || lower.includes("token") || lower.includes("contract");
  const walletIntent = lower.includes("wallet") || lower.includes("holder") || lower.includes("first 100");
  const historicalIntent = lower.includes("historical") || lower.includes("formation") || lower.includes("compare");

  if (historicalIntent) {
    return {
      role: "ifa",
      text: "I can structure this as a historical formation search. This mock answer shows where matched cohorts, observation windows and descriptive outcomes will render once the backend supplies evidence.",
      timestamp: "Mock response",
      provenance: ["Historical sample: demo only", "No prediction returned", "Use Terminal for manual inspection"],
      blocks: [
        { kind: "metrics", title: "Historical comparison", metadata: "Demo values only.", items: [
          { label: "Similar formations", value: "126", detail: "Matched by behaviour mix" },
          { label: "Exceeded 5x", value: "17%", detail: "Descriptive outcome, not a forecast" },
          { label: "Failed below entry", value: "42%", detail: "Risk context" }
        ]},
        { kind: "timeline", title: "Formation timeline", events: [
          { time: "T+0", label: "Launch detected", detail: "Token entered observation set" },
          { time: "T+4m", label: "Fresh Wallet surge", detail: "Behaviour concentration increased" },
          { time: "T+18m", label: "Migration Specialist entries", detail: "Repeated-wallet cohort appeared" }
        ]}
      ]
    };
  }

  if (walletIntent) {
    return {
      role: "ifa",
      text: "I found a wallet cohort that can be reviewed as evidence. This prototype keeps the answer descriptive and leaves the trading decision to the user.",
      timestamp: "Mock response",
      provenance: ["Wallet evidence: demo only", "Coverage: 47 wallets", "Export available for manual research"],
      blocks: [
        { kind: "metrics", title: "Wallet cohort", metadata: "Mock values only.", items: [
          { label: "Wallets", value: "47", detail: "Matched current filter" },
          { label: "Repeated pattern", value: "8", detail: "Seen on 5+ tokens" },
          { label: "Retained 50%+", value: "5", detail: "After migration" }
        ]},
        { kind: "table", title: "Wallet results", subtitle: "47 wallets", columns: ["Wallet", "Entry", "Bought", "Sold", "Remaining"], rows: WALLET_RESULTS_ROWS, actions: ["Full Table", "Open in Terminal", "Export"] }
      ]
    };
  }

  return {
    role: "ifa",
    text: tokenIntent ? "I treated this as a token intelligence query. The response can combine token facts, wallet cohorts, charts and terminal actions when live evidence is available." : "I can turn this into an Aladdin evidence query. This mock response demonstrates the response structure that the backend will later populate.",
    timestamp: "Mock response",
    provenance: ["Demo response", "Backend integration pending", "No buy/sell recommendation generated"],
    blocks: [
      { kind: "metrics", title: "Token evidence shell", metadata: "Placeholder architecture for future verified data.", items: [
        { label: "Matched wallets", value: "47", detail: "Demo cohort" },
        { label: "Known behaviours", value: "5", detail: "Fresh, Creator, Migration, Scalper, Sniper" },
        { label: "Terminal handoff", value: "Ready", detail: "Open deeper view" }
      ]},
      { kind: "chart", title: "Evidence trend", subtitle: "Mock chart response block", points: [
        { label: "Launch", value: 26, detail: "Baseline" },
        { label: "Pre-mig", value: 58, detail: "Buyer activity" },
        { label: "Migration", value: 74, detail: "Wallet retention" },
        { label: "+10m", value: 46, detail: "Post-migration" }
      ], actions: ["Open in Terminal", "Export"] }
    ]
  };
}

function PromptSuggestions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return <div className="ifa-suggestions">{IFA_SUGGESTIONS.map((prompt) => <button key={prompt} type="button" onClick={() => onSelect(prompt)}>{prompt}</button>)}</div>;
}

function IfaEmptyState({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return <section className="ifa-empty"><img src={aladdinLogo} alt="Aladdin" /><p className="eyebrow">Conversational evidence</p><h2>Ask Aladdin about on-chain activity</h2><p>Investigate tokens, wallets, participants and historical patterns using natural language.</p><PromptSuggestions onSelect={onPrompt} /></section>;
}

function IfaMetricSummary({ block }: { block: Extract<IfaEvidenceBlock, { kind: "metrics" }> }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong>{block.metadata && <span>{block.metadata}</span>}</div><div className="ifa-metric-grid">{block.items.map((item) => <div className="ifa-metric" key={item.label}><b>{item.value}</b><span>{item.label}</span>{item.detail && <small>{item.detail}</small>}</div>)}</div></div>;
}

function IfaEvidenceActions({ actions = [], terminalPath }: { actions?: string[]; terminalPath: string }) {
  if (!actions.length) return null;
  return <div className="ifa-evidence-actions">{actions.map((action) => <button key={action} type="button" onClick={() => action === "Open in Terminal" ? go(terminalPath) : action === "Export" ? downloadIfaCsv() : undefined}>{action === "Export" && <Download size={14} />}{action}</button>)}</div>;
}

function IfaEvidenceTable({ block, terminalPath }: { block: Extract<IfaEvidenceBlock, { kind: "table" }>; terminalPath: string }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong><span>{block.subtitle}</span></div><Table columns={block.columns} rows={block.rows} /><IfaEvidenceActions actions={block.actions} terminalPath={terminalPath} /></div>;
}

function IfaChartBlock({ block, terminalPath }: { block: Extract<IfaEvidenceBlock, { kind: "chart" }>; terminalPath: string }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong><span>{block.subtitle}</span></div><div className="ifa-chart-bars">{block.points.map((point) => <div className="ifa-chart-item" key={point.label}><div><i style={{ height: `${Math.max(10, point.value)}%` }} /></div><b>{point.label}</b><span>{point.detail}</span></div>)}</div><IfaEvidenceActions actions={block.actions} terminalPath={terminalPath} /></div>;
}

function IfaTimelineBlock({ block }: { block: Extract<IfaEvidenceBlock, { kind: "timeline" }> }) {
  return <div className="ifa-evidence-block"><div className="ifa-block-head"><strong>{block.title}</strong><span>Context timeline</span></div><div className="ifa-timeline">{block.events.map((event) => <div key={`${event.time}-${event.label}`}><time>{event.time}</time><b>{event.label}</b><span>{event.detail}</span></div>)}</div></div>;
}

function IfaEvidence({ block, terminalPath }: { block: IfaEvidenceBlock; terminalPath: string }) {
  if (block.kind === "metrics") return <IfaMetricSummary block={block} />;
  if (block.kind === "table") return <IfaEvidenceTable block={block} terminalPath={terminalPath} />;
  if (block.kind === "chart") return <IfaChartBlock block={block} terminalPath={terminalPath} />;
  return <IfaTimelineBlock block={block} />;
}

function ConversationMessage({ message, terminalPath }: { message: IfaMessage; terminalPath: string }) {
  return <article className={`ifa-message ${message.role}`}><div className="ifa-message-label"><span>{message.role === "user" ? "USER" : "IFÁ"}</span>{message.timestamp && <small>{message.timestamp}</small>}</div><div className="ifa-message-body"><p>{message.text}</p>{message.provenance && <div className="ifa-provenance">{message.provenance.map((item) => <span key={item}>{item}</span>)}</div>}{message.blocks?.map((block, index) => <IfaEvidence key={`${block.kind}-${index}`} block={block} terminalPath={terminalPath} />)}</div></article>;
}

function ChatComposer({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
  return <form className="ifa-composer" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Ask about a token, wallet, behaviour or historical pattern…" /><button className="primary" disabled={!value.trim()} aria-label="Send Ask IFÁ question"><ArrowUp size={21} strokeWidth={3} /></button></form>;
}

function AskIfa({ embedded = false, bundle }: { embedded?: boolean; bundle?: TokenBundle }) {
  const terminalMint = bundle?.token.token_mint ?? bundles[0].token.token_mint;
  const terminalPath = `/app/token/${terminalMint}/participants`;
  const [messages, setMessages] = useState<IfaMessage[]>(DEMO_IFA_MESSAGES);
  const [draft, setDraft] = useState("");

  const startFromPrompt = (prompt: string) => {
    setMessages([{ role: "user", text: prompt, timestamp: "New question" }, createMockIfaResponse(prompt)]);
    setDraft("");
  };
  const submit = () => {
    const question = draft.trim();
    if (!question) return;
    setMessages((current) => [...current, { role: "user", text: question, timestamp: "Follow-up" }, createMockIfaResponse(question)]);
    setDraft("");
  };
  const content = <section className="ifa-workspace"><header className="ifa-page-header"><div><p className="eyebrow"><Brain size={15} />Conversational intelligence</p><h1>Ask IFÁ</h1><p>Consult Aladdin’s on-chain evidence</p></div><button type="button" className="ghost" onClick={() => { setMessages([]); setDraft(""); }}>New Session</button></header>{messages.length === 0 ? <IfaEmptyState onPrompt={startFromPrompt} /> : <div className="ifa-thread">{messages.map((message, index) => <ConversationMessage key={`${message.role}-${index}`} message={message} terminalPath={terminalPath} />)}</div>}<ChatComposer value={draft} onChange={setDraft} onSubmit={submit} /></section>;
  return embedded ? content : <Shell active="ifa">{content}</Shell>;
}
function WalletPage({ address }: { address?: string }) { const wallet = wallets.find((w) => w.wallet === address) ?? wallets[0]; const info = walletInfo(wallet.wallet); return <Shell active="live"><Header title="Wallet display" subtitle="Search result" icon={Wallet} /><div className="grid"><Panel title={short(wallet.wallet)} icon={Wallet}><Metric label="Behaviour" value={<BehaviourBadge value={info.behaviour} />} /><Metric label="Win rate" value={fmtPct(info.winRate)} /><Metric label="No. trades" value={info.trades} /><Metric label="Net profit" value={fmtMoney(info.pnlUsd, 0)} /><Metric label="Holdings" value={fmtPctWhole(info.holdingPct)} /></Panel><Panel title="Decision relevance" icon={Target}><p>Wallet display opens from search or table rows. It supports token investigation; it is not a separate main navigation mode.</p></Panel></div></Shell>; }

function TrenchChart({ bundle }: { bundle: TokenBundle }) { const points = bundle.token.checkpoints.map((c, i) => ({ x: 16 + i * 28, y: 82 - ((c.market_cap_usd ?? 0) / Math.max(...bundle.token.checkpoints.map((p) => p.market_cap_usd ?? 0), 1)) * 56, c })); const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "); const area = `${path} L ${points.at(-1)?.x ?? 100} 92 L ${points[0].x} 92 Z`; return <div className="trench"><svg viewBox="0 0 112 100" preserveAspectRatio="none"><defs><linearGradient id="trenchFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8f5cff" stopOpacity="0.5" /><stop offset="100%" stopColor="#8f5cff" stopOpacity="0" /></linearGradient></defs><path className="gridline" d="M 0 25 H 112 M 0 50 H 112 M 0 75 H 112" /><path className="area" d={area} /><path className="line" d={path} />{points.map((p) => <circle key={p.c.checkpoint} cx={p.x} cy={p.y} r="2.4" />)}</svg><div className="trench-labels">{bundle.token.checkpoints.map((c) => <span key={c.checkpoint}>{c.checkpoint}</span>)}</div></div>; }
function MiniTrench({ token }: { token: TokenRecord }) { const max = Math.max(...token.checkpoints.map((c) => c.market_cap_usd ?? 0), 1); const pts = token.checkpoints.map((c, i) => `${i * 33},${40 - ((c.market_cap_usd ?? 0) / max) * 30}`).join(" "); return <svg className="mini-trench" viewBox="0 0 100 44" preserveAspectRatio="none"><polyline points={pts} /></svg>; }
function List({ items }: { items: string[] }) { return items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">No missing inputs reported.</p>; }
function App() { const current = useRoute(); const p = parts(); if (current === "/") return <Landing />; if (current === "/login") return <Login />; if (p[0] !== "app") return <Landing />; if (p[1] === "live") return <LiveTerminal />; if (p[1] === "token") return <TokenPage mint={p[2]} tab={p[3] || "trades"} />; if (p[1] === "wallet") return <WalletPage address={p[2]} />; if (p[1] === "ask-ifa") return <AskIfa />; return <LiveTerminal />; }

createRoot(document.getElementById("root")!).render(<App />);
