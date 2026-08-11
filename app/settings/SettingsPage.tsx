"use client";

import { cleanSettingsSlug } from "@/app/utils/settings";
import { AccountSecuritySettings } from "./account-security";
import { ApiSettings } from "./api";
import { AppearanceSettings } from "./appearance";
import { AskIfaSettings } from "./ask-ifa";
import { IfaUsageSettings } from "./ifa-usage";
import { LanguageSettings } from "./language";
import { MobileAppSettings } from "./mobile-app";
import { PlanBillingSettings } from "./plan-billing";
import { ProfileSettings } from "./profile";
import { SettingsShell } from "./SettingsShell";
import { TelegramSettings } from "./telegram";
import { TutorialSettings } from "./tutorial";

export function SettingsPage({ section }: { section?: string }) {
  const active = cleanSettingsSlug(section);
  return <SettingsShell active={active}>{active === "account-security" && <AccountSecuritySettings />}{active === "appearance" && <AppearanceSettings />}{active === "language" && <LanguageSettings />}{active === "ask-ifa" && <AskIfaSettings />}{active === "ifa-usage" && <IfaUsageSettings />}{active === "telegram" && <TelegramSettings />}{active === "api" && <ApiSettings />}{active === "plan-billing" && <PlanBillingSettings />}{active === "tutorial" && <TutorialSettings />}{active === "mobile-app" && <MobileAppSettings />}{active === "profile" && <ProfileSettings />}</SettingsShell>;
}
