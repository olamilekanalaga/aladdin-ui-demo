"use client";

import { useState } from "react";
import { SettingsCard, SettingsPageTitle, SettingsToggle, StatusDot } from "./primitives";

export function TelegramSettings() {
  const [historicalAlerts, setHistoricalAlerts] = useState(true);
  const [watchedAlerts, setWatchedAlerts] = useState(true);
  const [savedAlerts, setSavedAlerts] = useState(true);
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Aladdin" title="Telegram" copy="Use Aladdin intelligence from Telegram. Telegram is an interface, not a separate intelligence system." /><SettingsCard title="Status"><div className="telegram-status"><StatusDot text="Connected" /><b>@ola_crrypt</b><button className="ghost" type="button">Open Aladdin Bot</button><button className="settings-subtle-button" type="button">Disconnect</button></div></SettingsCard><SettingsCard title="Available in Telegram"><div className="feature-checks">{["Paste token CA", "Paste wallet address", "Ask IFÁ", "Receive alerts", "Open results in Aladdin"].map((item) => <span key={item}>? {item}</span>)}</div><p className="settings-muted">Capabilities are product-direction/demo states unless backend support exists.</p></SettingsCard><SettingsCard title="Alert delivery"><SettingsToggle label="Historical Match alerts" description="Notify when saved historical matches update." checked={historicalAlerts} onChange={setHistoricalAlerts} /><SettingsToggle label="Watched token alerts" description="Notify when watched tokens change state." checked={watchedAlerts} onChange={setWatchedAlerts} /><SettingsToggle label="Saved alerts" description="Notify for manually saved alerts." checked={savedAlerts} onChange={setSavedAlerts} /></SettingsCard><SettingsCard title="Pair Telegram"><div className="pairing-box"><ol><li>Open the Aladdin Telegram bot.</li><li>Send the pairing command.</li><li>Enter this one-time code.</li></ol><strong>ALD-7X42</strong><small>Expires in 10 minutes.</small><button className="ghost" type="button">Copy Code</button><button className="settings-subtle-button" type="button">Regenerate pairing code</button></div></SettingsCard></div>;
}
