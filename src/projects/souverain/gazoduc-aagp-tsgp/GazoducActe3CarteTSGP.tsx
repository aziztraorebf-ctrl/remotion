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
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
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
const TSGP_COUNTRY_LABELS_FR: Record<string, string> = { Nigeria: "Nigeria", Niger: "Niger", Algeria: "Algérie" };
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

// ===== Caméras-clés des 5 mouvements (retour DA-brief, convergence 3/3) =====
const camNigeriaClose = camFor(NIGERIA, 3.2); // Mouvement 1 : zoom SERRÉ (pas juste 1.3->2.3 comme V1)
const camSaharaWide = camFor(
  [(tsgpJalons[1][0] + tsgpJalons[2][0]) / 2, (tsgpJalons[1][1] + tsgpJalons[2][1]) / 2 - 15],
  1.1, // Mouvement 3 : dézoom qui révèle VRAIMENT l'immensité (plus large que V1)
);
const camAdrarAggressive = camFor(ALGERIA, 6.5); // Mouvement 4 : zoom AGRESSIF x5-8 (V1 n'était qu'à 2.1)
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

// ===== Insert chantier Adrar — flat-vector pur SVG géométrique (PAS 3D), pelleteuse + tranchée
// schématique, cohérent avec le registre trait/aplat du reste de la carte (breakdown Beat 2). =====
const ChantierAdrar: React.FC<{ x: number; y: number; reveal: number; frame: number }> = ({ x, y, reveal, frame }) => {
  if (reveal <= 0.01) return null;
  const bras = -18 + Math.sin(frame * 0.09) * 6; // léger mouvement de bras, jamais figé
  // Échelle x3 vs le premier jet (0.9) — à ce niveau de zoom caméra (x6.5 sur Adrar), un insert à 0.9
  // lisait comme un point illisible à côté de la plaque pays (vérifié au mini-render, cf rapport).
  return (
    <g transform={`translate(${x} ${y}) scale(${2.7 * reveal})`} opacity={reveal}>
      {/* Tranchée schématique — trait pointillé creusé au sol */}
      <line x1={-70} y1={34} x2={70} y2={34} stroke="#0e192e" strokeWidth={10} strokeLinecap="round" opacity={0.85} />
      <line x1={-70} y1={34} x2={70} y2={34} stroke="#2a3f66" strokeWidth={10} strokeDasharray="4 6" strokeLinecap="round" opacity={0.6} />
      {/* Pelleteuse — silhouette géométrique aplats, pas de dégradé photoréaliste */}
      <g id="pelleteuse">
        <rect x={-8} y={6} width={34} height={16} rx={3} fill="#FFC742" stroke="#0e192e" strokeWidth={1.4} />
        <circle cx={-2} cy={24} r={8} fill="#0e192e" />
        <circle cx={20} cy={24} r={8} fill="#0e192e" />
        <circle cx={-2} cy={24} r={3.4} fill="#2a3f66" />
        <circle cx={20} cy={24} r={3.4} fill="#2a3f66" />
        <rect x={-4} y={-4} width={16} height={12} rx={2} fill="#FFC742" stroke="#0e192e" strokeWidth={1.4} />
        <rect x={-8} y={-2} width={6} height={6} fill="#0e192e" opacity={0.5} />
        {/* Bras + godet, angle qui oscille légèrement */}
        <g transform={`translate(4 -2) rotate(${bras})`}>
          <rect x={0} y={-2.5} width={30} height={5} rx={2.5} fill="#0e192e" />
          <g transform="translate(30 0) rotate(35)">
            <rect x={0} y={-2} width={20} height={4} rx={2} fill="#0e192e" />
            <path d="M 20 -3 L 30 0 L 20 8 L 14 4 Z" fill="#0e192e" stroke="#FFC742" strokeWidth={1} />
          </g>
        </g>
      </g>
    </g>
  );
};

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
  // Placé en HUD coin haut-droit (jamais centre-carte) : évite la collision écran avec les JetonEtat
  // (Nigeria/Niger/Algérie, ancrés aux coordonnées géo réelles) qui traversent cette zone pendant le
  // dézoom Mouvement 5 — collision constatée au mini-render avec le cadran en position centrale.
  return (
    <g transform={`translate(${W - 150} 340)`} opacity={opacity}>
      <path d={trackD} fill="none" stroke="#1c2b4a" strokeWidth={14} strokeLinecap="round" />
      <path d={fillD} fill="none" stroke={CYAN} strokeWidth={14} strokeLinecap="round" />
      <text x={0} y={-2} textAnchor="middle" fill="#e8ecf5" fontSize={40} fontWeight={800}
        fontFamily="'IBM Plex Mono', monospace">{countUp}</text>
      <text x={0} y={24} textAnchor="middle" fill={CYAN} fontSize={16} fontWeight={700}
        fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.05em">Mds$</text>
      <text x={0} y={54} textAnchor="middle" fill="#8fa0bb" fontSize={13}
        fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.08em">VS 26 Mds$ AAGP</text>
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

  const nigeriaCountry = byName("Nigeria");
  const nigeriaLen = nigeriaCountry ? cachedPathLen(nigeriaCountry.d) : 0;
  const nigeriaTrace = interpolate(frame, [S(0.1), S(1.2)], [0, 1], clampB);
  const nigeriaFill = interpolate(frame, [S(0.6), S(1.6)], [0, 1], clampB);

  const traceGlobalT = interpolate(
    frame,
    [B.traceNigerStart, B.traceSaharaStart, B.traceAlgerieApproach, B.adrarArriveEnd],
    [0, tsgpSegStarts[1] * 0.5, tsgpSegStarts[1], 1],
    clampB,
  );

  // ===== 5 MOUVEMENTS DE CAMÉRA DISTINCTS (retour DA-brief, convergence 3/3) =====
  let cam: Cam;
  if (frame < B.traceNigerStart) {
    // MOUVEMENT 1 [0→traceNigerStart, ≈22.2s réel — PAS 8s, cf timing frame-précis] : zoom serré
    // Nigeria, spring pour un vrai "arrivée" pas un lerp mou. Le spring converge en <1s ; sans drift,
    // la caméra restait figée ~21s (bug trouvé au rendu complet 2026-08-12 — vérif mouvement, pas
    // frames isolées : hash identique de f≈30 à f≈660). Même pattern que le hold Adrar plus bas
    // (ligne ~305) : léger drift continu une fois le spring arrivé, jamais un cadre totalement figé.
    const p = spring({ frame, fps, config: { damping: 18, mass: 1 } });
    const arrived = Math.min(1, p);
    const camArrived = lerpCam(camFor(NIGERIA, 1.1), camNigeriaClose, arrived);
    const driftT = frame * 0.01;
    const driftAmount = interpolate(frame, [S(1), S(1.6)], [0, 1], clampB); // fondu-in du drift après l'arrivée spring
    cam = {
      ...camArrived,
      tx: camArrived.tx + Math.sin(driftT) * 5 * driftAmount,
      ty: camArrived.ty + Math.cos(driftT * 0.65) * 3.5 * driftAmount,
    };
  } else if (frame < B.traceSaharaStart) {
    // MOUVEMENT 2 [8-22s] : travel tracking — la caméra SUIT la tête du tracé, recalculée chaque frame.
    const tAhead = Math.min(1, traceGlobalT + 0.06);
    const idx = Math.round(tAhead * (tsgpFullPath.length - 1));
    const backWindow = Math.round(tsgpFullPath.length * 0.35);
    const bbox = windowBBox(tsgpFullPath, idx, backWindow, Math.round(tsgpFullPath.length * 0.08));
    const center: [number, number] = [(bbox.minX + bbox.maxX) / 2, (bbox.minY + bbox.maxY) / 2];
    const spanX = Math.max(80, bbox.maxX - bbox.minX), spanY = Math.max(80, bbox.maxY - bbox.minY);
    const scaleFit = Math.min((W * 0.55) / spanX, (H * 0.55) / spanY, 3.5);
    const camTrack = camFor(center, Math.max(2.2, scaleFit));
    const p = easeInOut(Math.min(1, (frame - B.traceNigerStart) / S(1.5)));
    cam = lerpCam(camNigeriaClose, camTrack, p);
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
    const p = spring({ frame: frame - B.traceAlgerieApproach, fps, config: { damping: 22, mass: 1.4 } });
    cam = lerpCam(camSaharaWide, camAdrarAggressive, Math.min(1, p));
  } else if (frame < B.coutEmphaseStart) {
    // Hold sur Adrar pendant chantier/Sonatrach — léger drift pour ne jamais être totalement figé.
    const driftT = (frame - B.adrarArriveEnd) * 0.008;
    cam = { ...camAdrarAggressive, tx: camAdrarAggressive.tx + Math.sin(driftT) * 6, ty: camAdrarAggressive.ty + Math.cos(driftT * 0.7) * 4 };
  } else {
    // MOUVEMENT 5 [45-72s] : dézoom pour la comparaison financière, le dispositif jetons prend le relais.
    const p = easeInOut(Math.min(1, (frame - B.coutEmphaseStart) / S(3)));
    cam = lerpCam(camAdrarAggressive, camDataOverlay, p);
  }

  const continentReveal = interpolate(frame, [0, S(0.7)], [0, 1], clampB);

  function countryState(idx: number): "inactive" | "approached" | "active" | "destination" {
    if (idx === tsgpCountries.length - 1 && traceGlobalT >= tsgpSegStarts[idx] - 0.03) return "destination";
    const segT = tsgpSegStarts[idx];
    if (traceGlobalT >= segT - 0.06 && traceGlobalT < segT + 0.1) return "active";
    if (traceGlobalT >= segT - 0.22 && traceGlobalT < segT - 0.06) return "approached"; // fenêtre élargie (retour DA-brief : "approached" jamais utilisé en V1)
    return "inactive";
  }

  const NIGERIA_IDX = 0;
  const ALGERIA_IDX = tsgpCountries.length - 1;
  function plaqueWindow(idx: number): { appearAt: number; hideAt: number } | null {
    if (idx === NIGERIA_IDX) return { appearAt: S(0.3), hideAt: S(2.6) };
    if (idx === ALGERIA_IDX) return { appearAt: B.adrarArriveEnd - S(1), hideAt: B.coutEmphaseStart };
    return { appearAt: B.traceSaharaStart, hideAt: B.traceAlgerieApproach + S(1) };
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
          {countries.map((c, i) => (
            <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.5 * continentReveal}
              stroke={LAND_STROKE} strokeOpacity={0.32 * continentReveal} strokeWidth={0.85} />
          ))}
          {/* AAGP (Maroc) — filigrane 0.16 par défaut, boosté LOCALEMENT au Beat 4 pour le contraste
              stable(Maroc)/vacillant(Algérie) demandé par le breakdown (jamais boosté globalement). */}
          <path d={aagpFullD} fill="none" stroke={GOLD} strokeWidth={beat4Active ? 3.2 : 2.2}
            strokeOpacity={beat4Active ? aagpBeat4Opacity : 0.16 * continentReveal} strokeLinecap="round" />

          {nigeriaCountry && nigeriaTrace > 0 && (
            <g>
              {nigeriaFill > 0.01 && <path d={nigeriaCountry.d} fill={CYAN} fillOpacity={0.32 * nigeriaFill} stroke="none" />}
              <path d={nigeriaCountry.d} fill="none" stroke={CYAN} strokeWidth={2.6}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={nigeriaLen} strokeDashoffset={nigeriaLen * (1 - nigeriaTrace)} />
            </g>
          )}

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

      {/* Insert chantier Adrar — flat-vector (pelleteuse + tranchée), ancré au point Adrar (=ALGERIA
          en écran, cadre du zoom Mouvement 4). Geste financement : icônes $ qui convergent depuis les
          pins Algérie/Nigeria (breakdown Beat 2). */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <ChantierAdrar x={adrarSX + 130} y={adrarSY + 170} reveal={chantierReveal * (1 - interpolate(frame, [beat2GestureEnd, beat2GestureEnd + S(0.6)], [0, 1], clampB))} frame={frame} />
        <IconeFinancement pos={coinAlgerie1Pos} opacity={coinAlgerie1Op} color={CYAN} />
        <IconeFinancement pos={coinAlgerie2Pos} opacity={coinAlgerie2Op} color={CYAN} />
        <IconeFinancement pos={coinNigeria1Pos} opacity={coinNigeria1Op} color={CYAN} />
      </svg>

      {/* Dispositif jetons financement — ancré aux coordonnées géographiques réelles, jamais un widget
          coin d'écran (retour DA-brief unanime). 3 jetons "État" (Nigeria/Niger/Algérie) qui pulsent
          pendant "financé par les États eux-mêmes", 1 jeton "banque internationale" qui tente une
          liaison puis se rompt (croix) pendant "pas besoin d'un accord bancaire international". */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <JetonEtat x={nigeriaSX} y={nigeriaSY - 60} reveal={jetonEtatReveal * jetonEtatOut} frame={frame} label="NIGERIA" />
        <JetonEtat x={nigerSX} y={nigerSY - 60} reveal={jetonEtatReveal * jetonEtatOut} frame={frame} label="NIGER" />
        <JetonEtat x={algeriaSX} y={algeriaSY - 60} reveal={jetonEtatReveal * jetonEtatOut} frame={frame} label="ALGÉRIE" />
        <JetonBanqueRejetee x={W - 220} y={140} targetX={algeriaSX} targetY={algeriaSY} reveal={banqueReveal} breakProgress={banqueBreak} />
      </svg>

      {/* Comparateur "13 Mds$" — cadran circulaire animé (DÉCISION AZIZ, remplace le rectangle HUD plat). */}
      {coutLabelOpacity > 0.01 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <CadranComparateur frame={frame} startFrame={B.coutEmphaseStart} countUp={treizeCountUp} opacity={coutLabelOpacity} />
        </svg>
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
