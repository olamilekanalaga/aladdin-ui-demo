"use client";

import type { ReactNode } from "react";
import { Table } from "@/app/components/ui";

export function SettingsPageTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="settings-page-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{copy}</p></div>;
}

export function SettingsCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="settings-card"><div className="settings-card-head"><h3>{title}</h3>{action}</div>{children}</section>;
}

export function SettingsField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="settings-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

export function StatusDot({ tone = "good", text }: { tone?: "good" | "warn" | "bad" | "neutral"; text: string }) {
  return <span className={`status-dot ${tone}`}><i />{text}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="settings-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><i style={{ width: `${value}%` }} /></div>;
}

export function SettingsToggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="settings-toggle"><span><b>{label}</b><small>{description}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>;
}

export function OptionPicker({ options, value, onChange }: { options: { id: string; title: string; description: string }[]; value: string; onChange: (value: string) => void }) {
  return <div className="settings-options">{options.map((option) => <button key={option.id} type="button" className={value === option.id ? "selected" : ""} aria-pressed={value === option.id} onClick={() => onChange(option.id)}><b>{option.title}</b><span>{option.description}</span></button>)}</div>;
}

export function SettingsRows({ rows }: { rows: ReactNode[][] }) {
  return <div className="settings-table"><Table columns={["Item", "Status", "Action"]} rows={rows} /></div>;
}
