export const SETTINGS_GROUPS = [
  { group: "ACCOUNT", items: [{ label: "Profile", slug: "profile" }, { label: "Account & Security", slug: "account-security" }] },
  { group: "PERSONALISATION", items: [{ label: "Appearance", slug: "appearance" }, { label: "Language", slug: "language" }] },
  { group: "ALADDIN", items: [{ label: "Ask IFÁ", slug: "ask-ifa" }, { label: "Ifá Usage", slug: "ifa-usage" }, { label: "Telegram", slug: "telegram" }, { label: "API", slug: "api" }] },
  { group: "SUBSCRIPTION", items: [{ label: "Plan & Billing", slug: "plan-billing" }] },
  { group: "HELP", items: [{ label: "Tutorial", slug: "tutorial" }, { label: "Mobile App", slug: "mobile-app" }] }
];

export const SETTINGS_SLUGS = new Set(SETTINGS_GROUPS.flatMap((group) => group.items.map((item) => item.slug)));
export const SETTINGS_LABELS = Object.fromEntries(SETTINGS_GROUPS.flatMap((group) => group.items.map((item) => [item.slug, item.label])));

export function cleanSettingsSlug(section?: string) {
  return section && SETTINGS_SLUGS.has(section) ? section : "profile";
}

export function settingsGroupForSlug(slug: string) {
  return SETTINGS_GROUPS.find((group) => group.items.some((item) => item.slug === slug))?.group ?? "ACCOUNT";
}
