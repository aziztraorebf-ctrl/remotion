// Palette officielle Hannibal — Traversée des Alpes (218 av. J.-C.)
// HYBRIDE : ATLAS_COLORS pour la CARTE (cohérence Ghana/Mansa Moussa)
//         + HANNIBAL_PALETTE pour éléments narratifs (route, compteur, cartouches, decay)
// Registre : militaire, méditerranéen, montagne, guerre punique
// Validée 2026-05-04

export { ATLAS_COLORS } from "../../_shared/atlas-components";

export const HANNIBAL_PALETTE = {
  // ─── FONDS ────────────────────────────────────────────────
  NOIR_GUERRE:    "#0F1A1F",         // background global — nuit de campagne, plus froid que Ghana
  ARDOISE_FOND:   "#1E2D35",         // fond carte secondaire — ardoise méditerranéenne
  BRUME_ALPES:    "#2A3540",         // ellipse zone alpine intérieure
  PIERRE_ALPES:   "#3A4A52",         // ellipse zone alpine extérieure

  // ─── MER MÉDITERRANÉE ─────────────────────────────────────
  MER:            "#1C3D5A",         // Méditerranée — bleu acier profond
  MER_VIF:        "#2A5578",         // reflets eau, rivières, Rhône
  MER_SOMBRE:     "#142D42",         // mer profonde, ombres

  // ─── CARTHAGE (faction Hannibal) ──────────────────────────
  CARTHAGE:       "#8B3A2A",         // rouge punique principal — Carthage, armée
  CARTHAGE_VIF:   "#B54A35",         // accent Carthage, highlights route
  CARTHAGE_SOMBRE:"#5C2218",         // ombre Carthage, zone de perte

  // ─── ROUTE D'HANNIBAL (trait animé) ──────────────────────
  ROUTE:          "#D4A843",         // ambre chaud — route de marche carthaginoise
  ROUTE_GLOW:     "#E8C060",         // glow strokeDashoffset animé
  ROUTE_SOMBRE:   "#8B6E28",         // route passée, segments déjà franchis

  // ─── ROME (faction ennemie) ───────────────────────────────
  ROME:           "#5C3D6E",         // pourpre romain — Rome, menace
  ROME_VIF:       "#7A5290",         // accent romain, pulse danger

  // ─── ALPES (montagne, neige, mort) ────────────────────────
  ALPES_NEIGE:    "#E8E4DC",         // blanc cassé neige — sommets, glace
  ALPES_ROCHE:    "#8A9AA8",         // gris pierre calcaire — parois rocheuses
  ALPES_GLACE:    "#C8D8E4",         // bleu-blanc glace — zone danger

  // ─── COMPTEUR / DECAY (perte soldats) ─────────────────────
  OR_SOLDAT:      "#E6C76E",         // 46 000 soldats au départ — or chaud
  ROUGE_MORT:     "#8B2020",         // 20 000 à l'arrivée — rouge sang
  ELEPHANT_OR:    "#D4A843",         // dernier éléphant survivant — pulse doré

  // ─── TEXTES / UI ──────────────────────────────────────────
  IVOIRE:         "#F2ECD8",         // textes principaux — ivoire méditerranéen
  PARCHEMIN:      "#D8CEB4",         // textes secondaires — parchemin de guerre
  METAL_FROID:    "#8AAAB8",         // labels pays, frontières secondaires

  // ─── CARTOUCHES (inserts, HUD) ────────────────────────────
  CARTOUCHE_FOND:    "#1A2830",      // fond cartouche — presque noir bleuté
  CARTOUCHE_BORD:    "#D4A843",      // bordure ambre — registre "carte de guerre"
  CARTOUCHE_ACCENT:  "#8B3A2A",      // accent Carthage sur cartouche

} as const;

export const HANNIBAL_FONTS = {
  TITRE:   "'Cinzel', 'Cormorant Garamond', serif",   // hooks, titres militaires
  SERIF:   "'Cormorant Garamond', 'EB Garamond', serif",  // narration, labels
  MONO:    "'JetBrains Mono', 'IBM Plex Mono', monospace", // compteur, dates, debug
  KARAOKE: "'Inter', 'Helvetica Neue', sans-serif",   // sous-titres karaoke
} as const;

export const HANNIBAL_TYPO = {
  HOOK:             84,   // hooks plein écran (3 lignes courtes)
  TITRE_SCENE:      56,   // titres de scène
  CARTOUCHE_GRAND:  42,   // cartouches importants
  CARTOUCHE:        28,   // cartouches standards
  LABEL_VILLE:      22,   // labels villes sur carte
  LABEL_PAYS:       26,   // labels pays/empires
  KARAOKE:          48,   // sous-titres karaoke
  COMPTEUR:        120,   // compteur 46 000 → 20 000 (JetBrains Mono)
  DATE:             32,   // dates (218 av. J.-C.)
  ALTITUDE:         28,   // barre altitude "~2 400m"
  FOOTNOTE:         16,   // citations sources, debug
} as const;

export const HANNIBAL_LETTERSPACING = {
  TITRE:     "0.04em",   // hooks
  CARTOUCHE: "0.08em",   // cartouches typo serif
  LABEL:     "0.15em",   // labels villes (espacé)
  KARAOKE:   "0.02em",   // sous-titres lisibles
  MONO:      "0.06em",   // compteur + dates
} as const;
