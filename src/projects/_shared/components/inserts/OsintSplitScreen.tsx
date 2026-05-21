/**
 * OsintSplitScreen — split screen investigation OSINT (Africa Eye + NYT Visual Investigations)
 *
 * Pattern : 2 paneaux cote a cote (ou stackes verticalement).
 * Gauche : footage UGC / image satellite brute — label "SOURCE NON VERIFIEE"
 * Droite : image analysee / annotee — label "ANALYSE OSINT"
 *
 * Animations :
 * - Les 2 paneaux slidein depuis les bords
 * - Labels apparaissent avec spring
 * - Annotations optionnelles (cercle + legende)
 * - Barre centrale etiquette avec le verdict
 *
 * Layout :
 *   "split"   — cote a cote 50/50 (format paysage adapt)
 *   "stacked" — vertical 50/50 (format 9:16 TikTok)
 *   "reveal"  — panneau droit cache jusqu'a revelation
 *
 * Usage :
 *   <OsintSplitScreen
 *     leftPanel={<Img src={staticFile("...")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
 *     rightPanel={<Img src={staticFile("...")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
 *     leftLabel="SOURCE NON VÉRIFIÉE"
 *     rightLabel="ANALYSE OSINT CONFIRMÉE"
 *     verdict="AUTHENTIQUE"
 *     verdictColor="#00aa55"
 *     annotations={[{ x: 45, y: 30, label: "Mine Arlit" }]}
 *   />
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type OsintLayout = "split" | "stacked" | "reveal";
export type OsintVerdict = "AUTHENTIQUE" | "CONTESTÉ" | "RÉFUTÉ" | string;

interface Annotation {
  x: number;
  y: number;
  label: string;
}

interface OsintSplitScreenProps {
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
  verdict?: OsintVerdict;
  verdictColor?: string;
  annotations?: Annotation[];
  layout?: OsintLayout;
  revealFrame?: number;
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
  fontSize: 28,
  letterSpacing: "0.2em",
  padding: "8px 20px 6px 20px",
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 10,
};

export const OsintSplitScreen: React.FC<OsintSplitScreenProps> = ({
  leftPanel,
  rightPanel,
  leftLabel = "SOURCE NON VÉRIFIÉE",
  rightLabel = "ANALYSE OSINT",
  verdict,
  verdictColor = "#f5d547",
  annotations = [],
  layout = "stacked",
  revealFrame = 45,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({ frame, fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 35 });
  const rightSlide = spring({ frame: frame - 8, fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 35 });
  const labelProgress = spring({ frame: frame - 20, fps, config: { damping: 150, stiffness: 100 }, durationInFrames: 25 });
  const verdictProgress = spring({ frame: frame - 50, fps, config: { damping: 80, stiffness: 60 }, durationInFrames: 30 });
  const revealProgress = spring({ frame: frame - revealFrame, fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 30 });

  const leftX = interpolate(leftSlide, [0, 1], [-540, 0]);
  const rightX = interpolate(rightSlide, [0, 1], [540, 0]);
  const rightRevealOpacity = layout === "reveal" ? revealProgress : 1;

  const panelStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    background: "#111",
  };

  const leftPanelStyle: React.CSSProperties =
    layout === "stacked"
      ? { ...panelStyle, width: 1080, height: 960, transform: `translateY(${interpolate(leftSlide, [0,1], [-960, 0])}px)` }
      : { ...panelStyle, width: 540, height: 1920, transform: `translateX(${leftX}px)` };

  const rightPanelStyle: React.CSSProperties =
    layout === "stacked"
      ? { ...panelStyle, width: 1080, height: 960, transform: `translateY(${interpolate(rightSlide, [0,1], [960, 0])}px)`, opacity: rightRevealOpacity }
      : { ...panelStyle, width: 540, height: 1920, transform: `translateX(${rightX}px)`, opacity: rightRevealOpacity };

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", flexDirection: layout === "stacked" ? "column" : "row" }}>
      {/* Panneau gauche */}
      <div style={leftPanelStyle}>
        <div style={{ width: "100%", height: "100%" }}>{leftPanel}</div>
        <div
          style={{
            ...LABEL_STYLE,
            background: "rgba(200,50,30,0.85)",
            color: "#fff",
            opacity: labelProgress,
          }}
        >
          {leftLabel}
        </div>
      </div>

      {/* Separateur / barre centrale */}
      {layout !== "stacked" && (
        <div
          style={{
            width: 4,
            height: 1920,
            background: verdictColor,
            flexShrink: 0,
            opacity: labelProgress,
          }}
        />
      )}
      {layout === "stacked" && (
        <div
          style={{
            width: 1080,
            height: 4,
            background: verdictColor,
            flexShrink: 0,
            opacity: labelProgress,
          }}
        />
      )}

      {/* Panneau droit */}
      <div style={rightPanelStyle}>
        <div style={{ width: "100%", height: "100%" }}>{rightPanel}</div>
        <div
          style={{
            ...LABEL_STYLE,
            background: "rgba(0,140,70,0.85)",
            color: "#fff",
            opacity: labelProgress,
          }}
        >
          {rightLabel}
        </div>

        {annotations.map((ann, i) => {
          const annProgress = spring({ frame: frame - 40 - i * 8, fps, config: { damping: 120, stiffness: 80 }, durationInFrames: 20 });
          const panelW = layout === "stacked" ? 1080 : 540;
          const panelH = layout === "stacked" ? 960 : 1920;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (ann.x / 100) * panelW,
                top: (ann.y / 100) * panelH,
                zIndex: 20,
                opacity: annProgress,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `3px solid ${verdictColor}`,
                  position: "absolute",
                  top: -18,
                  left: -18,
                  transform: `scale(${interpolate(annProgress, [0, 1], [0.3, 1])})`,
                }}
              />
              <div
                style={{
                  background: "rgba(0,0,0,0.8)",
                  color: verdictColor,
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  fontSize: 22,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                  marginLeft: 24,
                  marginTop: -8,
                  letterSpacing: "0.1em",
                }}
              >
                {ann.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verdict central */}
      {verdict && (
        <div
          style={{
            position: "absolute",
            top: layout === "stacked" ? 960 - 36 : "50%",
            left: layout === "stacked" ? "50%" : "50%",
            transform: layout === "stacked"
              ? `translateX(-50%) translateY(-50%) scale(${interpolate(verdictProgress, [0,1], [0.6, 1])})`
              : `translate(-50%, -50%) scale(${interpolate(verdictProgress, [0,1], [0.6, 1])})`,
            background: verdictColor,
            color: "#0a0a0a",
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 36,
            letterSpacing: "0.2em",
            padding: "12px 32px 10px 32px",
            zIndex: 30,
            opacity: verdictProgress,
          }}
        >
          {verdict}
        </div>
      )}
    </AbsoluteFill>
  );
};
