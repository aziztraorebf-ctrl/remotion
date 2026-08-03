// PROTO — carte PLATE, CONTINENT AFRICAIN COMPLET (pas une zone tronquee) pour l'Acte 1 hook
// "Gazoduc AAGP vs TSGP".
//
// Contexte : feedback Aziz sur ProtoGazoducCartePlate.tsx (NE PAS TOUCHER, proto voisin conserve pour
// comparaison) — "on devrait voir le continent africain au complet [...] ca devrait etre une
// projection, pas juste une autre carte". Le proto precedent cadrait serre sur Afrique de l'Ouest +
// Maghreb (25 pays, fitExtent tronque) : visuellement ca ne fait pas sens, un continent ampute.
// Fix : geo regeneree (gazoducAfriqueCompleteGeo.json) avec les 51 pays/territoires africains de
// Natural Earth 110m + fitExtent CADRE LE CONTINENT ENTIER (l'Europe deborde volontairement en haut
// du cadre, rejointe par un leger pan camera vers la fin — cf brief Aziz point 2).
//
// REUTILISE tel quel (mecanisme de tracé deja bon, seul le cadrage geo changeait) :
//  - CountryOutline (pathLen geometrique reel + strokeDashoffset), curveD/quadLen/pointOnQuad (courbes
//    Bezier en espace ecran deja projete), divergence Nigeria -> AAGP (cotier, teal) / TSGP (saharien,
//    pointille orange), pattern camera translate/scale unique (jamais de viewBox anime).
//    Source : ProtoGazoducCartePlate.tsx (meme fichier, cf son en-tete pour la genealogie complete).
//  - Pattern CountryOutline pour un contour qui se dessine par longueur geometrique reelle = le meme
//    mecanisme que le "CountryOutline"/pathLen du proto CFA (CfaActe6aVolonte16x9.tsx, worktree
//    remotion-cfa non montee dans cette session — le pattern est deja present ici via pathLen()).
//
// NOUVEAU dans ce fichier :
//  - gazoducAfriqueCompleteGeo.json : 51 pays africains (tous les Etats/territoires Natural Earth
//    110m du continent) + 3 cibles europeennes (Espagne, Portugal, France), genere via world-atlas +
//    topojson-client + d3-geo geoMercator().fitExtent() sur le continent africain SEUL.
//  - AAGP redirige vers l'ESPAGNE (au lieu du Maroc dans le proto precedent) pour montrer l'arrivee
//    reelle en Europe ; le Maroc reste un point de PASSAGE (halo discret) mais n'est plus la cible finale.
//  - Effet "contour du pays cible qui se dessine en SYNCHRO avec l'avancee du tracé" : le contour de
//    l'Espagne (meme mecanisme strokeDashoffset que CountryOutline) interpole son dessin sur EXACTEMENT
//    la meme fenetre de frames que aagpReveal (le tracé du gazoduc) — donc le contour est fini de se
//    dessiner PILE au moment ou le trace atteint l'Espagne, jamais avant ni apres (cf brief point 3).
//  - Leger pan camera vers le nord en fin de séquence pour amener l'Espagne plus haut dans le cadre
//    (elle est hors-cadre/tres haute au depart puisque le fitExtent privilegie le continent africain).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import geoData from "./gazoducAfriqueCompleteGeo.json";

const W = 1920;
const H = 1080;
const FPS = 30;
export const PROTO_GAZODUC_AFRIQUE_COMPLETE_FRAMES = 330; // 11s @30fps

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

// Palette registre nuit/encre — VALEURS EXACTES CFA (CfaActe2Carte16x9.tsx, video finale publiee,
// validees Aziz "on devrait rester avec ce background, l'opacite, la couleur des traits [...] tres
// lisible"). Fond bleu-marine CLAIR (pas un bleu-nuit sombre qui avale le contraste), remplissage
// TERRE (variante du fond, meme famille chromatique), contour ENCRE (creme/ivoire, contraste fort).
const BG_TOP = "#22345c"; // NUIT (CFA ligne 33)
const BG_BOT = "#182746"; // NUIT2 (CFA ligne 34)
const LAND = "#2c4066"; // TERRE (CFA ligne 35)
const LAND_STROKE = "#f0e8d2"; // ENCRE (CFA ligne 36)
const NIGERIA_FILL = "#f0c94a"; // point de depart commun, dore = source du gaz
const NIGERIA_STROKE = "#caa428";
const AAGP_COLOR = "#4fd3c4"; // cotier Atlantique = teal (evoque l'ocean longe)
const TSGP_COLOR = "#e8834a"; // saharien = orange (evoque le desert traverse)
const TARGET_GLOW = "#f0e8d2";
const SPAIN_OUTLINE = "#8fe8db"; // contour cible europeenne, meme famille que AAGP (coherence visuelle)

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const centroids = geoData.centroids as unknown as Record<string, [number, number]>;

const byName = (name: string) => countries.find((c) => c.name === name);

// longueur geometrique reelle d'un path (somme des distances euclidiennes) — pattern CFA valide,
// JAMAIS l'heuristique "nb commandes * 14" (sous-estime et coupe le trace visuellement avant la fin).
const pathLenCache = new Map<string, number>();
const pathLen = (d: string): number => {
  const cached = pathLenCache.get(d);
  if (cached !== undefined) return cached;
  const nums = (d.match(/-?\d+\.?\d*/g) ?? []).map(Number);
  let total = 0;
  for (let i = 0; i < nums.length - 2; i += 2) {
    const dx = nums[i + 2] - nums[i];
    const dy = nums[i + 3] - nums[i + 1];
    total += Math.sqrt(dx * dx + dy * dy);
  }
  pathLenCache.set(d, total);
  return total;
};

// Centroide ECRAN (bbox min/max des points du path, deja projetes) — pas un centroide geo, juste
// assez pour mesurer une distance relative Nigeria -> chaque pays (effet de vague). Reutilise le
// meme regex d'extraction que pathLen (les coords sont deja en espace ecran dans ce fichier).
const bboxCentroidCache = new Map<string, [number, number]>();
const bboxCentroid = (d: string): [number, number] => {
  const cached = bboxCentroidCache.get(d);
  if (cached !== undefined) return cached;
  const nums = (d.match(/-?\d+\.?\d*/g) ?? []).map(Number);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const c: [number, number] = [(minX + maxX) / 2, (minY + maxY) / 2];
  bboxCentroidCache.set(d, c);
  return c;
};

// ── VAGUE DEPUIS LE NIGERIA (brief Aziz : le reste du continent ne se dessine JAMAIS au meme rythme
// uniforme partout — effet de vague qui part du sujet et parcourt le continent). Distance euclidienne
// ECRAN (deja projetee via fitExtent) entre le centroide bbox de chaque pays et celui du Nigeria.
// Calcule UNE FOIS au chargement du module (geoData est un import statique, jamais recalcule par frame).
const nigeriaCountry = byName("Nigeria");
const nigeriaCentroidStatic: [number, number] = nigeriaCountry ? bboxCentroid(nigeriaCountry.d) : [0, 0];
const distFromNigeria = new Map<string, number>();
let maxDistFromNigeria = 1;
for (const c of countries) {
  const [cx, cy] = bboxCentroid(c.d);
  const dist = Math.hypot(cx - nigeriaCentroidStatic[0], cy - nigeriaCentroidStatic[1]);
  distFromNigeria.set(c.name, dist);
  if (c.name !== "Nigeria" && dist > maxDistFromNigeria) maxDistFromNigeria = dist;
}

const CountryOutline: React.FC<{ c: CountryGeo; draw: number; fillOp?: number; strokeOp?: number }> = ({
  c,
  draw,
  fillOp = 1,
  strokeOp = 0.85,
}) => {
  if (draw <= 0) return null;
  const len = pathLen(c.d);
  return (
    <g>
      <path d={c.d} fill={LAND} fillOpacity={fillOp * Math.min(1, draw * 1.4)} />
      <path
        d={c.d}
        fill="none"
        stroke={LAND_STROKE}
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        opacity={strokeOp}
      />
    </g>
  );
};

// Contour cible qui se dessine en strokeDashoffset, PUIS se remplit une fois le contour termine —
// meme principe que PaysTrace (GlobeRecitProto.tsx) : le trace du contour et le remplissage sont
// 2 signaux distincts, le remplissage ne demarre QUE quand le contour approche 1 (jamais avant).
// `draw` = 0->1 progression du contour (strokeDashoffset). `fill` = 0->1 opacite du remplissage,
// pilote par un interpolate() SEPARE qui commence a la fin de la fenetre de `draw` (cf appel site).
const TargetCountryOutline: React.FC<{ c: CountryGeo; draw: number; fill: number; color: string; fillColor?: string }> = ({
  c,
  draw,
  fill,
  color,
  fillColor,
}) => {
  if (draw <= 0) return null;
  const len = pathLen(c.d);
  return (
    <g>
      {/* remplissage en aplat, apparait APRES le contour trace (jamais avant, jamais un simple fade) */}
      {fill > 0.01 && <path d={c.d} fill={fillColor ?? color} fillOpacity={0.55 * fill} stroke="none" />}
      <path
        d={c.d}
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        opacity={0.95}
      />
    </g>
  );
};

// Point de controle pour une courbe quadratique en espace ECRAN (deja projete), avec un biais
// perpendiculaire pour donner une allure de tracé "route" plutot qu'une ligne droite GPS.
function curveD(a: [number, number], b: [number, number], bendPerp: number, bendAlong = 0.5): string {
  const mx = a[0] + (b[0] - a[0]) * bendAlong;
  const my = a[1] + (b[1] - a[1]) * bendAlong;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len; // perpendiculaire unitaire
  const py = dx / len;
  const cx = mx + px * bendPerp;
  const cy = my + py * bendPerp;
  return `M ${a[0]} ${a[1]} Q ${cx} ${cy} ${b[0]} ${b[1]}`;
}

// Longueur approx d'une quadratique (echantillonnage — suffisant pour strokeDashoffset, pas besoin
// d'une precision analytique ici, meme logique que pathLen mais sur une courbe generee, pas un `d` complexe).
function quadLen(a: [number, number], ctrl: [number, number], b: [number, number], samples = 60): number {
  let total = 0;
  let prev = a;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
    const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
    total += Math.hypot(x - prev[0], y - prev[1]);
    prev = [x, y];
  }
  return total;
}

function pointOnQuad(a: [number, number], ctrl: [number, number], b: [number, number], t: number): [number, number] {
  const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
  const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
  return [x, y];
}

function ctrlOf(a: [number, number], b: [number, number], bendPerp: number, bendAlong = 0.5): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * bendAlong;
  const my = a[1] + (b[1] - a[1]) * bendAlong;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  return [mx + px * bendPerp, my + py * bendPerp];
}

// ===== Points-cles (centroides reels, cf gazoducAfriqueCompleteGeo.json) =====
const NIGERIA = centroids.Nigeria;
const ALGERIA = centroids.Algeria;
const MOROCCO = centroids.Morocco;
const SPAIN = centroids.Spain;

// AAGP : cotier -> golfe de Guinee -> Maroc (point de passage, pas la cible) -> ESPAGNE (cible finale,
// detroit de Gibraltar). 3 segments au lieu de 2 dans le proto precedent (l'ajout Maroc->Espagne).
const AAGP_MID: [number, number] = [NIGERIA[0] - 230, NIGERIA[1] - 60];
const AAGP_CTRL1 = ctrlOf(NIGERIA, AAGP_MID, -40, 0.5);
const AAGP_CTRL2 = ctrlOf(AAGP_MID, MOROCCO, 60, 0.45);
const AAGP_CTRL3 = ctrlOf(MOROCCO, SPAIN, 25, 0.5);
// TSGP : direct Nigeria -> Niger -> Algerie (ligne plus franche a travers le Sahara). Inchange.
const TSGP_CTRL = ctrlOf(NIGERIA, ALGERIA, -35, 0.5);

// ===== Camera : groupe unique translate/scale (pattern CFA/sahelFlatGeo, jamais de viewBox anime) =====
type Cam = { scale: number; tx: number; ty: number };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function camAt(frame: number, total: number): Cam {
  // 0 -> 2.6s : plan large, continent africain entier tient dans le cadre (etablit la geographie).
  // 2.6s -> fin : pan/zoom lent vers le NORD (Nigeria->Maroc->Espagne), pour suivre le tracé AAGP
  // qui sort du cadre initial (l'Espagne est tres haute/hors-cadre au depart par construction du
  // fitExtent qui privilegie le continent africain). Le pan AMENE l'Espagne dans le cadre PENDANT
  // que le trace approche, jamais un cut brusque.
  const t0 = S(2.6);
  const startCenter: [number, number] = [
    (NIGERIA[0] + ALGERIA[0] + MOROCCO[0]) / 3,
    (NIGERIA[1] + ALGERIA[1] + MOROCCO[1]) / 3 + 30,
  ];
  const endCenter: [number, number] = [(MOROCCO[0] + SPAIN[0]) / 2, (MOROCCO[1] + SPAIN[1]) / 2 + 40];
  const startScale = 1.0;
  const endScale = 1.35;
  const p = easeInOut(Math.min(1, Math.max(0, (frame - t0) / (total - t0))));
  const cx = startCenter[0] + (endCenter[0] - startCenter[0]) * p;
  const cy = startCenter[1] + (endCenter[1] - startCenter[1]) * p;
  const scale = startScale + (endScale - startScale) * p;
  return { scale, tx: W / 2 - cx * scale, ty: H / 2 - cy * scale };
}

export const ProtoGazoducAfriqueComplete: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(frame, PROTO_GAZODUC_AFRIQUE_COMPLETE_FRAMES);

  const fadeIn = interpolate(frame, [0, 15], [0, 1], clamp);

  // ═══ SEQUENCAGE NARRATIF (brief Aziz) : le Nigeria (sujet) se dessine SEUL en premier, PUIS le
  // reste du continent suit en VAGUE discrete depuis le Nigeria — jamais tous les pays au meme rythme,
  // jamais aussi visible que le sujet. Le fond doit etre visuellement termine (ou tres avance) AVANT
  // que les 2 traces AAGP/TSGP ne commencent a diverger (T_TRACE_START), pour ne jamais chevaucher
  // "le continent qui se dessine" et "les gazoducs qui partent".
  const T_NIGERIA_START = 0;
  const T_NIGERIA_DONE = S(0.9); // le Nigeria seul, contour+remplissage, ~0.9s — le sujet d'abord
  const T_WAVE_START = S(0.55); // la vague part legerement AVANT que le Nigeria finisse (chevauchement volontaire, cf remarque plus bas)
  const T_WAVE_DONE = S(2.5); // vague terminee 0.3s avant la divergence (2.8s) — jamais de chevauchement confus
  const T_TRACE_START = S(2.8);

  // Nigeria (source commune) : premier a se dessiner, seul, avant que quoi que ce soit d'autre
  // n'apparaisse — meme mecanisme contour+remplissage que CountryOutline, applique tot et vite.
  const nigeriaDraw = interpolate(frame, [T_NIGERIA_START, T_NIGERIA_DONE], [0, 1], clamp);

  // Le reste du continent : VAGUE dont le delai de depart depend de la distance ECRAN au Nigeria
  // (effet organique "ca part du sujet et ca parcourt le continent"), PAS de l'index dans le tableau
  // (qui donnerait un ordre arbitraire/mecanique). Chaque pays a une fenetre de tracé courte (~0.9-1.1s
  // d'ecart start->fin) mais DECALEE selon sa distance — les voisins du Nigeria commencent presque
  // aussitot, les pays lointains (Afrique australe, Madagascar) commencent nettement plus tard.
  const countryDraw = (c: CountryGeo) => {
    if (c.name === "Nigeria") return nigeriaDraw;
    const dist = distFromNigeria.get(c.name) ?? maxDistFromNigeria;
    const delayFrac = dist / maxDistFromNigeria; // 0 (voisin) -> 1 (le plus loin)
    const t0 = T_WAVE_START + delayFrac * (T_WAVE_DONE - T_WAVE_START - S(0.5));
    const t1 = t0 + S(0.5); // geste de tracé court par pays, chevauche legerement le suivant (vague fluide)
    return interpolate(frame, [t0, t1], [0, 1], clamp);
  };
  // Le fond de continent reste discret PAR RAPPORT au Nigeria (dore, 0.85) et aux traces AAGP/TSGP —
  // mais doit rester CLAIREMENT LISIBLE en lui-meme (retour Aziz : "on ne voit meme pas le continent").
  // Plafonds remontes a l'ouverture de la palette CFA (fond neutre CFA = 0.9*p, cf CfaActe2Carte16x9
  // ligne 263) : 0.22/0.4 etaient calibres pour l'ancienne palette tres sombre (BG #0d1526/#070c17) ou
  // meme un plafond bas restait visible par contraste ; sur le fond CFA plus clair, ce meme plafond
  // aurait rendu le continent quasi invisible — exactement le probleme signale.
  const CONTINENT_FILL_CAP = 0.68;
  const CONTINENT_STROKE_CAP = 0.82;

  const nigeriaPulse = 0.6 + 0.4 * Math.sin(frame / 10);

  // divergence : les 2 tracés partent ENSEMBLE du meme point (Nigeria) a partir de ~2.8s.
  // TSGP (Algerie, plus court) finit vers 7.2s. AAGP (3 segments, Nigeria->Maroc->Espagne) finit a 9.6s
  // — c'est CETTE fin (T_AAGP_END) qui pilote la synchro du contour Espagne (brief point 3).
  const T_TSGP_END = S(7.2);
  const T_AAGP_END = S(9.6);
  const aagpReveal = interpolate(frame, [T_TRACE_START, T_AAGP_END], [0, 1], clamp);
  const tsgpReveal = interpolate(frame, [T_TRACE_START, T_TSGP_END], [0, 1], clamp);

  // cibles qui s'illuminent a l'arrivee de chaque tracé
  const algeriaGlow = interpolate(frame, [T_TSGP_END - S(0.1), T_TSGP_END + S(1.0)], [0, 1], clamp);
  const moroccoPassGlow = interpolate(frame, [T_TRACE_START + S(1.5), T_TRACE_START + S(2.3)], [0, 0.5], clamp);

  // ===== EFFET DEMANDE (brief point 3) : le contour de l'ESPAGNE se dessine PROGRESSIVEMENT et doit
  // etre COMPLET PILE quand le tracé AAGP l'atteint. Fenetre IDENTIQUE a aagpReveal (meme
  // interpolate [T_TRACE_START, T_AAGP_END]) => a frame = T_AAGP_END, spainDraw = 1 = aagpReveal.
  // Le tracé et le contour convergent au meme instant par construction (pas un timing arbitraire cale
  // a l'oeil, litteralement la meme fonction interpolate). =====
  const spainDraw = interpolate(frame, [T_TRACE_START, T_AAGP_END], [0, 1], clamp);
  // Remplissage de l'Espagne : demarre SEULEMENT quand le contour a fini de se dessiner (T_AAGP_END),
  // jamais avant — meme principe que PaysTrace (GlobeRecitProto.tsx : fill decale apres traceGestEnd).
  // Fenetre courte (~0.9s) pour un remplissage qui se voit comme un GESTE, pas un fade lent.
  const spainFill = interpolate(frame, [T_AAGP_END, T_AAGP_END + S(0.9)], [0, 1], clamp);

  // === AAGP : 3 segments Bezier (Nigeria->mid->Maroc->Espagne) tracés ensemble via 1 seul strokeDasharray combine ===
  const aagpLen1 = quadLen(NIGERIA, AAGP_CTRL1, AAGP_MID);
  const aagpLen2 = quadLen(AAGP_MID, AAGP_CTRL2, MOROCCO);
  const aagpLen3 = quadLen(MOROCCO, AAGP_CTRL3, SPAIN);
  const aagpTotal = aagpLen1 + aagpLen2 + aagpLen3;
  const aagpProg = aagpReveal * aagpTotal;
  const aagpDraw1 = Math.min(1, aagpProg / aagpLen1);
  const aagpDraw2 = Math.max(0, Math.min(1, (aagpProg - aagpLen1) / aagpLen2));
  const aagpDraw3 = Math.max(0, Math.min(1, (aagpProg - aagpLen1 - aagpLen2) / aagpLen3));
  const aagpD1 = curveD(NIGERIA, AAGP_MID, -40, 0.5);
  const aagpD2 = curveD(AAGP_MID, MOROCCO, 60, 0.45);
  const aagpD3 = curveD(MOROCCO, SPAIN, 25, 0.5);

  // === TSGP : 1 segment direct Nigeria -> Algerie ===
  const tsgpLen = quadLen(NIGERIA, TSGP_CTRL, ALGERIA);
  const tsgpD = curveD(NIGERIA, ALGERIA, -35, 0.5);

  // marqueurs voyageurs le long de chaque tracé (repere visuel du "flux qui avance")
  const aagpMarkerT = Math.min(1, aagpReveal);
  const aagpMarkerPt =
    aagpMarkerT <= 0
      ? null
      : aagpMarkerT * aagpTotal <= aagpLen1
        ? pointOnQuad(NIGERIA, AAGP_CTRL1, AAGP_MID, (aagpMarkerT * aagpTotal) / aagpLen1)
        : aagpMarkerT * aagpTotal <= aagpLen1 + aagpLen2
          ? pointOnQuad(AAGP_MID, AAGP_CTRL2, MOROCCO, (aagpMarkerT * aagpTotal - aagpLen1) / aagpLen2)
          : pointOnQuad(MOROCCO, AAGP_CTRL3, SPAIN, (aagpMarkerT * aagpTotal - aagpLen1 - aagpLen2) / aagpLen3);
  const tsgpMarkerT = Math.min(1, tsgpReveal);
  const tsgpMarkerPt = tsgpMarkerT <= 0 ? null : pointOnQuad(NIGERIA, TSGP_CTRL, ALGERIA, tsgpMarkerT);

  const spainCountry = byName("Spain");

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
            {/* continent africain ENTIER — le Nigeria (sujet) se trace SEUL en premier a pleine
                opacite (cf overlay dore plus bas), le RESTE du continent suit en vague discrete
                (opacite plafonnee CONTINENT_FILL_CAP/CONTINENT_STROKE_CAP — jamais aussi visible
                que le sujet ni que les traces AAGP/TSGP qui arrivent apres). */}
            {countries.map((c) => {
              const isNigeria = c.name === "Nigeria";
              return (
                <CountryOutline
                  key={c.name}
                  c={c}
                  draw={countryDraw(c)}
                  fillOp={isNigeria ? 0 : CONTINENT_FILL_CAP}
                  strokeOp={isNigeria ? 0 : CONTINENT_STROKE_CAP}
                />
              );
            })}

            {/* MAROC — point de PASSAGE (pas la cible), halo discret quand le tracé le traverse */}
            {(() => {
              const maroc = byName("Morocco");
              if (!maroc || moroccoPassGlow <= 0.01) return null;
              return (
                <path
                  d={maroc.d}
                  fill={AAGP_COLOR}
                  fillOpacity={0.1 * moroccoPassGlow}
                  stroke={AAGP_COLOR}
                  strokeWidth={1}
                  strokeOpacity={0.5 * moroccoPassGlow}
                />
              );
            })()}
            {/* ALGERIE — cible TSGP, s'illumine a l'arrivee */}
            {(() => {
              const algerie = byName("Algeria");
              if (!algerie || algeriaGlow <= 0.01) return null;
              return (
                <path
                  d={algerie.d}
                  fill={TSGP_COLOR}
                  fillOpacity={0.15 + 0.35 * algeriaGlow}
                  stroke={TSGP_COLOR}
                  strokeWidth={1.5 + 1.5 * algeriaGlow}
                  strokeOpacity={0.9 * algeriaGlow}
                />
              );
            })()}

            {/* ===== ESPAGNE — cible AAGP finale. GESTE EN 2 TEMPS (pattern PaysTrace, GlobeRecitProto) :
                (1) le contour se dessine PROGRESSIVEMENT en synchro avec le tracé (spainDraw = meme
                fenetre que aagpReveal, complet PILE a l'arrivee) ; (2) PUIS, une fois le contour fini,
                l'interieur se REMPLIT en aplat teal (spainFill, fenetre decalee apres T_AAGP_END).
                Jamais un fade simultane — le remplissage suit strictement, jamais avant. ===== */}
            {spainCountry && spainDraw > 0.001 && (
              <TargetCountryOutline c={spainCountry} draw={spainDraw} fill={spainFill} color={SPAIN_OUTLINE} fillColor={AAGP_COLOR} />
            )}

            {/* ===== TSGP — tracé direct saharien, pointille (traverse le desert) ===== */}
            {tsgpReveal > 0.001 && (
              <>
                <defs>
                  <clipPath id="tsgpClip">
                    <path
                      d={tsgpD}
                      fill="none"
                      stroke="#000"
                      strokeWidth={20}
                      strokeLinecap="round"
                      strokeDasharray={tsgpLen}
                      strokeDashoffset={tsgpLen * (1 - Math.min(1, tsgpReveal))}
                    />
                  </clipPath>
                </defs>
                <path
                  d={tsgpD}
                  fill="none"
                  stroke="rgba(8,10,16,0.55)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={0.5}
                  strokeDasharray={tsgpLen}
                  strokeDashoffset={tsgpLen * (1 - Math.min(1, tsgpReveal))}
                />
                <path
                  d={tsgpD}
                  fill="none"
                  stroke={TSGP_COLOR}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  opacity={0.95}
                  strokeDasharray={tsgpLen}
                  strokeDashoffset={tsgpLen * (1 - Math.min(1, tsgpReveal))}
                />
                <path
                  d={tsgpD}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  opacity={0.6}
                  strokeDasharray="5 9"
                  clipPath="url(#tsgpClip)"
                />
              </>
            )}
            {tsgpMarkerPt && (
              <g transform={`translate(${tsgpMarkerPt[0]} ${tsgpMarkerPt[1]})`}>
                <circle r={14} fill={TSGP_COLOR} opacity={0.22} />
                <circle r={7} fill={TSGP_COLOR} stroke="#fff" strokeWidth={1.6} />
              </g>
            )}

            {/* ===== AAGP — tracé cotier continu, teal (longe l'Atlantique, finit en Espagne) ===== */}
            {aagpReveal > 0.001 && (
              <>
                <path
                  d={aagpD1}
                  fill="none"
                  stroke="rgba(8,10,16,0.55)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={0.5}
                  strokeDasharray={aagpLen1}
                  strokeDashoffset={aagpLen1 * (1 - aagpDraw1)}
                />
                <path
                  d={aagpD1}
                  fill="none"
                  stroke={AAGP_COLOR}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={aagpLen1}
                  strokeDashoffset={aagpLen1 * (1 - aagpDraw1)}
                />
                {aagpDraw1 >= 0.999 && (
                  <>
                    <path
                      d={aagpD2}
                      fill="none"
                      stroke="rgba(8,10,16,0.55)"
                      strokeWidth={7}
                      strokeLinecap="round"
                      opacity={0.5}
                      strokeDasharray={aagpLen2}
                      strokeDashoffset={aagpLen2 * (1 - aagpDraw2)}
                    />
                    <path
                      d={aagpD2}
                      fill="none"
                      stroke={AAGP_COLOR}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray={aagpLen2}
                      strokeDashoffset={aagpLen2 * (1 - aagpDraw2)}
                    />
                  </>
                )}
                {aagpDraw2 >= 0.999 && (
                  <>
                    <path
                      d={aagpD3}
                      fill="none"
                      stroke="rgba(8,10,16,0.55)"
                      strokeWidth={7}
                      strokeLinecap="round"
                      opacity={0.5}
                      strokeDasharray={aagpLen3}
                      strokeDashoffset={aagpLen3 * (1 - aagpDraw3)}
                    />
                    <path
                      d={aagpD3}
                      fill="none"
                      stroke={AAGP_COLOR}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray={aagpLen3}
                      strokeDashoffset={aagpLen3 * (1 - aagpDraw3)}
                    />
                  </>
                )}
              </>
            )}
            {aagpMarkerPt && (
              <g transform={`translate(${aagpMarkerPt[0]} ${aagpMarkerPt[1]})`}>
                <circle r={14} fill={AAGP_COLOR} opacity={0.22} />
                <circle r={7} fill={AAGP_COLOR} stroke="#fff" strokeWidth={1.6} />
              </g>
            )}

            {/* ===== NIGERIA — le SUJET, dore, doit apparaitre en PREMIER (avant tout le reste du
                continent). Fade simple garde (mecanisme deja juge suffisant, cf brief) — retime pour
                demarrer des la frame 0 au lieu d'attendre la fin du continent (l'ancien ordre etait
                inverse : le continent se tracait D'ABORD, Nigeria arrivait apres coup). ===== */}
            {nigeriaDraw > 0.01 &&
              (() => {
                const nigeria = byName("Nigeria");
                if (!nigeria) return null;
                return (
                  <g opacity={nigeriaDraw}>
                    <path d={nigeria.d} fill={NIGERIA_FILL} fillOpacity={0.85} stroke={NIGERIA_STROKE} strokeWidth={2} />
                    <circle
                      cx={NIGERIA[0]}
                      cy={NIGERIA[1]}
                      r={10 + 6 * nigeriaPulse}
                      fill="none"
                      stroke={NIGERIA_FILL}
                      strokeWidth={2}
                      opacity={0.5 * nigeriaPulse}
                    />
                    <circle cx={NIGERIA[0]} cy={NIGERIA[1]} r={7} fill={NIGERIA_FILL} stroke="#fff" strokeWidth={1.6} />
                  </g>
                );
              })()}
          </g>
        </svg>

        {/* legende minimale (repere lecture, pas de sous-titre bas d'ecran — safe zone) */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 100,
            fontFamily: "'Archivo','Arial Narrow',sans-serif",
            color: TARGET_GLOW,
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#8fa3c8", fontWeight: 700 }}>NIGERIA</div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>DEUX GAZODUCS RIVAUX</div>
          <div style={{ display: "flex", gap: 28, marginTop: 14, fontSize: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 4, background: AAGP_COLOR, borderRadius: 2 }} />
              <span>AAGP — cotier, jusqu&apos;en Europe</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 4, background: TSGP_COLOR, borderRadius: 2 }} />
              <span>TSGP — direct, Sahara</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default ProtoGazoducAfriqueComplete;
