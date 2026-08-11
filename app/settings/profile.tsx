"use client";

import { useState } from "react";
import { SettingsCard, SettingsField, SettingsPageTitle, StatusDot } from "./primitives";

export function ProfileSettings() {
  const [displayName, setDisplayName] = useState("Olamilekan Alaga");
  const [username, setUsername] = useState("ola_crrypt");
  const [bio, setBio] = useState("On-chain researcher");
  const [saved, setSaved] = useState(false);
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Account" title="Profile" copy="Your Aladdin identity appears on shared research, exports and collaborative surfaces." /><div className="settings-two-col"><SettingsCard title="Profile details" action={saved ? <StatusDot text="Saved" /> : null}><div className="profile-photo-row"><div className="profile-photo">OA</div><div><button className="ghost" type="button">Change image</button><button className="settings-subtle-button" type="button">Remove image</button></div></div><SettingsField label="Display name"><input value={displayName} onChange={(event) => { setDisplayName(event.target.value); setSaved(false); }} /></SettingsField><SettingsField label="Username" hint={`aladdin.xyz/@${username || "username"}`}><input value={username} onChange={(event) => { setUsername(event.target.value); setSaved(false); }} /></SettingsField><SettingsField label="Short bio"><textarea value={bio} onChange={(event) => { setBio(event.target.value); setSaved(false); }} maxLength={120} /></SettingsField><div className="settings-linked-row"><span>X Account</span><b>@ola_crrypt</b><StatusDot text="Connected" /></div><button className="primary settings-save" type="button" onClick={() => setSaved(true)}>Save Changes</button></SettingsCard><SettingsCard title="Shared identity preview"><p className="settings-muted">See how your identity may appear on shared Aladdin research and visual exports. Public sharing is not presented as production-ready here.</p><div className="share-preview"><small>FIRST-100 BUYER RETENTION</small><strong>20 Pump.fun launches</strong><span>Created with Aladdin</span><b>by @{username || "ola_crrypt"}</b><time>10 Aug 2026 · 07:42</time></div><p className="settings-muted">CSV analytical rows remain clean. Attribution belongs in report metadata, image footers, dashboards or shared pages.</p></SettingsCard></div></div>;
}
