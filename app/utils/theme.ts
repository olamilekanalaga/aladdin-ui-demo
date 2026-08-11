export type ThemeMode = "dark" | "light" | "system";

export const ALADDIN_THEME_KEY = "aladdin-theme-mode";
export const ALADDIN_DENSITY_KEY = "aladdin-density-mode";

export const readThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(ALADDIN_THEME_KEY);
  return stored === "light" || stored === "system" || stored === "dark" ? stored : "dark";
};

export const resolveThemeMode = (mode: ThemeMode) =>
  mode === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : mode === "system" ? "dark" : mode;

export const applyThemePreferences = (mode: ThemeMode = readThemeMode()) => {
  if (typeof document === "undefined") return;
  const resolved = resolveThemeMode(mode);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.accent = "purple";
  document.documentElement.style.colorScheme = resolved;
};
