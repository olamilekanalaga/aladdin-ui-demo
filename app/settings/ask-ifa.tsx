"use client";

import { useState } from "react";
import { OptionPicker, SettingsCard, SettingsPageTitle, SettingsToggle } from "./primitives";

export function AskIfaSettings() {
  const [detail, setDetail] = useState("standard");
  const [view, setView] = useState("automatic");
  const [context, setContext] = useState(true);
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Aladdin" title="Ask IFÁ" copy="Configure how IFÁ presents investigations inside a session." /><SettingsCard title="Response detail"><OptionPicker value={detail} onChange={setDetail} options={[{ id: "concise", title: "Concise", description: "Direct answer with essential evidence." }, { id: "standard", title: "Standard", description: "Explanation with supporting evidence and relevant tables or visualisations." }, { id: "detailed", title: "Detailed", description: "Deeper interpretation, methodology and supporting evidence where available." }]} /></SettingsCard><SettingsCard title="Default result view"><OptionPicker value={view} onChange={setView} options={[{ id: "automatic", title: "Automatic", description: "Let Ask IFÁ choose the most appropriate format for the question." }, { id: "text", title: "Text First", description: "Prefer narrative explanation before structured evidence." }, { id: "data", title: "Data First", description: "Prefer tables, metrics and visual evidence before longer explanation." }]} /></SettingsCard><SettingsCard title="Follow-up context"><SettingsToggle label="Use conversation context" description="Allow Ask IFÁ to use earlier questions and results within the current investigation session." checked={context} onChange={setContext} /></SettingsCard></div>;
}
