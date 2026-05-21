// Deformation S4 — Echo Maternel (mort de Nandi)
// Filtre SVG mourning-warp (feTurbulence baseFrequency animee via spring)
// + cercles concentriques depuis palais uMgungundlovu
// ZERO Gemini — tout en SVG pur + d3-geo (decision VAGUE-2-LOCKED)

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../timing";
import data from "../shaka-zulu-data.json";

// Coords palais projetees depuis shaka-zulu-data.json (mourning projection)
// Fallback hardcode si absent : uMgungundlovu lat -28.84, lon 31.46

const getPalaisXY = (): [number, number] => {
  const places = data.mourning.places as Record<string, [number, number]>;
  if (places.uMgungundlovu) return places.uMgungundlovu;
  return [420, 520]; // fallback centre-droit canvas
};

export interface MourningWarpProps {
  // Frame locale ou commence la deformation (relatif a la scene parente)
  startFrame?: number;
  // Intensite max de la deformation (0-1, defaut 0.6)
  maxIntensity?: number;
  // Nombre de cercles concentriques (defaut 4)
  ringCount?: number;
  // Duree d'expansion d'un ring en frames (defaut 90 = 3s)
  ringDuration?: number;
  // Intervalle entre rings en frames (defaut 30 = 1s)
  ringInterval?: number;
}

const FILTER_ID = "mourningWarpFilter";

export const MourningWarp: React.FC<MourningWarpProps> = ({
  startFrame = 0,
  maxIntensity = 0.6,
  ringCount = 4,
  ringDuration = 90,
  ringInterval = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  const [palaisX, palaisY] = getPalaisXY();

  // Spring d'intensite globale — monte sur 2s, reste haut
  const intensityT = spring({
    frame: localFrame,
    fps,
    config: { damping: 25, stiffness: 60 },
    from: 0,
    to: maxIntensity,
  });

  // baseFrequency de la turbulence : 0.01 au repos → monte avec intensite
  const baseFreq = interpolate(intensityT, [0, maxIntensity], [0.008, 0.028], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale de displacement : 0 → 18px max
  const displaceScale = interpolate(intensityT, [0, maxIntensity], [0, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rings concentriques — chacun demarre a startFrame + i * ringInterval
  const rings = Array.from({ length: ringCount }, (_, i) => {
    const ringStart = i * ringInterval;
    const ringLocalFrame = Math.max(0, localFrame - ringStart);
    const ringT = Math.min(1, ringLocalFrame / ringDuration);

    // Rayon : 0 → 380px (depasse le canvas pour effet immersif)
    const radius = interpolate(ringT, [0, 1], [0, 380], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Opacite : monte vite, descend progressivement
    const opacity = interpolate(
      ringT,
      [0, 0.08, 0.5, 1],
      [0, 0.7, 0.35, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Epaisseur : fine au debut, epaissit puis s'amincit
    const strokeWidth = interpolate(ringT, [0, 0.2, 0.7, 1], [1, 3.5, 2, 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return { radius, opacity, strokeWidth, key: i };
  });

  // Halo central sur le palais (pulsation bordeaux)
  const haloScale = 1 + 0.15 * Math.sin(localFrame * 0.12);
  const haloOpacity = interpolate(intensityT, [0, maxIntensity], [0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      {/* Defs filtre warp — baseFrequency et scale animes */}
      <defs>
        <filter
          id={FILTER_ID}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency={baseFreq}
            numOctaves={2}
            seed={7}
            result="warpNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warpNoise"
            scale={displaceScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* Cercles concentriques Echo Maternel depuis le palais */}
      {rings.map(({ radius, opacity, strokeWidth, key }) =>
        opacity > 0.01 ? (
          <circle
            key={key}
            cx={palaisX}
            cy={palaisY}
            r={radius}
            fill="none"
            stroke={PALETTE.BORDEAUX}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        ) : null
      )}

      {/* Anneau secondaire or (memoire de la mere) */}
      {rings.map(({ radius, opacity, key }) =>
        opacity > 0.02 ? (
          <circle
            key={`or-${key}`}
            cx={palaisX}
            cy={palaisY}
            r={radius * 0.88}
            fill="none"
            stroke={PALETTE.OR}
            strokeWidth={0.8}
            opacity={opacity * 0.4}
          />
        ) : null
      )}

      {/* Halo central palais */}
      {haloOpacity > 0.01 && (
        <g transform={`translate(${palaisX} ${palaisY})`}>
          <circle
            r={18 * haloScale}
            fill="none"
            stroke={PALETTE.BORDEAUX}
            strokeWidth="2"
            opacity={haloOpacity * 0.5}
          />
          <circle
            r={8}
            fill={PALETTE.BORDEAUX}
            opacity={haloOpacity * 0.9}
          />
          <circle
            r={3}
            fill="#fff"
            opacity={haloOpacity}
          />
        </g>
      )}
    </g>
  );
};

// =============================================================================
// Hook pour appliquer le filtre warp a un groupe SVG externe
// Usage: <g filter={useMourningWarpFilter(localFrame, startFrame)}>...</g>
// =============================================================================
export const useMourningWarpFilterId = (
  localFrame: number,
  startFrame: number,
  maxIntensity = 0.6
): string | undefined => {
  const active = localFrame > startFrame && maxIntensity > 0;
  return active ? `url(#${FILTER_ID})` : undefined;
};
