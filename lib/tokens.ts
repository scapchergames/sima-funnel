export const tokens = {
  color: {
    brand: "#7C5CFC",
    brandDark: "#5B3FD4",
    brandLight: "#A98BFF",
    accent: "#FF6B6B",
    gold: "#F5C842",
    dark: "#0D0D12",
    surface: "#16161F",
    surfaceHigh: "#1E1E2A",
    border: "rgba(255,255,255,0.08)",
    borderMid: "rgba(255,255,255,0.14)",
    textPrimary: "#F0EFFF",
    textSecondary: "rgba(240,239,255,0.55)",
    textMuted: "rgba(240,239,255,0.35)",
  },
  font: {
    sans: "'Inter',-apple-system,'Helvetica Neue',system-ui,sans-serif",
  },
  radius: {
    sm: "12px",
    md: "18px",
    lg: "24px",
    xl: "32px",
    full: "9999px",
  },
  shadow: {
    brand: "0 8px 32px rgba(124,92,252,0.35)",
    card: "0 4px 24px rgba(0,0,0,0.4)",
    glow: "0 0 40px rgba(124,92,252,0.2)",
  },
} as const;
