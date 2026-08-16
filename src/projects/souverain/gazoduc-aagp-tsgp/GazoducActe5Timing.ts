// GazoducActe5Timing.ts — timing derive de l'audio reel (JAMAIS hardcode a la main).
// Audio: public/souverain/gazoduc-aagp-tsgp/audio/narration-p5.mp3
// Duree mesuree: 46.161270s (ffprobe) | FPS: 30
// Script: memory/episodes/souverain/gazoduc-aagp-tsgp/SCRIPT-V3-VOIX.md (PARTIE 5 — Implication)
//
// Source des timestamps: out/episodes/gazoduc-aagp-tsgp/narration-NEW.alignment.json
// (forced-align ElevenLabs sur la narration COMPLETE concatenee).
// Offset de la Partie 5 dans ce fichier: 470.678844s (= P1 84.567075 + P2 139.005011
// + P3 123.06576 + P4 124.040998). Tous les timestamps ci-dessous sont RELATIFS a
// narration-p5.mp3 (offset deja soustrait).
//
// ⭐ DERNIER ACTE DE L'EPISODE. "CREUSER." a 45.740s est le DERNIER MOT de toute la video :
// il ne reste que 0.42s apres lui. La chute doit donc etre PREPAREE avant, pas posee apres.

export const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);

export const AUDIO_SAFETY_MARGIN_F = 9; // +300ms de hold visuel avant coupe nette de l'Audio
export const TOTAL_SECONDS = 46.161270; // duree mesuree ffprobe, source de verite

export const GAZODUC_A5_FRAMES = S(TOTAL_SECONDS) + AUDIO_SAFETY_MARGIN_F;

// ============================================================================
// ACTE 5 — "Implication" (0 -> 46.16s)
// Frames LOCALES au segment (0 = debut du fichier audio p5).
//
// Structure du texte (3 mouvements naturels) :
//   1. 0    -> 9.3s   L'IMPLICATION — "si vous vous chauffez au gaz... finira sur VOTRE FACTURE"
//                     Le spectateur entre dans le recit. Sortie de l'abstraction geopolitique.
//   2. 9.3  -> 27.0s  L'ENJEU — "qui aura la main sur le prochain grand robinet de l'Europe",
//                     "et surtout selon quel MODELE : financements internationaux ou Etats SOUVERAINS"
//                     C'est le sommet thematique de l'episode (le mot du titre de la chaine).
//   3. 27.0 -> 46.16s LA CHUTE — "personne ne sait lequel ira jusqu'au bout... peut-etre qu'aucun
//                     ne verra jamais la Mediterranee... pendant que certains negocient encore pour
//                     savoir qui va payer, d'autres ont deja commence a CREUSER."
// ============================================================================
export const BEATS_5 = {
  segStart: 0,

  // --- 1. L'IMPLICATION (le spectateur entre) ---
  siVousChauffez: S(1.30),   // "Si vous vous chauffez au gaz" — apres "...a long terme." (fin Acte 4)
  facture: S(9.321),         // "facture." — LE MOT QUI RAMENE TOUT AU SPECTATEUR

  // --- 2. L'ENJEU (sommet thematique) ---
  robinet: S(17.961),        // "robinet" — "qui aura la main sur le prochain grand robinet de l'Europe"
  modele: S(22.061),         // "modèle" — bascule vers le choix de societe
  souverains: S(27.041),     // "SOUVERAINS." (CAPS script) — LE MOT DE LA CHAINE, sommet de l'episode

  // --- 3. LA CHUTE ---
  mediterranee: S(35.501),   // "Méditerranée." — "peut-etre qu'aucun des deux ne la verra jamais"
  payer: S(42.081),          // "payer…" — suspension avant la derniere opposition
  creuser: S(45.740),        // "CREUSER." (CAPS script) — ⭐ DERNIER MOT DE L'EPISODE

  segEnd: S(TOTAL_SECONDS),
};

// ============================================================================
// Validation :
// - Demarre a frame 0. ✔
// - "CREUSER." a 45.740s, soit 0.42s avant la fin de l'audio : la chute se PREPARE avant. ✔
// - Aucun ecart > 8.5s entre 2 ancres (le plus long : facture 9.32 -> robinet 17.96 = 8.6s,
//   a meubler par des evenements intermediaires — regle des 5s d'Aziz). ⚠️
// ============================================================================
