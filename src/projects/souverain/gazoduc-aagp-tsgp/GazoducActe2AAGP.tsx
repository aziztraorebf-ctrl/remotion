// GazoducActe2AAGP — Acte 2, SEGMENT CARTE COURT, 20.5s/615f@30fps — tracé physique AAGP pur
// (Nigeria→13 pays côtiers→Maroc→traversée Europe), joué APRÈS l'insert SVG "Freetown" et AVANT
// l'insert SVG "Flashback 2016" (cf GazoducActe2Signature.tsx) et l'insert "Financement" (cf
// GazoducActe2Financement.tsx). Montage en 4 segments distincts — jamais un fichier monolithique
// (doctrine DOCTRINE-SOUVERAIN.md §4.4).
//
// ⛔ V4 (2026-08-04) — reconstruction en segment court après le pivot 3(→4)-segments. Erreur de la
// session précédente à ne pas répéter : le fichier avait été rendu en 4165f (2min18) avec les 2
// inserts en PLACEHOLDERS internes — Aziz : "tu as créé une carte de 2 minutes 18 alors que [...]
// le modèle de la carte [...] ne devrait pas faire plus de 25-30 secondes". Durée calée sur le
// forced-align RÉEL du passage narré correspondant (narration-NEW.alignment.json, PAS une estimation) :
// "L'idée est de faire partir le gaz du Nigeria [...] alimenter l'Europe à hauteur de quinze
// milliards de mètres cubes par an" = 116.3s→136.8s = 20.5s = 615f exactement.
// Ce fichier ne garde QUE le tracé (plus de jeton Freetown, plus de fenêtres insert internes — les 2
// gèrent leur propre écran ailleurs dans le montage).
//
// Cadre V2/V3 conservé (toujours valable, cf REVISION-V2-APRES-REJET-V1.md) — 4 RÈGLES STRUCTURANTES :
//   1. La caméra raconte — suit le tracé en continu (jamais de saut entre points fixes).
//   2. Les pays réagissent à la narration — hiérarchie d'état, pas coloration permanente.
//   3. La composition évolue régulièrement — aucune fenêtre ne ressemble à une autre.
//   4. La carte n'est pas obligée de tout raconter.
//
// Nouveauté V4 (retour Aziz 2026-08-04) : les CountryLabel fixes remplacés par GeoCountryPlaque
// (apparition+fade, brique canonique réutilisée — cf src/projects/_shared/mapbox/GeoCountryPlaque.tsx)
// aux points d'arrêt du tracé, au lieu de noms qui restent affichés en continu.
//
// Sources réutilisées/adaptées, vérifiées dans le code réel :
//  - Caméra continue (position recalculée CHAQUE FRAME le long du tracé complet, anticipation +
//    fenêtre de sillage) : mécanisme prouvé dans ProtoGazoducA2CameraVsVoisins.tsx.
//  - Géo MIX (voisins visibles + caméra resserrée) : gazoducGeoElargie.json (76 pays), décision Aziz
//    2026-08-03.
//  - flowGold (doré AAGP) = valeur EXACTE THEMES.mixte.flowGold ("#FFC742").
//  - Fond : bleu-marine CFA éclairci (#3a5488/#2a3f66, valeurs EXACTES du proto validé Aziz).
//
// ⛔ Contraintes dures respectées : useCurrentFrame+interpolate uniquement, JAMAIS filter:blur CSS,
// pas de split-screen.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import geoData from "../../_rnd/d3-16x9/gazoducGeoElargie.json";
import { GeoCountryPlaque } from "../../_shared/mapbox/GeoCountryPlaque";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

// ===== Palette éclaircie — valeurs EXACTES du proto validé Aziz =====
const BG_TOP = "#3a5488";
const BG_BOT = "#2a3f66";
const LAND = "#4a608e";
const LAND_STROKE = "#e8ecf5";
const GOLD = "#FFC742";

// ===== Géo (76 pays MIX — Afrique + voisins) =====
type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const centroids = geoData.centroids as unknown as Record<string, [number, number]>;
const byName = (name: string) => countries.find((c) => c.name === name);

function pathLen(d: string): number {
  if (typeof document === "undefined") return 800;
  const svgNS = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", d);
  try {
    return path.getTotalLength();
  } catch {
    return 800;
  }
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

// ===== Courbes écran (Bézier quadratique) =====
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

// ===== Points-clés et tracé AAGP (13 pays côtiers réels) =====
const NIGERIA = centroids.Nigeria;
const MOROCCO = centroids.Morocco;
const AAGP_COUNTRY_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;
const AAGP_COUNTRY_LABELS_FR: Record<string, string> = {
  "Nigeria": "Nigeria", "Benin": "Bénin", "Togo": "Togo", "Ghana": "Ghana",
  "Côte d'Ivoire": "Côte d'Ivoire", "Liberia": "Libéria", "Sierra Leone": "Sierra Leone",
  "Guinea": "Guinée", "Guinea-Bissau": "Guinée-Bissau", "Gambia": "Gambie",
  "Senegal": "Sénégal", "Mauritania": "Mauritanie", "Morocco": "Maroc",
};
const aagpCountries = AAGP_COUNTRY_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const aagpJalons: [number, number][] = aagpCountries.map((c) => bboxCentroid(c.d));
const aagpSegLens = aagpJalons.slice(0, -1).map((a, i) => Math.hypot(
  aagpJalons[i + 1][0] - a[0], aagpJalons[i + 1][1] - a[1],
));
const aagpTotalLen = aagpSegLens.reduce((a, b) => a + b, 0) || 1;
const aagpSegStarts: number[] = [0];
{
  let acc = 0;
  for (const len of aagpSegLens) { acc += len; aagpSegStarts.push(acc / aagpTotalLen); }
}

// ===== Traversée Europe : Espagne → Portugal → France, illumination successive =====
const EUROPE_COUNTRY_NAMES = ["Spain", "Portugal", "France"] as const;
const EUROPE_LABELS_FR: Record<string, string> = { "Spain": "Espagne", "Portugal": "Portugal", "France": "France" };
const europeCountries = EUROPE_COUNTRY_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const europeJalons: [number, number][] = europeCountries.map((c) => bboxCentroid(c.d));

// ===== CAMÉRA CONTINUE =====
type Cam = { scale: number; tx: number; ty: number };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function camFor(center: [number, number], scale: number): Cam {
  return { scale, tx: W / 2 - center[0] * scale, ty: H / 2 - center[1] * scale };
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
const aagpFullPath = buildFullPathSamples(aagpJalons, -18, 40);

// ===== Timing — 615f exactement (20.5s @30fps, forced-align réel) =====
// V3 (2026-08-04) — retour croisé Gemini+GPT sur le rendu V2 : 13 plaques nominatives en ~12s =
// bruit informationnel ("le spectateur doit choisir entre lire le pays ou suivre le tracé"), Maroc
// pas assez climax, chevauchement Europe (bug "Portugal-ne" confirmé par extraction de frames).
// Fix : hiérarchie à 3 niveaux (Nigeria=référence complète, 9 pays intermédiaires=contour SEUL sans
// plaque, Maroc=climax avec hold ralenti) + Mauritanie mention discrète + Europe sans chevauchement.
// Marge de sécurité audio (retour Aziz 2026-08-04) : les fenêtres audio calées PILE sur la fin du
// dernier mot mesuré (forced-align) coupaient le mot avant qu'il finisse de se prononcer ("an."/
// "s'enchaînent." tranchés) — la Sequence du montage coupe l'Audio net à sa durée, sans tolérance.
// +9f (300ms) de hold visuel à la fin de chaque segment, laisse le mot respirer avant la coupe.
const AUDIO_SAFETY_MARGIN_F = 9;
export const GAZODUC_A2_FRAMES = 615 + AUDIO_SAFETY_MARGIN_F;
const BEAT_T = {
  b1End: S(3.0),          // Nigeria se trace (ouverture)
  traceStart: S(3.0),     // début tracé 13 pays
  marocApproach: S(13.5), // début ralentissement climax (avant l'arrivée exacte)
  marocArriveAt: S(15.2), // arrivée Maroc (tracé complet)
  marocHoldEnd: S(17.0),  // fin du hold climax — pause plus longue qu'avant (retour GPT)
  europeStart: S(17.0),
  europeEnd: 615,         // fin du CONTENU (tracé complet) — le hold audio vient après
};
const B = BEAT_T;

export const GazoducActe2AAGP: React.FC = () => {
  const frame = useCurrentFrame();

  const globalFadeIn = interpolate(frame, [0, S(0.5)], [0, 1], clampB);
  const globalFadeOut = interpolate(frame, [B.europeEnd + AUDIO_SAFETY_MARGIN_F - S(0.3), B.europeEnd + AUDIO_SAFETY_MARGIN_F], [1, 0], clampB);

  // ===== Nigeria se trace dès la frame 0, caméra déjà en mouvement =====
  const nigeriaCountry = byName("Nigeria");
  const nigeriaLen = nigeriaCountry ? cachedPathLen(nigeriaCountry.d) : 0;
  const nigeriaTrace = interpolate(frame, [S(0.1), S(1.2)], [0, 1], clampB);
  const nigeriaFill = interpolate(frame, [S(0.6), S(1.6)], [0, 1], clampB);

  // ===== CAMÉRA CONTINUE sur toute la durée =====
  const traceStart = B.traceStart;
  const traceEnd = B.marocArriveAt;
  const aagpGlobalT = interpolate(frame, [traceStart, traceEnd], [0, 1], clampB);

  const camWideStart = camFor(NIGERIA, 1.0);
  const camNigeriaClose = camFor(NIGERIA, 2.6);
  let cam: Cam;
  if (frame < B.b1End) {
    const p = easeInOut(Math.min(1, frame / B.b1End));
    cam = { scale: camWideStart.scale + (camNigeriaClose.scale - camWideStart.scale) * p,
      tx: camWideStart.tx + (camNigeriaClose.tx - camWideStart.tx) * p,
      ty: camWideStart.ty + (camNigeriaClose.ty - camWideStart.ty) * p };
  } else if (frame < B.marocApproach) {
    // Suivi continu du tracé (rythme régulier, sillage large — "regarde ici, maintenant suis-moi").
    const tAhead = Math.min(1, aagpGlobalT + 0.08);
    const idx = Math.round(tAhead * (aagpFullPath.length - 1));
    const backWindow = Math.round(aagpFullPath.length * 0.45);
    const aheadWindow = Math.round(aagpFullPath.length * 0.1);
    const bbox = windowBBox(aagpFullPath, idx, backWindow, aheadWindow);
    const center: [number, number] = [(bbox.minX + bbox.maxX) / 2, (bbox.minY + bbox.maxY) / 2];
    const spanX = Math.max(140, bbox.maxX - bbox.minX);
    const spanY = Math.max(140, bbox.maxY - bbox.minY);
    const scaleFit = Math.min((W * 0.6) / spanX, (H * 0.6) / spanY, 2.0);
    cam = camFor(center, Math.max(1.3, scaleFit));
  } else if (frame < B.marocHoldEnd) {
    // Climax Maroc (retour GPT/Gemini) : la caméra RALENTIT progressivement en approchant, puis HOLD
    // net sur le Maroc — contraste net avec le rythme régulier du suivi de tracé précédent.
    const tAhead = Math.min(1, aagpGlobalT + 0.08);
    const idx = Math.round(tAhead * (aagpFullPath.length - 1));
    const backWindow = Math.round(aagpFullPath.length * 0.45);
    const aheadWindow = Math.round(aagpFullPath.length * 0.1);
    const bbox = windowBBox(aagpFullPath, idx, backWindow, aheadWindow);
    const center: [number, number] = [(bbox.minX + bbox.maxX) / 2, (bbox.minY + bbox.maxY) / 2];
    const spanX = Math.max(140, bbox.maxX - bbox.minX);
    const spanY = Math.max(140, bbox.maxY - bbox.minY);
    const scaleFit = Math.min((W * 0.6) / spanX, (H * 0.6) / spanY, 2.0);
    const camTrace = camFor(center, Math.max(1.3, scaleFit));
    const camMarocClose = camFor(MOROCCO, 2.0);
    const p = easeInOut(Math.min(1, (frame - B.marocApproach) / (B.marocHoldEnd - B.marocApproach)));
    cam = { scale: camTrace.scale + (camMarocClose.scale - camTrace.scale) * p,
      tx: camTrace.tx + (camMarocClose.tx - camTrace.tx) * p,
      ty: camTrace.ty + (camMarocClose.ty - camTrace.ty) * p };
  } else {
    // Traversée Europe : zoom-out qui embrasse Maroc + les 3 pays européens (recul de cadre net,
    // retour GPT : "la caméra vient de terminer son voyage au Maroc, pause, puis elle recule").
    const p = easeInOut(Math.min(1, (frame - B.europeStart) / (B.europeEnd - B.europeStart)));
    const camMaroc = camFor(MOROCCO, 2.0);
    const centerEurope: [number, number] = europeJalons.length
      ? [(MOROCCO[0] + europeJalons[europeJalons.length - 1][0]) / 2, (MOROCCO[1] + europeJalons[europeJalons.length - 1][1]) / 2 - 20]
      : MOROCCO;
    const camEurope = camFor(centerEurope, 1.4);
    cam = { scale: camMaroc.scale + (camEurope.scale - camMaroc.scale) * p,
      tx: camMaroc.tx + (camEurope.tx - camMaroc.tx) * p,
      ty: camMaroc.ty + (camEurope.ty - camMaroc.ty) * p };
  }

  const continentReveal = interpolate(frame, [0, S(0.7)], [0, 1], clampB);

  const europeReveal = (idx: number) => {
    const t0 = B.europeStart + idx * 40;
    const t1 = t0 + 30;
    return interpolate(frame, [t0, t1], [0, 1], clampB);
  };
  // Fenêtres de plaque Europe SÉQUENTIELLES STRICTES (fix bug "Portugal-ne" — les 3 plaques
  // s'affichaient simultanément jusqu'à la fin, jamais de hideAt réel). Chacune apparaît, reste
  // ~0.6s, disparaît AVANT la suivante — hiérarchie secondaire (retour GPT), pas le même traitement
  // que Nigeria/Maroc.
  function europePlaqueWindow(idx: number): { appearAt: number; hideAt: number } {
    const appearAt = B.europeStart + idx * 55;
    const hideAt = appearAt + 42; // ~1.4s, disparaît avant la plaque suivante (55f d'écart)
    return { appearAt, hideAt };
  }

  // ===== Hiérarchie d'état par pays =====
  function countryState(idx: number): "inactive" | "approached" | "active" | "destination" {
    if (idx === aagpCountries.length - 1 && aagpGlobalT >= aagpSegStarts[idx] - 0.03) return "destination";
    const segT = aagpSegStarts[idx];
    if (aagpGlobalT >= segT - 0.06 && aagpGlobalT < segT + 0.1) return "active";
    if (aagpGlobalT >= segT - 0.14 && aagpGlobalT < segT - 0.06) return "approached";
    return "inactive";
  }
  function countryActiveFrame(idx: number): number {
    const segT = aagpSegStarts[idx];
    const target = Math.max(0, segT - 0.06);
    return traceStart + target * (traceEnd - traceStart);
  }
  // ===== V4 — hiérarchie à 2 niveaux (retour Aziz 2026-08-04, après V3) : retrait de la géoplaque
  // Mauritanie — "j'enlèverais la Mauritanie comme géoplaque [...] je garderai le Maroc et l'Espagne
  // et Europe, évidemment, le Nigeria". Seuls Nigeria (référence, cf retour GPT) et Maroc (climax)
  // reçoivent une plaque nominative complète. Les 10 autres pays intermédiaires (dont Mauritanie)
  // gardent SEULEMENT leur contour qui s'illumine (déjà en place via countryState) — pas de plaque.
  const NIGERIA_IDX = 0;
  const MOROCCO_IDX = aagpCountries.length - 1;
  function plaqueWindow(idx: number): { appearAt: number; hideAt: number } | null {
    if (idx === NIGERIA_IDX) {
      return { appearAt: S(0.3), hideAt: S(2.6) };
    }
    if (idx === MOROCCO_IDX) {
      // Climax : apparaît pendant le hold ralenti, reste affiché plus longtemps (retour GPT).
      return { appearAt: B.marocArriveAt, hideAt: B.marocHoldEnd + S(0.3) };
    }
    return null; // pays intermédiaire (dont Mauritanie) : contour seul, pas de plaque
  }

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)`, opacity: globalFadeIn * globalFadeOut }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {/* Fond continent + voisins : discret, jamais vide autour */}
          {countries.map((c, i) => (
            <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.5 * continentReveal}
              stroke={LAND_STROKE} strokeOpacity={0.32 * continentReveal} strokeWidth={0.85} />
          ))}

          {/* Nigeria : contour qui se trace PUIS se remplit */}
          {nigeriaCountry && nigeriaTrace > 0 && (
            <g>
              {nigeriaFill > 0.01 && <path d={nigeriaCountry.d} fill={GOLD} fillOpacity={0.32 * nigeriaFill} stroke="none" />}
              <path d={nigeriaCountry.d} fill="none" stroke={GOLD} strokeWidth={2.6}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={nigeriaLen} strokeDashoffset={nigeriaLen * (1 - nigeriaTrace)} />
            </g>
          )}

          {/* Tracé AAGP : segment par segment, doré */}
          {aagpJalons.slice(0, -1).map((a, i) => {
            const b = aagpJalons[i + 1];
            const segT0 = aagpSegStarts[i], segT1 = aagpSegStarts[i + 1];
            const segReveal = interpolate(aagpGlobalT, [segT0, segT1], [0, 1], clampB);
            if (segReveal <= 0) return null;
            const ctrl = ctrlOf(a, b, -18, 0.5);
            const len = quadLen(a, ctrl, b);
            return (
              <path key={`aagp-seg-${i}`} d={quadD(a, ctrl, b)} fill="none" stroke={GOLD}
                strokeWidth={3.6} strokeLinecap="round"
                strokeDasharray={len} strokeDashoffset={len * (1 - segReveal)} />
            );
          })}

          {/* Hiérarchie d'état par pays */}
          {aagpCountries.map((c, i) => {
            const state = countryState(i);
            if (state === "inactive") return null;
            if (state === "approached") {
              const t = aagpSegStarts[i];
              const reveal = interpolate(aagpGlobalT, [t - 0.14, t - 0.06], [0, 1], clampB);
              return (
                <path key={`c-${i}`} d={c.d} fill="none" stroke={GOLD} strokeOpacity={0.5 * reveal}
                  strokeWidth={1.4} />
              );
            }
            if (state === "active") {
              const t = aagpSegStarts[i];
              const reveal = interpolate(aagpGlobalT, [t - 0.06, t + 0.1], [0, 1], clampB);
              return (
                <g key={`c-${i}`}>
                  <path d={c.d} fill={GOLD} fillOpacity={0.18 * reveal} stroke="none" />
                  <path d={c.d} fill="none" stroke={GOLD} strokeOpacity={0.85 * reveal} strokeWidth={2} />
                </g>
              );
            }
            const reveal = interpolate(aagpGlobalT, [aagpSegStarts[i] - 0.03, aagpSegStarts[i] + 0.05], [0, 1], clampB);
            return (
              <g key={`c-${i}`}>
                <path d={c.d} fill={GOLD} fillOpacity={0.3 * reveal} stroke="none" />
                <path d={c.d} fill="none" stroke={GOLD} strokeOpacity={reveal} strokeWidth={2.8} />
              </g>
            );
          })}

          {/* Traversée Europe : plusieurs pays qui s'illuminent successivement */}
          {europeCountries.map((c, i) => {
            const reveal = europeReveal(i);
            if (reveal <= 0.01) return null;
            return (
              <g key={`eu-${i}`}>
                <path d={c.d} fill={GOLD} fillOpacity={0.28 * reveal} stroke="none" />
                <path d={c.d} fill="none" stroke={GOLD} strokeOpacity={reveal} strokeWidth={2.4} />
              </g>
            );
          })}

          {/* Arc Maroc -> Europe (flux physique traversé) */}
          {europeReveal(0) > 0.01 && europeJalons[0] && (() => {
            const a = MOROCCO;
            const b = europeJalons[0];
            const ctrl = ctrlOf(a, b, 20, 0.5);
            const len = quadLen(a, ctrl, b);
            const reveal = europeReveal(0);
            return (
              <path d={quadD(a, ctrl, b)} fill="none" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round"
                strokeDasharray={len} strokeDashoffset={len * (1 - reveal)} opacity={0.85} />
            );
          })()}
        </g>
      </svg>

      {/* Géoplaques (apparition+fade) — hiérarchie à 3 niveaux V3 (retour Gemini+GPT) : Nigeria +
          Maroc = traitement complet, Mauritanie = mention discrète, les 9 autres = contour SEUL
          (pas de plaque, cf countryState ci-dessus qui gère déjà leur illumination). */}
      {aagpCountries.map((c, i) => {
        const win = plaqueWindow(i);
        if (!win) return null;
        const [gx, gy] = aagpJalons[i];
        const screenX = gx * cam.scale + cam.tx;
        const screenY = gy * cam.scale + cam.ty;
        return (
          <GeoCountryPlaque
            key={`plaque-${i}`}
            frame={frame}
            name={AAGP_COUNTRY_LABELS_FR[AAGP_COUNTRY_NAMES[i]]}
            color={GOLD}
            appearAt={win.appearAt}
            hideAt={win.hideAt}
            pos={{ x: screenX, y: screenY }}
          />
        );
      })}
      {europeCountries.map((c, i) => {
        const { appearAt, hideAt } = europePlaqueWindow(i);
        const [gx, gy] = europeJalons[i];
        const screenX = gx * cam.scale + cam.tx;
        const screenY = gy * cam.scale + cam.ty;
        return (
          <GeoCountryPlaque
            key={`eu-plaque-${i}`}
            frame={frame}
            name={EUROPE_LABELS_FR[EUROPE_COUNTRY_NAMES[i]]}
            color={GOLD}
            appearAt={appearAt}
            hideAt={hideAt}
            pos={{ x: screenX, y: screenY }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default GazoducActe2AAGP;
