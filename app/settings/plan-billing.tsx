"use client";

import { Table } from "@/app/components/ui";
import { SettingsCard, SettingsPageTitle, SettingsRows } from "./primitives";

export function PlanBillingSettings() {
  return <div className="settings-stack"><SettingsPageTitle eyebrow="Subscription" title="Plan & Billing" copy="Subscription management UI with placeholder pricing until final plans are defined." /><SettingsCard title="Current plan"><div className="plan-card"><small>ALADDIN PRO</small><strong>£XX / month</strong><span>Next billing date: 1 September 2026</span><button className="primary" type="button">Manage Plan</button></div></SettingsCard><SettingsCard title="Included"><div className="feature-checks">{["Terminal", "Ask IFÁ", "Historical Match", "Telegram", "Ifá credits", "API allowance"].map((item) => <span key={item}>? {item}</span>)}</div></SettingsCard><SettingsCard title="Payment method"><SettingsRows rows={[["Visa •••• 4242", "Mock", <button className="settings-subtle-button" type="button">Update</button>]]} /></SettingsCard><SettingsCard title="Billing history"><Table columns={["Month", "Amount", "Status", "Action"]} rows={[["Aug 2026", "£XX", "Paid", <button className="settings-subtle-button" type="button">Invoice</button>], ["Jul 2026", "£XX", "Paid", <button className="settings-subtle-button" type="button">Invoice</button>]]} /></SettingsCard></div>;
}
