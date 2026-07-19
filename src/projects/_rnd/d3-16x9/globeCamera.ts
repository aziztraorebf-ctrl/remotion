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
export function buildInsertCam(T: Record<string, number>): CamKey[] {
  return [
    // ENTREE : raccord zoom-out depuis le Darfour (match approx derniere frame Mapbox : Soudan plein
    // cadre, tres zoome) -> on prend de l'altitude vers le plan carrefour a mesure que l'or part.
    { frame: T.b3Start, lon: GEO.jebelAmer[0], lat: GEO.jebelAmer[1], scaleMul: 4.4 },
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
