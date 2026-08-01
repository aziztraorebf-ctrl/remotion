// timing.ts — Short Soudan (9:16, 1080x1920) — genere par l'agent storyboarder
// Audio: public/_shared/audio/soudan-short/narration-v1-pauses-v2.mp3 | Mesure ffprobe: 111.337506s
// Whisper: src/projects/warmap/shorts/soudan-short/whisper-words-soudan-short.ts (311 mots, 311/311 verifies)
// Script: memory/projects/soudan-short-SCRIPT-V1.md | Version: LOCKED 2026-08-01
// FPS: 30 (format Shorts standard)
//
// ⛔ AUDIO NE DOIT PAS ETRE REGENERE. Ce fichier est une reconstruction COMPLETE a partir de
// l'alignement mot-a-mot mesure — aucune valeur estimee. Toute frame ci-dessous est deduite d'un
// timestamp Whisper reel ou d'un delta de silence mesure entre deux mots consecutifs.
//
// ══════════════════════════════════════════════════════════════════════════════════════════
// ⚠️ SIGNALEMENT — pauses deterministes du script vs silences reels mesures dans l'audio livre
// ══════════════════════════════════════════════════════════════════════════════════════════
// Le brief de production annoncait "2 pauses de 1.0s ajoutees deterministement" (fin Mouvement A
// et fin Mouvement B). L'alignement Whisper reel de narration-v1-pauses-v2.mp3 montre des silences
// DIFFERENTS de 1.0s a ces deux endroits precis :
//   - fin "front" (49.04s) -> debut "Mais" (49.98s)   : silence reel = 0.94s (proche de 1.0s, OK)
//   - fin "main"  (89.38s) -> debut "Pendant" (90.04s) : silence reel = 0.66s (PAS 1.0s — ecart net)
// Un troisieme silence, plus long, existe mais est INTERNE a la Chute (pas a une frontiere de bloc) :
//   - fin "maison" (93.64s) -> debut "ONU" (94.68s) : silence reel = 1.04s
// Et le plus grand silence de tout le fichier se trouve entre la Chute et le CTA :
//   - fin "arrete" (101.12s) -> debut "histoire" (103.18s) : silence reel = 2.06s
// DECISION appliquee (Regle 3 storyboarder — absorber le silence reel dans la scene precedente,
// jamais deviner/forcer une valeur planifiee) : les frontieres de blocs ci-dessous suivent les
// timestamps REELS mesures, pas les 1.0s indiques dans le script. A signaler a Aziz si la duree du
// beat "Pivot" (3.36s) ou du blanc CTA (2.06s) semble trop courte/longue a l'oreille — c'est un
// signal audio a evaluer, pas une erreur de storyboard.
//
// ══════════════════════════════════════════════════════════════════════════════════════════

export const FPS = 30;
export const TOTAL_SECONDS = 111.337506;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS); // 3340

// ── Helper de conversion (memes conventions que Scene5Cta.tsx / Short Senegal D3) ──
export const s2f = (sec: number): number => Math.round(sec * FPS);

// ══════════════════════════════════════════════════════════════════════════════════════════
// SCENES — frontieres ABSOLUES {start, end} en frames ET en secondes. Zero gap garanti :
// scene[n].end === scene[n+1].start (Regle 1 storyboarder).
// ══════════════════════════════════════════════════════════════════════════════════════════

export const SCENES = {
  // 1. MOUVEMENT A — L'or qui paie la guerre
  // "De cette terre sort l'un des metaux... [...] le meme or paie les deux cotes du front."
  // Debut: mot "De" (0.000s). Fin: fin du mot "front" (49.040s) — dernier mot du Mouvement A.
  mouvementA: { start: 0, end: 1471, startSec: 0.000, endSec: 49.040 },

  // 2. PAUSE 1 — silence pur (deterministe cote script, mesure reel = 0.94s)
  // Absorbe integralement le silence entre "front" et "Mais". Aucun mot dans cette fenetre.
  pause1: { start: 1471, end: 1499, startSec: 49.040, endSec: 49.980 },

  // 3. PIVOT — "Mais l'argent ne suffit pas a comprendre pourquoi personne n'a hate cette guerre."
  // Debut: mot "Mais" (49.980s). Fin: debut du mot "Autour" qui ouvre le Mouvement B (53.640s) —
  // PAS la fin du mot "guerre" (53.280s). Le silence naturel de 0.36s entre les deux phrases
  // (53.280s -> 53.640s) est absorbe ICI, dans le Pivot qui vient de se terminer (Regle 3
  // storyboarder : le silence appartient a la scene precedente, jamais un gap non attribue).
  // NOTE: le mot Whisper transcrit "n'a hate" a partir de "n" (52.44s) + "a" (52.68s) + "hate" (52.68-52.84s)
  // — c'est bien "n'arrete" phonetiquement absorbe par Whisper en "n'a hate" (variante de transcription,
  // le sens du script est preserve : "personne n'arrete cette guerre"). Ne pas s'etonner du mot exact.
  pivot: { start: 1499, end: 1609, startSec: 49.980, endSec: 53.640 },

  // 4. MOUVEMENT B — Les parrains et l'impasse
  // "Autour du Soudan, quatre puissances... [...] ...a celui qui l'alimente de l'autre main."
  // Debut: mot "Autour" (53.640s) — zero gap avec la fin du Pivot ci-dessus.
  // Fin: fin du mot "main" (89.380s) — dernier mot du Mouvement B.
  mouvementB: { start: 1609, end: 2681, startSec: 53.640, endSec: 89.380 },

  // 5. PAUSE 2 — silence pur (deterministe cote script, mesure reel = 0.66s — voir signalement en tete)
  pause2: { start: 2681, end: 2701, startSec: 89.380, endSec: 90.040 },

  // 6. CHUTE — "Pendant ce temps, treize millions et demi de personnes ont fui leur maison.
  // L'ONU parle de la pire crise humanitaire de la planete."
  // Debut: mot "Pendant" (90.040s). Fin: debut du mot "Reste" qui ouvre le CTA (97.780s) — PAS la
  // fin du mot "planete" (97.280s). Le silence naturel de 0.5s (97.280s -> 97.780s) est absorbe
  // ICI, dans la Chute qui vient de se terminer (Regle 3 : silence = scene precedente, zero gap).
  // Contient aussi un silence interne de 1.04s entre "maison" (93.640s) et "ONU" (94.680s) — cf. BEATS.
  chute: { start: 2701, end: 2933, startSec: 90.040, endSec: 97.780 },

  // 7. CTA — "Reste a savoir qui a vraiment interet a ce que cette guerre s'arrete. L'histoire
  // complete : le reseau libyen, les six actes du conflit, pourquoi personne n'arrete la guerre —
  // dans la video longue. [Lien en description]"
  // Debut: mot "Reste" (97.780s) — zero gap avec la fin de la Chute ci-dessus.
  // Fin: fin de l'audio mesure (111.337506s), PAS fin du mot "description" (111.140s) — 6 frames de
  // silence de fin restent dans le CTA (queue naturelle post-dernier-mot).
  // ⚠️ TEXTE AFFICHE != TEXTE AUDIO sur la toute fin : l'audio dit "Lien en description" (mots
  // "Lien"/"en"/"description", 110.420s-111.140s) mais Aziz a tranche : NE JAMAIS afficher "en
  // description" a l'ecran pour un Short (pas de lien cliquable en description YouTube Shorts,
  // risque de nuire au reach). Le texte overlay doit dire "VIDEO COMPLETE EN BIO" (pattern deja
  // valide dans Scene5Cta.tsx / CtaCard.tsx) — l'audio N'EST PAS modifie, seul le texte a l'ecran
  // change. Le beat visuel CTA_DESC_TEXT ci-dessous doit afficher "EN BIO", jamais "EN DESCRIPTION".
  cta: { start: 2933, end: 3340, startSec: 97.780, endSec: 111.337506 },
} as const;

export type SceneKey = keyof typeof SCENES;

// ══════════════════════════════════════════════════════════════════════════════════════════
// BEATS — frames-reperes pour le calage des gestes visuels (globe D3, sous-titres, cartouche CTA).
// Chaque frame vient d'un mot reel dans whisper-words-soudan-short.ts — aucune valeur inventee.
// Format : nom du beat -> { frame, sec, mot source, geste attendu }.
// ══════════════════════════════════════════════════════════════════════════════════════════

export const BEATS = {
  // ── MOUVEMENT A : Soudan/Darfour -> Emirats (route de l'or) -> Egypte (2e circuit) ──

  // "au Darfour" — 1ere mention du Darfour. Le globe doit deja etre pose (fade-in fait a la frame 0
  // du montage complet), cadre serre sur le Soudan des l'ouverture. C'est ICI que le pays "Sudan"
  // commence son trace (strokeDasharray) si le trace n'a pas deja demarre plus tot sur "cette terre".
  darfour_1ere_mention: { frame: 146, sec: 4.880, mot: "Darfour" },
  // fin de "Soudan" (contexte "a l'ouest du Soudan") — bonne frame de repos pour que le trace du
  // pays Sudan soit visuellement complet (fill plein) avant d'enchainer sur Hemeti.
  soudan_contexte_fin: { frame: 210, sec: 7.000, mot: "Soudan" },

  // "Hemeti" nomme — Whisper a transcrit "Emeti" (perte du H aspire, artefact phonetique connu,
  // PAS une erreur d'alignement : le mot prononce est bien "Hemeti"). Si un portrait/icone
  // personnage doit apparaitre pour Hemeti, c'est cette frame.
  hemeti_nomme: { frame: 419, sec: 13.980, mot: "Emeti (= Hemeti)" },

  // "mines d'or du Darfour" (2e mention Darfour, dans le contexte controle de Hemeti). Confirme
  // que le trace du Darfour/Soudan doit rester actif/visible a ce moment (pas de nouveau trace,
  // le pays est deja dessine depuis darfour_1ere_mention).
  darfour_2e_mention: { frame: 499, sec: 16.640, mot: "Darfour" },

  // "jusqu'aux Emirats arabes unis" — 1ere mention Emirats. Point de pivot caméra : le globe doit
  // PIVOTER vers les Emirats a partir d'ici (fin du trace Soudan -> debut du pivot camera), puis
  // se POSER pour dessiner le trace du pays "United Arab Emirates" (nom exact dans le geoJSON
  // Natural Earth 110m utilise par globeGeo.ts — verifie present).
  emirats_1ere_mention: { frame: 763, sec: 25.420, mot: "Émirats" },

  // "cet argent revient sous une autre forme" — le flux d'argent inverse (Emirats -> Soudan, drones).
  // Bon repere pour declencher l'arc dore de retour (arcPathD) si le sens du flux doit s'animer.
  argent_revient: { frame: 843, sec: 28.100, mot: "revient" },

  // "vers l'Egypte" — 2e circuit de l'or (armee reguliere). Le globe doit pivoter vers l'Egypte
  // ("Egypt" dans le geoJSON) et tracer ce pays ici — 2e route parallele a celle des Emirats.
  egypte_1ere_mention: { frame: 1243, sec: 41.420, mot: "Égypte" },

  // "le meme or paie les deux cotes du front" — chute du Mouvement A, DERNIER mot avant pause1.
  // C'est la frame de fin du bloc mouvementA (= SCENES.mouvementA.end). Le globe doit etre POSE
  // (pas de pivot) et montrer les 2 arcs (Darfour->Emirats + Darfour->Egypte) simultanement visibles.
  front_fin_mouvementA: { frame: 1471, sec: 49.040, mot: "front" },

  // ── PIVOT ──

  // "Mais l'argent ne suffit pas..." — debut du pivot narratif. Bon repere pour un dezoom du globe
  // (le "champ" narratif s'elargit de la question economique vers la question politique/parrains).
  pivot_debut: { frame: 1499, sec: 49.980, mot: "Mais" },

  // ── MOUVEMENT B : les 4 puissances (Russie / Turquie / Egypte / Emirats) ──

  // "Autour du Soudan, quatre puissances etrangeres" — reprise du Soudan comme sujet central avant
  // d'enumerer les 4 parrains. Bon repere pour re-cadrer serre sur le Soudan avant le dezoom vers
  // les 4 puissances (miroir du mouvement d'ouverture du Mouvement A).
  autour_soudan_debut_B: { frame: 1609, sec: 53.640, mot: "Autour" },

  // "la Russie" — 1ere des 4 puissances enumerees. Globe pivote vers "Russia" (geoJSON) + trace.
  russie_1ere_mention: { frame: 1821, sec: 60.700, mot: "Russie" },

  // "la Turquie" — 2e puissance enumeree. Pivot vers "Turkey" (geoJSON) + trace.
  turquie_mention: { frame: 1868, sec: 62.260, mot: "Turquie" },

  // "l'Egypte" — 3e puissance enumeree (2e mention Egypte du Short, la 1ere etait au Mouvement A
  // pour le circuit de l'or armee reguliere — meme pays, contexte different, le trace existe deja
  // si le pays est reste dans le champ, sinon retrace/pivot).
  egypte_2e_mention: { frame: 1895, sec: 63.180, mot: "Égypte" },

  // "les Emirats arabes unis" — 4e puissance enumeree (2e mention Emirats du Short). Cloture
  // l'enumeration des 4 parrains : ici le dezoom doit montrer les 4 pays + le Soudan simultanement.
  emirats_2e_mention: { frame: 1913, sec: 63.780, mot: "Émirats" },

  // "En 2024" — bascule vers l'episode ONU/veto. Pas de geste camera necessairement, mais bon
  // repere temporel si un insert graphique (texte "2024", icone ONU) doit apparaitre.
  annee_2024: { frame: 1978, sec: 65.940, mot: "2024" },

  // "La Russie vote contre" — 2e mention Russie, moment du veto. Bon repere pour un highlight
  // visuel sur le pays Russia (pulse rouge, icone veto) — distinct du trace initial (russie_1ere_mention).
  russie_vote_contre: { frame: 2200, sec: 73.340, mot: "Russie" },

  // "Un seul veto suffit a tout bloquer" — fin de la sequence ONU/veto.
  veto_bloque: { frame: 2267, sec: 75.560, mot: "veto" },

  // "il y a les Emirats" — 3e mention Emirats, positionnement a la table des negociations de paix
  // (contradiction : mediateur ET financeur). Bon repere pour un geste visuel distinct (ex: icone
  // "table de negociation" superposee au pays Emirats deja trace).
  emirats_table_paix: { frame: 2426, sec: 80.860, mot: "Émirats" },

  // "Les memes Emirats" — 4e mention Emirats, insistance du script sur la contradiction. Repere
  // pour renforcer visuellement le highlight commence a emirats_table_paix (ex: pulse plus intense,
  // ou texte "MEME PAYS" qui apparait bref).
  emirats_memes: { frame: 2482, sec: 82.740, mot: "Émirats" },

  // "On demande d'eteindre l'incendie a celui qui l'alimente de l'autre main" — climax du
  // Mouvement B, dernier temps fort avant pause2. Bon repere pour un geste visuel fort (ex: les 2
  // arcs Emirats<->Soudan qui pulsent simultanement, symbolisant les 2 mains).
  climax_incendie_main: { frame: 2681, sec: 89.380, mot: "main" },

  // ── CHUTE ──

  // "Pendant ce temps" — debut de la Chute, sortie de la pause2. Rupture de rythme voulue (le
  // script demande une Chute VOLONTAIREMENT LENTE, peu de mots). Bon repere pour ralentir/arreter
  // tout mouvement de camera : le globe doit etre immobile jusqu'a la fin du beat.
  pendant_debut_chute: { frame: 2701, sec: 90.040, mot: "Pendant" },

  // silence interne de 1.04s dans la Chute — entre "maison" (fin du 1er fait, deplaces) et "ONU"
  // (debut du 2e fait, crise humanitaire). Repere utile si un insert chiffre ("13,5 millions")
  // doit rester affiche pendant ce blanc avant que le texte change vers la mention ONU.
  maison_fin_1er_fait: { frame: 2809, sec: 93.640, mot: "maison" },
  onu_debut_2e_fait: { frame: 2840, sec: 94.680, mot: "ONU" },

  // "de la planete" — dernier mot de la Chute (= SCENES.chute.end).
  planete_fin_chute: { frame: 2918, sec: 97.280, mot: "planète" },

  // ── CTA ──

  // "Reste a savoir..." — debut du CTA, question ouverte. Repere pour amorcer la transition vers
  // le cartouche final (pattern Scene5Cta.tsx : la scene precedente s'estompe ici).
  cta_debut_question: { frame: 2933, sec: 97.780, mot: "Reste" },

  // "L'histoire complete" — pop du cartouche CTA (pattern F_CARD_IN de Scene5Cta.tsx). Gap de
  // 2.06s avant ce mot (le plus grand silence du fichier) — laisse le temps a la question de
  // "reste a savoir..." de respirer avant que le cartouche n'apparaisse.
  cta_cartouche_pop: { frame: 3095, sec: 103.180, mot: "histoire" },

  // 3 accroches du cartouche (pattern accroche(txt, opv) de Scene5Cta.tsx) — reprennent ce que
  // le Short NE montre PAS (cf. script) : reseau libyen / six actes / pourquoi personne n'arrete.
  cta_accroche_1_reseau_libyen: { frame: 3128, sec: 104.260, mot: "réseau" },
  cta_accroche_2_six_actes: { frame: 3162, sec: 105.400, mot: "six" },
  // "Pourquoi personne n'arrete la guerre" cite entre guillemets dans le script — debut au
  // guillemet ouvrant (frame du mot "«"), le texte utile commence au mot "Pourquoi" juste apres.
  cta_accroche_3_pourquoi: { frame: 3210, sec: 107.000, mot: "Pourquoi" },

  // "dans la video longue" — debut du bloc final avant le texte overlay "EN BIO".
  cta_video_longue: { frame: 3272, sec: 109.060, mot: "vidéo" },

  // ⚠️ Repere audio SEULEMENT — ne pas afficher ce texte a l'ecran (cf. note SCENES.cta ci-dessus).
  // Le mot "Lien" demarre ici dans l'AUDIO ; le texte affiche doit dire "VIDEO COMPLETE EN BIO"
  // et peut deja etre visible depuis cta_video_longue (frame 3272) — ce repere sert seulement a
  // remotion-composer pour ne PAS caler un texte "en description" sur ce timestamp.
  audio_seulement_lien_description: { frame: 3313, sec: 110.420, mot: "Lien (AUDIO ONLY — ne pas afficher)" },
} as const;

export type BeatKey = keyof typeof BEATS;

// ══════════════════════════════════════════════════════════════════════════════════════════
// SEQUENCE GEOGRAPHIQUE — ordre d'apparition des pays sur le globe D3, pour reference directe
// par remotion-composer lors du calage de GlobeRecitProto (ou son adaptation Short 9:16).
// Noms Natural Earth 110m VERIFIES presents dans public/_rnd/vox-repro/countries-110m.json :
// "Sudan", "United Arab Emirates", "Egypt", "Russia", "Turkey" (+ "Libya", "France" en reserve).
// ══════════════════════════════════════════════════════════════════════════════════════════

export const GEO_SEQUENCE = [
  { pays: "Sudan", frameApparition: BEATS.darfour_1ere_mention.frame, contexte: "sujet, cadre serre d'ouverture" },
  { pays: "United Arab Emirates", frameApparition: BEATS.emirats_1ere_mention.frame, contexte: "Mouvement A — route de l'or (destination)" },
  { pays: "Egypt", frameApparition: BEATS.egypte_1ere_mention.frame, contexte: "Mouvement A — 2e circuit (armee reguliere)" },
  { pays: "Russia", frameApparition: BEATS.russie_1ere_mention.frame, contexte: "Mouvement B — 1ere des 4 puissances" },
  { pays: "Turkey", frameApparition: BEATS.turquie_mention.frame, contexte: "Mouvement B — 2e des 4 puissances" },
  // Egypt et UAE reapparaissent dans le Mouvement B (egypte_2e_mention, emirats_2e_mention) — deja
  // traces depuis le Mouvement A si le globe ne s'est jamais completement recadre entre-temps.
] as const;

// ══════════════════════════════════════════════════════════════════════════════════════════
// VALIDATION (verifiee a la production de ce fichier — tous les silences inter-blocs sont
// absorbes dans la scene PRECEDENTE, conformement a la Regle 3 storyboarder. Zero gap reel.)
// ══════════════════════════════════════════════════════════════════════════════════════════
// - Premiere scene demarre a frame 0. ✓ (SCENES.mouvementA.start = 0)
// - Derniere scene finit a TOTAL_FRAMES. ✓ (SCENES.cta.end = 3340 = TOTAL_FRAMES)
// - Zero gap entre scenes consecutives, chaque .end === le .start suivant :
//     mouvementA.end (1471) === pause1.start (1471)      ✓
//     pause1.end     (1499) === pivot.start   (1499)     ✓
//     pivot.end       (1609) === mouvementB.start (1609)  ✓ (silence 0.36s absorbe dans pivot)
//     mouvementB.end (2681) === pause2.start  (2681)     ✓
//     pause2.end      (2701) === chute.start   (2701)     ✓
//     chute.end        (2933) === cta.start     (2933)     ✓ (silence 0.5s absorbe dans chute)
// - Aucune scene < 30 frames (1s) SAUF pause1 (28f) et pause2 (20f), micro-beats de silence
//   INTENTIONNELS voulus par le script (exception documentee, pas une erreur — cf. signalement
//   en tete de fichier sur l'ecart 1.0s planifie vs silence reel mesure).
// - FPS constant present. ✓
// - Aucun beat de BEATS n'a ete invente : chaque frame provient d'un timestamp reel de
//   whisper-words-soudan-short.ts, verifie individuellement (voir script Python de production).
