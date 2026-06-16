/**
 * Per-site theming. Every subsidiary "site" gets its own accent so it reads as
 * an independent domain, while the embedded map stays uniform (the shared,
 * connected layer). The parent corporate site uses the Dycom blue.
 */
export interface Theme {
  primary: string;
  primaryDark: string;
}

export const DYCOM_THEME: Theme = { primary: "#005cb9", primaryDark: "#00427f" };

// A spread of distinct, professional accents so neighboring companies look
// clearly different from one another and from the parent.
const PALETTE: Theme[] = [
  { primary: "#0f766e", primaryDark: "#115e59" }, // teal
  { primary: "#b91c1c", primaryDark: "#7f1d1d" }, // red
  { primary: "#c2410c", primaryDark: "#9a3412" }, // orange
  { primary: "#15803d", primaryDark: "#166534" }, // green
  { primary: "#6d28d9", primaryDark: "#5b21b6" }, // purple
  { primary: "#0369a1", primaryDark: "#075985" }, // sky
  { primary: "#be123c", primaryDark: "#9f1239" }, // rose
  { primary: "#1d4ed8", primaryDark: "#1e40af" }, // royal blue
  { primary: "#047857", primaryDark: "#065f46" }, // emerald
  { primary: "#a16207", primaryDark: "#854d0e" }, // amber
  { primary: "#4338ca", primaryDark: "#3730a3" }, // indigo
  { primary: "#0e7490", primaryDark: "#155e75" }, // cyan
  { primary: "#9d174d", primaryDark: "#831843" }, // magenta
  { primary: "#1e3a8a", primaryDark: "#172554" }, // navy
];

export function companyTheme(id: number): Theme {
  return PALETTE[Math.abs(id) % PALETTE.length];
}

/** CSS custom properties consumed by the themed UI (`var(--accent)` etc.). */
export function themeVars(theme: Theme): React.CSSProperties {
  return {
    "--accent": theme.primary,
    "--accent-dark": theme.primaryDark,
    "--accent-soft": `color-mix(in srgb, ${theme.primary} 8%, white)`,
    "--accent-ring": `color-mix(in srgb, ${theme.primary} 30%, white)`,
  } as React.CSSProperties;
}
