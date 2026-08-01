// globeThemes — extrait de src/projects/_rnd/d3-16x9/SoudanActe3GlobeProto16x9.tsx (THEMES).
// Isole ici pour que le Short Soudan (branche feat/soudan-short-9x16) n'importe pas tout le fichier
// Acte 3 (585 lignes, code de scene non pertinent pour le Short) — seule la palette est partagee.
// Ne pas modifier sans repercuter sur le fichier source (memory ROUTAGE : source de verite = Acte 3).

export type ThemeName = "space" | "parchemin" | "mixte";

export type GlobeTheme = {
  bg: string;
  oceanInner: string; // centre du degrade radial ocean (cote eclaire)
  oceanMid: string;
  oceanOuter: string;
  atmoColor: string;
  atmoOpacity: number;
  land: string;
  landStroke: string;
  borderWidth: number;
  borderOpacity: number;
  grat: string;
  gratOpacity: number;
  sudanFill: string;
  sudanStroke: string;
  sphereStroke: string;
  labelFill: string;
  labelStroke: string;
  legendSur: string;
  flowGold: string;
  flowMetal: string;
  legendTitle: string;
  landActive: string;
  landActiveStroke: string;
};

export const RSF_RED = "#C0392B";
export const SAF_BLUE = "#2E6DB4";

export const THEMES: Record<ThemeName, GlobeTheme> = {
  space: {
    bg: "#0b1220",
    oceanInner: "#1d3055",
    oceanMid: "#16233f",
    oceanOuter: "#0f1a30",
    atmoColor: "#4a7fd0",
    atmoOpacity: 0.45,
    land: "#26375f",
    landStroke: "#5878ad",
    borderWidth: 0.7,
    borderOpacity: 0.6,
    grat: "#2b3f66",
    gratOpacity: 0.5,
    sudanFill: "#F5EFD6",
    sudanStroke: "#b9852f",
    sphereStroke: "#4a7fd0",
    labelFill: "#e8dcbf",
    labelStroke: "#0b1220",
    legendSur: "#8fa3c8",
    flowGold: "#E7B75A",
    flowMetal: "#9AA3AD",
    legendTitle: "#E7B75A",
    landActive: "#4a5c86",
    landActiveStroke: "#8fb0e8",
  },
  parchemin: {
    bg: "#0e0b06",
    oceanInner: "#EDE3C4",
    oceanMid: "#DBCDA6",
    oceanOuter: "#8a7a52",
    atmoColor: "#e8cf94",
    atmoOpacity: 0.4,
    land: "#C9B78A",
    landStroke: "#6b5836",
    borderWidth: 0.4,
    borderOpacity: 0.35,
    grat: "#a8946a",
    gratOpacity: 0.35,
    sudanFill: "#F7F1DC",
    sudanStroke: "#a9701f",
    sphereStroke: "#8a7a52",
    labelFill: "#4a3a1e",
    labelStroke: "#F5EFD6",
    legendSur: "#8a7440",
    flowGold: "#E7B75A",
    flowMetal: "#9AA3AD",
    legendTitle: "#c78a2a",
    landActive: "#E0C98A",
    landActiveStroke: "#c9971f",
  },
  // MIXTE (choix Aziz) : terres kaki/parchemin + ocean bleu adouci + flux satures. C'est le
  // theme utilise par le long Soudan (Actes 3-6) et par GlobeRecitProto (Short).
  mixte: {
    bg: "#0a1018",
    oceanInner: "#2a4468",
    oceanMid: "#1f3554",
    oceanOuter: "#152538",
    atmoColor: "#5a86c4",
    atmoOpacity: 0.42,
    land: "#B8A578",
    landStroke: "#7a6844",
    borderWidth: 0.65,
    borderOpacity: 0.55,
    grat: "#3a5170",
    gratOpacity: 0.4,
    sudanFill: "#F4ECD2",
    sudanStroke: "#b07d22",
    sphereStroke: "#5a86c4",
    labelFill: "#f2e9cf",
    labelStroke: "#0a1018",
    legendSur: "#9fb2cf",
    flowGold: "#FFC742",
    flowMetal: "#7FB2E8",
    legendTitle: "#FFC742",
    landActive: "#D8C48A",
    landActiveStroke: "#FFC742",
  },
};
