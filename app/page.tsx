"use client";

import { PublicNav } from "./components/PublicNav";
import { DemoTerminalPreview } from "./components/DemoTerminalPreview";
import { DemoIfaPreview } from "./components/DemoIfaPreview";
import { Pill } from "./components/badges";
import { useGo } from "./utils/navigation";

export default function Landing() {
  const go = useGo();
  return <main className="landing public-page"><PublicNav /><section className="public-hero">
    <div className="public-copy">
      <p className="eyebrow">Aladdin Intelligence</p>
      <h1>On-chain intelligence, however you want to investigate it.</h1>
      <p className="lede">Search tokens and wallets, investigate directly through Terminal, or ask blockchain questions in natural language.</p>
      <div className="actions"><button className="primary" onClick={() => go("/login")}>Get started</button><a className="ghost anchor-button" href="#ask-ifa-demo">Explore Ask IFÁ</a></div>
      <div className="principle"><span>Evidence</span><span>Interpretation</span><span>Human decision</span></div>
    </div>
    <DemoTerminalPreview />
  </section>
  <section id="product" className="public-section">
    <div className="section-heading"><p className="eyebrow">Product</p><h2>Two ways to investigate</h2><p>Terminal and Ask IFÁ are two interfaces into the same Aladdin intelligence system.</p></div>
    <div className="two-panel">
      <article><h3>Terminal</h3><p>Investigate blockchain evidence directly through structured workspaces, tables, charts and historical context.</p><DemoTerminalPreview /><button className="ghost" onClick={() => go("/live")}>Explore Terminal</button></article>
      <article><h3>Ask IFÁ</h3><p>Ask blockchain questions in ordinary language and receive inspectable evidence as answers, tables, charts and historical comparisons.</p><DemoIfaPreview compact /><a className="ghost anchor-button" href="#ask-ifa-demo">Explore Ask IFÁ</a></article>
    </div>
  </section>
  <section className="public-section">
    <div className="section-heading"><p className="eyebrow">Capabilities</p><h2>Built around blockchain evidence</h2></div>
    <div className="capability-grid">
      {[
        ["Token Intelligence", "Understand token formation, participants, flows, holders and lifecycle evidence."],
        ["Wallet Intelligence", "Investigate wallet activity, positions, history and behaviour."],
        ["Participants", "Understand who is participating and how different wallet cohorts behave."],
        ["Live State", "Inspect current flow, participation and state changes."],
        ["Historical Match", "Compare current formations against historically similar states."],
        ["Early Buyers", "Investigate first buyers, retention, exits and concentration."]
      ].map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
    </div>
  </section>
  <section id="ask-ifa-demo" className="public-section ask-demo-section">
    <div className="section-heading"><p className="eyebrow">Ask IFÁ</p><h2>Ask the chain</h2><p>Start with a question instead of a query language. Ask IFÁ returns structured evidence, not trading instructions.</p></div>
    <DemoIfaPreview />
    <div className="ifa-follow-up"><b>USER</b><p>Only show wallets that have done this across at least five tokens.</p><b>IFÁ</b><p>That reduces the cohort to 8 wallets. Open the evidence in Terminal for direct investigation.</p></div>
  </section>
  <section className="public-section terminal-demo-section">
    <div className="section-heading"><p className="eyebrow">Terminal</p><h2>Investigate the evidence directly</h2><p>Terminal is for direct control: token identity, trench-style charts, trades, participants, first buyers, holders and live state.</p></div>
    <DemoTerminalPreview />
  </section>
  <section className="public-section everywhere-section">
    <div id="telegram"><h3>Aladdin on Telegram</h3><p>Paste a token contract, inspect a wallet, ask IFÁ or receive Aladdin alerts without leaving Telegram.</p><Pill tone="warn">Coming soon</Pill></div>
    <div id="api"><h3>Build with Aladdin</h3><p>Access Aladdin intelligence programmatically for research, applications and automated workflows.</p><button className="ghost" disabled>API access coming soon</button></div>
  </section>
  <section id="access" className="public-section access-section">
    <p className="eyebrow">Access</p><h2>Built for different levels of investigation</h2><p>Explore Aladdin with limited access. Upgrade options for deeper historical research, higher Ask IFÁ usage, Telegram and API access will be available as Aladdin develops.</p><button className="primary" onClick={() => go("/login")}>Get started</button>
  </section>
  <footer className="public-footer"><b>ALADDIN</b><span>Evidence-first on-chain intelligence.</span><a href="#product">Product</a><a href="#ask-ifa-demo">Ask IFÁ</a><a href="#api">API</a><a href="#telegram">Telegram</a></footer>
  </main>;
}
