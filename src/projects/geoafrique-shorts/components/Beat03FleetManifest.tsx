import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
} from "remotion";
import { BEATS } from "../timing";
import { BEAT03_MANIFEST } from "../manifests/beat03-manifest";

const W = 1080;
const H = 1920;

function clampI(v: number): number {
  return interpolate(v, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Calcule l'opacite d'une ligne selon son type d'animation
function useLineOpacity(
  localFrame: number,
  fps: number,
  line: (typeof BEAT03_MANIFEST.lines)[number]
): number {
  const { appearsAt, animation } = line;

  if (animation === "spring" || animation === "counter") {
    const spr = spring({
      frame: Math.max(0, localFrame - appearsAt),
      fps,
      config: "spring" in line ? line.spring : { damping: 12, stiffness: 140 },
    });
    return clampI(spr);
  }

  if (animation === "fade") {
    const dur = "fadeDuration" in line ? line.fadeDuration : 20;
    return clampI(interpolate(localFrame, [appearsAt, appearsAt + dur], [0, 1]));
  }

  return localFrame >= appearsAt ? 1 : 0;
}

// Rendu d'une ligne de texte depuis le manifest
function ManifestLine({
  line,
  localFrame,
  fps,
}: {
  line: (typeof BEAT03_MANIFEST.lines)[number];
  localFrame: number;
  fps: number;
}) {
  const m = BEAT03_MANIFEST;
  const opacity = useLineOpacity(localFrame, fps, line);

  // Scale spring pour les animations spring
  let fontSize: number = line.size;
  if (line.animation === "spring" || line.animation === "counter") {
    const spr = spring({
      frame: Math.max(0, localFrame - line.appearsAt),
      fps,
      config: "spring" in line ? line.spring : { damping: 12, stiffness: 140 },
    });
    fontSize = Math.round(spr * (line.size as number));
  }

  // Compteur animé pour animation "counter"
  let displayText: string = line.text as string;
  if (line.animation === "counter" && "counterTarget" in line) {
    const count = Math.round(
      interpolate(
        localFrame,
        [line.appearsAt, line.appearsAt + line.counterDuration],
        [0, line.counterTarget],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    );
    displayText = count >= line.counterTarget ? line.text : String(count);
  }

  const filterId = m.glow.enabled ? "beat03-glow" : undefined;

  return (
    <text
      x={W / 2}
      y={H * line.y}
      textAnchor="middle"
      fill={line.color}
      fontSize={fontSize}
      fontFamily="'Playfair Display', Georgia, serif"
      fontWeight={line.weight}
      opacity={opacity}
      filter={filterId ? `url(#${filterId})` : undefined}
    >
      {displayText}
    </text>
  );
}

// Composant principal — lit BEAT03_MANIFEST
export function Beat03FleetManifest() {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const m = BEAT03_MANIFEST;
  const beatDur = BEATS.fleet.end - BEATS.fleet.start;

  const fi = clampI(interpolate(localFrame, [0, m.fade.inDuration], [0, 1]));
  const fo = clampI(interpolate(localFrame, [beatDur - m.fade.outDuration, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  return (
    <AbsoluteFill style={{ backgroundColor: m.background.color, opacity: op }}>
      {/* Backdrop SVG */}
      <img
        src={staticFile(m.background.asset)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Overlay sombre */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(0,0,0,${m.background.overlayOpacity})`,
        }}
      />

      {/* SVG texte */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          {m.glow.enabled && (
            <filter id="beat03-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={m.glow.stdDeviation} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {m.lines.map((line) => (
          <ManifestLine key={line.id} line={line} localFrame={localFrame} fps={fps} />
        ))}
      </svg>
    </AbsoluteFill>
  );
}
