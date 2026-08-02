// ACTE 1 "L'anomalie" (hook) — Gazoduc AAGP vs TSGP — GLOBE D3 (16:9).
//
// Base : Globe2Proto16x9.tsx (occlusion reelle des arcs, terminateur jour/nuit, villes qui
// s'allument) + globeCamera.ts (camAt, camera continue) + starfield porte de GlobeRecitProto.tsx
// (Short Soudan 9:16, jamais porte en 16:9 avant cet acte).
//
// Transcrit BREAKDOWN-ACTE1.md (memory/episodes/souverain/gazoduc-aagp-tsgp/da-brief-acte1/) —
// 12 etats cales sur les pivots du script (alignement force narration.mp3), issus d'un DA-brief
// upstream (Gemini+Kimi+DeepSeek) + 2 corrections post-revue Aziz (reveal par pays en cascade,
// jamais de gap camera >5s sauf 3 respirations narratives tracees).
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
import { GAZODUC_GEO } from "./gazoducGeo";

export const GAZODUC_A1_FRAMES = 2560; // ~85.3s @ 30fps, couvre l'acte (dernier mot a 84.68s) + marge sortie

const COL = {
  space0: "#060a14",
  space1: "#0d1526",
  ocean: "#16324a",
  oceanInner: "#1d4363",
  land: "#c8a45e",
  landHighlight: "#dcc07a", // variante plus claire de la meme famille kaki (jamais une nouvelle teinte)
  landStroke: "#3a2a18",
  graticule: "#2a4055",
  gold: "#e8b44a",
  goldHi: "#ffe39a",
  ink: "#e8dcc0",
  danger: "#d6552e",
  night: "#04060d",
};

const { deltaNiger, marocCenter, algerieCenter, nigerCenter, europeSud } = GAZODUC_GEO;

// -----------------------------------------------------------------------------------------------
// CAMERA — keyframes transcrites du breakdown (aucun gap >5s sauf 3 respirations narratives tracees)
// -----------------------------------------------------------------------------------------------
const CAM_KEYS: CamKey[] = [
  { frame: 0, lon: 15, lat: 5, scaleMul: 1.4 },
  { frame: 126, lon: 8, lat: 8, scaleMul: 1.9 },
  { frame: 240, lon: 6.5, lat: 5, scaleMul: 2.5 },
  { frame: 343, lon: 6.5, lat: 5, scaleMul: 2.5 },
  { frame: 490, lon: 5, lat: 20, scaleMul: 2.1 },
  { frame: 634, lon: 5, lat: 30, scaleMul: 1.9 },
  // respiration 1 (7.0s) : les 3 "MEME" — camera quasi fixe pour lisibilite des pulses
  { frame: 845, lon: 5, lat: 15, scaleMul: 2.0 },
  { frame: 920, lon: 6, lat: 17, scaleMul: 2.1 },
  { frame: 988, lon: 8, lat: 19, scaleMul: 2.2 },
  { frame: 1080, lon: 9, lat: 20, scaleMul: 2.25 },
  { frame: 1160, lon: 10, lat: 20, scaleMul: 2.3 },
  { frame: 1250, lon: 9.5, lat: 19, scaleMul: 2.25 },
  { frame: 1327, lon: 8, lat: 18, scaleMul: 2.1 },
  { frame: 1451, lon: 8, lat: 18, scaleMul: 1.8 },
  // respiration 2 (5.5s) : avant le moment fort, digestion narrative
  { frame: 1616, lon: 5, lat: 15, scaleMul: 2.0 },
  { frame: 1690, lon: 0, lat: 17, scaleMul: 2.2 },
  { frame: 1750, lon: -5, lat: 20, scaleMul: 2.4 },
  { frame: 1815, lon: -8, lat: 23, scaleMul: 2.4 },
  { frame: 1881, lon: -10, lat: 25, scaleMul: 2.4 },
  { frame: 1911, lon: 6.5, lat: 5, scaleMul: 2.3 },
  { frame: 1965, lon: 8, lat: 11, scaleMul: 2.4 },
  { frame: 2020, lon: 9, lat: 17, scaleMul: 2.5 },
  { frame: 2075, lon: 6, lat: 21, scaleMul: 2.35 },
  { frame: 2123, lon: 3, lat: 25, scaleMul: 2.2 },
  { frame: 2166, lon: 5, lat: 15, scaleMul: 1.6 },
  // respiration 3 (6.0s) : silence apres "UN SEUL" avant la cloture
  { frame: 2346, lon: 6, lat: 13, scaleMul: 1.6 },
  { frame: 2440, lon: 7, lat: 11, scaleMul: 1.45 },
  { frame: 2560, lon: 8, lat: 10, scaleMul: 1.3 },
];

// -----------------------------------------------------------------------------------------------
// REVEALS PAR PAYS — pattern xxxReveal (SoudanActe4B1toB4Globe.tsx), jamais un highlight en bloc
// -----------------------------------------------------------------------------------------------
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// endF absent = reste actif jusqu'a la fin (Nigeria = ancrage de tout l'acte).
// Sinon fondu-out sur 24 frames apres endF (meme discipline que les pays cotiers).
const COUNTRY_REVEALS: { name: string; startF: number; endF?: number }[] = [
  { name: "Nigeria", startF: 126 },
  { name: "Morocco", startF: 988, endF: 1327 }, // tenu jusqu'a la fin de la tension Sahel, puis s'estompe
  { name: "Algeria", startF: 988, endF: 1327 },
  { name: "Benin", startF: 1616, endF: 1690 },
  { name: "Ghana", startF: 1670, endF: 1744 },
  { name: "Côte d'Ivoire", startF: 1710, endF: 1784 },
  { name: "Senegal", startF: 1780, endF: 1854 },
  { name: "Morocco", startF: 1850 }, // AAGP arrive au Maroc (etat 9) : reste actif jusqu'a la fin (destination)
  { name: "Niger", startF: 1965, endF: 2123 }, // s'estompe a la fin du pivot TSGP
  { name: "Algeria", startF: 2020 }, // TSGP arrive en Algerie (etat 10) : reste actif jusqu'a la fin (destination)
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

function lerpLonLat(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
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

  // ---- Terminateur jour/nuit (derive lente, cf Globe2Proto16x9) ----
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

  // ---- Progression de trace de l'arc (avant split) ----
  const uniqueArcProgress = interpolate(frame, [343, 634], [0, 1], clampB);

  // ---- Split : interpolation point-par-point de l'arc unique vers 2 arcs cibles ----
  const splitT = interpolate(frame, [SPLIT_START, SPLIT_END], [0, 1], clampB);
  const aagpPoints = useMemo(
    () => ARC_UNIQUE.map((p, i) => lerpLonLat(p, ARC_AAGP_TARGET[i], splitT)),
    [splitT],
  );
  const tsgpPoints = useMemo(
    () => ARC_UNIQUE.map((p, i) => lerpLonLat(p, ARC_TSGP_TARGET[i], splitT)),
    [splitT],
  );

  const postSplitProgress = 1; // arcs pleinement traces des la fin du split (frame >= SPLIT_END)
  const aagpFlowProgress = frame >= 1616 ? 1 : 0; // flux visible des le travelling AAGP (etat 9)
  const tsgpFlowProgress = frame >= 1911 ? 1 : 0; // flux visible des le pivot TSGP (etat 10)

  const aagpSegs = frame < SPLIT_START ? [] : visibleSegments(aagpPoints, splitT < 1 ? splitT : postSplitProgress);
  const tsgpSegs = frame < SPLIT_START ? [] : visibleSegments(tsgpPoints, splitT < 1 ? splitT : postSplitProgress);
  const uniqueSegs = frame < SPLIT_START ? visibleSegments(ARC_UNIQUE, uniqueArcProgress) : [];

  // flux lumineux qui glisse (dashoffset)
  const flowAagp = (frame * 1.4) % 40; // lent = detour international
  const flowTsgp = (frame * 2.6) % 40; // rapide = vitesse/urgence

  // Opacite de FOCUS narratif par trace — substitut a l'occlusion camera (impossible ici : Maroc/Algerie
  // ne sont qu'a 10deg d'ecart angulaire, cf feedback_occlusion-globe-verifier-distance-angulaire-avant-promettre.md).
  // Le trace "en focus" narratif est net (1.0), l'autre s'estompe (0.35) sans jamais disparaitre —
  // le contraste passe par le STYLE (plein/pointille) + la VIVACITE (opacite) + le MOUVEMENT camera.
  const aagpFocus = interpolate(frame, [1451, 1616, 1881, 1965], [1, 1, 1, 0.35], clampB);
  const tsgpFocus = interpolate(frame, [1451, 1616, 1881, 1965], [1, 1, 0.35, 1], clampB);

  // ---- Pays du tracé : reveal en cascade (jamais un bloc statique) ----
  // startF->startF+22 = montee ; si endF defini, redescend sur 24 frames apres endF ; sinon reste actif.
  const revealOne = (rv: { startF: number; endF?: number }) => {
    if (rv.endF !== undefined) {
      return interpolate(
        frame,
        [rv.startF, rv.startF + 22, rv.endF, rv.endF + 24],
        [0, 1, 1, 0],
        clampB,
      );
    }
    return interpolate(frame, [rv.startF, rv.startF + 22], [0, 1], clampB);
  };
  // plusieurs entrees peuvent partager un nom (ex Maroc revele au split, puis re-tenu a l'arrivee AAGP) :
  // on prend le MAX de toutes les fenetres actives pour ce pays a la frame courante.
  const revealForCountry = (name: string) =>
    COUNTRY_REVEALS.filter((c) => c.name === name).reduce((max, rv) => Math.max(max, revealOne(rv)), 0);

  const cx = W / 2;
  const cy = H / 2;

  // ---- Pastilles source/destination avec pulse (etat 4 : "MEME/MEME/MEME") ----
  const pulseNigeria = frame >= 634 && frame < 845 ? 1 + 0.35 * Math.sin(frame / 6) : 1;
  const sourceSpring = interpolate(frame, [126, 150], [0, 1], clampB);
  const nigeriaPt = projPt(deltaNiger);

  // ---- Zone de tension Sahel (etat 6, jamais en aplat plein) — monte puis redescend, pas de tenue infinie ----
  const tensionOpacity = interpolate(frame, [988, 1160, 1327, 1451], [0, 0.22, 0.22, 0], clampB);

  // ---- Texte "UN SEUL" (etat 11, seule exception a l'epure) ----
  const unSeulOpacity = interpolate(frame, [2166, 2196, 2266, 2302], [0, 1, 1, 0], clampB);

  return (
    <AbsoluteFill style={{ backgroundColor: COL.space0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${COL.space1} 0%, ${COL.space0} 75%)`,
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="gz-ocean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={COL.oceanInner} />
            <stop offset="100%" stopColor={COL.ocean} />
          </radialGradient>
          <radialGradient id="gz-atmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor="#6fb8e0" stopOpacity={0} />
            <stop offset="97%" stopColor="#6fb8e0" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6fb8e0" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="gz-night" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COL.night} stopOpacity={0.62} />
            <stop offset="70%" stopColor={COL.night} stopOpacity={0.45} />
            <stop offset="100%" stopColor={COL.night} stopOpacity={0} />
          </radialGradient>
          <clipPath id="gz-globeClip">
            <circle cx={cx} cy={cy} r={GLOBE_R} />
          </clipPath>
          <filter id="gz-cityGlow" x="-200%" y="-200%" width="500%" height="500%">
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

        <circle cx={cx} cy={cy} r={GLOBE_R + 14} fill="url(#gz-atmo)" />
        <circle cx={cx} cy={cy} r={GLOBE_R} fill="url(#gz-ocean)" />

        <g clipPath="url(#gz-globeClip)">
          <path d={path(GRATICULE as any) || ""} fill="none" stroke={COL.graticule} strokeWidth={0.6} opacity={0.5} />

          {/* PAYS — fond statique kaki, reveals en cascade par-dessus (jamais un highlight en bloc) */}
          {features.map((f, i) => {
            const name = f.properties.name;
            const reveal = revealForCountry(name);
            return (
              <path
                key={i}
                d={path(f as any) || ""}
                fill={reveal > 0 ? COL.landHighlight : COL.land}
                fillOpacity={reveal > 0 ? 0.55 + 0.45 * reveal : 1}
                stroke={COL.landStroke}
                strokeWidth={reveal > 0.3 ? 0.9 : 0.5}
                strokeOpacity={0.6}
              />
            );
          })}

          {nightVisible && nightPt && (
            <circle cx={nightPt[0]} cy={nightPt[1]} r={GLOBE_R * 1.05} fill="url(#gz-night)" />
          )}

          {/* Zone de tension Sahel (Niger/TSGP) — semi-transparente uniquement, jamais aplat */}
          {tensionOpacity > 0.01 && (() => {
            const p = projPt(nigerCenter);
            if (!p) return null;
            return <circle cx={p[0]} cy={p[1]} r={70} fill={COL.danger} opacity={tensionOpacity} />;
          })()}

          {/* Arc UNIQUE (avant split) */}
          {uniqueSegs.map((pts, j) => (
            <polyline key={`u${j}`} points={pts} fill="none" stroke={COL.gold} strokeWidth={3} strokeOpacity={0.9} strokeLinecap="round" />
          ))}

          {/* Arc AAGP — trait plein, flux lent (detour international). Focus narratif : net pendant
              son propre travelling (etat 9), estompe (sans disparaitre) pendant le pivot TSGP. */}
          {aagpSegs.map((pts, j) => (
            <React.Fragment key={`aagp${j}`}>
              <polyline points={pts} fill="none" stroke={COL.gold} strokeWidth={3} strokeOpacity={0.9 * aagpFocus} strokeLinecap="round" />
              {aagpFlowProgress > 0 && (
                <polyline
                  points={pts}
                  fill="none"
                  stroke={COL.goldHi}
                  strokeWidth={4}
                  strokeOpacity={0.85 * aagpFocus}
                  strokeDasharray="4 36"
                  strokeDashoffset={-flowAagp}
                  strokeLinecap="round"
                />
              )}
            </React.Fragment>
          ))}

          {/* Arc TSGP — trait pointille, flux rapide (vitesse/urgence). Focus narratif symetrique. */}
          {tsgpSegs.map((pts, j) => (
            <React.Fragment key={`tsgp${j}`}>
              <polyline points={pts} fill="none" stroke={COL.goldHi} strokeWidth={3} strokeOpacity={0.9 * tsgpFocus} strokeDasharray="6 4" strokeLinecap="round" />
              {tsgpFlowProgress > 0 && (
                <polyline
                  points={pts}
                  fill="none"
                  stroke={COL.gold}
                  strokeWidth={4}
                  strokeOpacity={0.85 * tsgpFocus}
                  strokeDasharray="4 36"
                  strokeDashoffset={-flowTsgp}
                  strokeLinecap="round"
                />
              )}
            </React.Fragment>
          ))}

          {/* Pastille source Nigeria/delta du Niger — ancrage visuel de tout l'acte */}
          {nigeriaPt && sourceSpring > 0.01 && (
            <g transform={`translate(${nigeriaPt[0]} ${nigeriaPt[1]})`} opacity={sourceSpring}>
              <circle r={9 * pulseNigeria} fill={COL.gold} opacity={0.28} />
              <circle r={6} fill={COL.gold} filter="url(#gz-cityGlow)" stroke={COL.ink} strokeWidth={1} />
            </g>
          )}
        </g>

        <circle cx={cx} cy={cy} r={GLOBE_R} fill="none" stroke="#6fb8e0" strokeWidth={1.5} strokeOpacity={0.4} />
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
          color: COL.ink,
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
