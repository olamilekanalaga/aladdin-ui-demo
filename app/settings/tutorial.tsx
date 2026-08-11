"use client";

import { ProgressBar, SettingsCard, SettingsPageTitle } from "./primitives";

export function TutorialSettings() {
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Help" title="Learn Aladdin" copy="Onboarding centre for understanding Aladdin's investigation workflow." /><SettingsCard title="Your progress"><div className="usage-hero compact"><ProgressBar value={64} /><small>64% complete</small></div></SettingsCard>{[{ title: "Getting Started", items: ["? Understanding Launches", "? Investigating a token", "? Investigating a wallet"] }, { title: "Ask IFÁ", items: ["? Asking your first question", "? Working with follow-up questions", "? Tables, charts and evidence"] }, { title: "Terminal", items: ["? Token Intelligence", "? Participants", "? Historical Match"] }, { title: "Integrations", items: ["? Telegram", "? API"] }].map((group) => <SettingsCard key={group.title} title={group.title}><div className="lesson-list">{group.items.map((item) => <span key={item}>{item}</span>)}</div></SettingsCard>)}<button className="ghost" type="button">Restart Product Tour</button></div>;
}
