// hookTiming.ts - SCENE_TIMING produit par le storyboarder
// Audio mesure par ffprobe — mise a jour 2026-02-22
// Source: public/audio/peste-pixel/hook/hook_0N_*.mp3 (ElevenLabs Chris, eleven_v3, fr)
// FPS: 30
//
// REGLES DE CONSTRUCTION :
// - startFrame[0] = 0 (hook_00 = nouveau, intro Saint-Pierre)
// - startFrame[N] = startFrame[N-1] + durationFrames[N-1]
// - endFrame[N] = startFrame[N] + durationFrames[N] - 1
// - 30 frames de tail apres hook_07 pour respiration finale
// - TOTAL audio pur = 2138 frames (hook_00 inclus)
// - TOTAL avec tail = 2168 frames

export const FPS = 30;

// Total frames audio pur (sans tail)
export const AUDIO_TOTAL_FRAMES = 2138;

// Total frames avec tail de respiration finale (1.0s)
export const TOTAL_FRAMES = 2168;

// Alias maintenu pour compatibilite avec HookSceneSideView.tsx et timing.ts
export const HOOK_TOTAL_FRAMES = AUDIO_TOTAL_FRAMES;

// ============================================================
// HOOK_SCENES : timing frame-par-frame mesure par ffprobe
// startFrame / durationFrames / endFrame (inclusif)
// hook_00 = NOUVEAU (intro Saint-Pierre, ajout 2026-02-22)
// ============================================================
export const HOOK_SCENES = {
  hook_00_saint_pierre: {
    startFrame: 0,
    durationFrames: 703,
    endFrame: 702,
    audioFile: "hook_00_saint_pierre.mp3",
    durationSec: 23.44,
    preset: "calm",
  },
  hook_01_issyk_kul: {
    startFrame: 703,
    durationFrames: 286,
    endFrame: 988,
    audioFile: "hook_01_issyk_kul.mp3",
    durationSec: 9.52,
    preset: "narrator",
  },
  hook_02_catapulte: {
    startFrame: 989,
    durationFrames: 377,
    endFrame: 1365,
    audioFile: "hook_02_catapulte.mp3",
    durationSec: 12.56,
    preset: "narrator",
  },
  hook_03_galeres: {
    startFrame: 1366,
    durationFrames: 355,
    endFrame: 1720,
    audioFile: "hook_03_galeres.mp3",
    durationSec: 11.84,
    preset: "narrator",
  },
  hook_04_moitie: {
    startFrame: 1721,
    durationFrames: 108,
    endFrame: 1828,
    audioFile: "hook_04_moitie.mp3",
    durationSec: 3.60,
    preset: "dramatic",
  },
  hook_05_reframe: {
    startFrame: 1829,
    durationFrames: 58,
    endFrame: 1886,
    audioFile: "hook_05_reframe.mp3",
    durationSec: 1.92,
    preset: "narrator",
  },
  hook_06_reveal: {
    startFrame: 1887,
    durationFrames: 110,
    endFrame: 1996,
    audioFile: "hook_06_reveal.mp3",
    durationSec: 3.68,
    preset: "dramatic",
  },
  hook_07_reflexes: {
    startFrame: 1997,
    durationFrames: 142,
    endFrame: 2138,
    audioFile: "hook_07_reflexes.mp3",
    durationSec: 4.72,
    preset: "calm",
  },
} as const;

// ============================================================
// Scene indices for readability
// ============================================================
export const SCENE = {
  SAINT_PIERRE: 0,
  ISSYK_KUL:    1,
  CATAPULTE:    2,
  GALERES:      3,
  MOITIE:       4,
  REFRAME:      5,
  REVEAL:       6,
  REFLEXES:     7,
} as const;

// ============================================================
// Tableaux indexes pour consommation par les scenes
// HOOK_SCENE_STARTS[SCENE.REVEAL] = 1887, etc.
// ============================================================
export const HOOK_SCENE_STARTS: [number, number, number, number, number, number, number, number] = [
  0,    // SAINT_PIERRE
  703,  // ISSYK_KUL
  989,  // CATAPULTE
  1366, // GALERES
  1721, // MOITIE
  1829, // REFRAME
  1887, // REVEAL
  1997, // REFLEXES
];

export const HOOK_SCENE_DURATIONS: [number, number, number, number, number, number, number, number] = [
  703,  // SAINT_PIERRE : 23.44s
  286,  // ISSYK_KUL    : 9.52s
  377,  // CATAPULTE    : 12.56s
  355,  // GALERES      : 11.84s
  108,  // MOITIE       : 3.60s
  58,   // REFRAME      : 1.92s
  110,  // REVEAL       : 3.68s
  142,  // REFLEXES     : 4.72s
];

// Duree combinee scenes 1-5 (hook_01 a hook_05) = duree de la carte / texte
// = HOOK_SCENE_STARTS[REFRAME] + HOOK_SCENE_DURATIONS[REFRAME] = 1829 + 58 = 1887
// Utilise pour calculer quand la side-view commence
export const MAP_DURATION = 1887;

// ============================================================
// BLOCS VISUELS (5 blocs SVG, Composition Brief 2026-02-22)
// ============================================================
export const VISUAL_BLOCS = {
  // Bloc A — TopDownVillage (Saint-Pierre, ete 1347, gravure)
  bloc_a_start:  0,
  bloc_a_end:    702,

  // Bloc B — ParcheminMapProto (carte Kirghizistan -> Caffa -> Messine)
  bloc_b_start:  703,
  bloc_b_end:    1365,

  // Transition B->C coupe noire 10f
  cut_b_to_c_start: 1356,
  cut_b_to_c_end:   1365,

  // Bloc C — Galere enluminure -> gravure (feColorMatrix)
  bloc_c_start:  1366,
  bloc_c_end:    1720,

  // Bloc D — Fond parchemin + "50%" typographie choc
  bloc_d_start:  1721,
  bloc_d_end:    1828,

  // Bloc E — 6 archetypes silhouettes + "1347" surimpression
  bloc_e_start:  1829,
  bloc_e_end:    2138,
} as const;

// ============================================================
// HUD COMPTEUR (progression sur toute la duree du Hook)
// interpolate(frame, keyframes, values)
// ============================================================
export const HUD_COMPTEUR_KEYFRAMES = [0, 703, 1366, 1546, 1721, 1736] as const;
export const HUD_COMPTEUR_VALUES    = [0,   5,   20,   35,   48,   50] as const;

// ============================================================
// VISUAL_CUES : frames globaux pour synchronisation animations
// Bases sur les notes narratives du script V3.1
// ============================================================
export const VISUAL_CUES = {

  // --- SCENE 0 : Saint-Pierre (0-702) ---
  // "Thomas rentre des champs" : image d'entree, village vivant
  saint_pierre_open:       0,
  // "Martin dit la messe" : ~4s dans 23.44s
  saint_pierre_martin:     120,
  // "Isaac compte ses pieces" : ~6s
  saint_pierre_isaac:      180,
  // "Guillaume surveille" : ~8s
  saint_pierre_guillaume:  240,
  // "Agnes prepare ses remedes" : ~10s
  saint_pierre_agnes:      300,
  // "[pause] Quant a Renaud" : ~13s (pause V3 = silence audible)
  saint_pierre_renaud:     390,
  // "Dans deux ans" : ~18s, basculement ton
  saint_pierre_deux_ans:   540,
  // "Cette video parle" : ~21s, sortie
  saint_pierre_cta:        630,

  // --- SCENE 1 : Issyk-Kul (703-988) ---
  // "pestilence" : mot grave, tombe vers la fin (~8s dans 9.52s)
  issyk_kul_pestilence:    943,

  // --- SCENE 2 : Catapulte (989-1365) ---
  // Pause avant "catapulter" : pivot dramatique (~7.8s dans 12.56s)
  catapulte_pause_before:  1193,
  // "par-dessus les murs" : fin de scene appuyee (~11s dans 12.56s)
  catapulte_murs:          1319,

  // --- SCENE 3 : Galeres (1366-1720) ---
  // "douze galeres" appuye (~2s dans 11.84s)
  galeres_douze:           1426,
  // Pause apres "quarante-sept" (~6s dans 11.84s)
  galeres_pause_1347:      1546,
  // "deja morts ou mourants" : fin lente
  galeres_morts:           1661,

  // --- SCENE 4 : MOITIE (1721-1828) ---
  // "MOITIE" emphasis : debut de phrase courte (~0.4s dans 3.60s)
  moitie_emphasis:         1736,

  // --- SCENE 5 : REFRAME (1829-1886) ---
  reframe_start:           1829,
  reframe_strikethrough:   1858,

  // --- SCENE 6 : REVEAL (1887-1996) ---
  reveal_sideview_start:   1889,
  // "HUMAINS" emphasis (~1s dans 3.68s)
  reveal_humains_emphasis: 1917,
  // Pause longue avant "quand ils ont cru" (~2.5s dans 3.68s)
  reveal_pause_quand:      1962,
  // "la fin du monde" : fin dramatique
  reveal_fin_du_monde:     1985,

  // --- SCENE 7 : REFLEXES (1997-2138) ---
  reflexes_typewriter_start:  2012,
  reflexes_npc_slowdown:      2068,
  reflexes_npc_fadeout_start: 2082,
  reflexes_npc_fadeout_end:   2125,
  reflexes_encore:            2117,

  // "1347" surimpression (Bloc E, ~70% duree)
  archetypes_1347_appear:     2040,

  // --- TAIL (2139-2168) ---
  tail_start: 2139,
  tail_end:   2168,

} as const;

// ============================================================
// ARCHETYPES entrees progressives (Bloc E)
// enterFrame = HOOK_SCENE_STARTS[REFRAME] + offset (8f par perso)
// ============================================================
export const ARCHETYPE_ENTRIES = {
  pierre:    { enterFrame: 1829, x: 200,  yFeet: 820, label: "Thomas (laboureur)" },
  agnes:     { enterFrame: 1837, x: 520,  yFeet: 820, label: "Agnes (guerisseuse)" },
  martin:    { enterFrame: 1845, x: 840,  yFeet: 820, label: "Martin (pretre)" },
  isaac:     { enterFrame: 1853, x: 1080, yFeet: 820, label: "Isaac (preteur)" },
  guillaume: { enterFrame: 1861, x: 1400, yFeet: 820, label: "Guillaume (seigneur)" },
  renaud:    { enterFrame: 1869, x: 1720, yFeet: 820, label: "Renaud (medecin)" },
} as const;
