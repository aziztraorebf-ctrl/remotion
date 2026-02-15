import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONTS } from "../config/theme";

interface DataRow {
  label: string;
  value: string;
}

interface DataSection {
  title: string;
  rows: DataRow[];
}

interface TerminalDataPanelProps {
  startFrame: number;
  width?: number;
}

const PANEL_DATA: DataSection[] = [
  {
    title: "/// SITUATION ///",
    rows: [
      { label: "ANNEE", value: "1347" },
      { label: "ZONE", value: "EUROPA OCCIDENTALIS" },
      { label: "PATHOGENE", value: "YERSINIA PESTIS" },
      { label: "VECTEUR", value: "RATTUS / PULEX" },
      { label: "MODE", value: "BUBONIQUE" },
    ],
  },
  {
    title: "/// STATISTIQUES ///",
    rows: [
      { label: "POP. INITIALE", value: "75 000 000" },
      { label: "DECES ESTIMES", value: "25-35 MILLIONS" },
      { label: "TAUX MORTALITE", value: "30-50%" },
      { label: "DUREE", value: "1347-1353" },
    ],
  },
  {
    title: "/// REACTIONS ///",
    rows: [
      { label: "FLAGELLANTS", value: "10 000+" },
      { label: "MARCHE", value: "33.5 JOURS" },
      { label: "POGROMS", value: "300+" },
      { label: "FUITE MEDECINS", value: "CONFIRMEE" },
    ],
  },
];

const DataRowComponent: React.FC<{
  label: string;
  value: string;
  appearFrame: number;
}> = ({ label, value, appearFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < appearFrame) return null;

  const slideIn = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  // Typewriter on value
  const elapsed = frame - appearFrame;
  const charsVisible = Math.min(
    value.length,
    Math.floor(elapsed * 0.6)
  );
  const displayValue = value.slice(0, charsVisible);
  const isTyping = charsVisible < value.length && charsVisible > 0;
  const cursorOn = isTyping && Math.floor(frame / 12) % 2 === 0;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "3px 0",
        transform: `translateX(${(1 - slideIn) * -20}px)`,
        opacity: slideIn,
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.body,
          fontSize: 17,
          color: COLORS.terminalGreenDim,
          whiteSpace: "nowrap",
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONTS.body,
          fontSize: 17,
          color: COLORS.terminalGreen,
          textAlign: "right",
          whiteSpace: "nowrap",
          letterSpacing: 1,
          textShadow: "0 0 6px rgba(0,255,65,0.3)",
        }}
      >
        {displayValue}
        {cursorOn && (
          <span style={{ color: COLORS.terminalGreen }}>_</span>
        )}
      </span>
    </div>
  );
};

export const TerminalDataPanel: React.FC<TerminalDataPanelProps> = ({
  startFrame,
  width = 480,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel container fade in
  const panelOpacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < startFrame) return null;

  // Calculate cumulative frame offsets for each section and row
  let globalRowIndex = 0;

  return (
    <div
      style={{
        width,
        padding: "16px 20px",
        backgroundColor: COLORS.panelBg,
        border: `1px solid ${COLORS.panelBorder}`,
        opacity: panelOpacity,
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          fontFamily: FONTS.title,
          fontSize: 11,
          color: COLORS.terminalGreen,
          letterSpacing: 2,
          marginBottom: 12,
          textShadow: "0 0 8px rgba(0,255,65,0.4)",
          borderBottom: `1px solid ${COLORS.panelBorder}`,
          paddingBottom: 8,
        }}
      >
        [TERMINAL] PESTE ANALYSIS v1.347
      </div>

      {PANEL_DATA.map((section, sectionIndex) => {
        const sectionStartFrame =
          startFrame + 10 + sectionIndex * 45;

        const sectionSpring =
          frame >= sectionStartFrame
            ? spring({
                frame: frame - sectionStartFrame,
                fps,
                config: { mass: 0.6, damping: 12, stiffness: 180 },
              })
            : 0;

        return (
          <div key={sectionIndex} style={{ marginBottom: 14 }}>
            {/* Section title */}
            <div
              style={{
                fontFamily: FONTS.title,
                fontSize: 10,
                color: COLORS.terminalGreen,
                letterSpacing: 2,
                marginBottom: 6,
                opacity: sectionSpring,
                transform: `scaleX(${sectionSpring})`,
                transformOrigin: "left",
              }}
            >
              {section.title}
            </div>

            {/* Section separator line */}
            <div
              style={{
                height: 1,
                background: `linear-gradient(to right, ${COLORS.terminalGreen}40, transparent)`,
                marginBottom: 6,
                opacity: sectionSpring,
                transform: `scaleX(${sectionSpring})`,
                transformOrigin: "left",
              }}
            />

            {/* Section rows */}
            {section.rows.map((row, rowIndex) => {
              const rowFrame =
                sectionStartFrame + 8 + rowIndex * 10;
              globalRowIndex++;
              return (
                <DataRowComponent
                  key={`${sectionIndex}-${rowIndex}`}
                  label={row.label}
                  value={row.value}
                  appearFrame={rowFrame}
                />
              );
            })}
          </div>
        );
      })}

      {/* Blinking status line at bottom */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 15,
          color: COLORS.terminalGreen,
          marginTop: 8,
          opacity:
            Math.floor(frame / 20) % 2 === 0
              ? panelOpacity * 0.8
              : panelOpacity * 0.3,
        }}
      >
        {"> SYSTEM MONITORING ACTIVE..."}
      </div>
    </div>
  );
};
