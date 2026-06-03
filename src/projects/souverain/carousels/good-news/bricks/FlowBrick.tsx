import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GN } from "../theme";
import type { LucideIcon } from "lucide-react";

/**
 * FlowBrick — brique animée "chaîne d'impact" pour une slide MACRO.
 * Source africaine → cible mondiale, reliées par un flux animé.
 *
 * Icônes = Lucide line-art monochrome (PAS d'emoji — cohérence éditoriale premium).
 * Particules dorées circulant EN CONTINU (anti-boucle-morte).
 * `layout` : horizontal | diagonal | vertical.
 */

export interface FlowBrickProps {
  sourceLabel: string;
  SourceIcon: LucideIcon;
  targetLabel: string;
  TargetIcon: LucideIcon;
  layout?: "horizontal" | "diagonal" | "vertical";
}

const NODE_R = 112;
const W = 1080;
const H = 520;

function Node({
  x,
  y,
  Icon,
  label,
  color,
  appear,
}: {
  x: number;
  y: number;
  Icon: LucideIcon;
  label: string;
  color: string;
  appear: number;
}) {
  const ICON = 86;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${appear})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: NODE_R * 2,
          height: NODE_R * 2,
          borderRadius: "50%",
          backgroundColor: "#fff",
          border: `4px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 18px rgba(22,33,58,0.10)",
        }}
      >
        <Icon size={ICON} color={color} strokeWidth={1.6} absoluteStrokeWidth />
      </div>
      <span
        style={{
          marginTop: 18,
          fontFamily: "Georgia, serif",
          fontSize: 38,
          fontWeight: 700,
          color: GN.ink,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export const FlowBrick: React.FC<FlowBrickProps> = ({
  sourceLabel,
  SourceIcon,
  targetLabel,
  TargetIcon,
  layout = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pos = {
    horizontal: { src: [260, H / 2 - 30], tgt: [W - 260, H / 2 - 30] },
    diagonal: { src: [280, H - 240], tgt: [W - 280, 130] },
    vertical: { src: [W / 2, H - 200], tgt: [W / 2, 150] },
  }[layout];
  const [sx, sy] = pos.src;
  const [tx, ty] = pos.tgt;

  const nodeIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const targetIn = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 30 });

  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const ax = sx + ux * NODE_R;
  const ay = sy + uy * NODE_R;
  const bx = tx - ux * NODE_R;
  const by = ty - uy * NODE_R;

  const drawn = interpolate(frame, [24, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = ax + (bx - ax) * drawn;
  const cy = ay + (by - ay) * drawn;

  // Particules dorées circulant EN CONTINU (boucle infinie, anti-temps-mort)
  const particles = [0, 0.25, 0.5, 0.75].map((phase) => {
    const t = (frame / 75 + phase) % 1;
    return {
      px: ax + (bx - ax) * t,
      py: ay + (by - ay) * t,
      // fade aux extrémités pour un mouvement doux
      op: drawn >= 1 ? Math.sin(t * Math.PI) * 0.9 : 0,
    };
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: W, height: H }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {/* trait qui se dessine */}
          <line x1={ax} y1={ay} x2={cx} y2={cy} stroke={GN.gold} strokeWidth={6} strokeLinecap="round" opacity={0.45} />
          {/* particules dorées continues */}
          {particles.map((p, i) => (
            <circle key={i} cx={p.px} cy={p.py} r={12} fill={GN.goldDeep} opacity={p.op} />
          ))}
        </svg>
        <Node x={sx} y={sy} Icon={SourceIcon} label={sourceLabel} color={GN.goldDeep} appear={nodeIn} />
        <Node x={tx} y={ty} Icon={TargetIcon} label={targetLabel} color={GN.sky} appear={targetIn} />
      </div>
    </AbsoluteFill>
  );
};
