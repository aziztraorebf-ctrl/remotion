/**
 * TwoFaceTokenTest — proto ISOLÉ (pas de Mapbox) pour valider l'arc du jeton 2-visages :
 *   convergence des 2 jetons -> fusion -> faille qui se fend -> séparation en 2 jetons.
 * Fond parchemin sombre approximant la carte AES. Render rapide (pas de reskin Mapbox).
 *
 * Compo Root: TwoFaceTokenTest (300 frames @30 = 10s).
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile, Easing, useCurrentFrame } from "remotion";
import { TwoFaceToken } from "./TwoFaceToken";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const RSF = "#B14B3C";
const SAF = "#3E6E9E";
const CREAM = "#F2E5C8";

// phases (frames @30) — mêmes proportions que ce qu'on aura dans l'Acte 2
const CONVERGE = 20;   // les 2 jetons commencent à se rapprocher
const MERGE = 70;      // fusion soudée
const FEND = 150;      // la faille se fend + vibre
const SPLIT = 220;     // les 2 moitiés s'écartent

const CENTER = { x: 960, y: 540 };
const START_L = 620;   // x de départ jeton gauche (Hemedti)
const START_R = 1300;  // x de départ jeton droit (al-Burhan)

// jeton rond simple (pré-fusion / post-split) — même look que TokenBase Acte 1
const SoloToken: React.FC<{ x: number; y: number; sprite: string; border: string; op: number; D?: number }> =
  ({ x, y, sprite, border, op, D = 118 }) => (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: op, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: "68%", width: D * 0.9, height: D * 0.24,
        transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(7px)" }} />
      <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: CREAM,
        border: `${D * 0.05}px solid ${border}`, boxSizing: "border-box",
        boxShadow: "0 5px 14px rgba(0,0,0,0.5)" }}>
        <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
          style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
            transform: "translate(-8%, 2%)", display: "block" }} />
      </div>
    </div>
  );

export const TwoFaceTokenTest: React.FC = () => {
  const frame = useCurrentFrame();

  // convergence : les 2 solos glissent de START -> CENTER, puis disparaissent quand la fusion prend le relais
  const conv = interpolate(frame, [CONVERGE, MERGE], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lx = interpolate(conv, [0, 1], [START_L, CENTER.x - 30]);
  const rx = interpolate(conv, [0, 1], [START_R, CENTER.x + 30]);
  // les solos s'effacent juste avant que la fusion soit soudée (cross-fade vers TwoFaceToken)
  const soloOp = interpolate(frame, [MERGE - 16, MERGE - 2], [1, 0], clamp);
  const mergedOp = interpolate(frame, [MERGE - 10, MERGE + 2], [0, 1], clamp);

  const splitGap = 200;

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #2A2416 0%, #14110A 100%)" }}>
      {/* --- pré-fusion : 2 jetons qui convergent --- */}
      {soloOp > 0.01 && (
        <>
          <SoloToken x={lx} y={CENTER.y} sprite="portrait-hemeti" border={RSF} op={soloOp} />
          <SoloToken x={rx} y={CENTER.y} sprite="portrait-burhan" border={SAF} op={soloOp} />
        </>
      )}

      {/* --- le jeton 2-visages gère TOUT l'arc lui-même : fusion -> fend -> split (reconstitution) --- */}
      {mergedOp > 0.01 && (
        <div style={{ opacity: mergedOp }}>
          <TwoFaceToken pos={CENTER} frame={frame} mergeAt={MERGE} fendAt={FEND} splitAt={SPLIT}
            splitGap={splitGap} D={118} appearFrom={MERGE - 4} />
        </div>
      )}

      {/* repère phase (debug, retiré en prod) */}
      <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
        color: "#8A7A50", fontFamily: "monospace", fontSize: 18 }}>
        {frame < MERGE ? "CONVERGE" : frame < FEND ? "MERGE" : frame < SPLIT ? "FEND" : "SPLIT"} · f{frame}
      </div>
    </AbsoluteFill>
  );
};

export default TwoFaceTokenTest;
