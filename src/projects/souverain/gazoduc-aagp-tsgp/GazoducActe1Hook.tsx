// ACTE 1 "L'anomalie" (hook) — Gazoduc AAGP vs TSGP — GLOBE D3 (16:9).
//
// v2 (2026-08-02, reprise apres retour Aziz) : le v1 reinventait des briques deja prouvees sur
// Soudan au lieu de les reutiliser -> resultat trop statique/different. Cette version reutilise
// TELLES QUELLES les briques exactes de SoudanActe3GlobeProto16x9.tsx (BorderPulse, palette THEMES.mixte)
// et SoudanActe3GlobeInsert.tsx (pattern GlowBorder/countryPath), + recalibre l'amplitude camera sur
// la vraie plage Soudan (globeCamera.ts va de 1.22 a 4.4, pas 1.3-2.5 comme le v1).
//
// Base : globeGeo.ts (projection/occlusion) + globeCamera.ts (camAt, camera continue) + starfield
// porte de GlobeRecitProto.tsx (Short Soudan 9:16).
//
// Transcrit BREAKDOWN-ACTE1.md (memory/episodes/souverain/gazoduc-aagp-tsgp/da-brief-acte1/) —
// 12 etats cales sur les pivots du script (alignement force narration.mp3).
//
// Mecanique neuve (pas dans le proto d'origine) : le SPLIT — un arc unique Nigeria->Europe se
// scinde en 2 arcs distincts (AAGP cotier, TSGP saharien) par interpolation point-par-point sur
// 20 frames, au moment exact ou la voix dit "et pourtant, ces deux projets ne se parlent pas".
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { geoInterpolate } from "d3-geo";
import {
  W,
  H,
  GLOBE_R,
  GRATICULE,
  worldFeatures,
  orthoAt,
  pathOf,
  isVisible,
} from "../../_rnd/d3-16x9/globeGeo";
import { camAt, type CamKey } from "../../_rnd/d3-16x9/globeCamera";
import { THEMES, BorderPulse } from "../../_rnd/d3-16x9/SoudanActe3GlobeProto16x9";
import { GAZODUC_GEO } from "./gazoducGeo";

export const GAZODUC_A1_FRAMES = 2560; // ~85.3s @ 30fps, couvre l'acte (dernier mot a 84.68s) + marge sortie

const t = THEMES.mixte; // palette prouvee (kaki+bleu+or), reutilisee telle quelle
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const { deltaNiger, marocCenter, algerieCenter, nigerCenter, europeSud } = GAZODUC_GEO;

// -----------------------------------------------------------------------------------------------
// CAMERA — amplitude recalibree sur la vraie plage Soudan (globeCamera.ts : 1.22 -> 4.4, pas 1.3-2.5).
// Chaque etat qui "arrive" quelque part fait un VRAI zoom serre (3.5-4.4), pas juste un ajustement
// timide. Aucun gap >5s entre keyframes sauf 3 respirations narratives tracees.
// -----------------------------------------------------------------------------------------------
const CAM_KEYS: CamKey[] = [
  { frame: 0, lon: 15, lat: 5, scaleMul: 1.35 }, // vue planetaire large, on VIENT de loin
  { frame: 126, lon: 8, lat: 8, scaleMul: 2.6 }, // plongeon amorce vers le Nigeria
  { frame: 240, lon: 6.5, lat: 5, scaleMul: 4.0 }, // ARRIVE serre sur le delta du Niger (quasi plein cadre)
  { frame: 343, lon: 6.5, lat: 5, scaleMul: 3.8 },
  { frame: 490, lon: 5, lat: 20, scaleMul: 2.4 }, // dezoom pour cadrer Nigeria+Europe ensemble
  { frame: 634, lon: 5, lat: 30, scaleMul: 1.9 },
  // respiration 1 (7.0s) : les 3 "MEME" — camera quasi fixe pour lisibilite des pulses
  { frame: 845, lon: 5, lat: 15, scaleMul: 2.1 },
  { frame: 920, lon: 6, lat: 17, scaleMul: 2.3 },
  { frame: 988, lon: 8, lat: 19, scaleMul: 2.6 }, // split : on se rapproche pour voir la divergence
  { frame: 1080, lon: 9, lat: 19.5, scaleMul: 2.8 }, // MONTEE continue vers le pic de tension
  { frame: 1160, lon: 9.5, lat: 20, scaleMul: 2.9 }, // zone de tension : pic MODERE (evite l'aller-retour brutal)
  // Un SEUL dezoom continu de 1160 a 1616 (une direction, pas de zigzag) — prepare le travelling AAGP.
  { frame: 1250, lon: 8.5, lat: 19, scaleMul: 2.6 },
  { frame: 1327, lon: 7, lat: 17.5, scaleMul: 2.3 },
  { frame: 1451, lon: 5.5, lat: 16, scaleMul: 2.0 },
  // respiration 2 (5.5s) : avant le moment fort, digestion narrative — poursuite du MEME dezoom
  { frame: 1616, lon: 5, lat: 15, scaleMul: 1.85 },
  { frame: 1690, lon: 0, lat: 17, scaleMul: 2.3 }, // remontee amorcee : travelling AAGP demarre
  { frame: 1750, lon: -5, lat: 20, scaleMul: 3.4 }, // travelling AAGP : on SUIT la cote de pres
  { frame: 1815, lon: -8, lat: 23, scaleMul: 3.6 },
  { frame: 1881, lon: -10, lat: 25, scaleMul: 3.7 }, // ARRIVE Maroc, serre
  { frame: 1911, lon: 6.5, lat: 5, scaleMul: 2.4 }, // pivot rapide : on repart du Nigeria
  { frame: 1965, lon: 8, lat: 11, scaleMul: 3.1 },
  { frame: 2020, lon: 9, lat: 17, scaleMul: 3.6 }, // pivot TSGP : on SUIT le tracé saharien de pres
  { frame: 2075, lon: 6, lat: 21, scaleMul: 3.7 },
  { frame: 2123, lon: 3, lat: 25, scaleMul: 3.5 }, // ARRIVE Algerie, serre
  { frame: 2166, lon: 5, lat: 15, scaleMul: 1.7 }, // recul large pour le duel "UN SEUL"
  // respiration 3 (6.0s) : silence apres "UN SEUL" avant la cloture — on PREND DE L'ALTITUDE
  { frame: 2346, lon: 6, lat: 13, scaleMul: 1.5 },
  { frame: 2440, lon: 7, lat: 11, scaleMul: 1.3 },
  { frame: 2560, lon: 8, lat: 10, scaleMul: 1.2 }, // vue planetaire finale, aussi large qu'au depart
];

// -----------------------------------------------------------------------------------------------
// REVEALS PAR PAYS — pattern xxxReveal + BorderPulse (souffle 24f) + GlowBorder (respiration
// persistante), TOUS repris de SoudanActe3GlobeInsert.tsx, pas reinventes.
// -----------------------------------------------------------------------------------------------
// endF absent = reste actif jusqu'a la fin (Nigeria = ancrage de tout l'acte).
const COUNTRY_REVEALS: { name: string; startF: number; endF?: number; color: string }[] = [
  { name: "Nigeria", startF: 126, color: t.flowGold },
  { name: "Morocco", startF: 988, endF: 1327, color: t.flowGold },
  { name: "Algeria", startF: 988, endF: 1327, color: t.flowGold },
  { name: "Benin", startF: 1616, endF: 1690, color: t.flowGold },
  { name: "Ghana", startF: 1670, endF: 1744, color: t.flowGold },
  { name: "Côte d'Ivoire", startF: 1710, endF: 1784, color: t.flowGold },
  { name: "Senegal", startF: 1780, endF: 1854, color: t.flowGold },
  { name: "Morocco", startF: 1850, color: t.flowGold }, // AAGP arrive : reste actif (destination)
  { name: "Niger", startF: 1965, endF: 2123, color: "#e0733a" },
  { name: "Algeria", startF: 2020, color: t.flowGold }, // TSGP arrive : reste actif (destination)
];

// -----------------------------------------------------------------------------------------------
// SPLIT — l'arc unique Nigeria->Europe (etats 1-4) se scinde en AAGP/TSGP a partir du frame 845,
// interpolation point-par-point complete au frame 865 (20 frames de morphing).
// -----------------------------------------------------------------------------------------------
const SPLIT_START = 845;
const SPLIT_END = 865;

function sampleGreatCircle(a: [number, number], b: [number, number], n: number): [number, number][] {
  const interp = geoInterpolate(a, b);
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) pts.push(interp(i / n) as [number, number]);
  return pts;
}

const ARC_SAMPLES = 60;
const ARC_UNIQUE = sampleGreatCircle(deltaNiger, europeSud, ARC_SAMPLES);
const ARC_AAGP_TARGET = sampleGreatCircle(deltaNiger, marocCenter, ARC_SAMPLES);
const ARC_TSGP_TARGET = sampleGreatCircle(deltaNiger, algerieCenter, ARC_SAMPLES);

function lerpLonLat(a: [number, number], b: [number, number], tt: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt];
}

export const GazoducActe1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const features = useMemo(() => worldFeatures(), []);

  const cam = camAt(CAM_KEYS, frame);
  // micro-derive de fond permanente — jamais un vrai arret, meme pendant les respirations
  const driftLon = Math.sin(frame / 190) * 1.6;
  const rotLambda = -(cam.lon + driftLon);
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;

  const proj = useMemo(() => orthoAt(rotLambda, rotLat).scale(globeR), [rotLambda, rotLat, globeR]);
  const path = useMemo(() => pathOf(proj), [proj]);

  const projPt = (lonLat: [number, number]): [number, number] | null => {
    if (!isVisible(lonLat, rotLambda, rotLat)) return null;
    const p = proj(lonLat);
    return p ? [p[0], p[1]] : null;
  };

  // ---- Terminateur jour/nuit (derive lente) ----
  const sunLon = interpolate(frame, [0, GAZODUC_A1_FRAMES], [40, -20]);
  const nightCenter: [number, number] = [sunLon + 180, -18];
  const nightPt = proj([nightCenter[0], nightCenter[1]]);
  const nightVisible = isVisible(nightCenter, rotLambda, rotLat);

  // ---- Champ d'etoiles deterministe (porte de GlobeRecitProto.tsx, seed=42, 140pts) ----
  const stars = useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 140 }, () => ({
      x: rand() * W,
      y: rand() * H,
      r: 0.6 + rand() * 1.6,
      op: 0.25 + rand() * 0.55,
    }));
  }, []);

  // ---- Occlusion reelle : construit les segments VISIBLES d'un arc geodesique ----
  const visibleSegments = (points: [number, number][], progress: number): string[] => {
    const nDraw = Math.max(2, Math.round(points.length * progress));
    const segs: string[] = [];
    let cur: string[] = [];
    for (let i = 0; i <= nDraw && i < points.length; i++) {
      const ll = points[i];
      if (isVisible(ll, rotLambda, rotLat)) {
        const p = proj(ll);
        if (p) cur.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`);
      } else {
        if (cur.length >= 2) segs.push(cur.join(" "));
        cur = [];
      }
    }
    if (cur.length >= 2) segs.push(cur.join(" "));
    return segs;
  };

  const uniqueArcProgress = interpolate(frame, [343, 634], [0, 1], clampB);

  const splitT = interpolate(frame, [SPLIT_START, SPLIT_END], [0, 1], clampB);
  const aagpPoints = useMemo(
    () => ARC_UNIQUE.map((p, i) => lerpLonLat(p, ARC_AAGP_TARGET[i], splitT)),
    [splitT],
  );
  const tsgpPoints = useMemo(
    () => ARC_UNIQUE.map((p, i) => lerpLonLat(p, ARC_TSGP_TARGET[i], splitT)),
    [splitT],
  );

  const aagpSegs = frame < SPLIT_START ? [] : visibleSegments(aagpPoints, 1);
  const tsgpSegs = frame < SPLIT_START ? [] : visibleSegments(tsgpPoints, 1);
  const uniqueSegs = frame < SPLIT_START ? visibleSegments(ARC_UNIQUE, uniqueArcProgress) : [];

  const flowAagp = (frame * 1.4) % 40; // lent = detour international
  const flowTsgp = (frame * 2.6) % 40; // rapide = vitesse/urgence

  // Opacite de FOCUS narratif par trace — substitut a l'occlusion camera (impossible ici : Maroc/Algerie
  // ne sont qu'a 10deg d'ecart angulaire, cf feedback_occlusion-globe-verifier-distance-angulaire-avant-promettre.md).
  const aagpFocus = interpolate(frame, [1451, 1616, 1881, 1965], [1, 1, 1, 0.35], clampB);
  const tsgpFocus = interpolate(frame, [1451, 1616, 1881, 1965], [1, 1, 0.35, 1], clampB);

  // ---- BorderPulse (souffle 24f a l'apparition) + GlowBorder (respiration persistante apres) ----
  // Pattern EXACT de SoudanActe3GlobeInsert.tsx : pulse = interpolate 24f one-shot, puis un contour
  // colore reste allume et RESPIRE doucement (borderBreathe sinusoidale) tant que le pays est actif.
  const borderBreathe = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(frame / 11));
  const countryState = (name: string) => {
    const entries = COUNTRY_REVEALS.filter((c) => c.name === name);
    if (entries.length === 0) return null;
    // pulse one-shot : actif seulement dans les 24 frames suivant le PREMIER startF de ce pays
    const firstStart = Math.min(...entries.map((e) => e.startF));
    const pulse = interpolate(frame, [firstStart, firstStart + 24], [0, 1], clampB);
    // reveal (fill) : max de toutes les fenetres actives, avec fondu-out si endF defini
    const reveal = entries.reduce((max, e) => {
      const r = e.endF !== undefined
        ? interpolate(frame, [e.startF, e.startF + 22, e.endF, e.endF + 24], [0, 1, 1, 0], clampB)
        : interpolate(frame, [e.startF, e.startF + 22], [0, 1], clampB);
      return Math.max(max, r);
    }, 0);
    // border ON : contour persistant apres le souffle (16f apres start, jusqu'a endF si defini)
    const borderOn = entries.reduce((max, e) => {
      const on = e.endF !== undefined
        ? interpolate(frame, [e.startF + 16, e.startF + 40, e.endF, e.endF + 24], [0, 1, 1, 0], clampB)
        : interpolate(frame, [e.startF + 16, e.startF + 40], [0, 1], clampB);
      return Math.max(max, on);
    }, 0);
    return { pulse, reveal, borderOn, color: entries[0].color };
  };

  const cx = W / 2;
  const cy = H / 2;

  const pulseNigeria = frame >= 634 && frame < 845 ? 1 + 0.35 * Math.sin(frame / 6) : 1;
  const sourceSpring = interpolate(frame, [126, 150], [0, 1], clampB);
  const nigeriaPt = projPt(deltaNiger);

  const tensionOpacity = interpolate(frame, [988, 1160, 1327, 1451], [0, 0.22, 0.22, 0], clampB);

  const unSeulOpacity = interpolate(frame, [2166, 2196, 2266, 2302], [0, 1, 1, 0], clampB);

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${t.oceanMid} 0%, ${t.bg} 75%)`,
          opacity: 0.3,
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="gz-ocean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="70%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
          <radialGradient id="gz-atmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={t.atmoColor} stopOpacity={0} />
            <stop offset="97%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="gz-night" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#04060d" stopOpacity={0.62} />
            <stop offset="70%" stopColor="#04060d" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#04060d" stopOpacity={0} />
          </radialGradient>
          <clipPath id="gz-globeClip">
            <circle cx={cx} cy={cy} r={globeR} />
          </clipPath>
          <filter id="gz-cityGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gz-borderGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* CHAMP D'ETOILES — sous le globe, comble le vide (porte du Short 9:16) */}
        <g>
          {stars.map((s, i) => (
            <circle key={`star${i}`} cx={s.x} cy={s.y} r={s.r} fill="#F4ECD2" opacity={s.op} />
          ))}
        </g>

        <circle cx={cx} cy={cy} r={globeR + 14} fill="url(#gz-atmo)" />
        <circle cx={cx} cy={cy} r={globeR} fill="url(#gz-ocean)" />

        <g clipPath="url(#gz-globeClip)">
          <path d={path(GRATICULE as any) || ""} fill="none" stroke={t.grat} strokeWidth={0.6} opacity={t.gratOpacity} />

          {/* PAYS — fond statique kaki (palette THEMES.mixte), reveal fill + BorderPulse + GlowBorder */}
          {features.map((f, i) => {
            const name = f.properties.name;
            const cs = countryState(name);
            const d = path(f as any) || "";
            return (
              <React.Fragment key={i}>
                <path
                  d={d}
                  fill={cs && cs.reveal > 0 ? t.landActive : t.land}
                  fillOpacity={cs && cs.reveal > 0 ? 0.6 + 0.4 * cs.reveal : 1}
                  stroke={t.landStroke}
                  strokeWidth={t.borderWidth}
                  strokeOpacity={t.borderOpacity}
                />
                {/* GlowBorder : contour persistant qui respire, apres le souffle one-shot */}
                {cs && cs.borderOn > 0.01 && (
                  <path
                    d={d}
                    fill="none"
                    stroke={cs.color}
                    strokeWidth={2.2}
                    strokeOpacity={cs.borderOn * borderBreathe * 0.9}
                    strokeLinejoin="round"
                    filter="url(#gz-borderGlow)"
                  />
                )}
                {/* BorderPulse : souffle de frontiere a l'apparition (24f one-shot) */}
                {cs && cs.pulse > 0 && cs.pulse < 1 && <BorderPulse d={d} pulse={cs.pulse} color={cs.color} />}
              </React.Fragment>
            );
          })}

          {nightVisible && nightPt && (
            <circle cx={nightPt[0]} cy={nightPt[1]} r={globeR * 1.05} fill="url(#gz-night)" />
          )}

          {/* Zone de tension Sahel (Niger/TSGP) — semi-transparente uniquement, jamais aplat */}
          {tensionOpacity > 0.01 && (() => {
            const p = projPt(nigerCenter);
            if (!p) return null;
            return <circle cx={p[0]} cy={p[1]} r={70} fill="#d6552e" opacity={tensionOpacity} />;
          })()}

          {/* Arc UNIQUE (avant split) */}
          {uniqueSegs.map((pts, j) => (
            <polyline key={`u${j}`} points={pts} fill="none" stroke={t.flowGold} strokeWidth={3} strokeOpacity={0.9} strokeLinecap="round" />
          ))}

          {/* Arc AAGP — trait plein, flux lent (detour international). Focus narratif : net pendant
              son propre travelling (etat 9), estompe (sans disparaitre) pendant le pivot TSGP. */}
          {aagpSegs.map((pts, j) => (
            <React.Fragment key={`aagp${j}`}>
              <polyline points={pts} fill="none" stroke={t.flowGold} strokeWidth={3} strokeOpacity={0.9 * aagpFocus} strokeLinecap="round" />
              <polyline
                points={pts}
                fill="none"
                stroke="#ffe39a"
                strokeWidth={4}
                strokeOpacity={0.85 * aagpFocus}
                strokeDasharray="4 36"
                strokeDashoffset={-flowAagp}
                strokeLinecap="round"
              />
            </React.Fragment>
          ))}

          {/* Arc TSGP — trait pointille, flux rapide (vitesse/urgence). Focus narratif symetrique. */}
          {tsgpSegs.map((pts, j) => (
            <React.Fragment key={`tsgp${j}`}>
              <polyline points={pts} fill="none" stroke="#ffe39a" strokeWidth={3} strokeOpacity={0.9 * tsgpFocus} strokeDasharray="6 4" strokeLinecap="round" />
              <polyline
                points={pts}
                fill="none"
                stroke={t.flowGold}
                strokeWidth={4}
                strokeOpacity={0.85 * tsgpFocus}
                strokeDasharray="4 36"
                strokeDashoffset={-flowTsgp}
                strokeLinecap="round"
              />
            </React.Fragment>
          ))}

          {/* Pastille source Nigeria/delta du Niger — ancrage visuel de tout l'acte */}
          {nigeriaPt && sourceSpring > 0.01 && (
            <g transform={`translate(${nigeriaPt[0]} ${nigeriaPt[1]})`} opacity={sourceSpring}>
              <circle r={9 * pulseNigeria} fill={t.flowGold} opacity={0.28} />
              <circle r={6} fill={t.flowGold} filter="url(#gz-cityGlow)" stroke={t.labelFill} strokeWidth={1} />
            </g>
          )}
        </g>

        <circle cx={cx} cy={cy} r={globeR} fill="none" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.4} />
      </svg>

      {/* Texte "UN SEUL" — seule exception a l'epure (emphase orale explicite) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "center",
          color: t.labelFill,
          fontFamily: "Georgia, serif",
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: 2,
          opacity: unSeulOpacity,
        }}
      >
        UN SEUL
      </div>
    </AbsoluteFill>
  );
};
