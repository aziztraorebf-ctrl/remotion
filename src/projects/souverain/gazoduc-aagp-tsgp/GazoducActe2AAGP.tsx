// GazoducActe2AAGP — Acte 2 "AAGP" (Partie 2 du script), carte D3 plate, 138.84s/4165f@30fps.
//
// ⛔ V3 (2026-08-04) — retrait des 2 overlays plein-ecran improvises (jetons Mohammed VI/Buhari,
// jauge financement) apres retour Aziz : "on parle de contrats, de projets abstraits [...] la
// carte n'a servi que pour montrer les traces [...] tout le reste n'est pas spatial". Confirme par
// 3 agents (Soudan/CFA/synthese) qui ont etudie les inserts SVG narratifs des 2 videos precedentes
// (memoire : da-brief-acte2/REVISION-V2-APRES-REJET-V1.md + synthese comparative en session).
// DECISION : la carte ne garde QUE ce qui est reellement spatial (tracé + traversée Europe). La
// genese/signature (Beat 2.4) et le financement/virtuel/Mauritanie (Beat 2.5) deviennent 2 INSERTS
// SVG separes (hors de ce fichier, generation en cours — cf out/_rnd/gazoduc-svg-inserts/), montes
// PLUS TARD dans le montage acte. Ce fichier ne garde que des PLACEHOLDERS neutres a ces emplacements
// en attendant le choix final des scenes SVG (mix-and-match Aziz).
//
// Corrections V3 additionnelles (retour Aziz, avant lancement des agents inserts) :
//  - Noms de PAYS affiches au fil du trace (pas de villes — decision Aziz) au lieu d'une ligne
//    abstraite sans repere.
//  - Traversee Europe : PLUSIEURS pays (Espagne/Portugal/France) qui s'illuminent successivement,
//    pas un simple trait qui s'estompe comme en V2.
//
// Cadre V2 conserve (toujours valable, cf REVISION-V2-APRES-REJET-V1.md) — 4 REGLES STRUCTURANTES :
//   1. La camera raconte — suit le trace en continu (jamais de saut entre points fixes).
//   2. Les pays reagissent a la narration — hierarchie d'etat, pas coloration permanente.
//   3. La composition evolue regulierement — aucune fenetre de ~30s ne ressemble a une autre.
//   4. La carte n'est pas obligee de tout raconter — d'ou le retrait des 2 overlays improvises.
//
// Sources reutilisees/adaptees, verifiees dans le code reel :
//  - Camera continue (position recalculee CHAQUE FRAME le long du trace complet, anticipation +
//    fenetre de sillage) : mecanisme prouve dans ProtoGazoducA2CameraVsVoisins.tsx
//    (ProtoA2CameraContinue13Jalons, valide Aziz sur les 13 vrais jalons Nigeria->Maroc).
//  - Geo MIX (voisins visibles + camera resserree) : gazoducGeoElargie.json (76 pays — Afrique +
//    Amerique du Sud + Europe + Moyen-Orient), decision Aziz 2026-08-03.
//  - InsertEchelle / PaysTrace / polylineLength : recrees sur le MEME modele que
//    GazoducActe1Hook.tsx (composants locaux non exportes la-bas).
//  - flowGold (dore AAGP) = valeur EXACTE THEMES.mixte.flowGold ("#FFC742"). TSGP reste "#c1502e"
//    (corail sombre, Acte 1) — PAS l'orange invente par le DA-brief upstream.
//  - Fond : bleu-marine CFA ECLAIRCI (#3a5488/#2a3f66, valeurs EXACTES du proto valide Aziz) — PAS
//    THEMES.mixte.bg (pense pour un ciel etoile), PAS les valeurs sombres v1 (regression corrigee
//    2026-08-03, "thème bleu nuit profond, on dirait que tu es revenu en arrière").
//
// ⛔ Contraintes dures respectees : useCurrentFrame+interpolate/spring uniquement, JAMAIS filter:blur
// CSS, pas de split-screen, rouge toujours semi-transparent.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import geoData from "../../_rnd/d3-16x9/gazoducGeoElargie.json";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

// ===== Palette ECLAIRCIE — valeurs EXACTES du proto valide Aziz =====
const BG_TOP = "#3a5488";
const BG_BOT = "#2a3f66";
const LAND = "#4a608e";
const LAND_STROKE = "#e8ecf5";
const GOLD = "#FFC742"; // flowGold reel (THEMES.mixte), AAGP
const CREAM = "#f2ebd9";
const WARN = "#e0a13a";

// ===== Geo (76 pays MIX — Afrique + voisins, cf gazoducGeoElargie.json) =====
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

// ===== Cartouche km (meme modele qu'InsertEchelle, Acte 1) =====
const InsertEchelle: React.FC<{ frame: number; inAt: number; outAt: number }> = ({ frame, inAt, outAt }) => {
  const op = interpolate(frame, [inAt, inAt + 16, outAt - 16, outAt], [0, 1, 1, 0], clampB);
  if (op <= 0) return null;
  const rise = interpolate(frame, [inAt, inAt + 20], [30, 0], clampB);
  const aagpVal = Math.round(interpolate(frame, [inAt + 12, inAt + 66], [0, 6900], clampB));
  const barMaxW = 260;
  const aagpBarW = interpolate(frame, [inAt + 12, inAt + 66], [0, barMaxW], clampB);
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%",
      transform: `translate(-50%, calc(-50% + ${rise}px))`, opacity: op, pointerEvents: "none",
      background: "linear-gradient(150deg, #1a2338 0%, #0f1626 100%)",
      border: `2px solid ${GOLD}88`, borderRadius: 10, padding: "22px 36px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.08)",
      fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}>AAGP</span>
        <div style={{ height: 18, width: aagpBarW, background: GOLD, borderRadius: 3, boxShadow: `0 0 10px ${GOLD}80`,
          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 26px)" }} />
        <span style={{ fontSize: 30, fontWeight: 800, color: CREAM }}>{aagpVal.toLocaleString("fr-FR")} km</span>
      </div>
    </div>
  );
};

// Compteur secondaire generique (15 Mds m3), meme famille visuelle qu'InsertEchelle.
const CounterBadge: React.FC<{
  frame: number; inAt: number; outAt: number; label: string; to: number; suffix: string; color?: string;
}> = ({ frame, inAt, outAt, label, to, suffix, color = GOLD }) => {
  const op = interpolate(frame, [inAt, inAt + 14, outAt - 14, outAt], [0, 1, 1, 0], clampB);
  if (op <= 0) return null;
  const val = Math.round(interpolate(frame, [inAt + 6, inAt + 50], [0, to], clampB) * 10) / 10;
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
      opacity: op, pointerEvents: "none", textAlign: "center", fontFamily: "Georgia, serif" }}>
      <div style={{ fontSize: 16, letterSpacing: 3, color: "#9fb2cf", textTransform: "uppercase",
        fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
      <div style={{ fontSize: 56, fontWeight: 900, color }}>
        {val.toLocaleString("fr-FR")} <span style={{ fontSize: 28 }}>{suffix}</span>
      </div>
    </div>
  );
};

// ===== Label pays qui apparait pres du jalon au moment ou le trace le franchit (Regle "noms de
// pays au fil du trace", retour Aziz — remplace la ligne abstraite sans repere de la V2). =====
const CountryLabel: React.FC<{ pos: [number, number]; name: string; frame: number; appear: number; camScale: number }> = ({
  pos, name, frame, appear, camScale,
}) => {
  if (frame < appear) return null;
  const op = interpolate(frame, [appear, appear + 10, appear + 90, appear + 110], [0, 1, 1, 0], clampB);
  if (op <= 0) return null;
  const rise = interpolate(frame, [appear, appear + 12], [8, 0], clampB);
  // taille inversement proportionnelle au zoom cam pour rester lisible a toutes les echelles.
  const fontSize = Math.max(13, Math.min(22, 15 / Math.max(0.5, camScale) * 2.2));
  return (
    <g transform={`translate(${pos[0]} ${pos[1] - 22 - rise})`} opacity={op}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace"
        fontSize={fontSize} fontWeight={700} fill={CREAM} stroke={BG_BOT} strokeWidth={fontSize * 0.28}
        paintOrder="stroke" letterSpacing={1}>
        {name.toUpperCase()}
      </text>
    </g>
  );
};

// ===== Courbes ecran (Bezier quadratique) =====
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

// ===== Points-cles et tracé AAGP (13 pays cotiers reels, cf da-brief-acte1/BREAKDOWN-ACTE1.md L30-31) =====
const NIGERIA = centroids.Nigeria;
const MOROCCO = centroids.Morocco;
const AAGP_COUNTRY_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;
// Noms FR affiches a l'ecran (le nom technique de la geo peut differer, ex "Côte d'Ivoire" déjà FR).
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

// ===== Traversee Europe : PLUSIEURS pays qui s'illuminent successivement (retour Aziz — pas un
// simple trait qui s'estompe). Espagne (point d'entree Gibraltar) -> Portugal -> France. =====
const EUROPE_COUNTRY_NAMES = ["Spain", "Portugal", "France"] as const;
const EUROPE_LABELS_FR: Record<string, string> = { "Spain": "Espagne", "Portugal": "Portugal", "France": "France" };
const europeCountries = EUROPE_COUNTRY_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const europeJalons: [number, number][] = europeCountries.map((c) => bboxCentroid(c.d));

// ===== CAMERA CONTINUE — Regle 1 =====
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

// ===== Timing (fenetre Acte 2 : 4165f @30fps) =====
// Beats 2.4 (genese/signature) et 2.5 (financement/virtuel/Mauritanie) sortent de la carte —
// deviennent des inserts SVG separes montes en dehors de ce fichier (cf en-tete). Les frames
// ci-dessous marquent seulement la FENETRE que la carte doit laisser vide/neutre a ces moments.
export const GAZODUC_A2_FRAMES = 4165;
const BEAT_T = {
  b1Start: 0, b1End: 282, // ouverture : Nigeria se trace des la frame 0
  freetownAt: 282, chefsAt: 352,
  b3Start: 843, b3End: 1481, // tracé 13 pays, arrivee Maroc
  marocArriveAt: 1186,
  europeStart: 1300, europeEnd: 1700, // traversee Europe multi-pays (avant insert genese/signature)
  insertSignatureStart: 1700, insertSignatureEnd: 2323, // -> INSERT SVG separe (hors carte)
  insertFinancementStart: 2900, insertFinancementEnd: 4165, // -> INSERT SVG separe (hors carte)
};
const B = BEAT_T;

export const GazoducActe2AAGP: React.FC = () => {
  const frame = useCurrentFrame();

  const globalFadeIn = interpolate(frame, [0, S(0.8)], [0, 1], clampB);

  // ===== Beat 2.1 : Nigeria se trace des la frame 0, camera deja en mouvement =====
  const nigeriaCountry = byName("Nigeria");
  const nigeriaLen = nigeriaCountry ? cachedPathLen(nigeriaCountry.d) : 0;
  const nigeriaTrace = interpolate(frame, [S(0.2), S(1.6)], [0, 1], clampB);
  const nigeriaFill = interpolate(frame, [S(1.0), S(2.0)], [0, 1], clampB);

  // ===== CAMERA CONTINUE sur toute la duree carte (2.1 -> fin traversee Europe) =====
  const traceStart = B.freetownAt;
  const traceEnd = B.marocArriveAt;
  const aagpGlobalT = interpolate(frame, [traceStart, traceEnd], [0, 1], clampB);

  const camWideStart = camFor(NIGERIA, 1.0);
  const camNigeriaClose = camFor(NIGERIA, 2.6);
  let cam: Cam;
  const onCarte = frame < B.insertSignatureStart || frame >= B.insertSignatureEnd;
  if (frame < B.b1End) {
    const p = easeInOut(Math.min(1, frame / B.b1End));
    cam = { scale: camWideStart.scale + (camNigeriaClose.scale - camWideStart.scale) * p,
      tx: camWideStart.tx + (camNigeriaClose.tx - camWideStart.tx) * p,
      ty: camWideStart.ty + (camNigeriaClose.ty - camWideStart.ty) * p };
  } else if (frame < B.europeStart) {
    // Suivi continu du trace AAGP (anticipation + fenetre de sillage).
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
  } else if (frame < B.insertSignatureStart) {
    // Traversee Europe : zoom-out qui embrasse Maroc + les 3 pays europeens (Regle 3, composition
    // differente du suivi de trace precedent).
    const p = easeInOut(Math.min(1, (frame - B.europeStart) / (B.insertSignatureStart - B.europeStart)));
    const camMaroc = camFor(MOROCCO, 2.0);
    const centerEurope: [number, number] = europeJalons.length
      ? [(MOROCCO[0] + europeJalons[europeJalons.length - 1][0]) / 2, (MOROCCO[1] + europeJalons[europeJalons.length - 1][1]) / 2 - 20]
      : MOROCCO;
    const camEurope = camFor(centerEurope, 1.4);
    cam = { scale: camMaroc.scale + (camEurope.scale - camMaroc.scale) * p,
      tx: camMaroc.tx + (camEurope.tx - camMaroc.tx) * p,
      ty: camMaroc.ty + (camEurope.ty - camMaroc.ty) * p };
  } else if (frame < B.insertFinancementStart) {
    // Fenetre insert genese/signature : carte hors-champ (insert SVG separe monte par-dessus).
    cam = camFor(MOROCCO, 1.4);
  } else if (frame < B.insertFinancementEnd) {
    // Fenetre insert financement/virtuel/Mauritanie : idem, carte hors-champ.
    const camEuropeEnd = europeJalons.length
      ? camFor([(MOROCCO[0] + europeJalons[europeJalons.length - 1][0]) / 2, (MOROCCO[1] + europeJalons[europeJalons.length - 1][1]) / 2 - 20], 1.4)
      : camFor(MOROCCO, 1.4);
    cam = camEuropeEnd;
  } else {
    cam = camFor(MOROCCO, 1.4);
  }

  const continentReveal = interpolate(frame, [0, S(1.0)], [0, 1], clampB);

  // ===== Traversee Europe : reveal successif des 3 pays (pas un trait qui s'estompe) =====
  const europeReveal = (idx: number) => {
    const t0 = B.europeStart + idx * 110;
    const t1 = t0 + 70;
    return interpolate(frame, [t0, t1], [0, 1], clampB);
  };

  const mauritaniaCountry = byName("Mauritania");

  // ===== Hierarchie d'etat par pays (Regle 2) =====
  function countryState(idx: number): "inactive" | "approached" | "active" | "destination" {
    if (idx === aagpCountries.length - 1 && aagpGlobalT >= aagpSegStarts[idx] - 0.03) return "destination";
    const segT = aagpSegStarts[idx];
    if (aagpGlobalT >= segT - 0.06 && aagpGlobalT < segT + 0.1) return "active";
    if (aagpGlobalT >= segT - 0.14 && aagpGlobalT < segT - 0.06) return "approached";
    return "inactive";
  }
  // frame ou chaque pays devient "actif" (pour le label CountryLabel)
  function countryActiveFrame(idx: number): number {
    const segT = aagpSegStarts[idx];
    // interpolation inverse approx : on cherche le frame ou aagpGlobalT atteint segT-0.06
    const target = Math.max(0, segT - 0.06);
    return traceStart + target * (traceEnd - traceStart);
  }

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)`, opacity: globalFadeIn }}>
      <Audio src={staticFile("souverain/gazoduc-aagp-tsgp/audio/narration-p2.mp3")} />

      {onCarte && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
            {/* Fond continent + voisins (Mix geo elargie) : discret, jamais vide autour */}
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

            {/* Tracé AAGP : segment par segment, dore, vitesse non-lineaire */}
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

            {/* Hierarchie d'etat par pays (Regle 2) */}
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

            {/* Noms de pays au fil du trace (retour Aziz — remplace la ligne abstraite) */}
            {aagpCountries.map((c, i) => (
              <CountryLabel key={`label-${i}`} pos={aagpJalons[i]}
                name={AAGP_COUNTRY_LABELS_FR[AAGP_COUNTRY_NAMES[i]]}
                frame={frame} appear={countryActiveFrame(i)} camScale={cam.scale} />
            ))}

            {/* Traversee Europe : plusieurs pays qui s'illuminent successivement */}
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
            {europeCountries.map((c, i) => (
              <CountryLabel key={`eu-label-${i}`} pos={europeJalons[i]} name={EUROPE_LABELS_FR[EUROPE_COUNTRY_NAMES[i]]}
                frame={frame} appear={B.europeStart + i * 110} camScale={cam.scale} />
            ))}

            {/* Arc Maroc -> Europe (flux physique traverse) */}
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

            {/* Mauritanie : contour discret (deplace de la carte vers l'insert financement — reste
                visible ici seulement comme jalon normal du trace, pas de warning special) */}
          </g>
        </svg>
      )}

      {/* Pas de legende "AAGP" — un seul trace dans toute la video, redondant (retour Aziz) */}

      {/* Beat 2.2 : jeton Freetown (lieu de signature — reste sur la carte, c'est un LIEU) */}
      {onCarte && frame >= B.freetownAt && frame < B.b3Start && (
        <div style={{ position: "absolute", left: aagpJalons[0][0] * cam.scale + cam.tx,
          top: aagpJalons[0][1] * cam.scale + cam.ty - 60, transform: "translate(-50%,-100%)",
          opacity: interpolate(frame, [B.chefsAt, B.chefsAt + 12], [0, 1], clampB),
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: CREAM,
          background: "rgba(15,20,35,0.85)", padding: "4px 10px", borderRadius: 4,
          border: `1px solid ${GOLD}66`, whiteSpace: "nowrap" }}>
          19 juillet 2026 — Freetown
        </div>
      )}

      {/* Chiffre 6900km = ponctuation visuelle (Regle 3) : rupture nette, pas un badge discret. */}
      {frame >= B.marocArriveAt - S(0.2) && frame < B.marocArriveAt + S(1.4) && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#0a1220",
            opacity: interpolate(frame, [B.marocArriveAt - S(0.2), B.marocArriveAt + S(0.15)], [0, 0.35], clampB) }} />
          <InsertEchelle frame={frame} inAt={B.marocArriveAt} outAt={B.marocArriveAt + S(1.4)} />
        </>
      )}
      {/* Chiffre 15 Mds m3 = ponctuation visuelle, ancre a la fin de la traversee Europe */}
      {frame >= B.europeEnd - S(0.5) && frame < B.europeEnd + S(1.0) && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#0a1220",
            opacity: interpolate(frame, [B.europeEnd - S(0.5), B.europeEnd - S(0.3)], [0, 0.3], clampB) }} />
          <CounterBadge frame={frame} inAt={B.europeEnd - S(0.5)} outAt={B.europeEnd + S(1.0)} label="Capacité visée" to={15} suffix="Mds m³/an" />
        </>
      )}

      {/* Beat 2.4 : PLACEHOLDER — insert SVG "genese 2016 + signature" a monter ici (hors carte,
          generation en cours, cf out/_rnd/gazoduc-svg-inserts/). Fond neutre + reperes de debug
          uniquement, a remplacer par le vrai insert une fois la scene choisie. */}
      {frame >= B.insertSignatureStart && frame < B.insertSignatureEnd && (
        <div style={{ position: "absolute", inset: 0, background: BG_BOT,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: interpolate(frame, [B.insertSignatureStart, B.insertSignatureStart + S(0.4),
            B.insertSignatureEnd - S(0.4), B.insertSignatureEnd], [0, 1, 1, 0], clampB) }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: "#9fb2cf",
            letterSpacing: 2, textAlign: "center" }}>
            [ INSERT SVG — genèse 2016 + signature Freetown — à monter ]
          </div>
        </div>
      )}

      {/* Beat 2.5 : PLACEHOLDER — insert SVG "financement manquant + tuyaux virtuels + Mauritanie"
          a monter ici (hors carte, generation en cours). */}
      {frame >= B.insertFinancementStart && frame < B.insertFinancementEnd && (
        <div style={{ position: "absolute", inset: 0, background: BG_BOT,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: interpolate(frame, [B.insertFinancementStart, B.insertFinancementStart + S(0.4),
            B.insertFinancementEnd - S(0.4), B.insertFinancementEnd], [0, 1, 1, 0], clampB) }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: "#9fb2cf",
            letterSpacing: 2, textAlign: "center" }}>
            [ INSERT SVG — financement manquant + tuyaux virtuels + Mauritanie — à monter ]
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default GazoducActe2AAGP;
