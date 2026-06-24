/**
 * WhiteboardTest — TEST ISOLE de l'effet "se-dessine / s'efface" (whiteboard draw-on/draw-off).
 * But : valider la transition signature avant de l'appliquer au Beat 2.
 * Sequence (vertical 9:16, encre sur creme) :
 *   phase 1 (0->) : une scene A simple SE DESSINE trait par trait (draw-on, dashoffset L->0).
 *   phase 2 : elle tient.
 *   phase 3 : elle S'EFFACE trait par trait (draw-off, dashoffset 0->L) PENDANT que la scene B se dessine.
 * Aucun cut, aucun fade : tout passe par stroke-dasharray. C'est l'identite "carnet vivant".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
const VERT = "#3e8f34";

// helper : un trait qui se dessine (draw 0->1) puis s'efface (erase 0->1).
// drawN = fraction dessinee, eraseN = fraction effacee (depuis le DEBUT du trait, comme une gomme qui suit la plume).
function strokeDraw(len: number, drawN: number, eraseN: number) {
  // visible = [eraseN*len .. drawN*len]. On simule avec dasharray "gap dash gap".
  const start = eraseN * len;
  const end = drawN * len;
  const dash = Math.max(0, end - start);
  return {
    strokeDasharray: `0 ${start} ${dash} ${len}`,
    strokeDashoffset: 0,
  } as React.CSSProperties;
}

type Path = { d: string; len: number; w?: number; color?: string };

// SCENE A : un arbre simple au trait (tronc + 3 branches + sol) = "scene narrative" minimale
const SCENE_A: Path[] = [
  { d: "M 540 1400 L 540 950", len: 450, w: 8 },            // tronc
  { d: "M 540 1080 L 420 980", len: 160 },                  // branche G
  { d: "M 540 1060 L 660 960", len: 160 },                  // branche D
  { d: "M 540 1000 L 540 900", len: 100 },                  // cime
  { d: "M 240 1400 L 840 1400", len: 600, w: 3 },           // sol
];
// SCENE B : un soleil simple (cercle approx en path) + rayons = la scene suivante
const SCENE_B: Path[] = [
  { d: "M 540 480 m -120 0 a 120 120 0 1 0 240 0 a 120 120 0 1 0 -240 0", len: 754, w: 6, color: VERT },
  { d: "M 540 320 L 540 260", len: 60 },
  { d: "M 540 640 L 540 700", len: 60 },
  { d: "M 380 480 L 320 480", len: 60 },
  { d: "M 700 480 L 760 480", len: 60 },
];

export const WhiteboardTest: React.FC = () => {
  const frame = useCurrentFrame();

  // timeline (frames) : A se dessine 0-60, tient 60-110, s'efface 110-170 ; B se dessine 120-180
  const aDraw = interpolate(frame, [0, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aErase = interpolate(frame, [110, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bDraw = interpolate(frame, [120, 185], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <rect width={1080} height={1920} fill={CREME} />
        {/* SCENE A : se dessine puis s'efface (la gomme suit la plume) */}
        <g id="scene-a">
          {SCENE_A.map((p, i) => {
            const stagger = i * 0.08; // chaque trait demarre un peu apres le precedent
            const d = Math.max(0, Math.min(1, (aDraw - stagger) / (1 - stagger || 1)));
            const e = Math.max(0, Math.min(1, (aErase - stagger) / (1 - stagger || 1)));
            if (d <= 0) return null;
            return (
              <path key={i} d={p.d} stroke={p.color ?? ENCRE} strokeWidth={p.w ?? 4} fill="none"
                strokeLinecap="round" style={strokeDraw(p.len, d, e)} />
            );
          })}
        </g>
        {/* SCENE B : se dessine pendant que A s'efface */}
        <g id="scene-b">
          {SCENE_B.map((p, i) => {
            const stagger = i * 0.1;
            const d = Math.max(0, Math.min(1, (bDraw - stagger) / (1 - stagger || 1)));
            if (d <= 0) return null;
            return (
              <path key={i} d={p.d} stroke={p.color ?? ENCRE} strokeWidth={p.w ?? 4} fill="none"
                strokeLinecap="round" style={strokeDraw(p.len, d, 0)} />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default WhiteboardTest;
