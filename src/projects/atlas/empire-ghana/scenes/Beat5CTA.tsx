// Beat 5 CTA — Empire du Ghana — v1
// "Wagadou. Cinq siècles de commerce mondial. Demande qui contrôlait l'or
//  au Moyen-Âge. On te répondra Florence, Venise. Jamais Wagadou."
//
// Frames 2788 → 3145 (357 frames, ~11.9s)
//
// Concept antithèse : zoom-out de Wagadou → Méditerranée pour révéler
// Florence + Venise (la "réponse attendue"), puis whip-zoom retour sur
// Wagadou avec cartouche finale "JAMAIS WAGADOU".

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasSubtleStars,
} from "../../_shared/atlas-components";
import { GHANA_PALETTE, GHANA_FONTS } from "../components/GhanaPalette";
import { SEGMENTS } from "../timing";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ghanaData = require("../../../../../data/geo/empire-ghana-data.json");

const BEAT_START = SEGMENTS.S5_CTA.startFrame; // 2788
const TOTAL_FRAMES = SEGMENTS.S5_CTA.durationFrames; // 357

// ─── Timestamps absolus (forced alignment) ───────────────────────────────────
const ABS_WAGADOU_3   = Math.round(92.939 * 30);  // 2788
const ABS_CINQ        = Math.round(94.259 * 30);  // 2828
const ABS_DEMANDE     = Math.round(97.099 * 30);  // 2913
const ABS_FLORENCE    = Math.round(101.379 * 30); // 3041
const ABS_VENISE      = Math.round(102.500 * 30); // 3075
const ABS_JAMAIS      = Math.round(104.079 * 30); // 3122
const ABS_WAGADOU_4   = Math.round(104.419 * 30); // 3133

// Frames relatifs au début du beat
const R_WAGADOU       = ABS_WAGADOU_3   - BEAT_START; // 0
const R_CINQ          = ABS_CINQ        - BEAT_START; // 40
const R_DEMANDE       = ABS_DEMANDE     - BEAT_START; // 125
const R_FLORENCE      = ABS_FLORENCE    - BEAT_START; // 253
const R_VENISE        = ABS_VENISE      - BEAT_START; // 287
const R_JAMAIS        = ABS_JAMAIS      - BEAT_START; // 334
const R_WAGADOU_FINAL = ABS_WAGADOU_4   - BEAT_START; // 345

// ─── POI coords ──────────────────────────────────────────────────────────────
const POI = ghanaData.mercSahel.poi;
const SVG_KOUMBI_X = POI.KOUMBI_SALEH.x; // 238.56
const SVG_KOUMBI_Y = POI.KOUMBI_SALEH.y; // 696.95
const SVG_CAIRE_X  = POI.CAIRE.x;        // 1196.64
const SVG_CAIRE_Y  = POI.CAIRE.y;        // 317.08

// Florence + Venise — VRAIES coordonnées via projection mercSahel (d3-geo)
// geoMercator().center([-3, 18]).scale(1400).translate([360, 640])
// Florence (11.255°E, 43.770°N) → (708, -105) — y négatif = au-dessus du canvas
// Venise   (12.336°E, 45.438°N) → (735, -162)
// Le zoom-out de Beat 5 doit être suffisant pour que ces points soient visibles
const SVG_FLORENCE_X = 708;
const SVG_FLORENCE_Y = -105;
const SVG_VENISE_X = 735;
const SVG_VENISE_Y = -162;

// Composition scale
const SVG_W = 720;
const COMP_W = 1080;
const CSS_SCALE = COMP_W / SVG_W;

// ─── Mali path — coordonnées historiques projetées via d3-geo (réutilisé Beat 4)
const MALI_PATH = "M 103.4 791.9 L 66.8 754.3 L 54.6 691.1 L 115.7 652.8 L 189.0 640.0 L 286.7 640.0 L 360.0 665.6 L 408.9 716.5 L 445.5 766.8 L 372.2 804.3 L 262.3 841.6 L 176.7 829.2 L 103.4 791.9 Z";

// ─── Camera state ────────────────────────────────────────────────────────────
function computeCameraState(localFrame: number) {
  const driftX = Math.sin(localFrame * 0.014) * 4;
  const driftY = Math.cos(localFrame * 0.011) * 3;

  let camFocusX = SVG_KOUMBI_X;
  let camFocusY = SVG_KOUMBI_Y;
  let camZoom = 1.10;

  // Phase 1 : Wagadou (R_WAGADOU → R_CINQ) — continuité Beat 4
  if (localFrame < R_CINQ) {
    camFocusX = SVG_KOUMBI_X + 30;
    camFocusY = SVG_KOUMBI_Y + 20;
    camZoom = 1.10;
  }
  // Phase 2 : Cinq siècles → Demande (R_CINQ → R_DEMANDE) — début zoom-out
  else if (localFrame < R_DEMANDE) {
    const p = (localFrame - R_CINQ) / (R_DEMANDE - R_CINQ);
    camFocusX = (SVG_KOUMBI_X + 30) + (SVG_KOUMBI_X + 50 - (SVG_KOUMBI_X + 30)) * p;
    camFocusY = (SVG_KOUMBI_Y + 20) + (SVG_KOUMBI_Y - 20 - (SVG_KOUMBI_Y + 20)) * p;
    camZoom = interpolate(p, [0, 1], [1.10, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // Phase 3 : Demande → Venise (R_DEMANDE → R_VENISE) — zoom-out vers Méditerranée
  // Pan vers le nord pour révéler Florence + Venise (vraies coords y=-105 et -162)
  else if (localFrame < R_VENISE + 20) {
    const p = (localFrame - R_DEMANDE) / (R_VENISE + 20 - R_DEMANDE);
    // Centre entre Wagadou (y=697) et Florence/Venise (y~-130) → ~y=283
    const targetX = (SVG_KOUMBI_X + SVG_FLORENCE_X) / 2; // ~473
    const targetY = (SVG_KOUMBI_Y + SVG_FLORENCE_Y) / 2; // ~296
    camFocusX = (SVG_KOUMBI_X + 50) + (targetX - (SVG_KOUMBI_X + 50)) * p;
    camFocusY = (SVG_KOUMBI_Y - 20) + (targetY - (SVG_KOUMBI_Y - 20)) * p;
    // Zoom 0.85 → 0.32 pour englober Wagadou + Italie (delta ~800px à montrer)
    camZoom = interpolate(p, [0, 1], [0.85, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // Phase 4 : WHIP-ZOOM retour vers Wagadou (R_VENISE+20 → R_JAMAIS)
  // ~27 frames pour faire le retour rapide
  else if (localFrame < R_JAMAIS) {
    const p = (localFrame - (R_VENISE + 20)) / (R_JAMAIS - (R_VENISE + 20));
    const targetX = (SVG_KOUMBI_X + SVG_FLORENCE_X) / 2;
    const targetY = (SVG_KOUMBI_Y + SVG_FLORENCE_Y) / 2;
    // Easing rapide en sortie de zoom (acceleration)
    const eased = p * p; // quadratic in
    camFocusX = targetX + (SVG_KOUMBI_X - targetX) * eased;
    camFocusY = targetY + (SVG_KOUMBI_Y - targetY) * eased;
    camZoom = interpolate(eased, [0, 1], [0.32, 1.40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // Phase 5 : JAMAIS WAGADOU — zoom stable + cartouche finale
  else {
    camFocusX = SVG_KOUMBI_X;
    camFocusY = SVG_KOUMBI_Y;
    camZoom = interpolate(localFrame, [R_JAMAIS, R_WAGADOU_FINAL, TOTAL_FRAMES], [1.40, 1.50, 1.40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // Tilt classique
  const tiltBase = 16 + Math.sin(localFrame * 0.04) * 2;
  const effectiveTilt = camZoom > 1.2 ? interpolate(camZoom, [1.2, 1.5], [tiltBase, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  return {
    driftX, driftY,
    camFocusX, camFocusY,
    camZoom, skewX, scaleY,
  };
}

// SVG → composition
function svgToCompWithCam(
  svgX: number, svgY: number,
  cam: ReturnType<typeof computeCameraState>,
): { x: number; y: number } {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + 360 + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + 640 + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}

// ─── Composant principal ─────────────────────────────────────────────────────
export const Beat5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = computeCameraState(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: GHANA_PALETTE.NOIR_PROFOND }}>
      <Audio
        src={staticFile("audio/atlas-empire-ghana/narration-v1.mp3")}
        startFrom={SEGMENTS.S5_CTA.startFrame}
      />
      <Audio
        src={staticFile("audio/atlas-empire-ghana/music/v1-B-marche-or.mp3")}
        volume={0.07}
        startFrom={SEGMENTS.S5_CTA.startFrame}
      />
      {/* SFX 7 — Drum final ceremoniel sur "Jamais Wagadou" (R_JAMAIS = 334) */}
      <Sequence from={R_JAMAIS} durationInFrames={60}>
        <Audio
          src={staticFile("audio/atlas-empire-ghana/sfx/07-beat5-final-impact.mp3")}
          volume={0.30}
        />
      </Sequence>

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block", position: "absolute", top: 0, left: 0 }}
      >
        <Beat5Defs />
        <Beat5MapContent localFrame={frame} fps={fps} cam={cam} />
      </svg>

      <Beat5Sprites localFrame={frame} cam={cam} />

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block", position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <Beat5Overlays localFrame={frame} fps={fps} />
      </svg>
    </AbsoluteFill>
  );
};

export const BEAT5_CTA_FRAMES = TOTAL_FRAMES;

// ─── DEFS ────────────────────────────────────────────────────────────────────
const Beat5Defs: React.FC = () => (
  <defs>
    <radialGradient id="b5BgGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stopColor={GHANA_PALETTE.SEPIA_FOND} />
      <stop offset="100%" stopColor={GHANA_PALETTE.NOIR_PROFOND} />
    </radialGradient>
    <radialGradient id="b5Vignette" cx="50%" cy="50%" r="65%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
    </radialGradient>
    <pattern id="b5MaliHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2.5" opacity="0.85" />
      <line x1="4" y1="0" x2="4" y2="8" stroke="#3d6b2f" strokeWidth="1.5" opacity="0.7" />
    </pattern>
  </defs>
);

// ─── MAP CONTENT ─────────────────────────────────────────────────────────────
const Beat5MapContent: React.FC<{
  localFrame: number;
  fps: number;
  cam: ReturnType<typeof computeCameraState>;
}> = ({ localFrame, fps, cam }) => {
  const countries = ghanaData.mercSahel.countries;

  const globalFadeIn  = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = 1; // pas de fade out — Beat 5 est la fin du Short, on garde l'image stable

  // Mali pulse continu (héritage Beat 4)
  const maliPulse = 0.5 + 0.5 * Math.sin(localFrame * 0.06);

  // Florence/Venise fade-in
  const florenceVeniseT = interpolate(localFrame, [R_DEMANDE + 20, R_FLORENCE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Florence/Venise pulse rouge à leur mention — plus marqué + durée plus longue
  const florencePulse = localFrame >= R_FLORENCE - 5 && localFrame < R_FLORENCE + 45
    ? interpolate(localFrame, [R_FLORENCE - 5, R_FLORENCE + 5, R_FLORENCE + 25, R_FLORENCE + 45], [0, 1, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const venisePulse = localFrame >= R_VENISE - 5 && localFrame < R_VENISE + 45
    ? interpolate(localFrame, [R_VENISE - 5, R_VENISE + 5, R_VENISE + 25, R_VENISE + 45], [0, 1, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Mali strike final pulse (sur "Jamais Wagadou")
  const finalPulse = localFrame >= R_JAMAIS
    ? 0.7 + 0.3 * Math.sin((localFrame - R_JAMAIS) * 0.4)
    : 0;

  return (
    <g opacity={globalFadeIn * globalFadeOut}>
      <rect x="0" y="0" width="720" height="1280" fill="url(#b5BgGrad)" />
      <AtlasSubtleStars opacity={0.4} />

      <g transform={`
        translate(${360 + cam.driftX} ${640 + cam.driftY})
        scale(${cam.camZoom} ${cam.camZoom * cam.scaleY})
        skewX(${cam.skewX})
        translate(${-cam.camFocusX} ${-cam.camFocusY})
      `}>
        <rect x="-2000" y="-2000" width="5000" height="5500" fill={ATLAS_COLORS.ocean} />
        {countries.map((c: { iso: string; d: string }) => (
          <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
        ))}

        {/* Empire Mali OR_VIF — pulse continu */}
        <path
          d={MALI_PATH}
          fill={GHANA_PALETTE.OR_VIF}
          fillOpacity={0.35 + maliPulse * 0.15 + finalPulse * 0.20}
        />
        <path
          d={MALI_PATH}
          fill="url(#b5MaliHatch)"
          fillOpacity={0.8}
        />
        <path
          d={MALI_PATH}
          fill="none"
          stroke={GHANA_PALETTE.OR_VIF}
          strokeWidth={3 + maliPulse * 3 + finalPulse * 5}
          strokeOpacity={0.85 + maliPulse * 0.15}
          strokeLinejoin="round"
          strokeDasharray="8 4"
        />
        {/* Halo Mali extérieur */}
        <path
          d={MALI_PATH}
          fill="none"
          stroke={GHANA_PALETTE.OR_VIF}
          strokeWidth={12 + maliPulse * 8 + finalPulse * 10}
          strokeOpacity={0.25 + finalPulse * 0.20}
          strokeLinejoin="round"
        />

        {/* Florence + Venise — apparaissent quand on zoom-out */}
        {florenceVeniseT > 0.01 && (
          <>
            {/* Florence — point rouge GROS + halos lumineux + label */}
            {/* Halo extérieur permanent (lumineux même sans pulse, vu qu'on est zoomé loin) */}
            <circle cx={SVG_FLORENCE_X} cy={SVG_FLORENCE_Y} r={20}
              fill="#e84030" stroke="none"
              opacity={florenceVeniseT * 0.3}
            />
            <circle cx={SVG_FLORENCE_X} cy={SVG_FLORENCE_Y} r={14}
              fill="#e84030" stroke="none"
              opacity={florenceVeniseT * 0.5}
            />
            {/* Point central plus gros */}
            <circle cx={SVG_FLORENCE_X} cy={SVG_FLORENCE_Y} r={10 + florencePulse * 8}
              fill={`rgb(${180 + 70 * florencePulse}, ${60 - 30 * florencePulse}, ${60 - 50 * florencePulse})`}
              stroke="#3a1818" strokeWidth="2.5"
              opacity={florenceVeniseT}
            />
            {/* Halos pulse expansifs (plus gros pour zoom-out) */}
            {florencePulse > 0.05 && (
              <>
                <circle cx={SVG_FLORENCE_X} cy={SVG_FLORENCE_Y} r={10 + florencePulse * 60}
                  fill="none" stroke="#ff5040" strokeWidth="4"
                  opacity={(1 - florencePulse) * 0.95}
                />
                <circle cx={SVG_FLORENCE_X} cy={SVG_FLORENCE_Y} r={10 + florencePulse * 35}
                  fill="#ff5040" stroke="none"
                  opacity={(1 - florencePulse) * 0.35}
                />
              </>
            )}
            <text x={SVG_FLORENCE_X} y={SVG_FLORENCE_Y - 22} textAnchor="middle"
              fill="#a83030" fontSize="26" fontFamily={GHANA_FONTS.SERIF}
              fontWeight="700" letterSpacing="3"
              opacity={florenceVeniseT}
              stroke={GHANA_PALETTE.PARCHEMIN} strokeWidth="1.2" paintOrder="stroke"
            >FLORENCE</text>

            {/* Venise — point rouge GROS + halos lumineux + label */}
            <circle cx={SVG_VENISE_X} cy={SVG_VENISE_Y} r={20}
              fill="#e84030" stroke="none"
              opacity={florenceVeniseT * 0.3}
            />
            <circle cx={SVG_VENISE_X} cy={SVG_VENISE_Y} r={14}
              fill="#e84030" stroke="none"
              opacity={florenceVeniseT * 0.5}
            />
            <circle cx={SVG_VENISE_X} cy={SVG_VENISE_Y} r={10 + venisePulse * 8}
              fill={`rgb(${180 + 70 * venisePulse}, ${60 - 30 * venisePulse}, ${60 - 50 * venisePulse})`}
              stroke="#3a1818" strokeWidth="2.5"
              opacity={florenceVeniseT}
            />
            {venisePulse > 0.05 && (
              <>
                <circle cx={SVG_VENISE_X} cy={SVG_VENISE_Y} r={10 + venisePulse * 60}
                  fill="none" stroke="#ff5040" strokeWidth="4"
                  opacity={(1 - venisePulse) * 0.95}
                />
                <circle cx={SVG_VENISE_X} cy={SVG_VENISE_Y} r={10 + venisePulse * 35}
                  fill="#ff5040" stroke="none"
                  opacity={(1 - venisePulse) * 0.35}
                />
              </>
            )}
            <text x={SVG_VENISE_X + 22} y={SVG_VENISE_Y + 8} textAnchor="start"
              fill="#a83030" fontSize="26" fontFamily={GHANA_FONTS.SERIF}
              fontWeight="700" letterSpacing="3"
              opacity={florenceVeniseT}
              stroke={GHANA_PALETTE.PARCHEMIN} strokeWidth="1.2" paintOrder="stroke"
            >VENISE</text>
          </>
        )}

        {/* Koumbi Saleh — point de référence */}
        <circle cx={SVG_KOUMBI_X} cy={SVG_KOUMBI_Y} r="5"
          fill={GHANA_PALETTE.OR_VIF}
          stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5"
        />
      </g>
    </g>
  );
};

// ─── SPRITES (Niani Mali début + Koumbi animé callback fin) ────────────────
const Beat5Sprites: React.FC<{
  localFrame: number;
  cam: ReturnType<typeof computeCameraState>;
}> = ({ localFrame, cam }) => {
  const koumbiPos = svgToCompWithCam(SVG_KOUMBI_X, SVG_KOUMBI_Y, cam);

  // Niani Mali — visible jusqu'au début du whip-zoom retour (R_VENISE)
  const nianiVisible = localFrame < R_VENISE;
  const nianiOpacity = interpolate(
    localFrame,
    [0, 10, R_DEMANDE, R_DEMANDE + 30],
    [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nianiSize = 200 * (cam.camZoom / 1.10);

  // Callback Koumbi animée — apparaît sur "Jamais Wagadou" (R_JAMAIS)
  // Spritesheet 4 frames horizontales (256×64 = 4×64), animation lente cycle
  const koumbiCallbackVisible = localFrame >= R_JAMAIS - 5;
  const koumbiOpacity = interpolate(
    localFrame,
    [R_JAMAIS - 5, R_JAMAIS + 8, TOTAL_FRAMES],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const koumbiSize = 200 * (cam.camZoom / 1.40);
  // Animation cycle : 4 frames, ~6 frames Remotion par sprite frame
  const koumbiAnimFrame = Math.floor((localFrame - R_JAMAIS) / 6) % 4;

  return (
    <>
      {/* Niani Mali — début de Beat 5 (héritage Beat 4) */}
      {nianiVisible && (
        <Img
          src={staticFile("empire-ghana/assets/pixellab/niani-mali.png")}
          style={{
            position: "absolute",
            left: koumbiPos.x - nianiSize / 2,
            top: koumbiPos.y - nianiSize / 2 - 25,
            width: nianiSize,
            height: nianiSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: "drop-shadow(2px 2px 8px rgba(212, 165, 86, 0.6))",
            opacity: nianiOpacity,
            zIndex: 6,
          }}
        />
      )}

      {/* CALLBACK Koumbi animée — apparaît sur "Jamais Wagadou" */}
      {/* Spritesheet 4 frames horizontales : on display via clip + offset */}
      {koumbiCallbackVisible && (
        <div style={{
          position: "absolute",
          left: koumbiPos.x - koumbiSize / 2,
          top: koumbiPos.y - koumbiSize / 2 - 30,
          width: koumbiSize,
          height: koumbiSize,
          opacity: koumbiOpacity,
          overflow: "hidden",
          filter: "drop-shadow(0 0 12px rgba(212, 165, 86, 0.8))",
          zIndex: 7,
          pointerEvents: "none",
        }}>
          <img
            src={staticFile("empire-ghana/assets/pixellab/koumbi-saleh-sheet.png")}
            style={{
              position: "absolute",
              left: -koumbiAnimFrame * koumbiSize,
              top: 0,
              width: koumbiSize * 4,
              height: koumbiSize,
              imageRendering: "pixelated",
              display: "block",
            }}
            alt=""
          />
        </div>
      )}
    </>
  );
};

// ─── OVERLAYS (cartouches narratives) ─────────────────────────────────────
const Beat5Overlays: React.FC<{
  localFrame: number;
  fps: number;
}> = ({ localFrame, fps }) => {
  const globalFadeIn  = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vignetteOpacity = 0.65 + 0.15 * Math.sin(localFrame * 0.025);

  // Cartouche "5 SIÈCLES DE COMMERCE MONDIAL"
  const cinqT = spring({ frame: localFrame - R_CINQ, fps, config: { damping: 14, stiffness: 180 } });
  const cinqOpacity = interpolate(
    localFrame,
    [R_CINQ, R_CINQ + 12, R_DEMANDE - 10, R_DEMANDE],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cartouche question : "QUI CONTRÔLAIT L'OR ?"
  const questionT = spring({ frame: localFrame - R_DEMANDE, fps, config: { damping: 14, stiffness: 180 } });
  const questionOpacity = interpolate(
    localFrame,
    [R_DEMANDE, R_DEMANDE + 12, R_FLORENCE - 10, R_FLORENCE],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cartouche FINALE : "JAMAIS WAGADOU" — pleine opacité tenue jusqu'à la fin
  const finalT = spring({ frame: localFrame - R_JAMAIS, fps, config: { damping: 12, stiffness: 110 } });
  const finalOpacity = interpolate(
    localFrame,
    [R_JAMAIS, R_JAMAIS + 8, TOTAL_FRAMES],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <g opacity={globalFadeIn}>
      {/* Cartouche 5 SIÈCLES */}
      {localFrame >= R_CINQ && cinqOpacity > 0.01 && (
        <g transform={`translate(360 220) scale(${0.85 + 0.15 * cinqT})`} opacity={cinqOpacity}>
          <rect x="-260" y="-55" width="520" height="110" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
          <rect x="-252" y="-47" width="504" height="94" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
          <text x="0" y="-12" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="40" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="6">5 SIÈCLES</text>
          <text x="0" y="22" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="16" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="3">de commerce mondial</text>
        </g>
      )}

      {/* Cartouche question */}
      {localFrame >= R_DEMANDE && questionOpacity > 0.01 && (
        <g transform={`translate(360 200) scale(${0.85 + 0.15 * questionT})`} opacity={questionOpacity}>
          <rect x="-280" y="-55" width="560" height="110" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
          <rect x="-272" y="-47" width="544" height="94" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
          <text x="0" y="-8" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="28" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="3">QUI CONTRÔLAIT L'OR</text>
          <text x="0" y="22" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="18" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2">au Moyen-Âge ?</text>
        </g>
      )}

      {/* CARTOUCHE FINALE : JAMAIS WAGADOU */}
      {localFrame >= R_JAMAIS && finalOpacity > 0.01 && (
        <g transform={`translate(360 220) scale(${0.85 + 0.15 * finalT})`} opacity={finalOpacity}>
          {/* Fond bordeaux profond avec bordure or épaisse */}
          <rect x="-310" y="-75" width="620" height="150"
            fill={GHANA_PALETTE.BORDEAUX_PROFOND}
            stroke={GHANA_PALETTE.OR_VIF} strokeWidth="5"
            rx="8"
          />
          <rect x="-300" y="-65" width="600" height="130"
            fill="none"
            stroke={GHANA_PALETTE.OR} strokeWidth="2"
            rx="4" opacity="0.8"
          />
          {/* JAMAIS petit */}
          <text x="0" y="-22" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="28" fontStyle="italic" fill={GHANA_PALETTE.PARCHEMIN} letterSpacing="8" opacity="0.85">JAMAIS</text>
          {/* WAGADOU énorme */}
          <text x="0" y="38" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="68" fontWeight="900" fill={GHANA_PALETTE.OR_VIF} letterSpacing="10">WAGADOU</text>
        </g>
      )}

      <rect x="0" y="0" width="720" height="1280" fill="url(#b5Vignette)" opacity={vignetteOpacity} />
    </g>
  );
};
