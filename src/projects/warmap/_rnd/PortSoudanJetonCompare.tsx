/**
 * PROTO — comparaison des 2 propositions de jeton Port-Soudan (session 10, 2026-07-12), pour validation
 * Aziz avant intégration dans SoudanActe4.tsx. PAS un livrable — dossier _rnd/.
 * Séquence : 0-90f carte vide zoom Port-Soudan -> 90-180f jeton NAVALE (iso/topdown) apparaît ->
 * 180-210f transition -> 210-330f jeton CARTOUCHE (ancre stylisée) apparaît.
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, Sequence } from "remotion";
import { SoudanWarMapEngine, CamKey } from "../engine/SoudanWarMapEngine";

export const PORT_SOUDAN_COMPARE_FRAMES = 330;
export const PORT_SOUDAN_COMPARE_FPS = 30;

const PORT_SOUDAN: [number, number] = [37.22, 19.62];
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const CAM: CamKey[] = [
  { f: 0, lon: PORT_SOUDAN[0], lat: PORT_SOUDAN[1], zoom: 6.8 },
  { f: PORT_SOUDAN_COMPARE_FRAMES, lon: PORT_SOUDAN[0], lat: PORT_SOUDAN[1], zoom: 6.8 },
];

export const PortSoudanJetonCompare: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <SoudanWarMapEngine camKeys={CAM} zones={[]} showNationalBorder stateLineOpacity={0}>
        {(proj) => {
          const p = proj(PORT_SOUDAN);
          if (!p) return null;

          // Version 1 — NAVALE iso/topdown, visible 90-200f
          const navaleOp = interpolate(frame, [90, 110, 195, 210], [0, 1, 1, 0], clamp);
          // Version 2 — CARTOUCHE, visible 220-330f
          const cartoucheOp = interpolate(frame, [220, 240], [0, 1], clamp);

          return (
            <>
              {navaleOp > 0.01 && (
                <div style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-60%)", opacity: navaleOp, pointerEvents: "none" }}>
                  <img src={staticFile("_shared/sprites/warmap/port-soudan-navale-td.png")}
                    style={{ width: 210, height: 210, objectFit: "contain",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }} />
                </div>
              )}
              {cartoucheOp > 0.01 && (
                <div style={{ position: "absolute", left: p.x, top: p.y - 90, transform: "translate(-50%,-50%)", opacity: cartoucheOp, pointerEvents: "none" }}>
                  <img src={staticFile("_shared/sprites/warmap/port-soudan-cartouche.png")}
                    style={{ width: 220, height: 110, objectFit: "contain",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }} />
                </div>
              )}
              {/* repère point fixe pour situer Port-Soudan sur la carte, dans les 2 versions */}
              <div style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-50%)",
                width: 10, height: 10, borderRadius: "50%", background: "#8A5A3A", border: "2px solid #F2E5C8" }} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* labels de comparaison, texte simple pour se repérer pendant la review */}
      <Sequence from={90} durationInFrames={120}>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", color: "#F2E5C8", fontSize: 32, fontFamily: "Georgia, serif", textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>
          Option 1 — Base navale iso/topdown
        </div>
      </Sequence>
      <Sequence from={220} durationInFrames={110}>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", color: "#F2E5C8", fontSize: 32, fontFamily: "Georgia, serif", textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>
          Option 2 — Cartouche ancre stylisée
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

export default PortSoudanJetonCompare;
