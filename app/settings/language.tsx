"use client";

import { SettingsCard, SettingsField, SettingsPageTitle } from "./primitives";

export function LanguageSettings() {
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Personalisation" title="Language" copy="Keep interface language simple. Ask IFÁ handles conversation language per question." /><SettingsCard title="Interface language"><SettingsField label="Language" hint="Controls the language used throughout the Aladdin interface."><select defaultValue="en-GB"><option value="en-GB">English (UK)</option></select></SettingsField></SettingsCard><SettingsCard title="Ask IFÁ language behaviour"><p className="settings-muted">Ask IFÁ automatically detects the language of your question and responds accordingly when supported. There is no separate conversation-language selector.</p></SettingsCard></div>;
}
