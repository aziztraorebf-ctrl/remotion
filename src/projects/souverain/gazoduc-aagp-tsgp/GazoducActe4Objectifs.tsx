// MOTEUR: SVG (insert, 7.3->17.5s) + CARTOGRAPHIE D3 (ouverture et chute) — registres DIFFERENTS
// pour deux intentions opposees, choix explicite d'Aziz : une AMBITION (gain) et une PEUR (perte) ne
// se dessinent pas dans la meme langue. Le beat precedent (4A) etait porte par des traces animes ;
// ici le trace ne fait que la CONTINUITE, il ne porte plus l'idee.
//
// GazoducActe4Objectifs — Acte 4, MOUVEMENT B : "objectifs opposes" (41.102 -> 74.5s absolu, 33.4s).
//
// STRUCTURE VALIDEE PAR AZIZ (2026-08-15), mix de 2 storyboards + 1 insert code :
//   1. 0 -> 5.8s      CARTE connue, les 2 traces (continuite directe avec la fin de 4A).
//   2. 7.32 -> 17.5s  INSERT SVG "LEVIER DE POUVOIR" — concept Gemini, EXECUTE par Fable 5 (le seul
//                     des 3 modeles a avoir resolu le probleme CONCEPTUEL : le flux passe PAR le
//                     pivot, au lieu d'equilibrer deux poids). Source : _rnd/svg-scenes/
//                     LevierPouvoirFable.tsx (groupes nommes, pivot documente a 960,470).
//   3. 17.56 -> 29.5s RETOUR CARTE : le centre de gravite se deplace vers le Maroc, PUIS l'Algerie
//                     s'AFFIRME (elle montre ce qu'elle detient) — la chute n'existe que si on a vu
//                     ce qui est perdu (decision Aziz).
//   4. 29.56 -> fin   "CONTOURNEE" : l'Algerie vire au rouge, la route atlantique l'evite.
//
// ⛔ REGLE DE LISIBILITE (exigence Aziz, non negociable) : "compréhensible en moins de 2 secondes".
// Chaque element apparait AU MOMENT OU LE MOT LE NOMME, jamais avant — le spectateur ne decouvre
// jamais deux choses a la fois. Tous les timings ci-dessous viennent du forced-align REEL
// (narration-NEW.alignment.json), pas d'une estimation : voir BEATS_4B_MOTS.
//
// Briques REUTILISEES (jamais recodees) : helpers geo/camera + palette de GazoducActe4RessourceUnique
// (meme acte, meme palette sombre adoptee 2026-08-15) ; insert SVG de LevierPouvoirFable.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import geoData from "../../_rnd/d3-16x9/gazoducGeoElargie.json";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

// Palette sombre — identique a 4A (adoptee par Aziz 2026-08-15, source PAL_GPT).
const BG_TOP = "#0d1f38";
const BG_BOT = "#050c1a";
const LAND = "#16304f";
const LAND_STROKE = "#58809f";
const GOLD = "#FFC742";
const CYAN = "#2E9FD4";
const CYAN_EDGE = "#7FD8FF";
const CREAM = "#e8ecf5";
const PLATE = "#0a1526";
const RED_WARN = "#ff5a3c";
const MONO = "Menlo, 'SF Mono', 'Courier New', monospace";

// ===== TIMINGS REELS (forced-align narration-NEW.alignment.json, offset P4 + 41.102s) =====
// Chaque cle = la frame du MOT prononce. Ne jamais "arrondir" : c'est ce calage qui rend le beat
// lisible en moins de 2s.
const M = {
  pourLeMaroc: S(0.0),        // "Pour le Maroc,"
  outilUltime: S(4.2),        // "ultime."
  silAboutit: S(5.82),        // "S'il aboutit," — bascule vers l'insert
  rabat: S(7.32),             // "Rabat" — LE PIVOT APPARAIT ICI
  pointDePassage: S(8.24),    // "point de passage"
  indispensable: S(9.3),      // "indispensable"
  afriqueOuest: S(10.96),     // "l'Afrique de l'Ouest" — masse gauche
  europe: S(12.16),           // "l'Europe" — masse droite
  levier: S(13.8),            // "levier" — le flux traverse
  colossal: S(15.42),         // "colossal." — pic de l'insert
  pourLAlgerie: S(17.56),     // "Pour l'Algérie," — RETOUR CARTE
  exactementInverse: S(19.86), // "exactement inverse"
  proteger: S(22.68),         // "protéger"
  monopole: S(23.68),         // "son monopole" — l'Algerie s'AFFIRME
  historique: S(24.44),       // "historique"
  fournisseurAfricain: S(26.36), // "fournisseur africain"
  eviter: S(28.66),           // "d'éviter"
  contournee: S(29.56),       // "contournée" — LA CHUTE
  trace: S(30.84),            // "un tracé"
  atlantique: S(32.38),       // "par l'Atlantique."
  segEnd: S(33.398),
};

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);

function bboxCentroid(d: string): [number, number] {
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums) return [W / 2, H / 2];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = parseFloat(nums[i]), y = parseFloat(nums[i + 1]);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}
function ctrlOf(a: [number, number], b: [number, number], perp: number, t: number): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * t, my = a[1] + (b[1] - a[1]) * t;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * perp, my + (dx / len) * perp];
}
function quadD(a: [number, number], c: [number, number], b: [number, number]): string {
  return `M ${a[0]} ${a[1]} Q ${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
}
function pointOnQuad(a: [number, number], c: [number, number], b: [number, number], t: number): [number, number] {
  const mt = 1 - t;
  return [mt * mt * a[0] + 2 * mt * t * c[0] + t * t * b[0], mt * mt * a[1] + 2 * mt * t * c[1] + t * t * b[1]];
}
function buildSamples(jalons: [number, number][], bendPerp: number, perSeg = 48): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < jalons.length - 1; i++) {
    const a = jalons[i], b = jalons[i + 1];
    const c = ctrlOf(a, b, bendPerp, 0.5);
    for (let s = 0; s <= perSeg; s++) {
      if (i > 0 && s === 0) continue;
      pts.push(pointOnQuad(a, c, b, s / perSeg));
    }
  }
  return pts;
}
const polyLenCache = new WeakMap<[number, number][], number>();
function polyLen(samples: [number, number][]): number {
  const hit = polyLenCache.get(samples);
  if (hit !== undefined) return hit;
  let total = 0;
  for (let k = 1; k < samples.length; k++) total += Math.hypot(samples[k][0] - samples[k - 1][0], samples[k][1] - samples[k - 1][1]);
  polyLenCache.set(samples, total);
  return total;
}
function pointAtT(samples: [number, number][], t: number): [number, number] {
  const c = Math.max(0, Math.min(1, t));
  const idx = c * (samples.length - 1);
  const i0 = Math.floor(idx), i1 = Math.min(samples.length - 1, i0 + 1);
  const f = idx - i0;
  return [samples[i0][0] + (samples[i1][0] - samples[i0][0]) * f, samples[i0][1] + (samples[i1][1] - samples[i0][1]) * f];
}
// Longueur d'un path SVG (pour le geste "le contour se dessine") — approximation par les points du
// path, suffisante pour un strokeDasharray (heuristique validee sur l'Acte 1).
function polylineLength(d: string): number {
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums) return 1000;
  let total = 0, px = 0, py = 0, first = true;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = parseFloat(nums[i]), y = parseFloat(nums[i + 1]);
    if (!first) total += Math.hypot(x - px, y - py);
    px = x; py = y; first = false;
  }
  return Math.max(1, total);
}

// ===== BRIQUE REUTILISEE (Acte 1 / ProtoGazoducGlobeFusion) : le contour se DESSINE, puis le pays
// se REMPLIT. Geste valide par Aziz, jamais recode. =====
const PaysTrace: React.FC<{
  d: string; trace: number; fill: number; fillColor: string; strokeColor: string;
  strokeW: number; fillOpacity?: number; strokeOpacity?: number;
}> = ({ d, trace, fill, fillColor, strokeColor, strokeW, fillOpacity = 0.95, strokeOpacity = 0.95 }) => {
  const len = useMemo(() => polylineLength(d), [d]);
  if (trace <= 0.001) return null;
  return (
    <g>
      {fill > 0.01 && <path d={d} fill={fillColor} fillOpacity={fillOpacity * fill} stroke="none" />}
      <path d={d} fill="none" stroke={strokeColor} strokeWidth={strokeW}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - trace)} strokeOpacity={strokeOpacity} />
    </g>
  );
};

// ===== Les 2 traces — MEMES jalons que les Actes 2/3/4A (geo reelle, zero approximation) =====
const AAGP_NAMES = [
  // ⚠️ "Côte d'Ivoire" AVEC l'accent : c'est la clef exacte du GeoJSON. Sans accent, byName()
  // renvoie undefined et le trace saute silencieusement le pays (bug attrape au 1er render).
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
];
const TSGP_NAMES = ["Nigeria", "Niger", "Algeria"];
const aagpJalons: [number, number][] = AAGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c).map((c) => bboxCentroid(c.d));
const tsgpJalons: [number, number][] = TSGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c).map((c) => bboxCentroid(c.d));
const aagpD = aagpJalons.slice(0, -1).map((a, i) => quadD(a, ctrlOf(a, aagpJalons[i + 1], -18, 0.5), aagpJalons[i + 1])).join(" ");
const tsgpD = tsgpJalons.slice(0, -1).map((a, i) => quadD(a, ctrlOf(a, tsgpJalons[i + 1], 14, 0.5), tsgpJalons[i + 1])).join(" ");
const aagpSamples = buildSamples(aagpJalons, -18, 48);
const tsgpSamples = buildSamples(tsgpJalons, 14, 60);

// ===== BRIQUE REUTILISEE (4A) : impulsions-cometes qui circulent le long d'un trace. Reprise telle
// quelle pour que l'ouverture de 4B PROLONGE visuellement la fin de 4A (continuite), et pour que les
// traces ne soient jamais des lignes mortes. =====
const Impulsions: React.FC<{
  samples: [number, number][]; frame: number; startF: number;
  count: number; speed: number; opacity: number; phase: number; camScale: number;
}> = ({ samples, frame, startF, count, speed, opacity, phase, camScale }) => {
  if (opacity <= 0.01 || count <= 0) return null;
  const local = Math.max(0, frame - startF);
  const out: React.ReactNode[] = [];
  const n = Math.max(1, Math.round(count));
  const L_OUT = 110 / camScale, L_CORE = 64 / camScale;
  for (let i = 0; i < n; i++) {
    const t = ((speed * local) + phase + i / n) % 1;
    const fadeIn = interpolate(t, [0.06, 0.14], [0, 1], clampB);
    const fadeOut = 1 - interpolate(t, [0.86, 0.96], [0, 1], clampB);
    const op = opacity * fadeIn * fadeOut;
    if (op <= 0.01) continue;
    const [hx, hy] = pointAtT(samples, t);
    // La trainee SUIT la courbe (echantillonnage arriere) — une tangente droite sortirait du trace
    // dans les virages serres du golfe de Guinee. Lecon deja payee sur 4A.
    const tail = (lengthPx: number): string => {
      const steps = 10;
      const dt = lengthPx / Math.max(1, polyLen(samples));
      const pts: string[] = [];
      for (let s = steps; s >= 0; s--) {
        const p = pointAtT(samples, Math.max(0, t - dt * (s / steps)));
        pts.push(`${p[0]} ${p[1]}`);
      }
      return `M ${pts.join(" L ")}`;
    };
    out.push(
      <g key={`imp-${i}`}>
        <path d={tail(L_OUT)} fill="none" stroke={GOLD} strokeOpacity={op * 0.22}
          strokeWidth={5 / camScale} strokeLinecap="round" />
        <path d={tail(L_CORE)} fill="none" stroke="#FFE9A8" strokeOpacity={op * 0.85}
          strokeWidth={2.2 / camScale} strokeLinecap="round" />
        <circle cx={hx} cy={hy} r={3 / camScale} fill="#FFF6D8" opacity={op} />
      </g>
    );
  }
  return <>{out}</>;
};

const centroids = geoData.centroids as unknown as Record<string, [number, number]>;
const MAROC_C = centroids.Morocco ?? bboxCentroid(byName("Morocco")?.d ?? "");
const ALGERIE_C = centroids.Algeria ?? bboxCentroid(byName("Algeria")?.d ?? "");
const ESPAGNE_C = centroids.Spain ?? bboxCentroid(byName("Spain")?.d ?? "");
const NIGERIA_C = centroids.Nigeria ?? bboxCentroid(byName("Nigeria")?.d ?? "");

// ===== L'EUROPE COMME DESTINATION (correction majeure 2026-08-15) =====
// Retour Aziz : la 2e moitie ne RACONTAIT rien. La voix dit "fournisseur africain de L'EUROPE" et
// "eviter d'etre CONTOURNEE" — or l'Europe n'existait pas a l'ecran et le contournement etait rendu
// par un simple changement de couleur. Sans le client qu'on se dispute, "fournisseur" ne veut rien
// dire, et un contournement n'est pas un ETAT : c'est un MOUVEMENT (passer a cote de).
// L'Europe est aussi le PLATEAU DROIT du levier de l'insert -> elle fait le raccord entre les deux
// moities (choix de mise en scene valide par Aziz).
// ⚠️ ARCS SCHEMATIQUES ASSUMES — decision Aziz 2026-08-15 (v3 preferee a v4).
// La geometrie REELLE a ete codee puis ECARTEE apres comparaison visuelle : le Medgaz reel
// (Hassi R'Mel -> Beni Saf -> traversee sous-marine -> Almeria) part de l'interieur des terres et
// produit un trajet court et discret, moins lisible a l'ecran que l'arc franc ci-dessous. Le rendu
// v4 (geometrie exacte) existe et a ete rejete au profit de v3.
// ⛔ Ne PAS "corriger" ces arcs en croyant a une approximation oubliee : c'est un choix de lisibilite.
// Si un jour la geo exacte redevient souhaitable, les points sont retrouvables avec la projection du
// fond de carte : geoMercator().fitExtent([[80,90],[1840,918]]) sur l'Afrique seule
// (cf scripts/tools/generate-gazoduc-geo-elargie.mjs) — jamais a l'oeil.
const EUROPE_ANCRE: [number, number] = [ESPAGNE_C[0], ESPAGNE_C[1] - 18];

// Les 2 routes VERS L'EUROPE (c'est la destination qui cree l'enjeu) :
//   - route algerienne : Algerie -> Espagne, celle qui EXISTE aujourd'hui (le monopole).
//   - route atlantique : Maroc -> Espagne, prolongement de l'AAGP qui CONTOURNE l'Algerie.
const routeAlgerieEuropeJalons: [number, number][] = [ALGERIE_C, EUROPE_ANCRE];
const routeAlgerieEuropeD = quadD(ALGERIE_C, ctrlOf(ALGERIE_C, EUROPE_ANCRE, 10, 0.5), EUROPE_ANCRE);
const routeAtlantiqueEuropeD = quadD(MAROC_C, ctrlOf(MAROC_C, EUROPE_ANCRE, -8, 0.5), EUROPE_ANCRE);
const routeAlgerieEuropeSamples = buildSamples(routeAlgerieEuropeJalons, 10, 40);
// ⭐ LE CONTOURNEMENT COMPLET : Nigeria -> cote atlantique -> Maroc -> Europe, en UN SEUL trait.
// C'est ce parcours continu qui MONTRE l'evitement (le gaz passe a cote de l'Algerie), au lieu de
// le dire par une couleur.
const contournementJalons: [number, number][] = [...aagpJalons, EUROPE_ANCRE];
const contournementSamples = buildSamples(contournementJalons, -18, 48);

// ===== CAMERA — memes helpers que 4A =====
type Cam = { scale: number; tx: number; ty: number };
// ⭐ Cadrage MESURE, jamais a l'oeil : bbox reelle des pays affiches (les 13 du trace AAGP + Niger,
// Algerie, Espagne) = x[593,951] y[0,475], centre (772,238), taille 358x475. Un cadrage a l'oeil
// (960,560 scale 1.0) laissait la moitie basse de l'image vide (Afrique australe + Amerique du Sud)
// alors que toute l'action se joue en haut a gauche — defaut vu au 1er render.
const FRAME_CENTER: [number, number] = [772, 238];
const FRAME_SCALE = 1.82; // marge 1.25 autour de la bbox
function camFor(center: [number, number], scale: number): Cam {
  return { scale, tx: W / 2 - center[0] * scale, ty: H / 2 - center[1] * scale };
}
function lerpCam(a: Cam, b: Cam, t: number): Cam {
  return { scale: a.scale + (b.scale - a.scale) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t };
}
const camOuverture = camFor(FRAME_CENTER, FRAME_SCALE);
// Le centre de gravite se DEPLACE vers le Maroc/Algerie (geste unique du 3e temps) : on remonte
// vers le nord (y plus petit = Maghreb) et on resserre. Deplacements en unites de la geo reelle,
// pas des pixels ecran — la bbox fait 358x475, donc ~40u = un vrai deplacement visible.
const camVersMaroc = camFor([FRAME_CENTER[0] + 10, FRAME_CENTER[1] - 55], FRAME_SCALE * 1.18);
const camChute = camFor([FRAME_CENTER[0] + 20, FRAME_CENTER[1] - 40], FRAME_SCALE * 1.12);

type CamKey = { f: number; cam: Cam };
const CAM_KEYS: CamKey[] = [
  { f: M.pourLeMaroc, cam: camOuverture },
  { f: M.silAboutit, cam: lerpCam(camOuverture, camVersMaroc, 0.25) },
  { f: M.pourLAlgerie, cam: lerpCam(camOuverture, camVersMaroc, 0.55) },
  { f: M.monopole, cam: camVersMaroc },
  { f: M.contournee, cam: lerpCam(camVersMaroc, camChute, 0.7) },
  { f: M.segEnd, cam: camChute },
];
// Camera CONTINUE : interpolation lineaire entre cles, JAMAIS d'easeInOut par segment (la derivee
// nulle aux extremites produit une vitesse 0 a chaque point de passage = mouvement "par a-coups").
// Lecon payee 3 iterations sur l'Acte 3.
function camAt(frame: number): Cam {
  if (frame <= CAM_KEYS[0].f) return CAM_KEYS[0].cam;
  const last = CAM_KEYS[CAM_KEYS.length - 1];
  if (frame >= last.f) return last.cam;
  let a = CAM_KEYS[0], b = CAM_KEYS[1];
  for (let i = 0; i < CAM_KEYS.length - 1; i++) {
    if (frame >= CAM_KEYS[i].f && frame <= CAM_KEYS[i + 1].f) { a = CAM_KEYS[i]; b = CAM_KEYS[i + 1]; break; }
  }
  const t = (frame - a.f) / Math.max(1, b.f - a.f);
  return lerpCam(a.cam, b.cam, t);
}

const Plaque: React.FC<{ cx: number; cy: number; text: string; fontSize?: number; goldAccent?: boolean; opacity?: number }> = ({
  cx, cy, text, fontSize = 30, goldAccent = false, opacity = 1,
}) => {
  const w = text.length * fontSize * 0.66 + 40;
  const h = fontSize + 26;
  return (
    <g opacity={opacity}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={7}
        fill={PLATE} stroke={goldAccent ? GOLD : CYAN_EDGE} strokeWidth={2} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
        fontFamily={MONO} fontSize={fontSize} fill={goldAccent ? GOLD : CREAM} letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

const Chevron: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <path d={`M ${x - 9} ${y - 10} L ${x + 9} ${y} L ${x - 9} ${y + 10}`}
    fill="none" stroke="#6b4f10" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
);

// ============================================================================
// INSERT LEVIER — SVG de Fable 5, rendu ANIMABLE : chaque groupe apparait au mot qui le nomme.
// ============================================================================
const InsertLevier: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const PIVOT_X = 960, PIVOT_Y = 470;
  const beamY = 457, beamH = 26, beamX1 = 340, beamX2 = 1580;
  const massR = 90, massCyL = beamY - 8 - massR;
  const leftX = 440, rightX = 1480;
  const nigeriaCx = 960, nigeriaCy = 872, nigeriaR = 100;

  // Apparitions calees sur les mots (regle des 2 secondes : une chose a la fois).
  const pivotIn = spring({ frame: frame - M.rabat, fps, config: { damping: 16, stiffness: 140 } });
  const socleIn = interpolate(frame, [M.pointDePassage, M.indispensable], [0, 1], clampB);
  const brasIn = interpolate(frame, [M.indispensable, M.indispensable + S(0.7)], [0, 1], clampB);
  const gaucheIn = spring({ frame: frame - M.afriqueOuest, fps, config: { damping: 18, stiffness: 130 } });
  const droiteIn = spring({ frame: frame - M.europe, fps, config: { damping: 18, stiffness: 130 } });
  // Le flux ne part QU'A "levier" : c'est lui qui porte l'idee du passage oblige.
  const fluxIn = interpolate(frame, [M.levier, M.levier + S(0.8)], [0, 1], clampB);
  const nigeriaIn = interpolate(frame, [M.levier + S(0.3), M.colossal], [0, 1], clampB);
  // Chevrons qui defilent vers le pivot puis au-dela (le gaz PASSE par Rabat).
  const flow = ((frame - M.levier) / fps) * 90;

  // ===== MICRO-ANIMATIONS (retour Aziz : "tout apparait d'un seul coup", il faut MONTRER que Rabat
  // supporte la charge, pas seulement l'afficher) =====
  // 1. Le bras FLECHIT quand chaque masse se pose (rotation courte qui revient a l'equilibre) :
  //    la charge se VOIT. Amplitude opposee gauche/droite, amortie -> le pivot "encaisse".
  const chargeG = spring({ frame: frame - M.afriqueOuest, fps, config: { damping: 9, stiffness: 90, mass: 1.1 } });
  const chargeD = spring({ frame: frame - M.europe, fps, config: { damping: 9, stiffness: 90, mass: 1.1 } });
  // rebond amorti : monte puis revient a 0 (le levier tient bon = c'est le propos)
  const flexG = Math.sin(chargeG * Math.PI) * 2.6;
  const flexD = Math.sin(chargeD * Math.PI) * -2.6;
  const brasAngle = flexG + flexD;
  // 2. Le pivot RESPIRE une fois la charge passee : il travaille en continu.
  const pivotPulse = 1 + 0.045 * Math.sin(((frame - M.rabat) / fps) * 2.2);
  // 3. Les masses se POSENT (leger enfoncement vertical a l'arrivee) au lieu d'apparaitre sur place.
  const poseG = (1 - chargeG) * -26;
  const poseD = (1 - chargeD) * -26;
  // 4. Le socle encaisse : compression tres legere au moment des charges.
  const socleSquash = 1 - 0.02 * (Math.sin(chargeG * Math.PI) + Math.sin(chargeD * Math.PI));

  return (
    <g>
      <defs>
        <radialGradient id="a4b_disc" cx="42%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#46B7E8" />
          <stop offset="100%" stopColor="#1C6E9E" />
        </radialGradient>
        <radialGradient id="a4b_disc_deep" cx="42%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#2E86B4" />
          <stop offset="100%" stopColor="#14547E" />
        </radialGradient>
        <linearGradient id="a4b_gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD469" />
          <stop offset="100%" stopColor="#D99E2B" />
        </linearGradient>
      </defs>

      {/* cercles d'ambiance */}
      <g opacity={pivotIn * 0.5}>
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={560} fill="none" stroke={CYAN_EDGE} strokeWidth={2} opacity={0.06} />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={780} fill="none" stroke={CYAN_EDGE} strokeWidth={2} opacity={0.04} />
        <line x1={260} y1={744} x2={1660} y2={744} stroke={CYAN_EDGE} strokeWidth={2} opacity={0.16} />
      </g>

      {/* SOCLE — le Maroc tient le point d'appui. Il ENCAISSE (compression) a chaque charge. */}
      <g id="socle" opacity={socleIn}
        transform={`translate(${PIVOT_X} 720) scale(1 ${socleSquash}) translate(${-PIVOT_X} -720)`}>
        <path d={`M ${PIVOT_X} 488 L 868 720 L 1052 720 Z`} fill={GOLD} fillOpacity={0.12}
          stroke={GOLD} strokeWidth={4} strokeLinejoin="round" />
        <rect x={830} y={720} width={260} height={16} rx={6} fill="url(#a4b_gold)" />
      </g>

      {/* MASSE SOURCE : NIGERIA + flux ascendant vers le pivot */}
      <g id="masse_nigeria" opacity={nigeriaIn}>
        <line x1={nigeriaCx} y1={nigeriaCy - nigeriaR - 6} x2={nigeriaCx} y2={520}
          stroke={GOLD} strokeWidth={4} strokeDasharray="14 12" opacity={0.8} />
        <path d={`M ${nigeriaCx} 636 L ${nigeriaCx - 13} 660 L ${nigeriaCx + 13} 660 Z`} fill={GOLD} />
        <circle cx={nigeriaCx} cy={nigeriaCy} r={nigeriaR + 14} fill="none" stroke={CYAN_EDGE}
          strokeWidth={2} strokeDasharray="5 11" opacity={0.4} />
        <circle cx={nigeriaCx} cy={nigeriaCy} r={nigeriaR} fill="url(#a4b_disc_deep)" stroke={CYAN_EDGE} strokeWidth={3} />
        <Plaque cx={nigeriaCx} cy={nigeriaCy} text="NIGERIA" fontSize={32} />
      </g>

      {/* BRAS + PLATEAUX + MASSES — l'ensemble PIVOTE autour de (960,470) : le bras flechit quand
          une masse se pose, puis revient a l'equilibre. C'est ce mouvement qui dit "il SUPPORTE". */}
      <g id="ensemble_pivotant"
        transform={`rotate(${brasAngle} ${PIVOT_X} ${PIVOT_Y})`}>
        <g id="bras" opacity={brasIn}>
          <rect x={beamX1} y={beamY} width={(beamX2 - beamX1) * brasIn} height={beamH} rx={10} fill="url(#a4b_gold)" />
          {fluxIn > 0.01 && (
            <g opacity={fluxIn}>
              <line x1={beamX1 + 30} y1={PIVOT_Y} x2={beamX2 - 30} y2={PIVOT_Y}
                stroke="#6b4f10" strokeWidth={5} strokeDasharray="20 16" opacity={0.7} />
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const span = beamX2 - beamX1 - 120;
                const x = beamX1 + 60 + (((flow + i * (span / 6)) % span) + span) % span;
                return <Chevron key={i} x={x} y={PIVOT_Y} opacity={0.9} />;
              })}
            </g>
          )}
        </g>

        <g id="plateau_gauche" opacity={gaucheIn}>
          <rect x={leftX - 85} y={beamY - 8} width={170} height={8} rx={4} fill="#D99E2B" />
        </g>
        <g id="plateau_droit" opacity={droiteIn}>
          <rect x={rightX - 85} y={beamY - 8} width={170} height={8} rx={4} fill="#D99E2B" />
        </g>

        <g id="masse_afrique_ouest" opacity={gaucheIn}
          transform={`translate(0 ${poseG}) translate(${leftX} ${massCyL}) scale(${0.72 + 0.28 * gaucheIn}) translate(${-leftX} ${-massCyL})`}>
          <circle cx={leftX} cy={massCyL} r={massR} fill="url(#a4b_disc)" stroke={CYAN_EDGE} strokeWidth={3} />
          <g transform={`translate(${leftX} ${massCyL + 2})`}>
            <path d="M0,-40 C15,-20 27,-4 27,13 C27,31 15,43 0,43 C-15,43 -27,31 -27,13 C-27,-4 -15,-20 0,-40 Z" fill={GOLD} />
            <path d="M0,-12 C7,-2 13,5 13,15 C13,25 7,31 0,31 C-7,31 -13,25 -13,15 C-13,5 -7,-2 0,-12 Z" fill="#125a84" />
          </g>
          <line x1={leftX} y1={236} x2={leftX} y2={massCyL - massR - 4} stroke={CYAN_EDGE} strokeWidth={2} opacity={0.55} />
          <Plaque cx={leftX} cy={206} text="AFRIQUE DE L'OUEST" fontSize={32} />
        </g>

        <g id="masse_europe" opacity={droiteIn}
          transform={`translate(0 ${poseD}) translate(${rightX} ${massCyL}) scale(${0.72 + 0.28 * droiteIn}) translate(${-rightX} ${-massCyL})`}>
          <circle cx={rightX} cy={massCyL} r={massR} fill="url(#a4b_disc)" stroke={CYAN_EDGE} strokeWidth={3} />
          <g transform={`translate(${rightX} ${massCyL})`}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
              return <circle key={i} cx={Math.cos(a) * 48} cy={Math.sin(a) * 48} r={5} fill={GOLD} />;
            })}
          </g>
          <line x1={rightX} y1={236} x2={rightX} y2={massCyL - massR - 4} stroke={CYAN_EDGE} strokeWidth={2} opacity={0.55} />
          <Plaque cx={rightX} cy={206} text="EUROPE" fontSize={32} />
        </g>
      </g>

      {/* PIVOT — apparait sur le mot "Rabat", puis RESPIRE : il travaille en continu sous la charge. */}
      <g id="pivot" opacity={pivotIn}
        transform={`translate(${PIVOT_X} ${PIVOT_Y}) scale(${pivotPulse}) translate(${-PIVOT_X} ${-PIVOT_Y})`}>
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={64 * pivotIn} fill={CYAN_EDGE} opacity={0.08} />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={42} fill={GOLD} opacity={0.16 * pivotIn} />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={52} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.5} />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={26} fill={PLATE} stroke={GOLD} strokeWidth={6} />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={11} fill={GOLD} />
        {[45, 135, 225, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const ext = 36 + 14 * fluxIn;
          return (
            <line key={deg} x1={PIVOT_X + Math.cos(rad) * 36} y1={PIVOT_Y + Math.sin(rad) * 36}
              x2={PIVOT_X + Math.cos(rad) * ext} y2={PIVOT_Y + Math.sin(rad) * ext}
              stroke={GOLD} strokeWidth={4} strokeLinecap="round" />
          );
        })}
      </g>

      <g id="label_rabat" opacity={pivotIn}>
        <Plaque cx={PIVOT_X} cy={578} text="RABAT" fontSize={32} goldAccent />
      </g>
      {/* ⛔ "LEVIER DE POUVOIR" RETIRE (retour Aziz) : la voix dit deja "un levier de pouvoir
          colossal" a 13.8s. Regle d'epure — ne jamais ecrire a l'ecran ce que la narration porte
          deja. La scene se lit aussi bien et respire mieux. */}
    </g>
  );
};

// ============================================================================
export const GazoducActe4Objectifs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = camAt(frame);

  // L'insert occupe 7.32 -> 17.5s. Fondu court : on QUITTE la carte, on y revient.
  const insertIn = interpolate(frame, [M.silAboutit, M.rabat], [0, 1], clampB);
  const insertOut = interpolate(frame, [M.pourLAlgerie - S(0.9), M.pourLAlgerie], [1, 0], clampB);
  const insertOpacity = insertIn * insertOut;
  const carteVoile = insertOpacity; // la carte s'efface pendant l'insert

  // --- OUVERTURE : les 3 pays du recit sont ALLUMES (retour Aziz : ils doivent l'etre des le depart,
  // comme au panneau 1 du storyboard). Geste = le contour se DESSINE puis le pays se REMPLIT
  // (brique PaysTrace de l'Acte 1), decale pays par pays pour que l'oeil suive.
  const trMaroc = interpolate(frame, [S(0.3), S(1.5)], [0, 1], clampB);
  const flMaroc = interpolate(frame, [S(1.1), S(2.3)], [0, 1], clampB);
  const trNigeria = interpolate(frame, [S(0.9), S(2.1)], [0, 1], clampB);
  const flNigeria = interpolate(frame, [S(1.7), S(2.9)], [0, 1], clampB);
  const trAlgerie = interpolate(frame, [S(1.5), S(2.7)], [0, 1], clampB);
  const flAlgerie = interpolate(frame, [S(2.3), S(3.5)], [0, 1], clampB);

  // --- 3e TEMPS (panneau 3 "Shifting Center") : l'Algerie devient un BLOC ETABLI, bleu tres clair,
  // presque blanc — elle s'affirme comme le fournisseur en place. Ce n'est PAS un mouvement de
  // camera : c'est le TERRITOIRE qui change de statut (correction Aziz : j'avais paraphrase le
  // storyboard en deplacement de camera au lieu de coder son dispositif).
  // ⛔ Libye laissee ETEINTE (decision Aziz) : le script parle du monopole algerien seul.
  const algerieBloc = interpolate(frame, [M.monopole, M.historique + S(0.8)], [0, 1], clampB);
  // --- 4e TEMPS (panneau 4) : le rouge envahit le domaine algerien. Le trace TSGP s'eteint
  // completement (il ne se fera pas), seule la route atlantique reste vivante et la contourne.
  const algerieRouge = interpolate(frame, [M.contournee, M.contournee + S(1.6)], [0, 1], clampB);
  const marocOn = Math.max(trMaroc, flMaroc);
  const algerieAffirme = Math.max(flAlgerie, algerieBloc);
  // La route atlantique se renforce a mesure que l'Algerie est evitee.
  const aagpForce = interpolate(frame, [M.eviter, M.atlantique], [0.55, 1], clampB);
  // Le TSGP s'ETEINT quasi completement (panneau 4 du storyboard : le trace algerien disparait,
  // seule la route atlantique reste allumee). C'est ce contraste qui porte "contournee".
  const tsgpFaiblit = interpolate(frame, [M.contournee, M.trace], [1, 0.1], clampB);

  // ===== LA 2e MOITIE DOIT RACONTER (correction Aziz) =====
  // 1. L'EUROPE apparait comme DESTINATION des "fournisseur africain de l'Europe" (26.36s) — en
  //    realite un peu avant, sur "monopole" (23.68s), car c'est ce monopole qui la concerne.
  const europeOn = interpolate(frame, [M.monopole - S(0.4), M.historique], [0, 1], clampB);
  // 2. LA ROUTE ALGERIENNE VERS L'EUROPE = le monopole CONCRET (ce qu'elle detient et veut garder).
  //    Elle se dessine pendant qu'elle s'affirme, et le gaz y circule.
  const routeAlgTrace = interpolate(frame, [M.monopole, M.fournisseurAfricain], [0, 1], clampB);
  const routeAlgVie = interpolate(frame, [M.fournisseurAfricain, M.eviter], [1, 1], clampB)
    * (1 - interpolate(frame, [M.contournee, M.contournee + S(1.2)], [0, 1], clampB));
  // 3. LE CONTOURNEMENT = un MOUVEMENT, pas une couleur. Sur "eviter"/"contournee", une impulsion
  //    part du Nigeria, longe l'Atlantique, remonte par le Maroc et rejoint l'Europe — elle passe
  //    VISIBLEMENT a cote de l'Algerie. C'est le geste qui dit le mot.
  const contournementRun = interpolate(frame, [M.eviter, M.atlantique + S(0.8)], [0, 1], clampB);
  const routeAtlEuropeTrace = interpolate(frame, [M.contournee, M.trace + S(0.4)], [0, 1], clampB);
  // 4. L'OPPOSITION : sur "exactement inverse" (19.86s), les 2 intentions se separent visuellement.
  //    Le Maroc TEND vers l'Europe (fleche d'ambition), l'Algerie TIENT (bloc qui se compacte).
  const opposition = interpolate(frame, [M.exactementInverse, M.proteger], [0, 1], clampB);

  const labelContournee = interpolate(frame, [M.contournee + S(0.2), M.contournee + S(0.8)], [0, 1], clampB);

  const globalFadeIn = interpolate(frame, [0, S(0.5)], [0, 1], clampB);
  const globalFadeOut = interpolate(frame, [M.segEnd - S(0.5), M.segEnd], [1, 0], clampB);

  const algerie = byName("Algeria");
  const maroc = byName("Morocco");
  const nigeria = byName("Nigeria");
  const espagne = byName("Spain");

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 72% 72% at 50% 46%, ${BG_TOP} 0%, ${BG_BOT} 100%)`,
      opacity: globalFadeIn * globalFadeOut,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="a4b-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="a4b-route-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ================= CARTE ================= */}
        <g opacity={1 - carteVoile}>
          <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
            {/* Traits contre-echelles (/cam.scale) pour garder l'epaisseur ECRAN constante quel que
                soit le zoom — sinon les frontieres epaississent au resserrement. */}
            {countries.map((c, i) => (
              <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.92}
                stroke={LAND_STROKE} strokeOpacity={0.72} strokeWidth={0.75 / cam.scale} />
            ))}

            {/* NIGERIA — la source. Allume des l'ouverture (retour Aziz : les 3 pays du recit). */}
            {nigeria && (
              <PaysTrace d={nigeria.d} trace={trNigeria} fill={flNigeria}
                fillColor={CYAN} strokeColor={CYAN_EDGE} strokeW={1.6 / cam.scale}
                fillOpacity={0.46} strokeOpacity={0.7} />
            )}

            {/* MAROC — l'ambition. Contour qui se dessine puis remplissage bleu vif.
                Sur "exactement inverse", il MONTE en intensite : il TEND vers quelque chose
                (gagner un role), a l'inverse de l'Algerie qui se referme sur ce qu'elle a. */}
            {maroc && (
              <PaysTrace d={maroc.d} trace={trMaroc} fill={flMaroc}
                fillColor={CYAN} strokeColor="#9FE4FF" strokeW={(1.6 + 1.1 * opposition) / cam.scale}
                fillOpacity={0.5 + 0.16 * opposition} strokeOpacity={0.78 + 0.22 * opposition} />
            )}

            {/* ALGERIE — 3 etats successifs, UN SEUL geste continu :
                (1) allumee a l'ouverture comme les 2 autres,
                (2) devient un BLOC ETABLI bleu tres clair sur "monopole" (ce qu'elle detient),
                (3) vire au rouge sur "contournee" (ce qu'elle perd). */}
            {algerie && (
              <PaysTrace d={algerie.d} trace={trAlgerie}
                fill={Math.max(flAlgerie, algerieBloc)}
                // Bleu vif -> bleu tres clair (bloc etabli) -> rouge
                fillColor={algerieRouge > 0.01
                  ? RED_WARN
                  : (algerieBloc > 0.01 ? "#BFE4F5" : CYAN)}
                strokeColor={algerieRouge > 0.01 ? RED_WARN : (algerieBloc > 0.01 ? "#EAF6FC" : CYAN_EDGE)}
                strokeW={(1.6 + 1.4 * algerieRouge) / cam.scale}
                fillOpacity={0.46 + 0.28 * algerieBloc - 0.22 * algerieRouge}
                strokeOpacity={0.72 + 0.25 * algerieBloc} />
            )}

            {/* Les 2 traces — CONTINUITE avec 4A. Ils ne portent plus l'idee : le tsgp faiblit,
                l'aagp se renforce, c'est le seul geste qu'ils assurent ici. */}
            <path d={tsgpD} fill="none" stroke={GOLD} strokeWidth={2.4 / cam.scale}
              strokeOpacity={0.72 * tsgpFaiblit} strokeDasharray={`${10 / cam.scale} ${8 / cam.scale}`} />
            <path d={aagpD} fill="none" stroke={GOLD} strokeWidth={(2.2 + 1.4 * aagpForce) / cam.scale}
              strokeOpacity={0.5 + 0.45 * aagpForce} filter="url(#a4b-route-bloom)" />

            {/* IMPULSIONS (retour Aziz : l'ouverture ne doit pas etre des lignes statiques).
                Les 2 traces vivent des le depart — meme vocabulaire qu'a la fin de 4A, donc la
                continuite est visuelle, pas seulement geographique.
                Au 4e temps le TSGP s'eteint (il ne se fera pas) et seul l'AAGP continue de couler :
                c'est ce contraste qui DIT "contournee", sans qu'on ait besoin de l'ecrire. */}
            <Impulsions samples={aagpSamples} frame={frame} startF={S(1.6)} count={4}
              speed={0.055} opacity={0.5 + 0.5 * aagpForce} phase={0} camScale={cam.scale} />
            <Impulsions samples={tsgpSamples} frame={frame} startF={S(2.2)} count={3}
              speed={0.05} opacity={0.85 * tsgpFaiblit} phase={0.35} camScale={cam.scale} />

            {/* ===== L'EUROPE : le client qu'on se dispute ===== */}
            {espagne && europeOn > 0.01 && (
              <PaysTrace d={espagne.d} trace={europeOn} fill={europeOn}
                fillColor="#8FB8D8" strokeColor="#CFE6F7" strokeW={1.4 / cam.scale}
                fillOpacity={0.34} strokeOpacity={0.6} />
            )}

            {/* LA ROUTE ALGERIENNE VERS L'EUROPE = le monopole concret. Elle vit... */}
            {routeAlgTrace > 0.01 && (() => {
              const len = polylineLength(routeAlgerieEuropeD);
              return (
                <g>
                  <path d={routeAlgerieEuropeD} fill="none" stroke={CYAN_EDGE}
                    strokeWidth={2.6 / cam.scale} strokeOpacity={0.75 * routeAlgVie}
                    strokeDasharray={len} strokeDashoffset={len * (1 - routeAlgTrace)} />
                </g>
              );
            })()}
            {/* ...puis elle MEURT quand le contournement l'emporte (le monopole se vide). */}
            {routeAlgVie > 0.02 && (
              <Impulsions samples={routeAlgerieEuropeSamples} frame={frame} startF={M.fournisseurAfricain}
                count={2} speed={0.12} opacity={0.9 * routeAlgVie} phase={0} camScale={cam.scale} />
            )}

            {/* ⭐ LE CONTOURNEMENT — le geste qui DIT le mot : le gaz part du Nigeria, longe
                l'Atlantique, remonte par le Maroc et rejoint l'Europe EN PASSANT A COTE de
                l'Algerie. Une seule impulsion, lente et lisible, qu'on peut suivre des yeux. */}
            {routeAtlEuropeTrace > 0.01 && (() => {
              const len = polylineLength(routeAtlantiqueEuropeD);
              return (
                <path d={routeAtlantiqueEuropeD} fill="none" stroke={GOLD}
                  strokeWidth={3.2 / cam.scale} strokeOpacity={0.92}
                  strokeDasharray={len} strokeDashoffset={len * (1 - routeAtlEuropeTrace)}
                  filter="url(#a4b-route-bloom)" />
              );
            })()}
            {contournementRun > 0.001 && contournementRun < 0.999 && (() => {
              // Une comete unique qui parcourt TOUT le trajet du contournement, du Nigeria a l'Europe.
              const t = contournementRun;
              const [hx, hy] = pointAtT(contournementSamples, t);
              const steps = 14;
              const dt = (220 / cam.scale) / Math.max(1, polyLen(contournementSamples));
              const pts: string[] = [];
              for (let s = steps; s >= 0; s--) {
                const p = pointAtT(contournementSamples, Math.max(0, t - dt * (s / steps)));
                pts.push(`${p[0]} ${p[1]}`);
              }
              const d = `M ${pts.join(" L ")}`;
              return (
                <g>
                  <path d={d} fill="none" stroke={GOLD} strokeOpacity={0.3}
                    strokeWidth={9 / cam.scale} strokeLinecap="round" />
                  <path d={d} fill="none" stroke="#FFF0BE" strokeOpacity={0.95}
                    strokeWidth={3.4 / cam.scale} strokeLinecap="round" />
                  <circle cx={hx} cy={hy} r={6 / cam.scale} fill="#FFFDF0" />
                  <circle cx={hx} cy={hy} r={13 / cam.scale} fill={GOLD} opacity={0.35} />
                </g>
              );
            })()}

            {/* Nameplates — seulement les 2 pays narrativement pertinents.
                Contre-echelle 1/cam.scale : les plaques vivent DANS le groupe transforme, donc sans
                cette compensation elles grossiraient avec le zoom (texte enorme au resserrement). */}
            <g opacity={marocOn} transform={`translate(${MAROC_C[0]} ${MAROC_C[1] - 22}) scale(${1 / cam.scale}) translate(${-MAROC_C[0]} ${-(MAROC_C[1] - 22)})`}>
              <Plaque cx={MAROC_C[0]} cy={MAROC_C[1] - 22} text="MAROC" fontSize={26} />
            </g>
            <g opacity={algerieAffirme} transform={`translate(${ALGERIE_C[0]} ${ALGERIE_C[1] - 18}) scale(${1 / cam.scale}) translate(${-ALGERIE_C[0]} ${-(ALGERIE_C[1] - 18)})`}>
              <Plaque cx={ALGERIE_C[0]} cy={ALGERIE_C[1] - 18} text="ALGÉRIE" fontSize={26}
                goldAccent={algerieRouge > 0.5} />
            </g>
            {/* L'EUROPE nommee : sans elle, "fournisseur de l'Europe" ne veut rien dire. */}
            <g opacity={europeOn} transform={`translate(${EUROPE_ANCRE[0]} ${EUROPE_ANCRE[1] - 14}) scale(${1 / cam.scale}) translate(${-EUROPE_ANCRE[0]} ${-(EUROPE_ANCRE[1] - 14)})`}>
              <Plaque cx={EUROPE_ANCRE[0]} cy={EUROPE_ANCRE[1] - 14} text="EUROPE" fontSize={26} />
            </g>
          </g>

          {/* "CONTOURNÉE" — la chute, ancree sous l'Algerie via la camera */}
          {labelContournee > 0.01 && (
            <g opacity={labelContournee}>
              <rect x={W / 2 - 190} y={H - 190} width={380} height={74} rx={8}
                fill={PLATE} stroke={RED_WARN} strokeWidth={2.5} />
              <text x={W / 2} y={H - 152} textAnchor="middle" dominantBaseline="central"
                fontFamily={MONO} fontSize={40} fill={RED_WARN} letterSpacing={4}>
                CONTOURNÉE
              </text>
            </g>
          )}
        </g>

        {/* ================= INSERT LEVIER ================= */}
        {insertOpacity > 0.005 && (
          <g opacity={insertOpacity}>
            <rect x={0} y={0} width={W} height={H} fill={BG_BOT} opacity={0.92} />
            <InsertLevier frame={frame} fps={fps} />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
