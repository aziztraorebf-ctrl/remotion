/**
 * globeCamera — caméra CONTINUE de l'insert globe (une seule projection ortho, jamais de coupe).
 *
 * Principe (doctrine "1 seule Map continue" transposee a D3) : on definit des KEYFRAMES camera
 * {frame, lon, lat, scaleMul} le long du timing des beats, et on interpole EN CONTINU entre eux
 * (lon/lat + scale). La projection ortho est reconstruite chaque frame avec ces valeurs => zero
 * saccade, le globe "vole" d'un point d'interet a l'autre en suivant le recit.
 *
 * scaleMul : multiplicateur du rayon de base GLOBE_R.
 *   ~4.6 = Soudan plein cadre (courbure quasi nulle = "carte rapprochee") — raccord d'entree.
 *   ~2.1 = globe zoome carrefour (Soudan + golfe ~60% cadre, courbure visible) — plan de reference flux.
 *   ~1.5 = dezoom large (voir tout le systeme d'un coup) — beat 6/7.
 *   zoom local ponctuel (x1.8) sur un pays a l'arrivee d'un flux = gere separement (beat-pivot).
 */

import { interpolate } from "remotion";
import { GEO, type LonLat } from "./geoArc";

export interface CamKey {
  frame: number;
  lon: number;
  lat: number;
  scaleMul: number;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Interpole l'etat camera a une frame donnee entre les keyframes (tries par frame croissant).
 * lon/lat/scale lisses par easeInOut sur chaque segment.
 */
export function camAt(keys: CamKey[], frame: number): { lon: number; lat: number; scaleMul: number } {
  if (frame <= keys[0].frame) return { lon: keys[0].lon, lat: keys[0].lat, scaleMul: keys[0].scaleMul };
  const last = keys[keys.length - 1];
  if (frame >= last.frame) return { lon: last.lon, lat: last.lat, scaleMul: last.scaleMul };
  // trouver le segment encadrant
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].frame <= frame) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const raw = (frame - a.frame) / (b.frame - a.frame);
  const e = easeInOut(Math.max(0, Math.min(1, raw)));
  return {
    lon: a.lon + (b.lon - a.lon) * e,
    lat: a.lat + (b.lat - a.lat) * e,
    scaleMul: a.scaleMul + (b.scaleMul - a.scaleMul) * e,
  };
}

// Centre "carrefour" (Soudan <-> golfe) : Dubai ET Ankara sur la face visible.
const CARREFOUR: LonLat = [38, 20];

/**
 * Construit les keyframes camera de l'insert a partir des ancrages de timing (T, relatifs a l'insert).
 * Chaque beat amene son point d'interet au 1er plan, en mouvement continu.
 */
export function buildInsertCam(T: Record<string, number>, startScaleMul = 4.4): CamKey[] {
  return [
    // ENTREE : raccord zoom-out depuis le Darfour (match derniere frame Mapbox : Soudan plein cadre,
    // zoom 5.75). startScaleMul cale le zoom de depart pour matcher la fin de Section 1 -> zoom-out continu.
    { frame: T.b3Start, lon: GEO.jebelAmer[0], lat: GEO.jebelAmer[1], scaleMul: startScaleMul },
    { frame: T.b3EmiratsMot, lon: (GEO.jebelAmer[0] + GEO.dubai[0]) / 2, lat: 22, scaleMul: 2.3 },
    // BEAT 3-4 : plan de reference carrefour, centre pour voir Darfour->Dubai + retour.
    { frame: T.b3End, lon: CARREFOUR[0], lat: CARREFOUR[1], scaleMul: 2.1 },
    { frame: T.b4JetonRsfPulse, lon: CARREFOUR[0], lat: CARREFOUR[1], scaleMul: 2.1 },
    // BEAT 5 : miroir Ankara (nord) -> on remonte legerement le centre pour cadrer la Turquie.
    { frame: T.b5TurquieBayraktar, lon: 35, lat: 26, scaleMul: 1.95 },
    { frame: T.b5SuakinNomme, lon: 37, lat: 22, scaleMul: 2.05 }, // Suakin sur la mer Rouge
    // BEAT 5bis : Egypte (nord) -> centre remonte encore un peu.
    { frame: T.b5bisRouteNordEgypte, lon: 34, lat: 24, scaleMul: 2.0 },
    // BEAT 6 : LE SYSTEME — dezoom large pour voir les 4 flux + 3 pays colores ENSEMBLE
    // (ce que le globe rend possible et que le Mapbox plat interdisait).
    { frame: T.b6MemeOrPaie, lon: 37, lat: 22, scaleMul: 1.5 },
    // BEAT 7 : sortie = RACCORD ZOOM-IN vers le Soudan (miroir de l'entree). La question finale reste
    // sur un plan un peu large (camera qui commence a se recentrer sur le Soudan), PUIS on REPLONGE :
    // scale remonte fort + centre sur le Soudan -> courbure s'aplatit = raccord vers la carte 2D Acte 4.
    { frame: T.b7PauseAvantQuestion, lon: 34, lat: 18, scaleMul: 1.7 }, // recentrage doux vers le Soudan
    { frame: T.b7Question, lon: 31, lat: 15.8, scaleMul: 2.4 }, // la question : on se rapproche
    // fin : replongee finale — Soudan quasi plein cadre, courbure imperceptible (= match carte 2D Acte 4).
    { frame: T.b7End, lon: 30, lat: 15.5, scaleMul: 4.2 },
  ];
}

// ============================================================================================
// ACTE 5 "Le reseau qui arme dans l'ombre" — camera continue du globe INTEGRAL (0 Mapbox).
// Chaine lineaire a 3 maillons : Abou Dabi (~54E) -> est libyen/Kufra (~23E) -> El-Fasher (~13N).
// La camera ne bouge JAMAIS sans cible (correction directe du diagnostic Gemini/Kimi).
// T = ancrages ABSOLUS (frame 0 = debut de l'acte), cf soudanActe5GlobeTiming.ts.
// ============================================================================================

// Centre "carrefour" Beat 2 : tient la Libye ET la peninsule arabique dans l'hemisphere visible
// (les 37deg d'ecart Abou Dabi<->Libye se lisent sur la COURBURE, pas dans le vide plat = le gain globe).
const A5_CARREFOUR: LonLat = [38, 24];
// Centre est-libyen Beat 3 (Benghazi/Kufra au 1er plan) — zoom serre, courbure quasi plate.
const A5_EST_LIBYE: LonLat = [22, 27];
// Centre Soudan/Darfour Beat 4 (arrivee El-Fasher).
const A5_DARFOUR: LonLat = [25, 15];

export function buildActe5Cam(T: Record<string, number>): CamKey[] {
  return [
    // BEAT 1 — pont : ouverture Soudan tres zoome (raccord doux Acte 4, courbure quasi plate).
    { frame: T.b1Start, lon: 30, lat: 15.4, scaleMul: 4.4 },
    // a "elle reste dans l'impasse" : le globe PREND DE L'ALTITUDE et pivote vers la Libye
    // (dezoom + rotation = le mouvement que Mapbox ne pouvait pas faire).
    { frame: T.b1ResteImpasse, lon: 26, lat: 20, scaleMul: 3.2 },
    { frame: T.b1InstalleLibye, lon: GEO.libyaCenter[0], lat: GEO.libyaCenter[1], scaleMul: 2.4 },
    // BEAT 2 — carrefour : Libye + peninsule arabique ensemble (montre la relation EAU->Libye).
    { frame: T.b2EmiratsNommes, lon: A5_CARREFOUR[0], lat: A5_CARREFOUR[1], scaleMul: 2.0 },
    { frame: T.b2CampsEntrainement, lon: A5_CARREFOUR[0], lat: A5_CARREFOUR[1], scaleMul: 2.0 },
    // BEAT 3 — l'intermediaire : zoom+rotation SERRE vers l'est libyen (Benghazi/Kufra au 1er plan).
    { frame: T.b3HaftarNomme, lon: A5_EST_LIBYE[0], lat: A5_EST_LIBYE[1], scaleMul: 3.8 },
    { frame: T.b3Corridor, lon: A5_EST_LIBYE[0], lat: A5_EST_LIBYE[1], scaleMul: 3.8 },
    // BEAT 4 — bouclage : la camera DESCEND avec le corridor (Kufra->El-Fasher, ~11deg de trajet)
    // puis se RESSERRE sur El-Fasher pour l'embrasement, puis DEZOOM LARGE a "Resumons" (3 maillons).
    { frame: T.b4ElFasherNomme, lon: 24, lat: 19, scaleMul: 3.0 }, // suit le milieu du corridor
    { frame: T.b4CombattantsRepere, lon: GEO.elFasher[0], lat: GEO.elFasher[1], scaleMul: 3.8 }, // serre sur l'embrasement
    { frame: T.b4Resumons, lon: 38, lat: 21, scaleMul: 1.55 }, // dezoom large : les 3 maillons ensemble
    // BEAT 5 — cloture : plan stabilise, resserre doucement sur le systeme (pas de dezoom brusque).
    { frame: T.b5Documente, lon: 34, lat: 19, scaleMul: 2.0 },
    { frame: T.b5End, lon: 32, lat: 17, scaleMul: 2.2 },
  ];
}

/**
 * CAMERA ACTE 6 "Pourquoi personne ne l'arrete" (verrou institutionnel).
 *
 * ⚠️ RACCORD EXACT sur la fin de l'Acte 5 : l'Acte 5 finit RE-ZOOME (lon 32, lat 17, scaleMul 2.2,
 * region Soudan). L'Acte 6 DEMARRE sur cet etat PUIS fait un vrai zoom-out narratif vers la vue
 * planetaire (le geste "on s'eloigne du terrain pour chercher les institutions"). Verifie contre le
 * code Acte 5 reel (buildActe5Cam derniere keyframe), pas contre le storyboard (valeurs "0.8->2.5" fausses).
 *
 * Beat 4 (paradoxe) = insert SVG plein ecran : la camera globe est GELEE pendant l'insert (on cross-fade
 * en opacite vers l'insert, le globe ne bouge pas dessous). On la repositionne pour le retour B5.
 */
export function buildActe6Cam(T: Record<string, number>): CamKey[] {
  return [
    // BEAT 1 — raccord Acte 5 (region Soudan, re-zoome) -> zoom-out COURT (2-3s) qui s'ARRETE sur
    // l'Afrique/carrefour Soudan. Retour Aziz : pas de long dezoom sans destination ; on cadre le
    // continent, on se pose, et c'est le B2 (drapeaux voisins un par un) qui remplit, pas le mouvement.
    { frame: T.b1Start, lon: 32, lat: 17, scaleMul: 2.2 }, // = derniere frame Acte 5 (continuite parfaite)
    { frame: T.b1Start + 75, lon: 29, lat: 14, scaleMul: 1.5 }, // ~2.5s : Afrique cadree, Soudan au centre
    // "le vide" — ON NE FIGE PLUS : lente prise d'altitude + glissement doux (le globe RESPIRE pendant que
    // la voix cherche l'arbitre absent). Micro-amplitude, aucun saut narratif ; la dérive de fond (drift,
    // voir composant) s'ajoute par-dessus. Retour Aziz "dosage B6" : mouvement partout, jamais figé.
    { frame: T.b1RienMarche, lon: 30.5, lat: 15, scaleMul: 1.42 }, // recule/glisse imperceptiblement — "on flotte"
    // BEAT 2 — l'UA : camera qui GLISSE lentement vers le carrefour Soudan (les voisins prennent leur drapeau).
    { frame: T.b2UnionAfricaine, lon: 30, lat: 14.5, scaleMul: 1.48 },
    { frame: T.b2Suspendu, lon: 30, lat: 15, scaleMul: 1.62 }, // leger rapproche quand le Soudan se barre (focus centre)
    { frame: T.b2MiseEcart, lon: 30.4, lat: 15.4, scaleMul: 1.68 }, // continue de se resserrer doucement (pas de gel)
    { frame: T.b2End, lon: 30.6, lat: 15.6, scaleMul: 1.7 },
    // BEAT 3 — le veto : dezoom leger + recentrer (vue globe posee pour l'overlay hemicycle par-dessus).
    { frame: T.b3Start, lon: 28, lat: 20, scaleMul: 1.3 },
    { frame: T.b3Novembre, lon: 28, lat: 22, scaleMul: 1.25 }, // globe pose, overlay UI prend le devant
    // overlay vote par-dessus : le globe de fond DERIVE tres lentement (ne fige pas derriere l'hemicycle).
    { frame: T.b3Neutre, lon: 26.5, lat: 22.5, scaleMul: 1.22 },
    { frame: T.b3End, lon: 26, lat: 22.5, scaleMul: 1.22 },
    // BEAT 4 — paradoxe : globe GELE (insert SVG par-dessus en opacite). Meme cadrage que fin B3.
    { frame: T.b4Start, lon: 28, lat: 20, scaleMul: 1.3 },
    { frame: T.b4End, lon: 30, lat: 17, scaleMul: 1.6 }, // repositionne doucement pour le retour B5
    // BEAT 5 — cout humain : retour globe, ZOOM narratif continu sur le Soudan (le mini-zoom qu'Aziz aime).
    { frame: T.b5Start, lon: 30, lat: 16, scaleMul: 1.9 },
    { frame: T.b5TreizeMillions, lon: 29, lat: 14, scaleMul: 2.5 }, // serre sur Darfour/Khartoum (les foyers)
    // hold final : on NE FIGE PLUS — resserrement TRES lent (2.5->2.62) = "on s'enfonce dans le drame".
    { frame: T.b5Cloture, lon: 28.8, lat: 13.8, scaleMul: 2.62 },
    { frame: T.b5End, lon: 28.8, lat: 13.8, scaleMul: 2.62 }, // fige avant fade to black (fin validee intacte)
  ];
}
