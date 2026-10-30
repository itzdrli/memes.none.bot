/**
 * Theme preference, same palettes and pattern as FantasticFrame's
 * usePreferences: persisted under `mn:theme`, applied as <html data-theme>
 * (main.css maps every nord-* role per theme). The inline script in
 * nuxt.config applies the saved theme before first paint; this owns it after.
 */

export type ThemeId = "graphite" | "nord" | "frost" | "sand" | "dusk";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  /** page, panel, accent, text */
  swatches: string[];
}

export const THEMES: ThemeMeta[] = [
  { id: "graphite", label: "石墨", swatches: ["#1b1b1b", "#262626", "#5aa2ee", "#ececec"] },
  { id: "nord", label: "北境", swatches: ["#2e3440", "#3b4252", "#88c0d0", "#eceff4"] },
  { id: "dusk", label: "暮色", swatches: ["#0d0f13", "#191c22", "#6fc3de", "#edf1f7"] },
  { id: "frost", label: "霜白", swatches: ["#e7ecf2", "#f8fafc", "#0e7490", "#1f2a3a"] },
  { id: "sand", label: "沙纸", swatches: ["#efe7d9", "#faf6ec", "#8a5a23", "#2e2518"] },
];

const THEME_KEY = "mn:theme";

function readAppliedTheme(): ThemeId | null {
  const applied = document.documentElement.dataset.theme;
  return THEMES.some((t) => t.id === applied) ? (applied as ThemeId) : null;
}

// Module-level so every consumer shares one source of truth. Server markup
// always starts at graphite; the theme menu is client-only.
const themeId = ref<ThemeId>(import.meta.client ? (readAppliedTheme() ?? "graphite") : "graphite");

export function useTheme() {
  function setTheme(id: ThemeId) {
    themeId.value = id;
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem(THEME_KEY, id);
    } catch {
      /* storage may be unavailable (private mode), theme still works per-tab */
    }
  }

  return { themeId, setTheme, THEMES };
}
