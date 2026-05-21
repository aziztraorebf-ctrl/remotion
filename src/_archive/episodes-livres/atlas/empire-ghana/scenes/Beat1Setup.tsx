// Beat 1 Setup — Empire du Ghana — v4
// CHANGEMENTS v4 :
// - Zoom espace continu (globe scale 1.96 -> 12x avec translate vers Wagadou)
//   plus de crossfade visible : le globe DEVIENT la carte
// - Retire highlight pays voisins (simplification visuelle)
// - Sprite PixelLab Koumbi Saleh (au lieu de pulse marker)
// - Cartouche WAGADOU + timeline VIIIᵉ→XIIIᵉ : TOUS EN HAUT (regle absolue : bottom = subs)
// - Spotlight insert "sel + or" centre carte avec dim background (3e mode entre overlay/fullscreen)

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
  AtlasGlobe,
  AtlasSubtleStars,
} from "../../_shared/atlas-components";
import { GHANA_PALETTE, GHANA_FONTS } from "../components/GhanaPalette";
import { SEGMENTS } from "../timing";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const atlasData = require("../../_shared/atlas-v2-data.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ghanaData = require("../../../../../data/geo/empire-ghana-data.json");

const SNAP_CONFIG = { damping: 80, stiffness: 400 };

// === Triggers narratifs (frames @30fps) ===
const ZOOM_END = 60;             // globe zoom termine, carte prend le relais
const CARTOUCHE_WAGADOU_AT = 42; // mot "Aujourd'hui"
const EMPIRE_REVEAL_AT = 75;     // apres bascule carte
const TIMELINE_AT = 168;         // mot "huitieme"
const KOUMBI_APPEAR_AT = 237;    // mot "cet empire"
const RICHESSE_AT = 330;         // mot "richesse"
const RICHESSE_OUT = 410;        // 80f = ~2.7s
const SECRET_GLOW_AT = 396;      // mot "Et il avait"

export const Beat1Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = SEGMENTS.S1_SETUP.durationFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: GHANA_PALETTE.NOIR_PROFOND }}>
      <Audio
        src={staticFile("audio/atlas-empire-ghana/narration-v1.mp3")}
        startFrom={SEGMENTS.S1_SETUP.startFrame}
      />
      <Audio
        src={staticFile("audio/atlas-empire-ghana/music/v1-B-marche-or.mp3")}
        volume={0.07}
        startFrom={SEGMENTS.S1_SETUP.startFrame}
      />
      {/* SFX 1 — Whoosh révélation sur le mot "secret" (frame relatif 415, abs 626 / 20.88s) */}
      <Sequence from={415} durationInFrames={20}>
        <Audio
          src={staticFile("audio/atlas-empire-ghana/sfx/01-beat1-secret-whoosh.mp3")}
          volume={0.15}
        />
      </Sequence>

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Beat1Defs />
        <Beat1Content localFrame={frame} fps={fps} totalFrames={totalFrames} />
      </svg>
    </AbsoluteFill>
  );
};

export const BEAT1_SETUP_FRAMES = SEGMENTS.S1_SETUP.durationFrames;

const Beat1Defs: React.FC = () => (
  <defs>
    <radialGradient id="ghanaBgGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stopColor={GHANA_PALETTE.SEPIA_FOND} />
      <stop offset="100%" stopColor={GHANA_PALETTE.NOIR_PROFOND} />
    </radialGradient>
    <radialGradient id="ghanaVignette" cx="50%" cy="50%" r="65%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
    </radialGradient>
    <pattern
      id="wagadouHatch"
      patternUnits="userSpaceOnUse"
      width="8"
      height="8"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="8" stroke={GHANA_PALETTE.OR} strokeWidth="2.5" opacity="0.85" />
      <line x1="4" y1="0" x2="4" y2="8" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" opacity="0.7" />
    </pattern>
    {/* Halo doré pour Koumbi Saleh */}
    <radialGradient id="koumbiHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={GHANA_PALETTE.OR_VIF} stopOpacity="0.7" />
      <stop offset="60%" stopColor={GHANA_PALETTE.OR} stopOpacity="0.25" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
    {/* Halo doré pour spotlight insert */}
    <radialGradient id="spotlightGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={GHANA_PALETTE.OR_VIF} stopOpacity="0.5" />
      <stop offset="70%" stopColor={GHANA_PALETTE.OR} stopOpacity="0.15" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
  </defs>
);

const Beat1Content: React.FC<{
  localFrame: number;
  fps: number;
  totalFrames: number;
}> = ({ localFrame, fps, totalFrames }) => {
  // ═══════════════════════════════════════════════════════════════════
  // PHASE 1 — ZOOM ESPACE CONTINU PIVOT SUR KOUMBI SALEH
  // ═══════════════════════════════════════════════════════════════════
  // Calcul cle : Koumbi Saleh sur la projection orthographique du globe est
  // a environ (255, 586) au debut Hook (rotation -15) et (286, 586) en fin zoom.
  // Pour zoomer SUR Koumbi (pas sur le centre canvas), on pivote le scale
  // autour de ces coordonnees, pas autour de (360, 640).
  const globeSvgScale = interpolate(localFrame, [0, ZOOM_END], [1.96, 11.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Coords Koumbi sur globe ortho a la rotation courante (interpolees)
  const koumbiGlobeX = interpolate(localFrame, [0, ZOOM_END], [255, 286], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const koumbiGlobeY = 586; // stable car latitude fixe -5 sur tilt
  // Pivot scale autour de Koumbi : translate(centerScreen - koumbi*scale)
  // = translate(360 - koumbiX*scale, 640 - koumbiY*scale) puis scale
  const globeRotation = interpolate(localFrame, [0, ZOOM_END], [-15, -8], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Globe disparait quand il "remplit" l'ecran (frame ZOOM_END + 5)
  const globeOpacity = interpolate(localFrame, [ZOOM_END - 5, ZOOM_END + 5], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Carte apparait au meme moment (transition seamless car deja zoomee a la bonne place)
  const mercOpacity = interpolate(localFrame, [ZOOM_END - 5, ZOOM_END + 5], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 2 — CARTE PLATE (forke Mansa Moussa V2 S1)
  // ═══════════════════════════════════════════════════════════════════
  // Camera deja positionnee sur Wagadou des le debut (pas de snap visible —
  // la transition globe->carte se fait avec deja le bon zoom et la bonne position)
  const koumbi = ghanaData.mercSahel.poi.KOUMBI_SALEH;
  const wagadouOffsetX = (koumbi.x - 360) * 0.65;
  const wagadouOffsetY = (koumbi.y - 640) * 0.65;
  const camOffX = wagadouOffsetX;
  const camOffY = wagadouOffsetY;

  // Drift Ken Burns continu (debute apres zoom)
  const driftX = Math.sin(localFrame * 0.014) * 10;
  const driftY = Math.cos(localFrame * 0.011) * 7;
  const fgDriftX = Math.sin(localFrame * 0.014) * 13;
  const fgDriftY = Math.cos(localFrame * 0.011) * 9;
  const parallaxX = fgDriftX - driftX;
  const parallaxY = fgDriftY - driftY;

  // Push-in lent + scale snap
  const slowPushIn = interpolate(
    localFrame,
    [ZOOM_END + 30, totalFrames],
    [0, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camScale = 1.35 + slowPushIn;

  // Tilt skewX + scaleY (commence apres bascule carte)
  const tiltRampIn = interpolate(
    localFrame,
    [ZOOM_END, ZOOM_END + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tiltStrength = tiltRampIn;
  const tiltPeak = 18;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2 * tiltRampIn;
  const tiltDeg = tiltPeak * tiltStrength + tiltBreath;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  // Empire Wagadou reveal
  const empireT = spring({
    frame: localFrame - EMPIRE_REVEAL_AT,
    fps,
    config: SNAP_CONFIG,
  });

  // Halo "secret" pulse au mot "Et il avait"
  const secretGlow = localFrame > SECRET_GLOW_AT
    ? 0.3 + 0.3 * Math.abs(Math.sin((localFrame - SECRET_GLOW_AT) * 0.16))
    : 0;

  // Vignette globale qui respire
  const vignetteOpacity = 0.65 + 0.15 * Math.sin(localFrame * 0.025);

  // Fade-out final
  const globalOpacity = interpolate(
    localFrame,
    [totalFrames - 12, totalFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === Sprite Koumbi Saleh apparait au mot "cet empire" ===
  const koumbiT = spring({
    frame: localFrame - KOUMBI_APPEAR_AT,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const koumbiBreathing = 1 + 0.04 * Math.sin(localFrame * 0.08);

  // === Spotlight insert "sel + or" ===
  const richesseSpring = spring({
    frame: localFrame - RICHESSE_AT,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const richesseOpacity = interpolate(
    localFrame,
    [RICHESSE_AT, RICHESSE_AT + 8, RICHESSE_OUT - 12, RICHESSE_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Background dim qui assombrit la carte sous le spotlight
  const dimOpacity = interpolate(
    localFrame,
    [RICHESSE_AT, RICHESSE_AT + 12, RICHESSE_OUT - 12, RICHESSE_OUT],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const countries = ghanaData.mercSahel.countries;

  return (
    <g opacity={globalOpacity}>
      <rect x="0" y="0" width="720" height="1280" fill="url(#ghanaBgGrad)" />
      <AtlasSubtleStars opacity={0.4} />

      {/* PHASE 1 : GLOBE EN ZOOM CONTINU pivot sur Koumbi Saleh */}
      {/* Transform pivot scale : translate(targetCenter - koumbi*scale) puis scale */}
      {/* Resultat : Koumbi reste au centre ecran pendant tout le zoom */}
      {globeOpacity > 0.01 && (
        <g opacity={globeOpacity}>
          <g
            transform={`
              translate(${360 - koumbiGlobeX * globeSvgScale} ${640 - koumbiGlobeY * globeSvgScale})
              scale(${globeSvgScale})
            `}
          >
            <AtlasGlobe
              countries={atlasData.ortho.countries}
              highlightFills={{
                MLI: GHANA_PALETTE.OR,
                MRT: GHANA_PALETTE.OR,
                SEN: GHANA_PALETTE.OR_TERNI,
                GIN: GHANA_PALETTE.OR_TERNI,
              }}
              rotation={globeRotation}
              scale={1}
              showHalo={true}
            />
          </g>
        </g>
      )}

      {/* PHASE 2 : CARTE PLATE (camera deja positionnee sur Wagadou) */}
      {mercOpacity > 0.01 && (
        <g opacity={mercOpacity}>
          <g
            transform={`
              translate(${360 + driftX - camOffX} ${640 + driftY - camOffY})
              scale(${camScale} ${camScale * scaleY})
              skewX(${skewX})
              translate(${-360} ${-640})
            `}
          >
            {/* Ocean */}
            <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />

            {/* Tous les pays — terracotta uniforme (PAS de highlight voisins) */}
            {countries.map((c: { iso: string; d: string }) => (
              <path
                key={c.iso}
                d={c.d}
                fill={ATLAS_COLORS.land}
                stroke={ATLAS_COLORS.landStroke}
                strokeWidth="0.8"
                strokeOpacity="0.8"
              />
            ))}

            {/* FOREGROUND PARALLAX */}
            <g transform={`translate(${parallaxX} ${parallaxY})`}>
              {/* Halos territoire Wagadou */}
              {empireT > 0.05 && (
                <>
                  <path
                    d={ghanaData.mercSahel.wagadouEmpire}
                    fill="none"
                    stroke={GHANA_PALETTE.OR}
                    strokeWidth="20"
                    opacity={(0.12 + secretGlow * 0.18) * empireT}
                  />
                  <path
                    d={ghanaData.mercSahel.wagadouEmpire}
                    fill="none"
                    stroke={GHANA_PALETTE.OR_VIF}
                    strokeWidth="8"
                    opacity={(0.25 + secretGlow * 0.25) * empireT}
                  />
                </>
              )}

              {/* Empire Wagadou (hachures + outline pointille) */}
              {empireT > 0.05 && (
                <g opacity={empireT}>
                  <path
                    d={ghanaData.mercSahel.wagadouEmpire}
                    fill={GHANA_PALETTE.PARCHEMIN}
                    fillOpacity="0.22"
                    stroke="none"
                  />
                  <path
                    d={ghanaData.mercSahel.wagadouEmpire}
                    fill="url(#wagadouHatch)"
                    fillOpacity={0.85 * empireT}
                    stroke={ATLAS_COLORS.empireOutlineDark}
                    strokeWidth="3"
                    strokeOpacity="0.95"
                    strokeLinejoin="round"
                    strokeDasharray="10 5"
                  />
                </g>
              )}

              {/* Sprite Koumbi Saleh ville ANIMEE (4 frames spritesheet PixelLab) */}
              {/* Spritesheet 448x112 = 4 frames de 112x112, cycle ~6.66 fps (= 5 frames Remotion @ 30fps) */}
              {localFrame >= KOUMBI_APPEAR_AT && koumbiT > 0.05 && (() => {
                const animFrame = Math.floor((localFrame - KOUMBI_APPEAR_AT) / 5) % 4;
                const SPRITE_SIZE = 112;
                const DISPLAY_SIZE = 88;
                const clipId = `koumbiClip-${animFrame}`;
                return (
                  <g
                    transform={`translate(${koumbi.x} ${koumbi.y}) scale(${koumbiT * koumbiBreathing})`}
                    opacity={koumbiT}
                  >
                    {/* Halo dore subtil */}
                    <circle cx="0" cy="0" r="55" fill="url(#koumbiHalo)" />
                    {/* Sprite anime via clip-path qui montre 1 frame a la fois */}
                    <defs>
                      <clipPath id={clipId}>
                        <rect x={-DISPLAY_SIZE / 2} y={-DISPLAY_SIZE / 2} width={DISPLAY_SIZE} height={DISPLAY_SIZE} />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#${clipId})`}>
                      <image
                        href={staticFile("empire-ghana/assets/pixellab/koumbi-saleh-sheet.png")}
                        x={-DISPLAY_SIZE / 2 - animFrame * DISPLAY_SIZE}
                        y={-DISPLAY_SIZE / 2}
                        width={DISPLAY_SIZE * 4}
                        height={DISPLAY_SIZE}
                        preserveAspectRatio="none"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </g>
                  </g>
                );
              })()}
            </g>
          </g>
        </g>
      )}

      {/* === CARTOUCHES TOUJOURS EN HAUT (regle absolue : bas = sous-titres) === */}
      {/* Cartouche WAGADOU — y=170 */}
      <GhanaCartoucheWagadou
        appearAt={CARTOUCHE_WAGADOU_AT}
        disappearAt={CARTOUCHE_WAGADOU_AT + 90}
        localFrame={localFrame}
        fps={fps}
      />

      {/* Timeline VIIIᵉ → XIIIᵉ — y=320 (sous WAGADOU, mais TOUJOURS HAUT) */}
      <GhanaCartoucheTimeline
        appearAt={TIMELINE_AT}
        disappearAt={TIMELINE_AT + 120}
        localFrame={localFrame}
        fps={fps}
      />

      {/* === SPOTLIGHT INSERT "sel + or" — centre carte avec dim background === */}
      {localFrame >= RICHESSE_AT && richesseOpacity > 0.01 && (
        <>
          {/* Dim background (assombrit la carte sans la cacher) */}
          <rect
            x="0"
            y="0"
            width="720"
            height="1280"
            fill={GHANA_PALETTE.NOIR_PROFOND}
            opacity={dimOpacity}
            pointerEvents="none"
          />

          {/* Cartouche stylise centre avec sacs */}
          <g
            transform={`translate(360 640) scale(${0.85 + 0.15 * richesseSpring})`}
            opacity={richesseOpacity}
          >
            {/* Halo dore derriere le cartouche */}
            <circle cx="0" cy="0" r="280" fill="url(#spotlightGlow)" />

            {/* Boite parchemin ornementee */}
            <rect
              x="-260"
              y="-150"
              width="520"
              height="300"
              fill={GHANA_PALETTE.PARCHEMIN}
              stroke={GHANA_PALETTE.OR}
              strokeWidth="4"
              rx="10"
            />
            <rect
              x="-250"
              y="-140"
              width="500"
              height="280"
              fill="none"
              stroke={GHANA_PALETTE.BORDEAUX_PROFOND}
              strokeWidth="1.5"
              rx="6"
              opacity="0.75"
            />

            {/* Sac de SEL (gauche) */}
            <image
              href={staticFile("empire-ghana/assets/pixellab/sac-sel.png")}
              x="-200"
              y="-100"
              width="140"
              height="140"
              preserveAspectRatio="xMidYMid meet"
              style={{ imageRendering: "pixelated" }}
            />
            <text
              x="-130"
              y="62"
              textAnchor="middle"
              fontFamily={GHANA_FONTS.TITRE}
              fontSize="32"
              fontWeight="700"
              fill={GHANA_PALETTE.BORDEAUX_PROFOND}
              letterSpacing="3"
            >
              SEL
            </text>

            {/* Symbole egalite-poids (balance stylisee centre) */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily={GHANA_FONTS.TITRE}
              fontSize="56"
              fontWeight="700"
              fill={GHANA_PALETTE.OR_VIF}
            >
              ⇌
            </text>

            {/* Sac d'OR (droite) */}
            <image
              href={staticFile("empire-ghana/assets/pixellab/sac-or.png")}
              x="60"
              y="-100"
              width="140"
              height="140"
              preserveAspectRatio="xMidYMid meet"
              style={{ imageRendering: "pixelated" }}
            />
            <text
              x="130"
              y="62"
              textAnchor="middle"
              fontFamily={GHANA_FONTS.TITRE}
              fontSize="32"
              fontWeight="700"
              fill={GHANA_PALETTE.BORDEAUX_PROFOND}
              letterSpacing="3"
            >
              OR
            </text>

            {/* Sous-titre tout en bas */}
            <text
              x="0"
              y="115"
              textAnchor="middle"
              fontFamily={GHANA_FONTS.SERIF}
              fontSize="20"
              fontStyle="italic"
              fill={GHANA_PALETTE.OR_TERNI}
              letterSpacing="2"
            >
              la richesse du Sahara
            </text>
          </g>
        </>
      )}

      {/* Vignette globale */}
      <rect
        x="0"
        y="0"
        width="720"
        height="1280"
        fill="url(#ghanaVignette)"
        opacity={vignetteOpacity}
        pointerEvents="none"
      />
    </g>
  );
};

// =====================================================================
// CARTOUCHE WAGADOU — TOUJOURS EN HAUT (y=170)
// =====================================================================
const GhanaCartoucheWagadou: React.FC<{
  appearAt: number;
  disappearAt: number;
  localFrame: number;
  fps: number;
}> = ({ appearAt, disappearAt, localFrame, fps }) => {
  if (localFrame < appearAt) return null;
  const t = spring({ frame: localFrame - appearAt, fps, config: { damping: 14, stiffness: 200 } });
  const scale = interpolate(t, [0, 1], [0.7, 1]);
  const wobble = Math.sin(localFrame * 0.08) * 0.4;
  const fadeOut = interpolate(localFrame, [disappearAt - 12, disappearAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(t, fadeOut);
  return (
    <g transform={`translate(360 170) rotate(${wobble}) scale(${scale})`} opacity={opacity}>
      <rect x="-220" y="-55" width="440" height="110" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
      <rect x="-212" y="-47" width="424" height="94" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
      <text x="0" y="-2" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="46" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="6">WAGADOU</text>
      <text x="0" y="32" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="20" fontWeight="500" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2" fontStyle="italic">l'empire oublié</text>
    </g>
  );
};

// =====================================================================
// CARTOUCHE TIMELINE — TOUJOURS EN HAUT (y=320, sous WAGADOU)
// =====================================================================
const GhanaCartoucheTimeline: React.FC<{
  appearAt: number;
  disappearAt: number;
  localFrame: number;
  fps: number;
}> = ({ appearAt, disappearAt, localFrame, fps }) => {
  if (localFrame < appearAt) return null;
  const t = spring({ frame: localFrame - appearAt, fps, config: { damping: 14, stiffness: 200 } });
  const scale = interpolate(t, [0, 1], [0.85, 1]);
  const wobble = Math.sin(localFrame * 0.08) * 0.3;
  const xiiiT = spring({ frame: localFrame - (appearAt + 31), fps, config: { damping: 14, stiffness: 200 } });
  const xiiiOpacity = interpolate(xiiiT, [0, 1], [0, 1]);
  const lineProgress = interpolate(localFrame, [appearAt + 10, appearAt + 31], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(localFrame, [disappearAt - 15, disappearAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(t, fadeOut);
  return (
    <g transform={`translate(360 320) rotate(${wobble}) scale(${scale})`} opacity={opacity}>
      <rect x="-280" y="-50" width="560" height="100" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
      <rect x="-272" y="-42" width="544" height="84" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
      <text x="-180" y="8" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="42" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="3">VIIIᵉ</text>
      <text x="-180" y="32" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="14" fontWeight="500" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2">SIÈCLE</text>
      <line x1="-110" y1="0" x2={-110 + lineProgress * 220} y2="0" stroke={GHANA_PALETTE.OR} strokeWidth="3" strokeDasharray="6 3" />
      {lineProgress > 0.95 && (
        <g transform="translate(0 0)" opacity={xiiiOpacity}>
          <polygon points="-8,0 0,-8 8,0 0,8" fill={GHANA_PALETTE.OR_VIF} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" />
        </g>
      )}
      <g opacity={xiiiOpacity}>
        <text x="180" y="8" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="42" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="3">XIIIᵉ</text>
        <text x="180" y="32" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="14" fontWeight="500" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2">SIÈCLE</text>
      </g>
    </g>
  );
};
