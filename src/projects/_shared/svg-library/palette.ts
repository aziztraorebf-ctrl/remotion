/**
 * Palette canonique "encre/parchemin" — registre narratif + data-viz SVG.
 *
 * Source de vérité unique pour les couleurs utilisées par les protos de recherche
 * src/projects/_rnd/svg-scenes/Proto{DataVizEncre,DataVizPleinEcran,NarratifPlusData}.tsx
 * et par les composants partagés qui en découlent (GridBackground, InkDonutChart,
 * InkBarChart, CounterEncre).
 *
 * Choix figés (valeurs relevées dans les 3 fichiers source au 2026-07-03) :
 * - NARRATIVE_BG = "#16213a" : fond des scènes narratives + personnage (ProtoDataVizEncre,
 *   ProtoCadrages, ProtoDialogueEcran, ProtoFaceAFace, ProtoFaceExpressions, SvgSceneCoin,
 *   JetonsGlmDemo, JetonsQwenDemo) — majorité écrasante (8 fichiers).
 * - DATAVIZ_BG = "#0f1a2e" : fond des scènes data-viz plein écran avec grille
 *   (ProtoDataVizPleinEcran, ProtoNarratifPlusData) — toujours accompagné de GRID_COLOR.
 * - GRID_COLOR = "#1e2d47" : identique dans les 2 fichiers qui en définissent un, aucune variation.
 * - INK = "#2b2117" : identique dans les 3 fichiers, aucune variation.
 * - PARCH = "#e8dcc0" : identique dans les 3 fichiers, aucune variation.
 * - PARCH_DIM : diverge entre "#d4c9a8" (ProtoDataVizEncre, le plus ancien des 3) et
 *   "#b0a58a" (ProtoDataVizPleinEcran + ProtoNarratifPlusData, les 2 plus récents/aboutis).
 *   Valeur canonique retenue = "#b0a58a" (majorité 2/3 + registre le plus qualitatif/récent).
 */

export const NARRATIVE_BG = "#16213a";
export const DATAVIZ_BG = "#0f1a2e";
export const GRID_COLOR = "#1e2d47";
export const INK = "#2b2117";
export const PARCH = "#e8dcc0";
export const PARCH_DIM = "#b0a58a";
