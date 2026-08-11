"use client";

import { ArrowUp } from "lucide-react";
import { ALADDIN_LOGO } from "@/app/utils/assets";
import { IfaEvidence } from "./evidence";
import type { IfaMessage } from "./ifa-types";

export const IFA_SUGGESTIONS = [
  "Show me the first 100 buyers still holding.",
  "Which wallets bought before migration?",
  "Find historical formations similar to this token.",
  "Compare buyer activity before and after migration."
];

export function PromptSuggestions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return <div className="ifa-suggestions">{IFA_SUGGESTIONS.map((prompt) => <button key={prompt} type="button" onClick={() => onSelect(prompt)}>{prompt}</button>)}</div>;
}

export function IfaEmptyState({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return <section className="ifa-empty"><img src={ALADDIN_LOGO} alt="Aladdin" /><p className="eyebrow">Conversational evidence</p><h2>Ask Aladdin about on-chain activity</h2><p>Investigate tokens, wallets, participants and historical patterns using natural language.</p><PromptSuggestions onSelect={onPrompt} /></section>;
}

export function ConversationMessage({ message, terminalPath }: { message: IfaMessage; terminalPath: string }) {
  return <article className={`ifa-message ${message.role}`}><div className="ifa-message-label"><span>{message.role === "user" ? "USER" : "IFÁ"}</span>{message.timestamp && <small>{message.timestamp}</small>}</div><div className="ifa-message-body"><p>{message.text}</p>{message.provenance && <div className="ifa-provenance">{message.provenance.map((item) => <span key={item}>{item}</span>)}</div>}{message.blocks?.map((block, index) => <IfaEvidence key={`${block.kind}-${index}`} block={block} terminalPath={terminalPath} />)}</div></article>;
}

export function ChatComposer({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
  return <form className="ifa-composer" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Ask about a token, wallet, behaviour or historical pattern…" /><button className="primary" disabled={!value.trim()} aria-label="Send Ask IFÁ question"><ArrowUp size={21} strokeWidth={3} /></button></form>;
}
