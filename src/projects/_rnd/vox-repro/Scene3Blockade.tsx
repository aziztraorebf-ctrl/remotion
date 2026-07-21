/**
 * Scene3Blockade — reproduction du prompt 4 de la reference :
 * "15 second scene, starting on the last frame of scene 2. Tight zoom into the strait,
 * dotted lines appear, missiles flying across, blockade forms." (detroit d'Hormuz dans la
 * reference — ici un detroit fictif entre Mali/Niger pour rester neutre).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  useWorldCountries,
  useProjection,
  NAVY_OCEAN,
  LAND_FILL,
  LAND_STROKE,
  WIDTH,
  HEIGHT,
  CamKeyframe,
} from "./VoxReproScene";

const STRAIT_POINT: [number, number] = [8.9, 18.1]; // dernier point d'impact de Scene2, raccord

const CAM: CamKeyframe[] = [
  { f: 0, center: STRAIT_POINT, scale: 1000 }, // raccord exact fin Scene2
  { f: 60, center: STRAIT_POINT, scale: 3200 }, // tight zoom
  { f: 450, center: STRAIT_POINT, scale: 3200 },
];

const DOTTED_START = 70;
const DOTTED_DUR = 30;
const MISSILE_COUNT = 6;
const MISSILE_START = 110;

export const SCENE3_FRAMES = 450;
export const SCENE3_FPS = 30;

export const Scene3Blockade: React.FC = () => {
  const frame = useCurrentFrame();
  const countries = useWorldCountries();
  const { path } = useProjection(CAM, frame);

  const projCenter = path.centroid({ type: "Point", coordinates: STRAIT_POINT } as any);

  // Ligne de blocus pointillee — draw-in (meme mecanique que le contour, appliquee a un segment)
  const dottedT = interpolate(frame, [DOTTED_START, DOTTED_START + DOTTED_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const lineLen = 500;

  // Missiles : trajectoires paralleles courtes, glow orange, orientation fixe (traversee rapide)
  const missiles = Array.from({ length: MISSILE_COUNT }).map((_, i) => {
    const localStart = MISSILE_START + i * 6;
    const t = interpolate(frame, [localStart, localStart + 40], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear,
    });
    const laneOffset = (i % 3) * 60 - 60;
    const rowOffset = Math.floor(i / 3) * 50 - 25;
    const x = projCenter[0] - 300 + laneOffset + t * 400;
    const y = projCenter[1] - 200 + rowOffset + t * 60;
    const visible = frame >= localStart && frame <= localStart + 45;
    return { x, y, visible, i };
  });

  return (
    <AbsoluteFill style={{ background: NAVY_OCEAN }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {countries?.map((c, i) => (
          <path key={i} d={path(c as any) || ""} fill={LAND_FILL} stroke={LAND_STROKE} strokeWidth={0.6} />
        ))}

        {/* Ligne de blocus pointillee en diagonale */}
        {dottedT > 0.01 && (
          <line
            x1={projCenter[0] - 200} y1={projCenter[1] - 150}
            x2={projCenter[0] + 200} y2={projCenter[1] + 150}
            stroke="#e8c547" strokeWidth={5} strokeLinecap="round"
            strokeDasharray="14 10"
            strokeDashoffset={lineLen * (1 - dottedT)}
            opacity={dottedT}
          />
        )}

        {/* Missiles : traits + glow */}
        {missiles.map((m) => m.visible && (
          <g key={m.i}>
            <circle cx={m.x} cy={m.y} r={14} fill="#ff8c1a" opacity={0.35} />
            <circle cx={m.x} cy={m.y} r={6} fill="#ffdca0" />
            <line x1={m.x - 22} y1={m.y - 8} x2={m.x} y2={m.y} stroke="#5a5a5a" strokeWidth={4} strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export default Scene3Blockade;
