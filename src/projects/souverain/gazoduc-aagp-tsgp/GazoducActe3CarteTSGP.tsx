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

// ===== Jeton SVG "État" (financement souverain) — icône Landmark maison, ancré aux coordonnées géo =====
const JetonEtat: React.FC<{ x: number; y: number; reveal: number; frame: number; label: string }> = ({ x, y, reveal, frame, label }) => {
  if (reveal <= 0.01) return null;
  const pulse = 1 + Math.sin(frame * 0.15) * 0.05 * reveal;
  return (
    <g transform={`translate(${x} ${y}) scale(${reveal * pulse})`} opacity={reveal}>
      <circle r={26} fill="#0e192e" stroke={CYAN} strokeWidth={2} />
      {/* Landmark maison : fronton + 4 colonnes, formes géométriques pures */}
      <path d="M -14 -6 L 0 -14 L 14 -6 Z" fill={CYAN} />
      <rect x={-14} y={-6} width={28} height={2.5} fill={CYAN} />
      {[-9, -3, 3, 9].map((cx) => <rect key={cx} x={cx - 1.3} y={-3} width={2.6} height={12} fill={CYAN} />)}
      <rect x={-14} y={9} width={28} height={2.5} fill={CYAN} />
      <text x={0} y={44} textAnchor="middle" fill="#e8ecf5" fontSize={13} fontFamily="'IBM Plex Mono', monospace" fontWeight={700}>{label}</text>
    </g>
  );
};

// ===== Jeton "Banque internationale rejetée" — Landmark gris + croix, tracé pointillé qui se rompt =====
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
      <g transform={`translate(${x} ${y})`}>
        <circle r={22} fill="#0e192e" stroke="#7a8aa8" strokeWidth={2} />
        <path d="M -11 -4 L 0 -11 L 11 -4 Z" fill="#7a8aa8" />
        <rect x={-11} y={-4} width={22} height={2} fill="#7a8aa8" />
        {[-6, 0, 6].map((cx) => <rect key={cx} x={cx - 1} y={-1} width={2} height={8} fill="#7a8aa8" />)}
        <text x={0} y={36} textAnchor="middle" fill="#8fa0bb" fontSize={11} fontFamily="'IBM Plex Mono', monospace">BANQUE INT'L</text>
      </g>
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
    // MOUVEMENT 1 [0-8s] : zoom serré Nigeria, spring pour un vrai "arrivée" pas un lerp mou.
    const p = spring({ frame, fps, config: { damping: 18, mass: 1 } });
    cam = lerpCam(camFor(NIGERIA, 1.1), camNigeriaClose, Math.min(1, p));
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
  const coutLabelOpacity = interpolate(frame, [B.coutEmphaseStart, B.coutEmphaseStart + S(0.6), B.treizeMdsStart + S(1)], [0, 1, 1], clampB);

  const screenOf = (geo: [number, number]): [number, number] => [geo[0] * cam.scale + cam.tx, geo[1] * cam.scale + cam.ty];
  const [nigeriaSX, nigeriaSY] = screenOf(NIGERIA);
  const [algeriaSX, algeriaSY] = screenOf(ALGERIA);
  const nigerCentroid = tsgpJalons[1];
  const [nigerSX, nigerSY] = screenOf(nigerCentroid);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)`, opacity: globalFadeIn * globalFadeOut }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {countries.map((c, i) => (
            <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.5 * continentReveal}
              stroke={LAND_STROKE} strokeOpacity={0.32 * continentReveal} strokeWidth={0.85} />
          ))}
          <path d={aagpFullD} fill="none" stroke={GOLD} strokeWidth={2.2} strokeOpacity={0.16 * continentReveal} strokeLinecap="round" />

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
            return (
              <path key={`tsgp-seg-${i}`} d={quadD(a, ctrl, b)} fill="none" stroke={CYAN}
                strokeWidth={3.6} strokeLinecap="round"
                strokeDasharray={len} strokeDashoffset={len * (1 - segReveal)} />
            );
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

      {coutLabelOpacity > 0.01 && (
        <div style={{
          position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", opacity: coutLabelOpacity,
          fontFamily: "'IBM Plex Mono', monospace", color: "#e8ecf5", textAlign: "center",
        }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: CYAN }}>{treizeCountUp} Mds$</div>
          <div style={{ fontSize: 16, opacity: 0.75, letterSpacing: "0.1em", marginTop: -4 }}>
            DEUX FOIS MOINS CHER QUE L'AAGP ({26} Mds$)
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default GazoducActe3CarteTSGP;
