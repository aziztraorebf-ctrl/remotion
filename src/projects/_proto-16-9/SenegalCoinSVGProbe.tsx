/**
 * SenegalCoinSVGProbe — DEMO MALLEABILITE de la Face A SVG (preuve du pouvoir vectoriel).
 * Enchaine 4 transformations sur la MEME piece, calees dans le temps, avec un label de phase :
 *   Phase 1 (0-3s)   : repos vivant (ocean respire + derrick pompe + navire charge puis fade)
 *   Phase 2 (3-5.5s) : OCEAN QUI NOIRCIT (or -> petrole)
 *   Phase 3 (5.5-8s) : DERRICK ROUGEOIE + PULSE (extraction active)
 *   Phase 4 (8-11s)  : PIECE QUI S'OXYDE (desature + assombrit tout)
 * 11s = 330f. But : montrer qu'un SVG genere se re-colore/transforme a la frame, ce qu'un bitmap interdit.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SenegalCoinFaceA_SVG } from "./SenegalCoinFaceA_SVG";

const NAVY = "#16213a", NAVY_DEEP = "#0d1424", IVORY = "#f2ebd9";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const PHASES = [
  { t: 30, label: "1 — VIVANT (ocean + derrick + navire)" },
  { t: 110, label: "2 — OCEAN QUI NOIRCIT (petrole)" },
  { t: 195, label: "3 — DERRICK ROUGEOIE + PULSE" },
  { t: 270, label: "4 — LA PIECE S'OXYDE" },
];

export const SenegalCoinSVGProbe: React.FC = () => {
  const frame = useCurrentFrame();
  const diam = 920;
  // phase 1 : geste navire (charge -> fade) sur 0-90
  const sail = interpolate(frame, [30, 90], [0, 1], clamp);
  // phase 2 : ocean noircit 110-180
  const oil = interpolate(frame, [110, 185], [0, 1], clamp);
  // phase 3 : derrick chauffe 195-260
  const heat = interpolate(frame, [195, 250], [0, 1], clamp);
  // phase 4 : oxydation 270-325
  const ox = interpolate(frame, [270, 325], [0, 1], clamp);

  const curLabel = [...PHASES].reverse().find((p) => frame >= p.t)?.label ?? PHASES[0].label;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #1d2a47, ${NAVY} 50%, ${NAVY_DEEP})` }}>
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(rgba(130,165,225,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(130,165,225,0.14) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }} />
      <div style={{ position: "absolute", left: "50%", top: "47%", width: diam, height: diam, transform: "translate(-50%,-50%)",
        filter: "drop-shadow(0 20px 34px rgba(0,0,0,0.5))" }}>
        <SenegalCoinFaceA_SVG sailProgress={sail} pumpActive={1} oilSpread={oil} derrickHeat={heat} oxidize={ox} />
      </div>
      {/* label de phase (pour la demo seulement) */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 30, letterSpacing: "0.12em", color: IVORY, opacity: 0.85, textShadow: "0 2px 10px #000" }}>
        {curLabel}
      </div>
    </AbsoluteFill>
  );
};

export default SenegalCoinSVGProbe;
