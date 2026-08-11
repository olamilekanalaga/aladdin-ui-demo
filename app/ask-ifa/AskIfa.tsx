"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
import { Shell } from "@/app/components/Shell";
import { bundles } from "@/app/data/bundles";
import { ChatComposer, ConversationMessage, IfaEmptyState } from "./chat";
import { DEMO_IFA_MESSAGES, createMockIfaResponse } from "./mock";

export function AskIfa() {
  const terminalMint = bundles[0].token.token_mint;
  const terminalPath = `/token/${terminalMint}/participants`;
  const [messages, setMessages] = useState(DEMO_IFA_MESSAGES);
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
  return <Shell active="ifa"><section className="ifa-workspace"><header className="ifa-page-header"><div><p className="eyebrow"><Brain size={15} />Conversational intelligence</p><h1>Ask IFÁ</h1><p>Consult Aladdin&apos;s on-chain evidence</p></div><button type="button" className="ghost" onClick={() => { setMessages([]); setDraft(""); }}>New Session</button></header>{messages.length === 0 ? <IfaEmptyState onPrompt={startFromPrompt} /> : <div className="ifa-thread">{messages.map((message, index) => <ConversationMessage key={`${message.role}-${index}`} message={message} terminalPath={terminalPath} />)}</div>}<ChatComposer value={draft} onChange={setDraft} onSubmit={submit} /></section></Shell>;
}
