// Palette officielle Empire du Ghana (Wagadou)
// HYBRIDE : ATLAS_COLORS pour la CARTE (cohérence Mansa Moussa V2)
//         + GHANA_PALETTE pour éléments narratifs (sacs, balance, sceau Mali, routes commerciales)
// Validée 2026-05-03

// Re-export pour usage carte (océan, terre, frontières, empire highlight)
export { ATLAS_COLORS } from "../../_shared/atlas-components";

export const GHANA_PALETTE = {
  // ─── FONDS ────────────────────────────────────────────────
  NOIR_PROFOND: "#1A0D0D",         // background global, sépia très sombre
  SEPIA_FOND: "#2D1810",           // fond carte secondaire
  SABLE_NUIT: "#3A2210",           // ellipse désert intérieur (sable nocturne)
  SABLE_DESERT: "#4A2E15",         // ellipse désert extérieur (visible)
  PARCHEMIN: "#E8DCC0",            // sépia clair (textes secondaires)

  // ─── OR (richesse, royaume, caravanes commerciales) ───────
  OR: "#D4A574",                   // doré principal (POI, frontières royaumes)
  OR_VIF: "#E8B878",               // doré accent (highlights, pulse)
  OR_TERNI: "#8B5E2A",             // doré sobre (labels secondaires)

  // ─── BORDEAUX (alerte, conflit, route, frontière historique) ─
  BORDEAUX_PROFOND: "#4A0E0E",     // routes/frontières d3-geo (recommandation Gemini)
  BORDEAUX: "#7A1F1F",             // pulse alerte, conquêtes
  BORDEAUX_CHAUD: "#A33232",       // climax tragique, effondrement
  ROUGE_SANG: "#5C1A1A",           // gemmes, points critiques

  // ─── BLEUS (commerce berbère, eau, voile touareg) ─────────
  INDIGO: "#2B3A5F",               // robe berbère, voile touareg
  INDIGO_VIF: "#3F5689",           // pulse berbère, fleuves
  BLEU_DESERT: "#1F2E4A",          // ciel nuit Sahara

  // ─── TERRACOTTA (terre cuite, banco, voisins empire) ──────
  TERRACOTTA: "#A0522D",           // terre cuite, voisins Wagadou
  TERRACOTTA_CLAIR: "#C46844",     // accent terre cuite
  OCRE_BOUBOU: "#B8741A",          // robe sahélien

  // ─── BLANCS (sel, mosquée, pierre banco, lumière) ─────────
  BLANC_SEL: "#E8E0D0",            // sacs de sel, lumière mosquée
  BLANC_BANCO: "#D8C8A8",          // murs banco Koumbi Saleh
  BLANC_OS: "#F2EAD3",             // textes principaux

  // ─── GRIS (effondrement, mort, ruines) ────────────────────
  GRIS_RUINE: "#5C5048",           // ruines Koumbi Saleh post-effondrement
  GRIS_CENDRE: "#7A6E66",          // cendres, désaturation territoire perdu
  GRIS_DESATURE: "#8A7E76",        // territoire désaturé sécheresse
} as const;

export const GHANA_FONTS = {
  TITRE: "'Cinzel', 'Cormorant Garamond', serif",   // hooks, big titles
  SERIF: "'Cormorant Garamond', 'EB Garamond', serif",  // narration, labels
  MONO: "'JetBrains Mono', 'IBM Plex Mono', monospace", // chiffres, dates, debug
  KARAOKE: "'Inter', 'Helvetica Neue', sans-serif",  // sous-titres karaoke
} as const;

export const GHANA_TYPO = {
  // Tailles (pour vertical 1080×1920)
  HOOK: 84,           // hooks plein écran
  TITRE_SCENE: 56,    // titres de scène
  CARTOUCHE_GRAND: 42, // cartouches importants
  CARTOUCHE: 28,      // cartouches standards
  LABEL_VILLE: 22,    // labels villes sur carte
  LABEL_PAYS: 26,     // labels pays/empires
  KARAOKE: 48,        // sous-titres karaoke
  CHIFFRE: 78,        // chiffres-records (90kg, 20000)
  DATE: 32,           // dates (1076, 1240)
  FOOTNOTE: 16,       // citations sources, debug
} as const;

// Letter spacing recommandés
export const GHANA_LETTERSPACING = {
  TITRE: "0.04em",    // hooks
  CARTOUCHE: "0.08em", // cartouches typo serif
  LABEL: "0.15em",    // labels villes (espacé)
  KARAOKE: "0.02em",  // sous-titres lisibles
} as const;
