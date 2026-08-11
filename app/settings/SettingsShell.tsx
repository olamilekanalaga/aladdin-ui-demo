"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { Pill } from "@/app/components/badges";
import { Shell } from "@/app/components/Shell";
import { settingsGroupForSlug, SETTINGS_GROUPS, SETTINGS_LABELS } from "@/app/utils/settings";
import { useGo } from "@/app/utils/navigation";

export function SettingsShell({ active, children }: { active: string; children: React.ReactNode }) {
  const go = useGo();
  const [openGroup, setOpenGroup] = useState(settingsGroupForSlug(active));
  useEffect(() => {
    setOpenGroup(settingsGroupForSlug(active));
  }, [active]);
  return <Shell active="settings"><section className="settings-workspace"><header className="settings-header"><div><p className="eyebrow"><Settings size={15} />Control centre</p><h1>Settings</h1><p>Manage your Aladdin identity, access, integrations and product preferences.</p></div><Pill tone="purple">Demo settings</Pill></header><div className="settings-layout"><nav className="settings-nav accordion" aria-label="Settings navigation">{SETTINGS_GROUPS.map((group) => { const isOpen = openGroup === group.group; return <div className="settings-nav-group" key={group.group}><button className="settings-group-head" type="button" aria-expanded={isOpen} onClick={() => setOpenGroup(group.group)}><span>{group.group}</span><b>{isOpen ? "-" : "+"}</b></button>{isOpen && <div className="settings-subnav">{group.items.map((item) => <button key={item.slug} type="button" className={active === item.slug ? "active" : ""} onClick={() => go(`/settings/${item.slug}`)}>{item.label}</button>)}</div>}</div>; })}</nav><section className="settings-panel-area" aria-label={SETTINGS_LABELS[active]}>{children}</section></div></section></Shell>;
}
