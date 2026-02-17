import { HOOK_TOTAL_FRAMES } from "./hookTiming";

export const FPS = 30;

// ============================================================
// Script V2: "Les Humains Deviennent Fous" (Hook + Seg1 + Seg2)
// Voiceover: voiceover-v2-2min.mp3 (91.04s)
// Silence detection: ffmpeg silencedetect noise=-30dB d=0.4
// ============================================================

// --- Segment boundaries ---

// HOOK: Now driven by hookTiming.ts (7 sub-scenes, ~43s provisional)
export const HOOK_START = 0;
export const HOOK_END = HOOK_TOTAL_FRAMES; // was 510 (17s), now ~1290 (43s)

// SEGMENT 1: Les Flagellants (duration preserved from V2: 31s = 930 frames)
export const SEG1_START = HOOK_END;
export const SEG1_END = SEG1_START + 930;

// SEGMENT 2: Les Boucs Emissaires (duration preserved from V2: 44s = 1320 frames)
export const SEG2_START = SEG1_END;
export const SEG2_END = SEG2_START + 1320;

// Total (will be recalculated when all segments have audio)
export const TOTAL_FRAMES = SEG2_END;

// --- Key voiceover sync cues (frames at 30fps) ---

// Hook cues
export const CUE_1347 = 0; // "1347..."
export const CUE_MOITIE = 60; // ~2.0s "La MOITIE de l'Europe va mourir"
export const CUE_HUMAINS = 210; // ~7.0s "ce que les HUMAINS ont fait"
export const CUE_SCRIPT = 420; // ~14.0s "les reflexes humains suivent un eternel script"

// Segment 1 cues - Flagellants
export const CUE_DIX_MILLE = 570; // ~19.0s "DIX MILLE personnes"
export const CUE_FRERES_CROIX = 690; // ~23.0s "les Freres de la Croix"
export const CUE_STACCATO = 900; // ~30.0s "Trois seances par jour. A genoux. En croix."
export const CUE_LOGIQUE = 1080; // ~36.0s "Leur logique ?"
export const CUE_SPOILER = 1305; // ~43.5s "Spoiler... ca n'a pas marche"
export const CUE_EMPIRE = 1338; // ~44.6s "Ca a meme EMPIRE !"
export const CUE_PROCESSIONS = 1380; // ~46.0s "propageaient la peste encore plus vite"

// Segment 2 cues - Boucs Emissaires
export const CUE_PEUR = 1455; // ~48.5s "Quand les humains ont peur"
export const CUE_BLAMER = 1545; // ~51.5s "ils cherchent quelqu'un a blamer"
export const CUE_RUMEUR = 1590; // ~53.0s "la rumeur se repand"
export const CUE_STRASBOURG = 1710; // ~57.0s "A Strasbourg, le quatorze fevrier 1349"
export const CUE_SAINT_VALENTIN = 1770; // ~59.0s "jour de la Saint-Valentin"
export const CUE_BRULE = 1800; // ~60.0s "on brule deux mille personnes"
export const CUE_MAYENCE = 1890; // ~63.0s "A Mayence... six mille en un seul jour"
export const CUE_POGROMS = 2040; // ~68.0s "plus de trois cents pogroms"
export const CUE_EFFACEES = 2160; // ~72.0s "Des communautes entieres... effacees"
export const CUE_TORDU = 2280; // ~76.0s "Le plus tordu ?"
export const CUE_FAUX = 2370; // ~79.0s "savaient que c'etait faux"
export const CUE_MASSACRE = 2490; // ~83.0s "ont laisse faire le massacre"
export const CUE_DETTES = 2550; // ~85.0s "les dettes ont disparu avec les victimes"

// Transition
export const CROSSFADE_FRAMES = 15;

// Get current segment from frame number
export const getSegment = (frame: number): 0 | 1 | 2 => {
  if (frame < HOOK_END) return 0; // Hook
  if (frame < SEG1_END) return 1; // Flagellants
  return 2; // Boucs Emissaires
};
