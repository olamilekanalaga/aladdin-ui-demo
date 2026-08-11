"use client";

import { useState } from "react";
import { SettingsCard, SettingsField, SettingsPageTitle } from "./primitives";

export function MobileAppSettings() {
  const [email, setEmail] = useState("ol••••••@gmail.com");
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Help" title="Aladdin Mobile" copy="Aladdin intelligence wherever you are." /><SettingsCard title="Coming soon"><div className="mobile-card"><div className="qr-placeholder" aria-label="Inactive QR placeholder"><span>QR</span><small>Inactive demo</small></div><div><h3>Scan with your phone</h3><p className="settings-muted">The apps do not currently exist, so this QR code and store buttons are inactive placeholders.</p><div className="settings-action-row"><button className="ghost" type="button" disabled>Apple App Store</button><button className="ghost" type="button" disabled>Google Play</button></div><SettingsField label="Be notified when Aladdin Mobile launches"><div className="notify-row"><input value={email} onChange={(event) => setEmail(event.target.value)} /><button className="primary" type="button">Notify me</button></div></SettingsField></div></div></SettingsCard></div>;
}
