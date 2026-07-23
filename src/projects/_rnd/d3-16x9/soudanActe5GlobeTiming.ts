/**
 * Timing GLOBE D3 — Soudan Acte 5 "Le réseau qui arme dans l'ombre" (80.1s @30fps = 2400 frames).
 *
 * L'Acte 5 est en globe INTÉGRAL (0 Mapbox, décision Aziz 2026-07-19) : une seule projection ortho
 * continue sur les 5 beats. Ce fichier RÉEXPORTE le timing frame-exact déjà validé (dérivé du
 * forced-alignment ElevenLabs, cf soudanActe5Timing.ts) — on ne recalcule RIEN, on aplatit juste les
 * ancrages en un objet T plat (référentiel = fichier audio FULL, frame 0 = début de l'acte).
 *
 * Audio = le fichier concat FULL (acte5-reseau-ombre.mp3), joué en entier depuis frame 0 (pas de
 * startFrom : l'Acte 5 globe REMPLACE tout, ce n'est pas un insert dans un hôte comme l'Acte 3).
 *
 * Source des ancrages : ../../warmap/soudan-acte5/soudanActe5Timing.ts (DO NOT DUPLICATE les valeurs).
 */
import {
  FPS,
  TOTAL_FRAMES,
  BEAT1,
  BEAT2,
  BEAT3,
  BEAT4,
  BEAT5,
} from "../../warmap/soudan-acte5/soudanActe5Timing";

export { FPS };

// ── RE-TIMING PAUSES v2 (passe finale polish 2026-07-22) ──────────────────────────────
// L'assemblage joue désormais l'audio acte5-reseau-ombre-v4pauses.mp3 (76.50s, -3.61s NET vs
// l'original 80.11s — cf scripts/tools/soudan-audio/acte5-pauses-v2.json). 4 cuts, dont le RETRAIT
// COMPLET du mot "Résumons." (cut_s=57.86 "...terrain." -> resume_s=61.719 "Un financement émirati",
// remplacé par un micro-silence sil_s=0.25s). La méthode "pauses-sur-original" SUPPRIME le gap naturel
// (cut_s→resume_s) et le remplace par sil_s : décalage d'un jalon = +30*(sil_s - gap_naturel) cumulé
// pour toutes les pauses AVANT lui. Ici le retrait du mot domine (-3.55s à lui seul) -> net total -3.61s.
// ⚠️ Le jalon `b4Resumons` ne peut PLUS se caler sur le mot "Résumons" (disparu) : il est repositionné
// sur le début du mot suivant "Un" (financement émirati), qui tombe exactement à cut_s+sil_s=58.11s
// dans le nouvel audio (calcul DIRECT, plus fiable que la formule indirecte basée sur l'ancien whisper).
// Validé par calcul (session 2026-07-22) : b5End formule = frame 2295, EXACTEMENT égal à la mesure
// ffprobe réelle (76.4998s = frame 2295) — convergence confirmée.
// La version Mapbox (SoudanActe5.tsx) garde l'audio ORIGINAL et le timing source non re-timé — on
// n'applique le décalage QUE dans ce fichier globe (celui de l'assemblage).
const PAUSES: { cutF: number; netF: number }[] = [
  { cutF: Math.round(16.06 * FPS), netF: Math.round((1.3 - (17.42 - 16.06)) * FPS) }, // net -0.06s (-2f)
  { cutF: Math.round(36.32 * FPS), netF: Math.round((0.9 - (37.10 - 36.32)) * FPS) }, // net +0.12s (+4f)
  { cutF: Math.round(57.86 * FPS), netF: Math.round((0.25 - (61.719 - 57.86)) * FPS) }, // RETRAIT "Résumons." : net -3.61s (-108f)
  { cutF: Math.round(73.46 * FPS), netF: Math.round((1.1 - (74.62 - 73.46)) * FPS) }, // net -0.06s (-2f)
];
const reTime = (f: number): number =>
  f + PAUSES.reduce((acc, p) => acc + (p.cutF < f ? p.netF : 0), 0);

const NET_TOTAL = PAUSES.reduce((a, p) => a + p.netF, 0);
export const A5_GLOBE_FRAMES = 2295; // mesure ffprobe réelle (76.4998s @30fps) — priorité sur le calcul formule (2400+NET_TOTAL≈2292, écart 3f négligeable)

export const AUDIO_FULL = "_shared/audio/soudan/acte5-reseau-ombre-v4pauses.mp3";

// Ancrages absolus (frame 0 = début de l'acte), RE-TIMÉS via reTime() pour l'audio pauses v2.
const T0 = {
  // BEAT 1 — pose de la chaîne (pont Acte 4 → Libye)
  b1Start: BEAT1.start,
  b1ResteImpasse: BEAT1.resteImpasse, // dézoom/pivot amorcé, globe prend de l'altitude vers la Libye
  b1CircuitExterieur: BEAT1.circuitExterieur,
  b1GolfeFinance: BEAT1.golfeFinance,
  b1InstalleLibye: BEAT1.installeLibye, // territoire libyen neutre → actif (parchemin)
  b1End: BEAT1.end,

  // BEAT 2 — maillon 1 : qui finance (Émirats / enquête)
  b2Start: BEAT2.start,
  b2EmiratsNommes: BEAT2.emiratsNommes, // point Abou Dabi s'allume + drapeau EAU, arc EAU→Libye
  b2DateEnquete: BEAT2.dateEnquete,
  b2SourcesNommees: BEAT2.sourcesNommees, // tampon presse Lighthouse/Der Spiegel
  b2CampsEntrainement: BEAT2.campsEntrainement, // 1 seul jeton camp (max 1, contrainte factuelle)
  b2End: BEAT2.end,

  // BEAT 3 — maillon 2 : l'intermédiaire (Haftar / corridor)
  b3Start: BEAT3.start,
  b3HaftarNomme: BEAT3.haftarNomme, // teinte de contrôle est-libyen (Benghazi/Kufra), PAS de drapeau national
  b3RapportOnu: BEAT3.rapportOnu, // tampon ONU
  b3DateRapport: BEAT3.dateRapport,
  b3Corridor: BEAT3.corridor, // trait corridor Kufra→El-Fasher COMMENCE (arc, 1 seule trajectoire continue)
  b3Armes: BEAT3.armes, // pulse 1/3
  b3Carburant: BEAT3.carburant, // pulse 2/3
  b3Combattants: BEAT3.combattants, // pulse 3/3
  b3End: BEAT3.end,

  // BEAT 4 — maillon 3 : la chaîne se boucle (El-Fasher)
  b4Start: BEAT4.start,
  b4ElFasherNomme: BEAT4.elFasherNomme, // le MÊME arc (suspendu à 55%) reprend et termine
  b4SiegeVille: BEAT4.siegeVille,
  b4CombattantsRepere: BEAT4.combattantsRepere, // EMBRASEMENT FORT El-Fasher (halo + onde + impact marker)
  b4End: BEAT4.end,

  // BEAT 5 — clôture, pont vers l'Acte 6
  b5Start: BEAT5.start,
  b5Documente: BEAT5.documente, // traits/points se figent (nom→persiste : la chaîne reste tracée)
  b5EtPourtant: BEAT5.etPourtant, // El-Fasher SEUL continue de pulser (contraste figé/vivant)
  b5ContinueFonctionner: BEAT5.continueFonctionner,
  b5Institutions: BEAT5.institutions, // vignette périphérique = pont Acte 6
  b5End: BEAT5.end,
};

// T = T0 re-timé jalon par jalon (décalage cumulatif net des pauses AVANT chaque jalon), SAUF b4Resumons
// qui est recalé DIRECTEMENT (mot supprimé, la formule indirecte basée sur l'ancien mot n'a plus de sens).
export const T = {
  ...(Object.fromEntries(
    Object.entries(T0).map(([k, v]) => [k, reTime(v)])
  ) as { [K in keyof typeof T0]: number }),
  // "Résumons." retiré (décision Aziz) : le jalon marque désormais le début de "Un financement émirati"
  // (le texte restant après le retrait), qui tombe exactement à cut_s+sil_s = 58.11s dans le nouvel audio.
  b4Resumons: Math.round(58.11 * FPS), // = frame 1743
};

// ⚠️ Noms propres à l'écran (vérifier orthographe Wikipédia AVANT render, jamais dériver du whisper) :
//   "Abou Dabi", "Benghazi", "El-Fasher". Le nom "Kufra" reste un repère visuel discret (non affiché
//   en gros — c'est le point de départ du corridor, pas un label narratif majeur).
