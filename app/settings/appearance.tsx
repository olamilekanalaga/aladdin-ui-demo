"use client";

import { useState } from "react";
import { ALADDIN_DENSITY_KEY, ALADDIN_THEME_KEY, applyThemePreferences, readThemeMode } from "@/app/utils/theme";
import type { ThemeMode } from "@/app/utils/theme";
import { SettingsCard, SettingsPageTitle, SettingsToggle } from "./primitives";

export function AppearanceSettings() {
  const [theme, setTheme] = useState<ThemeMode>(() => readThemeMode());
  const [density, setDensity] = useState(() => typeof window === "undefined" ? "compact" : localStorage.getItem(ALADDIN_DENSITY_KEY) || "compact");
  const [reduceMotion, setReduceMotion] = useState(false);
  const chooseTheme = (next: ThemeMode) => {
    setTheme(next);
    localStorage.setItem(ALADDIN_THEME_KEY, next);
    applyThemePreferences(next);
  };
  const chooseDensity = (next: string) => {
    setDensity(next);
    localStorage.setItem(ALADDIN_DENSITY_KEY, next);
    document.documentElement.dataset.density = next;
  };
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Personalisation" title="Appearance" copy="Choose light or dark mode while keeping Aladdin's purple primary interaction colour." /><SettingsCard title="Theme"><div className="theme-grid">{[{ id: "dark", name: "Dark", copy: "Default Aladdin dark workspace." }, { id: "light", name: "Light", copy: "Brighter workspace for daytime review." }, { id: "system", name: "System", copy: "Follow your device appearance." }].map((item) => <button key={item.id} type="button" className={`theme-card ${theme === item.id ? "selected" : ""} ${item.id}`} onClick={() => chooseTheme(item.id as ThemeMode)}><span /><b>{item.name}</b><small>{item.copy}</small></button>)}</div></SettingsCard><SettingsCard title="Primary interaction colour"><div className="accent-row"><button type="button" className="accent-choice selected purple"><i />Purple</button></div><p className="settings-muted">Purple is used for buttons, active navigation, selected tabs, focus states and links. Semantic evidence colours remain unchanged.</p></SettingsCard><SettingsCard title="Interface density"><div className="settings-options">{[["comfortable", "Comfortable", "More breathing room."], ["compact", "Compact", "Recommended for most Aladdin workspaces."], ["dense", "Dense", "Maximum information density for Terminal."]].map(([id, label, copy]) => <button key={id} type="button" className={density === id ? "selected" : ""} onClick={() => chooseDensity(id)}><b>{label}</b><span>{copy}</span></button>)}</div></SettingsCard><SettingsCard title="Accessibility"><SettingsToggle label="Reduce motion" description="Minimise non-essential interface motion." checked={reduceMotion} onChange={setReduceMotion} /></SettingsCard></div>;
}
