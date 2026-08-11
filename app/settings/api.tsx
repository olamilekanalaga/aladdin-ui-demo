"use client";

import { Metric } from "@/app/components/ui";
import { ProgressBar, SettingsCard, SettingsPageTitle } from "./primitives";

export function ApiSettings() {
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Aladdin" title="API" copy="Developer access for Aladdin evidence. Full API keys are never shown after creation." /><SettingsCard title="API access"><Metric label="Access" value="Pro" /><div className="usage-hero compact"><span>Requests this month</span><ProgressBar value={37} /><small>18,429 / 50,000</small></div></SettingsCard><SettingsCard title="API keys" action={<button className="ghost" type="button">+ Create API Key</button>}><div className="api-key-row"><div><b>Production</b><code>al_live_••••••••••••4x8a</code></div><span>Created<br />10 Aug 2026</span><span>Last used<br />4 minutes ago</span><button className="danger-button subtle" type="button">Revoke</button></div></SettingsCard><SettingsCard title="API navigation"><div className="settings-action-row"><button className="ghost" type="button">Documentation</button><button className="ghost" type="button">Usage</button><button className="ghost" type="button">API Status</button></div></SettingsCard></div>;
}
