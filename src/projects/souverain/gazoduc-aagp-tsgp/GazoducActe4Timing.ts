// GazoducActe4Timing.ts — timing derive de l'audio reel (JAMAIS hardcode a la main).
// Audio: public/souverain/gazoduc-aagp-tsgp/audio/narration-p4.mp3
// Duree mesuree: 124.040998s (ffprobe) | FPS: 30
// Script: memory/episodes/souverain/gazoduc-aagp-tsgp/SCRIPT-V3-VOIX.md (PARTIE 4)
//
// Source des timestamps: out/episodes/gazoduc-aagp-tsgp/narration-NEW.alignment.json
// (forced-align ElevenLabs sur la narration COMPLETE concatenee, 2105 mots).
// Offset de la Partie 4 dans ce fichier: 346.637846s (= P1 84.567075 + P2 139.005011 + P3 123.06576).
// Tous les timestamps ci-dessous sont RELATIFS a narration-p4.mp3 (offset deja soustrait).
//
// Convention identique aux Actes 2 et 3: segments montes bout a bout, jamais un fichier
// monolithique (cf DOCTRINE-SOUVERAIN.md). Marge de securite audio identique (+9f/300ms).

export const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);

export const AUDIO_SAFETY_MARGIN_F = 9; // +300ms de hold visuel avant coupe nette de l'Audio
export const TOTAL_SECONDS = 124.040998; // duree mesuree ffprobe, source de verite

// ===== Frontieres des 3 mouvements — zero gap, silences absorbes dans le segment PRECEDENT =====
//
// 4A/4B: "...la simple vente de gaz." se termine a 41.081s, "Pour le Maroc," ouvre a 41.102s.
// La frontiere tombe donc a 41.102s (le silence de 21ms appartient a 4A).
//
// 4B/4C: "...par l'Atlantique." ferme le mouvement des objectifs opposes; "Le probleme de ce
// bras de fer, c'est le calendrier." (78.402s pour "calendrier.") ouvre 4C sur le retournement.
// Frontiere posee AVANT "Le probleme" — voir SEGMENTS ci-dessous.

export const SEGMENTS = {
  A_ressourceUnique: { start: 0, end: S(41.102), startSec: 0.0, endSec: 41.102 },
  B_objectifsOpposes: { start: S(41.102), end: S(74.5), startSec: 41.102, endSec: 74.5 },
  C_calendrierRetourne: { start: S(74.5), end: S(TOTAL_SECONDS), startSec: 74.5, endSec: TOTAL_SECONDS },
};

export const GAZODUC_A4_SEGA_FRAMES = (SEGMENTS.A_ressourceUnique.end - SEGMENTS.A_ressourceUnique.start) + AUDIO_SAFETY_MARGIN_F;
export const GAZODUC_A4_SEGB_FRAMES = (SEGMENTS.B_objectifsOpposes.end - SEGMENTS.B_objectifsOpposes.start) + AUDIO_SAFETY_MARGIN_F;
export const GAZODUC_A4_SEGC_FRAMES = (SEGMENTS.C_calendrierRetourne.end - SEGMENTS.C_calendrierRetourne.start) + AUDIO_SAFETY_MARGIN_F;

// ============================================================================
// MOUVEMENT 4A — "Une ressource, deux tuyaux" (0 -> 41.102s)
// Frames LOCALES au segment (0 = debut du fichier audio p4).
//
// Storyboard verrouille (choix Aziz 2026-08-15), image de reference:
//   memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/gazoduc-carte-storyboard-ref/
//   acte4-4A/4A-v2-gpt.png
// Breakdown technique: memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/4A-breakdown.json
//   - OUVERTURE = panneau 1 + vocabulaire d'animation du panneau 3 (impulsions + pulse source)
//   - PIC       = panneau 2 (insert coupe de conduite, voile 0.40, "~70%" = SEUL chiffre du beat)
//   - VERDICT   = panneau 4 (sobre, carte durablement affaiblie, aucun insert)
//
// ⚠️ Le breakdown JSON raisonne sur 540 frames (18s) — ce fichier RECALE ses proportions sur les
// 41.1s reelles. Ne pas reprendre ses numeros de frame bruts.
// ============================================================================
export const BEATS_4A = {
  segStart: 0,

  // --- OUVERTURE ---
  hookStart: S(0.122), // "On pourrait se dire :" — la carte s'installe, source Nigeria s'allume
  pourquoiPasLesDeux: S(2.342), // "pourquoi ne pas construire les deux ?" — les 2 traces se dessinent
  surLePapier: S(5.202), // "Sur le papier, cela a l'air simple." — les 2 traces coexistent, plein debit
  maisSelonEtudes: S(7.562), // "Mais selon des etudes recentes..." — bascule, la camera se resserre
  nigeriaNaPasCapacite: S(11.142), // "le Nigeria n'a tout simplement pas la capacite" — pivot narratif
  capaciteMot: S(13.382), // "capacite" (mot long, 1.14s) — les impulsions COMMENCENT a s'affamer ici
  remplirLesDeux: S(15.362), // "ces deux gazoducs en meme temps." — les 2 traces tirent visiblement

  // --- MONTEE VERS LE PIC ---
  silsVoyaient: S(18.382), // "S'ils voyaient tous les deux le jour," — respiration avant le coup
  siphonneraient: S(20.722), // "siphonneraient" — le voile commence a monter
  presDe: S(22.662), // "pres de" — l'insert entre

  // --- LE PIC (le seul chiffre du beat) ---
  soixanteDixStart: S(23.622), // "SOIXANTE-DIX" (CAPS script) — le badge "~70%" apparait ICI
  pourCentEnd: S(25.482), // fin de "CENT"
  productionNigeriane: S(25.842), // "de la production nigerianne."
  nigerianeEnd: S(27.122), // fin de phrase — DEBUT du silence de 1.16s
  silenceApresClimax: S(28.282), // fin du silence ("En" reprend) — le pic RESPIRE dans ce trou

  // --- VERDICT ---
  enClair: S(28.282), // "En clair :" — l'insert commence a se retirer
  pasComplementaires: S(30.562), // "ne sont pas complementaires." (mot long 1.58s) — verdict pose
  seBattentPour: S(32.202), // "Ils se battent pour une meme ressource limitee."
  ressourceLimiteeEnd: S(36.082), // fin de "limitee." — carte sobre, durablement changee
  enjeuDepasse: S(36.162), // "Et l'enjeu depasse largement la simple vente de gaz." — pont vers 4B
  segEnd: S(41.102), // fin du contenu narratif A (avant AUDIO_SAFETY_MARGIN_F)
};

// ============================================================================
// MOUVEMENT 4B — "Objectifs opposes" (41.102 -> 74.5s) — pas encore storyboarde
// ============================================================================
export const BEATS_4B = {
  segStart: 0,
  marocStart: S(0.0), // 41.102s absolu — "Pour le Maroc, ce gazoduc est l'outil geopolitique ultime."
  rabatPassage: S(7.32), // 48.422s absolu — "Rabat devient le point de passage indispensable"
  algerieInverse: S(23.68), // 64.782s absolu — "monopole" historique a proteger
  contournee: S(29.56), // 70.662s absolu — "d'etre contournee par un trace qui passe par l'Atlantique"
  segEnd: S(33.398),
};

// ============================================================================
// MOUVEMENT 4C — "Le calendrier se retourne" (74.5 -> 124.04s) — pas encore storyboarde
// ============================================================================
export const BEATS_4C = {
  segStart: 0,
  calendrier: S(3.902), // 78.402s absolu — "c'est le calendrier."
  gazRusse: S(10.122), // 84.622s absolu — "remplacer le gaz russe"
  enterrerMilliards: S(20.542), // 95.042s absolu — "enterrer des dizaines de milliards"
  sableOuMer: S(24.242), // 98.742s absolu — "dans le sable ou sous la mer"
  declinerDemande: S(29.842), // 104.342s absolu — "la demande [...] va, elle, decliner"
  baisserDIci2030: S(38.102), // 112.602s absolu — "vouee a baisser d'ici deux mille trente."
  retrecit: S(42.562), // 117.062s absolu — "Un marche qui RETRECIT," (CAPS script)
  unSeulSuffirait: S(47.062), // 121.562s absolu — "un seul de ces deux tuyaux suffirait"
  segEnd: S(49.541),
};

// ============================================================================
// Validation (a relancer si l'audio est regenere) :
// - 4A demarre a frame 0. ✔
// - Zero gap : A.end === B.start === S(41.102) ; B.end === C.start === S(74.5). ✔
// - C.end === S(TOTAL_SECONDS), borne sur la duree ffprobe reelle. ✔
// - Aucun segment < 30f. ✔
// ============================================================================
