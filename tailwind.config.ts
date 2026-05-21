import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold:  { DEFAULT: "#c8a951", light: "#f0e8d8", dark: "#9a7830" },
        navy:  { DEFAULT: "#141c2e", deep: "#080d14",  light: "#1e2d4a" },
        slate: { DEFAULT: "#9a8a6a", light: "#c8c0a8" },
        ivory: "#f0e8d8",
        kraft: "#c4a882",
      },
      fontSize: {
        // Tailles 9:16 (base 1080px) — jamais aller en-dessous
        "stat-2xl": ["200px", { lineHeight: "1",   fontWeight: "700" }],
        "stat-xl":  ["180px", { lineHeight: "1",   fontWeight: "700" }],
        "stat-lg":  ["120px", { lineHeight: "1",   fontWeight: "700" }],
        "stat-md":  ["80px",  { lineHeight: "1.1", fontWeight: "700" }],
        "entity":   ["110px", { lineHeight: "1",   fontWeight: "700" }],
        "label":    ["38px",  { lineHeight: "1.3", fontWeight: "400" }],
        "mono-sm":  ["28px",  { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        // Safe zones 9:16 (1080x1920)
        "safe-top":    "288px",
        "safe-bottom": "192px",
        "col-pad":     "54px",
        "side-pad":    "30px",
        // Safe zones 16:9 (1920x1080)
        "safe-top-169":    "108px",
        "safe-bottom-169": "108px",
        "col-pad-169":     "96px",
        "side-pad-169":    "96px",
      },
    },
  },
  plugins: [],
};

export default config;
