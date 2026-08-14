// GazoducActe3CarteTSGP — Acte 3, SEGMENT A, tracé physique TSGP pur (Nigeria->Niger->Algérie), 74.23s.
//
// ⛔⛔ V2 (2026-08-07) — REFONTE COMPLÈTE après verdict Aziz sur le rendu v1 : "littéralement durant
// les 30 premières secondes, tout ce qu'on voit c'est une carte avec un territoire en bleu [...] la
// ligne qui se déplace très lentement, pas de mouvement de caméra, rien [...] catastrophique [...]
// très en dessous de nos standards". 3 DA-briefs critiques (Gemini+Kimi+DeepSeek, --expert
// --with-deepseek, frames réelles jointes) unanimes sur le diagnostic (cf PLAN-ACTES2-5.md § SEGMENT
// A) : la V1 gardait un plan quasi fixe (micro-haltes = quasi immobile) sur 74s pour 3 pays, et le
// comparateur financier était un widget minuscule en coin d'écran, déconnecté de la géographie.
//
// V2 applique le séquençage retenu (convergence 3/3, validé Aziz) : 5 MOUVEMENTS DE CAMÉRA DISTINCTS
// (jamais un plan fixe, jamais linéaire) :
//   1. [0-8s]   Zoom serré Nigeria (origine commune AAGP/TSGP)
//   2. [8-22s]  Travel tracking — la caméra SUIT la tête du tracé en continu vers le Niger
//   3. [22-33s] Dézoom Sahara — révèle l'immensité du désert comme obstacle géographique (le vide
//               EST le message, mais la caméra RECULE activement pour le montrer, pas un cadre figé)
//   4. [33-45s] Zoom AGRESSIF (x5-8) sur Adrar — climax géographique local (chantier réel)
//   5. [45-72s] Dézoom pour la comparaison financière — le dispositif jetons prend le relais
// + Hiérarchie d'état "approached" désormais utilisée sur le Niger (anticipation avant l'arrivée).
// + Dispositif financement/banques ANCRÉ SUR LA CARTE (jetons Lucide aux coordonnées géographiques),
//   remplace la jauge coin d'écran de la V1 — jamais un widget déconnecté de la géographie.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Loop, OffthreadVideo, staticFile } from "remotion";
import geoData from "../../_rnd/d3-16x9/gazoducGeoElargie.json";
import { GeoCountryPlaque } from "../../_shared/mapbox/GeoCountryPlaque";
import { BEATS_A, GAZODUC_A3_CARTE_TSGP_FRAMES } from "./GazoducActe3Timing";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

const BG_TOP = "#3a5488";
const BG_BOT = "#2a3f66";
const LAND = "#4a608e";
const LAND_STROKE = "#e8ecf5";
const GOLD = "#FFC742";
const CYAN = "#00C4FF";

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);

function pathLen(d: string): number {
  if (typeof document === "undefined") return 800;
  const svgNS = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", d);
  try { return path.getTotalLength(); } catch { return 800; }
}
const pathLenCache = new Map<string, number>();
function cachedPathLen(d: string): number {
  const hit = pathLenCache.get(d);
  if (hit !== undefined) return hit;
  const len = pathLen(d);
  pathLenCache.set(d, len);
  return len;
}

const bboxCache = new Map<string, [number, number]>();
function bboxCentroid(d: string): [number, number] {
  const hit = bboxCache.get(d);
  if (hit) return hit;
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const c: [number, number] = [(minX + maxX) / 2, (minY + maxY) / 2];
  bboxCache.set(d, c);
  return c;
}

function ctrlOf(a: [number, number], b: [number, number], bendPerp: number, bendAlong = 0.5): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * bendAlong, my = a[1] + (b[1] - a[1]) * bendAlong;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * bendPerp, my + (dx / len) * bendPerp];
}
function quadLen(a: [number, number], ctrl: [number, number], b: [number, number], samples = 60): number {
  let total = 0; let prev = a;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
    const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
    total += Math.hypot(x - prev[0], y - prev[1]); prev = [x, y];
  }
  return total;
}
function pointOnQuad(a: [number, number], ctrl: [number, number], b: [number, number], t: number): [number, number] {
  return [
    (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0],
    (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1],
  ];
}
function quadD(a: [number, number], ctrl: [number, number], b: [number, number]): string {
  return `M ${a[0]} ${a[1]} Q ${ctrl[0]} ${ctrl[1]} ${b[0]} ${b[1]}`;
}

const NIGERIA = (geoData.centroids as unknown as Record<string, [number, number]>).Nigeria;
const ALGERIA = (geoData.centroids as unknown as Record<string, [number, number]>).Algeria;
const TSGP_COUNTRY_NAMES = ["Nigeria", "Niger", "Algeria"] as const;
const TSGP_COUNTRY_LABELS_FR: Record<string, string> = { Nigeria: "NIGERIA", Niger: "NIGER", Algeria: "ALGÉRIE" };
const tsgpCountries = TSGP_COUNTRY_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const tsgpJalons: [number, number][] = tsgpCountries.map((c) => bboxCentroid(c.d));
const tsgpSegLens = tsgpJalons.slice(0, -1).map((a, i) => Math.hypot(tsgpJalons[i + 1][0] - a[0], tsgpJalons[i + 1][1] - a[1]));
const tsgpTotalLen = tsgpSegLens.reduce((a, b) => a + b, 0) || 1;
const tsgpSegStarts: number[] = [0];
{ let acc = 0; for (const len of tsgpSegLens) { acc += len; tsgpSegStarts.push(acc / tsgpTotalLen); } }

const AAGP_COUNTRY_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;
const aagpCountries = AAGP_COUNTRY_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const aagpJalons: [number, number][] = aagpCountries.map((c) => bboxCentroid(c.d));
const aagpFullD = aagpJalons.slice(0, -1).map((a, i) => quadD(a, ctrlOf(a, aagpJalons[i + 1], -18, 0.5), aagpJalons[i + 1])).join(" ");

type Cam = { scale: number; tx: number; ty: number };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function camFor(center: [number, number], scale: number): Cam {
  return { scale, tx: W / 2 - center[0] * scale, ty: H / 2 - center[1] * scale };
}
function lerpCam(a: Cam, b: Cam, t: number): Cam {
  return { scale: a.scale + (b.scale - a.scale) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t };
}
function buildFullPathSamples(jalons: [number, number][], bendPerp: number, samplesPerSeg = 40): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < jalons.length - 1; i++) {
    const a = jalons[i], b = jalons[i + 1];
    const ctrl = ctrlOf(a, b, bendPerp, 0.5);
    for (let s = 0; s <= samplesPerSeg; s++) {
      if (i > 0 && s === 0) continue;
      pts.push(pointOnQuad(a, ctrl, b, s / samplesPerSeg));
    }
  }
  return pts;
}
function windowBBox(samples: [number, number][], centerIdx: number, backCount: number, aheadCount: number) {
  const i0 = Math.max(0, centerIdx - backCount);
  const i1 = Math.min(samples.length - 1, centerIdx + aheadCount);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = i0; i <= i1; i++) {
    const [x, y] = samples[i];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}
const tsgpFullPath = buildFullPathSamples(tsgpJalons, 14, 60);

// ===== Dessin trait-par-trait du continent (Segment 1 du Beat 1, 2026-08-14) — repris du principe déjà
// prouvé dans AfriqueOpening.tsx (Short AES 90s) : chaque pays se trace en strokeDashoffset avec un
// décalage progressif ouest→est, PAS un simple fade global. Longueurs précalculées une fois (module).
const countriesSorted = [...countries]
  .map((c) => ({ ...c, cx: bboxCentroid(c.d)[0], len: cachedPathLen(c.d) }))
  .sort((a, b) => a.cx - b.cx);

// ===== Caméras-clés des 5 mouvements (retour DA-brief, convergence 3/3) =====
const camSaharaWide = camFor(
  [(tsgpJalons[1][0] + tsgpJalons[2][0]) / 2, (tsgpJalons[1][1] + tsgpJalons[2][1]) / 2 - 15],
  1.1, // Mouvement 3 : dézoom qui révèle VRAIMENT l'immensité (plus large que V1)
);
// Mouvement 4 : zoom AGRESSIF x5-8 (V1 n'était qu'à 2.1), MAIS décalé horizontalement pour que le point
// Adrar se projette à ~36% de la largeur au lieu du centre — sinon la carte-insert chantier (47%->85%)
// le recouvre et l'ancrage géographique disparaît (mesuré : pin à x=966 pile sous l'insert).
// Décalage repris du prototype validé GazoducH3IntegrationTestReal.tsx.
const camAdrarCentered = camFor(ALGERIA, 6.5);
const camAdrarAggressive: Cam = { ...camAdrarCentered, tx: camAdrarCentered.tx - (0.5 - 0.36) * W };
const camDataOverlay = camFor(
  [(NIGERIA[0] + ALGERIA[0]) / 2, (NIGERIA[1] + ALGERIA[1]) / 2],
  1.3, // Mouvement 5 : dézoom large pour laisser respirer le dispositif jetons
);

const B = BEATS_A;
export const GAZODUC_A3_CARTE_TSGP_FRAMES_EXPORT = GAZODUC_A3_CARTE_TSGP_FRAMES;

// ===== Jeton SVG "État" (financement souverain) — sceau/institution généré Fable 5, ancré aux coordonnées géo =====
// Source : public/_rnd/fable-svg/gazoduc-acte3-v3-finition/jeton-etat-financeur.svg (v3, régénéré après
// correctif "dessin main" relevé par les 4 agents studio réutilisable — cf PLAN-ACTES2-5.md).
const JetonEtat: React.FC<{ x: number; y: number; reveal: number; frame: number; label: string }> = ({ x, y, reveal, frame, label }) => {
  if (reveal <= 0.01) return null;
  const pulse = 1 + Math.sin(frame * 0.15) * 0.05 * reveal;
  return (
    <g transform={`translate(${x} ${y}) scale(${reveal * pulse})`} opacity={reveal}>
      <g id="jeton_fond">
        <circle cx={0} cy={0} r={27} fill="#0e192e" stroke={CYAN} strokeWidth={2} />
      </g>
      <g id="jeton_sceau">
        <circle cx={0} cy={0} r={24} fill="none" stroke={CYAN} strokeWidth={1.1} strokeDasharray="1.6 2.4" opacity={0.55} />
      </g>
      <g id="jeton_symbole" fill={CYAN}>
        <g id="symbole_fronton">
          <path d="M -14.5 -6 L 14.5 -6 L 0 -15.2 Z" fill="none" stroke={CYAN} strokeWidth={1.5} strokeLinejoin="round" />
          <rect x={-14.5} y={-6} width={29} height={1.7} />
          <rect x={-13.2} y={-3.9} width={26.4} height={0.7} opacity={0.8} />
        </g>
        <g id="symbole_colonnes">
          {[-12.1, -5.3, 1.5, 8.3].map((cx) => (
            <g key={cx}>
              <rect x={cx} y={-2.6} width={3.8} height={1.0} />
              <rect x={cx + 0.65} y={-1.6} width={1.0} height={8.0} />
              <rect x={cx + 2.15} y={-1.6} width={1.0} height={8.0} />
              <rect x={cx} y={6.4} width={3.8} height={1.0} />
            </g>
          ))}
        </g>
        <g id="symbole_socle">
          <rect x={-13} y={8.0} width={26} height={1.7} />
          <rect x={-15.2} y={9.7} width={30.4} height={1.7} />
        </g>
      </g>
      <g id="jeton_detail">
        <circle id="detail_piece" cx={0} cy={-9} r={1.9} fill={CYAN} />
      </g>
      <text x={0} y={44} textAnchor="middle" fill="#e8ecf5" fontSize={13} fontFamily="'IBM Plex Mono', monospace" fontWeight={700}>{label}</text>
    </g>
  );
};

// ===== Jeton "Banque internationale rejetée" — tour financière fantôme (généré Fable 5), tracé pointillé qui se rompt =====
// Source : public/_rnd/fable-svg/gazoduc-acte3-v3-finition/jeton-banque-retiree.svg (v3, régénéré —
// silhouette de tour à redans en pointillé "absence", distincte du fronton du jeton État actif).
const JetonBanqueRejetee: React.FC<{ x: number; y: number; targetX: number; targetY: number; reveal: number; breakProgress: number }> = ({
  x, y, targetX, targetY, reveal, breakProgress,
}) => {
  if (reveal <= 0.01) return null;
  const midX = x + (targetX - x) * 0.55, midY = y + (targetY - y) * 0.55;
  const lineD = `M ${x} ${y} L ${midX} ${midY}`;
  const lineLen = Math.hypot(midX - x, midY - y);
  const drawProgress = interpolate(breakProgress, [0, 0.6], [0, 1], clampB);
  return (
    <g opacity={reveal}>
      <path d={lineD} fill="none" stroke="#7a8aa8" strokeWidth={2} strokeDasharray={`6 6 ${lineLen}`}
        strokeDashoffset={lineLen * (1 - drawProgress)} opacity={0.7} />
      {breakProgress > 0.6 && (
        <g transform={`translate(${midX} ${midY})`} opacity={interpolate(breakProgress, [0.6, 0.75], [0, 1], clampB)}>
          <line x1={-10} y1={-10} x2={10} y2={10} stroke="#e05252" strokeWidth={3} strokeLinecap="round" />
          <line x1={10} y1={-10} x2={-10} y2={10} stroke="#e05252" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      <g transform={`translate(${x} ${y})`} id="jeton_banque_retiree">
        <g id="fond">
          <circle cx={0} cy={0} r={21} fill="#0e192e" stroke="#7a8aa8" strokeWidth={2} />
        </g>
        <g id="symbole" fill="none" stroke="#7a8aa8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path id="tour_fantome" d="M -7 12 V -6 H -3 V -13 H 3 V -6 H 7 V 12" strokeDasharray="3.2 2.8" />
          <line id="sol" x1={-11} y1={12} x2={11} y2={12} />
        </g>
        <g id="details" fill="none" stroke="#7a8aa8" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path id="porte_close" d="M -2.2 12 V 6.8 H 2.2 V 12" />
        </g>
        <text x={0} y={36} textAnchor="middle" fill="#8fa0bb" fontSize={11} fontFamily="'IBM Plex Mono', monospace">BANQUE INT'L</text>
      </g>
    </g>
  );
};

// ===== Extinction/vacillement organique — repris tel quel du principe `deathFlicker` de
// GazoducActe3InsertSecurite.tsx (même fichier de projet, même mécanique : flicker rapide dans les
// ~6 frames avant l'événement, puis chute nette). Adapté ici en boucle CONTINUE (pas une extinction
// ponctuelle) pour le glow qui VACILLE du tracé TSGP au Beat 4 — cf breakdown § Beat 4.
function deathFlickerLoop(frame: number, seed: number): number {
  const flicker = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.22 + seed) * Math.cos(frame * 0.07 + seed * 0.6));
  return flicker;
}

// (Insert chantier flat-vector supprimé le 2026-08-14 — remplacé par la carte-insert composée avec
// clip MiniMax H3, conforme au storyboard V5. L'ancien pictogramme posé nu sur la carte avait été
// rejeté : "réduit à une icône posée sur la carte, pas un vrai insert composé".)

// ===== Icône "$" qui suit le tracé — geste "financement qui coule" (breakdown Beat 2). Réutilise
// `pointOnQuad` déjà défini plus haut dans ce fichier (mécanisme de position-sur-tracé existant),
// jamais réinventé. `t` = progression 0->1 le long du segment source->Adrar. =====
const IconeFinancement: React.FC<{ pos: [number, number]; opacity: number; color: string }> = ({ pos, opacity, color }) => {
  if (opacity <= 0.01) return null;
  return (
    <g transform={`translate(${pos[0]} ${pos[1]})`} opacity={opacity}>
      <circle cx={0} cy={0} r={13} fill="#0e192e" stroke={color} strokeWidth={2} />
      <text x={0} y={5} textAnchor="middle" fill={color} fontSize={15} fontFamily="'IBM Plex Mono', monospace" fontWeight={800}>$</text>
    </g>
  );
};

// ===== Comparateur "13 Mds$" — cadran/arc circulaire animé (DÉCISION AZIZ, remplace le rectangle HUD
// plat). Jauge courbe qui se remplit de 0 à la proportion du coût TSGP/AAGP (13/26 = 50%), SVG natif,
// pas de lib externe. =====
const CadranComparateur: React.FC<{ frame: number; startFrame: number; countUp: number; opacity: number }> = ({
  frame, startFrame, countUp, opacity,
}) => {
  if (opacity <= 0.01) return null;
  const local = Math.max(0, frame - startFrame);
  const fillT = interpolate(local, [0, S(1.4)], [0, 13 / 26], clampB); // proportion réelle 13/26 Mds$
  const R = 74;
  const CX = 0, CY = 0;
  const startAngle = -220, endAngle = 40; // arc ouvert en bas (jauge, pas un cercle complet)
  const angleAt = (t: number) => (startAngle + (endAngle - startAngle) * t) * (Math.PI / 180);
  const arcPoint = (t: number): [number, number] => {
    const a = angleAt(t);
    return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
  };
  const [x0, y0] = arcPoint(0);
  const [x1FULL, y1FULL] = arcPoint(1);
  const largeFull = endAngle - startAngle > 180 ? 1 : 0;
  const trackD = `M ${x0} ${y0} A ${R} ${R} 0 ${largeFull} 1 ${x1FULL} ${y1FULL}`;
  const [xF, yF] = arcPoint(fillT);
  const largeFill = (endAngle - startAngle) * fillT > 180 ? 1 : 0;
  const fillD = `M ${x0} ${y0} A ${R} ${R} 0 ${largeFill} 1 ${xF} ${yF}`;
  // Bloc CENTRÉ, superposé à la carte assombrie (storyboard V5 beat3-financement-libre.png panneau 02).
  // ⛔ NE PLUS le placer en coin d'écran : la version précédente était calée en `translate(W-150, 340)`
  // pour "éviter une collision" avec les jetons — ce contournement a produit exactement le défaut que
  // les 3 breakdowns interdisent (widget de bord, texte "VS 26 Mds$ AAGP" coupé hors cadre, constaté au
  // rendu 2026-08-14). La bonne réponse au problème de collision est l'assombrissement de la carte
  // derrière le bloc, pas la fuite vers le bord.
  const CX_SCREEN = W * 0.5;
  const CY_SCREEN = H * 0.46;
  // Panneau encadré (storyboard V5) : sans lui le texte flotte à même la carte et se superpose aux
  // jetons — "jamais de texte/label flottant sans support visuel" (règle 2 des breakdowns).
  const PW = 980, PH = 300;
  return (
    <g opacity={opacity}>
      <rect x={CX_SCREEN - PW / 2} y={CY_SCREEN - PH / 2} width={PW} height={PH} rx={10}
        fill="rgba(7, 24, 45, 0.96)" stroke={CYAN} strokeWidth={1.5} />
      <rect x={CX_SCREEN - PW / 2 + 6} y={CY_SCREEN - PH / 2 + 6} width={PW - 12} height={PH - 12} rx={7}
        fill="none" stroke={CYAN} strokeWidth={0.8} opacity={0.3} />
      <g transform={`translate(${CX_SCREEN - 250} ${CY_SCREEN})`}>
        <path d={trackD} fill="none" stroke="#1c2b4a" strokeWidth={14} strokeLinecap="round" />
        <path d={fillD} fill="none" stroke={CYAN} strokeWidth={14} strokeLinecap="round" />
        <text x={0} y={-2} textAnchor="middle" fill="#e8ecf5" fontSize={54} fontWeight={800}
          fontFamily="'IBM Plex Mono', monospace">{countUp}</text>
        <text x={0} y={30} textAnchor="middle" fill={CYAN} fontSize={20} fontWeight={700}
          fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.05em">Mds$</text>
      </g>
      {/* Séparateur + "x2 moins cher que l'AAGP (26 Mds$)" — à DROITE du cadran, dans le même bloc
          centré, jamais rejeté au bord de l'écran. */}
      <line x1={CX_SCREEN - 110} y1={CY_SCREEN - 70} x2={CX_SCREEN - 110} y2={CY_SCREEN + 70}
        stroke="#5E789A" strokeWidth={1} opacity={0.45} />
      <text x={CX_SCREEN - 70} y={CY_SCREEN - 18} fill="#e8ecf5" fontSize={46} fontWeight={800}
        fontFamily="'IBM Plex Mono', monospace">x2</text>
      <text x={CX_SCREEN + 10} y={CY_SCREEN - 26} fill="#e8ecf5" fontSize={20}
        fontFamily="'IBM Plex Mono', monospace">moins cher que</text>
      <text x={CX_SCREEN + 10} y={CY_SCREEN + 2} fill="#e8ecf5" fontSize={20}
        fontFamily="'IBM Plex Mono', monospace">l&apos;AAGP (26 Mds$)</text>
    </g>
  );
};

// ===== Triangle d'alerte — apparaît en stagger le long du tracé algérien (Beat 4). =====
const TriangleAlerte: React.FC<{ x: number; y: number; opacity: number; frame: number }> = ({ x, y, opacity, frame }) => {
  if (opacity <= 0.01) return null;
  const pulse = 1 + Math.sin(frame * 0.3) * 0.08;
  return (
    <g transform={`translate(${x} ${y}) scale(${pulse})`} opacity={opacity}>
      <path d="M 0 -11 L 10 8 L -10 8 Z" fill="#e05252" opacity={0.22} />
      <path d="M 0 -8 L 7.5 6 L -7.5 6 Z" fill="none" stroke="#ff8a5c" strokeWidth={2} strokeLinejoin="round" />
      <rect x={-0.9} y={-3.5} width={1.8} height={5.5} rx={0.9} fill="#ff8a5c" />
      <circle cx={0} cy={4} r={1} fill="#ff8a5c" />
    </g>
  );
};

export const GazoducActe3CarteTSGP: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalFadeIn = interpolate(frame, [0, S(0.5)], [0, 1], clampB);
  const globalFadeOut = interpolate(frame, [B.segEnd + 9 - S(0.3), B.segEnd + 9], [1, 0], clampB);

  // ===== BEAT 1 RÉÉCRIT v5 (2026-08-14, retour Aziz sur v4) — 4 corrections :
  // 1. Dessin trait-par-trait étendu à TOUS les pays visibles (pas que l'Afrique) — countriesSorted
  //    couvre déjà countries entier (monde), seule la fenêtre temporelle était trop courte.
  // 2. Palette de fond INCHANGÉE (identique à l'Acte 2 validé, BG_TOP/BG_BOT/LAND jamais modifiés) —
  //    l'écart perçu venait du stroke renforcé pendant le dessin (0.85 vs 0.32 en régime établi).
  // 3. Caméra CONTINUE (une seule trajectoire lissée 0->22.2s, pas de paliers par mot) + tracé TSGP qui
  //    démarre à TRACE_START (~6.3s, une respiration après la fin du dessin — pas pile à S1_END, pour
  //    laisser le théâtre "se poser" avant que l'action ne reparte), PAS synchronisé au mot "Nigeria"
  //    (16.9s) — le trajet complet Nigeria->Niger doit avoir le temps de se jouer sur le temps restant.
  // 4. Nigeria traité EXACTEMENT comme Niger/Algérie (countryState générique, contour qui s'allume au
  //    passage de la ligne) — suppression du pin/label spécial et du reveal synchronisé au mot exact.
  const S1_END = S(5.0); // dessin du monde visible, un peu plus long qu'avant (3.8s) pour laisser respirer
  const TRACE_START = S(6.3); // micro-pause active après le dessin, avant que le tracé ne parte

  // Segment 1 : dessin trait-par-trait de TOUS les pays (monde), mais le STAGGER est calibré sur la
  // plage de longitudes de l'AFRIQUE seule, pas du monde entier — sinon la vague ouest->est démarre
  // au large du Brésil et il ne se passe visiblement rien au centre du cadre pendant ~1.5s (mesuré :
  // 0.4-0.7% de pixels modifiés entre frames de 0.75s à 1.5s). Les pays hors de cette plage (Brésil à
  // l'ouest, Arabie à l'est) sont simplement clampés aux extrémités de la vague.
  const continentDrawProgress = (cx: number, minCx: number, maxCx: number): number => {
    const spanCx = Math.max(1, maxCx - minCx);
    const rel = Math.max(0, Math.min(1, (cx - minCx) / spanCx));
    const t0 = rel * (S1_END - S(1.2)); // stagger ouest->est, dernier pays démarre avant S1_END-1.2s
    return interpolate(frame, [t0, t0 + S(1.2)], [0, 1], clampB);
  };
  // Bornes = enveloppe longitudinale de l'Afrique (Sénégal/Mauritanie à l'ouest -> Somalie à l'est),
  // dérivée des pays réels plutôt que codée en dur.
  const continentCxRange = (() => {
    const west = byName("Senegal"), east = byName("Somalia");
    const mn = west ? bboxCentroid(west.d)[0] : 0;
    const mx = east ? bboxCentroid(east.d)[0] : W;
    return [mn, mx] as [number, number];
  })();

  // Le tracé TSGP démarre à TRACE_START (~6.3s) et progresse en continu jusqu'à la frontière Niger à
  // 22.2s (B.traceNigerStart) — plus d'attente du mot "Nigeria", le trajet occupe la fenêtre disponible
  // pour être visible et lisible pendant qu'il se joue (retour Aziz : "on ne voit même pas le trajet
  // [...] on dessine et on fait jouer la scène").
  const traceGlobalT = interpolate(
    frame,
    [TRACE_START, B.traceNigerStart, B.traceSaharaStart, B.traceAlgerieApproach, B.adrarArriveEnd],
    [0, 0.96 * tsgpSegStarts[1], tsgpSegStarts[1] * 1.05, tsgpSegStarts[1] * 1.4, 1],
    clampB,
  );

  // ===== CAMÉRA BEAT 1 — CONTINUE, mécanisme PROUVÉ et déjà en production dans la scène jumelle :
  // GazoducActe2AAGP.tsx L220-278 (validée par Aziz), prototype d'origine ProtoGazoducA2CameraVsVoisins.tsx
  // (ProtoA2CameraContinue L246-317, écrit précisément pour ce problème le 2026-08-03).
  //
  // ⛔⛔ NE JAMAIS revenir à une liste de points de contrôle + easeInOut PAR SEGMENT (3 itérations
  // perdues là-dessus, 2026-08-14) : easeInOut a une dérivée NULLE à ses 2 extrémités, donc appliqué
  // par segment il met la vitesse caméra à EXACTEMENT 0 à chaque point de passage. Mesuré sur la
  // version rejetée : 7 arrêts complets en 22s (v=0.00 px/frame aux 7 keypoints, zoom d(scale)=0.0000).
  // La position restait continue (aucun saut visible) mais la VITESSE était discontinue — c'est
  // exactement le "elle approche, stop, elle approche, stop" décrit par Aziz. Ce n'est PAS un problème
  // de dosage : retoucher les valeurs des points ne corrige jamais ce symptôme.
  //
  // Phase 1 [0 -> TRACE_START] : UN SEUL zoom continu monde -> Nigeria, un seul easing sur toute la
  //                              phase (easeOut : part franc, ralentit en arrivant), donc UNE seule
  //                              décélération, à la fin.
  // Phase 2 [TRACE_START -> traceSaharaStart] : la caméra SUIT la tête du tracé, position recalculée
  //                              CHAQUE FRAME (fenêtre de sillage + anticipation) — aucun palier
  //                              possible par construction.
  // Position EXACTE de la tête du tracé, interpolée en continu le long des samples (pas d'index
  // arrondi : l'index entier ferait avancer la caméra par paliers d'un sample, mesuré à 765 px/frame
  // de pic sur une variante bbox+Math.round — le remède serait pire que le mal).
  const headAt = (t: number): [number, number] => {
    const fi = Math.max(0, Math.min(1, t)) * (tsgpFullPath.length - 1);
    const i0 = Math.floor(fi), i1 = Math.min(tsgpFullPath.length - 1, i0 + 1);
    const fr = fi - i0;
    const a = tsgpFullPath[i0], b = tsgpFullPath[i1];
    return [a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr];
  };
  const camWideStart = camFor(NIGERIA, 1.0);
  let cam: Cam;
  if (frame < B.traceSaharaStart) {
    // UNE SEULE formulation continue pour toute la fenêtre 0 -> 23.9s, sans aucun branchement interne :
    //  - le zoom est une fonction MONOTONE du temps (jamais de palier, jamais de retour en arrière) ;
    //  - le centre glisse du Nigeria vers la tête du tracé, qui est elle-même continue.
    // La vitesse ne peut donc jamais tomber à zéro en cours de route.
    const zoom = interpolate(frame, [0, TRACE_START, B.traceSaharaStart], [1.0, 2.2, 3.0], {
      ...clampB,
      easing: (t) => 1 - Math.pow(1 - t, 2.2), // un seul easing, sur toute la plage
    });
    const head = headAt(traceGlobalT);
    // Avant TRACE_START le centre reste le Nigeria ; après, il rejoint progressivement la tête du
    // tracé sur ~1.2s puis la suit exactement — transition douce, sans saut de cadrage.
    const followBlend = interpolate(frame, [TRACE_START, TRACE_START + S(1.2)], [0, 1], clampB);
    const center: [number, number] = [
      NIGERIA[0] + (head[0] - NIGERIA[0]) * followBlend,
      NIGERIA[1] + (head[1] - NIGERIA[1]) * followBlend,
    ];
    cam = camFor(center, zoom);
  } else if (frame < B.traceAlgerieApproach) {
    // MOUVEMENT 3 [22-33s] : dézoom actif qui révèle le Sahara comme obstacle — la caméra RECULE,
    // ce n'est jamais un cadre figé même si le sujet est le vide.
    const p = easeInOut((frame - B.traceSaharaStart) / (B.traceAlgerieApproach - B.traceSaharaStart));
    const tAhead = Math.min(1, traceGlobalT + 0.06);
    const idx = Math.round(tAhead * (tsgpFullPath.length - 1));
    const bbox = windowBBox(tsgpFullPath, idx, Math.round(tsgpFullPath.length * 0.35), Math.round(tsgpFullPath.length * 0.08));
    const center: [number, number] = [(bbox.minX + bbox.maxX) / 2, (bbox.minY + bbox.maxY) / 2];
    const spanX = Math.max(80, bbox.maxX - bbox.minX), spanY = Math.max(80, bbox.maxY - bbox.minY);
    const scaleFit = Math.min((W * 0.55) / spanX, (H * 0.55) / spanY, 3.5);
    const camTrackStart = camFor(center, Math.max(2.2, scaleFit));
    cam = lerpCam(camTrackStart, camSaharaWide, p);
  } else if (frame < B.adrarArriveEnd) {
    // MOUVEMENT 4 [33-45s] : ZOOM AGRESSIF sur Adrar, spring raide pour un vrai impact d'arrivée.
    // FIX (2026-08-14) : le spring convergeait en ~2s puis la caméra restait immobile jusqu'à la fin du
    // mouvement (contribuait au trou de 12s mesuré autour de 28.7s). On étale l'arrivée sur toute la
    // fenêtre et on ajoute une poussée continue qui ne sature jamais.
    const p = spring({ frame: frame - B.traceAlgerieApproach, fps, config: { damping: 26, mass: 2.6 } });
    const camArr = lerpCam(camSaharaWide, camAdrarAggressive, Math.min(1, p));
    const t4 = Math.max(0, frame - B.traceAlgerieApproach);
    const push4 = interpolate(t4, [0, B.adrarArriveEnd - B.traceAlgerieApproach], [0, 1], clampB);
    cam = {
      scale: camArr.scale * (1 + 0.07 * push4),
      tx: camArr.tx - push4 * 40 + Math.sin(t4 * 0.007) * 10,
      ty: camArr.ty + push4 * 22 + Math.cos(t4 * 0.006) * 8,
    };
  } else if (frame < B.coutEmphaseStart) {
    // Hold sur Adrar pendant chantier/Sonatrach. Le drift d'origine (±6px) était trop faible pour se
    // lire comme du mouvement : push-in continu ajouté par-dessus, jamais figé (règle >5s).
    const tH = frame - B.adrarArriveEnd;
    const holdSpan = Math.max(1, B.coutEmphaseStart - B.adrarArriveEnd);
    const holdPush = interpolate(tH, [0, holdSpan], [0, 1], clampB);
    const driftT = tH * 0.008;
    cam = {
      scale: camAdrarAggressive.scale * (1 + 0.085 * holdPush),
      tx: camAdrarAggressive.tx + Math.sin(driftT) * 14 - holdPush * 30,
      ty: camAdrarAggressive.ty + Math.cos(driftT * 0.7) * 10 + holdPush * 18,
    };
  } else {
    // MOUVEMENT 5 [45-72s] : dézoom pour la comparaison financière, le dispositif jetons prend le relais.
    // FIX (2026-08-14) : le dézoom se terminait en 3s puis la caméra restait FIGÉE ~14s pendant tout le
    // panneau financier (mesuré : 14.0s consécutives sous 0.5% de pixels modifiés à partir de 58.2s).
    // Le dézoom s'étale maintenant sur toute la durée du beat et se prolonge par une dérive lente et
    // continue — jamais d'arrêt net, conformément à la règle "rien de statique >5s".
    const beatDur = Math.max(1, B.financementEtatsEnd - B.coutEmphaseStart);
    const p = easeInOut(Math.min(1, (frame - B.coutEmphaseStart) / (beatDur * 0.55)));
    const camBase5 = lerpCam(camAdrarAggressive, camDataOverlay, p);
    // Dérive continue : léger recul + glissement, actif sur toute la fenêtre (y compris après p=1).
    const t5 = Math.max(0, frame - B.coutEmphaseStart);
    const creep = interpolate(t5, [0, beatDur], [0, 1], clampB);
    cam = {
      scale: camBase5.scale * (1 - 0.06 * creep),
      tx: camBase5.tx + Math.sin(t5 * 0.006) * 26 + creep * 34,
      ty: camBase5.ty + Math.cos(t5 * 0.0045) * 18 - creep * 16,
    };
  }
  const continentReveal = interpolate(frame, [0, S(0.7)], [0, 1], clampB);

  // Nigeria traité EXACTEMENT comme Niger/Algérie (retour Aziz 2026-08-14) : plus de reveal spécial
  // synchronisé au mot exact — le contour s'allume au passage du tracé, piloté par traceGlobalT comme
  // les 2 autres pays du trajet.
  // FIX (même session) : un pays déjà traversé ("traversed") RESTE marqué en continu au lieu de
  // s'éteindre après la fenêtre "active" — sinon le trait s'illumine puis s'éteint derrière la tête du
  // tracé, ce qui contredit "quelque chose de physique qui se passe [...] jusqu'à la destination finale"
  // (retour Aziz). Seul le dernier pays (Algérie) garde un état "destination" distinct, plus marqué.
  function countryState(idx: number): "inactive" | "approached" | "active" | "traversed" | "destination" {
    // Rien ne s'allume tant que le tracé n'est pas parti : traceGlobalT est clampé à 0 avant
    // TRACE_START, donc sans ce garde le Nigeria (tsgpSegStarts[0]=0) serait "active" dès la frame 0,
    // pendant le dessin du continent (constaté au rendu : pays déjà cyan à 1.3s).
    if (frame < TRACE_START) return "inactive";
    if (idx === tsgpCountries.length - 1 && traceGlobalT >= tsgpSegStarts[idx] - 0.03) return "destination";
    const segT = tsgpSegStarts[idx];
    if (traceGlobalT >= segT + 0.1) return "traversed"; // déjà passé, reste marqué (discret) jusqu'à la fin
    if (traceGlobalT >= segT - 0.06 && traceGlobalT < segT + 0.1) return "active";
    if (traceGlobalT >= segT - 0.22 && traceGlobalT < segT - 0.06) return "approached"; // fenêtre élargie (retour DA-brief : "approached" jamais utilisé en V1)
    return "inactive";
  }

  const NIGERIA_IDX = 0;
  const ALGERIA_IDX = tsgpCountries.length - 1;
  // ===== Fenêtres de labels — Nigeria suit maintenant le même principe que Niger/Algérie : apparaît
  // quand le tracé atteint/quitte le pays (traceGlobalT), plus de fenêtre fixe par mot narré.
  function plaqueWindow(idx: number): { appearAt: number; hideAt: number } | null {
    // Nigeria : ~2s à l'écran puis s'efface (retour Aziz 2026-08-14 — il restait 17s affiché, il
    // encombrait le cadre pendant tout le voyage alors que le pays reste marqué par son contour).
    if (idx === NIGERIA_IDX) return { appearAt: S1_END + S(0.3), hideAt: S1_END + S(2.6) };
    if (idx === ALGERIA_IDX) return { appearAt: B.traceSaharaStart + S(1.55), hideAt: B.adrarArriveEnd - S(1) };
    // Niger : label court du Mouvement 2 (breakdown p02_label_niger, 22.45s->27.6s), s'efface avant le
    // hold Adrar pour ne pas polluer le cadre serré du Mouvement 4.
    return { appearAt: B.traceNigerStart + S(0.2), hideAt: B.adrarArriveEnd - S(1) };
  }

  // ===== Dispositif jetons financement — ANCRÉ SUR LA CARTE, jamais un widget coin d'écran =====
  const jetonEtatReveal = interpolate(frame, [B.coutEmphaseStart, B.coutEmphaseStart + S(1)], [0, 1], clampB);
  const jetonEtatOut = interpolate(frame, [B.financementEtatsEnd, B.financementEtatsEnd + S(0.8)], [1, 0], clampB);
  const banqueReveal = interpolate(frame, [B.treizeMdsStart + S(4), B.treizeMdsStart + S(5)], [0, 1], clampB);
  const banqueBreak = interpolate(frame, [B.treizeMdsStart + S(5), B.financementEtatsEnd - S(0.5)], [0, 1], clampB);
  const treizeCountUp = Math.round(interpolate(frame, [B.treizeMdsStart, B.treizeMdsStart + S(1.2)], [0, 13], clampB));
  // Comparateur retardé APRÈS le geste financement (breakdown Beat 2 : "la preuve visuelle précède le
  // chiffre, pas l'inverse") — apparaît maintenant à coutEmphaseStart comme avant (le geste lui-même se
  // joue plus tôt, dans la fenêtre pelleteusesStart->coutEmphaseStart, cf ci-dessous).
  const coutLabelOpacity = interpolate(frame, [B.coutEmphaseStart, B.coutEmphaseStart + S(0.6), B.treizeMdsStart + S(1)], [0, 1, 1], clampB);

  // ===== BEAT 2 — Chantier Adrar : vignette/darkening + insert flat-vector + geste financement =====
  // Fenêtre : pelleteusesStart (43.07s) -> coutEmphaseStart (55.03s), ~12s de hold Adrar déjà existant
  // (Mouvement 4 hold). Micro-pause caméra = le hold lui-même (drift léger déjà en place ligne ~318).
  const beat2Start = B.pelleteusesStart;
  const beat2GestureEnd = B.coutEmphaseStart - S(0.8); // le geste $ doit finir AVANT que le comparateur ne prenne le relais
  // Vignette/darkening — même principe que `darkenOverlay` de GazoducActe3InsertSecurite.tsx : le reste
  // de la carte s'assombrit pour focaliser l'œil sur Adrar seul pendant le chantier.
  const chantierDarken = interpolate(
    frame,
    [beat2Start, beat2Start + S(1), beat2GestureEnd, beat2GestureEnd + S(0.6)],
    [0, 0.7, 0.7, 0],
    clampB,
  );
  const chantierReveal = interpolate(frame, [beat2Start, beat2Start + S(0.8)], [0, 1], clampB);

  // ===== Insert chantier COMPOSÉ (storyboard V5 beat2-chantier-libre.png, panneau TURNING_POINT) =====
  // Remplace l'ancien pictogramme flat-vector posé nu sur la carte (rejeté : "réduit à une icône posée
  // sur la carte, pas un vrai insert composé"). Mécanique reprise TELLE QUELLE du prototype validé
  // src/projects/_rnd/svg-scenes/GazoducH3IntegrationTestReal.tsx : carte-overlay encadrée contenant le
  // clip MiniMax H3 en boucle (pelleteuse réelle en action), badge date, jauge circulaire de chantier,
  // badge d'activité, reliée au pin Adrar par un connecteur doré, carte assombrie derrière.
  const insertStart = beat2Start + S(1.0);
  const insertEnd = beat2GestureEnd;
  const insertCardIn = interpolate(frame, [insertStart, insertStart + S(0.45)], [0, 1], clampB);
  const insertCardOut = interpolate(frame, [insertEnd - S(0.35), insertEnd], [1, 0], clampB);
  const insertCardOpacity = frame < insertEnd - S(0.35) ? insertCardIn : insertCardOut;
  const insertCardScale = interpolate(insertCardIn, [0, 1], [0.94, 1]);
  const insertConnectorDraw = interpolate(frame, [insertStart, insertStart + S(0.4)], [0, 1], clampB);
  // Jauge : 0 -> 37% (chiffre du storyboard V5, "TRAVAUX EN COURS").
  const insertProgress = interpolate(frame, [insertStart + S(0.7), insertStart + S(1.7)], [0, 0.37], clampB);
  const insertBadgeOpacity = interpolate(frame, [insertStart + S(1.15), insertStart + S(1.4)], [0, 1], clampB);

  // Icônes $ qui descendent le long du tracé depuis Algérie ET Nigeria vers Adrar (breakdown : "les
  // États eux-mêmes payent"). 3 icônes échelonnées, 2 depuis l'Algérie (segment le plus proche d'Adrar)
  // + 1 depuis le Nigeria (parcourt tout le tracé), convergent visuellement sur Adrar.
  const financeGestureStart = beat2Start + S(2.2);
  const financeGestureDur = S(3.6);
  const coinAlgerie1T = interpolate(frame, [financeGestureStart, financeGestureStart + financeGestureDur], [0, 1], clampB);
  const coinAlgerie2T = interpolate(frame, [financeGestureStart + S(0.9), financeGestureStart + S(0.9) + financeGestureDur], [0, 1], clampB);
  const coinNigeria1T = interpolate(frame, [financeGestureStart + S(0.4), financeGestureStart + S(0.4) + financeGestureDur * 1.3], [0, 1], clampB);
  const coinAlgerie1Op = interpolate(coinAlgerie1T, [0, 0.08, 0.92, 1], [0, 1, 1, 0], clampB);
  const coinAlgerie2Op = interpolate(coinAlgerie2T, [0, 0.08, 0.92, 1], [0, 1, 1, 0], clampB);
  const coinNigeria1Op = interpolate(coinNigeria1T, [0, 0.08, 0.92, 1], [0, 1, 1, 0], clampB);
  const screenOf = (geo: [number, number]): [number, number] => [geo[0] * cam.scale + cam.tx, geo[1] * cam.scale + cam.ty];
  const [nigeriaSX, nigeriaSY] = screenOf(NIGERIA);
  const [algeriaSX, algeriaSY] = screenOf(ALGERIA);
  const nigerCentroid = tsgpJalons[1];
  const [nigerSX, nigerSY] = screenOf(nigerCentroid);
  // Ancre Adrar = centre écran pendant le hold Mouvement 4 (camAdrarAggressive centre déjà sur ALGERIA).
  const [adrarSX, adrarSY] = [algeriaSX, algeriaSY];
  // Icônes $ en ESPACE ÉCRAN (plus robuste que suivre le path géo à ce niveau de zoom x6.5) : une paire
  // parcourt un court trajet local depuis le pin Algérie (juste au-dessus) vers Adrar, une autre part
  // du pin Nigeria (hors-cadre à ce zoom, on la fait surgir du bord haut-gauche de l'écran) — geste
  // "financement qui coule" réutilisant `interpolate` sur une position, comme demandé par le breakdown.
  const coinAlgerie1Pos: [number, number] = [
    interpolate(coinAlgerie1T, [0, 1], [adrarSX - 46, adrarSX], clampB),
    interpolate(coinAlgerie1T, [0, 1], [adrarSY - 220, adrarSY], clampB),
  ];
  const coinAlgerie2Pos: [number, number] = [
    interpolate(coinAlgerie2T, [0, 1], [adrarSX + 58, adrarSX], clampB),
    interpolate(coinAlgerie2T, [0, 1], [adrarSY - 190, adrarSY], clampB),
  ];
  const coinNigeria1Pos: [number, number] = [
    interpolate(coinNigeria1T, [0, 1], [adrarSX - 340, adrarSX], clampB),
    interpolate(coinNigeria1T, [0, 1], [adrarSY - 260, adrarSY], clampB),
  ];

  // ===== BEAT 4 — Paradoxe intégré SUR LA CARTE (breakdown § Beat 4) =====
  // ⚠️ ÉCART AU BREAKDOWN, signalé explicitement : le breakdown demande cette séquence "dans le
  // prolongement direct du Mouvement 5, pas de cut". Le timing audio-locked (GazoducActe3Timing.ts,
  // narration-p3.mp3 mesurée ffprobe) ne laisse que ~1.6s de hold après financementEtatsEnd avant
  // AUDIO_SAFETY_MARGIN_F (+9f/300ms) et la coupe nette de Sequence côté GazoducActe3Montage.tsx —
  // pas le budget d'un beat narré séparé. Le paradoxe narré (Maroc/Algérie) est de toute façon porté
  // par le Segment C existant (InsertParadoxe.tsx, texte "Le Maroc mise sur.../L'Algérie mise sur...").
  // Ici on joue donc un ÉCHO VISUEL COMPRIMÉ dans le tail disponible (financementEtatsEnd -> segEnd+9,
  // ~1.9s) — flicker + triangles + AAGP boost + whip-pan simultanés plutôt que séquencés, 2 labels
  // courts qui flashent. Reste à valider par Aziz au rendu ; si jugé trop rapide/illisible, la vraie
  // solution est de redécouper le budget temporel en amont (storyboarder), pas de casser l'audio-lock ici.
  const beat4Start = B.financementEtatsEnd;
  const beat4End = B.segEnd + 9;
  const beat4Reveal = interpolate(frame, [beat4Start, beat4Start + S(0.3)], [0, 1], clampB);
  const beat4Active = frame >= beat4Start;
  // Glow TSGP doré stable -> orange-rouge vacillant, via deathFlickerLoop (principe deathFlicker repris
  // de GazoducActe3InsertSecurite.tsx, adapté en boucle continue pour ce contexte "vacille en continu").
  const tsgpFlicker = beat4Active ? deathFlickerLoop(frame, 0) : 1;
  // AAGP (Maroc) boosté LOCALEMENT à ce beat seulement — le reste du fichier garde 0.16*continentReveal.
  const aagpBeat4Opacity = interpolate(frame, [beat4Start, beat4Start + S(0.4)], [0.16, 0.62], clampB) * continentReveal;
  // Whip-pan léger ouest-est entre le tracé Maroc (à l'ouest de la carte) et la zone Adrar/conflit —
  // décalage additif appliqué au groupe caméra existant, ne remplace pas `cam` (reste cohérent avec
  // camFor/lerpCam déjà utilisés pour tous les mouvements précédents).
  const whipPanT = interpolate(frame, [beat4Start, beat4Start + S(0.9)], [0, 1], { ...clampB, easing: easeInOut });
  const whipPanX = interpolate(whipPanT, [0, 1], [-90, 0]);
  // Triangles d'alerte en stagger le long du segment Niger->Algérie (zone de conflit) — 4 points espacés.
  const alertTriangleTs = [0.35, 0.55, 0.72, 0.88];
  const alertStaggerStep = S(0.22);
  const label1Opacity = interpolate(frame, [beat4Start + S(0.5), beat4Start + S(0.8), beat4End - S(0.5), beat4End], [0, 1, 1, 0], clampB);
  const label2Opacity = interpolate(frame, [beat4Start + S(0.75), beat4Start + S(1.05), beat4End - S(0.5), beat4End], [0, 1, 1, 0], clampB);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)`, opacity: globalFadeIn * globalFadeOut }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cam.tx + whipPanX} ${cam.ty}) scale(${cam.scale})`}>
          {countriesSorted.map((c, i) => {
            // Segment 1 (0-3.8s) : dessin trait-par-trait ouest->est (cf continentDrawProgress) — au-delà
            // de S1_END le pays reste simplement affiché plein (continentReveal legacy pour beats suivants).
            const drawP = frame < S1_END
              ? continentDrawProgress(c.cx, continentCxRange[0], continentCxRange[1])
              : 1;
            const fillOp = frame < S1_END ? 0.5 * drawP : 0.5 * continentReveal;
            const strokeOp = frame < S1_END ? 0.85 * drawP : 0.32 * continentReveal;
            if (drawP <= 0) return null;
            return (
              <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={fillOp}
                stroke={LAND_STROKE} strokeOpacity={strokeOp} strokeWidth={0.85}
                strokeDasharray={frame < S1_END ? c.len : undefined}
                strokeDashoffset={frame < S1_END ? c.len * (1 - drawP) : undefined} />
            );
          })}
          {/* AAGP (Maroc) — filigrane 0.16 par défaut, boosté LOCALEMENT au Beat 4 pour le contraste
              stable(Maroc)/vacillant(Algérie) demandé par le breakdown (jamais boosté globalement). */}
          <path d={aagpFullD} fill="none" stroke={GOLD} strokeWidth={beat4Active ? 3.2 : 2.2}
            strokeOpacity={beat4Active ? aagpBeat4Opacity : 0.16 * continentReveal} strokeLinecap="round" />

          {/* Nigeria traité comme Niger/Algérie via tsgpCountries.map ci-dessous — plus de rendu dédié
              (retour Aziz 2026-08-14 : contour qui s'allume au passage du tracé, pas de reveal spécial). */}

          {/* Point de départ du tracé, ancré au centroïde Nigeria — l'origine physique doit être visible
              avant que la ligne ne parte (retour Aziz 2026-08-14 : "on remet un point de départ à
              l'intérieur du Nigeria, où la flèche se trace"). Discret : c'est une amorce, pas le pin
              pulsé "traitement spécial" écarté plus tôt. Rayon divisé par cam.scale => taille écran
              constante malgré le zoom continu (piège classique, cf GoldRouteAtlasZoom). */}
          {(() => {
            const originReveal = interpolate(frame, [TRACE_START - S(0.8), TRACE_START], [0, 1], clampB);
            if (originReveal <= 0.01) return null;
            const [ox, oy] = tsgpJalons[0];
            const rBase = 3.2 / cam.scale;
            return (
              <g opacity={originReveal}>
                <circle cx={ox} cy={oy} r={rBase * 2.6} fill={CYAN} fillOpacity={0.18} />
                <circle cx={ox} cy={oy} r={rBase} fill={CYAN} />
              </g>
            );
          })()}

          {tsgpJalons.slice(0, -1).map((a, i) => {
            const b = tsgpJalons[i + 1];
            const segT0 = tsgpSegStarts[i], segT1 = tsgpSegStarts[i + 1];
            const segReveal = interpolate(traceGlobalT, [segT0, segT1], [0, 1], clampB);
            if (segReveal <= 0) return null;
            const ctrl = ctrlOf(a, b, 14, 0.5);
            const len = quadLen(a, ctrl, b);
            // Beat 4 : glow doré stable -> orange-rouge qui VACILLE (deathFlickerLoop, principe repris
            // de GazoducActe3InsertSecurite.tsx deathFlicker, cf breakdown § Beat 4).
            const strokeColor = beat4Active ? "#ff5a3c" : CYAN;
            const strokeOp = beat4Active ? tsgpFlicker : 1;
            return (
              <g key={`tsgp-seg-${i}`} opacity={strokeOp}>
                {beat4Active && (
                  <path d={quadD(a, ctrl, b)} fill="none" stroke={strokeColor} strokeWidth={9} strokeLinecap="round"
                    strokeDasharray={len} strokeDashoffset={len * (1 - segReveal)} opacity={0.35} />
                )}
                <path d={quadD(a, ctrl, b)} fill="none" stroke={strokeColor}
                  strokeWidth={3.6} strokeLinecap="round"
                  strokeDasharray={len} strokeDashoffset={len * (1 - segReveal)} />
              </g>
            );
          })}

          {beat4Active && alertTriangleTs.map((t, i) => {
            const localFrame = frame - (beat4Start + i * alertStaggerStep);
            const op = interpolate(localFrame, [0, S(0.25)], [0, 0.9], clampB) * beat4Reveal;
            if (op <= 0.01) return null;
            const segIdx = Math.min(tsgpJalons.length - 2, Math.floor(t * (tsgpJalons.length - 1)));
            const localT = t * (tsgpJalons.length - 1) - segIdx;
            const a = tsgpJalons[segIdx], b = tsgpJalons[segIdx + 1];
            const ctrl = ctrlOf(a, b, 14, 0.5);
            const [px, py] = pointOnQuad(a, ctrl, b, localT);
            return <TriangleAlerte key={`alert-${i}`} x={px} y={py - 26} opacity={op} frame={frame} />;
          })}

          {tsgpCountries.map((c, i) => {
            const state = countryState(i);
            if (state === "inactive") return null;
            if (state === "approached") {
              const t = tsgpSegStarts[i];
              const reveal = interpolate(traceGlobalT, [t - 0.22, t - 0.06], [0, 1], clampB);
              return <path key={`c-${i}`} d={c.d} fill="none" stroke={CYAN} strokeOpacity={0.5 * reveal} strokeWidth={1.4} />;
            }
            if (state === "active") {
              const t = tsgpSegStarts[i];
              const reveal = interpolate(traceGlobalT, [t - 0.06, t + 0.1], [0, 1], clampB);
              return (
                <g key={`c-${i}`}>
                  <path d={c.d} fill={CYAN} fillOpacity={0.18 * reveal} stroke="none" />
                  <path d={c.d} fill="none" stroke={CYAN} strokeOpacity={0.85 * reveal} strokeWidth={2} />
                </g>
              );
            }
            if (state === "traversed") {
              // Pays déjà passé : reste marqué, contour discret (pas le pic "active") — la trace du
              // trajet physique ne doit jamais s'effacer derrière la tête de ligne.
              return <path key={`c-${i}`} d={c.d} fill="none" stroke={CYAN} strokeOpacity={0.45} strokeWidth={1.6} />;
            }
            const reveal = interpolate(traceGlobalT, [tsgpSegStarts[i] - 0.03, tsgpSegStarts[i] + 0.05], [0, 1], clampB);
            return (
              <g key={`c-${i}`}>
                <path d={c.d} fill={CYAN} fillOpacity={0.3 * reveal} stroke="none" />
                <path d={c.d} fill="none" stroke={CYAN} strokeOpacity={reveal} strokeWidth={2.8} />
              </g>
            );
          })}
        </g>
      </svg>

      {tsgpCountries.map((c, i) => {
        const win = plaqueWindow(i);
        if (!win) return null;
        const [gx, gy] = tsgpJalons[i];
        const screenX = gx * cam.scale + cam.tx;
        const screenY = gy * cam.scale + cam.ty;
        return (
          <GeoCountryPlaque key={`plaque-${i}`} frame={frame} name={TSGP_COUNTRY_LABELS_FR[TSGP_COUNTRY_NAMES[i]]}
            color={CYAN} appearAt={win.appearAt} hideAt={win.hideAt} pos={{ x: screenX, y: screenY }} />
        );
      })}

      {/* Vignette/darkening Beat 2 — même principe que `darkenOverlay` de GazoducActe3InsertSecurite.tsx :
          le reste de la carte s'assombrit pour focaliser l'œil sur Adrar seul pendant le chantier. */}
      {chantierDarken > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: "#050b20", opacity: chantierDarken, pointerEvents: "none" }} />
      )}

      {/* Connecteur doré pin Adrar -> carte-insert + geste financement (icônes $ qui convergent depuis
          les pins Algérie/Nigeria, breakdown Beat 2). Dessiné AU-DESSUS du voile d'assombrissement :
          l'ancrage visuel vers l'insert doit traverser le voile, pas disparaître dessous. */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {insertCardOpacity > 0.01 && (
          <>
            <path
              d={`M ${adrarSX} ${adrarSY} L ${adrarSX + W * 0.07} ${adrarSY - H * 0.05} L ${W * 0.47} ${H * 0.46}`}
              stroke={GOLD} strokeWidth={2.4} strokeDasharray="7 6" fill="none"
              opacity={0.95 * insertCardOpacity} pathLength={1} strokeDashoffset={1 - insertConnectorDraw}
            />
            <g transform={`translate(${adrarSX} ${adrarSY})`} opacity={insertCardOpacity}>
              {(() => {
                const per = S(1.6);
                const t1 = (frame % per) / per;
                const t2 = ((frame + per / 2) % per) / per;
                return (
                  <>
                    <circle r={12 + t1 * 34} fill="none" stroke={CYAN} strokeWidth={1.5} opacity={(1 - t1) * 0.6} />
                    <circle r={12 + t2 * 34} fill="none" stroke={CYAN} strokeWidth={1.5} opacity={(1 - t2) * 0.6} />
                  </>
                );
              })()}
              <circle r={40} fill="none" stroke={GOLD} strokeWidth={1.4} strokeDasharray="5 5" opacity={0.9}
                transform={`rotate(${frame * 0.66})`} />
              <circle r={8} fill={BG_BOT} stroke={CYAN} strokeWidth={2.6} />
              <circle r={3.6} fill={CYAN} />
            </g>
          </>
        )}
        <IconeFinancement pos={coinAlgerie1Pos} opacity={coinAlgerie1Op} color={CYAN} />
        <IconeFinancement pos={coinAlgerie2Pos} opacity={coinAlgerie2Op} color={CYAN} />
        <IconeFinancement pos={coinNigeria1Pos} opacity={coinNigeria1Op} color={CYAN} />
      </svg>

      {/* ===== Carte-insert chantier Adrar (storyboard V5) — clip MiniMax H3 en boucle dans un cadre
          composé, avec badge date, jauge de chantier et badge d'activité. Mécanique validée en R&D
          (GazoducH3IntegrationTestReal.tsx). Positionnée à droite du pin, superposée à la carte —
          jamais collée à un bord (règle : l'insert se superpose à la carte, ne la pousse pas). */}
      {insertCardOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: "47%", top: "24%", width: "38%", height: "44%",
            opacity: insertCardOpacity,
            transform: `scale(${insertCardScale})`,
            background: "rgba(7, 24, 45, 0.96)",
            border: `1.5px solid ${CYAN}`,
            borderRadius: 6,
            boxShadow: "0 0 22px rgba(0, 196, 255, 0.22)",
            padding: "2.6% 3%",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "none",
          }}
        >
          <div style={{
            alignSelf: "flex-start", background: "rgba(14, 32, 48, 0.95)",
            border: `1.4px solid ${GOLD}`, borderRadius: 4, padding: "6px 14px",
            color: "#FFD06A", fontFamily: "'IBM Plex Mono', monospace", fontSize: 15,
            fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12,
          }}>
            4 JUIN 2026
          </div>

          <div style={{
            position: "relative", width: "100%", flex: "0 0 52%",
            borderRadius: 4, overflow: "hidden", border: `1px solid ${CYAN}44`, background: "#000",
          }}>
            <Loop durationInFrames={Math.floor(5.13 * FPS)}>
              <OffthreadVideo
                src={staticFile("_rnd/minimax-h3-tests/gazoduc-pelleteuse/pelleteuse-1080p-v1.mp4")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                muted
              />
            </Loop>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: "4%", gap: 16 }}>
            <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
              <svg width={56} height={56} viewBox="0 0 56 56">
                <circle cx={28} cy={28} r={22} fill="none" stroke="#263C55" strokeWidth={8} />
                <circle cx={28} cy={28} r={22} fill="none" stroke={CYAN} strokeWidth={8}
                  strokeDasharray={2 * Math.PI * 22}
                  strokeDashoffset={2 * Math.PI * 22 * (1 - insertProgress)}
                  transform="rotate(-90 28 28)" strokeLinecap="round" />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                color: "#EAF6FF", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700,
              }}>
                {Math.round(insertProgress * 100)}%
              </div>
            </div>
            <div>
              <div style={{ color: CYAN, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>
                TRAVAUX EN COURS
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{ width: 5, height: 21, background: i < Math.round(insertProgress * 16) ? CYAN : "#263C55" }} />
                ))}
              </div>
            </div>
            <div style={{ width: 1, alignSelf: "stretch", background: "#5E789A", opacity: 0.5, marginLeft: 8 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: insertBadgeOpacity }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${CYAN}`,
                background: "rgba(0,196,255,0.08)", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth={2}>
                  <path d="M4 20 L4 12 L12 4 L20 12 L20 20 Z" />
                </svg>
              </div>
              <div style={{ color: "#EAF6FF", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>
                ACTIVITÉ<br />ÉLEVÉE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispositif jetons financement — ancré aux coordonnées géographiques réelles, jamais un widget
          coin d'écran (retour DA-brief unanime). 3 jetons "État" (Nigeria/Niger/Algérie) qui pulsent
          pendant "financé par les États eux-mêmes", 1 jeton "banque internationale" qui tente une
          liaison puis se rompt (croix) pendant "pas besoin d'un accord bancaire international". */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <JetonEtat x={nigeriaSX} y={nigeriaSY - 60} reveal={jetonEtatReveal * jetonEtatOut} frame={frame} label="NIGERIA" />
        <JetonEtat x={nigerSX} y={nigerSY - 60} reveal={jetonEtatReveal * jetonEtatOut} frame={frame} label="NIGER" />
        <JetonEtat x={algeriaSX} y={algeriaSY - 60} reveal={jetonEtatReveal * jetonEtatOut} frame={frame} label="ALGÉRIE" />
        {/* Banque internationale écartée : ramenée DANS le cadre (x = 82% de la largeur) — était à
            W-220 avec son label, ce qui coupait "BANQUE INT'L" au bord droit (constaté au rendu). */}
        <JetonBanqueRejetee x={W * 0.82} y={H * 0.2} targetX={algeriaSX} targetY={algeriaSY} reveal={banqueReveal} breakProgress={banqueBreak} />
      </svg>

      {/* Comparateur "13 Mds$" — bloc CENTRÉ sur carte assombrie (storyboard V5 panneau 02), jamais un
          widget de bord. L'assombrissement remplace l'ancien contournement "cadran poussé en coin pour
          éviter la collision avec les jetons". */}
      {coutLabelOpacity > 0.01 && (
        <>
          <div style={{
            position: "absolute", inset: 0, background: "#050b20",
            opacity: 0.62 * coutLabelOpacity, pointerEvents: "none",
          }} />
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <CadranComparateur frame={frame} startFrame={B.coutEmphaseStart} countUp={treizeCountUp} opacity={coutLabelOpacity} />
          </svg>
        </>
      )}

      {/* Beat 4 — labels courts MAXIMUM 2, "minimal on-map text" (breakdown). */}
      {beat4Active && (
        <>
          <div style={{
            position: "absolute", left: "26%", top: 130, transform: "translateX(-50%)", opacity: label1Opacity,
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 800, letterSpacing: "0.12em",
            color: GOLD, textShadow: "0 0 12px rgba(255,199,66,0.5)",
          }}>PACIFIÉ</div>
          <div style={{
            position: "absolute", left: "70%", top: 130, transform: "translateX(-50%)", opacity: label2Opacity,
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 800, letterSpacing: "0.12em",
            color: "#ff5a3c", textShadow: "0 0 12px rgba(255,90,60,0.5)",
          }}>ZONE ACTIVE</div>
        </>
      )}
    </AbsoluteFill>
  );
};

export default GazoducActe3CarteTSGP;
