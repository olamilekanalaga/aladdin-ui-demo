"use client";

import { useEffect } from "react";
import { ALADDIN_DENSITY_KEY, applyThemePreferences } from "@/app/utils/theme";

export default function ThemeInit() {
  useEffect(() => {
    applyThemePreferences();
    document.documentElement.dataset.density = localStorage.getItem(ALADDIN_DENSITY_KEY) || "compact";
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyThemePreferences();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);
  return null;
}
