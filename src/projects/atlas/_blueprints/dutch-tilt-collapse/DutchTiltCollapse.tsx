import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator } from "../../_shared/atlas-components";
import atlasData from "../../_shared/atlas-v2-data.json";

// Blueprint: DutchTiltCollapse
//
// Technique narrative : la carte bascule progressivement (dutch tilt 0°→6°→0°)
// pendant un événement traumatique (effondrement, défaite, catastrophe).
// Simultanément : désaturation de la couleur empire, camera shake à l'impact,
// switch brutal vers une palette "cendres" à une frame précise.
//
// Source validée : Empire Ghana Beat4Consequence (Phase D — Sécheresse + Effondrement).
// Pattern clé : dutchAngle calculé dans computeCameraState(), appliqué sur le
// wrapper <AbsoluteFill style={{ transform: `rotate(${dutchAngle}deg)` }}>.
// Le shake utilise Math.random() — déterministe frame-par-frame dans Remotion.
//
// Cas d'usage :
//   - Fin d'un empire (effondrement politique)
//   - Défaite militaire décisive
//   - Catastrophe naturelle (sécheresse, famine)
//   - Trahison / coup d'État
//
// Props :
//   focusSvgX/Y    — point central de la carte (là où l'événement se passe)
//   tiltStart      — frame où le tilt commence (sur "sécheresse" dans le script)
//   tiltPeak       — frame où le tilt est maximum (sur "effondrement")
//   tiltEnd        — frame où le tilt redescend à 0°
//   maxTiltDeg     — angle maximum en degrés (défaut 6)
//   shakeFrame     — frame de l'impact (shake intensif sur 12 frames)
//   shakeAmplitude — amplitude du shake en pixels (défaut 12)
//   collapseFrame  — frame du switch brutal couleur (isCollapsed flip)
//   colorNormal    — couleur fill des pays avant l'effondrement
//   colorCollapsed — couleur fill des pays après l'effondrement (gris cendres)
//   empirePathD    — path SVG de l'empire (affiché en overlay, optionnel)
//   durationFrames

interface Props {
  focusSvgX?: number;
  focusSvgY?: number;
  tiltStart?: number;
  tiltPeak?: number;
  tiltEnd?: number;
  maxTiltDeg?: number;
  shakeFrame?: number;
  shakeAmplitude?: number;
  collapseFrame?: number;
  zoomDuringCollapse?: number;
  colorNormal?: string;
  colorCollapsed?: string;
  empirePathD?: string;
  durationFrames?: number;
}

const SVG_W = 720;
const ATLAS_CX = 360;
const ATLAS_CY = 640;

export const DutchTiltCollapse: React.FC<Props> = ({
  focusSvgX = 238,
  focusSvgY = 697,
  tiltStart = 222,
  tiltPeak = 256,
  tiltEnd = 286,
  maxTiltDeg = 6,
  shakeFrame = 256,
  shakeAmplitude = 12,
  collapseFrame = 256,
  zoomDuringCollapse = 2.4,
  colorNormal = "#3a2a1a",
  colorCollapsed = "#2a2a2a",
  empirePathD = "",
  durationFrames = 300,
}) => {
  const frame = useCurrentFrame();

  // ── Dutch tilt ────────────────────────────────────────────────────────────
  // Monte 0→maxTiltDeg de tiltStart à tiltPeak.
  // Redescend maxTiltDeg→0 de tiltPeak à tiltEnd.
  // Source : Beat4Consequence.computeCameraState() dutchAngle block.
  let dutchAngle = 0;
  if (frame >= tiltStart && frame < tiltPeak) {
    dutchAngle = interpolate(frame, [tiltStart, tiltPeak], [0, maxTiltDeg], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame >= tiltPeak && frame < tiltEnd) {
    dutchAngle = interpolate(frame, [tiltPeak, tiltEnd], [maxTiltDeg, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // ── Camera shake (sin multifréquence — déterministe) ─────────────────────
  // Utilise sin() plutôt que Math.random() — reproductible frame-par-frame.
  // Source : ShakeImpact blueprint + Beat4Consequence shakeX/shakeY block.
  let shakeX = 0;
  let shakeY = 0;
  if (frame >= shakeFrame && frame < shakeFrame + 12) {
    const decay = 1 - (frame - shakeFrame) / 12;
    shakeX = shakeAmplitude * (Math.sin(frame * 7.3) * 0.6 + Math.sin(frame * 13.1) * 0.4) * decay;
    shakeY = shakeAmplitude * (Math.sin(frame * 9.7) * 0.5 + Math.sin(frame * 5.3) * 0.5) * decay;
  }

  // ── Switch brutal couleur à collapseFrame ─────────────────────────────────
  const isCollapsed = frame >= collapseFrame;
  const landColor = isCollapsed ? colorCollapsed : colorNormal;

  // ── Drift cinématique ─────────────────────────────────────────────────────
  const driftX = Math.sin(frame * 0.014) * 4 + shakeX;
  const driftY = Math.cos(frame * 0.011) * 3 + shakeY;

  const camZoom = zoomDuringCollapse;
  const tiltBase = 18;
  const effectiveTilt = camZoom > 1.9 ? 4 : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  const countries = (atlasData as { mercWide: { countries: { iso: string; d: string }[] } }).mercWide.countries;

  const globalFadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flash blanc à l'impact (3 frames)
  const flashOpacity = frame >= shakeFrame && frame < shakeFrame + 3
    ? interpolate(frame, [shakeFrame, shakeFrame + 3], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    // Le rotate est appliqué sur le wrapper — la TOTALITÉ de la composition bascule.
    // C'est plus dramatique que de tourner seulement la carte SVG.
    <AbsoluteFill style={{
      backgroundColor: "#0a0a0a",
      opacity: globalFadeIn * globalFadeOut,
      transform: `rotate(${dutchAngle}deg)`,
      transformOrigin: "center center",
    }}>
      <AbsoluteFill>
        <svg viewBox="0 0 720 1280" style={{ width: "100%", height: "100%" }}>
          <AtlasMercator
            countries={countries}
            scale={camZoom}
            driftX={driftX}
            driftY={driftY}
            centerOffsetX={focusSvgX - ATLAS_CX}
            centerOffsetY={focusSvgY - ATLAS_CY}
          />
          {/* Overlay de désaturation post-effondrement — rect semi-transparent gris */}
          {isCollapsed && (
            <rect
              x="0" y="0" width="720" height="1280"
              fill="#1a1a1a"
              opacity={interpolate(frame, [collapseFrame, collapseFrame + 20], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          )}
          {/* Empire overlay — disparaît progressivement après l'effondrement */}
          {empirePathD && (
            <path
              d={empirePathD}
              fill={isCollapsed ? "#444" : "#8B4513"}
              fillOpacity={isCollapsed
                ? interpolate(frame, [collapseFrame, collapseFrame + 60], [0.4, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                : 0.3
              }
              stroke={isCollapsed ? "#333" : "#B8860B"}
              strokeWidth={isCollapsed ? 1 : 2}
              strokeOpacity={isCollapsed ? 0.3 : 0.8}
              strokeDasharray="8 4"
            />
          )}

          {/* Flash blanc à l'impact */}
          {flashOpacity > 0 && (
            <rect x="0" y="0" width="720" height="1280" fill="white" opacity={flashOpacity} />
          )}

          {/* Overlay "EFFONDREMENT" — texte dramatique */}
          {isCollapsed && frame < collapseFrame + 45 && (
            <g opacity={interpolate(frame, [collapseFrame, collapseFrame + 8, collapseFrame + 40, collapseFrame + 45], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <rect x="0" y="550" width="720" height="120" fill="#0a0a0a" opacity="0.85" />
              <text x="360" y="625" textAnchor="middle" fill="#888" fontSize="42" fontFamily="serif" letterSpacing="12" fontWeight="700">EFFONDREMENT</text>
            </g>
          )}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
