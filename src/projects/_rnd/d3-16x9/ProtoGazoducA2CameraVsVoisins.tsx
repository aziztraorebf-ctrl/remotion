// PROTO comparatif — Acte 2 Gazoduc : 2 reponses au retour Aziz "vue eloignee sur carte plate,
// vide autour du continent, plat, ne marche pas" (2026-08-03, apres 1er rendu GazoducActe2AAGP.tsx).
//
// Variante A (ProtoA2CameraProche) : camera TOUJOURS resserree sur le trace actif, jamais de plan
// large statique — teste l'hypothese "le probleme est le ZOOM trop large, pas le manque de geo".
// Variante B (ProtoA2VoisinsVisibles) : memes 10s, MEME camera (large, comme le rendu conteste),
// mais geo etendue (gazoducGeoElargie.json, 76 pays — Afrique + Ameriqe du Sud + Europe + Moyen-
// Orient) pour habiller le vide — teste l'hypothese inverse "le probleme est l'absence de voisins".
//
// Corrige AUSSI dans les 2 variantes (retours deja actes, pas a re-comparer) :
//  - Fond ECLAIRCI (les tons Acte1 THEMES.mixte etaient trop sombres deja ; celui choisi hier
//    #182746/#22345c jugé "beaucoup trop profond" au rendu reel — relevé nettement ici).
//  - Nigeria qui SE TRACE (contour progressif + remplissage, meme geste que PaysTrace/drapeau
//    Acte 1) au lieu d'un point statique fixe pendant 10s.
//  - Pays traverses par le trace : CONTOUR qui se dessine (pas un point rond identique partout).
//  - Legende "AAGP" retiree (un seul trace dans toute la video, redondant — retour Aziz).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import geoNarrow from "./gazoducAfriqueCompleteGeo.json";
import geoWide from "./gazoducGeoElargie.json";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);
export const PROTO_A2_COMPARE_FRAMES = 300; // 10s @30fps

// ===== Palette ECLAIRCIE (retour direct : "beaucoup trop profond, dur de voir les contours") =====
const BG_TOP = "#3a5488"; // nettement plus clair que le 1er jet (#22345c)
const BG_BOT = "#2a3f66"; // nettement plus clair que le 1er jet (#182746)
const LAND = "#4a608e"; // terre plus lisible sur ce fond
const LAND_STROKE = "#e8ecf5"; // contour quasi blanc, forte lisibilite
const GOLD = "#FFC742";
const CREAM = "#f2ebd9";

type CountryGeo = { name: string; d: string };

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
function bboxCentroid(d: string): [number, number] {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
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

type Cam = { scale: number; tx: number; ty: number };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function lerpCam(a: Cam, b: Cam, t: number): Cam {
  const p = easeInOut(Math.min(1, Math.max(0, t)));
  return { scale: a.scale + (b.scale - a.scale) * p, tx: a.tx + (b.tx - a.tx) * p, ty: a.ty + (b.ty - a.ty) * p };
}
function camFor(center: [number, number], scale: number): Cam {
  return { scale, tx: W / 2 - center[0] * scale, ty: H / 2 - center[1] * scale };
}

// Premiers 4 jalons du trace (Nigeria->Benin->Togo->Ghana) — assez pour juger caméra/lisibilite
// sur 10s, pas besoin des 13 pour ce test comparatif cible.
const FIRST_NAMES = ["Nigeria", "Benin", "Togo", "Ghana"] as const;

// 13 jalons REELS du trace AAGP (Nigeria->Maroc), cf da-brief-acte1/BREAKDOWN-ACTE1.md L30-31 —
// pour tester le mecanisme de camera continue sur la VRAIE distance parcourue dans l'Acte 2 (le
// test a 4 jalons proches ne faisait quasiment pas bouger la camera, echantillon trop court pour
// juger — Aziz 2026-08-03, apres 1er test).
const AAGP_13_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;

const CoreScene: React.FC<{ geoData: { countries: CountryGeo[] }; cameraMode: "close" | "wide"; debugLabel: string }> = ({ geoData, cameraMode, debugLabel }) => {
  const frame = useCurrentFrame();
  const countries = geoData.countries;
  const byName = (name: string) => countries.find((c) => c.name === name);
  const jalonCountries = FIRST_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
  const jalons = jalonCountries.map((c) => bboxCentroid(c.d));
  const NIGERIA = jalons[0];

  // ===== Camera =====
  const camWideStart = camFor(NIGERIA, 1.0);
  const camNigeriaClose = camFor(NIGERIA, 2.6);
  const camFollowLast = jalons.length > 1 ? camFor(jalons[jalons.length - 1], 2.2) : camNigeriaClose;

  let cam: Cam;
  if (cameraMode === "wide") {
    // MEME camera large que le rendu conteste (le seul changement dans variante B = la geo).
    cam = camFor(NIGERIA, 1.05);
  } else {
    // Variante A : approche continue Nigeria puis suit la tete du trace, jamais figee large.
    const t0 = S(0);
    const t1 = S(2.5); // Nigeria se trace, camera se rapproche
    const t2 = S(9); // suit ensuite la progression du trace
    if (frame < t1) cam = lerpCam(camWideStart, camNigeriaClose, (frame - t0) / (t1 - t0));
    else cam = lerpCam(camNigeriaClose, camFollowLast, (frame - t1) / (t2 - t1));
  }

  // ===== Nigeria qui se trace (contour + remplissage) =====
  const nigeriaTrace = interpolate(frame, [S(0.1), S(0.9)], [0, 1], clampB);
  const nigeriaFill = interpolate(frame, [S(0.6), S(1.3)], [0, 1], clampB);
  const nigeriaLen = jalonCountries[0] ? cachedPathLen(jalonCountries[0].d) : 0;

  // ===== Trace AAGP (4 premiers jalons) qui avance apres Nigeria trace =====
  const traceStart = S(1.4);
  const traceEnd = S(9.5);
  const globalT = interpolate(frame, [traceStart, traceEnd], [0, 1], clampB);
  const segStarts = jalons.map((_, i) => i / (jalons.length - 1));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {/* Fond continent (et voisins si geoWide) : discret mais VISIBLE (contours clairs) */}
          {countries.map((c, i) => (
            <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.5}
              stroke={LAND_STROKE} strokeOpacity={0.35} strokeWidth={0.9} />
          ))}

          {/* Nigeria : contour qui se trace PUIS se remplit (au lieu d'un point statique) */}
          {jalonCountries[0] && nigeriaTrace > 0 && (
            <g>
              {nigeriaFill > 0.01 && <path d={jalonCountries[0].d} fill={GOLD} fillOpacity={0.35 * nigeriaFill} stroke="none" />}
              <path d={jalonCountries[0].d} fill="none" stroke={GOLD} strokeWidth={2.4}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={nigeriaLen} strokeDashoffset={nigeriaLen * (1 - nigeriaTrace)} />
            </g>
          )}

          {/* Trace AAGP : segments + CONTOUR du pays traverse qui se dessine (pas juste un point) */}
          {jalons.slice(0, -1).map((a, i) => {
            const b = jalons[i + 1];
            const segT0 = segStarts[i], segT1 = segStarts[i + 1];
            const segReveal = interpolate(globalT, [segT0, segT1], [0, 1], clampB);
            if (segReveal <= 0) return null;
            const ctrl = ctrlOf(a, b, -16, 0.5);
            const len = quadLen(a, ctrl, b);
            return (
              <path key={`seg-${i}`} d={quadD(a, ctrl, b)} fill="none" stroke={GOLD}
                strokeWidth={3.6} strokeLinecap="round"
                strokeDasharray={len} strokeDashoffset={len * (1 - segReveal)} />
            );
          })}

          {/* Contour des pays ATTEINTS (2e, 3e, 4e jalon) qui se dessine au passage du trace */}
          {jalonCountries.slice(1).map((c, i) => {
            const t = segStarts[i + 1];
            const reveal = interpolate(globalT, [t, t + 0.12], [0, 1], clampB);
            if (reveal <= 0) return null;
            const len = cachedPathLen(c.d);
            return (
              <g key={`reached-${i}`}>
                <path d={c.d} fill={GOLD} fillOpacity={0.22 * reveal} stroke="none" />
                <path d={c.d} fill="none" stroke={GOLD} strokeWidth={2}
                  strokeDasharray={len} strokeDashoffset={len * (1 - reveal)} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
      </svg>
      {/* Pas de legende "AAGP" — un seul trace dans toute la video (retour Aziz) */}
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 14, color: "#c9d4ea", letterSpacing: 2 }}>
        {debugLabel}
      </div>
    </AbsoluteFill>
  );
};

export const ProtoA2CameraProche: React.FC = () => (
  <CoreScene geoData={geoNarrow as { countries: CountryGeo[] }} cameraMode="close" debugLabel="VARIANTE A — camera resserree" />
);
export const ProtoA2VoisinsVisibles: React.FC = () => (
  <CoreScene geoData={geoWide as { countries: CountryGeo[] }} cameraMode="wide" debugLabel="VARIANTE B — voisins visibles (meme camera large)" />
);
// MIX (Aziz 2026-08-03) : camera resserree (A) + geo elargie voisins (B) — A seule "voit encore
// le vide autour" au jugement d'Aziz malgre le zoom, B seule dilue le sujet. Combine les deux.
export const ProtoA2Mix: React.FC = () => (
  <CoreScene geoData={geoWide as { countries: CountryGeo[] }} cameraMode="close" debugLabel="MIX — camera resserree + voisins visibles" />
);

// ============================================================================================
// CAMERA CONTINUE — reponse a la Regle 1 (REVISION-V2-APRES-REJET-V1.md) : la camera NE saute
// PLUS entre 3-4 points fixes (camFor/lerpCam ci-dessus). Position recalculee CHAQUE FRAME le
// long du path complet du trace, avec anticipation legere devant la tete du trait (Gemini +
// agent Map Animation, convergents : "suivre la fleche pendant qu'elle se deplace" / "camera
// recalculee a chaque frame le long du tracé"). Le cadre inclut TOUJOURS un peu de sillage deja
// parcouru en arriere — pas un point isole recentre a chaque jalon (repond a "on voit encore le
// vide meme resserre" — Aziz sur Variante A seule).
// ============================================================================================

// Path COMPLET du trace (union de tous les segments, pas jalon par jalon) — necessaire pour
// echantillonner une position continue le long de tout le parcours, pas juste aux jalons.
function buildFullPathSamples(jalons: [number, number][], bendPerp: number, samplesPerSeg = 40): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < jalons.length - 1; i++) {
    const a = jalons[i], b = jalons[i + 1];
    const ctrl = ctrlOf(a, b, bendPerp, 0.5);
    for (let s = 0; s <= samplesPerSeg; s++) {
      if (i > 0 && s === 0) continue; // evite le point duplique a la jonction
      pts.push(pointOnQuad(a, ctrl, b, s / samplesPerSeg));
    }
  }
  return pts;
}

// Bounding box d'une fenetre de points [de idx-back a idx+ahead] — c'est CE cadre (pas un point
// seul) que la camera vise, pour toujours montrer le sillage parcouru + un peu d'anticipation.
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

const ProtoA2CameraContinue: React.FC<{ debugLabel: string; jalonNames?: readonly string[]; traceEndSec?: number }> = ({ debugLabel, jalonNames = FIRST_NAMES, traceEndSec = 9.5 }) => {
  const frame = useCurrentFrame();
  const countries = (geoWide as { countries: CountryGeo[] }).countries;
  const byName = (name: string) => countries.find((c) => c.name === name);
  const jalonCountries = jalonNames.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
  const jalons = jalonCountries.map((c) => bboxCentroid(c.d));
  const NIGERIA = jalons[0];

  // Echantillons du trace complet (meme bendPerp que les segments reellement dessines, -16).
  const fullPath = useMemo(() => buildFullPathSamples(jalons, -16, 40), [jalons]);

  // Nigeria qui se trace (identique aux autres variantes).
  const nigeriaTrace = interpolate(frame, [S(0.1), S(0.9)], [0, 1], clampB);
  const nigeriaFill = interpolate(frame, [S(0.6), S(1.3)], [0, 1], clampB);
  const nigeriaLen = jalonCountries[0] ? cachedPathLen(jalonCountries[0].d) : 0;

  const traceStart = S(1.4);
  const traceEnd = S(traceEndSec);
  const globalT = interpolate(frame, [traceStart, traceEnd], [0, 1], clampB);
  const segStarts = jalons.map((_, i) => i / (jalons.length - 1));

  // ===== CAMERA CONTINUE =====
  // Avant le debut du trace : approche Nigeria (identique variante A, la camera doit deja bouger
  // des la frame 0 — Regle 3, jamais de plan fige).
  const camWideStart = camFor(NIGERIA, 1.0);
  const camNigeriaClose = camFor(NIGERIA, 2.3);
  let cam: Cam;
  if (frame < traceStart) {
    const p = easeInOut(Math.min(1, frame / traceStart));
    cam = { scale: camWideStart.scale + (camNigeriaClose.scale - camWideStart.scale) * p,
      tx: camWideStart.tx + (camNigeriaClose.tx - camWideStart.tx) * p,
      ty: camWideStart.ty + (camNigeriaClose.ty - camWideStart.ty) * p };
  } else {
    // Position le long du trace, avec ANTICIPATION (0.06 = ~6% en avance sur la tete reelle du
    // trait — cree un effet de "la camera devance legerement", pas une synchro pile qui suit).
    // ⚠️ CORRECTION (1er test) : fenetre de sillage trop etroite (22%) + scale plafonne a 3.2 =
    // zoom trop serre sur un trajet a seulement 4 jalons -> Ghana/Togo minuscules a l'ecran, le
    // "vide combattu" redevenait invisible dans l'autre sens (voir out/_r-and-d/check-debug-f290.png,
    // calcul verifie correct mathematiquement mais MAUVAIS choix de composition). Fenetre elargie
    // a 45% (sillage plus genereux) + scale plafonne plus bas (2.0) pour garder le contexte regional
    // visible en permanence — repond a la Regle 3 (composition qui varie) sans jamais tomber dans
    // le judas trop serre.
    const tAhead = Math.min(1, globalT + 0.08);
    const idx = Math.round(tAhead * (fullPath.length - 1));
    const backWindow = Math.round(fullPath.length * 0.45);
    const aheadWindow = Math.round(fullPath.length * 0.1);
    const bbox = windowBBox(fullPath, idx, backWindow, aheadWindow);
    const center: [number, number] = [(bbox.minX + bbox.maxX) / 2, (bbox.minY + bbox.maxY) / 2];
    const spanX = Math.max(140, bbox.maxX - bbox.minX);
    const spanY = Math.max(140, bbox.maxY - bbox.minY);
    // scale qui garde la fenetre [back..ahead] dans le cadre avec une marge, jamais un point isole.
    const scaleFit = Math.min((W * 0.6) / spanX, (H * 0.6) / spanY, 2.0);
    cam = camFor(center, Math.max(1.3, scaleFit));
  }

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {countries.map((c, i) => (
            <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.5}
              stroke={LAND_STROKE} strokeOpacity={0.35} strokeWidth={0.9} />
          ))}

          {jalonCountries[0] && nigeriaTrace > 0 && (
            <g>
              {nigeriaFill > 0.01 && <path d={jalonCountries[0].d} fill={GOLD} fillOpacity={0.35 * nigeriaFill} stroke="none" />}
              <path d={jalonCountries[0].d} fill="none" stroke={GOLD} strokeWidth={2.4}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={nigeriaLen} strokeDashoffset={nigeriaLen * (1 - nigeriaTrace)} />
            </g>
          )}

          {jalons.slice(0, -1).map((a, i) => {
            const b = jalons[i + 1];
            const segT0 = segStarts[i], segT1 = segStarts[i + 1];
            const segReveal = interpolate(globalT, [segT0, segT1], [0, 1], clampB);
            if (segReveal <= 0) return null;
            const ctrl = ctrlOf(a, b, -16, 0.5);
            const len = quadLen(a, ctrl, b);
            return (
              <path key={`seg-${i}`} d={quadD(a, ctrl, b)} fill="none" stroke={GOLD}
                strokeWidth={3.6} strokeLinecap="round"
                strokeDasharray={len} strokeDashoffset={len * (1 - segReveal)} />
            );
          })}

          {jalonCountries.slice(1).map((c, i) => {
            const t = segStarts[i + 1];
            const reveal = interpolate(globalT, [t, t + 0.12], [0, 1], clampB);
            if (reveal <= 0) return null;
            const len = cachedPathLen(c.d);
            return (
              <g key={`reached-${i}`}>
                <path d={c.d} fill={GOLD} fillOpacity={0.22 * reveal} stroke="none" />
                <path d={c.d} fill="none" stroke={GOLD} strokeWidth={2}
                  strokeDasharray={len} strokeDashoffset={len * (1 - reveal)} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 14, color: "#c9d4ea", letterSpacing: 2 }}>
        {debugLabel}
      </div>
    </AbsoluteFill>
  );
};

export const ProtoA2CameraContinueSurMix: React.FC = () => (
  <ProtoA2CameraContinue debugLabel="CAMERA CONTINUE — suivi frame-par-frame + anticipation + sillage (sur Mix)" />
);

// Test sur les 13 VRAIS jalons (Nigeria->Maroc) — durée étendue (20s @30fps = 600f) pour laisser
// le mécanisme se déployer sur la vraie distance parcourue dans l'Acte 2 (le test à 4 jalons
// proches ne faisait quasiment pas bouger la caméra, échantillon trop court pour juger).
export const PROTO_A2_13JALONS_FRAMES = 600;
export const ProtoA2CameraContinue13Jalons: React.FC = () => (
  <ProtoA2CameraContinue
    debugLabel="CAMERA CONTINUE — 13 jalons reels Nigeria->Maroc (20s)"
    jalonNames={AAGP_13_NAMES}
    traceEndSec={19}
  />
);
