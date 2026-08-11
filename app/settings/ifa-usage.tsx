"use client";

import { ProgressBar, SettingsCard, SettingsPageTitle, SettingsRows } from "./primitives";

export function IfaUsageSettings() {
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Aladdin" title="Ifá Usage" copy="Demo usage values showing allowance, renewal and what consumes credits." /><SettingsCard title="Pro plan"><div className="usage-hero"><strong>3,842</strong><span>credits remaining</span><ProgressBar value={77} /><small>3,842 / 5,000 · Renews 1 September 2026</small></div></SettingsCard><SettingsCard title="This billing period"><SettingsRows rows={[["Consultations", "84", "Demo"], ["Historical investigations", "19", "Demo"], ["Charts generated", "7", "Demo"], ["Large data queries", "3", "Demo"]]} /></SettingsCard><SettingsCard title="Recent usage" action={<button className="settings-subtle-button" type="button">View all</button>}><SettingsRows rows={[["Historical formation comparison", "12 credits", "Demo"], ["Wallet cohort analysis", "8 credits", "Demo"], ["Token lookup", "1 credit", "Demo"], ["Token lookup", "1 credit", "Demo"]]} /></SettingsCard></div>;
}
