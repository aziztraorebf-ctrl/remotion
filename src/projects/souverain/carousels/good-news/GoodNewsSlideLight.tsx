import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { GN } from "./theme";
import { GaugeBrick } from "./bricks/GaugeBrick";
import { FlowBrick } from "./bricks/FlowBrick";
import { BarsBrick } from "./bricks/BarsBrick";
import { GrainOverlay } from "./GrainOverlay";
import {
  Factory,
  Plane,
  Zap,
  Server,
  Droplets,
  Wind,
  Leaf,
  Cpu,
  Globe,
  type LucideIcon,
} from "lucide-react";

/** Map nom (string, passable en defaultProps) → composant Lucide line-art. */
const ICONS: Record<string, LucideIcon> = {
  factory: Factory,
  plane: Plane,
  zap: Zap,
  server: Server,
  droplets: Droplets,
  wind: Wind,
  leaf: Leaf,
  cpu: Cpu,
  globe: Globe,
};

/**
 * GoodNewsSlideLight — slide carrousel Good News sur charte LUMINEUSE.
 * Fond ivoire respirant + halo doré. Une "brique" animée occupe le haut,
 * le texte premium (navy) occupe le bas (safe-zone 250px).
 *
 * `brick` : gauge | flow | bars | none (hook/cta).
 * `mode`  : fact (défaut) | hook | cta — change la disposition du texte.
 * Format 1080x1350 (4:5).
 */

type BrickKind = "gauge" | "flow" | "bars" | "none";
type SlideMode = "fact" | "hook" | "cta";

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            backgroundColor: i <= current ? GN.gold : "rgba(200,169,81,0.30)",
          }}
        />
      ))}
    </div>
  );
}

export interface GoodNewsSlideLightProps {
  brick?: BrickKind;
  mode?: SlideMode;
  slideIndex: number;
  totalSlides: number;
  kicker?: string;
  kickerMacro?: boolean;
  body: string;
  subtitle?: string;
  // gauge
  gaugeValue?: number;
  gaugeSuffix?: string;
  gaugeLabel?: string;
  // flow
  flowSourceLabel?: string;
  flowSourceIcon?: string; // clé ICONS (ex "factory")
  flowTargetLabel?: string;
  flowTargetIcon?: string;
  flowLayout?: "horizontal" | "diagonal" | "vertical";
  // bars
  barsChallengerName?: string;
  barsChallengerValue?: number;
  barsLeaderName?: string;
  barsLeaderValue?: number;
}

export const GoodNewsSlideLight: React.FC<GoodNewsSlideLightProps> = ({
  brick = "none",
  mode = "fact",
  slideIndex,
  totalSlides,
  kicker,
  kickerMacro = false,
  body,
  subtitle,
  gaugeValue = 90,
  gaugeSuffix = "%",
  gaugeLabel,
  flowSourceLabel = "",
  flowSourceIcon = "zap",
  flowTargetLabel = "",
  flowTargetIcon = "globe",
  flowLayout = "horizontal",
  barsChallengerName = "",
  barsChallengerValue = 0,
  barsLeaderName = "",
  barsLeaderValue = 0,
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const isCentered = mode === "hook" || mode === "cta";

  // Typewriter partagé (hook titre + cta ligne 1)
  const TYPE_START = 12;
  const FPC = 1.5;
  const typed = (txt: string) => {
    const n = Math.max(0, Math.floor((frame - TYPE_START) / FPC));
    return { text: txt.slice(0, Math.min(n, txt.length)), done: n >= txt.length, end: TYPE_START + txt.length * FPC };
  };
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${GN.bgTop} 0%, ${GN.bgBottom} 100%)` }}>
      {/* halo doré chaleureux */}
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% ${isCentered ? 50 : 34}%, ${GN.bgWarmGlow} 0%, rgba(200,169,81,0) 58%)` }}
      />
      {/* grain papier magazine (premium) */}
      <GrainOverlay opacity={0.05} />

      {/* Header K&C + barres */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GN.goldDeep, letterSpacing: 4, fontWeight: 700 }}>
            K&amp;C
          </span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
      </div>

      {/* Brique animée — centrée dans l'espace entre header et texte (réduit le vide) */}
      {mode === "fact" && (
        <div style={{ position: "absolute", top: 130, left: 0, right: 0, bottom: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {brick === "gauge" && <GaugeBrick value={gaugeValue} suffix={gaugeSuffix} label={gaugeLabel} />}
          {brick === "flow" && (
            <FlowBrick
              sourceLabel={flowSourceLabel}
              SourceIcon={ICONS[flowSourceIcon] ?? Zap}
              targetLabel={flowTargetLabel}
              TargetIcon={ICONS[flowTargetIcon] ?? Globe}
              layout={flowLayout}
            />
          )}
          {brick === "bars" && (
            <BarsBrick
              challengerName={barsChallengerName}
              challengerValue={barsChallengerValue}
              leaderName={barsLeaderName}
              leaderValue={barsLeaderValue}
            />
          )}
        </div>
      )}

      {/* Bloc texte */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: isCentered ? "center" : "flex-end",
          alignItems: isCentered ? "center" : "stretch",
          textAlign: isCentered ? "center" : "left",
          padding: isCentered ? "0 80px" : "0 64px 275px",
          opacity: textOpacity,
        }}
      >
        {mode === "hook" && (() => {
          const t = typed(body);
          const subOp = interpolate(frame, [t.end + 6, t.end + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <>
              {/* Graphisme haut : globe stylisé avec 3 points d'impact (Afrique → monde) */}
              <GlobeBadge frame={frame} />
              <div style={{ width: 60, height: 3, backgroundColor: GN.gold, borderRadius: 2, margin: "44px 0 28px" }} />
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: 70, fontWeight: 700, color: GN.ink, lineHeight: 1.18, margin: "0 0 24px", minHeight: 260 }}>
                {t.text}
                <span style={{ opacity: !t.done && cursorOn ? 1 : 0, color: GN.gold, fontWeight: 400 }}>|</span>
              </h1>
              {subtitle && (
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 40, lineHeight: 1.3, color: GN.goldDeep, margin: 0, opacity: subOp }}>
                  {subtitle}
                </p>
              )}
            </>
          );
        })()}

        {mode === "cta" && (() => {
          const t = typed(body);
          const pulse = 1 + 0.07 * Math.sin((frame / 14) * Math.PI * 2);
          const subOp = interpolate(frame, [t.end + 6, t.end + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const subY = interpolate(frame, [t.end + 6, t.end + 24], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <>
              {/* Bouton play pulsant, plus grand + halo */}
              <div style={{ position: "relative", marginBottom: 52, transform: `scale(${pulse})` }}>
                <div style={{ position: "absolute", inset: -22, borderRadius: "50%", backgroundColor: GN.gold, opacity: 0.12 }} />
                <div style={{ width: 150, height: 150, borderRadius: "50%", border: `4px solid ${GN.goldDeep}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 0, height: 0, borderTop: "32px solid transparent", borderBottom: "32px solid transparent", borderLeft: `52px solid ${GN.goldDeep}`, marginLeft: 12 }} />
                </div>
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 60, lineHeight: 1.28, fontWeight: 700, color: GN.ink, textAlign: "center", margin: "0 0 28px", minHeight: 180 }}>
                {t.text}
                <span style={{ opacity: !t.done && cursorOn ? 1 : 0, color: GN.gold, fontWeight: 400 }}>|</span>
              </h2>
              {subtitle && (
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 40, color: GN.goldDeep, margin: 0, textAlign: "center", opacity: subOp, transform: `translateY(${subY}px)` }}>{subtitle}</p>
              )}
            </>
          );
        })()}

        {mode === "fact" && (
          <>
            {kicker && (
              <span
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: GN.goldDeep,
                  textTransform: "uppercase",
                  marginBottom: 22,
                  padding: "8px 16px",
                  border: `1px solid ${kickerMacro ? "rgba(63,114,176,0.5)" : "rgba(168,133,47,0.5)"}`,
                  borderLeft: `4px solid ${kickerMacro ? GN.sky : GN.goldDeep}`,
                  backgroundColor: kickerMacro ? "rgba(63,114,176,0.06)" : "rgba(200,169,81,0.08)",
                  borderRadius: 2,
                }}
              >
                {kicker}
              </span>
            )}
            <p style={{ fontFamily: "Georgia, serif", fontSize: 50, lineHeight: 1.42, fontWeight: 500, color: GN.ink, margin: 0 }}>{body}</p>
          </>
        )}
      </AbsoluteFill>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 36px", textAlign: "center" }}>
        <span style={{ color: GN.goldDeep, fontSize: 20, letterSpacing: 3, opacity: 0.8 }}>@koraetcartes</span>
      </div>
    </AbsoluteFill>
  );
};

/** Globe doré stylisé : cercle + méridiens + 3 points d'impact qui s'allument (Afrique rayonne vers le monde). */
const GlobeBadge: React.FC<{ frame: number }> = ({ frame }) => {
  const R = 96;
  const appear = interpolate(frame, [2, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dots = [0, 1, 2].map((i) => interpolate(frame, [20 + i * 10, 34 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <svg width={R * 2 + 20} height={R * 2 + 20} style={{ opacity: appear }}>
      <g transform={`translate(${R + 10}, ${R + 10})`}>
        <circle r={R} fill="none" stroke={GN.goldDeep} strokeWidth={3} />
        <ellipse rx={R} ry={R * 0.42} fill="none" stroke={GN.goldDeep} strokeWidth={1.5} opacity={0.5} />
        <ellipse rx={R * 0.42} ry={R} fill="none" stroke={GN.goldDeep} strokeWidth={1.5} opacity={0.5} />
        <line x1={-R} y1={0} x2={R} y2={0} stroke={GN.goldDeep} strokeWidth={1.5} opacity={0.5} />
        {/* 3 points d'impact qui s'allument */}
        {[[-30, -40], [38, -10], [10, 46]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill={GN.gold} opacity={dots[i]} />
        ))}
      </g>
    </svg>
  );
};
