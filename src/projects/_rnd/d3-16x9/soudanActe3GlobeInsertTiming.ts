/**
 * Timing de l'INSERT GLOBE D3 — Soudan Acte 3 "Suivre l'or", beats 3 a 7.
 *
 * L'insert REMPLACE la portion flux [frame 1166 -> 3773] de l'Acte 3 Mapbox (FINAL, validé). La
 * Section 1 (beats 1-2-2bis, interieur Soudan) reste en Mapbox. Le globe entre quand l'or QUITTE le
 * pays (beat 3) et sort a l'ouverture de l'Acte 4 (fin beat 7).
 *
 * On DERIVE du timing Mapbox existant (soudanActe3Timing.ts) en decalant tout de -INSERT_OFFSET pour
 * que l'insert commence a frame 0. L'audio est le MEME fichier continu (acte3-suivre-lor-FULL.mp3), on
 * en joue la portion [1166 -> 3773] => AUCUN re-calage audio a faire (deja resolu par le whisper-align).
 *
 * 30fps. Source des ancrages : soudanActe3Timing.ts (frame-precis, whisper-align v7).
 */

import { FPS, PART_OFFSETS, BEAT3, BEAT4, BEAT5, BEAT5BIS, BEAT6, BEAT7 } from "../../warmap/soudan-acte3/soudanActe3Timing";

export { FPS };

// L'insert commence a BEAT3.start (= PART_OFFSETS.p2 + 0 = 1166) dans le referentiel Mapbox.
export const INSERT_OFFSET = BEAT3.start; // 1166
export const INSERT_FRAMES = BEAT7.end - INSERT_OFFSET; // 3773 - 1166 = 2607 (~86.9s)

// Portion audio a jouer dans l'insert : startFrom = INSERT_OFFSET sur le fichier FULL.
export const AUDIO_START_FROM = INSERT_OFFSET; // startFrom du <Audio> (frames)
export const AUDIO_FULL = "_shared/audio/soudan/acte3-suivre-lor-FULL.mp3";

// Helper : convertit un ancrage Mapbox-absolu en frame relative a l'insert.
const rel = (absFrame: number) => absFrame - INSERT_OFFSET;

// ==== Ancrages relatifs a l'insert (frame 0 = debut du globe) ====
export const T = {
  // BEAT 3 — trajet vers Dubai
  b3Start: rel(BEAT3.start), // 0
  b3DubaiApparait: rel(BEAT3.dubaiApparait),
  b3EmiratsMot: rel(BEAT3.emiratsMot),
  b3PremierImportateur: rel(BEAT3.premierImportateur),
  b3End: rel(BEAT3.end),

  // BEAT 4 — retour drones + transformation
  b4Start: rel(BEAT4.start),
  b4RevientForme: rel(BEAT4.revientForme), // transformation or -> gris-metal a Dubai
  b4AchetentDrones: rel(BEAT4.achetentDrones),
  b4Amnesty: rel(BEAT4.amnesty),
  b4JetonRsfPulse: rel(BEAT4.jetonRsfPulse), // arrivee marqueur, pulse RSF
  b4End: rel(BEAT4.end),

  // BEAT 5 — miroir Turquie/SAF/Suakin
  b5Start: rel(BEAT5.start),
  b5Fournisseur: rel(BEAT5.fournisseur),
  b5TurquieBayraktar: rel(BEAT5.turquieBayraktar), // marqueur entre par le nord (Ankara)
  b5EnEchange: rel(BEAT5.enEchange),
  b5SuakinNomme: rel(BEAT5.suakinNomme), // objet dock Suakin apparait
  b5End: rel(BEAT5.end),

  // BEAT 5bis — or SAF -> Egypte
  b5bisStart: rel(BEAT5BIS.start),
  b5bisVendOrHorsCircuit: rel(BEAT5BIS.vendOrHorsCircuit),
  b5bisRouteNordEgypte: rel(BEAT5BIS.routeNordEgypte), // marqueur discret part vers l'Egypte
  b5bisEnd: rel(BEAT5BIS.end),

  // BEAT 6 — le systeme (4 flux + 3 pays colores ensemble = ce que le globe rend possible)
  b6Start: rel(BEAT6.start),
  b6MemeOrPaie: rel(BEAT6.memeOrPaie), // cadrage elargi, 4 flux visibles
  b6End: rel(BEAT6.end),

  // BEAT 7 — sortie / pont Acte 4
  b7Start: rel(BEAT7.start),
  b7Dubai: rel(BEAT7.dubai),
  b7Ankara: rel(BEAT7.ankara),
  b7PauseAvantQuestion: rel(BEAT7.pauseAvantQuestion), // camera stabilisee
  b7Question: rel(BEAT7.question),
  b7End: rel(BEAT7.end), // = INSERT_FRAMES
};

// ⚠️ Noms propres a l'ecran (whisper corrompu — verifier Wikipedia AVANT render) :
//   "Hemedti" (pas dans l'insert, beat 2bis reste Mapbox) · "Suakin" (transcrit "Swakine").
// ⚠️ R-V5 : chaque objet (Dubai, Suakin, jetons) apparait EXACTEMENT au mot qui le nomme.
