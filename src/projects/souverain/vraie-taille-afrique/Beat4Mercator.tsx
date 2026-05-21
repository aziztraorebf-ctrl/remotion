/**
 * Beat4Mercator — "Le Groenland qui n'entre pas"
 * Fenetre : 750f = 25s (frames locales 0..749)
 * VO script Mercator = 583f (19.44s)
 *
 * Timeline locale :
 *   f0-f60   : transition depuis Beat 3 (silhouettes + chiffre disparaissent)
 *   f60-f180 : carte monde visible + Groenland apparait, surligne rouge-orange
 *   f180-f300: Groenland glisse vers l'Afrique pour comparaison — depasse largement
 *   f300-f360: Hold — le spectateur voit l'ecart de taille
 *   f360-f450: Groenland se contracte (scaleY 0.25) + label "x14 plus petit"
 *   f450-f600: Groenland contracte glisse dans l'Afrique, clipPath active
 *   f600-f750: Hold final + fondu noir
 */

import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import geoData from "./geo-data.json";

const PAL = {
  ocean:      "#bcd5e3",
  land:       "#ede5d3",
  landAfrica: "#d4a93c",
  border:     "#5a5a5a",
  greenland:  "#e85c2a",
  greenlandDim: "rgba(232, 92, 42, 0.3)",
} as const;

// Coordonnees pixel Afrique dans notre projection
const AFRICA_CX = geoData.africa.cx; // ~512
const AFRICA_CY = geoData.africa.cy; // ~856

// Position finale du Groenland apres contraction — centre exact de l'Afrique (comme les autres pays Beat2)
const GRL_FINAL_CX = AFRICA_CX;
const GRL_FINAL_CY = AFRICA_CY;

// Timeline
const T = {
  MAP_FADE_IN:         0,
  GRL_APPEAR:         20,
  GRL_MOVE_START:    180,
  GRL_MOVE_END:      300,
  SHRINK_START:      360,
  SHRINK_END:        450,
  ENTER_AFRICA_START: 450,
  ENTER_AFRICA_END:   600,
  FADE_OUT_START:    680,
  FADE_OUT_END:      750,
} as const;

// ---------------------------------------------------------------------------
// Extraction du path Groenland
// ---------------------------------------------------------------------------

function useGreenlandPath(): string {
  return useMemo(() => {
    const entry = (geoData.world.paths as Array<{ id: unknown; d: string }>)
      .find((p) => String(p.id) === "304");
    return entry?.d ?? "";
  }, []);
}

// ---------------------------------------------------------------------------
// Fond monde SVG — version pale pour Beat 4
// ---------------------------------------------------------------------------

const WorldMapPale: React.FC<{ width: number; height: number; opacity: number }> = ({
  width, height, opacity,
}) => {
  const africaIdSet = new Set(
    (geoData.africa.paths as Array<{ id: unknown }>).map((p) => String(p.id ?? ""))
  );
  const cx = width / 2;
  const cy = height / 2;
  const scale = 0.88;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        {(geoData.world.paths as Array<{ id: unknown; d: string }>).map((p) => {
          const isAfrica = africaIdSet.has(String(p.id ?? ""));
          const isgrl    = String(p.id) === "304";
          // Groenland rendu transparent ici — il est dessine separement avec animation
          if (isgrl) return null;
          return (
            <path
              key={String(p.id ?? Math.random())}
              d={p.d ?? ""}
              fill={isAfrica ? "#e8c86a" : "#e8e0d0"}
              stroke="#888"
              strokeWidth={0.4 / scale}
              strokeOpacity={0.5}
            />
          );
        })}
        {/* Contour Afrique visible et leger */}
        <path
          d={geoData.africa.path ?? ""}
          fill="none"
          stroke={PAL.landAfrica}
          strokeWidth={2 / scale}
          strokeOpacity={0.7}
        />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Groenland anime
// ---------------------------------------------------------------------------

const GreenlandAnimated: React.FC<{
  greenlandPath: string;
  width: number;
  height: number;
  frame: number;
  fps: number;
}> = ({ greenlandPath, width, height, frame, fps }) => {
  if (!greenlandPath) return null;

  // Centroide reel du Groenland mesure depuis le path (bbox)
  // BBox X: -140 -> 310, Y: -403 -> 258 => centroide (85, -73)
  const GRL_NATIVE_CX = 85;
  const GRL_NATIVE_CY = -73;

  // Position de depart visible : on translate pour amener le centroide en haut-droite du viewport
  const GRL_SCREEN_CX = 820;  // centroide visible haut-droite
  const GRL_SCREEN_CY = 340;

  // Position "comparaison" — decale a droite pour que le contraste Afrique/Groenland soit lisible
  const GRL_COMPARE_CX = AFRICA_CX + 180;
  const GRL_COMPARE_CY = AFRICA_CY - 200;

  // 1. Apparition
  const appearOpacity = spring({
    frame:  Math.max(0, frame - T.GRL_APPEAR),
    fps,
    config: { damping: 80, stiffness: 60 },
    from: 0, to: 1,
  });

  // 2. Mouvement vers l'Afrique
  const moveProgress = spring({
    frame:  Math.max(0, frame - T.GRL_MOVE_START),
    fps,
    config: { damping: 100, stiffness: 80 },
  });
  const moveTX = interpolate(moveProgress, [0, 1],
    [GRL_SCREEN_CX - GRL_NATIVE_CX, GRL_COMPARE_CX - GRL_NATIVE_CX],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const moveTY = interpolate(moveProgress, [0, 1],
    [GRL_SCREEN_CY - GRL_NATIVE_CY, GRL_COMPARE_CY - GRL_NATIVE_CY],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 3. Contraction (scaleY 1 -> 0.25 = vraie taille relative / Mercator)
  const shrinkProgress = spring({
    frame:  Math.max(0, frame - T.SHRINK_START),
    fps,
    config: { damping: 100, stiffness: 90 },
  });
  const scaleY = interpolate(shrinkProgress, [0, 1], [1, 0.25], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scaleX = interpolate(shrinkProgress, [0, 1], [1, 0.80], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // 4. Mouvement final dans l'Afrique
  const enterProgress = spring({
    frame:  Math.max(0, frame - T.ENTER_AFRICA_START),
    fps,
    config: { damping: 100, stiffness: 70 },
  });
  const enterDX = interpolate(enterProgress, [0, 1],
    [0, GRL_FINAL_CX - GRL_COMPARE_CX],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const enterDY = interpolate(enterProgress, [0, 1],
    [0, GRL_FINAL_CY - GRL_COMPARE_CY],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const finalTX = moveTX + enterDX;
  const finalTY = moveTY + enterDY;

  // Clip actif uniquement pendant la phase d'entree dans l'Afrique
  const isEntering = frame >= T.ENTER_AFRICA_START;

  // Label "x14 plus petit"
  const labelOpacity = spring({
    frame:  Math.max(0, frame - T.SHRINK_START + 15),
    fps,
    config: { damping: 80, stiffness: 60 },
    from: 0, to: 1,
  });

  // Pivot de transformation = centroide natif du Groenland (unused directement, sert de ref)
  const _pivotX = GRL_NATIVE_CX + finalTX;
  const _pivotY = GRL_NATIVE_CY + finalTY;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <clipPath id="beat4-africa-clip">
          <path d={geoData.africa.path ?? ""} />
        </clipPath>
      </defs>

      {/* Groenland — hors clip pendant comparaison, dans clip pendant entree */}
      <g opacity={appearOpacity}>
        {/* Version hors-clip (visible meme en dehors de l'Afrique) */}
        {!isEntering && (
          <g transform={`translate(${finalTX},${finalTY})`}>
            <g transform={`translate(${GRL_NATIVE_CX},${GRL_NATIVE_CY}) scale(${scaleX},${scaleY}) translate(${-GRL_NATIVE_CX},${-GRL_NATIVE_CY})`}>
              <path
                d={greenlandPath}
                fill={PAL.greenland}
                fillOpacity={0.75}
                stroke="#ffffff"
                strokeWidth={2}
                strokeOpacity={0.9}
              />
            </g>
          </g>
        )}

        {/* Version clippee sur Afrique (entree finale) */}
        {isEntering && (
          <g clipPath="url(#beat4-africa-clip)">
            <g transform={`translate(${finalTX},${finalTY})`}>
              <g transform={`translate(${GRL_NATIVE_CX},${GRL_NATIVE_CY}) scale(${scaleX},${scaleY}) translate(${-GRL_NATIVE_CX},${-GRL_NATIVE_CY})`}>
                <path
                  d={greenlandPath}
                  fill={PAL.greenland}
                  fillOpacity={0.75}
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeOpacity={0.9}
                />
              </g>
            </g>
          </g>
        )}
      </g>

      {/* Label "x14 plus petit" */}
      {frame >= T.SHRINK_START && (
        <g opacity={labelOpacity}>
          <rect
            x={GRL_COMPARE_CX + enterDX - 130}
            y={GRL_COMPARE_CY + enterDY - 220}
            width={260}
            height={56}
            rx={6}
            fill="rgba(15,15,15,0.75)"
          />
          <text
            x={GRL_COMPARE_CX + enterDX}
            y={GRL_COMPARE_CY + enterDY - 185}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={30}
            fontFamily="Georgia, serif"
            fontWeight="700"
          >
            14x plus petit
          </text>
        </g>
      )}

      {/* Carton doc — apparait au moment du retrecissement */}
      {frame >= T.SHRINK_START && frame < T.ENTER_AFRICA_START && (() => {
        const cartonOpacity = interpolate(
          frame,
          [T.SHRINK_START, T.SHRINK_START + 25, T.ENTER_AFRICA_START - 25, T.ENTER_AFRICA_START],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <g opacity={cartonOpacity}>
            <rect x={width / 2 - 310} y={260} width={620} height={110} rx={8} fill="rgba(10,10,10,0.80)" />
            <text
              x={width / 2}
              y={306}
              textAnchor="middle"
              fill="#d4c29d"
              fontSize={28}
              fontFamily="Georgia, serif"
              fontWeight="700"
            >
              Mercator, 1569
            </text>
            <text
              x={width / 2}
              y={346}
              textAnchor="middle"
              fill="#a89070"
              fontSize={21}
              fontFamily="Georgia, serif"
              fontStyle="italic"
            >
              Conçue pour la navigation. Utilisée pour l'éducation.
            </text>
          </g>
        );
      })()}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Labels informatifs Afrique / Groenland
// ---------------------------------------------------------------------------

const InfoLabels: React.FC<{
  width: number; height: number; frame: number; fps: number;
}> = ({ width, height, frame, fps }) => {
  const africaLabelOpacity = spring({
    frame:  Math.max(0, frame - T.GRL_MOVE_START + 30),
    fps,
    config: { damping: 80, stiffness: 60 },
    from: 0, to: 1,
  });

  const grlLabelOpacity = spring({
    frame:  Math.max(0, frame - T.GRL_APPEAR + 20),
    fps,
    config: { damping: 80, stiffness: 60 },
    from: 0, to: 1,
  });

  // Label annee Mercator
  const mercatorLabelOpacity = spring({
    frame:  Math.max(0, frame - T.MAP_FADE_IN + 20),
    fps,
    config: { damping: 80, stiffness: 50 },
    from: 0, to: 1,
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Label "Projection Mercator (1569)" en bas */}
      <g opacity={mercatorLabelOpacity}>
        <rect x={width / 2 - 220} y={height - 140} width={440} height={60} rx={6} fill="rgba(15,15,15,0.70)" />
        <text
          x={width / 2}
          y={height - 100}
          textAnchor="middle"
          fill="#d4c29d"
          fontSize={26}
          fontFamily="Georgia, serif"
          fontStyle="italic"
        >
          Projection Mercator (1569)
        </text>
      </g>

      {/* Label Afrique */}
      <g opacity={africaLabelOpacity}>
        <rect x={AFRICA_CX - 170} y={AFRICA_CY + 200} width={340} height={54} rx={6} fill="rgba(15,15,15,0.65)" />
        <text
          x={AFRICA_CX}
          y={AFRICA_CY + 237}
          textAnchor="middle"
          fill={PAL.landAfrica}
          fontSize={26}
          fontFamily="Georgia, serif"
          fontWeight="700"
        >
          Afrique = 30,3 M km²
        </text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export const Beat4Mercator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const greenlandPath = useGreenlandPath();

  // Pas de transition noire — demarrage direct
  const transitionOpacity = 1;

  // Fondu carte monde
  const mapOpacity = interpolate(frame, [T.MAP_FADE_IN, T.MAP_FADE_IN + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Fondu noir final
  const fadeOutOpacity = interpolate(frame, [T.FADE_OUT_START, T.FADE_OUT_END], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1412" }}>
      <AbsoluteFill style={{ opacity: transitionOpacity * fadeOutOpacity }}>
        <WorldMapPale width={width} height={height} opacity={mapOpacity * 0.85} />
        <GreenlandAnimated
          greenlandPath={greenlandPath}
          width={width}
          height={height}
          frame={frame}
          fps={fps}
        />
        <InfoLabels width={width} height={height} frame={frame} fps={fps} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BEAT4_DURATION = 750;
