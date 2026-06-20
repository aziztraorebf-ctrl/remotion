/**
 * SCENE GISEMENTS A — CARTE d3-geo PLATE PARCHEMIN (les 3 gisements du Senegal)
 * =============================================================================
 * Documentaire Souverain — Senegal Petrole & Gaz. Revele UN PAR UN les trois
 * champs offshore : Sangomar (petrole), GTA (gaz/export), Yakaar-Teranga (suspens).
 *
 * ARCHETYPE A : zero Mapbox, zero 3D. Carte d3-geo (geoMercator + fitExtent),
 * une seule Map continue, camera <g> animee par spring. Fond parchemin -> navy
 * interpole frame-driven. Tous marqueurs/jauges/fleches/yeux/textes codes en SVG.
 *
 * DOSAGE : un seul foyer actif par etat ; ce qui n'est plus dit passe en fantome
 * ou disparait ; jamais plus de ~3 animations importantes simultanees.
 *
 * FENETRE AUDIO : la scene va de 52s a 104s. frame local 0 = 52s de l'audio.
 * Timecodes (frames locaux @30fps, declencheurs voix) :
 *   "trois" 50 · "Sangomar" 109 · "Woodside" 256 · "18%" 407 · "GTA" 500 ·
 *   "Britannique" 629 · "2025" 686 · "Europe" 787 · "Asie" 803 · "Yakaar" 1149 ·
 *   "attend" 1344 · "capitales" 1377 · "surprise" 1502.
 * Decoupage des 4 etats (regle "image precede l'oreille" ~0.3-0.5s avant le mot) :
 *   E1 0..~100 · E2 ~100..~490 · E3 ~490..~1130 · E4 ~1130..1560.
 *
 * NON-NEGOTIABLE : aucun CSS transition / setTimeout / @keyframes / blur CSS.
 * Tout via useCurrentFrame + interpolate/spring. Accents FR dans les strings.
 */
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { useTopology } from "../_shared/components/inserts/useTopology";

const W = 1920;
const H = 1080;
const FPS = 30;

// === PALETTE GLOBALE (charte figee du breakdown) ===
const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const NAVY = "#16213a";
const NAVY_DEEP = "#0d1424";
const OCRE = "#e7bd78";
const OCRE_DARK = "#bf9442";
const GAZ_TEAL = "#2a9da0";
const EN_SUSPENS_GREY = "#a9a9a0";
const WHITE_WARM = "#f6efd8";
const TEXT_MUTED = "#8f8b7c";
const SHADOW_INK = "#0b1020";
const SPOTLIGHT = "#fff2c8";

const FONT_NUM = "'Bebas Neue','Impact',sans-serif";
const FONT_SANS = "'Inter','Helvetica Neue',Arial,sans-serif";
const FONT_SERIF = "Georgia,serif";

// === FENETRE AUDIO ===
const SCENE_START_S = 52; // la scene demarre a 52s de l'audio

// === COORDS REELLES (lon, lat) — NE PAS inventer ===
const SANGOMAR: [number, number] = [-16.95, 14.0];
const GTA: [number, number] = [-17.05, 15.9];
const YAKAAR: [number, number] = [-17.3, 14.9];
const DAKAR: [number, number] = [-17.45, 14.69];

const ASSET = "souverain/senegal-petrole-gaz/scene-gisements/flags/";

// === BORNES DES 4 ETATS (frames locaux) ===
const E2_START = 100; // bascule E1 -> E2
const E3_START = 490; // bascule E2 -> E3
const E4_START = 1130; // bascule E3 -> E4

// helper interpolation clamp
const ramp = (frame: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// interpolation hex (mix lineaire) pour le fond frame-driven
const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
// mix entre deux couleurs RGB (arrays) — JAMAIS de re-parse de string (cause du bug fond noir)
const mixRgb = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgbStr = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;

export const SceneGisementsA_Parchemin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const topo = useTopology("_shared/geo-data/countries-50m.json");

  const geo = useMemo(() => {
    if (!topo) return null;
    const fc: any = feature(topo as any, (topo as any).objects.countries);
    const features = fc.features as any[];
    const byName = (n: string) => features.find((f) => f.properties?.name === n);
    const senegal = byName("Senegal");
    const neighbors = ["Mauritania", "Mali", "Guinea-Bissau", "Guinea", "Gambia"]
      .map(byName)
      .filter(Boolean);

    // === Projection FIXE (etat 1 cadrage large), camera = un <g> scale/translate ===
    // fitExtent sur le SENEGAL SEUL : inclure Mali/Guinee ecraserait l'echelle E-O
    // (ils s'etendent loin a l'est) et tasserait les 3 points offshore (tous ~-17 lon)
    // dans un sliver. Fitter sur le Senegal donne le vrai triangle Sangomar/GTA/Yakaar
    // et laisse l'Atlantique a gauche (carte ancree center-droite). Les voisins sont
    // tout de meme traces (contours discrets) meme s'ils debordent du cadre.
    const projection = geoMercator().fitExtent(
      [
        [W * 0.3, H * 0.18],
        [W * 0.78, H * 0.86],
      ],
      senegal
    );
    const path = geoPath(projection);

    const snD = path(senegal) || "";
    const neighborPaths = neighbors.map((f) => ({
      name: f.properties?.name as string,
      d: path(f) || "",
    }));

    // longueur approx du path Senegal (pour draw-on stroke-dashoffset)
    const snLen = (snD.match(/[MLCZ]/g)?.length ?? 200) * 14;

    // projection des points (coords reelles -> px dans le repere carte non-transforme)
    const p = (c: [number, number]) => projection(c) as [number, number];
    return {
      projection,
      snD,
      snLen,
      neighborPaths,
      pSangomar: p(SANGOMAR),
      pGta: p(GTA),
      pYakaar: p(YAKAAR),
      pDakar: p(DAKAR),
    };
  }, [topo]);

  if (!topo || !geo) return <AbsoluteFill style={{ background: PARCH }} />;

  const { snD, snLen, neighborPaths, pSangomar, pGta, pYakaar, pDakar } = geo;

  // ====================================================================
  // CAMERA : un <g> scale+translate continu (1 seule Map). On veut placer
  // un point cible a une position ecran (sx*W,sy*H) avec un scale s :
  //   transform = translate(sx*W - s*px, sy*H - s*py) scale(s)
  // On interpole le centre-cible (px,py), le scale ET la position ecran
  // entre etats via spring.
  // ====================================================================

  const s12 = spring({
    fps,
    frame: frame - E2_START,
    config: { damping: 26, stiffness: 80, mass: 0.95 },
  });
  const s23 = spring({
    fps,
    frame: frame - E3_START,
    config: { damping: 26, stiffness: 78, mass: 1 },
  });
  const s34 = spring({
    fps,
    frame: frame - E4_START,
    config: { damping: 28, stiffness: 70, mass: 1.05 },
  });

  // cadrages cible (centre geo px + scale + position ecran du centre)
  const targets = [
    { px: (pSangomar[0] + pGta[0]) / 2, py: (pSangomar[1] + pYakaar[1]) / 2, s: 1.0, sx: 0.46, sy: 0.5 },
    { px: pSangomar[0], py: pSangomar[1], s: 1.28, sx: 0.34, sy: 0.47 },
    { px: pGta[0], py: pGta[1], s: 1.42, sx: 0.3, sy: 0.24 },
    { px: pYakaar[0], py: pYakaar[1], s: 1.5, sx: 0.5, sy: 0.52 },
  ];
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const blend = (k: "px" | "py" | "s" | "sx" | "sy") => {
    let v = targets[0][k];
    v = lerp(v, targets[1][k], s12);
    v = lerp(v, targets[2][k], s23);
    v = lerp(v, targets[3][k], s34);
    return v;
  };
  const camPx = blend("px");
  const camPy = blend("py");
  const camS = blend("s");
  const camSx = blend("sx");
  const camSy = blend("sy");
  const camTx = camSx * W - camS * camPx;
  const camTy = camSy * H - camS * camPy;
  const camTransform = `translate(${camTx} ${camTy}) scale(${camS})`;

  // position ECRAN d'un point geo (apres camera)
  const screen = (pt: [number, number]): [number, number] => [
    camS * pt[0] + camTx,
    camS * pt[1] + camTy,
  ];
  const scSangomar = screen(pSangomar);
  const scGta = screen(pGta);
  const scYakaar = screen(pYakaar);

  // ====================================================================
  // FOND frame-driven : parchemin -> refroidi navy -> navy profond
  // ====================================================================
  // voile leger E2 (refroidit le parchemin) ; bascule franche bleu-gris en E3
  // (pivot geopolitique) ; navy profond en E4.
  const navyVeil2 = ramp(frame, E2_START, E2_START + 30, 0, 0.12);
  const navyShift3 = ramp(frame, E3_START + 30, E3_START + 160, 0, 0.5) * (1 - s34);
  const navyDeep4 = s34;
  const cBase = mixRgb(hexToRgb(PARCH), hexToRgb(PARCH_DARK), 0.5);
  const cWithNavy = mixRgb(cBase, hexToRgb(NAVY), Math.max(navyVeil2, navyShift3));
  const cFinal = mixRgb(cWithNavy, hexToRgb(NAVY_DEEP), navyDeep4);
  const bgFinal = rgbStr(cFinal);

  const gridOp = interpolate(
    frame,
    [0, E2_START, E3_START, E4_START, E4_START + 80],
    [0.6, 0.5, 0.34, 0.18, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === GRILLE (tous les 4.2% largeur, 7.5% hauteur) ===
  const stepX = W * 0.042;
  const stepY = H * 0.075;
  const gridV = Array.from({ length: Math.ceil(W / stepX) + 2 }, (_, i) => i * stepX);
  const gridH = Array.from({ length: Math.ceil(H / stepY) + 2 }, (_, i) => i * stepY);

  // ====================================================================
  // ETAT 1 — TROIS
  // ====================================================================
  const mapDraw = ramp(frame, 0, 22);
  const mapFill = ramp(frame, 10, 35);
  const e1Out = ramp(frame, E2_START - 10, E2_START + 22, 1, 0);

  const three_op = ramp(frame, 4, 20) * ramp(frame, E2_START - 12, E2_START + 6, 1, 0);
  const three_scale =
    interpolate(spring({ fps, frame: frame - 8, config: { damping: 18, stiffness: 90 } }), [0, 1], [0.82, 1]) *
    (1 + 0.012 * Math.sin(frame * 0.07));

  const m1 = ramp(frame, 16, 30);
  const m2 = ramp(frame, 20, 34);
  const m3 = ramp(frame, 24, 38);
  const ringPulse = 1 + 0.05 * Math.sin(frame * 0.12);

  // ====================================================================
  // ETAT 2 — SANGOMAR (petrole)
  // ====================================================================
  const e2In = ramp(frame, E2_START, E2_START + 24);
  const e2Out = ramp(frame, E3_START - 24, E3_START + 10, 1, 0);
  const e2Vis = e2In * e2Out;

  const spotR =
    interpolate(frame, [E2_START, E2_START + 24], [0, W * 0.15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * e2Out;

  const oilScale = spring({ fps, frame: frame - (E2_START + 4), config: { damping: 14, stiffness: 95 } });
  const oilHalo = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(frame * 0.1));
  const labSan = ramp(frame, E2_START + 8, E2_START + 22);
  const labSanSlide = interpolate(labSan, [0, 1], [-18, 0]);
  const flagAu = ramp(frame, E2_START + 12, E2_START + 24);
  const gaugeT = ramp(frame, E2_START + 18, E2_START + 44);
  const gaugeVal = Math.round(interpolate(gaugeT, [0, 1], [0, 18]));

  // ====================================================================
  // ETAT 3 — GTA (gaz, export)
  // ====================================================================
  const e3In = ramp(frame, E3_START, E3_START + 28);
  const e3Out = ramp(frame, E4_START - 30, E4_START + 6, 1, 0);
  const e3Vis = e3In * e3Out;

  const gasIn = ramp(frame, E3_START + 4, E3_START + 24);
  const labGta = ramp(frame, E3_START + 8, E3_START + 24);
  const labGtaSlide = interpolate(labGta, [0, 1], [-W * 0.012, 0]);
  const flagUk = ramp(frame, E3_START + 16, E3_START + 30);
  const yr2025 = ramp(frame, E3_START + 22, E3_START + 36);
  const arrEurope = ramp(frame, E3_START + 24, E3_START + 60);
  const arrEuropeLab = ramp(frame, E3_START + 50, E3_START + 70);
  const arrAsie = ramp(frame, E3_START + 36, E3_START + 78);
  const arrAsieLab = ramp(frame, E3_START + 64, E3_START + 84);

  // ====================================================================
  // ETAT 4 — YAKAAR-TERANGA (suspens / open loop)
  // ====================================================================
  const e4In = ramp(frame, E4_START, E4_START + 40);

  const titleYak = ramp(frame, E4_START + 8, E4_START + 30);
  const titleTrack = interpolate(titleYak, [0, 1], [0.08, 0.015]);
  const yakRingIn = ramp(frame, E4_START + 16, E4_START + 36);
  const yakDashRot = frame * 0.6;
  const yakR = W * 0.0325 * (1 + 0.03 * Math.sin(frame * 0.05));

  const eyes = [
    { sx: 0.42, sy: 0.52, delay: 28 },
    { sx: 0.59, sy: 0.52, delay: 34 },
    { sx: 0.55, sy: 0.64, delay: 40 },
  ];
  const opStr = "Opérateur : ";
  const opType = ramp(frame, E4_START + 48, E4_START + 72);
  const opCount = Math.floor(opType * opStr.length);
  const opShown = opStr.slice(0, opCount);
  const caretOn = Math.floor(frame / 15) % 2 === 0;
  const opOp = ramp(frame, E4_START + 48, E4_START + 60);
  const darkFinal = ramp(frame, E4_START + 80, E4_START + 120);

  const yakCx = scYakaar[0];
  const yakCy = scYakaar[1];

  return (
    <AbsoluteFill style={{ background: bgFinal }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")}
        startFrom={Math.round(SCENE_START_S * FPS)}
      />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="ocreSn" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={OCRE} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <filter id="grainA">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.045" />
            </feComponentTransfer>
          </filter>
          <filter id="threeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="0.8" floodColor={SHADOW_INK} floodOpacity="0.22" />
          </filter>
          <clipPath id="spotClip">
            <circle cx={scSangomar[0]} cy={scSangomar[1]} r={Math.max(0, spotR)} />
          </clipPath>
          <marker id="arrTeal" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto">
            <path d="M0,0 L8,5 L0,10 Z" fill={GAZ_TEAL} />
          </marker>
        </defs>

        {/* === GRILLE === */}
        <g stroke={GRID} strokeWidth={1} opacity={gridOp}>
          {gridV.map((x, i) => (
            <line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y, i) => (
            <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>

        {/* === CAMERA GROUP (la carte continue) === */}
        <g transform={camTransform}>
          {(() => {
            // E1 carte pleine ; E2 carte attenuee HORS spotlight (le spot redessine
            // la zone nette) ; E3 cooled ; E4 quasi effacee.
            const baseMapOp = interpolate(
              frame,
              [0, E2_START - 10, E2_START + 24, E3_START, E4_START, E4_START + 40],
              [1, 1, 0.52, 0.66, 0.4, 0.22],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <g opacity={baseMapOp}>
                <path d={snD} transform="translate(5,7)" fill={SHADOW_INK} opacity={0.14 * mapFill} />
                {neighborPaths.map((n) => (
                  <path
                    key={n.name}
                    d={n.d}
                    fill={PARCH_DARK}
                    opacity={0.35 * mapFill * (1 - s34 * 0.6)}
                    stroke={NAVY}
                    strokeWidth={1.1}
                    strokeLinejoin="round"
                    strokeOpacity={0.25}
                  />
                ))}
                <path d={snD} fill="url(#ocreSn)" opacity={mapFill * (1 - s34 * 0.78)} strokeLinejoin="round" />
                <path
                  d={snD}
                  fill="none"
                  stroke={frame < E4_START ? NAVY : EN_SUSPENS_GREY}
                  strokeWidth={1.7}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeOpacity={frame < E4_START ? 0.78 : 0.45}
                  strokeDasharray={snLen}
                  strokeDashoffset={snLen * (1 - mapDraw)}
                />
              </g>
            );
          })()}

          {/* === SPOTLIGHT SANGOMAR (E2) === */}
          {e2Vis > 0.01 && spotR > 1 && (
            <g clipPath="url(#spotClip)" opacity={e2Vis}>
              <circle cx={scSangomar[0]} cy={scSangomar[1]} r={spotR} fill={SPOTLIGHT} opacity={0.4} />
              <path d={snD} fill="url(#ocreSn)" opacity={0.72} />
              <path d={snD} fill="none" stroke={NAVY} strokeWidth={1.8} strokeOpacity={0.85} strokeLinejoin="round" />
              <circle cx={scSangomar[0]} cy={scSangomar[1]} r={spotR} fill="none" stroke={WHITE_WARM} strokeWidth={1} opacity={0.35} />
            </g>
          )}

          {/* === MARQUEURS ETAT 1 (anneaux vides) === */}
          {e1Out > 0.01 && (
            <g opacity={e1Out}>
              <g transform={`translate(${pSangomar[0]} ${pSangomar[1]}) scale(${ringPulse})`} opacity={m1}>
                <circle r={W * 0.0075} fill="none" stroke={OCRE_DARK} strokeWidth={3.2} strokeLinecap="round" />
                <circle r={W * 0.0075 - 4} fill="none" stroke={WHITE_WARM} strokeWidth={1.4} opacity={0.75} />
              </g>
              <g transform={`translate(${pGta[0]} ${pGta[1]}) scale(${ringPulse})`} opacity={m2}>
                <circle r={W * 0.0065} fill="none" stroke={OCRE_DARK} strokeWidth={3.2} />
                <circle r={W * 0.0016} fill={WHITE_WARM} opacity={0.65} />
              </g>
              <g transform={`translate(${pYakaar[0]} ${pYakaar[1]}) scale(${ringPulse})`} opacity={m3}>
                <circle r={W * 0.0072} fill="none" stroke={OCRE_DARK} strokeWidth={3.2} />
                <circle r={W * 0.0072 - 4} fill="none" stroke={WHITE_WARM} strokeWidth={1.2} opacity={0.62} />
              </g>
              <g opacity={ramp(frame, 15, 35)}>
                <circle cx={pDakar[0]} cy={pDakar[1]} r={3.5} fill={NAVY} opacity={0.45} />
                <circle cx={pDakar[0]} cy={pDakar[1]} r={W * 0.0048} fill="none" stroke={NAVY} strokeWidth={0.8} opacity={0.18} />
              </g>
            </g>
          )}

          {/* === MARQUEUR PETROLE SANGOMAR (E2) === */}
          {e2Vis > 0.01 && (
            <g transform={`translate(${pSangomar[0]} ${pSangomar[1]})`} opacity={e2Vis}>
              <circle r={W * 0.0205} fill={OCRE} opacity={oilHalo} />
              <circle r={W * 0.0128 * oilScale} fill={NAVY} stroke={WHITE_WARM} strokeWidth={2.9} />
              <circle cx={-W * 0.012} cy={W * 0.012} r={W * 0.0058} fill={TEXT_MUTED} stroke={WHITE_WARM} strokeWidth={1.4} strokeOpacity={0.55} />
            </g>
          )}

          {/* fantomes GTA + Yakaar en E2 */}
          {e2Vis > 0.01 && (
            <g opacity={e2Vis * 0.2}>
              <circle cx={pGta[0]} cy={pGta[1]} r={W * 0.0072} fill="none" stroke={EN_SUSPENS_GREY} strokeWidth={2.5} />
              <circle cx={pYakaar[0]} cy={pYakaar[1]} r={W * 0.0072} fill="none" stroke={EN_SUSPENS_GREY} strokeWidth={2.5} />
            </g>
          )}

          {/* === MARQUEUR GAZ GTA (E3) === */}
          {e3Vis > 0.01 && (
            <g transform={`translate(${pGta[0]} ${pGta[1]})`} opacity={e3Vis * gasIn}>
              {[
                { r: 0.0155, o: 0.85 },
                { r: 0.0235, o: 0.62 },
                { r: 0.0315, o: 0.42 },
                { r: 0.0395, o: 0.28 },
              ].map((ring, i) => {
                const pulse = 1 + 0.06 * Math.sin(frame * 0.1 + i * 0.8);
                return (
                  <circle key={i} r={W * ring.r * pulse} fill="none" stroke={GAZ_TEAL} strokeWidth={2.3} opacity={ring.o} strokeLinecap="round" />
                );
              })}
              <circle r={W * 0.0074} fill={GAZ_TEAL} />
              <circle r={W * 0.0038} fill={NAVY} opacity={0.55} />
            </g>
          )}

          {/* Sangomar fantome en E3 */}
          {e3Vis > 0.01 && (
            <g opacity={e3Vis * 0.18}>
              <circle cx={pSangomar[0]} cy={pSangomar[1]} r={W * 0.01} fill={WHITE_WARM} opacity={0.12} />
              <circle cx={pSangomar[0]} cy={pSangomar[1]} r={W * 0.0052} fill={WHITE_WARM} opacity={0.28} stroke={EN_SUSPENS_GREY} strokeWidth={2} strokeOpacity={0.45} />
            </g>
          )}

          {/* === MARQUEUR YAKAAR SUSPENS (E4) === */}
          {e4In > 0.01 && (
            <g transform={`translate(${pYakaar[0]} ${pYakaar[1]}) rotate(${yakDashRot})`} opacity={e4In * yakRingIn}>
              <circle
                r={yakR / camS}
                fill="none"
                stroke={EN_SUSPENS_GREY}
                strokeWidth={3.8 / camS}
                strokeDasharray={`${14 / camS} ${14 / camS}`}
                strokeLinecap="round"
                opacity={0.82}
              />
              <circle r={(W * 0.002) / camS} fill={EN_SUSPENS_GREY} opacity={0.28} />
            </g>
          )}
        </g>
        {/* === fin camera group === */}

        {/* === VIGNETTE NAVY LATERALE GAUCHE (E3) : refroidit l'Atlantique, pivot geopolitique === */}
        {e3Vis > 0.01 && (
          <>
            <defs>
              <linearGradient id="seaVeilE3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={NAVY_DEEP} stopOpacity="0.42" />
                <stop offset="35%" stopColor={NAVY_DEEP} stopOpacity="0.1" />
                <stop offset="100%" stopColor={NAVY_DEEP} stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width={W} height={H} fill="url(#seaVeilE3)" opacity={e3Vis * ramp(frame, E3_START + 20, E3_START + 70)} />
          </>
        )}

        {/* === FLECHES EXPORT (E3) — ecran fixe (hors camera) === */}
        {e3Vis > 0.01 && (
          <g opacity={e3Vis}>
            {(() => {
              const gx = scGta[0];
              const gy = scGta[1];
              const exP = W * 0.82;
              const eyP = H * 0.17;
              const eDef = `M ${gx} ${gy} C ${lerp(gx, exP, 0.45)} ${H * 0.1}, ${lerp(gx, exP, 0.75)} ${H * 0.1}, ${exP} ${eyP}`;
              const axP = W * 0.86;
              const ayP = H * 0.7;
              const aDef = `M ${gx} ${gy} C ${lerp(gx, axP, 0.5)} ${H * 0.4}, ${lerp(gx, axP, 0.8)} ${H * 0.6}, ${axP} ${ayP}`;
              return (
                <>
                  <path d={eDef} fill="none" stroke={GAZ_TEAL} strokeWidth={2.5} opacity={0.9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrEurope} markerEnd="url(#arrTeal)" />
                  <path d={aDef} fill="none" stroke={GAZ_TEAL} strokeWidth={2.5} opacity={0.86} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrAsie} markerEnd="url(#arrTeal)" />
                </>
              );
            })()}
          </g>
        )}

        {/* === YEUX (E4) === */}
        {e4In > 0.01 &&
          eyes.map((e, i) => {
            const op = ramp(frame, E4_START + e.delay, E4_START + e.delay + 14) * e4In;
            if (op <= 0.01) return null;
            const ex = e.sx * W;
            const ey = e.sy * H;
            const ang = Math.atan2(yakCy - ey, yakCx - ex);
            const eyeW = W * 0.0185;
            const pupOff = eyeW * 0.42;
            const blinkPhase = (frame + i * 37) % 110;
            const blink = blinkPhase < 6 ? interpolate(blinkPhase, [0, 3, 6], [1, 0.25, 1]) : 1;
            return (
              <g key={i} opacity={op * 0.9} transform={`translate(${ex} ${ey})`}>
                <g transform={`scale(1 ${blink})`}>
                  <path
                    d={`M ${-eyeW} 0 Q 0 ${-eyeW * 0.62} ${eyeW} 0 Q 0 ${eyeW * 0.62} ${-eyeW} 0 Z`}
                    fill={PARCH_DARK}
                    fillOpacity={0.85}
                    stroke={EN_SUSPENS_GREY}
                    strokeWidth={3}
                    strokeLinejoin="round"
                  />
                  <circle cx={Math.cos(ang) * pupOff} cy={Math.sin(ang) * pupOff} r={W * 0.0042} fill={NAVY} />
                </g>
              </g>
            );
          })}

        {/* === ASSOMBRISSEMENT FINAL (E4) === */}
        {darkFinal > 0.01 && (
          <>
            <defs>
              <radialGradient id="finalDark" cx="50%" cy="53%" r="55%">
                <stop offset="0%" stopColor={SHADOW_INK} stopOpacity="0" />
                <stop offset="48%" stopColor={SHADOW_INK} stopOpacity="0" />
                <stop offset="100%" stopColor={SHADOW_INK} stopOpacity="0.38" />
              </radialGradient>
            </defs>
            <rect width={W} height={H} fill="url(#finalDark)" opacity={darkFinal} />
          </>
        )}

        {/* grain global */}
        <rect width={W} height={H} filter="url(#grainA)" opacity={0.8} style={{ mixBlendMode: "overlay" }} />
      </svg>

      {/* ====================================================================
          OVERLAYS HTML (textes, jauge, drapeaux)
          ==================================================================== */}

      {/* GRAND CHIFFRE 3 (E1) */}
      {three_op > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "8%",
            transform: `translate(-50%, 0) scale(${three_scale})`,
            opacity: three_op,
          }}
        >
          <svg width={300} height={260} viewBox="0 0 300 260" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a5d21" />
                <stop offset="100%" stopColor={OCRE_DARK} />
              </linearGradient>
            </defs>
            <text
              x="150"
              y="200"
              textAnchor="middle"
              fontFamily={FONT_NUM}
              fontSize={240}
              fill="url(#g3)"
              stroke={WHITE_WARM}
              strokeWidth={1.7}
              filter="url(#threeShadow)"
            >
              3
            </text>
          </svg>
        </div>
      )}

      {/* LABEL SANGOMAR + drapeau AU (E2) */}
      {e2Vis > 0.01 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, pointerEvents: "none", opacity: e2Vis }}>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <line
              x1={scSangomar[0] + W * 0.018}
              y1={scSangomar[1]}
              x2={W * 0.43}
              y2={H * 0.46}
              stroke={NAVY}
              strokeWidth={2.3}
              opacity={0.85 * labSan}
              strokeLinecap="square"
            />
          </svg>
          <div style={{ position: "absolute", left: "43%", top: "41%", transform: `translateX(${labSanSlide}px)`, opacity: labSan }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 800,
                  fontSize: "2.35vw",
                  letterSpacing: "-0.03em",
                  color: NAVY,
                  textShadow: `0 1px 0 ${WHITE_WARM}`,
                  lineHeight: 1,
                  borderBottom: `2px solid ${NAVY}`,
                  paddingBottom: 6,
                }}
              >
                SANGOMAR
              </div>
              <Img
                src={staticFile(ASSET + "flag-au.svg")}
                style={{
                  width: "3.5vw",
                  height: "2.4vw",
                  objectFit: "cover",
                  border: `1px solid ${WHITE_WARM}`,
                  opacity: flagAu,
                  transform: `scale(${interpolate(flagAu, [0, 1], [0.85, 1])})`,
                  filter: `drop-shadow(0 1px 2px rgba(11,16,32,0.18))`,
                  marginBottom: 6,
                }}
              />
            </div>
          </div>

          {/* JAUGE 18% Petrosen */}
          <div style={{ position: "absolute", left: "80%", top: "32%", width: "11%", opacity: gaugeT }}>
            <svg width={W * 0.11} height={W * 0.11} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="46" fill="none" stroke={TEXT_MUTED} strokeWidth={10} opacity={0.55} />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke={NAVY}
                strokeWidth={10}
                strokeLinecap="butt"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 - 18 * gaugeT}
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="70" textAnchor="middle" fontFamily={FONT_SANS} fontWeight={800} fontSize={32} fill={NAVY}>
                {gaugeVal}%
              </text>
            </svg>
            <div style={{ textAlign: "center", fontFamily: FONT_SANS, fontSize: "0.85vw", letterSpacing: 2, color: TEXT_MUTED, marginTop: 4, textTransform: "uppercase" }}>
              Part Petrosen
            </div>
          </div>
        </div>
      )}

      {/* BLOC LABEL GAZ / GTA / drapeau UK / 2025 (E3) */}
      {e3Vis > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: "35%",
            top: "18%",
            transform: `translateX(${labGtaSlide}px)`,
            opacity: e3Vis * labGta,
          }}
        >
          <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: "1.35vw", letterSpacing: "0.02em", color: NAVY, marginBottom: 2 }}>GAZ</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: FONT_SANS, fontWeight: 900, fontSize: "2.55vw", color: NAVY, lineHeight: 1 }}>GTA</div>
            <Img
              src={staticFile(ASSET + "flag-uk.svg")}
              style={{
                width: "3.3vw",
                height: "2.2vw",
                objectFit: "cover",
                border: `1px solid ${WHITE_WARM}`,
                opacity: flagUk,
                transform: `scale(${interpolate(flagUk, [0, 1], [0.85, 1])})`,
                filter: `drop-shadow(0 1px 2px rgba(11,16,32,0.18))`,
              }}
            />
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: "2.05vw", color: NAVY, opacity: yr2025, marginTop: 4 }}>2025</div>
          <div style={{ width: "60%", height: 2, background: NAVY, opacity: 0.85 * labGta, marginTop: 6 }} />
        </div>
      )}

      {/* LABELS FLECHES Europe / Asie (E3) */}
      {e3Vis > 0.01 && (
        <>
          <div style={{ position: "absolute", left: "82%", top: "13%", fontFamily: FONT_SANS, fontSize: "1.45vw", fontWeight: 500, color: NAVY, opacity: e3Vis * arrEuropeLab, textShadow: "0 1px 0 rgba(13,20,36,0.25)" }}>
            Europe
          </div>
          <div style={{ position: "absolute", left: "84%", top: "70%", fontFamily: FONT_SANS, fontSize: "1.45vw", fontWeight: 500, color: NAVY, opacity: e3Vis * arrAsieLab, textShadow: "0 1px 0 rgba(13,20,36,0.25)" }}>
            Asie
          </div>
        </>
      )}

      {/* TITRE YAKAAR-TERANGA (E4) */}
      {e4In > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: "31%",
            top: "15%",
            width: "38%",
            textAlign: "center",
            opacity: e4In * titleYak,
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 900,
              fontSize: "2.35vw",
              letterSpacing: `${titleTrack}em`,
              color: EN_SUSPENS_GREY,
              textShadow: "0 2px 0 rgba(11,16,32,0.55)",
              textTransform: "uppercase",
            }}
          >
            YAKAAR-TERANGA
          </div>
        </div>
      )}

      {/* TEXTE OPERATEUR : _ (E4) */}
      {e4In > 0.01 && opOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: "37%",
            top: "70%",
            width: "28%",
            opacity: opOp,
            fontFamily: FONT_SANS,
            fontWeight: 500,
            fontSize: "2.0vw",
            letterSpacing: "-0.02em",
            color: WHITE_WARM,
            textShadow: "0 2px 0 rgba(11,16,32,0.65)",
          }}
        >
          {opShown}
          <span style={{ opacity: caretOn ? 1 : 0 }}>_</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default SceneGisementsA_Parchemin;
