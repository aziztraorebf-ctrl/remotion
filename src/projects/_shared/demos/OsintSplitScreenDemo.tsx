/**
 * OsintSplitScreen Demo — 3 phases pour review jury
 *
 * Phase A (f0-120)   — layout "stacked" avec 2 images placeholder
 * Phase B (f120-240) — layout "split" cote a cote
 * Phase C (f240-360) — layout "reveal" avec annotation et verdict
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OsintSplitScreen } from "../components/inserts/OsintSplitScreen";

const PHASE_DUR = 120;
const FADE = 12;
export const OSINT_DEMO_FRAMES = PHASE_DUR * 3;

const phaseOpacity = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, start + FADE, end - FADE, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const PlaceholderLeft: React.FC<{ label?: string }> = ({ label = "MINE ARLIT — IMAGE SATELLITE" }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #1a1209 0%, #3d2210 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      fontSize: 28,
      color: "rgba(255,255,255,0.3)",
      letterSpacing: "0.15em",
      textAlign: "center",
      padding: "0 20px",
    }}
  >
    {label}
  </div>
);

const PlaceholderRight: React.FC<{ label?: string }> = ({ label = "ANALYSE OSINT — IMAGE ANNOTEE" }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #0a2010 0%, #1a4020 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      fontSize: 28,
      color: "rgba(255,255,255,0.3)",
      letterSpacing: "0.15em",
      textAlign: "center",
      padding: "0 20px",
    }}
  >
    {label}
  </div>
);

export const OsintSplitScreenDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const phases = Array.from({ length: 3 }, (_, i) => ({
    start: PHASE_DUR * i,
    end: PHASE_DUR * (i + 1),
  }));

  const lf = (i: number) => Math.max(0, frame - phases[i].start);

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>

      {/* Phase A — stacked */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[0].start, phases[0].end) }}>
        <OsintSplitScreen
          layout="stacked"
          leftPanel={<PlaceholderLeft label="VUE SATELLITE BRUTE — MINE ARLIT, NIGER" />}
          rightPanel={<PlaceholderRight label="ANALYSE OSINT — BASSINS EVAPORATION VISIBLES" />}
          leftLabel="SOURCE NON VERIFIEE"
          rightLabel="ANALYSE OSINT"
          verdict="AUTHENTIQUE"
          verdictColor="#f5d547"
          key={`a-${lf(0)}`}
        />
      </AbsoluteFill>

      {/* Phase B — split cote a cote */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[1].start, phases[1].end) }}>
        <OsintSplitScreen
          layout="split"
          leftPanel={<PlaceholderLeft label="FOOTAGE UGC — MANIFESTANTS NIAMEY" />}
          rightPanel={<PlaceholderRight label="VERIFICATION GEOLOCALISATION OSINT" />}
          leftLabel="NON VERIFIE"
          rightLabel="CONFIRME"
          verdict="CONFIRME"
          verdictColor="#00aa55"
          key={`b-${lf(1)}`}
        />
      </AbsoluteFill>

      {/* Phase C — reveal avec annotation */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[2].start, phases[2].end) }}>
        <OsintSplitScreen
          layout="reveal"
          revealFrame={45}
          leftPanel={<PlaceholderLeft label="DOCUMENT ORIGINAL — CONTRAT AREVA 1974" />}
          rightPanel={<PlaceholderRight label="VERSION EXPURGEE — CLAUSES RETIREES" />}
          leftLabel="ARCHIVE BRUTE"
          rightLabel="VERSION OFFICIELLE"
          verdict="CONTESTE"
          verdictColor="#c8972b"
          annotations={[
            { x: 30, y: 35, label: "Clause royalties 5%" },
            { x: 65, y: 55, label: "Article retire" },
          ]}
          key={`c-${lf(2)}`}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
